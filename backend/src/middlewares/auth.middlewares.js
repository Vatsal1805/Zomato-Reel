const FoodPartnerModel=require("../models/foodPartner.model");
const UserModel=require("../models/user.modle");
const jwt=require('jsonwebtoken');

async function authenticateFoodPartner(req,res,next){
    try {
        const token=req.cookies.token || req.header("Authorization")?.replace("Bearer ","");
        if(!token){
            return res.status(401).json({message:"No token provided"});
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const foodPartner=await FoodPartnerModel.findById(decoded.id);
        if(!foodPartner){
            return res.status(401).json({message:"Invalid token"});
        }
        req.foodPartner=foodPartner;
        next();
    }
    catch (error) {
        return res.status(401).json({message:"Invalid token"});
    }
    
}

async function authenticateUser(req,res,next){
    try {
        const token=req.cookies.token || req.header("Authorization")?.replace("Bearer ","");
        if(!token){
            return res.status(401).json({message:"Please login to continue"});
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user=await UserModel.findById(decoded.id);
        if(!user){
            return res.status(401).json({message:"Invalid token"});
        }
        req.user=user;
        next();
    }
    catch (error) {
        return res.status(401).json({message:"Invalid token"});
    }
}


module.exports={authenticateFoodPartner,authenticateUser};