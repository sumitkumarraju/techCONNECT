import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import CodeFile from '@/models/CodeFile';
import Project from '@/models/Project';
import { getDataFromToken } from '@/lib/auth-server';


export const dynamic = 'force-dynamic';


// GET: List files for a project
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const userId = getDataFromToken(req);
        if (!userId) {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        const files = await CodeFile.find({ projectId: params.id }).select('name language updatedAt');
        return NextResponse.json(files);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// POST: Create a new file
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const userId = getDataFromToken(req);
        if (!userId) {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        const { name, language, content } = await req.json();

        // Check if user is member of project (basic security)
        const project = await Project.findById(params.id);
        if (!project) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }

        // Check Permissions
        const isOwner = project.ownerId.toString() === userId;
        const isMember = project.members.some((m: any) => m.toString() === userId);

        if (!isOwner && !isMember) {
            return NextResponse.json({ message: "Not authorized to create files in this project" }, { status: 403 });
        }

        const file = await CodeFile.create({
            projectId: params.id,
            name,
            language: language || 'javascript', // Default
            content: content || '',
            createdBy: userId
        });

        return NextResponse.json(file, { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ message: "File with this name already exists" }, { status: 400 });
        }
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
