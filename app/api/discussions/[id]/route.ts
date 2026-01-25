import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Discussion from "@/models/Discussion";
import Comment from "@/models/Comment";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const discussion = await Discussion.findById(params.id).populate("createdBy", "username name");
        if (!discussion) {
            return NextResponse.json({ error: "Discussion not found" }, { status: 404 });
        }

        // Fetch comments
        const comments = await Comment.find({ discussionId: params.id })
            .sort({ createdAt: 1 })
            .populate("authorId", "username name");

        return NextResponse.json({ discussion, comments });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch discussion" }, { status: 500 });
    }
}
