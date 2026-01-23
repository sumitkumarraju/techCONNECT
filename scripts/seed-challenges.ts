
import mongoose from 'mongoose';
import dbConnect from '../lib/db';

const ChallengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  category: { type: String, required: true },
  solvers: { type: Number, default: 0 }
});

const Challenge = mongoose.models.Challenge || mongoose.model('Challenge', ChallengeSchema);

async function seed() {
  try {
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Connected.');

    const count = await Challenge.countDocuments();
    if (count === 0) {
      console.log('Seeding initial data...');
      await Challenge.create([
        { title: 'Array Manipulation Basics', description: 'Optimize a function to reverse an array in-place.', difficulty: 'Easy', category: 'Algorithms', solvers: 1204 },
        { title: 'Load Balancer Logic', description: 'Design a round-robin distribution system.', difficulty: 'Hard', category: 'System Design', solvers: 342 }
      ]);
      console.log('Seeding complete.');
    } else {
      console.log('Database already has data. Skipping seed.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    // We can't easily disconnect the cached connection from dbConnect in this context without potentially affecting other things if it were a long running app,
    // but here it is a script.
    // dbConnect returns a connection.
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
    console.log('Done.');
  }
}

seed();
