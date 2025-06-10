'use client'

import { useState } from "react";
import Select from "react-select";
import CardForm from "@/templates/forms/card-form";

const ServicesOffering = () => {
    const [formData, setFormData] = useState({
        servicesProvided: [],
        countriesOfOperation: [],
        languagesSpoken: "",
        employeeNationalities: [],
    });

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSelectChange = (field) => (selectedOptions) => {
        const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setFormData({ ...formData, [field]: values });
    };

    const servicesOptions = [
        { value: "Recruitment", label: "Recruitment" },
        { value: "Visa Sponsorship", label: "Visa Sponsorship" },
        { value: "Housing", label: "Housing" },
        { value: "Airport Pickup", label: "Airport Pickup" },
        { value: "Training", label: "Training" },
        { value: "Payroll Services", label: "Payroll Services" },
    ];

    const countryOptions = [
        { value: "Bahrain", label: "Bahrain" },
        { value: "Kuwait", label: "Kuwait" },
        { value: "Oman", label: "Oman" },
        { value: "Qatar", label: "Qatar" },
        { value: "Saudi Arabia", label: "Saudi Arabia" },
        { value: "United Arab Emirates", label: "United Arab Emirates" },
        { value: "India", label: "India" },
        { value: "Philippines", label: "Philippines" },
        { value: "Pakistan", label: "Pakistan" },
        { value: "United Kingdom", label: "United Kingdom" },
        { value: "United States", label: "United States" },
    ];

    const fields = [
        {
            type: "select",
            name: "servicesProvided",
            label: "Services Provided",
            options: servicesOptions,
            colClass: "col-lg-3 col-md-12",
            placeholder: "Select services",
            required: true,
            isMulti: true,
        },
        {
            type: "select",
            name: "countriesOfOperation",
            label: "Countries of Operation",
            options: countryOptions,
            colClass: "col-lg-3 col-md-12",
            placeholder: "Select countries",
            required: true,
            isMulti: true,
        },
        {
            type: "text",
            name: "languagesSpoken",
            label: "Languages Spoken by Staff",
            placeholder: "Enter languages (e.g., English, Arabic)",
            colClass: "col-lg-3 col-md-12",
            required: true,
        },
        {
            type: "select",
            name: "employeeNationalities",
            label: "Employee Nationalities",
            options: countryOptions,
            colClass: "col-lg-3 col-md-12",
            placeholder: "Select nationalities",
            required: true,
            isMulti: true,
        },
    ];

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
            handleSelectChange={handleSelectChange}
            onSubmit={handleSubmit}
        />
    );
};

export default ServicesOffering;