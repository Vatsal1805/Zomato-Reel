const mongoose=require('mongoose');


const foodPartnerSchema=new mongoose.Schema({   
    restaurantName:{type:String,required:true},
    ownerName:{type:String,required:true},  
    phone:{type:Number,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    address:{type:String,required:true},
    password:{type:String,required:true},
})

const FoodPartnerModel=mongoose.model("foodPartners",foodPartnerSchema);
module.exports=FoodPartnerModel;