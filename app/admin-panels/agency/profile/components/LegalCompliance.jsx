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

const LegalCompliance = () => {
    const [formData, setFormData] = useState({
        registeredLegalName: "",
        tradeLicenseNumber: "",
        licenseExpiryDate: "",
        yearsInOperation: "",
        agencyType: "",
        tradeLicense: null,
    });

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSelectChange = (field) => (selectedOption) => {
        setFormData({ ...formData, [field]: selectedOption ? selectedOption.value : "" });
    };

    const handleFileChange = (field) => (e) => {
        setFormData({ ...formData, [field]: e.target.files[0] });
    };

    const agencyTypeOptions = [
        { value: "Local", label: "Local" },
        { value: "International", label: "International" },
        { value: "Referral Only", label: "Referral Only" },
        { value: "Full-Service", label: "Full-Service" },
    ];

    const fields = [
        {
            type: "text",
            name: "registeredLegalName",
            label: "Registered Legal Name",
            placeholder: "Enter registered legal name",
            colClass: "col-lg-3 col-md-12",
            required: true,
        },
        {
            type: "text",
            name: "tradeLicenseNumber",
            label: "Trade License Number",
            placeholder: "Enter trade license number",
            colClass: "col-lg-3 col-md-12",
            required: true,
        },
       
        {
            type: "number",
            name: "yearsInOperation",
            label: "Years in Operation",
            placeholder: "Enter years in operation",
            colClass: "col-lg-3 col-md-12",
            min: "0",
            required: true,
        },
        {
            type: "select",
            name: "agencyType",
            label: "Agency Type",
            options: agencyTypeOptions,
            colClass: "col-lg-3 col-md-12",
            placeholder: "Select agency type",
            required: true,
        },
        {
            type: "date",
            name: "licenseExpiryDate",
            label: "License Expiry Date",
            colClass: "col-lg-6 col-md-12",
            required: true,
            style: inputStyle,
        },
        {
            type: "file",
            name: "tradeLicense",
            label: "Upload Trade License",
            accept: ".pdf",
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
            handleSelectChange={handleSelectChange}
            handleFileChange={handleFileChange}
            onSubmit={handleSubmit}
        />
    );
};

export default LegalCompliance;