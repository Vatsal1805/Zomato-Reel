import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/auth.css';

const ChooseRegister = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🍜</div>
          <h1 className="auth-title">Welcome to Zomato Reel</h1>
          <p className="auth-subtitle">Your favorite food, delivered fast</p>
        </div>

        <div className="auth-form">
          <h3 style={{ color: 'var(--text-primary)', marginBottom: 'var(--spacing-md)', textAlign: 'center' }}>
            Choose your role
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            <Link to="/user/login" className="btn btn-primary btn-full" style={{ textDecoration: 'none' }}>
              Continue as Customer
            </Link>
            <Link to="/food-partner/login" className="btn btn-secondary btn-full" style={{ textDecoration: 'none' }}>
              Continue as Food Partner
            </Link>
          </div>
        </div>

        <div className="auth-footer">
          <div className="auth-divider">New here?</div>
          <div style={{ 
            display: 'flex', 
            gap: 'var(--spacing-md)', 
            justifyContent: 'center',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <Link to="/user/register" className="auth-link">
              Register as Customer
            </Link>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <Link to="/food-partner/register" className="auth-link">
              Register as Partner
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseRegister;