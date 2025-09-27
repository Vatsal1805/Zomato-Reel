const UserModel=require('../models/user.modle');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
async function registerUser(req,res){
    try {
        const {fullName,email,password}=req.body;
        const existingUser=await UserModel.findOne({
            email
        })
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }

        const hashedPassword=await bcrypt.hash(password,10);

        const newUser=await UserModel.create({
            fullName,
            email,
            password:hashedPassword
        });

        const token=jwt.sign({id:newUser._id,


        },process.env.JWT_SECRET)

        res.cookie("token",token)

        res.status(201).json({
            message:"User registered successfully",
            user:{
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email
            },
            token
        })



    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

async function loginUser(req,res){
    const {email,password}=req.body;
    try{
        const user=await UserModel.findOne({email});
        if(!user){
            return res.status(400).json({message:"User does not exist"});
        }
        const isPasswordValid=await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(400).json({message:"Invalid credentials"});
        }

        const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
        res.cookie("token",token)
        res.status(200).json({
            message:"User logged in successfully",
            user:{
                _id:user._id,
                fullName:user.fullName,
                email:user.email
            },
            token
        })
    }
    catch(error){
        return res.status(500).json({message:error.message});
    }
}

async function logoutUser(req,res){
    res.clearCookie("token");
    res.status(200).json({message:"User logged out successfully"});
}

module.exports={registerUser,loginUser,logoutUser};