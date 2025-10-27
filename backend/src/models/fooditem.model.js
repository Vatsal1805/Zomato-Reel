const mongoose = require('mongoose');
const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
       
    },
    // price: {
    //     type: Number,
    //     required: true
    // },
    videoUrl:{
        type: String,
        required: true
    },
    foodPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'foodPartners',
    },
    likeCount: {
        type: Number,
        default: 0
    },
    commentCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });


const FoodItemModel = mongoose.model('FoodItem', foodSchema);

module.exports = FoodItemModel;
