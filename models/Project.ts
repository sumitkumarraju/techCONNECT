import mongoose from 'mongoose';
import crypto from 'crypto';

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

  // Room code for easy sharing/inviting
  roomCode: { type: String, unique: true, sparse: true, index: true },
}, { timestamps: true });

// Optional index for Explore page queries
ProjectSchema.index({ isPublic: 1, createdAt: -1 });

// Generate a unique 6-char room code
ProjectSchema.statics.generateRoomCode = async function (): Promise<string> {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I/O/0/1 to avoid confusion
  let code: string;
  let exists = true;

  while (exists) {
    code = '';
    const bytes = crypto.randomBytes(6);
    for (let i = 0; i < 6; i++) {
      code += chars[bytes[i] % chars.length];
    }
    // Check uniqueness
    const existing = await mongoose.models.Project?.findOne({ roomCode: code });
    exists = !!existing;
  }

  return code!;
};

// Auto-generate room code before saving if not set
ProjectSchema.pre('save', async function (next) {
  if (!this.roomCode) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code: string;
    let exists = true;
    let attempts = 0;

    while (exists && attempts < 10) {
      code = '';
      const bytes = crypto.randomBytes(6);
      for (let i = 0; i < 6; i++) {
        code += chars[bytes[i] % chars.length];
      }
      const existing = await mongoose.models.Project?.findOne({ roomCode: code });
      exists = !!existing;
      attempts++;
    }

    this.roomCode = code!;
  }
  next();
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
