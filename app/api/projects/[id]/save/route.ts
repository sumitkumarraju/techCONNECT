import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Project from '@/models/Project';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

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

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const user = getUserFromToken(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { code } = await req.json();

    const project = await Project.findById(params.id);
    if (!project) return NextResponse.json({ message: 'Project not found' }, { status: 404 });

    // Save current state to history before updating, or just push the new state
    // Strategy: Push the *new* state to history so we have a record of this save.
    project.versionHistory.push({
        code: code,
        timestamp: new Date()
    });

    project.code = code;
    await project.save();

    return NextResponse.json({ message: 'Saved', versionHistory: project.versionHistory });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
