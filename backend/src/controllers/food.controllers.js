const FoodItemModel = require("../models/fooditem.model");
const { authenticateFoodPartner } = require("../middlewares/auth.middlewares");
const storageService = require("../services/storage.service");
const {v4:uuid} = require("uuid");
async function addFoodItem(req, res) {
    try {
        console.log("Starting food item creation...");
        console.log("Food Partner ID:", req.foodPartner._id);
        console.log("Food Item Name:", req.body.name);
        console.log("File size:", req.file ? `${(req.file.size / 1024 / 1024).toFixed(2)} MB` : 'No file');

        if (!req.file) {
            return res.status(400).json({
                message: "Video file is required"
            });
        }

        // Check file size (50MB limit)
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (req.file.size > maxSize) {
            return res.status(400).json({
                message: "File size too large. Maximum size is 50MB."
            });
        }

        console.log("Starting video upload to ImageKit...");
        const uploadStartTime = Date.now();
        
        const fileUploadResult = await storageService.uploadImage(
            req.file.buffer, 
            `${uuid()}-${req.body.name.replace(/[^a-zA-Z0-9]/g, '-')}`
        );

        const uploadEndTime = Date.now();
        console.log(`Video upload completed in ${uploadEndTime - uploadStartTime}ms`);
        console.log("Upload result URL:", fileUploadResult.url);

        console.log("Creating food item in database...");
        const fooditem = await FoodItemModel.create({
            name: req.body.name,
            description: req.body.description,
            foodPartner: req.foodPartner._id,
            videoUrl: fileUploadResult.url
        });

        console.log("Food item created successfully:", fooditem._id);
        
        res.status(201).json({
            message: "Food item added successfully",
            food: {
                _id: fooditem._id,
                name: fooditem.name,
                description: fooditem.description,
                videoUrl: fooditem.videoUrl,
                createdAt: fooditem.createdAt
            }
        });
    } catch (error) {
        console.error("Error creating food item:", error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: "Validation error",
                details: error.message
            });
        }
        
        if (error.message && error.message.includes('timeout')) {
            return res.status(408).json({
                message: "Upload timeout. Please try with a smaller file or check your connection."
            });
        }
        
        res.status(500).json({
            message: "Failed to add food item",
            error: error.message
        });
    }
}

async function getAllFoodItems(req, res) {
    try {
        const foodItems = await FoodItemModel.find()
            .populate("foodPartner", "restaurantName ownerName email")
            .sort({ createdAt: -1 }); // Sort by newest first
        
        res.status(200).json({
            message: "Food items fetched successfully",
            foodItems,
            count: foodItems.length
        });
    } catch (error) {
        console.error("Error fetching food items:", error);
        res.status(500).json({ 
            message: "Failed to fetch food items",
            error: error.message 
        });
    }   
}






module.exports = { addFoodItem, getAllFoodItems };