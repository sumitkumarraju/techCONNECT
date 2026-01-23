import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, username, email, password } = await req.json();

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { name, username, email, password } = await req.json();

        if (!name || !username || !email || !password) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const userExists = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (userExists) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      username,
      email,
      passwordHash: hashedPassword
    });

        const user = await User.create({
            name,
            username,
            email,
            passwordHash
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'devsecret', {
            expiresIn: "7d"
        });

        return NextResponse.json({
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            token
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
