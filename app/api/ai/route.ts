import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import connectDB from "@/lib/db";
import Project from "@/models/Project";
import CodeFile from "@/models/CodeFile";
import jwt from "jsonwebtoken";

type EditAction = "update" | "create";

interface ProposedEdit {
    fileName: string;
    action: EditAction;
    content: string;
}

const MAX_PROJECT_FILES_IN_CONTEXT = 30;
const MAX_EDIT_FILES = 8;
const MAX_FILE_CHARS = 20000;
const FORBIDDEN_FILE_PATTERNS = [
    /^\.env/i,
    /(^|\/)\.env/i,
    /(^|\/)\.git\//i,
    /package-lock\.json$/i,
    /yarn\.lock$/i,
    /pnpm-lock\.yaml$/i,
];

const getDataFromToken = (req: NextRequest) => {
    try {
        const token = req.headers.get("Authorization")?.split(" ")[1];
        if (!token) return null;
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "devsecret");
        return decoded.id as string;
    } catch {
        return null;
    }
};

const extractJson = (text: string) => {
    try {
        return JSON.parse(text);
    } catch {
        const block = text.match(/```json\s*([\s\S]*?)```/i) || text.match(/```\s*([\s\S]*?)```/i);
        if (!block) throw new Error("No JSON payload returned by model");
        return JSON.parse(block[1]);
    }
};

const sanitizeEdits = (value: unknown): ProposedEdit[] => {
    if (!Array.isArray(value)) return [];
    const normalized = value
        .filter((item: any) => item && typeof item === "object")
        .map((item: any) => ({
            fileName: String(item.fileName || "").trim(),
            action: item.action === "create" ? "create" as EditAction : "update" as EditAction,
            content: String(item.content || ""),
        }))
        .filter((item) => item.fileName && item.content.length > 0)
        .filter((item) => !FORBIDDEN_FILE_PATTERNS.some((pattern) => pattern.test(item.fileName)))
        .slice(0, MAX_EDIT_FILES)
        .map((item) => ({
            ...item,
            content: item.content.slice(0, MAX_FILE_CHARS),
        }));

    return normalized;
};

