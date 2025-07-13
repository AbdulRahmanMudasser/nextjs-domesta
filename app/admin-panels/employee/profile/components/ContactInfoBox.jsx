"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
import ContactCardForm from "@/templates/forms/ContactCardForm";
import { networkService } from "@/services/network.service";
import { notificationService } from "@/services/notification.service";

// Fallback CSS for loader in case Tailwind fails
const loaderStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "5px solid #ccc",
    borderTop: "5px solid #8C956B",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  text: {
    color: "#fff",
    fontSize: "18px",
    marginTop: "10px",
  },
};

// Define buttonStyle for consistent styling
const buttonStyle = {
  padding: "0.75rem 1.5rem",
  border: "none",
  borderRadius: "0.5rem",
  backgroundColor: "#8C956B",
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
  const [formErrors, setFormErrors] = useState({});
  const [dialCodeOptions, setDialCodeOptions] = useState([]);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSelectChange = (field) => (selectedOption) => {
    setFormData({ ...formData, [field]: selectedOption ? selectedOption.value : "" });
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Create a mapping of field names to their display labels
    const fieldLabels = fields.reduce((acc, field) => ({
      ...acc,
      [field.name]: field.label,
    }), {});

    // Validate required fields
    const requiredFields = fields.filter((f) => f.required).map((f) => f.name);
    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field] === "") {
        errors[field] = `${fieldLabels[field]} is required`;
        isValid = false;
      }
    });

    // Phone number validation
    if (formData.phoneNumber && !/^\d{7,15}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = `${fieldLabels.phoneNumber} must be 7-15 digits`;
      isValid = false;
    }

    if (formData.whatsapp_number && !/^\d{7,15}$/.test(formData.whatsapp_number)) {
      errors.whatsapp_number = `${fieldLabels.whatsapp_number} must be 7-15 digits`;
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const employeeId = user?.id;
        if (!employeeId) {
          throw new Error("User ID not found in localStorage");
        }

        console.log("Fetching contact info...");
        const contactResponse = await networkService.get(`/employee/contact-info-single/${employeeId}`);
        if (contactResponse) {
          setFormData({
            dialCode: contactResponse.dial_code || "",
            phoneNumber: contactResponse.phone_number || "",
            whatsapp_number: contactResponse.whats_app_no || "",
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

        const languageResponse = await networkService.getDropdowns("language");
        if (languageResponse?.language) {
          setLanguageOptions(
            languageResponse.language.map((item) => ({
              value: item.value,
              label: item.value,
              id: item.id,
            }))
          );
        } else {
          throw new Error("No language options returned");
        }

        const countryResponse = await networkService.get("/country");
        if (countryResponse) {
          setCountryOptions(
            countryResponse.map((item) => ({
              value: item.name,
              label: item.name,
              id: item.id,
            }))
          );
          setDialCodeOptions(
            countryResponse.map((item) => ({
              value: item.dial_code,
              label: `${item.dial_code} (${item.name})`,
              id: item.id,
            }))
          );
        } else {
          throw new Error("No country options returned");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        await notificationService.showToast(
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
      component: Select,
      disabled: loading,
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
      disabled: loading,
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
      disabled: loading,
    },
    {
      type: "select",
      name: "preferred_language",
      label: "Preferred Language",
      options: languageOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Language",
      required: true,
      component: Select,
      disabled: loading,
    },
    {
      type: "text",
      name: "address",
      label: "Address",
      placeholder: "123 Example Street, Manama, Bahrain",
      colClass: "col-lg-12 col-md-12",
      required: true,
      disabled: loading,
    },
    {
      type: "text",
      name: "house_flat_apartment_villa",
      label: "Residence Type",
      placeholder: "E.g., Villa",
      colClass: "col-lg-3 col-md-12",
      required: true,
      disabled: loading,
    },
    {
      type: "text",
      name: "building_no",
      label: "Building Number",
      placeholder: "E.g., 123",
      colClass: "col-lg-3 col-md-12",
      required: true,
      style: {
        WebkitAppearance: "none",
        MozAppearance: "textfield",
      },
      disabled: loading,
    },
    {
      type: "text",
      name: "road_no_1",
      label: "Road Number 1",
      placeholder: "E.g., 456",
      colClass: "col-lg-3 col-md-12",
      required: true,
      style: {
        WebkitAppearance: "none",
        MozAppearance: "textfield",
      },
      disabled: loading,
    },
    {
      type: "text",
      name: "road_no_2",
      label: "Road Number 2",
      placeholder: "E.g., 789",
      colClass: "col-lg-3 col-md-12",
      required: true,
      style: {
        WebkitAppearance: "none",
        MozAppearance: "textfield",
      },
      disabled: loading,
    },
    {
      type: "text",
      name: "city",
      label: "City",
      placeholder: "E.g., Manama",
      colClass: "col-lg-3 col-md-12",
      required: true,
      disabled: loading,
    },
    {
      type: "select",
      name: "country",
      label: "Country",
      options: countryOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Country",
      required: true,
      component: Select,
      disabled: loading,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    if (!validateForm()) {
      const firstError = Object.values(formErrors)[0] || "Please fill in all required fields";
      await notificationService.showToast(firstError, "error");
      return;
    }

    try {
      console.log("Submitting form, loading: true");
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const employeeId = user?.id;
      if (!employeeId) {
        throw new Error("User ID not found in localStorage");
      }

      const getIdFromValue = (options, value) => {
        const option = options.find((opt) => opt.value === value);
        return option ? option.id : null;
      };

      const data = {
        employee_id: employeeId,
        dial_code: formData.dialCode,
        phone_number: formData.phoneNumber,
        whats_app_no: formData.whatsapp_number,
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
        await notificationService.showToast("Contact information updated successfully!", "success");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      await notificationService.showToast(
        error.message || "Failed to update contact information. Please try again.",
        "error"
      );
    } finally {
      setTimeout(() => {
        setLoading(false);
        console.log("Submission complete, loading: false");
      }, 500);
    }
  };

  console.log("Rendering ContactInfoBox, loading:", loading);

  return (
    <div className="relative min-h-screen">
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .is-invalid {
            border: 1px solid #dc3545 !important;
          }
          .invalid-feedback {
            display: block;
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 0.25rem;
          }
        `}
      </style>
      {loading && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-70 flex items-center justify-center z-[1000]"
          style={loaderStyles.overlay}
        >
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-12 h-12 border-4 border-t-4 border-t-[#8C956B] border-gray-300 rounded-full animate-spin"
              style={loaderStyles.spinner}
            ></div>
            <p className="text-white text-xl font-semibold" style={loaderStyles.text}>
              Saving...
            </p>
          </div>
        </div>
      )}
      <ContactCardForm
        fields={fields}
        formData={formData}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
        onSubmit={handleSubmit}
        loading={loading}
        formErrors={formErrors}
      />
    </div>
  );
};

export default ContactInfoBox;