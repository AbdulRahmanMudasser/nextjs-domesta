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

const ResidenceInfo = () => {
    // State to manage form data
    const [formData, setFormData] = useState({
        typeOfResidence: "",
        buildingNo: "",
        roadNo: "",
        blockNo: "",
        city: "",
        country: "",
        accommodationProvided: "",
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
    const typeOfResidenceOptions = [
        { value: "House", label: "House" },
        { value: "Flat", label: "Flat" },
        { value: "Villa", label: "Villa" },
        { value: "Apartment", label: "Apartment" },
    ];

    const countryOptions = [
        { value: "Bahrain", label: "Bahrain" },
        { value: "Kuwait", label: "Kuwait" },
        { value: "Oman", label: "Oman" },
        { value: "Qatar", label: "Qatar" },
        { value: "Saudi Arabia", label: "Saudi Arabia" },
        { value: "United Arab Emirates", label: "United Arab Emirates" },
    ];

    const yesNoOptions = [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
    ];

    // Form field configurations
    const fields = [
        {
            type: "select",
            name: "typeOfResidence",
            label: "Type of Residence",
            options: typeOfResidenceOptions,
            colClass: "col-lg-3 col-md-12",
            placeholder: "Select Residence Type",
            required: true,
        },
        {
            type: "text",
            name: "buildingNo",
            label: "Building No",
            placeholder: "Enter building number",
            colClass: "col-lg-3 col-md-12",
            required: true,
            style: inputStyle,
        },
        {
            type: "text",
            name: "roadNo",
            label: "Road No",
            placeholder: "Enter road number",
            colClass: "col-lg-3 col-md-12",
            required: true,
            style: inputStyle,
        },
        {
            type: "text",
            name: "blockNo",
            label: "Block No",
            placeholder: "Enter block number",
            colClass: "col-lg-3 col-md-12",
            required: true,
            style: inputStyle,
        },
        {
            type: "text",
            name: "city",
            label: "City / Area",
            placeholder: "Enter city or area",
            colClass: "col-lg-3 col-md-12",
            required: true,
            style: inputStyle,
        },
        {
            type: "select",
            name: "country",
            label: "Country",
            options: countryOptions,
            colClass: "col-lg-3 col-md-12",
            placeholder: "Select Country",
            required: true,
        },
        {
            type: "select",
            name: "accommodationProvided",
            label: "Accommodation Provided?",
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

export default ResidenceInfo;