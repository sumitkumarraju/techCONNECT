const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
    createPost,
    getPosts,
    getPostById,
    addComment,
    upvotePost
} = require("../controllers/community.controller");

router.get("/posts", getPosts);
router.get("/posts/:id", getPostById);
router.post("/posts", protect, createPost);
router.post("/posts/:id/comments", protect, addComment);
router.post("/posts/:id/upvote", protect, upvotePost);

module.exports = router;
