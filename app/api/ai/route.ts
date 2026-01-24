import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    try {
        const { message, context } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            // Mock Response if no key
            return NextResponse.json({
                reply: "I am ready to help! To enable real AI responses, please add a `GEMINI_API_KEY` to your .env file.\n\nFor now, I can see you are asking: \"" + message + "\""
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
You are an expert coding assistant named "Jules" for the TechConnect platform.
You are helpful, concise, and expert in JavaScript, TypeScript, Python, and Web Development.

CONTEXT (The user's current file):
\`\`\`
${context || "// No file selected or empty"}
\`\`\`

USER QUESTION:
${message}

Please provide a helpful, code-centric answer. If you provide code, wrap it in markdown code blocks.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ reply: text });

    } catch (error: any) {
        console.error("AI API Error:", error);
        return NextResponse.json({
            error: "Failed to generate response",
            details: error.message
        }, { status: 500 });
    }
}
