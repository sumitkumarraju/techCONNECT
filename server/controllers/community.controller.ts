import { Request, Response } from 'express';
import Post from '@/models/Post';
import Comment from '@/models/Comment';
import { AuthRequest } from '../middleware/auth';

export const createPost = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Not authorized" });
        const post = await Post.create({
            authorId: req.user.id,
            title: req.body.title,
            content: req.body.content,
            tags: req.body.tags || []
        });
        res.status(201).json(post);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getPosts = async (req: Request, res: Response) => {
    try {
        const posts = await Post.find()
            .populate("authorId", "name username")
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getPostById = async (req: Request, res: Response) => {
    try {
        const post = await Post.findById(req.params.id).populate(
            "authorId",
            "name username"
        );
        if (!post) return res.status(404).json({ message: "Post not found" });
        res.json(post);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const addComment = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Not authorized" });
        const comment = await Comment.create({
            postId: req.params.id,
            authorId: req.user.id,
            content: req.body.content
        });
        res.status(201).json(comment);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const upvotePost = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Not authorized" });
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const isUpvoted = post.upvotes.some((id: any) => id.toString() === req.user!.id);
        if (isUpvoted) {
            return res.status(400).json({ message: "Already upvoted" });
        }
        post.upvotes.push(req.user.id);
        await post.save();
        res.json({ message: "Post upvoted" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
