"use client";

import { useState, useEffect } from "react";
import { userService } from "@/services/user.service";
import { utilityService } from "@/services/utility.service";

// Include User with no ID
const fallbackRoles = [
  { id: 1, name: "Admin", slug: "super-admin" },
  { id: 2, name: "Employer", slug: "admin" },
  { id: 3, name: "Agency", slug: "hr" },
  { id: 4, name: "Employee", slug: "employee" },
  { id: null, name: "User", slug: "user" },
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
      const fetchedRoles = await userService.getRoles();
      const userRole = { id: null, name: "User", slug: "user" };
      if (fetchedRoles && Array.isArray(fetchedRoles)) {
        setRoles(fallbackRoles);
      } else {
        setRoles(fallbackRoles);
        setError("Failed to load roles from server. Using fallback.");
      }
    } catch {
      setRoles(fallbackRoles);
      setError("Failed to fetch roles. Using fallback.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "role_id" ? (value ? parseInt(value, 10) || null : "") : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.role_id === "") {
      await utilityService.showAlert("Error", "Please select a role.", "error");
      return;
    }

    if (!formData.email.includes("@")) {
      await utilityService.showAlert("Error", "Invalid email address.", "error");
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      await utilityService.showAlert("Error", "Passwords do not match.", "error");
      return;
    }

    // 🔥 Build payload for POST
    const dataToSend = { ...formData };
    if (formData.role_id === null) {
      delete dataToSend.role_id; // Don't send role_id for user
    }

    onSubmit(dataToSend); // Let parent send POST request
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Role</label>
        {isLoading ? (
          <p>Loading roles...</p>
        ) : error ? (
          <div className="text-danger">
            <p>{error}</p>
            <button type="button" className="btn btn-link" onClick={fetchRoles}>
              Retry
            </button>
          </div>
        ) : (
          <select
            name="role_id"
            required
            value={formData.role_id ?? ""}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.slug} value={role.id ?? ""}>
                {role.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Name, Email, Password Fields (unchanged) */}
      <div className="form-group">
        <label>First Name</label>
        <input type="text" name="first_name" required value={formData.first_name} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Middle Name</label>
        <input type="text" name="middle_name" value={formData.middle_name} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Last Name</label>
        <input type="text" name="last_name" required value={formData.last_name} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input type="email" name="email" required value={formData.email} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input type="password" name="password" required value={formData.password} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Confirm Password</label>
        <input
          type="password"
          name="password_confirmation"
          required
          value={formData.password_confirmation}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <button className="theme-btn btn-style-one" type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
    </form>
  );
};

export default FormContent;
