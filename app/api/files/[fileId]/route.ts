import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import CodeFile from '@/models/CodeFile';
import Project from '@/models/Project';
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

// GET: Get single file content
export async function GET(req: NextRequest, { params }: { params: { fileId: string } }) {
    try {
        await connectDB();
        const userId = getDataFromToken(req);
        if (!userId) return NextResponse.json({ message: "Not authorized" }, { status: 401 });

        const file = await CodeFile.findById(params.fileId);
        if (!file) return NextResponse.json({ message: "File not found" }, { status: 404 });

        return NextResponse.json(file);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// PUT: Update file content or rename
export async function PUT(req: NextRequest, { params }: { params: { fileId: string } }) {
    try {
        await connectDB();
        const userId = getDataFromToken(req);
        if (!userId) return NextResponse.json({ message: "Not authorized" }, { status: 401 });

        const { name, content, language } = await req.json();

        // Check Permissions
        const existingFile = await CodeFile.findById(params.fileId);
        if (!existingFile) return NextResponse.json({ message: "File not found" }, { status: 404 });

        const project = await Project.findById(existingFile.projectId);
        if (project) {
            const isOwner = project.ownerId.toString() === userId;
            const isMember = project.members.some((m: any) => m.toString() === userId);
            if (!isOwner && !isMember) {
                return NextResponse.json({ message: "Not authorized" }, { status: 403 });
            }
        }

        const updateData: any = {};
        if (name) updateData.name = name;
        if (content !== undefined) updateData.content = content;
        if (language) updateData.language = language;

        const file = await CodeFile.findByIdAndUpdate(
            params.fileId,
            updateData,
            { new: true }
        );

        if (!file) return NextResponse.json({ message: "File not found" }, { status: 404 });

        return NextResponse.json(file);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// DELETE: Delete file
export async function DELETE(req: NextRequest, { params }: { params: { fileId: string } }) {
    try {
        await connectDB();
        const userId = getDataFromToken(req);
        if (!userId) return NextResponse.json({ message: "Not authorized" }, { status: 401 });

        const existingFile = await CodeFile.findById(params.fileId);
        if (!existingFile) return NextResponse.json({ message: "File not found" }, { status: 404 });

        // Check permissions
        const project = await Project.findById(existingFile.projectId);
        if (project) {
            const isOwner = project.ownerId.toString() === userId;
            const isMember = project.members.some((m: any) => m.toString() === userId);
            if (!isOwner && !isMember) {
                return NextResponse.json({ message: "Not authorized" }, { status: 403 });
            }
        }

        await CodeFile.findByIdAndDelete(params.fileId);

        return NextResponse.json({ message: "File deleted" });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
