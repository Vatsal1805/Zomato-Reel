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


        },"eeb59950fbcbbaf03b9f31152b77cdc1")

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

}

module.exports={registerUser,loginUser};