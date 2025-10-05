const express = require('express');
const router=express.Router();
const foodController=require('../controllers/food.controllers.js');
const { authenticateFoodPartner, authenticateUser } = require("../middlewares/auth.middlewares");
const multer = require('multer');

const upload=multer({
    storage: multer.memoryStorage(),
})


router.post('/', authenticateFoodPartner,upload.single("video"), foodController.addFoodItem);
router.get('/',authenticateUser,foodController.getAllFoodItems);





module.exports = router;