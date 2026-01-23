import express from 'express';
import protect from '../middleware/auth';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/task.controller';

const router = express.Router();

router.get("/projects/:id/tasks", protect, getTasks);
router.post("/projects/:id/tasks", protect, createTask);
router.put("/tasks/:taskId", protect, updateTask);
router.delete("/tasks/:taskId", protect, deleteTask);

export default router;
