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
  1: "super-admin",
  2: "admin",
  3: "hr",
  4: "employee",
};

const Register = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js").then((bootstrap) => {
      window.bootstrap = bootstrap;
    });
  }, []);

  const closeModal = () => {
    const modal = document.getElementById("registerModal");
    const instance = window.bootstrap?.Modal.getInstance(modal);
    instance?.hide();
    document.querySelector(".modal-backdrop")?.remove();
    document.body.classList.remove("modal-open");
  };

  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);
      const res = await userService.registerUser(formData); // 🔥 POST method
      setLoading(false);

      if (!res || !res.token) {
        await utilityService.showAlert("Error", "Registration failed. Invalid response.", "error");
        return;
      }

      const slug = roleIdToSlug[res.role_id] || "user"; // Fallback to 'user' if no role_id

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
        default:
          await utilityService.showAlert("Info", "Registration successful. Please log in.", "info");
          router.push("/login");
      }
    } catch (error) {
      setLoading(false);
      await utilityService.showAlert("Error", `Registration failed: ${error.message || "Server error"}`, "error");
    }
  };

  return (
    <div className="form-inner">
      <h3>Create a Domesta Account</h3>
      <Form onSubmit={handleFormSubmit} loading={loading} />
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
