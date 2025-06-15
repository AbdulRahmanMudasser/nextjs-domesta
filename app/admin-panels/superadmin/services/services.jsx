
'use client'

import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import DsPageOuter from "@/templates/layouts/ds-page-outer";
import { ProfileTypes } from "@/data/globalKeys";
import ListingCategories from "@/app/website/home/Listingcategories/ListingCategories";
import jobCatContent from "@/data/job-catergories";
import Shimmer from "@/templates/misc/Shimmer";

const ServicesList = () => {
  const [categories, setCategories] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEntry, setCurrentEntry] = useState({
    id: uuidv4(),
    catTitle: "",
    jobDescription: "",
    jobNumber: "",
    icon: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setCategories(jobCatContent || []);
    }, 1000);
    return () => clearTimeout(timer);
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

  const handleChange = (field, value) => {
    setCurrentEntry((prev) => ({ ...prev, [field]: value }));
  };

  const saveCategory = () => {
    if (!categories) return;
    if (isEditing) {
      setCategories(
        categories.map((cat) =>
          cat.id === currentEntry.id ? currentEntry : cat
        )
      );
    } else {
      setCategories([...categories, { ...currentEntry, id: uuidv4() }]);
    }
    setIsModalOpen(false);
    resetForm();
    setIsEditing(false);
  };

  const editCategory = (cat) => {
    setCurrentEntry(cat);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const deleteCategory = (id) => {
    if (!categories) return;
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  const resetForm = () => {
    setCurrentEntry({
      id: uuidv4(),
      catTitle: "",
      jobDescription: "",
      jobNumber: "",
      icon: "",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
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
    {
      type: "text",
      name: "icon",
      label: "Icon Class",
      placeholder: "e.g., icon-briefcase",
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
