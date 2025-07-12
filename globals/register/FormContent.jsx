'use client';

import { useState, useEffect } from 'react';
import { userService } from '@/services/user.service';
import { notificationService } from '@/services/notification.service';
import Link from 'next/link';

// Fallback roles without "User"
const fallbackRoles = [
  { id: 1, name: 'Admin', slug: 'super-admin' },
  { id: 2, name: 'Employer', slug: 'admin' },
  { id: 3, name: 'Agency', slug: 'hr' },
  { id: 4, name: 'Employee', slug: 'employee' },
];

const FormContent = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    role_id: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching roles from /user/role/list-with-filters');
      const fetchedRoles = await userService.getRolesWithFilters();
      console.log('Fetched roles in FormContent:', fetchedRoles);
      if (fetchedRoles && Array.isArray(fetchedRoles)) {
        setRoles(fetchedRoles);
      } else {
        setRoles(fallbackRoles);
        setError('Failed to load roles from server. Using default roles.');
      }
    } catch (error) {
      console.error('Error fetching roles in FormContent:', error);
      setRoles(fallbackRoles);
      setError('Failed to fetch roles. Using default roles.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === 'role_id' ? (value ? parseInt(value, 10) : '') : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));

    // Clear errors when user types
    if (name === 'email') setEmailError('');
    if (name === 'password') setPasswordError('');
    if (name === 'password_confirmation') setConfirmPasswordError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    let isValid = true;

    if (formData.role_id === '') {
      await notificationService.showToast('Please select a role.', 'error');
      isValid = false;
    }

    if (!formData.email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!formData.password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (!validatePassword(formData.password)) {
      setPasswordError(
        'Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character'
      );
      isValid = false;
    }

    if (!formData.password_confirmation) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (formData.password !== formData.password_confirmation) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    if (isValid) {
      const dataToSend = { ...formData };
      onSubmit(dataToSend);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="needs-validation"
      noValidate
      style={{ maxWidth: '1000px', margin: '0 auto' }}
    >
      {/* Row 1: Role Dropdown */}
      <div className="form-group mb-3">
        <label htmlFor="role_id" className="form-label">Role</label>
        {isLoading ? (
          <div className="d-flex align-items-center p-2" style={{ backgroundColor: '', borderRadius: '4px' }}>
            <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span className="text-muted">Loading roles...</span>
          </div>
        ) : error ? (
          <div className="alert alert-warning d-flex align-items-center justify-content-between mb-2" role="alert">
            <div>
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={fetchRoles}
            >
              Retry
            </button>
          </div>
        ) : null}
        <select
          id="role_id"
          name="role_id"
          required
          value={formData.role_id}
          onChange={handleChange}
          className="form-control"
          disabled={isLoading}
          style={{ backgroundColor: '#f0f5f7' }}
        >
          <option value="">Select Role</option>
          {roles.map((role) => (
            <option key={role.slug} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
        <div className="invalid-feedback">
          Please select a role.
        </div>
      </div>

      {/* Row 2: First Name and Middle Name */}
      <div className="row mb-3">
        <div className="col-md-6 form-group">
          <label htmlFor="first_name" className="form-label">First Name</label>
          <input
            id="first_name"
            type="text"
            name="first_name"
            required
            value={formData.first_name}
            onChange={handleChange}
            className="form-control"
            style={{ backgroundColor: '#f0f5f7' }}
          />
          <div className="invalid-feedback">
            Please enter your first name.
          </div>
        </div>
        <div className="col-md-6 form-group">
          <label htmlFor="middle_name" className="form-label">Middle Name</label>
          <input
            id="middle_name"
            type="text"
            name="middle_name"
            value={formData.middle_name}
            onChange={handleChange}
            className="form-control"
            style={{ backgroundColor: '#f0f5f7' }}
          />
        </div>
      </div>

      {/* Row 3: Last Name and Email */}
      <div className="row mb-3">
        <div className="col-md-6 form-group">
          <label htmlFor="last_name" className="form-label">Last Name</label>
          <input
            id="last_name"
            type="text"
            name="last_name"
            required
            value={formData.last_name}
            onChange={handleChange}
            className="form-control"
            style={{ backgroundColor: '#f0f5f7' }}
          />
          <div className="invalid-feedback">
            Please enter your last name.
          </div>
        </div>
        <div className="col-md-6 form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className={`form-control ${emailError ? 'is-invalid' : ''}`}
            style={{ backgroundColor: '#f0f5f7' }}
          />
          {emailError && <div className="invalid-feedback">{emailError}</div>}
        </div>
      </div>

      {/* Row 4: Password and Confirm Password */}
      <div className="row mb-3">
        <div className="col-md-6 form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className={`form-control ${passwordError ? 'is-invalid' : ''}`}
            style={{ backgroundColor: '#f0f5f7' }}
          />
          {passwordError && <div className="invalid-feedback">{passwordError}</div>}
        </div>
        <div className="col-md-6 form-group">
          <label htmlFor="password_confirmation" className="form-label">Confirm Password</label>
          <input
            id="password_confirmation"
            type="password"
            name="password_confirmation"
            required
            value={formData.password_confirmation}
            onChange={handleChange}
            className={`form-control ${confirmPasswordError ? 'is-invalid' : ''}`}
            style={{ backgroundColor: '#f0f5f7' }}
          />
          {confirmPasswordError && <div className="invalid-feedback">{confirmPasswordError}</div>}
        </div>
      </div>

      <div className="form-group mb-3">
        <button
          className="theme-btn btn-style-one w-100"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </div>
    </form>
  );
};

export default FormContent;