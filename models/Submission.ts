import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
    challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    code: { type: String, required: true },
    language: { type: String, required: true },

    status: { type: String, enum: ['pending', 'accepted', 'rejected', 'error'], default: 'pending' },
    score: { type: Number, default: 0 },
    result: { type: String }, // Detail msg e.g. "Passed 3/3 tests" or error

    submittedAt: { type: Date, default: Date.now }
});

// Indexes for faster queries
SubmissionSchema.index({ challengeId: 1, userId: 1 });
SubmissionSchema.index({ userId: 1, status: 1 }); // For User Profile stats

export default mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);
