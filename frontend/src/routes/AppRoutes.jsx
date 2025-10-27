import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserRegister, UserLogin, FoodPartnerRegister, FoodPartnerLogin } from '../components/auth';
import ChooseRegister from '../components/ChooseRegister';
import Home from '../components/general/Home';
import CreateFood from '../components/food-partner/createFood';
import Profile from '../components/food-partner/Profile';
const AppRoutes = () => {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<ChooseRegister />}/>
            <Route path="/home" element={<Home />}/>
            <Route path="/user/register" element={<UserRegister />}/>
            <Route path="/user/login" element={<UserLogin />}/>
            <Route path="/food-partner/register" element={<FoodPartnerRegister />}/>
            <Route path="/food-partner/login" element={<FoodPartnerLogin />}/>
            <Route path="/create-food-partner" element={<CreateFood />}/>
            <Route path="/partner/:partnerId" element={<Profile />}/>
        </Routes>
    </Router>
  );
}

export default AppRoutes;