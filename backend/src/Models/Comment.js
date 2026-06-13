// models/Comment.js
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({

    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    content: {
        type: String,
        required: true,
        trim: true
    },

    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },

    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },

    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],


}, {
    timestamps: true
});

// ایندکس برای جستجوی سریع
commentSchema.index({ courseId: 1, createdAt: -1 });
commentSchema.index({ parentId: 1 });

const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);

export default Comment;