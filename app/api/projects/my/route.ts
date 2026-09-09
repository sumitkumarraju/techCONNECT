import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import jwt from 'jsonwebtoken';
import { getDataFromToken } from "@/lib/auth";

export const dynamic = 'force-dynamic';


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
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
