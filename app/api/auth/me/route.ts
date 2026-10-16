import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { getDataFromToken } from '@/lib/auth';
import { ApiError, handleApiError } from '@/lib/api-error';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const userId = getDataFromToken(req);
        if (!userId) {
            throw new ApiError("Not authorized", 401);
        }

        const user = await User.findById(userId).select("-passwordHash");
        if (!user) {
            throw new ApiError("User not found", 404);
        }
        return NextResponse.json(user);
    } catch (error: any) {
        return handleApiError(error);
    }
}
