'use client';

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import FancyTable from "@/templates/tables/fancy-table";
import CardForm from "@/templates/forms/card-form";

const UploadDocument = () => {
  const [savedDocuments, setSavedDocuments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEntry, setCurrentEntry] = useState({
    id: uuidv4(),
    category: "",
    file: null,
    expiryDate: "",
    currentStatus: "",
    issuingCountry: "",
    currentLocation: "",
    workAvailableImmediately: "",
    numberOfDays: "",
  });

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

  const handleChange = (field, value) => {
    setCurrentEntry((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (field) => (selectedOption) => {
    setCurrentEntry((prev) => ({
      ...prev,
      [field]: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleFileChange = (field) => (e) => {
    setCurrentEntry((prev) => ({ ...prev, [field]: e.target.files[0] }));
  };

  const saveDocument = () => {
    if (isEditing) {
      setSavedDocuments(
        savedDocuments.map((doc) =>
          doc.id === currentEntry.id ? currentEntry : doc
        )
      );
    } else {
      setSavedDocuments([...savedDocuments, { ...currentEntry, id: uuidv4() }]);
    }
    setIsModalOpen(false);
    resetForm();
    setIsEditing(false);
  };

  const editDocument = (doc) => {
    setCurrentEntry(doc);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const deleteDocument = (id) => {
    setSavedDocuments(savedDocuments.filter((doc) => doc.id !== id));
  };

  const resetForm = () => {
    setCurrentEntry({
      id: uuidv4(),
      category: "",
      file: null,
      expiryDate: "",
      currentStatus: "",
      issuingCountry: "",
      currentLocation: "",
      workAvailableImmediately: "",
      numberOfDays: "",
    });
  };

  const fields = [
    { key: "category", label: "Document Type" },
    { key: "expiryDate", label: "Expiry Date" },
    { key: "currentStatus", label: "Current Status" },
    { key: "issuingCountry", label: "Issuing Country" },
    { key: "currentLocation", label: "Current Location" },
    { key: "workAvailableImmediately", label: "Work Immediately" },
    { key: "numberOfDays", label: "Number of Days" },
  ];

  const documentCategoryOptions = [
    { value: "Passport", label: "Passport" },
    { value: "Visa", label: "Visa" },
    { value: "Work Permit", label: "Work Permit" },
    { value: "ID Card", label: "ID Card" },
    { value: "Other", label: "Other" },
  ];

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Expired", label: "Expired" },
    { value: "Pending", label: "Pending" },
  ];

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

  const formFields = [
    {
      type: "select",
      name: "category",
      label: "Document Type",
      options: documentCategoryOptions,
      colClass: "col-lg-6 col-md-12",
      placeholder: "Select Category",
      required: true,
    },
    {
      type: "date",
      name: "expiryDate",
      label: "Expiry Date",
      colClass: "col-lg-6 col-md-12",
      required: true,
      style: inputStyle,
    },
    {
      type: "select",
      name: "currentStatus",
      label: "Current Status",
      options: statusOptions,
      colClass: "col-lg-6 col-md-12",
      placeholder: "Select Status",
      required: true,
    },
    {
      type: "select",
      name: "issuingCountry",
      label: "Issuing Country",
      options: countryOptions,
      colClass: "col-lg-6 col-md-12",
      placeholder: "Select Country",
      required: true,
    },
    {
      type: "select",
      name: "currentLocation",
      label: "Current Location",
      options: countryOptions,
      colClass: "col-lg-6 col-md-12",
      placeholder: "Select Location",
      required: true,
    },
    {
      type: "select",
      name: "workAvailableImmediately",
      label: "Work Available Immediately",
      options: yesNoOptions,
      colClass: "col-lg-6 col-md-12",
      placeholder: "Select Option",
      required: true,
    },
    {
      type: "number",
      name: "numberOfDays",
      label: "Number of Days (if not immediate)",
      placeholder: "Enter days",
      colClass: "col-lg-6 col-md-12",
      min: "0",
      required: currentEntry.workAvailableImmediately === "No",
    },
    {
      type: "file",
      name: "file",
      label: "Upload Document",
      colClass: "col-lg-6 col-md-12",
      accept: ".pdf,.jpg,.png",
      required: true,
      style: inputStyle,
    },
  ];

  return (
    <div>
      {/* Modal for Adding/Editing Document */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            zIndex: 999,
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "white",
              padding: "2rem",
              borderRadius: "8px",
              width: "80%",
              maxWidth: "800px",
              zIndex: 1000,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4>{isEditing ? "Edit Document" : "Add Document"}</h4>
            <CardForm
              fields={formFields}
              formData={currentEntry}
              handleChange={handleChange}
              handleSelectChange={handleSelectChange}
              handleFileChange={handleFileChange}
              onSubmit={(e) => {
                e.preventDefault();
                saveDocument();
              }}
            />
          </div>
        </div>
      )}

      {/* FancyTable to Display Documents */}
      <FancyTable
        fields={fields}
        data={savedDocuments}
        title="Uploaded Documents"
        filterOptions={[]}
        editAction={editDocument}
        deleteAction={deleteDocument}
      />

      {/* Add Document Button */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
        <button
          type="button"
          style={buttonStyle}
          onClick={() => setIsModalOpen(true)}
        >
          Add Document
        </button>
      </div>
    </div>
  );
};

export default UploadDocument;