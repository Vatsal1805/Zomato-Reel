const express=require('express');
const cookieParser=require('cookie-parser');
const authRoute=require('./routes/auth.route');
const foodRoutes=require('./routes/food.route');
const foodPartnerRoute=require('./routes/food-partner.route');
const cors=require('cors');


const app=express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? [
            process.env.FRONTEND_URL || "https://zomato-reel-sepia.vercel.app",
            "https://zomato-reel-sepia.vercel.app"
          ]
        : ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5177"],
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}))

app.get("/",(req,res)=>{
    res.send("Welcome to Zomato-reel Backend");
})

app.use("/api/auth",authRoute);
app.use("/api/food",foodRoutes);
app.use("/api/foodpartner", foodPartnerRoute);
module.exports=app;