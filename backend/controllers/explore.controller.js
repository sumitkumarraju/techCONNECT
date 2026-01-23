const Project = require("../models/Project");

// @desc    Get public projects (Explore)
// @route   GET /api/explore/projects
// @access  Public
exports.getPublicProjects = async (req, res) => {
    try {
        const { tech, search } = req.query;

        let query = { isPublic: true };

        if (tech) {
            query.techStack = { $in: [tech] };
        }

        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        const projects = await Project.find(query)
            .populate("ownerId", "name username")
            .sort({ createdAt: -1 });

        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
