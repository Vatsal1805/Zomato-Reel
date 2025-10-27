const mongoose = require('mongoose');

const saveSchema = new mongoose.Schema({
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

// Create compound index to prevent duplicate saves
saveSchema.index({ user: 1, food: 1 }, { unique: true });

const SaveModel = mongoose.model("save", saveSchema);
module.exports = SaveModel;