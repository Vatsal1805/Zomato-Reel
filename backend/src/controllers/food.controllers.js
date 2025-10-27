const FoodItemModel = require("../models/fooditem.model");
const { authenticateFoodPartner } = require("../middlewares/auth.middlewares");
const storageService = require("../services/storage.service");
const {v4:uuid} = require("uuid");
const LikeModel = require("../models/like.model");
const SaveModel = require("../models/save.model");
const CommentModel = require("../models/comment.model");
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
        const user = req.user;
        
        const foodItems = await FoodItemModel.find()
            .populate("foodPartner", "restaurantName ownerName email")
            .sort({ createdAt: -1 }); // Sort by newest first
        
        // Get user's liked and saved items for each food item with counts
        const foodItemsWithStatus = await Promise.all(
            foodItems.map(async (item) => {
                const isLiked = await LikeModel.findOne({ 
                    user: user._id, 
                    food: item._id 
                });
                const isSaved = await SaveModel.findOne({ 
                    user: user._id, 
                    food: item._id 
                });
                
                // Get actual counts from database
                const likeCount = await LikeModel.countDocuments({ food: item._id });
                const commentCount = await CommentModel.countDocuments({ 
                    food: item._id, 
                    parentComment: null // Only count top-level comments
                });
                
                return {
                    ...item.toObject(),
                    isLiked: !!isLiked,
                    isSaved: !!isSaved,
                    likeCount: likeCount,
                    commentCount: commentCount
                };
            })
        );
        
        res.status(200).json({
            message: "Food items fetched successfully",
            foodItems: foodItemsWithStatus,
            count: foodItemsWithStatus.length
        });
    } catch (error) {
        console.error("Error fetching food items:", error);
        res.status(500).json({ 
            message: "Failed to fetch food items",
            error: error.message 
        });
    }   
}

async function likefoodItem(req, res) {
    try {
        const { id } = req.body;
        const user = req.user;
        
        if (!id) {
            return res.status(400).json({
                message: "Food item ID is required"
            });
        }
        
        const isAlreadyLiked = await LikeModel.findOne({
            user: user._id,
            food: id
        });
        
        if (isAlreadyLiked) {
            await LikeModel.deleteOne({
                user: user._id,
                food: id
            });
            await FoodItemModel.findByIdAndUpdate(id, {
                $inc: { likeCount: -1 }
            });
            return res.status(200).json({
                message: "Food item unliked successfully",
                liked: false
            });
        }
        
        const like = await LikeModel.create({
            user: user._id,
            food: id
        });
        
        await FoodItemModel.findByIdAndUpdate(id, {
            $inc: { likeCount: 1 }
        });
        
        res.status(200).json({
            message: "Food item liked successfully",
            liked: true,
            like
        });
    } catch (error) {
        console.error("Error liking food item:", error);
        res.status(500).json({
            message: "Failed to like food item",
            error: error.message
        });
    }
}

async function savefooditem(req, res) {
    try {
        const { id } = req.body;
        const user = req.user;
        
        if (!id) {
            return res.status(400).json({
                message: "Food item ID is required"
            });
        }
        
        const isAlreadySaved = await SaveModel.findOne({
            user: user._id,
            food: id
        });
        
        if (isAlreadySaved) {
            await SaveModel.deleteOne({
                user: user._id,
                food: id
            });
            
            return res.status(200).json({
                message: "Food item unsaved successfully",
                saved: false
            });
        }
        
        const save = await SaveModel.create({
            user: user._id,
            food: id
        });
        
        res.status(200).json({
            message: "Food item saved successfully",
            saved: true,
            save
        });
    } catch (error) {
        console.error("Error saving food item:", error);
        res.status(500).json({
            message: "Failed to save food item",
            error: error.message
        });
    }
}

