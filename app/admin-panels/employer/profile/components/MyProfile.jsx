'use client'

import Select from "react-select";
import { useState } from "react";
import CardForm from "@/templates/forms/card-form";

// Define inputStyle for inputs
const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "0.5rem",
  backgroundColor: "#F0F5F7",
  boxSizing: "border-box",
};

const MyProfile = () => {
    // State to manage form data
    const [formData, setFormData] = useState({
        gender: "",
        dateOfBirth: "",
        nationality: "",
        religion: "",
        householdType: "",
        adults: "",
        children: "",
        childrenAgeRange: "",
        elderlyDependents: "",
        specialNeeds: "",
        specialNeedsCare: "",
    });

    // Handle input changes for text, number, date fields
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
    const genderOptions = [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
        { value: "Other", label: "Other" },
    ];

    const nationalityOptions = [
        { value: "Bahrain", label: "Bahrain" },
        { value: "Kuwait", label: "Kuwait" },
        { value: "Oman", label: "Oman" },
        { value: "Qatar", label: "Qatar" },
        { value: "Saudi Arabia", label: "Saudi Arabia" },
        { value: "United Arab Emirates", label: "United Arab Emirates" },
    ];

    const religionOptions = [
        { value: "Islam", label: "Islam" },
        { value: "Christianity", label: "Christianity" },
        { value: "Hinduism", label: "Hinduism" },
        { value: "Sikh", label: "Sikh" },
        { value: "Other", label: "Other" },
    ];

    const householdTypeOptions = [
        { value: "Local", label: "Local" },
        { value: "Expat", label: "Expat" },
    ];

    const childrenAgeRangeOptions = [
        { value: "Infant", label: "Infant" },
        { value: "Toddler", label: "Toddler" },
        { value: "Teen", label: "Teen" },
    ];

    const yesNoOptions = [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
    ];

    // Form field configurations
    const fields = [
        // Personal & Household Info
        {
            type: "select",
            name: "gender",
            label: "Gender",
            options: genderOptions,
            colClass: "col-lg-3 col-md-12",
            placeholder: "Select Gender",
            required: true,
        },
        {
            type: "date",
            name: "dateOfBirth",
            label: "Date of Birth",
            colClass: "col-lg-3 col-md-12",
            required: true,
            style: { ...inputStyle, height: "60px" },
        },
        {
            type: "select",
            name: "nationality",
            label: "Nationality",
            options: nationalityOptions,
            colClass: "col-lg-3 col-md-12",
            placeholder: "Select Nationality",
            required: true,
        },
        {
            type: "select",
            name: "religion",
            label: "Religion",
            options: religionOptions,
            colClass: "col-lg-3 col-md-12",
            placeholder: "Select Religion",
            required: true,
        },
        {
            type: "select",
            name: "householdType",
            label: "Household Type",
            options: householdTypeOptions,
            colClass: "col-lg-3 col-md-12",
            placeholder: "Select Household Type",
            required: true,
        },
        {
            type: "number",
            name: "adults",
            label: "Household Size - Adults",
            placeholder: "Number of Adults",
            colClass: "col-lg-3 col-md-12",
            required: true,
            style: inputStyle,
        },
        {
            type: "number",
            name: "children",
            label: "Household Size - Children",
            placeholder: "Number of Children",
            colClass: "col-lg-3 col-md-12",
            required: true,
            style: inputStyle,
        },
        {
            type: "select",
            name: "childrenAgeRange",
            label: "Children’s Age Range",
            options: childrenAgeRangeOptions,
            colClass: "col-lg-3 col-md-12",
            placeholder: "Select Age Range",
            required: true,
        },
        {
            type: "select",
            name: "elderlyDependents",
            label: "Do you have elderly dependents?",
            options: yesNoOptions,
            colClass: "col-lg-3 col-md-12",
            placeholder: "Select Option",
            required: true,
        },
        {
            type: "select",
            name: "specialNeeds",
            label: "Any special needs?",
            options: yesNoOptions,
            colClass: "col-lg-3 col-md-12",
            placeholder: "Select Option",
            required: true,
        },
        {
            type: "select",
            name: "specialNeedsCare",
            label: "Do they require care?",
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

export default MyProfile;