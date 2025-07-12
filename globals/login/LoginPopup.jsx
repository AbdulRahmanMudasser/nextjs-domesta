'use client';

import React, { useState } from 'react';
import Register from '../register/Register';
import FormContent from './FormContent';
import { userService } from '@/services/user.service';
import { notificationService } from '@/services/notification.service';
import { useDispatch } from 'react-redux';
import { login } from '@/features/auth/authSlice';
import { useRouter } from 'next/navigation';
import { modalUtils } from '@/utils/modalUtils';

const roleIdToSlug = {
  1: 'super-admin',
  2: 'admin',
  3: 'hr',
  4: 'employee',
};

const LoginPopup = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: '',
    type_id: 1,
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegisterSubmit = async (formData) => {
    try {
      const res = await userService.registerUser(formData);
      if (!res || !res.token || !res.role_id) {
        await notificationService.showToast(
          'Registration failed: Invalid response from server.',
          'error'
        );
        return;
      }

      await notificationService.showToast('Registration successful!', 'success');
      modalUtils.closeModal('registerModal');
    } catch (error) {
      await notificationService.showToast(
        error.message || 'Registration failed. Please try again.',
        'error'
      );
    }
  };

  const handleSwitchRegister = () => {
    modalUtils.switchModal('loginPopupModal', 'registerModal');
  };

  const handleSwitchForgotPassword = () => {
    modalUtils.switchModal('loginPopupModal', 'forgotPasswordModal');
  };

  const handleSwitchLogin = () => {
    modalUtils.switchModal('forgotPasswordModal', 'loginPopupModal');
  };

  const handleFormSubmit = async (formData) => {
    if (!formData?.email || !formData?.password) {
      await notificationService.showToast('Please provide email and password', 'error');
      return;
    }

    if (!validateEmail(formData.email)) {
      await notificationService.showToast('Please enter a valid email address', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await userService.loginUser(formData);
      setLoading(false);

      if (!res || !res.token) {
        await notificationService.showToast(
          `Login failed: ${res?.error || 'Invalid response from server.'}`,
          'error'
        );
        return;
      }

      const roleId = res.role_id ?? null;
      const slug = roleIdToSlug[roleId] || 'user';
      const loginData = {
        token: res.token,
        user: {
          id: res.id,
          email: res.email,
          first_name: res.first_name,
          last_name: res.last_name,
          role: {
            id: roleId,
            slug,
          },
        },
      };

      dispatch(login(loginData));
      await notificationService.showToast('Login successful!', 'success');
      modalUtils.closeModal('loginPopupModal');

      switch (slug) {
        case 'super-admin':
          router.push('/panels/superadmin/dashboard');
          break;
        case 'admin':
          router.push('/panels/employer/dashboard');
          break;
        case 'hr':
          router.push('/panels/agency/dashboard');
          break;
        case 'employee':
          router.push('/panels/employee/dashboard');
          break;
        case 'user':
          await notificationService.showToast('User role logged in. Please proceed.', 'info');
          router.push('/login');
          break;
        default:
          await notificationService.showToast('Unknown role. Please contact support.', 'error');
          router.push('/login');
      }
    } catch (error) {
      setLoading(false);
      await notificationService.showToast(
        error.message || 'Login failed. Please try again.',
        'error'
      );
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();

    if (!forgotPasswordData.email) {
      await notificationService.showToast('Please provide email', 'error');
      return;
    }

    if (!validateEmail(forgotPasswordData.email)) {
      await notificationService.showToast('Please enter a valid email address', 'error');
      return;
    }

    try {
      const res = await userService.forgotPassword(forgotPasswordData);
      if (res?.status) {
        await notificationService.showToast('Reset password link sent to your email.', 'success');
        modalUtils.closeModal('forgotPasswordModal');
        setForgotPasswordData({ email: '', type_id: 1 });
      } else {
        await notificationService.showToast('Failed to send reset password request.', 'error');
      }
    } catch (error) {
      await notificationService.showToast(
        error.message || 'Failed to send reset password request.',
        'error'
      );
    }
  };

  const handleForgotPasswordChange = (e) => {
    const { name, value } = e.target;
    setForgotPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className="modal fade" id="loginPopupModal">
        <div className="modal-dialog modal-lg modal-dialog-centered login-modal modal-dialog-scrollable">
          <div className="modal-content">
            <button type="button" className="closed-modal" data-bs-dismiss="modal"></button>
            <div className="modal-body">
              <div id="login-modal">
                <div className="login-form default-form">
                  <FormContent
                    onSubmit={handleFormSubmit}
                    onSwitchRegister={handleSwitchRegister}
                    onSwitchForgotPassword={handleSwitchForgotPassword}
                    loading={loading}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="registerModal">
        <div className="modal-dialog modal-lg modal-dialog-centered login-modal modal-dialog-scrollable">
          <div className="modal-content">
            <button type="button" className="closed-modal" data-bs-dismiss="modal"></button>
            <div className="modal-body">
              <div id="login-modal">
                <div className="login-form default-form">
                  <Register onSubmit={handleRegisterSubmit} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="forgotPasswordModal">
        <div className="modal-dialog modal-lg modal-dialog-centered login-modal modal-dialog-scrollable">
          <div className="modal-content">
            <button type="button" className="closed-modal" data-bs-dismiss="modal"></button>
            <div className="modal-body" style={{ padding: '2rem' }}>
              <div id="forgot-password-modal">
                <div className="login-form default-form">
                  <h3 style={{ margin: '0 0 1.5rem 0' }}>Forgot Password</h3>
                  <form onSubmit={handleForgotPasswordSubmit}>
                    <div className="form-group">
                      <label style={{ marginBottom: '0.5rem' }}>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={forgotPasswordData.email}
                        onChange={handleForgotPasswordChange}
                        placeholder="Email"
                        required
                        className="form-control"
                        style={{ backgroundColor: '#f0f5f7' }}
                      />
                      <div className="invalid-feedback">
                        Please enter a valid email address.
                      </div>
                    </div>
                    <div className="form-group" style={{ textAlign: 'right' }}>
                      <span
                        className="call-modal text"
                        onClick={handleSwitchLogin}
                        style={{ cursor: 'pointer', textDecoration: 'underline', display: 'block', margin: '0 0 1rem 0' }}
                      >
                        Back to Login
                      </span>
                    </div>
                    <div className="form-group">
                      <button className="theme-btn btn-style-one" type="submit">
                        Send Reset Request
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPopup;