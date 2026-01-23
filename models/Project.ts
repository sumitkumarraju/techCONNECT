import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },

  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  isPublic: { type: Boolean, default: false },
  techStack: [{ type: String }],
}, { timestamps: true });

// Optional index for Explore page queries and Dashboard optimization
ProjectSchema.index({ isPublic: 1, createdAt: -1 });
ProjectSchema.index({ ownerId: 1 });
ProjectSchema.index({ members: 1 });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
