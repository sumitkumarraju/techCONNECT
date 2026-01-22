import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Project from '@/models/Project';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

// Add headers to allow CORS or specific methods if needed, though Next.js internal API handles this well.

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const project = await Project.findById(params.id).populate('owner', 'username');
    if (!project) return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
