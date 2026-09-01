import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Post from '@/models/Post';
import { getDataFromToken } from '@/lib/auth-server';


export const dynamic = 'force-dynamic';


export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const posts = await Post.find()
            .populate("authorId", "name username")
            .sort({ createdAt: -1 });
        return NextResponse.json(posts);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const userId = getDataFromToken(req);
        if (!userId) {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        const body = await req.json();
        const post = await Post.create({
            authorId: userId,
            title: body.title,
            content: body.content,
            tags: body.tags || []
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
