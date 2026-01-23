import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Project from '@/models/Project';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

function getUserFromToken(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (e) {
    return null;
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const user = getUserFromToken(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

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
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
