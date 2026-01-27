import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Discussion from "@/models/Discussion";
import jwt from 'jsonwebtoken';
import { discussionSchema } from "@/lib/validations";

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

// GET: List discussions
export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const projectId = searchParams.get("projectId");
        const type = searchParams.get("type");

        let query: any = {};
        if (projectId) query.projectId = projectId;
        if (type) query.type = type;

        const discussions = await Discussion.find(query)
            .sort({ createdAt: -1 })
            .populate("createdBy", "username name");

        return NextResponse.json(discussions);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch discussions" }, { status: 500 });
    }
}

// POST: Create discussion
export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const userId = getDataFromToken(req);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const validation = discussionSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: "Validation Error", details: validation.error.format() }, { status: 400 });
        }

        const discussion = await Discussion.create({
            ...validation.data,
            createdBy: userId
        });

        return NextResponse.json(discussion);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create discussion" }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';
