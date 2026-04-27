import mongoose from 'mongoose';

const DiscussionSchema = new mongoose.Schema({
    type: { type: String, enum: ['project', 'community'], required: true, default: 'project' },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }, // Required if type is project

    title: { type: String, required: true },
    content: { type: String, default: "" }, // Optional body text

    tags: [{ type: String }],

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Counters regarding engagement
    viewCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Discussion || mongoose.model('Discussion', DiscussionSchema);
