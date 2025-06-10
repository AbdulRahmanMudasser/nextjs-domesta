'use client';

import { useState } from "react";
import CardForm from "@/templates/forms/card-form";
import Select from "react-select";

const buttonStyle = {
  padding: "0.75rem 1.5rem",
  border: "none",
  borderRadius: "0.5rem",
  backgroundColor: "#1a73e8",
  color: "white",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: "600",
};

const ApplicationManagement = () => {
  const [formData, setFormData] = useState({
    jobApplications: "",
    applicationStatus: "",
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSelectChange = (field) => (selectedOption) => {
    setFormData({ ...formData, [field]: selectedOption ? selectedOption.value : "" });
  };

  const applicationStatusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Reviewed", label: "Reviewed" },
    { value: "Accepted", label: "Accepted" },
    { value: "Rejected", label: "Rejected" },
  ];

  const fields = [
    {
      type: "text",
      name: "jobApplications",
      label: "View Job Applications",
      placeholder: "Search applications...",
      colClass: "col-lg-6 col-md-12",
      required: true,
    },
    {
      type: "select",
      name: "applicationStatus",
      label: "Track Application Status",
      options: applicationStatusOptions,
      colClass: "col-lg-6 col-md-12",
      placeholder: "Select Status",
      required: true,
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <CardForm
      fields={fields}
      formData={formData}
      handleChange={handleChange}
      handleSelectChange={handleSelectChange}
      onSubmit={handleSubmit}
    />
  );
};

export default ApplicationManagement;