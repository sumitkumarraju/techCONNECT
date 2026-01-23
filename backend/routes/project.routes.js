const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
    createProject,
    getMyProjects,
    getProjectById,
    joinProject,
    updateProject,
    deleteProject
} = require("../controllers/project.controller");

router.post("/", protect, createProject);
router.get("/my", protect, getMyProjects);
router.get("/:id", protect, getProjectById);
router.post("/:id/join", protect, joinProject);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

module.exports = router;
