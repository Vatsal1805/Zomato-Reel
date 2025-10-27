import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/auth.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../config/api';

const UserRegister = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const navigate=useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
    // Extract data from formData state
    const {fullName, email, phone, password} = formData;
    const phoneNumber = phone; // Map phone to phoneNumber for backend

    const response = await axios.post(API_ENDPOINTS.USER_REGISTER,{
      fullName,
      email,
      phoneNumber,
      password
    },{
      withCredentials:true
    });
    
    console.log('User registration successful:', response.data);
    alert('Registration successful!');
    navigate("/home");
  } catch(error){
    console.error('Registration failed:', error.response?.data || error.message);
    alert(`Registration failed: ${error.response?.data?.message || error.message}`);
  }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🍜</div>
          <h1 className="auth-title">Join Zomato Reel</h1>
          <p className="auth-subtitle">Create your account to start ordering</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="form-input"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="form-input"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              inputMode="numeric"
              pattern="[0-9]*"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full">
            Create Account
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Already have an account?{' '}
            <Link to="/user/login" className="auth-link">
              Sign In
            </Link>
          </p>
          <div className="auth-divider">or</div>
          <p className="auth-footer-text">
            Want to become a partner?{' '}
            <Link to="/food-partner/register" className="auth-link">
              Register as Food Partner
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;