import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import jwt from 'jsonwebtoken';
import { createProjectSchema } from '@/lib/validations';
import { ApiError, handleApiError } from '@/lib/api-error';

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

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const userId = getDataFromToken(req);

        // If logged in, get my projects. If not, maybe public?
        // For now, let's assume this is "My Projects" endpoint for dashboard
        if (!userId) throw new ApiError("Unauthorized", 401);

        // OPTIMIZATION: .lean() for faster reads
        const projects = await Project.find({
            $or: [
                { ownerId: userId },
                { "members.userId": userId }
            ]
        }).sort({ updatedAt: -1 }).lean();

        return NextResponse.json(projects);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const userId = getDataFromToken(req);
        if (!userId) throw new ApiError("Unauthorized", 401);

        const rawBody = await req.json();

        // Validate input
        const validation = createProjectSchema.safeParse(rawBody);
        if (!validation.success) {
            throw validation.error; // handleApiError will catch ZodError
        }

        const body = validation.data;

        const project = await Project.create({
            name: body.name,
            description: body.description,
            ownerId: userId,
            members: [{ userId: userId, role: 'owner' }],
            isPublic: body.isPublic || false,
            techStack: body.techStack || []
        });

        // Ensure roomCode was generated (it should be via pre-save hook)
        if (!project.roomCode) {
            const crypto = await import('crypto');
            const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
            let code = '';
            const bytes = crypto.randomBytes(6);
            for (let i = 0; i < 6; i++) {
                code += chars[bytes[i] % chars.length];
            }
            project.roomCode = code;
            await project.save();
        }

        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        return handleApiError(error);
    }
}
