const mongoose=require('mongoose');


function connectDB(){
    mongoose.connect(process.env.MONGO_URI, {
        ssl: true,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    })
    .then(()=>{
        console.log("DB connected");
    })
    .catch((err)=>{
        console.log("DB connection failed",err);
    })
}

module.exports=connectDB;