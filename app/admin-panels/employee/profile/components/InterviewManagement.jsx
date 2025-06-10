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

const InterviewManagement = () => {
  const [formData, setFormData] = useState({
    interviewTime: "",
    liveInWithFamily: "",
    relocationInsideCountry: "",
    maxHoursPerDay: "",
    flexibleWeekends: "",
    householdType: "",
    communicationLanguage: "",
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSelectChange = (field) => (selectedOption) => {
    setFormData({ ...formData, [field]: selectedOption ? selectedOption.value : "" });
  };

  const languages = [
    { value: "English", label: "English" },
    { value: "Arabic", label: "Arabic" },
    { value: "French", label: "French" },
    { value: "Spanish", label: "Spanish" },
    { value: "Hindi", label: "Hindi" },
  ];

  const yesNoOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  const liveInOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
    { value: "Conditional", label: "Conditional" },
  ];

  const householdTypeOptions = [
    { value: "Local", label: "Local" },
    { value: "Expat", label: "Expat" },
    { value: "No Preference", label: "No Preference" },
  ];

  const fields = [
    {
      type: "text",
      name: "interviewTime",
      label: "Preferred Interview Time",
      placeholder: "E.g., 10 AM - 12 PM",
      colClass: "col-lg-3 col-md-12",
      required: true,
    },
    {
      type: "number",
      name: "maxHoursPerDay",
      label: "Maximum hours per day",
      placeholder: "E.g., 8",
      colClass: "col-lg-3 col-md-12",
      min: "1",
      required: true,
    },
    {
      type: "select",
      name: "householdType",
      label: "Preferred household type",
      options: householdTypeOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Preference",
      required: true,
    },
    {
      type: "select",
      name: "communicationLanguage",
      label: "Languages preferred",
      options: languages,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Language",
      required: true,
    },
    {
      type: "select",
      name: "liveInWithFamily",
      label: "Willing to live-in with family?",
      options: liveInOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Option",
      required: true,
    },
    {
      type: "select",
      name: "relocationInsideCountry",
      label: "Comfortable with relocation?",
      options: yesNoOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Option",
      required: true,
    },
    {
      type: "select",
      name: "flexibleWeekends",
      label: "Flexible with weekends?",
      options: yesNoOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Option",
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

export default InterviewManagement;