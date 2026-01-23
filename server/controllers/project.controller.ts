import { Response } from 'express';
import Project from '@/models/Project';
import { AuthRequest } from '../middleware/auth';

// @desc    Create new project
export const createProject = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Not authorized" });

        const project = await Project.create({
            name: req.body.name,
            description: req.body.description,
            ownerId: req.user.id,
            members: [req.user.id],
            isPublic: req.body.isPublic || false,
            techStack: req.body.techStack || []
        });

        res.status(201).json(project);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get projects of logged-in user
export const getMyProjects = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Not authorized" });

        const projects = await Project.find({
            members: req.user.id
        }).sort({ updatedAt: -1 });

        res.json(projects);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get project by ID
export const getProjectById = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Not authorized" });

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Check membership
        const isMember = project.members.some((memberId: any) => memberId.toString() === req.user!.id);
        if (!isMember) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.json(project);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Join project
export const joinProject = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Not authorized" });

        const project = await Project.findById(req.params.id);

        if (!project || !project.isPublic) {
            return res.status(404).json({ message: "Project not found" });
        }

        const isMember = project.members.some((memberId: any) => memberId.toString() === req.user!.id);
        if (isMember) {
            return res.status(400).json({ message: "Already a member" });
        }

        project.members.push(req.user.id);
        await project.save();

        res.json({ message: "Joined project successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update project
export const updateProject = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Not authorized" });

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Only owner can update project" });
        }

        project.name = req.body.name || project.name;
        project.description = req.body.description || project.description;
        if (req.body.isPublic !== undefined) project.isPublic = req.body.isPublic;
        project.techStack = req.body.techStack || project.techStack;

        await project.save();
        res.json(project);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete project
export const deleteProject = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Not authorized" });

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Only owner can delete project" });
        }

        await project.deleteOne();
        res.json({ message: "Project deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
