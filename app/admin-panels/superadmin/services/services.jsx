"use client";

import React, { useState, useEffect } from "react";
import DsPageOuter from "@/templates/layouts/ds-page-outer";
import { ProfileTypes } from "@/data/globalKeys";
import ListingCategories from "@/app/website/home/Listingcategories/ListingCategories";
import jobCatContent from "@/data/job-catergories";
import Shimmer from "@/templates/misc/Shimmer";
import { userService } from "@/services/user.service";
import { utilityService } from "@/services/utility.service";
// Optional: Uncomment for react-select implementation
// import Select from "react-select";

const AddServiceModal = ({ isOpen, onClose, onSave, currentEntry, handleChange }) => {
  const buttonStyle = {
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "0.25rem",
    backgroundColor: "#8C956B",
    color: "white",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.5rem",
    borderRadius: "0.25rem",
    border: "1px solid #ddd",
    boxSizing: "border-box",
    fontSize: "0.875rem",
  };

  const selectStyle = {
    ...inputStyle,
    appearance: "none",
    background: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"10\" height=\"6\" viewBox=\"0 0 10 6\"><path fill=\"%23555\" d=\"M0 0l5 6 5-6H0z\"/></svg>') no-repeat right 1rem center",
    color: "#333", // Ensure text is visible
  };

  const formFields = [
    {
      type: "text",
      name: "catTitle",
      label: "Service Name",
      placeholder: "Enter service name",
      required: true,
    },
    {
      type: "text",
      name: "jobDescription",
      label: "Description",
      placeholder: "Enter description",
      required: true,
    },
  ];

  // Debug jobCatContent
  useEffect(() => {
    console.log("jobCatContent:", jobCatContent);
  }, []);

  // Optional: react-select implementation for icon + text dropdown
  /*
  const selectOptions = jobCatContent.map((cat) => ({
    value: cat.icon,
    label: cat.name,
    icon: cat.icon,
  }));

  const customOption = ({ innerProps, label, data }) => (
    <div {...innerProps} style={{ display: "flex", alignItems: "center", padding: "0.5rem" }}>
      <i className={data.icon} style={{ marginRight: "0.5rem", fontSize: "16px", color: "#555" }}></i>
      {label}
    </div>
  );

  const customSingleValue = ({ data }) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <i className={data.icon} style={{ marginRight: "0.5rem", fontSize: "16px", color: "#555" }}></i>
      {data.label}
    </div>
  );
  */

  return (
    <div
      style={{
        display: isOpen ? "flex" : "none",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          padding: "24px",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "400px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          zIndex: 1000,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h4 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#333", marginBottom: "1rem" }}>
          Add Service
        </h4>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(false);
          }}
        >
          {formFields.map((field, index) => (
            <div key={index} style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#555",
                  marginBottom: "0.3rem",
                }}
              >
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={currentEntry[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                min={field.min}
                style={inputStyle}
              />
            </div>
          ))}
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#555",
                marginBottom: "0.3rem",
              }}
            >
              Icon
            </label>
            {/* Native select */}
            <select
              name="icon"
              value={currentEntry.icon || ""}
              onChange={(e) => handleChange("icon", e.target.value)}
              required
              style={selectStyle}
            >
              <option value="" disabled>
                Select an icon
              </option>
              {jobCatContent.map((cat) => (
                <option key={cat.id} value={cat.icon}>
                  {cat.catTitle || "Unnamed Category"}
                </option>
              ))}
            </select>
            {/* Optional: react-select implementation */}
            {/*
            <Select
              options={selectOptions}
              value={selectOptions.find((option) => option.value === currentEntry.icon) || null}
              onChange={(selected) => handleChange("icon", selected ? selected.value : "")}
              components={{ Option: customOption, SingleValue: customSingleValue }}
              placeholder="Select an icon"
              styles={{
                control: (base) => ({
                  ...base,
                  ...inputStyle,
                  borderRadius: "0.25rem",
                  border: "1px solid #ddd",
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 1000,
                }),
              }}
            />
            */}
            {currentEntry.icon && (
              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "40px",
                  height: "40px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <i className={currentEntry.icon} style={{ fontSize: "20px", color: "#555" }}></i>
              </div>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "0.5rem 1rem",
                border: "1px solid #ddd",
                borderRadius: "0.25rem",
                backgroundColor: "#fff",
                color: "#333",
                cursor: "pointer",
                fontSize: "0.875rem",
              }}
            >
              Cancel
            </button>
            <button type="submit" style={buttonStyle}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditServiceModal = ({ isOpen, onClose, onSave, currentEntry, handleChange }) => {
  const buttonStyle = {
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "0.25rem",
    backgroundColor: "#8C956B",
    color: "white",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.5rem",
    borderRadius: "0.25rem",
    border: "1px solid #ddd",
    boxSizing: "border-box",
    fontSize: "0.875rem",
  };

  const selectStyle = {
    ...inputStyle,
    appearance: "none",
    background: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"10\" height=\"6\" viewBox=\"0 0 10 6\"><path fill=\"%23555\" d=\"M0 0l5 6 5-6H0z\"/></svg>') no-repeat right 1rem center",
    color: "#333", // Ensure text is visible
  };

  const formFields = [
    {
      type: "text",
      name: "catTitle",
      label: "Service Name",
      placeholder: "Enter service name",
      required: true,
    },
    {
      type: "text",
      name: "jobDescription",
      label: "Description",
      placeholder: "Enter description",
      required: true,
    },
  ];

  // Debug jobCatContent
  useEffect(() => {
    console.log("jobCatContent:", jobCatContent);
  }, []);

  // Optional: react-select implementation for icon + text dropdown
  /*
  const selectOptions = jobCatContent.map((cat) => ({
    value: cat.icon,
    label: cat.name,
    icon: cat.icon,
  }));

  const customOption = ({ innerProps, label, data }) => (
    <div {...innerProps} style={{ display: "flex", alignItems: "center", padding: "0.5rem" }}>
      <i className={data.icon} style={{ marginRight: "0.5rem", fontSize: "16px", color: "#555" }}></i>
      {label}
    </div>
  );

  const customSingleValue = ({ data }) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <i className={data.icon} style={{ marginRight: "0.5rem", fontSize: "16px", color: "#555" }}></i>
      {data.label}
    </div>
  );
  */

  return (
    <div
      style={{
        display: isOpen ? "flex" : "none",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          padding: "24px",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "400px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          zIndex: 1000,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h4 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#333", marginBottom: "1rem" }}>
          Edit Service
        </h4>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(true);
          }}
        >
          {formFields.map((field, index) => (
            <div key={index} style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#555",
                  marginBottom: "0.3rem",
                }}
              >
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={currentEntry[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                min={field.min}
                style={inputStyle}
              />
            </div>
          ))}
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#555",
                marginBottom: "0.3rem",
              }}
            >
              Icon
            </label>
            {/* Native select */}
            <select
              name="icon"
              value={currentEntry.icon || ""}
              onChange={(e) => handleChange("icon", e.target.value)}
              required
              style={selectStyle}
            >
              <option value="" disabled>
                Select an icon
              </option>
              {jobCatContent.map((cat) => (
                <option key={cat.id} value={cat.icon}>
                  {cat.name || "Unnamed Category"}
                </option>
              ))}
            </select>
            {/* Optional: react-select implementation */}
            {/*
            <Select
              options={selectOptions}
              value={selectOptions.find((option) => option.value === currentEntry.icon) || null}
              onChange={(selected) => handleChange("icon", selected ? selected.value : "")}
              components={{ Option: customOption, SingleValue: customSingleValue }}
              placeholder="Select an icon"
              styles={{
                control: (base) => ({
                  ...base,
                  ...inputStyle,
                  borderRadius: "0.25rem",
                  border: "1px solid #ddd",
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 1000,
                }),
              }}
            />
            */}
            {currentEntry.icon && (
              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "40px",
                  height: "40px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <i className={currentEntry.icon} style={{ fontSize: "20px", color: "#555" }}></i>
              </div>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "0.5rem 1rem",
                border: "1px solid #ddd",
                borderRadius: "0.25rem",
                backgroundColor: "#fff",
                color: "#333",
                cursor: "pointer",
                fontSize: "0.875rem",
              }}
            >
              Cancel
            </button>
            <button type="submit" style={buttonStyle}>
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ServicesList = () => {
  const [categories, setCategories] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState({
    id: null,
    catTitle: "",
    jobDescription: "",
    icon: "",
  });

  const fetchServices = async () => {
    try {
      console.log("Fetching services from API...");
      const services = await userService.getServices();
      if (services) {
        console.log("Services fetched:", services);
        setCategories(
          services.map((service) => ({
            id: service.id,
            catTitle: service.name,
            jobDescription: service.description,
            icon: service.class_name,
          }))
        );
      } else {
        console.warn("No services returned from API");
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      await utilityService.showAlert("Error", "Failed to fetch services.", "error");
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const buttonStyle = {
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "0.25rem",
    backgroundColor: "#8C956B",
    color: "white",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
  };

  const handleChange = (field, value) => {
    console.log(`Updating ${field} to:`, value);
    setCurrentEntry((prev) => ({ ...prev, [field]: value }));
  };

  const saveCategory = async (isEditing) => {
    console.log("Saving category:", currentEntry);
    if (!currentEntry.catTitle || !currentEntry.jobDescription || !currentEntry.icon) {
      console.error("Validation failed: Missing required fields");
      await utilityService.showAlert("Error", "All fields are required.", "error");
      return;
    }

    const serviceData = {
      name: currentEntry.catTitle,
      description: currentEntry.jobDescription,
      class_name: currentEntry.icon,
    };

    try {
      let response;
      if (isEditing) {
        serviceData.id = currentEntry.id;
        response = await userService.editService(serviceData);
      } else {
        response = await userService.addService(serviceData);
      }

      if (response) {
        console.log("Service saved successfully:", response);
        await utilityService.showAlert("Success", isEditing ? "Service updated successfully!" : "Service added successfully!", "success");
        await fetchServices();
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
        resetForm();
      } else {
        console.warn("Failed to save service");
        await utilityService.showAlert("Error", isEditing ? "Failed to update service." : "Failed to add service.", "error");
      }
    } catch (error) {
      console.error("Error saving service:", error);
      const errorMessage = error.message || "Failed to save service.";
      await utilityService.showAlert("Error", errorMessage, "error");
    }
  };

  const editCategory = async (cat) => {
    console.log("Editing category with ID:", cat.id);
    try {
      const service = await userService.getSingleService(cat.id);
      if (service) {
        console.log("Service details fetched for edit:", service);
        setCurrentEntry({
          id: service.id,
          catTitle: service.name,
          jobDescription: service.description,
          icon: service.class_name,
        });
        setIsEditModalOpen(true);
      } else {
        console.warn("No service details returned for ID:", cat.id);
        await utilityService.showAlert("Error", "Failed to fetch service details.", "error");
      }
    } catch (error) {
      console.error("Error fetching service for edit:", error);
      await utilityService.showAlert("Error", "Failed to fetch service details.", "error");
    }
  };

  const deleteCategory = async (id) => {
    console.log("Deleting category with ID:", id);
    try {
      const result = await userService.deleteService(id);
      if (result) {
        console.log("Service deleted successfully:", result);
        setCategories(categories.filter((cat) => cat.id !== id));
        await utilityService.showAlert("Success", "Service deleted successfully!", "success");
      } else {
        console.warn("Failed to delete service with ID:", id);
        await utilityService.showAlert("Error", "Failed to delete service.", "error");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      await utilityService.showAlert("Error", `Failed to delete service: ${error.message || "Server error."}`, "error");
    }
  };

  const resetForm = () => {
    console.log("Resetting form");
    setCurrentEntry({
      id: null,
      catTitle: "",
      jobDescription: "",
      icon: "",
    });
  };

  const handleAddClose = () => {
    console.log("Closing Add Service modal");
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditClose = () => {
    console.log("Closing Edit Service modal");
    setIsEditModalOpen(false);
    resetForm();
  };

  if (!categories) {
    return (
      <DsPageOuter headerType={ProfileTypes.SUPERADMIN}>
        <div style={{ backgroundColor: "#fff", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div>
              <Shimmer width="200px" height="24px" style={{ marginBottom: "0.5rem" }} />
              <Shimmer width="300px" height="16px" />
            </div>
            <Shimmer width="120px" height="32px" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ padding: "1rem" }}>
                <Shimmer width="100%" height="100px" />
                <Shimmer width="150px" height="20px" style={{ marginTop: "0.5rem" }} />
                <Shimmer width="100px" height="16px" />
              </div>
            ))}
          </div>
        </div>
      </DsPageOuter>
    );
  }

  return (
    <DsPageOuter headerType={ProfileTypes.SUPERADMIN}>
      <div>
        <AddServiceModal
          isOpen={isAddModalOpen}
          onClose={handleAddClose}
          onSave={saveCategory}
          currentEntry={currentEntry}
          handleChange={handleChange}
        />
        <EditServiceModal
          isOpen={isEditModalOpen}
          onClose={handleEditClose}
          onSave={saveCategory}
          currentEntry={currentEntry}
          handleChange={handleChange}
        />
        <div
          style={{
            backgroundColor: "#fff",
            padding: "1.5rem",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div>
              <h4 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#333", margin: 0 }}>
                Services List
              </h4>
              <p style={{ fontSize: "1rem", color: "#555", margin: "0.25rem 0 0" }}>
                Explore and Manage Service Categories
              </p>
            </div>
            <button
              type="button"
              style={buttonStyle}
              onClick={() => {
                resetForm();
                setIsAddModalOpen(true);
              }}
            >
              Add Service
            </button>
          </div>
          <div
            className="row"
            data-aos="fade-up"
            data-aos-anchor-placement="top-bottom"
          >
            {categories.length > 0 ? (
              <ListingCategories
                categories={categories}
                editAction={editCategory}
                deleteAction={deleteCategory}
              />
            ) : (
              <p style={{ color: "#555", fontSize: "1rem", textAlign: "center" }}>
                No service categories available.
              </p>
            )}
          </div>
        </div>
      </div>
    </DsPageOuter>
  );
};

export default ServicesList;