const Message = require("../models/Message");

// @desc    Get project messages
// @route   GET /api/projects/:id/messages
// @access  Private
exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find({ projectId: req.params.id })
            .populate("senderId", "name username")
            .sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Send message
// @route   POST /api/projects/:id/messages
// @access  Private
exports.sendMessage = async (req, res) => {
    try {
        const message = await Message.create({
            projectId: req.params.id,
            senderId: req.user.id,
            content: req.body.content
        });

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
