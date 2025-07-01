"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
import CardForm from "@/templates/forms/card-form";
import { networkService } from "@/services/network.service";
import { utilityService } from "@/services/utility.service";

// Define buttonStyle for consistent styling
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
    house_flat_apartment_villa: "",
    building_no: "",
    road_no_1: "",
    road_no_2: "",
    city: "",
    country: "",
  });
  const [dialCodeOptions, setDialCodeOptions] = useState([]);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSelectChange = (field) => (selectedOption) => {
    setFormData({ ...formData, [field]: selectedOption ? selectedOption.value : "" });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const employeeId = user?.id;
        if (!employeeId) {
          throw new Error("User ID not found in localStorage");
        }

        // Fetch contact info
        const contactResponse = await networkService.get(`/employee/contact-info-single/${employeeId}`);
        if (contactResponse) {
          setFormData({
            dialCode: contactResponse.dial_code || "",
            phoneNumber: contactResponse.phone_number || "",
            whatsapp_number: contactResponse.whatsapp_number || "",
            preferred_language: contactResponse.language?.value || "",
            address: contactResponse.address || "",
            house_flat_apartment_villa: contactResponse.house_flat_apartment_villa || "",
            building_no: contactResponse.building_no || "",
            road_no_1: contactResponse.road_no_1 || "",
            road_no_2: contactResponse.road_no_2 || "",
            city: contactResponse.city || "",
            country: contactResponse.country?.name || "",
          });
        }

        // Fetch language options
        const languageResponse = await networkService.getDropdowns("language");
        if (languageResponse?.language) {
          setLanguageOptions(languageResponse.language.map(item => ({
            value: item.value,
            label: item.value,
            id: item.id,
          })));
        } else {
          throw new Error("No language options returned");
        }

        // Fetch country options for country and dialCode
        const countryResponse = await networkService.get("/country");
        if (countryResponse) {
          setCountryOptions(countryResponse.map(item => ({
            value: item.name,
            label: item.name,
            id: item.id,
          })));
          setDialCodeOptions(countryResponse.map(item => ({
            value: item.dial_code,
            label: `${item.dial_code} (${item.name})`,
            id: item.id,
          })));
        } else {
          throw new Error("No country options returned");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        await utilityService.showAlert(
          "Error",
          error.message || "Failed to load contact information.",
          "error"
        );
      }
    };

    fetchData();
  }, []);

  const fields = [
    {
      type: "select",
      name: "dialCode",
      label: "Dial Code",
      options: dialCodeOptions,
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
      name: "house_flat_apartment_villa",
      label: "House/Flat/Apartment/Villa",
      placeholder: "E.g., Villa",
      colClass: "col-lg-3 col-md-12",
      required: true,
    },
    {
      type: "text",
      name: "building_no",
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
      name: "road_no_1",
      label: "Road No 1",
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
      name: "road_no_2",
      label: "Road No 2",
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
      options: countryOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Country",
      required: true,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const employeeId = user?.id;
      if (!employeeId) {
        throw new Error("User ID not found in localStorage");
      }

      // Map form values to API expected IDs
      const getIdFromValue = (options, value) => {
        const option = options.find(opt => opt.value === value);
        return option ? option.id : null;
      };

      const data = {
        employee_id: employeeId,
        dial_code: formData.dialCode,
        phone_number: formData.phoneNumber,
        preferred_language_id: getIdFromValue(languageOptions, formData.preferred_language),
        address: formData.address,
        house_flat_apartment_villa: formData.house_flat_apartment_villa,
        building_no: formData.building_no,
        road_no_1: formData.road_no_1,
        road_no_2: formData.road_no_2,
        city: formData.city,
        country_id: getIdFromValue(countryOptions, formData.country),
      };

      const response = await networkService.post("/employee/contact-info-edit", data);
      if (response) {
        await utilityService.showAlert("Success", "Contact information updated successfully!", "success");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      await utilityService.showAlert(
        "Error",
        error.message || "Failed to update contact information. Please try again.",
        "error"
      );
    }
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