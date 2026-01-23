import { Response } from 'express';
import Task from '@/models/Task';
import { AuthRequest } from '../middleware/auth';

export const getTasks = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Not authorized" });
        const tasks = await Task.find({ projectId: req.params.id })
            .sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createTask = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Not authorized" });
        const task = await Task.create({
            projectId: req.params.id,
            title: req.body.title,
            createdBy: req.user.id
        });
        res.status(201).json(task);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Not authorized" });
        const task = await Task.findById(req.params.taskId);
        if (!task) return res.status(404).json({ message: "Task not found" });

        task.title = req.body.title || task.title;
        task.status = req.body.status || task.status;
        task.assignedTo = req.body.assignedTo || task.assignedTo;

        await task.save();
        res.json(task);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Not authorized" });
        const task = await Task.findById(req.params.taskId);
        if (!task) return res.status(404).json({ message: "Task not found" });

        await task.deleteOne();
        res.json({ message: "Task deleted" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
