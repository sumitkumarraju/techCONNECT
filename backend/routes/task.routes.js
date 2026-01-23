const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
    getTasks,
    createTask,
    updateTask,
    deleteTask
} = require("../controllers/task.controller");

router.get("/projects/:id/tasks", protect, getTasks);
router.post("/projects/:id/tasks", protect, createTask);
router.put("/tasks/:taskId", protect, updateTask);
router.delete("/tasks/:taskId", protect, deleteTask);

module.exports = router;
