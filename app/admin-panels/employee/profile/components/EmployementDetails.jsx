"use client";

import CardForm from "@/templates/forms/card-form";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { networkService } from "@/services/network.service";
import { utilityService } from "@/services/utility.service";

// Define buttonStyle at the top level so it can be used across all components
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

// Define inputStyle for file inputs (matching Document.jsx)
const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "0.5rem",
  backgroundColor: "#F0F5F7",
  boxSizing: "border-box",
  height: "60px",
};

// Define tickBoxStyle for the tick container
const tickBoxStyle = (isFileSelected) => ({
  position: "absolute",
  right: "20px",
  top: "30%",
  transform: "translateY(-50%)",
  width: "24px",
  height: "24px",
  border: `1px solid ${isFileSelected ? "#28a745" : "#d0d0d0"}`,
  borderRadius: "50%",
  backgroundColor: isFileSelected ? "#28a745" : "transparent",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
});

const EmploymentDetails = () => {
  const [supportingDocs, setSupportingDocs] = useState([]);
  const [formData, setFormData] = useState({
    experience: "",
    employers: "",
    skills: "",
    workingHours: "9:00 am to 5:00pm",
    salary: "",
    noticePeriod: "",
    needAirTicket: "",
    employmentPreference: "",
    availability: "",
    interviewTimings: "",
    verificationStatus: "",
    employeeType: "",
    employeeCategory: "",
    visaStatus: "",
    visaExpiryDate: "",
    willingToLiveIn: "",
    maxWorkHours: "",
    flexibleWeekends: "",
    otherBenefits: "",
  });
  const [employmentPreferenceOptions, setEmploymentPreferenceOptions] = useState([]);
  const [workingHoursOptions, setWorkingHoursOptions] = useState([]);
  const [verificationStatusOptions, setVerificationStatusOptions] = useState([]);
  const [employeeTypeOptions, setEmployeeTypeOptions] = useState([]);
  const [willingToLiveInOptions, setWillingToLiveInOptions] = useState([]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSelectChange = (field) => (selectedOption) => {
    setFormData({ ...formData, [field]: selectedOption ? selectedOption.value : "" });
  };

  const handleFileChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.files });
    setSupportingDocs(e.target.files);
  };

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        // Fetch type_of_employment_prefernce options
        const employmentResponse = await networkService.getDropdowns("type_of_employment_prefernce");
        if (employmentResponse?.type_of_employment_prefernce) {
          const options = employmentResponse.type_of_employment_prefernce.map((item) => ({
            value: item.value,
            label: item.value,
          }));
          setEmploymentPreferenceOptions(options);
        } else {
          throw new Error("No employment preference options returned");
        }

        // Fetch prefered_working_hours options
        const workingHoursResponse = await networkService.getDropdowns("prefered_working_hours");
        if (workingHoursResponse?.prefered_working_hours) {
          const options = workingHoursResponse.prefered_working_hours.map((item) => ({
            value: item.value,
            label: item.value,
          }));
          setWorkingHoursOptions(options);
        } else {
          throw new Error("No working hours options returned");
        }

        // Fetch document_verification_status options
        const verificationStatusResponse = await networkService.getDropdowns("document_verification_status");
        if (verificationStatusResponse?.document_verification_status) {
          const options = verificationStatusResponse.document_verification_status.map((item) => ({
            value: item.value,
            label: item.value,
          }));
          setVerificationStatusOptions(options);
        } else {
          throw new Error("No document verification status options returned");
        }

        // Fetch employee_type options
        const employeeTypeResponse = await networkService.getDropdowns("employee_type");
        if (employeeTypeResponse?.employee_type) {
          const options = employeeTypeResponse.employee_type.map((item) => ({
            value: item.value,
            label: item.value,
          }));
          setEmployeeTypeOptions(options);
        } else {
          throw new Error("No employee type options returned");
        }

        // Fetch willing_to_live_in options
        const willingToLiveInResponse = await networkService.getDropdowns("willing_to_live_in");
        if (willingToLiveInResponse?.willing_to_live_in) {
          const options = willingToLiveInResponse.willing_to_live_in.map((item) => ({
            value: item.value,
            label: item.value,
          }));
          setWillingToLiveInOptions(options);
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

  const availabilityOptions = [
    { value: "available", label: "Available" },
    { value: "not_available", label: "Not Available" },
  ];

  const employeeCategoryOptions = [
    { value: "Driver", label: "Driver" },
    { value: "Cook", label: "Cook" },
    { value: "Maid", label: "Maid" },
    { value: "Nanny", label: "Nanny" },
    { value: "Elderly Care", label: "Elderly Care" },
  ];

  const visaStatusOptions = [
    { value: "Own Visa", label: "Own Visa" },
    { value: "Needs Sponsorship", label: "Needs Sponsorship" },
  ];

  const fields = [
    {
      type: "number",
      name: "experience",
      label: "Work Experience (Years)",
      placeholder: "5",
      colClass: "col-lg-3 col-md-12",
      min: "0",
      required: true,
    },
    {
      type: "text",
      name: "employers",
      label: "Previous Employers (optional)",
      placeholder: "Company A, Company B",
      colClass: "col-lg-3 col-md-12",
    },
    {
      type: "text",
      name: "skills",
      label: "Skills and Expertise",
      placeholder: "Enter skills",
      colClass: "col-lg-3 col-md-12",
      required: true,
    },
    {
      type: "select",
      name: "workingHours",
      label: "Preferred Working Hours",
      options: workingHoursOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Hours",
      required: true,
    },
    {
      type: "number",
      name: "salary",
      label: "Expected Salary (BHD)",
      placeholder: "500",
      colClass: "col-lg-3 col-md-12",
      min: "0",
      step: "0.01",
      required: true,
    },
    {
      type: "text",
      name: "noticePeriod",
      label: "Notice Period",
      placeholder: "30 days",
      colClass: "col-lg-3 col-md-12",
      required: true,
    },
    {
      type: "select",
      name: "needAirTicket",
      label: "Need Air Ticket",
      options: yesNoOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Option",
      required: true,
    },
    {
      type: "select",
      name: "employmentPreference",
      label: "Type of Employment Preference",
      options: employmentPreferenceOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Preference",
      required: true,
    },
    {
      type: "select",
      name: "availability",
      label: "Availability",
      options: availabilityOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Availability",
      required: true,
    },
    {
      type: "text",
      name: "interviewTimings",
      label: "Preferred Interview Timings",
      placeholder: "3 - 5 PM",
      colClass: "col-lg-3 col-md-12",
      required: true,
    },
    {
      type: "select",
      name: "verificationStatus",
      label: "Document Verification Status",
      options: verificationStatusOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Status",
      required: true,
    },
    {
      type: "select",
      name: "employeeType",
      label: "Employee Type",
      options: employeeTypeOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Type",
      required: true,
    },
    {
      type: "select",
      name: "employeeCategory",
      label: "Employee Category",
      options: employeeCategoryOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Category",
      required: true,
    },
    {
      type: "select",
      name: "visaStatus",
      label: "Visa Status",
      options: visaStatusOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Status",
      required: true,
    },
    {
      type: "date",
      name: "visaExpiryDate",
      label: "Visa Expiry Date",
      colClass: "col-lg-3 col-md-12",
      required: true,
      style: inputStyle,
    },
    {
      type: "select",
      name: "willingToLiveIn",
      label: "Willing to Live-in?",
      options: willingToLiveInOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Option",
      required: true,
    },
    {
      type: "number",
      name: "maxWorkHours",
      label: "Max Work Hours/Day",
      placeholder: "8",
      colClass: "col-lg-3 col-md-12",
      min: "1",
      max: "24",
      required: true,
    },
    {
      type: "select",
      name: "flexibleWeekends",
      label: "Flexible with Weekends?",
      options: yesNoOptions,
      colClass: "col-lg-3 col-md-12",
      placeholder: "Select Option",
      required: true,
    },
    {
      type: "file",
      name: "supportingDocs",
      label: "Supporting Documents",
      colClass: "col-lg-6 col-md-12",
      accept: ".pdf,.doc,.docx,image/*",
      multiple: true,
      style: inputStyle,
    },
    {
      type: "textarea",
      name: "otherBenefits",
      label: "Other Benefits Requirements",
      placeholder: "List any other benefits you require",
      colClass: "col-lg-12 col-md-6",
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
      handleFileChange={handleFileChange}
      onSubmit={handleSubmit}
    />
  );
};

export default EmploymentDetails;