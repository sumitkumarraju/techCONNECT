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

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const userId = getDataFromToken(req);
        if (!userId) {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        const body = await req.json();
        const project = await Project.create({
            name: body.name,
            description: body.description,
            ownerId: userId,
            members: [userId],
            isPublic: body.isPublic || false,
            techStack: body.techStack || []
        });
    const projects = await Project.find({
      $or: [
        { ownerId: user.userId },
        { members: user.userId }
      ]
    }).populate('ownerId', 'username').sort({ updatedAt: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const user = getUserFromToken(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { name, description, isPublic, techStack } = await req.json();
    const project = await Project.create({
      name,
      description,
      ownerId: user.userId,
      members: [user.userId],
      isPublic: isPublic || false,
      techStack: techStack || []
    });

        return NextResponse.json(project, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
