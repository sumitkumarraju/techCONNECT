import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
    challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    code: { type: String, required: true },
    language: { type: String, required: true },

    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    score: { type: Number },

    submittedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);
