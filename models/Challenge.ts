import mongoose from 'mongoose';

const ChallengeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },

    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    points: { type: Number, required: true },
    tags: [{ type: String }],

    starterCode: { type: String, default: "" },
    testCases: [{
        input: { type: String, required: true },
        output: { type: String, required: true },
        isHidden: { type: Boolean, default: false }
    }],

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.models.Challenge || mongoose.model('Challenge', ChallengeSchema);
