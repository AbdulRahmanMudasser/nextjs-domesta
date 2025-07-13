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
const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "0.5rem",
  backgroundColor: "#F0F5F7",
  boxSizing: "border-box",
  height: "60px",
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
  const [newExperience, setNewExperience] = useState({
    employerName: "",
    employmentLocation: "",
    employerPhone: "",
    employerEmail: "",
    country: "",
    startDate: "",
    endDate: "",
    designation: "",
    previousSalary: "",
    benefits: "",
    rating: "",
    employerReview: "",
    petsExperience: "",
    comfortableWithPets: "",
  });

  // Options for dropdowns
  const yesNoOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  const ratingOptions = [
    { value: "1", label: "★☆☆☆☆ (1 Star)" },
    { value: "2", label: "★★☆☆☆ (2 Stars)" },
    { value: "3", label: "★★★☆☆ (3 Stars)" },
    { value: "4", label: "★★★★☆ (4 Stars)" },
    { value: "5", label: "★★★★★ (5 Stars)" },
  ];

  // Form fields for the modal using WorkExperienceCardForm
  const formFields = [
    {
      type: "text",
      name: "employerName",
      label: "Employer Name",
      placeholder: "Enter employer name",
      colClass: "col-lg-6 col-md-12",
      required: true,
    },
    {
      type: "text",
      name: "employmentLocation",
      label: "Employment Location",
      placeholder: "Enter employment location",
      colClass: "col-lg-6 col-md-12",
      required: true,
    },
    {
      type: "text",
      name: "employerPhone",
      label: "Employer Phone",
      placeholder: "Enter employer phone",
      colClass: "col-lg-6 col-md-12",
      pattern: "[0-9]*",
      required: true,
    },
    {
      type: "email",
      name: "employerEmail",
      label: "Employer Email",
      placeholder: "Enter employer email",
      colClass: "col-lg-6 col-md-12",
      required: true,
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
      name: "startDate",
      label: "Start Date",
      colClass: "col-lg-6 col-md-12",
      required: true,
      style: inputStyle,
    },
    {
      type: "date",
      name: "endDate",
      label: "End Date",
      colClass: "col-lg-6 col-md-12",
      required: true,
      style: inputStyle,
    },
    {
      type: "text",
      name: "designation",
      label: "Designation",
      placeholder: "Enter designation",
      colClass: "col-lg-6 col-md-12",
      required: true,
    },
    {
      type: "number",
      name: "previousSalary",
      label: "Previous Salary",
      placeholder: "Enter previous salary",
      colClass: "col-lg-6 col-md-12",
      min: "0",
      required: true,
    },
    {
      type: "text",
      name: "benefits",
      label: "Benefits",
      placeholder: "Enter benefits",
      colClass: "col-lg-6 col-md-12",
      required: true,
    },
    {
      type: "select",
      name: "rating",
      label: "Rating",
      options: ratingOptions,
      placeholder: "Select rating",
      colClass: "col-lg-6 col-md-12",
      required: true,
      component: Select,
    },
    {
      type: "textarea",
      name: "employerReview",
      label: "Employer Review",
      placeholder: "Enter employer review",
      colClass: "col-lg-12 col-md-12",
      required: true,
    },
    {
      type: "text",
      name: "petsExperience",
      label: "Pets Experience",
      placeholder: "Enter pets experience",
      colClass: "col-lg-6 col-md-12",
      required: true,
    },
    {
      type: "select",
      name: "comfortableWithPets",
      label: "Comfortable with Pets",
      options: yesNoOptions,
      placeholder: "Select option",
      colClass: "col-lg-6 col-md-12",
      required: true,
      component: Select,
    },
  ];

  const handleChange = (field, value) => {
    setNewExperience({ ...newExperience, [field]: value });
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSelectChange = (field) => (selectedOption) => {
    setNewExperience({ ...newExperience, [field]: selectedOption ? selectedOption.value : "" });
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Create a mapping of field names to their display labels
    const fieldLabels = formFields.reduce((acc, field) => ({
      ...acc,
      [field.name]: field.label,
    }), {});

    // Validate required fields
    const requiredFields = formFields.filter((f) => f.required).map((f) => f.name);
    requiredFields.forEach((field) => {
      if (!newExperience[field] || newExperience[field] === "") {
        errors[field] = `${fieldLabels[field]} is required`;
        isValid = false;
      }
    });

    // Specific validations
    if (newExperience.employerPhone && !/^\d{7,15}$/.test(newExperience.employerPhone)) {
      errors.employerPhone = `${fieldLabels.employerPhone} must be 7-15 digits`;
      isValid = false;
    }

    if (newExperience.previousSalary && (isNaN(newExperience.previousSalary) || newExperience.previousSalary < 0)) {
      errors.previousSalary = `${fieldLabels.previousSalary} must be a non-negative number`;
      isValid = false;
    }

    if (newExperience.startDate && !/^\d{4}-\d{2}-\d{2}$/.test(newExperience.startDate)) {
      errors.startDate = `Please enter a valid ${fieldLabels.startDate.toLowerCase()} (YYYY-MM-DD)`;
      isValid = false;
    }

    if (newExperience.endDate && !/^\d{4}-\d{2}-\d{2}$/.test(newExperience.endDate)) {
      errors.endDate = `Please enter a valid ${fieldLabels.endDate.toLowerCase()} (YYYY-MM-DD)`;
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
        if (countryResponse) {
          const countryOptions = countryResponse.map((item) => ({
            value: item.name || "",
            label: item.name || "",
            id: item.id || null,
          }));
          console.log("Setting countryOptions:", countryOptions);
          setCountryOptions(countryOptions);
        } else {
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

  const saveExperience = async () => {
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

      const getIdFromValue = (options, value) => {
        const option = options.find((opt) => opt.value === value);
        return option ? option.id : null;
      };

      const data = {
        employee_id: employeeId,
        employer_name: newExperience.employerName,
        employment_location: newExperience.employmentLocation,
        employer_phone: newExperience.employerPhone,
        employer_email: newExperience.employerEmail,
        country_id: getIdFromValue(countryOptions, newExperience.country),
        start_date: newExperience.startDate,
        end_date: newExperience.endDate,
        designation: newExperience.designation,
        previous_salary: parseFloat(newExperience.previousSalary) || 0,
        benefits: newExperience.benefits,
        rating: newExperience.rating,
        employer_review: newExperience.employerReview,
        pets_experience: newExperience.petsExperience,
        comfortable_with_pets: newExperience.comfortableWithPets,
      };

      const response = await networkService.post("/employee/work-experience", data);
      if (response) {
        await notificationService.showToast("Experience added successfully!", "success");
        setIsModalOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error saving experience:", error);
      await notificationService.showToast(
        error.message || "Failed to save experience. Please try again.",
        "error"
      );
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 500);
    }
  };

  const resetForm = () => {
    setNewExperience({
      employerName: "",
      employmentLocation: "",
      employerPhone: "",
      employerEmail: "",
      country: "",
      startDate: "",
      endDate: "",
      designation: "",
      previousSalary: "",
      benefits: "",
      rating: "",
      employerReview: "",
      petsExperience: "",
      comfortableWithPets: "",
    });
    setFormErrors({});
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
            color: #dc3545;
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
          Add Experience
        </button>
      </div>

      {isModalOpen && (
        <>
          <div style={overlayStyle} onClick={() => setIsModalOpen(false)} />
          <div style={modalStyle}>
            <h3>Add Experience</h3>
            <WorkExperienceCardForm
              fields={formFields}
              formData={newExperience}
              handleChange={handleChange}
              handleSelectChange={handleSelectChange}
              onSubmit={(e) => {
                e.preventDefault();
                saveExperience();
              }}
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