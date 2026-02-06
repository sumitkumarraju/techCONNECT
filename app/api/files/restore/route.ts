import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";

export const dynamic = 'force-dynamic';
import FileVersion from "@/models/FileVersion";
import CodeFile from "@/models/CodeFile";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { fileId, versionId } = await req.json();

        if (!fileId || !versionId) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // Get the content from the version snapshot
        const version = await FileVersion.findById(versionId);
        if (!version) {
            return NextResponse.json({ error: "Version not found" }, { status: 404 });
        }

        // Overwrite the current file content
        // Note: Ideally, we should also create a *new* version of the *state before restore* 
        // to be safe, but for this "simple rollback" MVP, we just overwrite.
        // We could also trigger a "save new version" immediately after this if desired.

        await CodeFile.findByIdAndUpdate(fileId, {
            content: version.content,
            updatedAt: new Date(),
        });

        return NextResponse.json({ success: true, content: version.content });
    } catch (error) {
        return NextResponse.json({ error: "Failed to restore version" }, { status: 500 });
    }
}
