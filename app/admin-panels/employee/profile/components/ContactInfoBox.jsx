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

const ContactInfoBox = () => {
  const [formData, setFormData] = useState({
    dialCode: "",
    phoneNumber: "",
    whatsapp_number: "",
    preferred_language: "",
    address: "",
    houseType: "",
    buildingNo: "",
    roadNo: "",
    blockNo: "",
    city: "",
    country: "",
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSelectChange = (field) => (selectedOption) => {
    setFormData({ ...formData, [field]: selectedOption ? selectedOption.value : "" });
  };

  // Gulf countries and their dial codes
  const gulfCountriesDialCodeOptions = [
    { value: "+973", label: "+973 (Bahrain)" },
    { value: "+965", label: "+965 (Kuwait)" },
    { value: "+968", label: "+968 (Oman)" },
    { value: "+974", label: "+974 (Qatar)" },
    { value: "+966", label: "+966 (Saudi Arabia)" },
    { value: "+971", label: "+971 (United Arab Emirates)" },
  ];

  const languageOptions = [
    { value: "English", label: "English" },
    { value: "Arabic", label: "Arabic" },
    { value: "Hindi", label: "Hindi" },
    { value: "Urdu", label: "Urdu" },
    { value: "Other", label: "Other" },
  ];

  const gulfCountriesOptions = [
    { value: "Bahrain", label: "Bahrain" },
    { value: "Kuwait", label: "Kuwait" },
    { value: "Oman", label: "Oman" },
    { value: "Qatar", label: "Qatar" },
    { value: "Saudi Arabia", label: "Saudi Arabia" },
    { value: "United Arab Emirates", label: "United Arab Emirates" },
  ];

  const fields = [
    {
      type: "select",
      name: "dialCode",
      label: "Dial Code",
      options: gulfCountriesDialCodeOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Dial Code",
      required: true,
    },
    {
      type: "text",
      name: "phoneNumber",
      label: "Phone Number",
      placeholder: "12345678",
      colClass: "col-lg-3 col-md-12",
      required: true,
      style: {
        WebkitAppearance: "none",
        MozAppearance: "textfield",
      },
    },
    {
      type: "text",
      name: "whatsapp_number",
      label: "WhatsApp Number",
      placeholder: "WhatsApp number",
      colClass: "col-lg-3 col-md-12",
      required: true,
      style: {
        WebkitAppearance: "none",
        MozAppearance: "textfield",
      },
    },
    {
      type: "select",
      name: "preferred_language",
      label: "Preferred Communication Language",
      options: languageOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Language",
      required: true,
    },
    {
      type: "text",
      name: "address",
      label: "Address",
      placeholder: "123 Example Street, Manama, Bahrain",
      colClass: "col-lg-12 col-md-12",
      required: true,
    },
    {
      type: "text",
      name: "houseType",
      label: "House/Flat/Apartment/Villa",
      placeholder: "E.g., Villa",
      colClass: "col-lg-3 col-md-12",
      required: true,
    },
    {
      type: "text",
      name: "buildingNo",
      label: "Building No",
      placeholder: "E.g., 123",
      colClass: "col-lg-3 col-md-12",
      required: true,
      style: {
        WebkitAppearance: "none",
        MozAppearance: "textfield",
      },
    },
    {
      type: "text",
      name: "roadNo",
      label: "Road No",
      placeholder: "E.g., 456",
      colClass: "col-lg-3 col-md-12",
      required: true,
      style: {
        WebkitAppearance: "none",
        MozAppearance: "textfield",
      },
    },
    {
      type: "text",
      name: "blockNo",
      label: "Block No",
      placeholder: "E.g., 789",
      colClass: "col-lg-3 col-md-12",
      required: true,
      style: {
        WebkitAppearance: "none",
        MozAppearance: "textfield",
      },
    },
    {
      type: "text",
      name: "city",
      label: "City",
      placeholder: "E.g., Manama",
      colClass: "col-lg-3 col-md-12",
      required: true,
    },
    {
      type: "select",
      name: "country",
      label: "Country",
      options: gulfCountriesOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Country",
      required: true,
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

export default ContactInfoBox;