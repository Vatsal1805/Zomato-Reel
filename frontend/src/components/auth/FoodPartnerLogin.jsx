import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/auth.css';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const FoodPartnerLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
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
    const { email, password } = formData;

    const response = await axios.post(
      API_ENDPOINTS.FOOD_PARTNER_LOGIN,
      { email, password },
      { withCredentials: true }
    );

    console.log("Food partner login success:", response.data);

    // Optionally, show a message or store data
    alert("Login successful!");

    // Navigate only after success
    navigate("/create-food-partner");
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      alert("Invalid email or password. Please try again.");
    } else {
      alert("Login failed. Please check your network or server.");
    }
  }
};


  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🏪</div>
          <h1 className="auth-title">Partner Dashboard</h1>
          <p className="auth-subtitle">Sign in to manage your restaurant</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Business Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="Enter your business email"
              value={formData.email}
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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--font-sm)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', color: 'var(--text-secondary)' }}>
                <input type="checkbox" />
                Remember me
              </label>
              <Link to="/partner/forgot-password" className="auth-link">
                Forgot password?
              </Link>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full">
            Sign In to Dashboard
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            New to our platform?{' '}
            <Link to="/food-partner/register" className="auth-link">
              Register as Partner
            </Link>
          </p>
          <div className="auth-divider">or</div>
          <p className="auth-footer-text">
            Are you a customer?{' '}
            <Link to="/user/login" className="auth-link">
              Customer Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;