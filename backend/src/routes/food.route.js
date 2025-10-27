const express = require('express');
const router=express.Router();
const foodController=require('../controllers/food.controllers.js');
const { authenticateFoodPartner, authenticateUser } = require("../middlewares/auth.middlewares");
const multer = require('multer');

const upload=multer({
    storage: multer.memoryStorage(),
})


router.post('/', authenticateFoodPartner, upload.single("video"), foodController.addFoodItem);
router.get('/', authenticateUser, foodController.getAllFoodItems);
router.post('/like', authenticateUser, foodController.likefoodItem);
router.post('/save', authenticateUser, foodController.savefooditem);
router.get('/liked', authenticateUser, foodController.getUserLikedItems);
router.get('/saved', authenticateUser, foodController.getUserSavedItems);

// Comment routes
router.post('/comments', authenticateUser, foodController.addComment);
router.get('/comments/:foodId', authenticateUser, foodController.getComments);
router.put('/comments/:commentId', authenticateUser, foodController.updateComment);
router.delete('/comments/:commentId', authenticateUser, foodController.deleteComment);
router.get('/comments/:commentId/replies', authenticateUser, foodController.getReplies);




module.exports = router;