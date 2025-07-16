"use client";

import { useState, useEffect, useMemo } from "react";
import WorkExperienceCardForm from "@/templates/forms/WorkExperienceCardForm";
import WorkExperienceTable from "@/templates/tables/WorkExperienceTable";
import { networkService } from "@/services/network.service";
import { notificationService } from "@/services/notification.service";
import Loader from "@/globals/Loader";
import Select from "react-select";

const JobExperienceCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [countryOptions, setCountryOptions] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState(null);
  const [isLoadingSingle, setIsLoadingSingle] = useState(false);

  // Handle client-side mounting to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const user = useMemo(() => {
    if (typeof window !== 'undefined' && mounted) {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }, [mounted]);

  const employeeId = user?.id;

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
    comfortable_with_pets: "",
    employee_id: employeeId,
  });

  const petComfortOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  const formFields = useMemo(() => [
    {
      type: "text", name: "employer_name", label: "Employer Name", placeholder: "Enter employer name", colClass: "col-lg-6 col-md-12", required: true, disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "text", name: "employment_location", label: "Employment Location", placeholder: "Enter employment location", colClass: "col-lg-6 col-md-12", required: true, disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "text", name: "employer_dial_code", label: "Employer Dial Code", placeholder: "Enter dial code", colClass: "col-lg-6 col-md-12", required: true, disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "text", name: "employer_phone", label: "Employer Phone", placeholder: "Enter phone number", colClass: "col-lg-6 col-md-12", required: true, disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "email", name: "employer_email", label: "Employer Email", placeholder: "Enter employer email", colClass: "col-lg-6 col-md-12", required: true, disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "select", name: "country", label: "Country", options: countryOptions, placeholder: "Select country", colClass: "col-lg-6 col-md-12", required: true, disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "date", name: "start_date", label: "Start Date", placeholder: "Start date", colClass: "col-lg-6 col-md-12", required: true, disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "date", name: "end_date", label: "End Date", placeholder: "End date", colClass: "col-lg-6 col-md-12", required: false, disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "text", name: "designation", label: "Designation", placeholder: "Enter designation", colClass: "col-lg-6 col-md-12", required: true, disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "number", name: "previous_salary", label: "Previous Salary", placeholder: "Enter salary", colClass: "col-lg-6 col-md-12", required: true, disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "text", name: "benefits", label: "Benefits", placeholder: "Enter benefits", colClass: "col-lg-6 col-md-12", required: false, disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "number", name: "rating", label: "Rating", placeholder: "1–5", colClass: "col-lg-6 col-md-12", required: true, disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "text", name: "employer_review", label: "Employer Review", placeholder: "Enter review", colClass: "col-lg-6 col-md-12", required: false, disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "text", name: "pets_experience", label: "Pets Experience", placeholder: "Enter experience", colClass: "col-lg-6 col-md-12", required: false, disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "select", name: "comfortable_with_pets", label: "Comfortable with Pets", options: petComfortOptions, placeholder: "Select", colClass: "col-lg-6 col-md-12", required: false, disabled: isInitialLoading || isSubmitting,
    },
  ], [countryOptions, petComfortOptions, isInitialLoading, isSubmitting]);

  const handleChange = (field, value) => {
    console.log("Field change:", field, value); // Debug log
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSelectChange = (field) => (selected) => {
    console.log("Select change:", field, selected); // Debug log
    if (field === "country") {
      setFormData((prev) => ({
        ...prev,
        [field]: selected?.value || "",
        country_id: selected?.id || null,
      }));
    } else if (field === "comfortable_with_pets") {
      setFormData((prev) => ({
        ...prev,
        [field]: selected?.value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: selected?.value || "",
      }));
    }
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const fetchSingleExperience = async (experienceId) => {
    if (!experienceId) {
      console.warn("No experience ID provided");
      return;
    }

    try {
      setIsLoadingSingle(true);
      console.log("Fetching single experience with ID:", experienceId); // Debug log

      const response = await networkService.get(`/employee/experience/single/${experienceId}`);
      console.log("Single experience response:", response); // Debug log

      let experienceData = null;
      
      // Handle different response formats
      if (response && response.data) {
        experienceData = response.data;
      } else if (response && response.status && response.data) {
        experienceData = response.data;
      } else if (response) {
        experienceData = response;
      }

      if (experienceData) {
        console.log("Experience data to populate:", experienceData); // Debug log
        
        // Format the data to match form structure
        const formattedData = {
          employer_name: experienceData.employer_name || "",
          employment_location: experienceData.employment_location || "",
          employer_dial_code: experienceData.employer_dial_code || "",
          employer_phone: experienceData.employer_phone || "",
          employer_email: experienceData.employer_email || "",
          country: experienceData.country?.name || "",
          country_id: experienceData.country_id || null,
          start_date: experienceData.start_date ? experienceData.start_date.split('T')[0] : "",
          end_date: experienceData.end_date ? experienceData.end_date.split('T')[0] : "",
          designation: experienceData.designation || "",
          previous_salary: experienceData.previous_salary || "",
          benefits: experienceData.benefits || "",
          rating: experienceData.rating || "",
          employer_review: experienceData.employer_review || "",
          pets_experience: experienceData.pets_experience || "",
          comfortable_with_pets: experienceData.comfortable_with_pets,
          employee_id: employeeId,
        };

        console.log("Formatted form data:", formattedData); // Debug log
        setFormData(formattedData);
      } else {
        console.warn("No experience data found in response:", response);
        await notificationService.showToast("Experience not found", "error");
      }

    } catch (err) {
      console.error("Error fetching single experience:", err);
      await notificationService.showToast(err.message || "Error loading experience data", "error");
    } finally {
      setIsLoadingSingle(false);
    }
  };

  const handleEditExperience = async (experienceId) => {
    console.log("Edit experience called with ID:", experienceId); // Debug log
    setIsEditMode(true);
    setEditingExperienceId(experienceId);
    setIsModalOpen(true);
    
    // Fetch and populate the experience data
    await fetchSingleExperience(experienceId);
  };

  const handleAddExperience = () => {
    console.log("Add new experience"); // Debug log
    setIsEditMode(false);
    setEditingExperienceId(null);
    
    // Reset form data for new experience
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
      employee_id: employeeId,
    });
    
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    let valid = true;
    if (!formData.employer_name) errors.employer_name = "Required", valid = false;
    if (!formData.employment_location) errors.employment_location = "Required", valid = false;
    if (!formData.employer_dial_code) errors.employer_dial_code = "Required", valid = false;
    if (!formData.employer_phone) errors.employer_phone = "Required", valid = false;
    if (!formData.employer_email || !/\S+@\S+\.\S+/.test(formData.employer_email)) {
      errors.employer_email = "Invalid email", valid = false;
    }
    if (!formData.country) errors.country = "Required", valid = false;
    if (!formData.start_date) errors.start_date = "Required", valid = false;
    if (!formData.designation) errors.designation = "Required", valid = false;
    if (!formData.previous_salary) errors.previous_salary = "Required", valid = false;
    if (!formData.rating) errors.rating = "Required", valid = false;
    setFormErrors(errors);
    return valid;
  };

  const fetchData = async () => {
    if (!employeeId) {
      console.warn("Employee ID not found");
      return;
    }

    try {
      setIsInitialLoading(true);
      
      // Fetch countries
      const countries = await networkService.get("/country");
      console.log("Countries response:", countries);
      
      if (Array.isArray(countries)) {
        setCountryOptions(countries.map(c => ({
          value: c.name,
          label: c.name,
          id: c.id,
        })));
      } else {
        console.warn("Countries response is not an array:", countries);
      }

      // Fetch experiences
      const experiences = await networkService.get(`/employee/experience/${employeeId}`);
      console.log("Experiences response:", experiences);

      // Handle different response formats
      if (experiences && Array.isArray(experiences)) {
        // Direct array response
        setExperiences(experiences);
      } else if (experiences && experiences.data && Array.isArray(experiences.data)) {
        // Response with data property
        setExperiences(experiences.data);
      } else if (experiences && experiences.status && Array.isArray(experiences.data)) {
        // Response with status and data
        setExperiences(experiences.data);
      } else {
        console.warn("Unexpected experiences response format:", experiences);
        setExperiences([]);
      }

    } catch (err) {
      console.error("Error fetching data:", err);
      await notificationService.showToast(err.message || "Error loading data", "error");
      setExperiences([]); // Set empty array on error
    } finally {
      setIsInitialLoading(false);
    }
  };

  // Update formData when employeeId changes
  useEffect(() => {
    if (employeeId) {
      setFormData((prev) => ({
        ...prev,
        employee_id: employeeId,
      }));
    }
  }, [employeeId]);

  // Fetch data when component mounts and employeeId is available
  useEffect(() => {
    if (mounted && employeeId) {
      fetchData();
    }
  }, [mounted, employeeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData); // Debug log
    console.log("Is edit mode:", isEditMode, "Editing ID:", editingExperienceId); // Debug log
    
    if (!validateForm()) {
      const firstError = Object.values(formErrors)[0];
      console.log("Validation failed:", formErrors); // Debug log
      return notificationService.showToast(firstError || "Please fill required fields", "error");
    }
    
    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        previous_salary: parseFloat(formData.previous_salary) || 0,
        rating: parseInt(formData.rating) || 0,
        comfortable_with_pets:
          formData.comfortable_with_pets === true || formData.comfortable_with_pets === "true",
        end_date: formData.end_date || null,
        benefits: formData.benefits || null,
        employer_review: formData.employer_review || null,
        pets_experience: formData.pets_experience || null,
      };

      // Add ID for edit mode
      if (isEditMode && editingExperienceId) {
        payload.id = editingExperienceId;
      }
      
      console.log("Submitting payload:", payload); // Debug log
      
      let response;
      if (isEditMode) {
        // Edit existing experience
        response = await networkService.post("/employee/experience/edit", payload);
        console.log("Edit response:", response); // Debug log
      } else {
        // Add new experience
        response = await networkService.post("/employee/experience/add", payload);
        console.log("Add response:", response); // Debug log
      }
      
      const successMessage = isEditMode ? "Experience updated successfully!" : "Experience added successfully!";
      await notificationService.showToast(successMessage, "success");
      
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditingExperienceId(null);
      
      // Reset form data
      setFormData((prev) => ({
        ...prev,
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
      }));
      
      // Refresh the data
      fetchData();
    } catch (err) {
      console.error("Submit error:", err); // Debug log
      const errorMessage = isEditMode ? "Failed to update experience" : "Failed to add experience";
      await notificationService.showToast(err.message || errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkDelete = async (ids) => {
    // This function is kept for backward compatibility but not used
    // The actual delete is handled in WorkExperienceTable component
    console.log("Legacy handleBulkDelete called with:", ids);
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return <Loader text="Loading..." />;
  }

  return (
    <div className="relative min-h-screen">
      {(isInitialLoading || isSubmitting || isLoadingSingle) && (
        <Loader text={
          isLoadingSingle ? "Loading experience..." : 
          isInitialLoading ? "Loading..." : 
          "Saving..."
        } />
      )}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
        <button
          onClick={handleAddExperience}
          disabled={isInitialLoading || isSubmitting}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#8C956B",
            color: "#fff",
            fontWeight: "600",
            borderRadius: "0.5rem",
            border: "none",
            cursor: "pointer",
            marginBottom: "1rem"
          }}
        >
          Add Work Experience
        </button>
      </div>

      <WorkExperienceTable
        data={experiences}
        title="Work Experience History"
        handleBulkDelete={handleBulkDelete}
        onDataRefresh={fetchData}
        onEditExperience={handleEditExperience}
      />

      {isModalOpen && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 999,
            }}
            onClick={() => {
              setIsModalOpen(false);
              setIsEditMode(false);
              setEditingExperienceId(null);
            }}
          />
          <div
            style={{
              position: "fixed",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#fff",
              padding: "2rem",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              zIndex: 1000,
              width: "90%", maxWidth: "800px", maxHeight: "80vh", overflowY: "auto",
            }}
          >
            <h3>{isEditMode ? "Edit Work Experience" : "Add Work Experience"}</h3>
            <WorkExperienceCardForm
              fields={formFields}
              formData={formData}
              handleChange={handleChange}
              handleSelectChange={handleSelectChange}
              onSubmit={handleSubmit}
              loading={isSubmitting || isLoadingSingle}
              formErrors={formErrors}
              buttonText={isEditMode ? "Update Experience" : "Save Experience"}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default JobExperienceCard;