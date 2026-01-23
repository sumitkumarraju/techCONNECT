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

  const challenges = await Challenge.find({});
  return NextResponse.json(challenges);
}
