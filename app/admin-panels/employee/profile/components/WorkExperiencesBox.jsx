"use client";

import { useState, useEffect } from "react";
import WorkExperienceCardForm from "@/templates/forms/WorkExperienceCardForm";
import { networkService } from "@/services/network.service";
import { notificationService } from "@/services/notification.service";
import Loader from "@/globals/Loader";
import Select from "react-select";

// Define styles at the top
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

const modalStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  padding: "2rem",
  borderRadius: "0.5rem",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  zIndex: 1000,
  width: "90%",
  maxWidth: "800px",
  maxHeight: "80vh",
  overflowY: "auto",
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: 999,
};

const JobExperienceCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [countryOptions, setCountryOptions] = useState([]);
  const [formData, setFormData] = useState({
    employer_name: "",
    employment_location: "",
    employer_dial_code: "",
    employer_phone: "",
    employer_email: "",
    country: "",
    country_id: null,
    start_date: "",
    end_date: "",
    designation: "",
    previous_salary: "",
    benefits: "",
    rating: "",
    employer_review: "",
    pets_experience: "",
    comfortable_with_pets: "", // Changed to string for dropdown
    employee_id: 10, // Hardcoded as per API body
  });

  // Options for comfortable_with_pets dropdown
  const petComfortOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  // Form fields for the modal using WorkExperienceCardForm
  const formFields = [
    {
      type: "text",
      name: "employer_name",
      label: "Employer Name",
      placeholder: "Enter employer name",
      colClass: "col-lg-6 col-md-12",
      required: true,
      disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "text",
      name: "employment_location",
      label: "Employment Location",
      placeholder: "Enter employment location",
      colClass: "col-lg-6 col-md-12",
      required: true,
      disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "text",
      name: "employer_dial_code",
      label: "Employer Dial Code",
      placeholder: "Enter dial code (e.g., +973)",
      colClass: "col-lg-6 col-md-12",
      required: true,
      disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "text",
      name: "employer_phone",
      label: "Employer Phone",
      placeholder: "Enter phone number",
      colClass: "col-lg-6 col-md-12",
      required: true,
      disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "email",
      name: "employer_email",
      label: "Employer Email",
      placeholder: "Enter employer email",
      colClass: "col-lg-6 col-md-12",
      required: true,
      disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "select",
      name: "country",
      label: "Country",
      options: countryOptions,
      placeholder: "Select country",
      colClass: "col-lg-6 col-md-12",
      required: true,
      component: Select,
      disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "date",
      name: "start_date",
      label: "Start Date",
      placeholder: "Select start date",
      colClass: "col-lg-6 col-md-12",
      required: true,
      disabled: isInitialLoading || isSubmitting,
      style: {
        borderRadius: "0.5rem",
        padding: "0.75rem",
        width: "100%",
        backgroundColor: "#F0F5F7",
        boxSizing: "border-box",
        transition: "border-color 0.2s",
        border: "1px solid #ced4da", // Consistent border
      },
    },
    {
      type: "date",
      name: "end_date",
      label: "End Date",
      placeholder: "Select end date",
      colClass: "col-lg-6 col-md-12",
      required: false,
      disabled: isInitialLoading || isSubmitting,
      style: {
        borderRadius: "0.5rem",
        padding: "0.75rem",
        width: "100%",
        backgroundColor: "#F0F5F7",
        boxSizing: "border-box",
        transition: "border-color 0.2s",
        border: "1px solid #ced4da", // Consistent border
      },
    },
    {
      type: "text",
      name: "designation",
      label: "Designation",
      placeholder: "Enter designation",
      colClass: "col-lg-6 col-md-12",
      required: true,
      disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "number",
      name: "previous_salary",
      label: "Previous Salary",
      placeholder: "Enter previous salary",
      colClass: "col-lg-6 col-md-12",
      required: true,
      disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "text",
      name: "benefits",
      label: "Benefits",
      placeholder: "Enter benefits",
      colClass: "col-lg-6 col-md-12",
      required: false,
      disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "number",
      name: "rating",
      label: "Rating",
      placeholder: "Enter rating (1-5)",
      colClass: "col-lg-6 col-md-12",
      required: true,
      disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "text",
      name: "employer_review",
      label: "Employer Review",
      placeholder: "Enter employer review",
      colClass: "col-lg-6 col-md-12",
      required: false,
      disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "text",
      name: "pets_experience",
      label: "Pets Experience", // Removed heading as requested
      placeholder: "Enter pets experience",
      colClass: "col-lg-6 col-md-12",
      required: false,
      disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "select",
      name: "comfortable_with_pets",
      label: "Comfortable with Pets",
      options: petComfortOptions,
      placeholder: "Select pet comfort level",
      colClass: "col-lg-6 col-md-12",
      required: false,
      component: Select,
      disabled: isInitialLoading || isSubmitting,
    },
  ];

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSelectChange = (field) => (selectedOption) => {
    if (field === "country") {
      setFormData({
        ...formData,
        [field]: selectedOption ? selectedOption.value : "",
        country_id: selectedOption ? selectedOption.id : null,
      });
    } else {
      setFormData({
        ...formData,
        [field]: selectedOption ? selectedOption.value : "",
      });
    }
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.employer_name) {
      errors.employer_name = "Employer name is required";
      isValid = false;
    }
    if (!formData.employment_location) {
      errors.employment_location = "Employment location is required";
      isValid = false;
    }
    if (!formData.employer_dial_code) {
      errors.employer_dial_code = "Employer dial code is required";
      isValid = false;
    }
    if (!formData.employer_phone) {
      errors.employer_phone = "Employer phone is required";
      isValid = false;
    }
    if (!formData.employer_email) {
      errors.employer_email = "Employer email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.employer_email)) {
      errors.employer_email = "Invalid email format";
      isValid = false;
    }
    if (!formData.country) {
      errors.country = "Country is required";
      isValid = false;
    }
    if (!formData.start_date) {
      errors.start_date = "Start date is required";
      isValid = false;
    }
    if (!formData.designation) {
      errors.designation = "Designation is required";
      isValid = false;
    }
    if (!formData.previous_salary) {
      errors.previous_salary = "Previous salary is required";
      isValid = false;
    }
    if (!formData.rating) {
      errors.rating = "Rating is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  useEffect(() => {
    const fetchCountryOptions = async () => {
      try {
        setIsInitialLoading(true);
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
        console.error("Error fetching country options:", error);
        await notificationService.showToast(
          error.message || "Failed to load country options.",
          "error"
        );
      } finally {
        setTimeout(() => {
          setIsInitialLoading(false);
          console.log("Initial loading complete, countryOptions:", countryOptions);
        }, 500);
      }
    };

    fetchCountryOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      const firstError = Object.values(formErrors)[0] || "Please fill all required fields";
      await notificationService.showToast(firstError, "error");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Submitting form data:", formData);
      const response = await networkService.post("/employee/experience/add", {
        employer_name: formData.employer_name,
        employment_location: formData.employment_location,
        employer_dial_code: formData.employer_dial_code,
        employer_phone: formData.employer_phone,
        employer_email: formData.employer_email,
        country_id: formData.country_id,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        designation: formData.designation,
        previous_salary: parseFloat(formData.previous_salary),
        benefits: formData.benefits || null,
        rating: parseInt(formData.rating),
        employer_review: formData.employer_review || null,
        pets_experience: formData.pets_experience || null,
        comfortable_with_pets: formData.comfortable_with_pets,
        employee_id: formData.employee_id,
      });
      console.log("API response:", response);
      await notificationService.showToast("Work experience added successfully!", "success");
      setIsModalOpen(false);
      setFormData({
        employer_name: "",
        employment_location: "",
        employer_dial_code: "",
        employer_phone: "",
        employer_email: "",
        country: "",
        country_id: null,
        start_date: "",
        end_date: "",
        designation: "",
        previous_salary: "",
        benefits: "",
        rating: "",
        employer_review: "",
        pets_experience: "",
        comfortable_with_pets: "",
        employee_id: 10,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      await notificationService.showToast(
        error.message || "Failed to add work experience. Please try again.",
        "error"
      );
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 500);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  console.log("Rendering JobExperienceCard, countryOptions:", countryOptions);

  return (
    <div className="relative min-h-screen">
      <style>
        {`
          .is-invalid {
            border: 1px solid #dc3545 !important;
          }
          .invalid-feedback {
            display: block;
            color: "#dc3545",
            font-size: 0.875rem;
            margin-top: 0.25rem;
          }
        `}
      </style>
      {(isInitialLoading || isSubmitting) && (
        <Loader text={isInitialLoading ? "Loading..." : "Saving..."} />
      )}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
        <button
          type="button"
          style={buttonStyle}
          onClick={openModal}
          disabled={isInitialLoading || isSubmitting}
        >
          Add Work Experience
        </button>
      </div>

      {isModalOpen && (
        <>
          <div style={overlayStyle} onClick={() => setIsModalOpen(false)} />
          <div style={modalStyle}>
            <h3>Add Work Experience</h3>
            <WorkExperienceCardForm
              fields={formFields}
              formData={formData}
              handleChange={handleChange}
              handleSelectChange={handleSelectChange}
              onSubmit={handleSubmit}
              loading={isSubmitting || isInitialLoading}
              formErrors={formErrors}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default JobExperienceCard;