import mongoose from 'mongoose';

const CodeFileSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    name: { type: String, required: true },
    language: { type: String, required: true }, // 'javascript', 'python', etc.
    content: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Prevent duplicate filenames within the same project
CodeFileSchema.index({ projectId: 1, name: 1 }, { unique: true });

export default mongoose.models.CodeFile || mongoose.model('CodeFile', CodeFileSchema);
