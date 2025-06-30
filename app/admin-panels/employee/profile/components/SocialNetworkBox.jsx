"use client";

import React, { useState, useEffect } from "react";
import CardForm from "@/templates/forms/card-form";
import { networkService } from "@/services/network.service";
import { utilityService } from "@/services/utility.service";

const SocialNetworkBox = () => {
  const [formData, setFormData] = useState({
    facebook: "",
    twitter: "",
    linkedin: "",
    googlePlus: "",
  });

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
        await utilityService.showAlert(
          "Error",
          error.message || "Failed to load social network data.",
          "error"
        );
      }
    };

    fetchSocialNetworkData();
  }, []);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
        await utilityService.showAlert("Success", "Social network details updated successfully!", "success");
      }
    } catch (error) {
      console.error("Error submitting social network data:", error);
      await utilityService.showAlert(
        "Error",
        error.message || "Failed to update social network details.",
        "error"
      );
    }
  };

  return (
    <CardForm
      fields={fields}
      formData={formData}
      handleChange={handleChange}
      handleSelectChange={() => {}}
      handleFileChange={() => {}}
      onSubmit={handleSubmit}
    />
  );
};

export default SocialNetworkBox;