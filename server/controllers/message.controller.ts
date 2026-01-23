import { Response } from 'express';
import Message from '@/models/Message';
import { AuthRequest } from '../middleware/auth';

export const getMessages = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Not authorized" });
        const messages = await Message.find({ projectId: req.params.id })
            .populate("senderId", "name username")
            .sort({ createdAt: 1 });
        res.json(messages);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Not authorized" });
        const message = await Message.create({
            projectId: req.params.id,
            senderId: req.user.id,
            content: req.body.content
        });
        res.status(201).json(message);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
