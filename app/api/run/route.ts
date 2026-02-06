import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";

export const dynamic = 'force-dynamic';
import fs from "fs";
import path from "path";
import os from "os";
import { promisify } from "util";

const execAsync = promisify(exec);
const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);

export async function POST(req: NextRequest) {
    try {
        const { language, code } = await req.json();

        if (!code) {
            return NextResponse.json({ error: "No code provided" }, { status: 400 });
        }

        let extension = "";
        let command = "";

        if (language === "javascript") {
            extension = "js";
            command = "node";
        } else if (language === "python") {
            extension = "py";
            command = "python";
        } else {
            return NextResponse.json({ error: "Unsupported language" }, { status: 400 });
        }

        const fileName = `temp_${Date.now()}.${extension}`;
        const filePath = path.join(os.tmpdir(), fileName);

        await writeFileAsync(filePath, code);

        try {
            // Run with 5 second timeout
            const { stdout, stderr } = await execAsync(`${command} "${filePath}"`, { timeout: 5000 });
            await unlinkAsync(filePath); // Cleanup

            return NextResponse.json({ output: stdout || stderr });
        } catch (error: any) {
            await unlinkAsync(filePath).catch(() => { }); // Cleanup on error

            // If it's a timeout execution error
            if (error.killed) {
                return NextResponse.json({ error: "Execution timed out (limit: 5s)" }, { status: 408 });
            }

            return NextResponse.json({ error: error.message || error.stderr }, { status: 400 });
        }

    } catch (error) {
        console.error("Run Code Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
