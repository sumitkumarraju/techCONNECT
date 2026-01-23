const Project = require("../models/Project");

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res) => {
    try {
        const project = await Project.create({
            name: req.body.name,
            ownerId: req.user.id,
            members: [req.user.id],
            isPublic: req.body.isPublic || false,
            techStack: req.body.techStack || []
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get projects of logged-in user
// @route   GET /api/projects/my
// @access  Private
exports.getMyProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            members: req.user.id
        }).sort({ updatedAt: -1 });

        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Check membership
        if (!project.members.includes(req.user.id)) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Join project
// @route   POST /api/projects/:id/join
// @access  Private
exports.joinProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project || !project.isPublic) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.members.includes(req.user.id)) {
            return res.status(400).json({ message: "Already a member" });
        }

        project.members.push(req.user.id);
        await project.save();

        res.json({ message: "Joined project successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Owner only)
exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Only owner can update project" });
        }

        project.name = req.body.name || project.name;
        project.description = req.body.description || project.description;
        project.isPublic = req.body.isPublic ?? project.isPublic;
        project.techStack = req.body.techStack || project.techStack;

        await project.save();
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Owner only)
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Only owner can delete project" });
        }

        await project.deleteOne();
        res.json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
