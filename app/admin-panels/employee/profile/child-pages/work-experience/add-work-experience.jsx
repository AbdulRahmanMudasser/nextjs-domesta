"use client";

import React, { useState } from "react";
import DsPageOuter from "@/templates/layouts/ds-page-outer";
import candidatesMenuData from "@/data/candidatesMenuData";
import CardForm from "@/templates/forms/card-form";

const index = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    jobTitle: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Work Experience Submitted:", formData);
    // Add logic to save the work experience
  };

  const gulfCountriesOptions = [
    { value: "Bahrain", label: "Bahrain" },
    { value: "Kuwait", label: "Kuwait" },
    { value: "Oman", label: "Oman" },
    { value: "Qatar", label: "Qatar" },
    { value: "Saudi Arabia", label: "Saudi Arabia" },
    { value: "United Arab Emirates", label: "United Arab Emirates" },
  ];

  const yesNoOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  const fields = [
    {
      type: "text",
      name: "employerName",
      label: "Employer Name",
      placeholder: "Enter employer name",
      colClass: "col-lg-3 col-md-12",
      required: true,
    },
    {
      type: "text",
      name: "employmentLocation",
      label: "Employment Location",
      placeholder: "Enter employment location",
      colClass: "col-lg-3 col-md-12",
      required: true,
    },
    {
      type: "number",
      name: "employerPhone",
      label: "Employer Phone",
      placeholder: "Enter employer phone number",
      colClass: "col-lg-3 col-md-12",
      required: true,
    },
    {
      type: "email",
      name: "employerEmail",
      label: "Employer Email Address",
      placeholder: "Enter employer email address",
      colClass: "col-lg-3 col-md-12",
      required: true,
    },
    {
      type: "select",
      name: "country",
      label: "Country",
      options: gulfCountriesOptions,
      placeholder: "Select Country",
      colClass: "col-lg-3 col-md-12",
      required: true,
    },
    {
      type: "text",
      name: "designation",
      label: "Designation / Position",
      placeholder: "Maid, Gardener, etc.",
      colClass: "col-lg-3 col-md-12",
      required: true,
    },
    {
      type: "number",
      name: "previousSalary",
      label: "Previous Salary",
      colClass: "col-lg-3 col-md-12",
      required: true,
    },
    {
      type: "text",
      name: "benefits",
      label: "Benefits",
      placeholder: "Visa, Accommodation, Fuel, etc.",
      colClass: "col-lg-3 col-md-12",
      required: true,
    },
    {
      type: "date",
      name: "startDate",
      label: "Start Date",
      colClass: "col-lg-3 col-md-12",
      required: true,
    },
    {
      type: "date",
      name: "endDate",
      label: "End Date",
      colClass: "col-lg-3 col-md-12",
      required: true,
    },
    {
      type: "text",
      name: "petsExperience",
      label: "Pets Experience",
      colClass: "col-lg-3 col-md-12",
      required: true,
    },
    {
      type: "select",
      name: "comfortableWithPets",
      label: "Comfortable with Pets",
      options: yesNoOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Option",
      required: true,
    },
    {
      type: "textarea",
      name: "employerReview",
      label: "Employer Review",
      colClass: "col-lg-12 col-md-12",
      required: true,
      rows: 4,
    },
    {
      type: "rating",
      name: "rating",
      label: "Rating (1–5 stars)",
      colClass: "col-lg-12 col-md-12",
      required: true,
    },
  ];

  return (
    <DsPageOuter
      headerType={"candidate"}
      title="Add Work Experience!"
      subtitle="Ready to jump back in?"
      menuData={candidatesMenuData}
    >
      <CardForm
        fields={fields}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        submitButtonText="Submit Work Experience"
      />
    </DsPageOuter>
  );
};

export default index;
