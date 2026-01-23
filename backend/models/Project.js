const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please add a project name"],
            trim: true
        },
        description: {
            type: String,
            required: [true, "Please add a description"]
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        isPublic: {
            type: Boolean,
            default: false
        },
        techStack: [String]
    },
    {
        timestamps: true
    }
);

// Indexes for My Projects dashboard
projectSchema.index({ ownerId: 1 });
projectSchema.index({ members: 1 });

module.exports = mongoose.model("Project", projectSchema);
