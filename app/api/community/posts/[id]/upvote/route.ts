import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

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

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const userId = getDataFromToken(req);
        if (!userId) {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        const post = await Post.findById(params.id);

        if (!post) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }

        const isUpvoted = post.upvotes.some((id: any) => id.toString() === userId);
        if (isUpvoted) {
            return NextResponse.json({ message: "Already upvoted" }, { status: 400 });
        }

        post.upvotes.push(userId);
        await post.save();

        return NextResponse.json({ message: "Post upvoted" });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
