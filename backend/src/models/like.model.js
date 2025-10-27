const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FoodItem",
        required: true
    }
}, { timestamps: true });

// Create compound index to prevent duplicate likes
likeSchema.index({ user: 1, food: 1 }, { unique: true });

const LikeModel = mongoose.model("likes", likeSchema);
module.exports = LikeModel;