"use client";

import EmploymentDetailsCardForm from "@/templates/forms/EmploymentDetailsCardForm";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { networkService } from "@/services/network.service";
import { notificationService } from "@/services/notification.service";
import Modal from "./Modal";
import Loader from "@/globals/Loader";

// Define inputStyle for file inputs and date fields
const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "0.5rem",
  backgroundColor: "#F0F5F7",
  boxSizing: "border-box",
  height: "60px",
  border: "none",
};

// Define preview button style for document buttons
const previewButtonStyle = {
  marginTop: "10px",
  backgroundColor: "#8C956B",
  color: "white",
  border: "none",
  padding: "0.5rem 1rem",
  borderRadius: "0.5rem",
  cursor: "pointer",
  fontSize: "14px",
};

// Define remove button style
const removeButtonStyle = {
  position: "absolute",
  top: "0px",
  right: "-1px",
  backgroundColor: "#8C956B",
  color: "white",
  borderRadius: "50%",
  width: "28px",
  height: "28px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: "18px",
};

const EmploymentDetails = () => {
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
    supportingDocs: null,
    supportingDocsUrl: "",
    supportingDocsId: null,
  });

  const [formErrors, setFormErrors] = useState({});
  const [employmentPreferenceOptions, setEmploymentPreferenceOptions] = useState([]);
  const [workingHoursOptions, setWorkingHoursOptions] = useState([]);
  const [verificationStatusOptions, setVerificationStatusOptions] = useState([]);
  const [employeeTypeOptions, setEmployeeTypeOptions] = useState([]);
  const [willingToLiveInOptions, setWillingToLiveInOptions] = useState([]);
  const [documentPreviews, setDocumentPreviews] = useState({
    supportingDocs: "",
  });
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSelectChange = (field) => (selectedOption) => {
    setFormData({
      ...formData,
      [field]: selectedOption ? selectedOption.value : "",
    });
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFileChange = (field) => async (e) => {
    const file = e.target.files[0]; // Take only the first file, like MyProfile
    if (file) {
      setFormData({ ...formData, [field]: file });
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
      
      try {
        console.log(`Starting upload for ${field}, isSubmitting: true`);
        setIsSubmitting(true);
        
        // Use the exact same approach as MyProfile
        const response = await networkService.uploadMedia(file);
        
        if (response && response[0]?.base_url && response[0]?.thumb_size) {
          const previewUrl = `${response[0].base_url}${response[0].thumb_size}`;
          setDocumentPreviews((prev) => ({
            ...prev,
            [field]: previewUrl,
          }));
          setFormData((prev) => ({
            ...prev,
            [`${field}Url`]: `${response[0].base_url}${response[0].unique_name}`,
            [`${field}Id`]: response[0].id,
          }));
        }
      } catch (error) {
        console.error(`Error uploading ${field}:`, error);
        await notificationService.showToast(
          `Failed to upload ${field}. Please try again.`,
          "error"
        );
      } finally {
        setTimeout(() => {
          setIsSubmitting(false);
          console.log(`Finished upload for ${field}, isSubmitting: false`);
        }, 500);
      }
    }
  };

  const handleRemoveFile = (field) => () => {
    setFormData((prev) => ({
      ...prev,
      [field]: null,
      [`${field}Url`]: "",
      [`${field}Id`]: null,
    }));
    setDocumentPreviews((prev) => ({
      ...prev,
      [field]: "",
    }));
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handlePreviewClick = (field, url) => () => {
    if (url) {
      if (url.endsWith(".pdf")) {
        setModalContent(
          <iframe
            src={url}
            style={{ width: "100%", height: "80vh", border: "none" }}
            title={`${field} Preview`}
          />
        );
      } else {
        setModalContent(
          <img
            src={url}
            alt={`${field} Preview`}
            style={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: "0.5rem" }}
          />
        );
      }
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        setIsInitialLoading(true);
        
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
        await notificationService.showToast(
          error.message || "Failed to load dropdown options.",
          "error"
        );
      } finally {
        setTimeout(() => {
          setIsInitialLoading(false);
        }, 500);
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
      colClass: "col-lg-4 col-md-12",
      min: "0",
      required: true,
    },
    {
      type: "text",
      name: "employers",
      label: "Previous Employers (optional)",
      placeholder: "Company A, Company B",
      colClass: "col-lg-4 col-md-12",
    },
    {
      type: "text",
      name: "skills",
      label: "Skills and Expertise",
      placeholder: "Enter skills",
      colClass: "col-lg-4 col-md-12",
      required: true,
    },
    {
      type: "select",
      name: "workingHours",
      label: "Preferred Working Hours",
      options: workingHoursOptions,
      colClass: "col-lg-4 col-md-12",
      placeholder: "Select Hours",
      required: true,
    },
    {
      type: "number",
      name: "salary",
      label: "Expected Salary (BHD)",
      placeholder: "500",
      colClass: "col-lg-4 col-md-12",
      min: "0",
      step: "0.01",
      required: true,
    },
    {
      type: "text",
      name: "noticePeriod",
      label: "Notice Period",
      placeholder: "30 days",
      colClass: "col-lg-4 col-md-12",
      required: true,
    },
    {
      type: "select",
      name: "needAirTicket",
      label: "Need Air Ticket",
      options: yesNoOptions,
      colClass: "col-lg-4 col-md-12",
      placeholder: "Select Option",
      required: true,
    },
    {
      type: "select",
      name: "employmentPreference",
      label: "Type of Employment Preference",
      options: employmentPreferenceOptions,
      colClass: "col-lg-4 col-md-12",
      placeholder: "Select Preference",
      required: true,
    },
    {
      type: "select",
      name: "availability",
      label: "Availability",
      options: availabilityOptions,
      colClass: "col-lg-4 col-md-12",
      placeholder: "Select Availability",
      required: true,
    },
    {
      type: "text",
      name: "interviewTimings",
      label: "Preferred Interview Timings",
      placeholder: "3 - 5 PM",
      colClass: "col-lg-4 col-md-12",
      required: true,
    },
    {
      type: "select",
      name: "verificationStatus",
      label: "Document Verification Status",
      options: verificationStatusOptions,
      colClass: "col-lg-4 col-md-12",
      placeholder: "Select Status",
      required: true,
    },
    {
      type: "select",
      name: "employeeType",
      label: "Employee Type",
      options: employeeTypeOptions,
      colClass: "col-lg-4 col-md-12",
      placeholder: "Select Type",
      required: true,
    },
    {
      type: "select",
      name: "employeeCategory",
      label: "Employee Category",
      options: employeeCategoryOptions,
      colClass: "col-lg-4 col-md-12",
      placeholder: "Select Category",
      required: true,
    },
    {
      type: "select",
      name: "visaStatus",
      label: "Visa Status",
      options: visaStatusOptions,
      colClass: "col-lg-4 col-md-12",
      placeholder: "Select Status",
      required: true,
    },
    {
      type: "date",
      name: "visaExpiryDate",
      label: "Visa Expiry Date",
      colClass: "col-lg-4 col-md-12",
      required: true,
      style: inputStyle,
    },
    {
      type: "select",
      name: "willingToLiveIn",
      label: "Willing to Live-in?",
      options: willingToLiveInOptions,
      colClass: "col-lg-4 col-md-12",
      placeholder: "Select Option",
      required: true,
    },
    {
      type: "number",
      name: "maxWorkHours",
      label: "Max Work Hours/Day",
      placeholder: "8",
      colClass: "col-lg-4 col-md-12",
      min: "1",
      max: "24",
      required: true,
    },
    {
      type: "select",
      name: "flexibleWeekends",
      label: "Flexible with Weekends?",
      options: yesNoOptions,
      colClass: "col-lg-4 col-md-12",
      placeholder: "Select Option",
      required: true,
    },
    {
      type: "file",
      name: "supportingDocs",
      label: "Supporting Documents",
      accept: ".pdf,.jpg,.png",
      colClass: "col-lg-4 col-md-12",
      required: false,
      style: inputStyle,
      preview: documentPreviews.supportingDocs,
      previewComponent: (
        <div className="file-placeholder" style={{ position: "relative", cursor: "pointer" }}>
          {documentPreviews.supportingDocs ? (
            <>
              {formData.supportingDocsUrl && formData.supportingDocsUrl.endsWith(".pdf") ? (
                <button
                  onClick={handlePreviewClick("supportingDocs", formData.supportingDocsUrl)}
                  style={previewButtonStyle}
                >
                  View Document
                </button>
              ) : (
                <img
                  src={documentPreviews.supportingDocs}
                  alt="Supporting Documents Preview"
                  style={{
                    maxWidth: "100px",
                    maxHeight: "100px",
                    marginTop: "10px",
                    borderRadius: "0.5rem",
                    objectFit: "cover",
                  }}
                  onClick={handlePreviewClick("supportingDocs", formData.supportingDocsUrl)}
                  onError={() => console.error("Error loading document preview")}
                />
              )}
              <button
                onClick={handleRemoveFile("supportingDocs")}
                style={removeButtonStyle}
                title="Remove Supporting Documents"
              >
                ×
              </button>
            </>
          ) : (
            <div
              style={{ 
                width: "100%",
                borderRadius: "0.5rem",
                backgroundColor: "#F0F5F7",
                boxSizing: "border-box",
                height: "60px",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                cursor: "pointer"
              }}
              className={formErrors.supportingDocs ? "is-invalid" : ""}
              onClick={() => document.getElementById("supportingDocsInput").click()}
            >
              Choose Supporting Documents
            </div>
          )}
          <input
            type="file"
            id="supportingDocsInput"
            name="supportingDocs"
            accept=".pdf,.jpg,.png"
            onChange={handleFileChange("supportingDocs")}
            style={{ display: "none" }}
            disabled={isSubmitting || isInitialLoading}
          />
          {formErrors.supportingDocs && (
            <div className="invalid-feedback" style={{ display: "block", color: "#dc3545", fontSize: "0.875rem" }}>
              {formErrors.supportingDocs}
            </div>
          )}
        </div>
      ),
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    
    console.log("Form submitted with data:", formData);
    
    try {
      setIsSubmitting(true);
      
      // Add your form submission logic here, such as API calls
      await notificationService.showToast("Employment details saved successfully!", "success");
      
    } catch (error) {
      console.error("Form submission error:", error);
      await notificationService.showToast(
        error.message || "Failed to save employment details. Please try again.",
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
            font-size: 0.875rem;
            margin-top: 0.25rem;
          }
        `}
      </style>
      {(isInitialLoading || isSubmitting) && (
        <Loader text={isInitialLoading ? "Loading..." : "Saving..."} />
      )}
      <EmploymentDetailsCardForm
        fields={fields}
        formData={formData}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
        handleFileChange={handleFileChange}
        onSubmit={handleSubmit}
        loading={isSubmitting || isInitialLoading}
        formErrors={formErrors}
        buttonText="Save Employment Details"
      />
      <Modal isOpen={isModalOpen} onClose={closeModal} isWide={modalContent?.type === "iframe"}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default EmploymentDetails;