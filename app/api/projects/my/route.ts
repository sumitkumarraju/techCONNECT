import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const getDataFromToken = (req: NextRequest) => {
    try {
        const token = req.headers.get("Authorization")?.split(" ")[1];
        if (!token) return null;
        const decoded = verifyToken(token);
        if (!decoded) return null;
        return decoded.id;
    } catch (error: unknown) {
        return null;
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const userId = getDataFromToken(req);
        if (!userId) {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        const projects = await Project.find({
            $or: [
                { ownerId: userId },
                { "members.userId": userId }
            ]
        }).sort({ updatedAt: -1 });

        return NextResponse.json(projects);
    } catch (error: unknown) {
        return NextResponse.json({ message: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
    }
}
