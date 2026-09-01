import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Comment from "@/models/Comment";
import Discussion from "@/models/Discussion";
import { commentSchema } from "@/lib/validations";
import { getDataFromToken } from '@/lib/auth-server';



export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const userId = getDataFromToken(req);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const validation = commentSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: "Validation Error", details: validation.error.format() }, { status: 400 });
        }

        const { discussionId, content } = validation.data;

        // Verify discussion exists
        const discussion = await Discussion.findById(discussionId);
        if (!discussion) {
            return NextResponse.json({ error: "Discussion not found" }, { status: 404 });
        }

        const comment = await Comment.create({
            discussionId,
            authorId: userId,
            content
        });

        // Update comment count on discussion
        await Discussion.findByIdAndUpdate(discussionId, { $inc: { commentCount: 1 } });

        const populatedComment = await comment.populate("authorId", "username name");

        return NextResponse.json(populatedComment);
    } catch (error) {
        console.error("Comment error", error);
        return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
    }
}
