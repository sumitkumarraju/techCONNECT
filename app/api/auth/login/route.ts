import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { loginSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();

        // Validate input
        const validation = loginSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({
                message: "Validation Error",
                errors: validation.error.format()
            }, { status: 400 });
        }

        const { email, password } = validation.data;

        const user = await User.findOne({
            $or: [{ email: email }, { username: email }]
        });

        if (!user) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'devsecret', {
            expiresIn: "7d"
        });

        return NextResponse.json({
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            token
        });
    } catch (error: unknown) {
        console.error("Login Error:", error);
        return NextResponse.json({ message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
