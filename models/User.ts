import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: 'Passionate about building scalable web applications.' },
  skills: { type: [String], default: ['React', 'Node.js', 'MongoDB', 'Tailwind'] }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
