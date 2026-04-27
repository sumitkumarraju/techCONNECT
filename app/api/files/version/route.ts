import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import FileVersion from "@/models/FileVersion";

// GET: Fetch versions for a file
export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const fileId = searchParams.get("fileId");

        if (!fileId) {
            return NextResponse.json({ error: "File ID required" }, { status: 400 });
        }

        const versions = await FileVersion.find({ fileId })
            .sort({ createdAt: -1 })
            .limit(20)
            .populate("createdBy", "username name");

        return NextResponse.json(versions);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch versions" }, { status: 500 });
    }
}

// POST: Save a new version
export async function POST(req: Request) {
    try {
        await dbConnect();
        const { fileId, content, userId, projectId } = await req.json();

        if (!fileId || !projectId || !userId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const version = await FileVersion.create({
            fileId,
            content,
            createdBy: userId,
            projectId,
        });

        return NextResponse.json({ success: true, version });
    } catch (error) {
        return NextResponse.json({ error: "Failed to save version" }, { status: 500 });
    }
}
