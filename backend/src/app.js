const express=require('express');
const cookieParser=require('cookie-parser');
const authRoute=require('./routes/auth.route');
const foodRoutes=require('./routes/food.route');
const cors=require('cors');


const app=express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin:["http://localhost:5173"],
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}))

app.get("/",(req,res)=>{
    res.send("Welcome to Zomato-reel Backend");
})

app.use("/api/auth",authRoute);
app.use("/api/food",foodRoutes);
module.exports=app;