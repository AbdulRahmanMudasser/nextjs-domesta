'use client'

import Select from "react-select";
import { useState } from "react";
import CardForm from "@/templates/forms/card-form";

const CommunicationCulturalFit = () => {
    const [formData, setFormData] = useState({
        languagesSpoken: "",
        preferredEmployeeLanguage: "",
        dietaryPreferences: "",
        culturalExpectations: "",
    });

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSelectChange = (field) => (selectedOption) => {
        setFormData({ ...formData, [field]: selectedOption ? selectedOption.value : "" });
    };

    const languageOptions = [
        { value: "English", label: "English" },
        { value: "Arabic", label: "Arabic" },
        { value: "Other", label: "Other" },
    ];

    const dietaryOptions = [
        { value: "Halal", label: "Halal" },
        { value: "Vegetarian", label: "Vegetarian" },
        { value: "No Pork", label: "No Pork" },
        { value: "Vegan", label: "Vegan" },
        { value: "Gluten-Free", label: "Gluten-Free" },
        { value: "Other", label: "Other" },
    ];

    const fields = [
        {
            type: "select",
            name: "languagesSpoken",
            label: "Languages Spoken at Home",
            options: languageOptions,
            colClass: "col-lg-3 col-md-12",
            placeholder: "Select Languages",
            required: true,
        },
        {
            type: "text",
            name: "preferredEmployeeLanguage",
            label: "Preferred Employee Language(s)",
            placeholder: "Enter preferred language(s)",
            colClass: "col-lg-3 col-md-12",
            required: true,
        },
        {
            type: "select",
            name: "dietaryPreferences",
            label: "Dietary Preferences",
            options: dietaryOptions,
            colClass: "col-lg-3 col-md-12",
            placeholder: "Select Dietary Preferences",
            required: true,
        },
        {
            type: "textarea",
            name: "culturalExpectations",
            label: "Cultural Expectations / Notes",
            placeholder: "Enter cultural expectations or notes",
            colClass: "col-lg-12 col-md-12",
            required: true,
        },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted with data:", formData);
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

export default CommunicationCulturalFit;