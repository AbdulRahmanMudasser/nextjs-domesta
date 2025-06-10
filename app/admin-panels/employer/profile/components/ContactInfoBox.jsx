'use client'

import Select from "react-select";
import { useState } from "react";
import CardForm from "@/templates/forms/card-form";

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

const ContactInfoBox = () => {
    const [formData, setFormData] = useState({
        phoneNumber: "",
        email: "",
        whatsappNumber: "",
        alternateContact: "",
    });

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSelectChange = (field) => (selectedOption) => {
        setFormData({ ...formData, [field]: selectedOption ? selectedOption.value : "" });
    };

    const fields = [
        {
            type: "text",
            name: "phoneNumber",
            label: "Phone Number",
            placeholder: "+924322321133",
            colClass: "col-lg-3 col-md-12",
            required: true,
        },
        {
            type: "email",
            name: "email",
            label: "Email",
            placeholder: "employer@gmail.com",
            colClass: "col-lg-3 col-md-12",
        },
        {
            type: "text",
            name: "whatsappNumber",
            label: "WhatsApp Number",
            placeholder: "+924322321133",
            colClass: "col-lg-3 col-md-12",
            required: true,
        },
        {
            type: "text",
            name: "alternateContact",
            label: "Alternate Contact",
            placeholder: "+924322321133",
            colClass: "col-lg-3 col-md-12",
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

export default ContactInfoBox;