import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { profileUpdateSchema } from "@/lib/validations";
import { ApiError, handleApiError } from '@/lib/api-error';

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

function getUserFromToken(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return { userId: decoded.id }; // Map 'id' from token to 'userId' for internal use
  } catch (e) {
    return null;
  }
}

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const userToken = getUserFromToken(req);
    if (!userToken) throw new ApiError('Unauthorized', 401);

    const user = await User.findById(userToken.userId).select('-password').lean();
    return NextResponse.json(user);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const userToken = getUserFromToken(req);
    if (!userToken) throw new ApiError('Unauthorized', 401);

    const body = await req.json();
    const validation = profileUpdateSchema.safeParse(body);

    if (!validation.success) {
      throw validation.error;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userToken.userId,
      { $set: validation.data },
      { new: true }
    ).select("-password");

    return NextResponse.json(updatedUser);
  } catch (error) {
    return handleApiError(error);
  }
}