const normalizeModelOutput = (content: string) => {
    const parsed = extractJson(content);
    return {
        reply: String(parsed.reply || "I generated a plan, but no assistant reply text was provided."),
        edits: sanitizeEdits(parsed.edits),
    };
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            message,
            context,
            model,
            projectId,
            activeFileName,
            scope = "current_file",
            applyMode = "manual",
        } = body;

        const apiKey = process.env.NVIDIA_API_KEY;
        const baseURL = process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";
        const selectedModel = model || process.env.NVIDIA_MODEL || "minimaxai/minimax-m2.7";

        if (!apiKey || apiKey === "your_new_nvapi_key") {
            return NextResponse.json(
                { error: "Missing or invalid NVIDIA_API_KEY in environment variables." },
                { status: 500 }
            );
        }

        const userId = getDataFromToken(req);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const openai = new OpenAI({ apiKey, baseURL });

        let projectContext = "";
        if (scope === "project_files" && projectId) {
            await connectDB();

            const project = await Project.findById(projectId);
            if (!project) {
                return NextResponse.json({ error: "Project not found" }, { status: 404 });
            }

            const isOwner = project.ownerId?.toString() === userId;
            const isMember = project.members?.some((m: any) => {
                if (m?.userId) return m.userId.toString() === userId;
                return m?.toString?.() === userId;
            });

            if (!isOwner && !isMember) {
                return NextResponse.json({ error: "Not authorized for this project" }, { status: 403 });
            }

            const files = await CodeFile.find({ projectId }).select("name content").limit(MAX_PROJECT_FILES_IN_CONTEXT);
            projectContext = files
                .map((f: any) => `FILE: ${f.name}\n\`\`\`\n${String(f.content || "").slice(0, MAX_FILE_CHARS)}\n\`\`\``)
                .join("\n\n");
        }

        const systemPrompt = `You are "Jules", a coding assistant inside TechConnect.
Return ONLY valid JSON with this exact shape:
{
  "reply": "string",
  "edits": [
    {
      "fileName": "string",
      "action": "update" | "create",
      "content": "full file content"
    }
  ]
        }

Rules:
- reply: concise explanation and what changed.
- edits: include ONLY when user asked for code changes.
- Never include files outside current project.
- Do not modify env files, secrets, auth tokens, or lockfiles.
- Keep edits minimal and directly related to request.
- If insufficient context, keep edits empty and explain in reply.
- If user asks for dangerous actions (secrets exfiltration, unrestricted filesystem control, bypassing auth), refuse and return edits as [].

Current active file: ${activeFileName || "none"}
Scope: ${scope}
Apply mode requested: ${applyMode}

Current file context:
\`\`\`
${context || "// No file selected"}
\`\`\`

Project context (if provided):
${projectContext || "// Not provided"}
`;

        const fallbackModels = (process.env.NVIDIA_FALLBACK_MODELS || "")
            .split(",")
            .map((m) => m.trim())
            .filter(Boolean);
        const modelCandidates = [selectedModel, ...fallbackModels];

        let completion: any = null;
        let modelUsed = selectedModel;
        let completionError: any = null;
        for (const candidate of modelCandidates) {
            try {
                completion = await openai.chat.completions.create({
                    model: candidate,
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: String(message || "") },
                    ],
                    temperature: 0.4,
                    top_p: 0.95,
                    max_tokens: 4096,
                    stream: false,
                });
                modelUsed = candidate;
                completionError = null;
                break;
            } catch (err) {
                completionError = err;
            }
        }

        if (!completion) {
            throw completionError || new Error("No AI completion received");
        }

        const raw = completion.choices?.[0]?.message?.content || "";
        const { reply, edits } = normalizeModelOutput(raw);

        if (applyMode !== "auto" || edits.length === 0 || !projectId) {
            return NextResponse.json({
                reply,
                edits,
                appliedEdits: [],
                audit: { modelUsed, timestamp: new Date().toISOString() },
            });
        }

        await connectDB();
        const project = await Project.findById(projectId);
        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        const isOwner = project.ownerId?.toString() === userId;
        const memberEntry = project.members?.find((m: any) => {
            if (m?.userId) return m.userId.toString() === userId;
            return m?.toString?.() === userId;
        });
        const role = memberEntry?.role || (isOwner ? "owner" : "viewer");
        if (!isOwner && !memberEntry) {
            return NextResponse.json({ error: "Not authorized for this project" }, { status: 403 });
        }
        if (role === "viewer") {
            return NextResponse.json({ error: "Viewer cannot auto-apply edits" }, { status: 403 });
        }

        const appliedEdits: ProposedEdit[] = [];
        for (const edit of edits) {
            if (edit.action === "update") {
                const existing = await CodeFile.findOne({ projectId, name: edit.fileName });
                if (!existing) continue;
                existing.content = edit.content;
                await existing.save();
                appliedEdits.push(edit);
                continue;
            }

            const exists = await CodeFile.findOne({ projectId, name: edit.fileName });
            if (exists) continue;
            await CodeFile.create({
                projectId,
                name: edit.fileName,
                language: "plaintext",
                content: edit.content,
                createdBy: userId,
            });
            appliedEdits.push(edit);
        }

        return NextResponse.json({
            reply,
            edits,
            appliedEdits,
            audit: { modelUsed, timestamp: new Date().toISOString() },
        });
    } catch (error: unknown) {
        const providerError =
            (error as any)?.error?.message ||
            (error as any)?.response?.data?.error?.message ||
            (error as any)?.response?.data?.message ||
            (error as any)?.message ||
            "Unknown provider error";

        return NextResponse.json({
            error: "Failed to generate response",
            details: providerError
        }, { status: 500 });
    }
}
