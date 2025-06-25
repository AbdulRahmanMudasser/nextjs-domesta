"use client";

import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import DsPageOuter from "@/templates/layouts/ds-page-outer";
import { ProfileTypes } from "@/data/globalKeys";
import ListingCategories from "@/app/website/home/Listingcategories/ListingCategories";
import jobCatContent from "@/data/job-catergories";
import Shimmer from "@/templates/misc/Shimmer";
import { userService } from "@/services/user.service";
import { utilityService } from "@/services/utility.service";

const ServicesList = () => {
  const [categories, setCategories] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEntry, setCurrentEntry] = useState({
    id: null,
    catTitle: "",
    jobDescription: "",
    jobNumber: "",
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
            jobNumber: service.employee_counter,
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
    background: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"10\" height=\"6\" viewBox=\"0 0 10 6\"><path fill=\"%23555\" d=\"M0 0l5 6 5-6H0z\"/></svg>') no-repeat right 0.5rem center",
  };

  const handleChange = (field, value) => {
    console.log(`Updating ${field} to:`, value);
    setCurrentEntry((prev) => ({ ...prev, [field]: value }));
  };

  const saveCategory = async () => {
    console.log("Saving category:", currentEntry);
    if (!currentEntry.catTitle || !currentEntry.jobDescription || !currentEntry.jobNumber || !currentEntry.icon) {
      console.error("Validation failed: Missing required fields");
      await utilityService.showAlert("Error", "All fields are required.", "error");
      return;
    }

    const serviceData = {
      name: currentEntry.catTitle,
      description: currentEntry.jobDescription,
      class_name: currentEntry.icon,
      employee_counter: parseInt(currentEntry.jobNumber, 10),
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
        await fetchServices(); // Refresh the list
      } else {
        console.warn("Failed to save service");
        await utilityService.showAlert("Error", isEditing ? "Failed to update service." : "Failed to add service.", "error");
      }
    } catch (error) {
      console.error("Error saving service:", error);
      await utilityService.showAlert("Error", `Failed to save service: ${error.message || "Server error."}`, "error");
    }

    setIsModalOpen(false);
    resetForm();
    setIsEditing(false);
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
          jobNumber: service.employee_counter,
          icon: service.class_name,
        });
        setIsEditing(true);
        setIsModalOpen(true);
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
      jobNumber: "",
      icon: "",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    console.log("Cancelling form");
    setIsModalOpen(false);
    resetForm();
  };

  const formFields = [
    {
      type: "text",
      name: "catTitle",
      label: "Service Title",
      placeholder: "Enter service title",
      required: true,
    },
    {
      type: "text",
      name: "jobDescription",
      label: "Description",
      placeholder: "Enter description",
      required: true,
    },
    {
      type: "number",
      name: "jobNumber",
      label: "Open Positions",
      placeholder: "Enter number",
      min: "0",
      required: true,
    },
  ];

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
        {isModalOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.5)",
              zIndex: 999,
            }}
            onClick={handleCancel}
          >
            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "#fff",
                padding: "1.5rem",
                borderRadius: "8px",
                width: "90%",
                maxWidth: "400px",
                zIndex: 1000,
                maxHeight: "80vh",
                overflowY: "auto",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h4 style={{ margin: "0 0 0.75rem", color: "#333", fontSize: "1.25rem" }}>
                {isEditing ? "Edit Service" : "Add Service"}
              </h4>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveCategory();
                }}
              >
                {formFields.map((field, index) => (
                  <div key={index} style={{ marginBottom: "0.75rem" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.875rem",
                        color: "#555",
                        marginBottom: "0.25rem",
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
                      style={inputStyle}
                      min={field.min}
                    />
                  </div>
                ))}
                <div style={{ marginBottom: "0.75rem" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      color: "#555",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Icon
                  </label>
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
                        {cat.catTitle}
                      </option>
                    ))}
                  </select>
                  {currentEntry.icon && (
                    <div style={{ marginTop: "0.5rem", fontSize: "1.5rem" }}>
                      <i className={currentEntry.icon}></i>
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={handleCancel}
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
                  <button
                    type="submit"
                    style={buttonStyle}
                  >
                    {isEditing ? "Update" : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
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
                setIsModalOpen(true);
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