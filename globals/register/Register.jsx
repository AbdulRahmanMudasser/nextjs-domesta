"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { userService } from "@/services/user.service";
import { utilityService } from "@/services/utility.service";
import { login } from "@/features/auth/authSlice";
import Form from "./FormContent";
import Link from "next/link";

const roleIdToSlug = {
  2: "admin",
  3: "agency",
  4: "employer",
  5: "employee",
  6: "user",
};

const Register = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js").then((bootstrap) => {
      window.bootstrap = bootstrap;
    });
  }, []);

  const cleanModalBackdrop = () => {
    const backdrop = document.querySelector(".modal-backdrop");
    if (backdrop) {
      backdrop.classList.remove("show");
      backdrop.remove();
    }
    document.body.classList.remove("modal-open");
  };

  const closeModal = () => {
    const modalElement = document.getElementById("registerModal");
    if (modalElement) {
      const modalInstance = window.bootstrap?.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
    setTimeout(() => {
      cleanModalBackdrop();
    }, 300);
  };

  const handleFormSubmit = async (formData) => {
    try {
      console.log("Form data sent to registerUser:", formData);
      const res = await userService.registerUser(formData);
      console.log("Registration Response:", res);

      if (!res || typeof res !== "object") {
        console.error("Invalid response:", res);
        await utilityService.showAlert("Error", "Registration failed: Invalid response from server.", "error");
        return;
      }

      if (!res.token || !res.role_id) {
        console.error("Missing token or role_id:", res);
        await utilityService.showAlert("Error", "Registration failed: Missing token or role_id.", "error");
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

      closeModal();

      switch (slug) {
        case "admin":
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
          await utilityService.showAlert("Info", "User role registered. Please log in.", "info");
          router.push("/login");
          break;
        default:
          await utilityService.showAlert("Error", "Unknown role. Please contact support.", "error");
          router.push("/login");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      await utilityService.showAlert("Error", `Registration failed: ${error.message || "Server error."}`, "error");
    }
  };

  return (
    <div className="form-inner">
      <h3>Create a Domesta Account</h3>
      <Form onSubmit={handleFormSubmit} />
      <div className="bottom-box">
        <div className="text">
          Already have an account?{" "}
          <Link
            href="#"
            className="call-modal login"
            data-bs-toggle="modal"
            data-bs-dismiss="modal"
            data-bs-target="#loginPopupModal"
            style={{ cursor: "pointer", textDecoration: "underline" }}
          >
            LogIn
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;