async function getUserLikedItems(req, res) {
    try {
        const user = req.user;
        
        const likedItems = await LikeModel.find({ user: user._id })
            .populate({
                path: 'food',
                populate: {
                    path: 'foodPartner',
                    select: 'restaurantName ownerName email'
                }
            })
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            message: "Liked items fetched successfully",
            likedItems: likedItems.map(like => like.food),
            count: likedItems.length
        });
    } catch (error) {
        console.error("Error fetching liked items:", error);
        res.status(500).json({
            message: "Failed to fetch liked items",
            error: error.message
        });
    }
}

async function getUserSavedItems(req, res) {
    try {
        const user = req.user;
        
        const savedItems = await SaveModel.find({ user: user._id })
            .populate({
                path: 'food',
                populate: {
                    path: 'foodPartner',
                    select: 'restaurantName ownerName email'
                }
            })
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            message: "Saved items fetched successfully",
            savedItems: savedItems.map(save => save.food),
            count: savedItems.length
        });
    } catch (error) {
        console.error("Error fetching saved items:", error);
        res.status(500).json({
            message: "Failed to fetch saved items",
            error: error.message
        });
    }
}

// Comment Functions
async function addComment(req, res) {
    try {
        const { foodId, text, parentCommentId } = req.body;
        const user = req.user;
        
        if (!foodId) {
            return res.status(400).json({
                message: "Food item ID is required"
            });
        }
        
        if (!text || text.trim().length === 0) {
            return res.status(400).json({
                message: "Comment text is required"
            });
        }
        
        if (text.trim().length > 500) {
            return res.status(400).json({
                message: "Comment text cannot exceed 500 characters"
            });
        }
        
        // Check if food item exists
        const foodItem = await FoodItemModel.findById(foodId);
        if (!foodItem) {
            return res.status(404).json({
                message: "Food item not found"
            });
        }
        
        // If it's a reply, check if parent comment exists
        if (parentCommentId) {
            const parentComment = await CommentModel.findById(parentCommentId);
            if (!parentComment) {
                return res.status(404).json({
                    message: "Parent comment not found"
                });
            }
        }
        
        // Create the comment
        const comment = await CommentModel.create({
            user: user._id,
            food: foodId,
            text: text.trim(),
            parentComment: parentCommentId || null
        });
        
        // If it's a reply, add it to parent's replies array
        if (parentCommentId) {
            await CommentModel.findByIdAndUpdate(parentCommentId, {
                $push: { replies: comment._id }
            });
        } else {
            // Only increment comment count for top-level comments, not replies
            await FoodItemModel.findByIdAndUpdate(foodId, {
                $inc: { commentCount: 1 }
            });
        }
        
        // Populate the comment with user info
        const populatedComment = await CommentModel.findById(comment._id)
            .populate('user', 'fullName email')
            .populate('parentComment', 'text user');
        
        res.status(201).json({
            message: "Comment added successfully",
            comment: populatedComment
        });
        
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({
            message: "Failed to add comment",
            error: error.message
        });
    }
}

async function getComments(req, res) {
    try {
        const { foodId } = req.params;
        const { page = 1, limit = 20, sortBy = 'newest' } = req.query;
        
        if (!foodId) {
            return res.status(400).json({
                message: "Food item ID is required"
            });
        }
        
        // Set sorting option
        let sortOption = { createdAt: -1 }; // newest first
        if (sortBy === 'oldest') {
            sortOption = { createdAt: 1 };
        } else if (sortBy === 'popular') {
            sortOption = { likeCount: -1, createdAt: -1 };
        }
        
        const skip = (page - 1) * limit;
        
        // Get only top-level comments (no parent comment)
        const comments = await CommentModel.find({ 
            food: foodId, 
            parentComment: null 
        })
        .populate('user', 'fullName email')
        .populate({
            path: 'replies',
            populate: {
                path: 'user',
                select: 'fullName email'
            },
            options: { 
                sort: { createdAt: 1 }, // replies sorted oldest first
                limit: 3 // limit initial replies shown
            }
        })
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit));
        
        const totalComments = await CommentModel.countDocuments({ 
            food: foodId, 
            parentComment: null 
        });
        
        res.status(200).json({
            message: "Comments fetched successfully",
            comments,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalComments / limit),
                totalComments,
                hasNext: skip + comments.length < totalComments,
                hasPrev: page > 1
            }
        });
        
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({
            message: "Failed to fetch comments",
            error: error.message
        });
    }
}

