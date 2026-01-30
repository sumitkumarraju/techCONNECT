import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
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

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const userId = getDataFromToken(req);
        if (!userId) {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        const project = await Project.findById(params.id);

        if (!project) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }

        // Check membership
        const isMember = project.members.some((member: any) => member.userId.toString() === userId);
        if (!isMember) {
            return NextResponse.json({ message: "Access denied" }, { status: 403 });
        }

        return NextResponse.json(project);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const userId = getDataFromToken(req);
        if (!userId) {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        const project = await Project.findById(params.id);

        if (!project) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }

        if (project.ownerId.toString() !== userId) {
            return NextResponse.json({ message: "Only owner can update project" }, { status: 403 });
        }

        const body = await req.json();
        project.name = body.name || project.name;
        project.description = body.description || project.description;
        if (body.isPublic !== undefined) project.isPublic = body.isPublic;
        project.techStack = body.techStack || project.techStack;

        await project.save();
        return NextResponse.json(project);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const userId = getDataFromToken(req);
        if (!userId) {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        const project = await Project.findById(params.id);

        if (!project) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }

        if (project.ownerId.toString() !== userId) {
            return NextResponse.json({ message: "Only owner can delete project" }, { status: 403 });
        }

        await project.deleteOne();
        return NextResponse.json({ message: "Project deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
