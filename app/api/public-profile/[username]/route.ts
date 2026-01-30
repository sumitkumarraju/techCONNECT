import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Project from '@/models/Project';

export async function GET(req: Request, { params }: { params: { username: string } }) {
    try {
        await dbConnect();
        const { username } = params;

        const user = await User.findOne({ username }).select('-password -email'); // Exclude private info
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Also fetch their public projects
        const projects = await Project.find({ ownerId: user._id, isPublic: true }).select('name description techStack');

        return NextResponse.json({
            user,
            projects
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';
