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
            { owner: user.userId },
            { collaborators: user.userId }
        ]
    }).populate('owner', 'username').sort({ updatedAt: -1 });
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

    const { title, description } = await req.json();
    const project = await Project.create({
      title,
      description,
      owner: user.userId,
      collaborators: []
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
