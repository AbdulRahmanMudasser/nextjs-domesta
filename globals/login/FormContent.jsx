'use client';

import { useState } from 'react';
import Link from 'next/link';

const FormContent = ({ onSubmit, onSwitchRegister, onSwitchForgotPassword, loading = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');

    let isValid = true;

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (!validatePassword(password)) {
      setPasswordError(
        'Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character'
      );
      isValid = false;
    }

    if (isValid) {
      const formData = { email, password, rememberMe };
      console.log('Submitting login form:', formData);
      onSubmit(formData);
    }
  };

  const handleSignup = () => {
    console.log('Clicked Signup link');
    onSwitchRegister();
  };

  const handleForgotPassword = () => {
    console.log('Clicked Forgot Password link');
    onSwitchForgotPassword();
  };

  return (
    <div className="form-inner">
      <h3 style={{ margin: '0 0 1.5rem 0' }}>Login to Domesta</h3>
      <form onSubmit={handleSubmit} className="needs-validation" noValidate>
        <div className="form-group">
          <label style={{ marginBottom: '0.5rem' }}>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`form-control ${emailError ? 'is-invalid' : ''}`}
            style={{ backgroundColor: '#f0f5f7' }}
          />
          {emailError && <div className="invalid-feedback">{emailError}</div>}
        </div>
        <div className="form-group">
          <label style={{ marginBottom: '0.5rem' }}>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`form-control ${passwordError ? 'is-invalid' : ''}`}
            style={{ backgroundColor: '#f0f5f7' }}
          />
          {passwordError && <div className="invalid-feedback">{passwordError}</div>}
        </div>
        <div className="form-group" style={{ textAlign: 'right' }}>
          <span
            className="call-modal text"
            onClick={handleForgotPassword}
            style={{ cursor: 'pointer', textDecoration: 'underline', display: 'block', margin: '0 0 1rem 0' }}
          >
            Forgot Password?
          </span>
        </div>
        <div className="form-group">
          <button
            className="theme-btn btn-style-one"
            type="submit"
            name="log-in"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </div>
      </form>
      <div className="bottom-box">
        <div className="text">
          Don't have an account?{' '}
          <span
            className="call-modal signup"
            onClick={handleSignup}
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
          >
            Signup
          </span>
        </div>
      </div>
    </div>
  );
};

export default FormContent;