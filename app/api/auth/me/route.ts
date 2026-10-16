import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

interface JwtPayload {
    id: string;
}

const getDataFromToken = (req: NextRequest) => {
    try {
        const token = req.headers.get("Authorization")?.split(" ")[1];
        if (!token) return null;
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret') as JwtPayload;
        return decoded.id;
    } catch (error: unknown) {
        return null;
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const userId = getDataFromToken(req);
        if (!userId) {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        const user = await User.findById(userId).select("-passwordHash");
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        return NextResponse.json(user);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ message }, { status: 500 });
    }
}
