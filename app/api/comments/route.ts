import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";

export const dynamic = 'force-dynamic';
import Comment from "@/models/Comment";
import Discussion from "@/models/Discussion";
import jwt from 'jsonwebtoken';
import { commentSchema } from "@/lib/validations";

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
