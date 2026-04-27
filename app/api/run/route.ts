import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import { promisify } from "util";

const execAsync = promisify(exec);
const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);

// Language to Piston runtime mapping (used when online)
const PISTON_MAP: Record<string, { language: string; version: string }> = {
    javascript: { language: "javascript", version: "18.15.0" },
    typescript: { language: "typescript", version: "5.0.3" },
    python: { language: "python", version: "3.10.0" },
    java: { language: "java", version: "15.0.2" },
    c: { language: "c", version: "10.2.0" },
    cpp: { language: "c++", version: "10.2.0" },
    "c++": { language: "c++", version: "10.2.0" },
    csharp: { language: "csharp.net", version: "5.0.201" },
    go: { language: "go", version: "1.16.2" },
    rust: { language: "rust", version: "1.68.2" },
    ruby: { language: "ruby", version: "3.0.1" },
    php: { language: "php", version: "8.2.3" },
    swift: { language: "swift", version: "5.3.3" },
    kotlin: { language: "kotlin", version: "1.8.20" },
    bash: { language: "bash", version: "5.2.0" },
    shell: { language: "bash", version: "5.2.0" },
    lua: { language: "lua", version: "5.4.4" },
    perl: { language: "perl", version: "5.36.0" },
    r: { language: "r", version: "4.1.1" },
    scala: { language: "scala", version: "3.2.2" },
    dart: { language: "dart", version: "2.19.6" },
};

// Local execution mapping (for when user has these installed)
const LOCAL_RUNNERS: Record<string, { ext: string; cmd: (f: string) => string }> = {
    javascript: { ext: "js", cmd: (f) => `node "${f}"` },
    typescript: { ext: "ts", cmd: (f) => `npx ts-node "${f}"` },
    python: { ext: "py", cmd: (f) => `python3 "${f}"` },
    bash: { ext: "sh", cmd: (f) => `bash "${f}"` },
    shell: { ext: "sh", cmd: (f) => `bash "${f}"` },
    ruby: { ext: "rb", cmd: (f) => `ruby "${f}"` },
    go: { ext: "go", cmd: (f) => `go run "${f}"` },
    rust: { ext: "rs", cmd: (f) => `rustc "${f}" -o "${f}.out" && "${f}.out"` },
    c: { ext: "c", cmd: (f) => `gcc "${f}" -o "${f}.out" && "${f}.out"` },
    cpp: { ext: "cpp", cmd: (f) => `g++ "${f}" -o "${f}.out" && "${f}.out"` },
    "c++": { ext: "cpp", cmd: (f) => `g++ "${f}" -o "${f}.out" && "${f}.out"` },
    java: { ext: "java", cmd: (f) => `cd "${path.dirname(f)}" && javac "${path.basename(f)}" && java "${path.basename(f, '.java')}"` },
    swift: { ext: "swift", cmd: (f) => `swift "${f}"` },
    kotlin: { ext: "kt", cmd: (f) => `kotlinc "${f}" -include-runtime -d "${f}.jar" && java -jar "${f}.jar"` },
    perl: { ext: "pl", cmd: (f) => `perl "${f}"` },
    lua: { ext: "lua", cmd: (f) => `lua "${f}"` },
    php: { ext: "php", cmd: (f) => `php "${f}"` },
    r: { ext: "r", cmd: (f) => `Rscript "${f}"` },
    dart: { ext: "dart", cmd: (f) => `dart run "${f}"` },
    scala: { ext: "scala", cmd: (f) => `scala "${f}"` },
};

const PISTON_API_URL = "https://emkc.org/api/v2/piston/execute";

// Try Piston API first (cloud execution), fall back to local
async function runWithPiston(language: string, code: string): Promise<{ output: string; exitCode: number; engine: string; lang: string; version: string }> {
    const langKey = language.toLowerCase();
    const pistonLang = PISTON_MAP[langKey];
    if (!pistonLang) throw new Error("unsupported_piston");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
        const response = await fetch(PISTON_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                language: pistonLang.language,
                version: pistonLang.version,
                files: [{ content: code }],
                stdin: "",
                args: [],
                compile_timeout: 10000,
                run_timeout: 5000,
            }),
            signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) throw new Error("piston_http_error");

        const result = await response.json();
        const runResult = result.run;
        const compileResult = result.compile;

        let output = "";
        if (compileResult?.stderr) {
            output = `[Compilation Error]\n${compileResult.stderr}`;
        } else if (runResult) {
            if (runResult.signal === "SIGKILL") {
                output = "[Error] Execution timed out or exceeded memory limit.";
            } else {
                output = runResult.stdout || "";
                if (runResult.stderr) output += (output ? "\n" : "") + runResult.stderr;
                if (!output) output = runResult.output || "(No output)";
            }
        }

        return {
            output: output.slice(0, 50000),
            exitCode: runResult?.code ?? -1,
            engine: "cloud",
            lang: pistonLang.language,
            version: pistonLang.version
        };
    } catch (e) {
        clearTimeout(timeout);
        throw e;
    }
}

// Local execution fallback
async function runLocally(language: string, code: string): Promise<{ output: string; exitCode: number; engine: string; lang: string; version: string }> {
    const langKey = language.toLowerCase();
    const runner = LOCAL_RUNNERS[langKey];

    if (!runner) {
        return {
            output: `Language "${language}" is not available for local execution.\nSupported locally: ${Object.keys(LOCAL_RUNNERS).join(", ")}\n\nNote: More languages are available when connected to the internet.`,
            exitCode: 1,
            engine: "local",
            lang: langKey,
            version: "local"
        };
    }

    const fileName = `temp_${Date.now()}.${runner.ext}`;
    const filePath = path.join(os.tmpdir(), fileName);

    await writeFileAsync(filePath, code);

    try {
        const { stdout, stderr } = await execAsync(runner.cmd(filePath), {
            timeout: 10000,
            maxBuffer: 1024 * 1024, // 1MB
        });

        let output = stdout || "";
        if (stderr) output += (output ? "\n[stderr]\n" : "") + stderr;

        return {
            output: output || "(No output)",
            exitCode: 0,
            engine: "local",
            lang: langKey,
            version: "local"
        };
    } catch (error: any) {
        if (error.killed) {
            return { output: "[Error] Execution timed out (limit: 10s)", exitCode: 1, engine: "local", lang: langKey, version: "local" };
        }
        return {
            output: error.stderr || error.stdout || error.message,
            exitCode: error.code || 1,
            engine: "local",
            lang: langKey,
            version: "local"
        };
    } finally {
        // Cleanup temp files
        await unlinkAsync(filePath).catch(() => {});
        await unlinkAsync(filePath + ".out").catch(() => {});
        // Cleanup Java class files
        if (langKey === "java") {
            const className = path.basename(filePath, ".java");
            await unlinkAsync(path.join(os.tmpdir(), className + ".class")).catch(() => {});
        }
    }
}

export async function POST(req: NextRequest) {
    try {
        const { language, code } = await req.json();

        if (!code || !code.trim()) {
            return NextResponse.json({ error: "No code provided" }, { status: 400 });
        }

        const lang = (language || "javascript").toLowerCase();

        // Strategy: Try Piston (cloud) first, fall back to local execution
        let result;
        try {
            result = await runWithPiston(lang, code);
        } catch {
            // Piston failed (offline, unsupported, timeout) → try local
            result = await runLocally(lang, code);
        }

        return NextResponse.json({
            output: result.output,
            language: result.lang,
            version: result.version,
            exitCode: result.exitCode,
            engine: result.engine,
        });

    } catch (error: any) {
        console.error("Run Code Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
