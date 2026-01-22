import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
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

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  await dbConnect();
  const userToken = getUserFromToken(req);
  if (!userToken) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const user = await User.findById(userToken.userId).select('-password');
  return NextResponse.json(user);
}
