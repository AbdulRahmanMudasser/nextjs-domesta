"use client";

import EmploymentDetailsCardForm from "@/templates/forms/EmploymentDetailsCardForm";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { networkService } from "@/services/network.service";
import { userService } from "@/services/user.service";
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
    workingHours: "",
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
  const [serviceOptions, setServiceOptions] = useState([]);
  const [visaStatusOptions, setVisaStatusOptions] = useState([]);
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

  // Helper function to find option by value
  const findOptionByValue = (options, value) => {
    return options.find(option => option.value === value);
  };

  // Helper function to find option by ID 
  const findOptionById = (options, id) => {
    return options.find(option => option.id === id);
  };

  // Helper function to get value from nested object (similar to MyProfile.jsx)
  const getValue = (obj, fallback = "") => obj?.value || obj?.name || fallback;

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  // Helper function to fetch media thumbnail (similar to MyProfile.jsx)
  const fetchMediaThumbnail = async (mediaId, originalUrl) => {
    if (!mediaId) return "";
    try {
      const mediaResponse = await networkService.get(`/media/single/${mediaId}`);
      if (mediaResponse?.data?.base_url && mediaResponse?.data?.thumb_size) {
        return `${mediaResponse.data.base_url}${mediaResponse.data.thumb_size}`;
      }
      return originalUrl || "";
    } catch (error) {
      console.error(`Error fetching media ${mediaId}:`, error);
      return originalUrl || "";
    }
  };

  // Map API response to form data
  const mapApiToFormData = async (apiData) => {
    if (!apiData) return;

    console.log("Mapping API data to form data:", apiData);

    const mappedData = {
      experience: apiData.work_experience_years || "",
      employers: apiData.previous_employers || "",
      skills: apiData.skills_and_expertise || "",
      workingHours: getValue(apiData.preferred_working_hours),
      salary: apiData.expected_salary_bhd || "",
      noticePeriod: apiData.notice_period || "",
      needAirTicket: apiData.need_air_ticket === true ? "Yes" : apiData.need_air_ticket === false ? "No" : "",
      employmentPreference: getValue(apiData.employment_type),
      availability: apiData.availability || "",
      interviewTimings: apiData.preferred_interview_timings || "",
      verificationStatus: getValue(apiData.document_verification_status),
      employeeType: getValue(apiData.employee_type),
      employeeCategory: getValue(apiData.service) || getValue(apiData.employee_service),
      visaStatus: getValue(apiData.visa_status),
      visaExpiryDate: formatDate(apiData.visa_expiry_date),
      willingToLiveIn: getValue(apiData.willing_live),
      maxWorkHours: apiData.max_work_hours_per_day || "",
      flexibleWeekends: apiData.flexible_with_weekends === true ? "Yes" : apiData.flexible_with_weekends === false ? "No" : "",
      otherBenefits: apiData.other_benefits_requirements || "",
      supportingDocsId: apiData.media_id || null,
    };

    console.log("Mapped form data:", mappedData);

    // Handle media preview if exists
    if (apiData.media && apiData.media.base_url && apiData.media.unique_name) {
      const originalUrl = `${apiData.media.base_url}${apiData.media.unique_name}`;
      mappedData.supportingDocsUrl = originalUrl;
      
      // Fetch thumbnail for preview
      try {
        const thumbnailUrl = await fetchMediaThumbnail(apiData.media_id, originalUrl);
        setDocumentPreviews(prev => ({
          ...prev,
          supportingDocs: thumbnailUrl,
        }));
      } catch (error) {
        console.error("Error fetching media thumbnail:", error);
        // Fallback to original URL for preview if thumbnail fails
        setDocumentPreviews(prev => ({
          ...prev,
          supportingDocs: originalUrl,
        }));
      }
    }

    setFormData(prev => ({ ...prev, ...mappedData }));
  };

  // Map form data to API format
  const mapFormToApiData = (userId) => {
    // Find the ID for dropdown values
    const getDropdownId = (options, value) => {
      const option = findOptionByValue(options, value);
      console.log(`Finding ID for value "${value}" in options:`, options, "Found:", option);
      return option ? option.id : null;
    };

    const apiData = {
      employee_id: userId,
      work_experience_years: formData.experience ? parseInt(formData.experience) : null,
      previous_employers: formData.employers || null,
      skills_and_expertise: formData.skills || null,
      preferred_working_hours_id: getDropdownId(workingHoursOptions, formData.workingHours),
      expected_salary_bhd: formData.salary ? parseFloat(formData.salary) : null,
      notice_period: formData.noticePeriod || null,
      need_air_ticket: formData.needAirTicket === "Yes" ? true : formData.needAirTicket === "No" ? false : null,
      employment_type_preference_id: getDropdownId(employmentPreferenceOptions, formData.employmentPreference),
      availability: formData.availability || null,
      preferred_interview_timings: formData.interviewTimings || null,
      document_verification_status_id: getDropdownId(verificationStatusOptions, formData.verificationStatus),
      employee_type_id: getDropdownId(employeeTypeOptions, formData.employeeType),
      visa_status_id: getDropdownId(visaStatusOptions, formData.visaStatus),
      visa_expiry_date: formData.visaExpiryDate || null,
      willing_to_live_in_id: getDropdownId(willingToLiveInOptions, formData.willingToLiveIn),
      max_work_hours_per_day: formData.maxWorkHours ? parseInt(formData.maxWorkHours) : null,
      flexible_with_weekends: formData.flexibleWeekends === "Yes" ? true : formData.flexibleWeekends === "No" ? false : null,
      other_benefits_requirements: formData.otherBenefits || null,
      employee_service_id: getDropdownId(serviceOptions, formData.employeeCategory),
      media_id: formData.supportingDocsId || null,
    };

    console.log("Form data:", formData);
    console.log("Mapped API data:", apiData);
    return apiData;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsInitialLoading(true);
        
        // Get current user
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) {
          await notificationService.showToast("User not found. Please login again.", "error");
          return;
        }

        // Fetch all dropdowns
        const [
          employmentResponse,
          workingHoursResponse,
          verificationStatusResponse,
          employeeTypeResponse,
          willingToLiveInResponse,
          visaStatusResponse,
          servicesResponse
        ] = await Promise.all([
          networkService.getDropdowns("type_of_employment_prefernce"),
          networkService.getDropdowns("prefered_working_hours"),
          networkService.getDropdowns("document_verification_status"),
          networkService.getDropdowns("employee_type"),
          networkService.getDropdowns("willing_to_live_in"),
          networkService.getDropdowns("visa_status"),
          userService.getServices()
        ]);

        // Set dropdown options
        if (employmentResponse?.type_of_employment_prefernce) {
          setEmploymentPreferenceOptions(employmentResponse.type_of_employment_prefernce.map(item => ({
            id: item.id,
            value: item.value,
            label: item.value,
          })));
        }

        if (workingHoursResponse?.prefered_working_hours) {
          setWorkingHoursOptions(workingHoursResponse.prefered_working_hours.map(item => ({
            id: item.id,
            value: item.value,
            label: item.value,
          })));
        }

        if (verificationStatusResponse?.document_verification_status) {
          setVerificationStatusOptions(verificationStatusResponse.document_verification_status.map(item => ({
            id: item.id,
            value: item.value,
            label: item.value,
          })));
        }

        if (employeeTypeResponse?.employee_type) {
          setEmployeeTypeOptions(employeeTypeResponse.employee_type.map(item => ({
            id: item.id,
            value: item.value,
            label: item.value,
          })));
        }

        if (willingToLiveInResponse?.willing_to_live_in) {
          setWillingToLiveInOptions(willingToLiveInResponse.willing_to_live_in.map(item => ({
            id: item.id,
            value: item.value,
            label: item.value,
          })));
        }

        if (visaStatusResponse?.visa_status) {
          setVisaStatusOptions(visaStatusResponse.visa_status.map(item => ({
            id: item.id,
            value: item.value,
            label: item.value,
          })));
        }

        if (servicesResponse && Array.isArray(servicesResponse)) {
          setServiceOptions(servicesResponse.map(item => ({
            id: item.id,
            value: item.name || item.title, // Use name if available, fallback to title
            label: item.name || item.title,
          })));
        }

        // Fetch existing employment details
        const employmentData = await userService.getEmploymentDetails(user.id);
        if (employmentData) {
          await mapApiToFormData(employmentData);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        await notificationService.showToast(
          error.message || "Failed to load data.",
          "error"
        );
      } finally {
        setTimeout(() => {
          setIsInitialLoading(false);
        }, 500);
      }
    };

    fetchData();
  }, []);

  const yesNoOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  const availabilityOptions = [
    { value: "available", label: "Available" },
    { value: "not_available", label: "Not Available" },
  ];

  const employeeCategoryOptions = serviceOptions; // Use services from API

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
      
      // Get current user
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        await notificationService.showToast("User not found. Please login again.", "error");
        return;
      }

      // Map form data to API format
      const apiData = mapFormToApiData(user.id);
      console.log("Mapped API data:", apiData);

      // Save employment details
      const response = await userService.saveEmploymentDetails(apiData);
      
      if (response) {
        console.log("Employment details saved successfully:", response);
      }
      
    } catch (error) {
      console.error("Form submission error:", error);
      // Error handling is done in userService.saveEmploymentDetails
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