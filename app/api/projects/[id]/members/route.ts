import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Project from '@/models/Project';
import User from '@/models/User';
import { getDataFromToken } from '@/lib/auth-server';


export const dynamic = 'force-dynamic';


// GET - List all project members with user details
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const userId = getDataFromToken(req);
        if (!userId) {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        const project = await Project.findById(params.id).populate('members.userId', 'name username email avatar');

        if (!project) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }

        // Check if user has access
        const isOwner = project.ownerId.toString() === userId;
        const isMember = project.members.some((m: any) => m.userId?._id?.toString() === userId);

        if (!isOwner && !isMember && !project.isPublic) {
            return NextResponse.json({ message: "Access denied" }, { status: 403 });
        }

        // Get owner details
        const owner = await User.findById(project.ownerId).select('name username email avatar');

        // Format members with their roles
        const members = project.members.map((m: any) => ({
            userId: m.userId?._id || m.userId,
            name: m.userId?.name || 'Unknown',
            username: m.userId?.username || 'unknown',
            email: m.userId?.email,
            avatar: m.userId?.avatar,
            role: m.role,
            joinedAt: m.joinedAt
        }));

        return NextResponse.json({
            owner: {
                userId: owner?._id,
                name: owner?.name,
                username: owner?.username,
                email: owner?.email,
                avatar: owner?.avatar,
                role: 'owner'
            },
            members,
            currentUserRole: isOwner ? 'owner' : project.members.find((m: any) => m.userId?._id?.toString() === userId)?.role || 'viewer'
        });
    } catch (error: any) {
        console.error("Get members error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// PUT - Update a member's role (owner only)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const userId = getDataFromToken(req);
        if (!userId) {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        const project = await Project.findById(params.id);

        if (!project) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }

        // Only owner can update roles
        if (project.ownerId.toString() !== userId) {
            return NextResponse.json({ message: "Only owner can update roles" }, { status: 403 });
        }

        const { memberId, newRole } = await req.json();

        if (!['editor', 'viewer'].includes(newRole)) {
            return NextResponse.json({ message: "Invalid role. Must be 'editor' or 'viewer'" }, { status: 400 });
        }

        // Find and update member
        const memberIndex = project.members.findIndex((m: any) => m.userId?.toString() === memberId);
        if (memberIndex === -1) {
            return NextResponse.json({ message: "Member not found" }, { status: 404 });
        }

        project.members[memberIndex].role = newRole;
        await project.save();

        return NextResponse.json({
            message: "Role updated successfully",
            memberId,
            newRole
        });
    } catch (error: any) {
        console.error("Update role error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// DELETE - Remove a member from project (owner only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const userId = getDataFromToken(req);
        if (!userId) {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const memberId = searchParams.get('memberId');

        if (!memberId) {
            return NextResponse.json({ message: "Member ID required" }, { status: 400 });
        }

        const project = await Project.findById(params.id);

        if (!project) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }

        // Only owner can remove members (or member can leave themselves)
        const isOwner = project.ownerId.toString() === userId;
        const isSelf = memberId === userId;

        if (!isOwner && !isSelf) {
            return NextResponse.json({ message: "Permission denied" }, { status: 403 });
        }

        // Cannot remove owner
        if (memberId === project.ownerId.toString()) {
            return NextResponse.json({ message: "Cannot remove project owner" }, { status: 400 });
        }

        // Remove member
        project.members = project.members.filter((m: any) => m.userId?.toString() !== memberId);
        await project.save();

        return NextResponse.json({
            message: isSelf ? "Left project successfully" : "Member removed successfully"
        });
    } catch (error: any) {
        console.error("Remove member error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
