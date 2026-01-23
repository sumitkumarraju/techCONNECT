import { Request, Response } from 'express';
import Project from '@/models/Project';

export const getPublicProjects = async (req: Request, res: Response) => {
    try {
        const { tech, search } = req.query;
        let query: any = { isPublic: true };

        if (tech) {
            query.techStack = { $in: [tech as string] };
        }
        if (search) {
            query.name = { $regex: search as string, $options: "i" };
        }

        const projects = await Project.find(query)
            .populate("ownerId", "name username")
            .sort({ createdAt: -1 });

        res.json(projects);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