async function deleteComment(req, res) {
    try {
        const { commentId } = req.params;
        const user = req.user;
        
        if (!commentId) {
            return res.status(400).json({
                message: "Comment ID is required"
            });
        }
        
        const comment = await CommentModel.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }
        
        // Check if user owns the comment
        if (comment.user.toString() !== user._id.toString()) {
            return res.status(403).json({
                message: "You can only delete your own comments"
            });
        }
        
        // If comment has replies, don't delete but mark as deleted
        if (comment.replies && comment.replies.length > 0) {
            await CommentModel.findByIdAndUpdate(commentId, {
                text: "[Comment deleted]",
                user: null
            });
            
            return res.status(200).json({
                message: "Comment marked as deleted (has replies)"
            });
        }
        
        // Delete the comment completely if no replies
        await CommentModel.findByIdAndDelete(commentId);
        
        // Remove from parent's replies if it's a reply
        if (comment.parentComment) {
            await CommentModel.findByIdAndUpdate(comment.parentComment, {
                $pull: { replies: commentId }
            });
        } else {
            // Only decrement comment count for top-level comments
            await FoodItemModel.findByIdAndUpdate(comment.food, {
                $inc: { commentCount: -1 }
            });
        }
        
        res.status(200).json({
            message: "Comment deleted successfully"
        });
        
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({
            message: "Failed to delete comment",
            error: error.message
        });
    }
}

async function updateComment(req, res) {
    try {
        const { commentId } = req.params;
        const { text } = req.body;
        const user = req.user;
        
        if (!commentId) {
            return res.status(400).json({
                message: "Comment ID is required"
            });
        }
        
        if (!text || text.trim().length === 0) {
            return res.status(400).json({
                message: "Comment text is required"
            });
        }
        
        if (text.trim().length > 500) {
            return res.status(400).json({
                message: "Comment text cannot exceed 500 characters"
            });
        }
        
        const comment = await CommentModel.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }
        
        // Check if user owns the comment
        if (comment.user.toString() !== user._id.toString()) {
            return res.status(403).json({
                message: "You can only edit your own comments"
            });
        }
        
        // Update the comment
        const updatedComment = await CommentModel.findByIdAndUpdate(
            commentId,
            { text: text.trim() },
            { new: true }
        ).populate('user', 'fullName email');
        
        res.status(200).json({
            message: "Comment updated successfully",
            comment: updatedComment
        });
        
    } catch (error) {
        console.error("Error updating comment:", error);
        res.status(500).json({
            message: "Failed to update comment",
            error: error.message
        });
    }
}

async function getReplies(req, res) {
    try {
        const { commentId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        
        if (!commentId) {
            return res.status(400).json({
                message: "Comment ID is required"
            });
        }
        
        const skip = (page - 1) * limit;
        
        const replies = await CommentModel.find({ parentComment: commentId })
            .populate('user', 'fullName email')
            .sort({ createdAt: 1 }) // replies sorted oldest first
            .skip(skip)
            .limit(parseInt(limit));
        
        const totalReplies = await CommentModel.countDocuments({ parentComment: commentId });
        
        res.status(200).json({
            message: "Replies fetched successfully",
            replies,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalReplies / limit),
                totalReplies,
                hasNext: skip + replies.length < totalReplies,
                hasPrev: page > 1
            }
        });
        
    } catch (error) {
        console.error("Error fetching replies:", error);
        res.status(500).json({
            message: "Failed to fetch replies",
            error: error.message
        });
    }
}

module.exports = { 
    addFoodItem, 
    getAllFoodItems, 
    likefoodItem, 
    savefooditem,
    getUserLikedItems,
    getUserSavedItems,
    addComment,
    getComments,
    deleteComment,
    updateComment,
    getReplies
};