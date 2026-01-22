import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';

const DiscussionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  tags: [String],
  comments: { type: Number, default: 0 }
});

const Discussion = mongoose.models.Discussion || mongoose.model('Discussion', DiscussionSchema);

export const dynamic = 'force-dynamic';

export async function GET() {
  await dbConnect();
  const count = await Discussion.countDocuments();
  if (count === 0) {
    await Discussion.create([
      { title: 'Best practices for React Context API in 2026?', content: 'Wondering if Redux is still needed...', author: 'dev_mike', tags: ['React'], comments: 14 }
    ]);
  }
  const discussions = await Discussion.find({});
  return NextResponse.json(discussions);
}
