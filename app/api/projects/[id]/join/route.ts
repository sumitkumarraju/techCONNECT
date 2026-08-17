import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import { getDataFromToken } from '@/lib/auth-server';


export const dynamic = 'force-dynamic';


export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const userId = getDataFromToken(req);
        if (!userId) {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        const project = await Project.findById(params.id);

        if (!project || !project.isPublic) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }

        // Check if user is already a member (using new structure)
        const isMember = project.members.some((m: any) => m.userId?.toString() === userId);
        if (isMember) {
            return NextResponse.json({ message: "Already a member" }, { status: 400 });
        }

        // Check if user is the owner
        if (project.ownerId.toString() === userId) {
            return NextResponse.json({ message: "You are the owner of this project" }, { status: 400 });
        }

        // Add user as viewer by default
        project.members.push({
            userId: userId,
            role: 'viewer', // New users get viewer role by default
            joinedAt: new Date()
        });
        await project.save();

        return NextResponse.json({
            message: "Joined project successfully",
            role: 'viewer'
        });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
