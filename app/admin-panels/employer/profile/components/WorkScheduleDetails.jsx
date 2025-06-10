'use client'

import Select from "react-select";
import { useState } from "react";
import CardForm from "@/templates/forms/card-form";

// Define buttonStyle at the top level for consistent styling
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

// Define inputStyle for inputs
const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "0.5rem",
  backgroundColor: "#F0F5F7",
  boxSizing: "border-box",
};

// Define tickBoxStyle for the tick container
const tickBoxStyle = (isSelected) => ({
  position: "absolute",
  right: "20px",
  top: "30%",
  transform: "translateY(-50%)",
  width: "24px",
  height: "24px",
  border: `1px solid ${isSelected ? "#28a745" : "#d0d0d0"}`,
  borderRadius: "50%",
  backgroundColor: isSelected ? "#28a745" : "transparent",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
});

const WorkScheduleOfferDetails = () => {
    // State to manage form data
    const [formData, setFormData] = useState({
        startDate: "",
        workDaysPerWeek: "",
        dailyHours: "",
        dayOffPreference: "",
        salaryRange: "",
        otherBenefits: "",
        visaSponsorship: "",
        budgetFlexibility: "",
    });

    // Handle input changes
    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    // Handle select changes for react-select
    const handleSelectChange = (field) => (selectedOption) => {
        setFormData({ ...formData, [field]: selectedOption ? selectedOption.value : "" });
    };

    // Handle file changes (required by CardForm, even if unused)
    const handleFileChange = (field, file) => {
        setFormData({ ...formData, [field]: file });
    };

    // Dropdown options formatted for react-select
    const yesNoOptions = [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
    ];

    // Form field configurations
    const fields = [
        {
            type: "date",
            name: "startDate",
            label: "Start Date",
            colClass: "col-lg-3 col-md-12",
            required: true,
            style: { ...inputStyle, height: "60px" },
        },
        {
            type: "number",
            name: "workDaysPerWeek",
            label: "Work Days per Week",
            placeholder: "Enter number of days",
            colClass: "col-lg-3 col-md-12",
            required: true,
            min: "1",
            max: "7",
            style: inputStyle,
        },
        {
            type: "number",
            name: "dailyHours",
            label: "Daily Hours",
            placeholder: "Enter hours per day",
            colClass: "col-lg-3 col-md-12",
            required: true,
            min: "1",
            max: "24",
            style: inputStyle,
        },
        {
            type: "text",
            name: "dayOffPreference",
            label: "Day Off Preference",
            placeholder: "e.g., Sunday",
            colClass: "col-lg-3 col-md-12",
            required: true,
            style: inputStyle,
        },
        {
            type: "number",
            name: "salaryRange",
            label: "Salary Range (BHD)",
            placeholder: "Enter amount in BHD",
            colClass: "col-lg-3 col-md-12",
            required: true,
            min: "0",
            style: inputStyle,
        },
        {
            type: "text",
            name: "otherBenefits",
            label: "Other Benefits Offered",
            placeholder: "e.g., Accommodation, Transport",
            colClass: "col-lg-3 col-md-12",
            required: true,
            style: inputStyle,
        },
        {
            type: "select",
            name: "visaSponsorship",
            label: "Visa Sponsorship Provided?",
            options: yesNoOptions,
            colClass: "col-lg-3 col-md-12",
            placeholder: "Select Option",
            required: true,
        },
        {
            type: "select",
            name: "budgetFlexibility",
            label: "Budget Flexibility?",
            options: yesNoOptions,
            colClass: "col-lg-3 col-md-12",
            placeholder: "Select Option",
            required: true,
        },
    ];

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted with data:", formData);
        // Add your form submission logic here, such as API calls
    };

    return (
        <CardForm
            fields={fields}
            formData={formData}
            onSubmit={handleSubmit}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
            handleFileChange={handleFileChange}
        />
    );
};

export default WorkScheduleOfferDetails;