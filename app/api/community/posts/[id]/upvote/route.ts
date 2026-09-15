import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import { getDataFromToken } from '@/lib/auth-server';


export const dynamic = 'force-dynamic';


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
