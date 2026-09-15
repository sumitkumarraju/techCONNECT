import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { registerSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();

        // Validate input
        const validation = registerSchema.safeParse(body);
        if (!validation.success) {
            const formattedErrors = validation.error.format();
            const firstFieldError =
                formattedErrors.name?._errors?.[0] ||
                formattedErrors.username?._errors?.[0] ||
                formattedErrors.email?._errors?.[0] ||
                formattedErrors.password?._errors?.[0] ||
                "Validation Error";

            return NextResponse.json({
                message: firstFieldError,
                errors: formattedErrors
            }, { status: 400 });
        }

        const { name, username, email, password } = validation.data;
        const normalizedName = name.trim();
        const normalizedUsername = username.trim();
        const normalizedEmail = email.trim().toLowerCase();

        const userExists = await User.findOne({
            $or: [{ email: normalizedEmail }, { username: normalizedUsername }]
        });

        if (userExists) {
            const duplicateField =
                userExists.email === normalizedEmail ? "email" : "username";
            return NextResponse.json(
                { message: `An account with this ${duplicateField} already exists` },
                { status: 409 }
            );
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await User.create({
            name: normalizedName,
            username: normalizedUsername,
            email: normalizedEmail,
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
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        console.error("Register Error:", errorMessage);
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
