import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const tech = searchParams.get('tech');
        const search = searchParams.get('search');

        let query: any = { isPublic: true };

        if (tech) {
            query.techStack = { $in: [tech] };
        }

        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        const projects = await Project.find(query)
            .populate("ownerId", "name username")
            .sort({ createdAt: -1 });

        return NextResponse.json(projects);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
