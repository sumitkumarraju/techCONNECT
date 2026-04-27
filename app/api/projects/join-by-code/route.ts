import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import jwt from 'jsonwebtoken';
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

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const userId = getDataFromToken(req);
        if (!userId) throw new ApiError("Unauthorized — please login first", 401);

        const { code } = await req.json();

        if (!code || typeof code !== 'string') {
            throw new ApiError("Room code is required", 400);
        }

        // Normalize: uppercase, trim, remove spaces/dashes
        const normalizedCode = code.toUpperCase().replace(/[\s-]/g, '').trim();

        if (normalizedCode.length !== 6) {
            throw new ApiError("Room code must be 6 characters", 400);
        }

        const project = await Project.findOne({ roomCode: normalizedCode });

        if (!project) {
            throw new ApiError("Invalid room code. No project found.", 404);
        }

        // Check if user is already a member
        const existingMember = project.members.find(
            (m: any) => m.userId.toString() === userId
        );

        if (existingMember) {
            // Already a member — just return the project
            return NextResponse.json({
                message: "You're already a member of this project",
                projectId: project._id,
                projectName: project.name,
                alreadyMember: true
            });
        }

        // Add user as editor (not viewer — they're invited, so they should be able to edit)
        project.members.push({
            userId: userId,
            role: 'editor',
            joinedAt: new Date()
        });

        await project.save();

        return NextResponse.json({
            message: "Successfully joined project!",
            projectId: project._id,
            projectName: project.name,
            role: 'editor',
            alreadyMember: false
        }, { status: 200 });

    } catch (error) {
        return handleApiError(error);
    }
}
