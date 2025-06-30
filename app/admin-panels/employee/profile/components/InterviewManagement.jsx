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
    const fetchDropdowns = async () => {
      try {
        // Fetch prefered_household_tpye options
        const householdResponse = await networkService.getDropdowns("prefered_household_tpye");
        if (householdResponse?.prefered_household_tpye) {
          const options = householdResponse.prefered_household_tpye.map((item) => ({
            value: item.value,
            label: item.value,
          }));
          setHouseholdTypeOptions(options);
        } else {
          throw new Error("No household type options returned");
        }

        // Fetch language options
        const languageResponse = await networkService.getDropdowns("language");
        if (languageResponse?.language) {
          const options = languageResponse.language.map((item) => ({
            value: item.value,
            label: item.value,
          }));
          setLanguageOptions(options);
        } else {
          throw new Error("No language options returned");
        }

        // Fetch willing_to_live_in options
        const liveInResponse = await networkService.getDropdowns("willing_to_live_in");
        if (liveInResponse?.willing_to_live_in) {
          const options = liveInResponse.willing_to_live_in.map((item) => ({
            value: item.value,
            label: item.value,
          }));
          setLiveInOptions(options);
        } else {
          throw new Error("No willing to live-in options returned");
        }
      } catch (error) {
        console.error("Error fetching dropdowns:", error);
        await utilityService.showAlert(
          "Error",
          error.message || "Failed to load dropdown options.",
          "error"
        );
      }
    };

    fetchDropdowns();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
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