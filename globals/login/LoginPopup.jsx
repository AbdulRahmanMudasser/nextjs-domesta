"use client";

import Register from "../register/Register";
import FormContent from "./FormContent";
import { userService } from "@/services/user.service";
import { utilityService } from "@/services/utility.service";
import { useDispatch } from "react-redux";
import { login } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";

const roleIdToSlug = {
  2: "super-admin",
  3: "agency",
  4: "employer",
  5: "employee",
  6: "user",
};

const LoginPopup = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleRegisterSubmit = async (formData) => {
    console.log("Received registration data:", formData);
    try {
      const res = await userService.registerUser(formData);
      console.log("Registration API Response:", res);

      if (!res || !res.token || !res.role_id) {
        await utilityService.showAlert(
          "Error",
          "Registration failed: Invalid response from server.",
          "error"
        );
        return;
      }

      await utilityService.showAlert(
        "Success",
        "Registration successful!",
        "success"
      );

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
        error.message || "Registration failed. Please try again.",
        "error"
      );
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

  const handleFormSubmit = async (formData) => {
    console.log("Received login data in LoginPopup:", formData);
    if (!formData || !formData.email || !formData.password) {
      console.error("Invalid login data:", formData);
      await utilityService.showAlert(
        "Error",
        "Please provide email and password",
        "error"
      );
      return;
    }

    try {
      const res = await userService.loginUser(formData);
      console.log("Login API Response:", res);

      if (!res || !res.token || !res.role_id) {
        console.error("Invalid login response:", res);
        await utilityService.showAlert(
          "Error",
          "Login failed: Invalid response from server.",
          "error"
        );
        return;
      }

      const slug = roleIdToSlug[res.role_id] || "user";
      console.log("Mapped role_id:", res.role_id, "to slug:", slug);

      const loginData = {
        token: res.token,
        user: {
          id: res.id,
          email: res.email,
          first_name: res.first_name,
          last_name: res.last_name,
          role: { slug },
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
        case "employer":
          router.push("/panels/employer/dashboard");
          break;
        case "agency":
          router.push("/panels/agency/dashboard");
          break;
        case "employee":
          router.push("/panels/employee/dashboard");
          break;
        case "user":
          await utilityService.showAlert(
            "Info",
            "User role logged in. Please proceed.",
            "info"
          );
          router.push("/login");
          break;
        default:
          await utilityService.showAlert(
            "Error",
            "Unknown role. Please contact support.",
            "error"
          );
          router.push("/login");
      }
    } catch (error) {
      console.error("Login Error:", error);
      await utilityService.showAlert(
        "Error",
        error.message || "Login failed. Please try again.",
        "error"
      );
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