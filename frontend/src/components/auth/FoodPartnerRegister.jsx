import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/auth.css';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const FoodPartnerRegister = () => {
  const [formData, setFormData] = useState({
    restaurantName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { restaurantName, ownerName, email, phone, address, password } = formData;

      const response = await axios.post(
        API_ENDPOINTS.FOOD_PARTNER_REGISTER,
        { restaurantName, ownerName, email, phone, address, password },
        { withCredentials: true }
      );

      console.log('Registration successful:', response.data);

      alert('Registration successful!');
      navigate('/create-food-partner');
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
      alert('Registration failed. Please try again.');
    }
  };
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🏪</div>
          <h1 className="auth-title">Partner with Us</h1>
          <p className="auth-subtitle">Join as a food partner and grow your business</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="restaurantName" className="form-label">Restaurant Name</label>
            <input
              type="text"
              id="restaurantName"
              name="restaurantName"
              className="form-input"
              placeholder="Enter restaurant name"
              value={formData.restaurantName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="ownerName" className="form-label">Owner Name</label>
            <input
              type="text"
              id="ownerName"
              name="ownerName"
              className="form-input"
              placeholder="Enter owner's full name"
              value={formData.ownerName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Business Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="Enter business email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">Contact Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="form-input"
              placeholder="Enter contact number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address" className="form-label">Restaurant Address</label>
            <input
              type="text"
              id="address"
              name="address"
              className="form-input"
              placeholder="Enter complete address"
              value={formData.address}
              onChange={handleChange}
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
            Register as Partner
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Already a partner?{' '}
            <Link to="/food-partner/login" className="auth-link">
              Sign In
            </Link>
          </p>
          <div className="auth-divider">or</div>
          <p className="auth-footer-text">
            Looking to order food?{' '}
            <Link to="/user/register" className="auth-link">
              Register as Customer
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerRegister;