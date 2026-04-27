import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    // Polymorphic: Can belong to a Post (Feed) or a Discussion (Project/Community)
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    discussionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Discussion' },

    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
