'use client'

import Register from "../register/Register";
import FormContent from "./FormContent";
import { userService } from "@/services/user.service";
import { utilityService } from "@/services/utility.service";
import { useDispatch } from "react-redux";
import { login } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";

const LoginPopup = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  // Handle registration form submission
  const handleRegisterSubmit = async (formData) => {
    console.log("Received registration data:", formData);
    try {
      const res = await userService.registerUser(formData); // Fix: Using registerUser instead of loginUser
      console.log("Registration API Response:", res);

      if (!res || !res.success) {
        await utilityService.showAlert(
          "Error",
          res?.message || "Something went wrong, please try again later",
          "error"
        );
        return;
      }

      await utilityService.showAlert(
        "Success",
        "Registration successful!",
        "success"
      );
      // Close modal
      const modal = document.getElementById("registerModal");
      if (modal) {
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
        }
      }
    } catch (error) {
      console.error("Registration Error:", error);
      await utilityService.showAlert(
        "Error",
        error.message || "Something went wrong, please try again later",
        "error"
      );
    }
  };

  // Handle switching to the register modal
  const handleSwitchRegister = () => {
    const loginModal = document.getElementById("loginPopupModal");
    const registerModal = document.getElementById("registerModal");

    if (loginModal) {
      const loginModalInstance = bootstrap.Modal.getInstance(loginModal);
      if (loginModalInstance) {
        loginModalInstance.hide();
      }

      document.querySelector(".modal-backdrop").classList.remove("show");
      document.querySelector(".modal-backdrop").remove();
    }

    if (registerModal) {
      const registerModalInstance = new bootstrap.Modal(registerModal);
      registerModalInstance.show();
    }
  };

  // Handle login form submission
  const handleFormSubmit = async (formData) => {
    console.log("Received login data in LoginPopup:", formData);
    if (!formData || !formData.email || !formData.password) {
      console.error("Invalid login data:", formData);
      await utilityService.showAlert(
        "Error",
        "Please provide username and password",
        "error"
      );
      return;
    }

    try {
      const res = await userService.loginUser(formData);
      console.log("Login API Response:", res);

      if (!res || !res.user) {
        return;
      }

      // Dispatch login action
      dispatch(login(res));

      // Close modal
      const modal = document.getElementById("loginPopupModal");
      if (modal) {
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
        }
      }

      // Remove modal-backdrop if it remains
      const backdrop = document.querySelector(".modal-backdrop.fade.show");
      if (backdrop) {
        backdrop.parentNode.removeChild(backdrop);
      }

      document.body.classList.remove("modal-open"); // Remove Bootstrap's modal-open class
      document.querySelector(".modal-backdrop").classList.remove("show");
      document.querySelector(".modal-backdrop").remove();

      const userData = res.user; // Use 'res' instead of 'd'
      console.log("User data:", userData);

      // Navigate based on role
      switch (userData.role.slug) {
        case "employer":
          router.push("/panels/employer/dashboard");
          break;
        case "employee":
          router.push("/panels/employee/dashboard");
          break;
        case "agency":
          router.push("/panels/agency/dashboard");
          break;
        case "super-admin":
          router.push("/panels/superadmin/dashboard");
          break;
        default:
          router.push("/login"); // If role not found, redirect to login
          console.log("Unknown role:", userData.role);
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  return (
    <>
      <div className="modal fade" id="loginPopupModal">
        <div className="modal-dialog modal-lg modal-dialog-centered login-modal modal-dialog-scrollable">
          <div className="modal-content">
            <button
              type="button"
              className="closed-modal"
              data-bs-dismiss="modal"
            ></button>
            {/* End close modal btn */}

            <div className="modal-body">
              <div id="login-modal">
                <div className="login-form default-form">
                  <FormContent onSubmit={handleFormSubmit} onSwitchRegister={handleSwitchRegister} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="registerModal">
        <div className="modal-dialog modal-lg modal-dialog-centered login-modal modal-dialog-scrollable">
          <div className="modal-content">
            <button
              type="button"
              className="closed-modal"
              data-bs-dismiss="modal"
            ></button>
            {/* End close modal btn */}

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
    </>
  );
};

export default LoginPopup;