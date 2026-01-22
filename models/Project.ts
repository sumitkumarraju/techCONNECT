import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  code: { type: String, default: '// Start coding here...' },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  versionHistory: [{
    code: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
