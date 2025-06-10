import React, { useState } from "react";
import CardForm from "@/templates/forms/card-form";

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

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
    // Add your form submission logic here, such as API calls
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