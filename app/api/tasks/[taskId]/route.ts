import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Task from '@/models/Task';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

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

export async function PUT(req: NextRequest, { params }: { params: { taskId: string } }) {
    try {
        await connectDB();
        const userId = getDataFromToken(req);
        if (!userId) {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        const task = await Task.findById(params.taskId);

        if (!task) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 });
        }

        const body = await req.json();
        task.title = body.title || task.title;
        task.status = body.status || task.status;
        task.assignedTo = body.assignedTo || task.assignedTo;

        await task.save();
        return NextResponse.json(task);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { taskId: string } }) {
    try {
        await connectDB();
        const userId = getDataFromToken(req);
        if (!userId) {
            return NextResponse.json({ message: "Not authorized" }, { status: 401 });
        }

        const task = await Task.findById(params.taskId);

        if (!task) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 });
        }

        await task.deleteOne();
        return NextResponse.json({ message: "Task deleted" });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
