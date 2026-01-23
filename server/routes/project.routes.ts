import express from 'express';
import protect from '../middleware/auth';
import {
    createProject,
    getMyProjects,
    getProjectById,
    joinProject,
    updateProject,
    deleteProject
} from '../controllers/project.controller';

const router = express.Router();

router.post("/", protect, createProject);
router.get("/my", protect, getMyProjects);
router.get("/:id", protect, getProjectById);
router.post("/:id/join", protect, joinProject);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

export default router;
