"use client";

import { useState, useEffect } from "react";
import { userService } from "@/services/user.service";
import { utilityService } from "@/services/utility.service";

// Fallback roles for development
const fallbackRoles = [
  { id: 2, name: "Admin", slug: "admin" },
  { id: 3, name: "Agency", slug: "agency" },
  { id: 4, name: "Employer", slug: "employer" },
  { id: 5, name: "Employee", slug: "employee" },
  { id: 6, name: "User", slug: "user" },
];

const FormContent = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    role_id: "",
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
      const fetchedRoles = await userService.getRoles();
      console.log("Fetched roles in FormContent:", fetchedRoles);
      if (fetchedRoles && Array.isArray(fetchedRoles)) {
        setRoles(fetchedRoles);
      } else {
        console.warn("No valid roles array received, using fallback roles:", fetchedRoles);
        setRoles(fallbackRoles);
        setError("Failed to load roles from server. Using default roles.");
      }
    } catch (error) {
      console.error("Error fetching roles in FormContent:", error);
      setError("Failed to load roles due to a server issue. Using default roles.");
      setRoles(fallbackRoles);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "role_id" ? (value ? parseInt(value, 10) : "") : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.role_id || isNaN(formData.role_id)) {
      await utilityService.showAlert("Error", "Please select a valid role.", "error");
      return;
    }

    if (!formData.email.includes("@")) {
      await utilityService.showAlert("Error", "Please enter a valid email address.", "error");
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      await utilityService.showAlert("Error", "Passwords do not match.", "error");
      return;
    }

    console.log("Submitting form data:", formData);
    onSubmit(formData);
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
            <button
              type="button"
              className="btn btn-link"
              onClick={fetchRoles}
            >
              Retry
            </button>
          </div>
        ) : roles.length === 0 ? (
          <p>No roles available.</p>
        ) : (
          <select
            name="role_id"
            required
            value={formData.role_id}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="form-group">
        <label>First Name</label>
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          required
          value={formData.first_name}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Middle Name</label>
        <input
          type="text"
          name="middle_name"
          placeholder="Middle Name"
          value={formData.middle_name}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Last Name</label>
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          required
          value={formData.last_name}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Email Address</label>
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          required
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Confirm Password</label>
        <input
          type="password"
          name="password_confirmation"
          placeholder="Confirm Password"
          required
          value={formData.password_confirmation}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <button className="theme-btn btn-style-one" type="submit">
          Register
        </button>
      </div>
    </form>
  );
};

export default FormContent;