"use client";

import { useState, useEffect } from "react";
import CardForm from "@/templates/forms/card-form";
import Select from "react-select";
import { networkService } from "@/services/network.service";
import { utilityService } from "@/services/utility.service";

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
  });
  const [householdTypeOptions, setHouseholdTypeOptions] = useState([]);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [liveInOptions, setLiveInOptions] = useState([]);

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
            // Title case for other dropdowns (householdType, communicationLanguage)
            return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
          };

          setFormData({
            interviewTime: interviewResponse.preferred_interview_time || "",
            liveInWithFamily: normalizeValue(interviewResponse.willing_family?.value, "willing_to_live_in") || "",
            relocationInsideCountry: interviewResponse.comfortable_with_relocation === null ? "" : interviewResponse.comfortable_with_relocation ? "Yes" : "No",
            maxHoursPerDay: interviewResponse.maximum_hours_per_day || "",
            flexibleWeekends: interviewResponse.flexible_with_weekends === null ? "" : interviewResponse.flexible_with_weekends ? "Yes" : "No",
            householdType: normalizeValue(interviewResponse.house_hold_type?.value, "prefered_household_tpye") || "",
            communicationLanguage: normalizeValue(interviewResponse.language?.value, "language") || "",
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
      } catch (error) {
        console.error("Error fetching data:", error);
        await utilityService.showAlert(
          "Error",
          error.message || "Failed to load interview data.",
          "error"
        );
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
    },
    {
      type: "select",
      name: "communicationLanguage",
      label: "Languages preferred",
      options: languageOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Language",
      required: true,
    },
    {
      type: "select",
      name: "liveInWithFamily",
      label: "Willing to live-in with family?",
      options: liveInOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Option",
      required: true,
    },
    {
      type: "select",
      name: "relocationInsideCountry",
      label: "Comfortable with relocation?",
      options: yesNoOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Option",
      required: true,
    },
    {
      type: "select",
      name: "flexibleWeekends",
      label: "Flexible with weekends?",
      options: yesNoOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Option",
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
        preferred_interview_time: formData.interviewTime,
        maximum_hours_per_day: parseInt(formData.maxHoursPerDay) || null,
        preferred_household_type_id: getIdFromValue(householdTypeOptions, formData.householdType),
        languages_preferred_id: getIdFromValue(languageOptions, formData.communicationLanguage),
        willing_to_live_in_with_family_id: getIdFromValue(liveInOptions, formData.liveInWithFamily),
        comfortable_with_relocation: formData.relocationInsideCountry === "Yes",
        flexible_with_weekends: formData.flexibleWeekends === "Yes",
      };

      const response = await networkService.post("/employee/interview-edit", data);
      if (response) {
        await utilityService.showAlert("Success", "Interview preferences updated successfully!", "success");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      await utilityService.showAlert(
        "Error",
        error.message || "Failed to update interview preferences. Please try again.",
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

export default InterviewManagement;