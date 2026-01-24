import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
    try {
        const { message, context, model } = await req.json();
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            // Mock Response if no key
            return NextResponse.json({
                reply: `[MOCK MODE: No OPENAI_API_KEY found]\n\nI see you are asking: "${message}"\n\nTo get real answers using ${model || 'GPT'}, please add your API Key to .env.`
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

        const completion = await openai.chat.completions.create({
            model: selectedModel,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
        });

        return NextResponse.json({
            reply: completion.choices[0].message.content
        });

    } catch (error: any) {
        console.error("AI API Error:", error);
        return NextResponse.json({
            error: "Failed to generate response",
            details: error.message
        }, { status: 500 });
    }
}
