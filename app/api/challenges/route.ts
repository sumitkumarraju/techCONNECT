import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';

const ChallengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  category: { type: String, required: true },
  solvers: { type: Number, default: 0 }
});

const Challenge = mongoose.models.Challenge || mongoose.model('Challenge', ChallengeSchema);

export const dynamic = 'force-dynamic';

export async function GET() {
  await dbConnect();
  // Seeding initial data if empty
  const count = await Challenge.countDocuments();
  if (count === 0) {
    await Challenge.create([
      { title: 'Array Manipulation Basics', description: 'Optimize a function to reverse an array in-place.', difficulty: 'Easy', category: 'Algorithms', solvers: 1204 },
      { title: 'Load Balancer Logic', description: 'Design a round-robin distribution system.', difficulty: 'Hard', category: 'System Design', solvers: 342 }
    ]);
  }

  const challenges = await Challenge.find({});
  return NextResponse.json(challenges);
}
