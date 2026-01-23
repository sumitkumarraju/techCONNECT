import express from 'express';
import protect from '../middleware/auth';
import { createPost, getPosts, getPostById, addComment, upvotePost } from '../controllers/community.controller';

const router = express.Router();

router.post("/posts", protect, createPost);
router.get("/posts", getPosts);
router.get("/posts/:id", getPostById);
router.post("/posts/:id/comments", protect, addComment);
router.post("/posts/:id/upvote", protect, upvotePost);

export default router;
