"use client";

import { useState, useEffect } from "react";
import CardForm from "@/templates/forms/card-form";
import Select from "react-select";
import { networkService } from "@/services/network.service";
import { notificationService } from "@/services/notification.service";
import Loader from "@/globals/Loader";

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

const InterviewManagement = () => {
  const [formData, setFormData] = useState({
    interviewTime: "",
    liveInWithFamily: "",
    relocationInsideCountry: "",
    maxHoursPerDay: "",
    flexibleWeekends: "",
    householdType: "",
    communicationLanguage: "",
    country: "",
  });
  const [householdTypeOptions, setHouseholdTypeOptions] = useState([]);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [liveInOptions, setLiveInOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Specific validations
    if (formData.maxHoursPerDay && (isNaN(formData.maxHoursPerDay) || formData.maxHoursPerDay < 1 || formData.maxHoursPerDay > 24)) {
      errors.maxHoursPerDay = `${fieldLabels.maxHoursPerDay} must be a number between 1 and 24`;
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsInitialLoading(true);
        const user = JSON.parse(localStorage.getItem("user"));
        const employeeId = user?.id;
        if (!employeeId) {
          throw new Error("User ID not found in localStorage");
        }

        // Fetch interview data
        const interviewResponse = await networkService.get(`/employee/interview-single/${employeeId}`);
        if (interviewResponse) {
          // Normalize values to match dropdown options
          const normalizeValue = (value, type) => {
            if (!value) return "";
            // Specific mappings for willing_to_live_in to handle case and typos
            if (type === "willing_to_live_in") {
              const mappings = {
                Yes: "yes",
                No: "No",
                Conditional: "Conditonal", // Handle typo in API
                conditonal: "Conditonal",
                YES: "yes",
                NO: "No",
              };
              return mappings[value] || value;
            }
            // Title case for other dropdowns (householdType, communicationLanguage, country)
            return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
          };

          setFormData({
            interviewTime: interviewResponse.preferred_interview_time || "",
            householdType: interviewResponse.house_hold_type?.value || "",
            liveInWithFamily: normalizeValue(interviewResponse.willing_family?.value, "willing_to_live_in") || "",
            relocationInsideCountry: interviewResponse.comfortable_with_relocation === null ? "" : interviewResponse.comfortable_with_relocation ? "Yes" : "No",
            maxHoursPerDay: interviewResponse.maximum_hours_per_day || "",
            flexibleWeekends: interviewResponse.flexible_with_weekends === null ? "" : interviewResponse.flexible_with_weekends ? "Yes" : "No",
            communicationLanguage: normalizeValue(interviewResponse.language?.value, "language") || "",
            country: normalizeValue(interviewResponse.country?.name, "country") || "",
          });
        }

        // Fetch preferred_household_type options
        const householdResponse = await networkService.getDropdowns("prefered_household_tpye");
        if (householdResponse?.prefered_household_tpye) {
          setHouseholdTypeOptions(
            householdResponse.prefered_household_tpye.map(item => ({
              value: item.value,
              label: item.value,
              id: item.id,
            }))
          );
        } else {
          throw new Error("No household type options returned");
        }

        // Fetch language options
        const languageResponse = await networkService.getDropdowns("language");
        if (languageResponse?.language) {
          setLanguageOptions(
            languageResponse.language.map(item => ({
              value: item.value,
              label: item.value,
              id: item.id,
            }))
          );
        } else {
          throw new Error("No language options returned");
        }

        // Fetch willing_to_live_in options
        const liveInResponse = await networkService.getDropdowns("willing_to_live_in");
        if (liveInResponse?.willing_to_live_in) {
          setLiveInOptions(
            liveInResponse.willing_to_live_in.map(item => ({
              value: item.value,
              label: item.value,
              id: item.id,
            }))
          );
        } else {
          throw new Error("No willing to live-in options returned");
        }

        // Fetch country options
        console.log("Fetching country options...");
        const countryResponse = await networkService.get("/country");
        console.log("Country API response:", countryResponse);
        if (Array.isArray(countryResponse) && countryResponse.length > 0) {
          const options = countryResponse.map((item) => ({
            value: item.name || "",
            label: item.name || "",
            id: item.id || null,
          }));
          console.log("Setting countryOptions:", options);
          setCountryOptions(options);
        } else {
          console.error("Country API response is invalid or empty:", countryResponse);
          throw new Error("No country options returned");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        await notificationService.showToast(
          error.message || "Failed to load interview data.",
          "error"
        );
      } finally {
        setTimeout(() => {
          setIsInitialLoading(false);
          console.log("Initial loading complete, countryOptions:", countryOptions);
        }, 500);
      }
    };

    fetchData();
  }, []);

  const yesNoOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  const fields = [
    {
      type: "text",
      name: "interviewTime",
      label: "Preferred Interview Time",
      placeholder: "E.g., 10 AM - 12 PM",
      colClass: "col-lg-3 col-md-12",
      required: true,
    },
    {
      type: "number",
      name: "maxHoursPerDay",
      label: "Maximum hours per day",
      placeholder: "E.g., 8",
      colClass: "col-lg-3 col-md-12",
      min: "1",
      required: true,
    },
    {
      type: "select",
      name: "householdType",
      label: "Preferred household type",
      options: householdTypeOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Preference",
      required: true,
      component: Select,
      disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "select",
      name: "communicationLanguage",
      label: "Languages preferred",
      options: languageOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Language",
      required: true,
      component: Select,
      disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "select",
      name: "liveInWithFamily",
      label: "Willing to live-in with family?",
      options: liveInOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Option",
      required: true,
      component: Select,
      disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "select",
      name: "relocationInsideCountry",
      label: "Comfortable with relocation?",
      options: yesNoOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Option",
      required: true,
      component: Select,
      disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "select",
      name: "flexibleWeekends",
      label: "Flexible with weekends?",
      options: yesNoOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Option",
      required: true,
      component: Select,
      disabled: isInitialLoading || isSubmitting,
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
      disabled: isInitialLoading || isSubmitting,
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
      setIsSubmitting(true);
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
        preferred_interview_time: formData.interviewTime,
        maximum_hours_per_day: parseInt(formData.maxHoursPerDay) || null,
        preferred_household_type_id: getIdFromValue(householdTypeOptions, formData.householdType),
        languages_preferred_id: getIdFromValue(languageOptions, formData.communicationLanguage),
        willing_to_live_in_with_family_id: getIdFromValue(liveInOptions, formData.liveInWithFamily),
        comfortable_with_relocation: formData.relocationInsideCountry === "Yes",
        flexible_with_weekends: formData.flexibleWeekends === "Yes",
        country_id: getIdFromValue(countryOptions, formData.country),
      };

      const response = await networkService.post("/employee/interview-edit", data);
      if (response) {
        await notificationService.showToast("Interview preferences updated successfully!", "success");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      await notificationService.showToast(
        error.message || "Failed to update interview preferences. Please try again.",
        "error"
      );
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 500);
    }
  };

  return (
    <div className="relative min-h-screen">
      <style>
        {`
          .is-invalid {
            border: 1px solid #dc3545 !important;
          }
          .invalid-feedback {
            display: block;
            color: #dc3545;
            fontSize: 0.875rem;
            marginTop: 0.25rem;
          }
        `}
      </style>
      {(isInitialLoading || isSubmitting) && (
        <Loader text={isInitialLoading ? "Loading..." : "Saving..."} />
      )}
      <CardForm
        fields={fields}
        formData={formData}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
        onSubmit={handleSubmit}
        loading={isInitialLoading || isSubmitting}
        formErrors={formErrors}
      />
    </div>
  );
};

export default InterviewManagement;