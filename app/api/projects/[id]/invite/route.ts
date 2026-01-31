import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Project from "@/models/Project";
import User from "@/models/User";
import jwt from 'jsonwebtoken';

const getDataFromToken = (req: Request) => {
    try {
        const token = req.headers.get("Authorization")?.split(" ")[1];
        if (!token) return null;
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
        return decoded.id;
    } catch (error: any) {
        return null;
    }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const userId = getDataFromToken(req);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { email, role } = await req.json();

        // 1. Fetch Project
        const project = await Project.findById(params.id);
        if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

        // 2. Permission Check (Only Owner can invite for now)
        if (project.ownerId.toString() !== userId) {
            return NextResponse.json({ error: "Permission denied" }, { status: 403 });
        }

        // 3. Find User to invite
        const userToInvite = await User.findOne({ email });
        if (!userToInvite) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // 4. Check if already a member
        const existingMember = project.members.find((m: any) => m.userId.toString() === userToInvite._id.toString());
        if (existingMember) {
            return NextResponse.json({ error: "User is already a member" }, { status: 400 });
        }

        if (project.ownerId.toString() === userToInvite._id.toString()) {
            return NextResponse.json({ error: "User is the owner" }, { status: 400 });
        }

        // 5. Add Member
        project.members.push({
            userId: userToInvite._id,
            role: role || 'viewer'
        });

        await project.save();

        return NextResponse.json({ success: true, user: { username: userToInvite.username, role } });

    } catch (error) {
        console.error("Invite error", error);
        return NextResponse.json({ error: "Failed to invite user" }, { status: 500 });
    }
}
