import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Challenge from "@/models/Challenge";
import jwt from 'jsonwebtoken';
import { challengeSchema } from "@/lib/validations";

const getDataFromToken = (req: NextRequest) => {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) return null;
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    return decoded.id;
  } catch (error: any) {
    return null;
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const challenges = await Challenge.find({}).sort({ createdAt: -1 });
    return NextResponse.json(challenges);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch challenges" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const userId = getDataFromToken(req);
    // For now, any user can create challenges. In future: check Admin role.
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = challengeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: "Validation Error", details: validation.error.format() }, { status: 400 });
    }

    const challenge = await Challenge.create(validation.data);
    return NextResponse.json(challenge);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create challenge" }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
