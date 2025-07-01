"use client";

import React, { useState } from "react";
import Register from "../register/Register";
import FormContent from "./FormContent";
import { userService } from "@/services/user.service";
import { utilityService } from "@/services/utility.service";
import { useDispatch } from "react-redux";
import { login } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";

const roleIdToSlug = {
  1: "super-admin", // Admin
  2: "admin",       // Employer
  3: "hr",          // Agency
  4: "employee",    // Employee
};

const LoginPopup = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: "",
    type_id: 1,
  });

  const handleRegisterSubmit = async (formData) => {
    try {
      const res = await userService.registerUser(formData);
      if (!res || !res.token || !res.role_id) {
        await utilityService.showAlert(
          "Error",
          "Registration failed: Invalid response from server.",
          "error"
        );
        return;
      }

      await utilityService.showAlert("Success", "Registration successful!", "success");

      const modal = document.getElementById("registerModal");
      if (modal) {
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
        }
      }
    } catch (error) {
      await utilityService.showAlert("Error", error.message || "Registration failed. Please try again.", "error");
    }
  };

  const handleSwitchRegister = () => {
    const loginModal = document.getElementById("loginPopupModal");
    const registerModal = document.getElementById("registerModal");

    if (loginModal) {
      const loginModalInstance = bootstrap.Modal.getInstance(loginModal);
      if (loginModalInstance) {
        loginModalInstance.hide();
      }

      document.querySelector(".modal-backdrop")?.classList.remove("show");
      document.querySelector(".modal-backdrop")?.remove();
    }

    if (registerModal) {
      const registerModalInstance = new bootstrap.Modal(registerModal);
      registerModalInstance.show();
    }
  };

  const handleSwitchForgotPassword = () => {
    const loginModal = document.getElementById("loginPopupModal");
    const forgotPasswordModal = document.getElementById("forgotPasswordModal");

    if (loginModal) {
      const loginModalInstance = bootstrap.Modal.getInstance(loginModal);
      if (loginModalInstance) {
        loginModalInstance.hide();
      }

      document.querySelector(".modal-backdrop")?.classList.remove("show");
      document.querySelector(".modal-backdrop")?.remove();
    }

    if (forgotPasswordModal) {
      const forgotPasswordModalInstance = new bootstrap.Modal(forgotPasswordModal);
      forgotPasswordModalInstance.show();
    }
  };

  const handleFormSubmit = async (formData) => {
    if (!formData?.email || !formData?.password) {
      await utilityService.showAlert("Error", "Please provide email and password", "error");
      return;
    }

    try {
      setLoading(true);
      const res = await userService.loginUser(formData);
      setLoading(false);

      if (!res || !res.token) {
        await utilityService.showAlert(
          "Error",
          `Login failed: ${res?.error || "Invalid response from server."}`,
          "error"
        );
        return;
      }

      const roleId = res.role_id ?? null;
      const slug = roleIdToSlug[roleId] || "user";
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

      const modal = document.getElementById("loginPopupModal");
      if (modal) {
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
        }
      }

      document.querySelector(".modal-backdrop")?.classList.remove("show");
      document.querySelector(".modal-backdrop")?.remove();
      document.body.classList.remove("modal-open");

      switch (slug) {
        case "super-admin":
          router.push("/panels/superadmin/dashboard");
          break;
        case "admin":
          router.push("/panels/employer/dashboard");
          break;
        case "hr":
          router.push("/panels/agency/dashboard");
          break;
        case "employee":
          router.push("/panels/employee/dashboard");
          break;
        case "user":
          await utilityService.showAlert("Info", "User role logged in. Please proceed.", "info");
          router.push("/login");
          break;
        default:
          await utilityService.showAlert("Error", "Unknown role. Please contact support.", "error");
          router.push("/login");
      }
    } catch (error) {
      setLoading(false);
      await utilityService.showAlert("Error", error.message || "Login failed. Please try again.", "error");
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();

    if (!forgotPasswordData.email) {
      await utilityService.showAlert("Error", "Please provide email", "error");
      return;
    }

    try {
      const res = await userService.forgotPassword(forgotPasswordData);
      if (res?.status) {
        await utilityService.showAlert("Success", "Reset password link sent to your email.", "success");
        const modal = document.getElementById("forgotPasswordModal");
        if (modal) {
          const modalInstance = bootstrap.Modal.getInstance(modal);
          if (modalInstance) {
            modalInstance.hide();
          }
        }
        setForgotPasswordData({ email: "", type_id: 1 });
      } else {
        await utilityService.showAlert("Error", "Failed to send reset password request.", "error");
      }
    } catch (error) {
      await utilityService.showAlert("Error", error.message || "Failed to send reset password request.", "error");
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

      {/* Register Modal */}
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

      {/* Forgot Password Modal */}
      <div className="modal fade" id="forgotPasswordModal">
        <div className="modal-dialog modal-lg modal-dialog-centered login-modal modal-dialog-scrollable">
          <div className="modal-content">
            <button type="button" className="closed-modal" data-bs-dismiss="modal"></button>
            <div className="modal-body" style={{ padding: "2rem" }}>
              <div id="forgot-password-modal">
                <div className="login-form default-form">
                  <h3 style={{ margin: "0 0 1.5rem 0" }}>Forgot Password</h3>
                  <form onSubmit={handleForgotPasswordSubmit}>
                    <div className="form-group">
                      <label style={{ marginBottom: "0.5rem" }}>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={forgotPasswordData.email}
                        onChange={handleForgotPasswordChange}
                        placeholder="Email"
                        required
                        className="form-control"
                        style={{ backgroundColor: "#f0f5f7" }}
                      />
                      <div className="invalid-feedback">
                        Please enter a valid email address.
                      </div>
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