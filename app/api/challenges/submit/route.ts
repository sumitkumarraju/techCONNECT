import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Challenge from "@/models/Challenge";
import Submission from "@/models/Submission";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import util from 'util';
import jwt from 'jsonwebtoken';
import { submissionSchema } from "@/lib/validations";

const execPromise = util.promisify(exec);

const getDataFromToken = (req: NextRequest) => {
    try {
        const token = req.headers.get("Authorization")?.split(" ")[1];
        if (!token) return null;
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
        return decoded.id;
    } catch (error: any) {
        return null;
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const userId = getDataFromToken(req);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        // Validate basics (using partial schema cause userId is from token)
        const validation = submissionSchema.omit({ userId: true } as any).safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: "Validation Error", details: validation.error.format() }, { status: 400 });
        }

        const { challengeId, code, language } = validation.data;

        // 1. Fetch Challenge & Test Cases
        const challenge = await Challenge.findById(challengeId);
        if (!challenge) {
            return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
        }

        // 2. Validate Language (Only JS/Node for now)
        if (language !== "javascript") {
            return NextResponse.json({ error: "Only JavaScript is supported for challenges currently." }, { status: 400 });
        }

        // 3. Execute Code against Test Cases
        let passedTests = 0;
        let totalTests = challenge.testCases.length;
        let finalStatus = "pending";
        let executionOutput = "";

        // Create a temporary file
        const tempFileName = `temp_${userId}_${Date.now()}.js`;
        // In a real app, use /tmp or proper temp dir. Windows compatible here via relative path or process.env.TEMP
        const tempFilePath = path.join(process.cwd(), "temp", tempFileName);

        // Ensure temp dir exists
        if (!fs.existsSync(path.join(process.cwd(), "temp"))) {
            fs.mkdirSync(path.join(process.cwd(), "temp"));
        }

        try {
            // For each test case, we append a runner script to the user code
            // This is naive but works for simple I/O or function calls
            // BETTER: User code exports a function, and we require() it. 
            // LET'S ASSUME: User writes a function solution(input).

            for (const test of challenge.testCases) {
                // Construct runner code
                const runnerCode = `
                    ${code}
                    
                    try {
                        const input = ${test.input}; 
                        const output = solution(input);
                        console.log(JSON.stringify(output));
                    } catch(e) {
                        console.error(e.message);
                        process.exit(1);
                    }
                `;

                fs.writeFileSync(tempFilePath, runnerCode);

                // Execute with timeout
                // Note: Windows 'timeout' not supported in exec easily, relying on node timeout logic if possible or just simplified exec
                const { stdout, stderr } = await execPromise(`node "${tempFilePath}"`, { timeout: 2000 });

                const actualOutput = stdout.trim();
                const expectedOutput = JSON.stringify(JSON.parse(test.output)); // Normalize via JSON

                if (actualOutput === expectedOutput) {
                    passedTests++;
                }
            }

            finalStatus = passedTests === totalTests ? "accepted" : "rejected";
            executionOutput = `Passed ${passedTests}/${totalTests} test cases.`;

        } catch (error: any) {
            finalStatus = "error";
            executionOutput = `Execution Error: ${error.stderr || error.message}`;
            console.error("Exec error:", error);
        } finally {
            // Cleanup
            if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
        }

        // 4. Save Submission
        const submission = await Submission.create({
            challengeId,
            userId,
            code,
            language,
            status: finalStatus,
            score: finalStatus === "accepted" ? challenge.points : 0,
            result: executionOutput
        });

        return NextResponse.json({
            success: true,
            status: finalStatus,
            output: executionOutput,
            submission
        });

    } catch (error) {
        console.error("Submission error", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
