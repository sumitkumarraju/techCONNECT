import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message, context, model } = body;
        const apiKey = process.env.OPENAI_API_KEY;

        console.log("🤖 AI Request:", { model, msgLen: message?.length, hasKey: !!apiKey });

        if (!apiKey) {
            console.log("❌ Missing API Key");
            return NextResponse.json({
                reply: `[MOCK MODE: No OPENAI_API_KEY found]\n\nI see you are asking: "${message}"\n\nTo get real answers, please add your API Key to .env.`
            });
        }

        const openai = new OpenAI({ apiKey });
        const selectedModel = model || "gpt-3.5-turbo";

        const systemPrompt = `You are "Jules", an expert AI coding assistant for TechConnect. 
        You are helpful, concise, and expert in JavaScript, TypeScript, Python, and Web Development.
        
        CONTEXT (User's current code):
        \`\`\`
        ${context || "// No file selected"}
        \`\`\`
        `;

        try {
            const completion = await openai.chat.completions.create({
                model: selectedModel,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message }
                ],
            });

            console.log("✅ AI Response Success");
            return NextResponse.json({
                reply: completion.choices[0].message.content
            });

        } catch (openaiError: any) {
            console.error("❌ OpenAI API Error:", openaiError);
            return NextResponse.json({
                error: "OpenAI Error",
                details: openaiError.message || "Unknown OpenAI error"
            }, { status: 500 });
        }

    } catch (error: any) {
        console.error("❌ General API Error:", error);
        return NextResponse.json({
            error: "Failed to generate response",
            details: error.message
        }, { status: 500 });
    }
}
