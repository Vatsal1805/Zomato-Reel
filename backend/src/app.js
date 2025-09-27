const express=require('express');
const cookieParser=require('cookie-parser');
const authRoute=require('./routes/auth.route');

const app=express();

app.use(cookieParser());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Welcome to Zomato-reel Backend");
})

app.use("/api/auth",authRoute);
module.exports=app;