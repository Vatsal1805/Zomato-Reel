const UserModel=require('../models/user.modle');
const FoodPartnerModel=require('../models/foodPartner.model');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');


async function registerUser(req,res){
    try {
        const {fullName,email,password,phoneNumber}=req.body;
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
            password:hashedPassword,
            phoneNumber
        });

        const token=jwt.sign({id:newUser._id,


        },process.env.JWT_SECRET)

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(201).json({
            message:"User registered successfully",
            user:{
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                phoneNumber:newUser.phoneNumber
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
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
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

async function registerFoodPartner(req, res) {
    try {
        const { restaurantName, email, password,phone,ownerName,address } = req.body;
        const existingPartner = await FoodPartnerModel.findOne({ email });
        if (existingPartner) {
            return res.status(400).json({ message: "Food Partner already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newPartner = await FoodPartnerModel.create({
            restaurantName,
            email,
            password: hashedPassword,
            phone,ownerName,address    
            });

        const token = jwt.sign({ id: newPartner._id }, process.env.JWT_SECRET);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(201).json({
            message: "Food Partner registered successfully",
            partner: {
                _id: newPartner._id,
                restaurantName: newPartner.restaurantName,
                email: newPartner.email,
                ownerName: newPartner.ownerName,
                address: newPartner.address,
                phone: newPartner.phone,
                password:newPartner.password
                
            },
            token
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function loginFoodPartner(req, res) {
    const { email, password } = req.body;
    try {
        const partner = await FoodPartnerModel.findOne({ email });
        if (!partner) {
            return res.status(400).json({ message: "Food Partner does not exist" });
        }

        const isPasswordValid = await bcrypt.compare(password, partner.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: partner._id }, process.env.JWT_SECRET);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({
            message: "Food Partner logged in successfully",
            partner: {
                _id: partner._id,
                name: partner.name,
                email: partner.email
            },
            token
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


async function logoutFoodPartner(req,res){
    res.clearCookie("token");
    res.status(200).json({message:"Food Partner logged out successfully"});
}   



module.exports={registerUser,loginUser,logoutUser,registerFoodPartner,loginFoodPartner,logoutFoodPartner};