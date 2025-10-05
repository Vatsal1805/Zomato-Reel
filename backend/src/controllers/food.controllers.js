const FoodItemModel = require("../models/fooditem.model");
const { authenticateFoodPartner } = require("../middlewares/auth.middlewares");
const storageService = require("../services/storage.service");
const {v4:uuid} = require("uuid");
async function addFoodItem(req, res) {
    // console.log(req.foodPartner);
    //console.log(req.body);
    // console.log(req.file); 
    const fileUploadResult = await storageService.uploadImage(
        req.file.buffer, 
        uuid()
    );

    const fooditem=await FoodItemModel.create({
        name:req.body.name,
        description:req.body.description,
       // price:req.body.price,   
        foodPartner:req.foodPartner._id,
        videoUrl:fileUploadResult.url
    });
    res.status(201).json({
        message: "Food item added successfully",
        food:fooditem
    });
}

async function getAllFoodItems(req, res) {
    try {
        const foodItems = await FoodItemModel.find().populate("foodPartner", "name email");
        res.status(200).json({
            message: "Food items fetched successfully",
            foodItems
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
}






module.exports = { addFoodItem, getAllFoodItems };