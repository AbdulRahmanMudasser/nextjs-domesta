"use client";

import React, { useState, useEffect } from "react";
import ProfileCardForm from "@/templates/forms/ProfileCardForm";
import { networkService } from "@/services/network.service";
import { notificationService } from "@/services/notification.service";
import Loader from "@/globals/Loader";

// Define inputStyle for consistency
const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "0.5rem",
  backgroundColor: "#F0F5F7",
  boxSizing: "border-box",
  height: "60px",
  border: "none",
};

const SocialNetworkBox = () => {
  const [formData, setFormData] = useState({
    facebook: "",
    twitter: "",
    linkedin: "",
    googlePlus: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSelectChange = (field) => (selectedOption) => {
    setFormData({
      ...formData,
      [field]: selectedOption ? selectedOption.value : "",
    });
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // Handle clearing form errors
  const handleClearError = (fieldName) => {
    setFormErrors((prev) => ({ ...prev, [fieldName]: "" }));
  };

  const fields = [
    {
      name: "facebook",
      label: "Facebook",
      type: "text",
      placeholder: "www.facebook.com/Invision",
      required: true,
      colClass: "col-lg-3 col-md-12",
    },
    {
      name: "twitter",
      label: "Twitter",
      type: "text",
      placeholder: "Enter your Twitter profile",
      required: true,
      colClass: "col-lg-3 col-md-12",
    },
    {
      name: "linkedin",
      label: "Linkedin",
      type: "text",
      placeholder: "Enter your Linkedin profile",
      required: true,
      colClass: "col-lg-3 col-md-12",
    },
    {
      name: "googlePlus",
      label: "Google Plus",
      type: "text",
      placeholder: "Enter your Google Plus profile",
      required: true,
      colClass: "col-lg-3 col-md-12",
    },
  ];

  useEffect(() => {
    const fetchSocialNetworkData = async () => {
      try {
        setIsInitialLoading(true);
        const user = JSON.parse(localStorage.getItem("user"));
        const employeeId = user?.id;
        if (!employeeId) {
          throw new Error("User ID not found in localStorage");
        }

        const response = await networkService.get(`/employee/social-network-single/${employeeId}`);
        if (response) {
          setFormData({
            facebook: response.facebook_link || "",
            twitter: response.twitter_link || "",
            linkedin: response.linkedin_link || "",
            googlePlus: response.google_plus_link || "",
          });
        }
      } catch (error) {
        console.error("Error fetching social network data:", error);
        await notificationService.showToast(
          error.message || "Failed to load social network data.",
          "error"
        );
      } finally {
        setTimeout(() => {
          setIsInitialLoading(false);
        }, 500);
      }
    };

    fetchSocialNetworkData();
  }, []);

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Create a mapping of field names to their display labels
    const fieldLabels = fields.reduce((acc, field) => ({
      ...acc,
      [field.name]: field.label,
    }), {});

    // Validate required fields
    const requiredFields = fields.filter((f) => f.required).map((f) => f.name);
    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].trim() === "") {
        errors[field] = `${fieldLabels[field]} is required`;
        isValid = false;
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    if (!validateForm()) {
      const firstError = Object.values(formErrors)[0] || "Please fill in all required fields";
      await notificationService.showToast(firstError, "error");
      return;
    }

    try {
      setIsSubmitting(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const employeeId = user?.id;
      if (!employeeId) {
        throw new Error("User ID not found in localStorage");
      }

      const data = {
        employee_id: employeeId,
        facebook_link: formData.facebook,
        twitter_link: formData.twitter,
        linkedin_link: formData.linkedin,
        google_plus_link: formData.googlePlus,
      };

      const response = await networkService.post("/employee/social-network-edit", data);
      if (response) {
        await notificationService.showToast("Social network details updated successfully!", "success");
      }
    } catch (error) {
      console.error("Error submitting social network data:", error);
      await notificationService.showToast(
        error.message || "Failed to update social network details.",
        "error"
      );
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 500);
    }
  };

  return (
    <div className="relative min-h-screen">
      <style>
        {`
          .is-invalid {
            border: 1px solid #dc3545 !important;
          }
          .invalid-feedback {
            display: block;
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 0.25rem;
          }
        `}
      </style>
      {(isInitialLoading || isSubmitting) && (
        <Loader text={isInitialLoading ? "Loading..." : "Saving..."} />
      )}
      <ProfileCardForm
        fields={fields}
        formData={formData}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
        handleFileChange={() => {}} // Not used in this component
        onSubmit={handleSubmit}
        loading={isInitialLoading || isSubmitting}
        formErrors={formErrors}
      />
    </div>
  );
};

export default SocialNetworkBox;