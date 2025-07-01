"use client";

import { useState, useEffect } from "react";
import { userService } from "@/services/user.service";
import { notificationService } from "@/services/notification.service";

// Fallback roles without "User"
const fallbackRoles = [
  { id: 1, name: "Admin", slug: "super-admin" },
  { id: 2, name: "Employer", slug: "admin" },
  { id: 3, name: "Agency", slug: "hr" },
  { id: 4, name: "Employee", slug: "employee" },
];

const FormContent = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    role_id: "", // Keep string to allow select placeholder
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Fetching roles from /user/role/list-with-filters");
      const fetchedRoles = await userService.getRolesWithFilters();
      console.log("Fetched roles in FormContent:", fetchedRoles);
      if (fetchedRoles && Array.isArray(fetchedRoles)) {
        setRoles(fetchedRoles); // Already filtered in user.service.jsx
      } else {
        setRoles(fallbackRoles);
        setError("Failed to load roles from server. Using default roles.");
      }
    } catch (error) {
      console.error("Error fetching roles in FormContent:", error);
      setRoles(fallbackRoles);
      setError("Failed to fetch roles. Using default roles.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "role_id" ? (value ? parseInt(value, 10) : "") : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.role_id === "") {
      await notificationService.showToast("Please select a role.", "error");
      return;
    }

    if (!formData.email.includes("@")) {
      await notificationService.showToast("Invalid email address.", "error");
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      await notificationService.showToast("Passwords do not match.", "error");
      return;
    }

    // Build payload for POST
    const dataToSend = { ...formData };
    onSubmit(dataToSend); // Let parent send POST request
  };

  return (
    <form onSubmit={handleSubmit} className="needs-validation" noValidate>
      <div className="form-group mb-3">
        <label htmlFor="role_id" className="form-label">Role</label>
        {isLoading ? (
          <div className="d-flex align-items-center p-2" style={{ backgroundColor: "#f0f5f7", borderRadius: "4px" }}>
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
          style={{ backgroundColor: "#f0f5f7" }}
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

      <div className="form-group mb-3">
        <label htmlFor="first_name" className="form-label">First Name</label>
        <input
          id="first_name"
          type="text"
          name="first_name"
          required
          value={formData.first_name}
          onChange={handleChange}
          className="form-control"
          style={{ backgroundColor: "#f0f5f7" }}
        />
        <div className="invalid-feedback">
          Please enter your first name.
        </div>
      </div>

      <div className="form-group mb-3">
        <label htmlFor="middle_name" className="form-label">Middle Name</label>
        <input
          id="middle_name"
          type="text"
          name="middle_name"
          value={formData.middle_name}
          onChange={handleChange}
          className="form-control"
          style={{ backgroundColor: "#f0f5f7" }}
        />
      </div>

      <div className="form-group mb-3">
        <label htmlFor="last_name" className="form-label">Last Name</label>
        <input
          id="last_name"
          type="text"
          name="last_name"
          required
          value={formData.last_name}
          onChange={handleChange}
          className="form-control"
          style={{ backgroundColor: "#f0f5f7" }}
        />
        <div className="invalid-feedback">
          Please enter your last name.
        </div>
      </div>

      <div className="form-group mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="form-control"
          style={{ backgroundColor: "#f0f5f7" }}
        />
        <div className="invalid-feedback">
          Please enter a valid email address.
        </div>
      </div>

      <div className="form-group mb-3">
        <label htmlFor="password" className="form-label">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          required
          value={formData.password}
          onChange={handleChange}
          className="form-control"
          style={{ backgroundColor: "#f0f5f7" }}
        />
        <div className="invalid-feedback">
          Please enter a password.
        </div>
      </div>

      <div className="form-group mb-3">
        <label htmlFor="password_confirmation" className="form-label">Confirm Password</label>
        <input
          id="password_confirmation"
          type="password"
          name="password_confirmation"
          required
          value={formData.password_confirmation}
          onChange={handleChange}
          className="form-control"
          style={{ backgroundColor: "#f0f5f7" }}
        />
        <div className="invalid-feedback">
          Please confirm your password.
        </div>
      </div>

      <div className="form-group mb-3">
        <button className="theme-btn btn-style-one w-100" type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
    </form>
  );
};

export default FormContent;