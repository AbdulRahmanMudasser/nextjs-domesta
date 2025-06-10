'use client';

import { useState } from "react";
import FancyTable from "@/templates/tables/fancy-table";
import CardForm from "@/templates/forms/card-form";

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
  height:"60px",
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
  const [jobExperiences, setJobExperiences] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
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

  // Define fields for FancyTable (columns for the table)
  const fields = [
    { name: "employerName", label: "Employer Name" },
    { name: "employmentLocation", label: "Employment Location" },
    { name: "employerPhone", label: "Employer Phone" },
    { name: "employerEmail", label: "Employer Email" },
    { name: "country", label: "Country" },
    { name: "startDate", label: "Start Date" },
    { name: "endDate", label: "End Date" },
    { name: "designation", label: "Designation" },
    { name: "previousSalary", label: "Previous Salary" },
    { name: "benefits", label: "Benefits" },
    { name: "rating", label: "Rating" },
    { name: "employerReview", label: "Employer Review" },
    { name: "petsExperience", label: "Pets Experience" },
    { name: "comfortableWithPets", label: "Comfortable with Pets" },
  ];

  // Options for dropdowns
  const countryOptions = [
    { value: "Bahrain", label: "Bahrain" },
    { value: "Kuwait", label: "Kuwait" },
    { value: "Oman", label: "Oman" },
    { value: "Qatar", label: "Qatar" },
    { value: "Saudi Arabia", label: "Saudi Arabia" },
    { value: "United Arab Emirates", label: "United Arab Emirates" },
  ];

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

  // Form fields for the modal using CardForm
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
    },
  ];

  const handleChange = (field, value) => {
    setNewExperience({ ...newExperience, [field]: value });
  };

  const handleSelectChange = (field) => (selectedOption) => {
    setNewExperience({ ...newExperience, [field]: selectedOption ? selectedOption.value : "" });
  };

  const saveExperience = () => {
    if (isEditing) {
      setJobExperiences(
        jobExperiences.map((exp) =>
          exp.id === editId ? { ...exp, ...newExperience } : exp
        )
      );
    } else {
      setJobExperiences([
        ...jobExperiences,
        {
          id: Date.now(),
          ...newExperience,
        },
      ]);
    }
    setIsModalOpen(false);
    resetForm();
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
    setIsEditing(false);
    setEditId(null);
  };

  const editExperience = (exp) => {
    setNewExperience(exp);
    setIsEditing(true);
    setEditId(exp.id);
    setIsModalOpen(true);
  };

  const deleteExperience = (id) => {
    setJobExperiences(jobExperiences.filter((exp) => exp.id !== id));
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div>
      <FancyTable
        fields={fields}
        data={jobExperiences}
        title="Work Experiences"
        filterOptions={[]}
        editAction={editExperience}
        deleteAction={deleteExperience}
      />
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
        <button
          type="button"
          style={buttonStyle}
          onClick={openModal}
        >
          Add Experience
        </button>
      </div>

      {isModalOpen && (
        <>
          <div style={overlayStyle} onClick={() => setIsModalOpen(false)} />
          <div style={modalStyle}>
            <h3>{isEditing ? "Edit Experience" : "Add Experience"}</h3>
            <CardForm
              fields={formFields}
              formData={newExperience}
              handleChange={handleChange}
              handleSelectChange={handleSelectChange}
              onSubmit={(e) => {
                e.preventDefault();
                saveExperience();
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default JobExperienceCard;