'use client'

import { useState } from "react";
import CardForm from "@/templates/forms/card-form";

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "0.5rem",
  backgroundColor: "#F0F5F7",
  boxSizing: "border-box",
  height: "60px"
};

const MyProfile = () => {
    const [formData, setFormData] = useState({
        name: "",
        logo: null,
        agencyName: "",
        officeAddress: "",
        country: "",
        contractInfo: "",
        phoneNumber: "",
        emailAddress: "",
        agencyWebsite: "",
    });

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleFileChange = (field) => (e) => {
        setFormData({ ...formData, [field]: e.target.files[0] });
    };

    const fields = [
        {
            type: "text",
            name: "name",
            label: "Name",
            placeholder: "Enter name",
            colClass: "col-lg-3 col-md-12",
            required: true,
        },
       
        {
            type: "text",
            name: "agencyName",
            label: "Agency Name",
            placeholder: "Enter agency name",
            colClass: "col-lg-3 col-md-12",
            required: true,
        },
        {
            type: "text",
            name: "officeAddress",
            label: "Office Address",
            placeholder: "Enter office address",
            colClass: "col-lg-3 col-md-12",
            required: true,
        },
        {
            type: "text",
            name: "country",
            label: "Country",
            placeholder: "Enter country",
            colClass: "col-lg-3 col-md-12",
            required: true,
        },
        {
            type: "text",
            name: "contractInfo",
            label: "Contract Info",
            placeholder: "Enter contract information",
            colClass: "col-lg-3 col-md-12",
            required: true,
        },
        {
            type: "number",
            name: "phoneNumber",
            label: "Phone Number",
            placeholder: "Enter phone number",
            colClass: "col-lg-3 col-md-12",
            required: true,
        },
        {
            type: "email",
            name: "emailAddress",
            label: "Email Address",
            placeholder: "Enter email address",
            colClass: "col-lg-3 col-md-12",
            required: true,
        },
        {
            type: "text",
            name: "agencyWebsite",
            label: "Agency Website",
            placeholder: "Enter website URL",
            colClass: "col-lg-3 col-md-12",
            required: true,
        },
        {
            type: "file",
            name: "logo",
            label: "Logo",
            accept: "image/*",
            colClass: "col-lg-6 col-md-12",
            required: true,
            style: inputStyle,
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
            handleFileChange={handleFileChange}
            onSubmit={handleSubmit}
        />
    );
};

export default MyProfile;