"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userService } from "@/services/user.service";
import { notificationService } from "@/services/notification.service";
import Form from "./FormContent";
import Link from "next/link";
import Notification from "../Notifications";

const roleIdToSlug = {
  1: "super-admin",
  2: "admin",
  3: "hr",
  4: "employee",
};

const Register = () => {
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
      const res = await userService.registerUser(formData);
      setLoading(false);

      if (!res || !res.token) {
        await notificationService.showToast("Registration failed. Invalid response.", "error");
        return;
      }

      const slug = roleIdToSlug[res.role_id] || "user";

      localStorage.setItem("user", JSON.stringify({
        id: res.id,
        email: res.email,
        first_name: res.first_name,
        last_name: res.last_name,
        role_id: res.role_id,
      }));
      localStorage.setItem("token", res.token);

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
          await notificationService.showToast("Registration successful. Please log in.", "info");
          router.push("/login");
      }
    } catch (error) {
      setLoading(false);
      await notificationService.showToast(`Registration failed: ${error.message || "Server error"}`, "error");
    }
  };

  return (
    <div className="relative">
      <Notification />
      <div className="form-inner" style={{ maxWidth: "800px", margin: "0 auto" }}>
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
    </div>
  );
};

export default Register;