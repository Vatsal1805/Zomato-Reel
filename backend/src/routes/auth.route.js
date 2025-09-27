const express=require('express');
const router=express.Router();
const authController=require('../controllers/auth.controllers.js');

router.post('/user/register',authController.registerUser);
router.post('/user/login',authController.loginUser);





module.exports=router;