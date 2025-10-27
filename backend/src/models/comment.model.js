const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FoodItem",
        required: true
    },
    text: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comments",
        default: null
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "comments"
    }],
    likeCount: {
        type: Number,
        default: 0
    }
}, { 
    timestamps: true 
});

// Index for better query performance
commentSchema.index({ food: 1, createdAt: -1 });
commentSchema.index({ user: 1 });
commentSchema.index({ parentComment: 1 });

const CommentModel = mongoose.model("comments", commentSchema);
module.exports = CommentModel;