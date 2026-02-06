import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";

export const dynamic = 'force-dynamic';
import Challenge from "@/models/Challenge";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const challenge = await Challenge.findById(params.id);
        if (!challenge) {
            return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
        }
        return NextResponse.json(challenge);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch challenge" }, { status: 500 });
    }
}
