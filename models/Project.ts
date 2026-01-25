import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },

  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

  // Updated members structure to support RBAC
  members: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['owner', 'editor', 'viewer'], default: 'viewer' },
    joinedAt: { type: Date, default: Date.now }
  }],

  isPublic: { type: Boolean, default: false },
  techStack: [{ type: String }],
}, { timestamps: true });

// Optional index for Explore page queries
ProjectSchema.index({ isPublic: 1, createdAt: -1 });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
