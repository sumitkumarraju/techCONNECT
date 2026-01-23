const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
    getMessages,
    sendMessage
} = require("../controllers/message.controller");

router.get("/projects/:id/messages", protect, getMessages);
router.post("/projects/:id/messages", protect, sendMessage);

module.exports = router;
