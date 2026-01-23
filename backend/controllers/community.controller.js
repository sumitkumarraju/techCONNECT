const Post = require("../models/Post");
const Comment = require("../models/Comment");

// @desc    Create community post
// @route   POST /api/community/posts
// @access  Private
exports.createPost = async (req, res) => {
    try {
        const post = await Post.create({
            authorId: req.user.id,
            title: req.body.title,
            content: req.body.content,
            tags: req.body.tags || []
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all posts
// @route   GET /api/community/posts
// @access  Public
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("authorId", "name username")
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single post
// @route   GET /api/community/posts/:id
// @access  Public
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate(
            "authorId",
            "name username"
        );

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add comment
// @route   POST /api/community/posts/:id/comments
// @access  Private
exports.addComment = async (req, res) => {
    try {
        const comment = await Comment.create({
            postId: req.params.id,
            authorId: req.user.id,
            content: req.body.content
        });

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upvote post
// @route   POST /api/community/posts/:id/upvote
// @access  Private
exports.upvotePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.upvotes.includes(req.user.id)) {
            return res.status(400).json({ message: "Already upvoted" });
        }

        post.upvotes.push(req.user.id);
        await post.save();

        res.json({ message: "Post upvoted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
