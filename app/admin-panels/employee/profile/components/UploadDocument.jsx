'use client';

import { useState, useEffect, useMemo } from "react";
import UploadDocumentCardForm from "@/templates/forms/UploadDocumentCardForm";
import UploadDocumentTable from "@/templates/tables/UploadDocumentTable";
import { notificationService } from "@/services/notification.service";
import Loader from "@/globals/Loader";
import { v4 as uuidv4 } from "uuid";
import Select from "react-select";

const UploadDocument = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [savedDocuments, setSavedDocuments] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingDocumentId, setEditingDocumentId] = useState(null);
  const [isLoadingSingle, setIsLoadingSingle] = useState(false);

  // Handle client-side mounting to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const [formData, setFormData] = useState({
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

  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "0.5rem",
    backgroundColor: "#F0F5F7",
    boxSizing: "border-box",
    height: "60px",
  };

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

  const formFields = useMemo(() => [
    {
      type: "select", name: "category", label: "Document Type", options: documentCategoryOptions, placeholder: "Select Category", colClass: "col-lg-6 col-md-12", required: true, disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "date", name: "expiryDate", label: "Expiry Date", colClass: "col-lg-6 col-md-12", required: true, disabled: isInitialLoading || isSubmitting, style: inputStyle,
    },
    {
      type: "select", name: "currentStatus", label: "Current Status", options: statusOptions, placeholder: "Select Status", colClass: "col-lg-6 col-md-12", required: true, disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "select", name: "issuingCountry", label: "Issuing Country", options: countryOptions, placeholder: "Select Country", colClass: "col-lg-6 col-md-12", required: true, disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "select", name: "currentLocation", label: "Current Location", options: countryOptions, placeholder: "Select Location", colClass: "col-lg-6 col-md-12", required: true, disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "select", name: "workAvailableImmediately", label: "Work Available Immediately", options: yesNoOptions, placeholder: "Select Option", colClass: "col-lg-6 col-md-12", required: true, disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "number", name: "numberOfDays", label: "Number of Days (if not immediate)", placeholder: "Enter days", colClass: "col-lg-6 col-md-12", min: "0", required: formData.workAvailableImmediately === "No", disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "file", name: "file", label: "Upload Document", colClass: "col-lg-6 col-md-12", accept: ".pdf,.jpg,.png", required: true, disabled: isInitialLoading || isSubmitting, style: inputStyle,
    },
  ], [documentCategoryOptions, statusOptions, countryOptions, yesNoOptions, formData.workAvailableImmediately, isInitialLoading, isSubmitting, inputStyle]);

  const handleChange = (field, value) => {
    console.log("Field change:", field, value); // Debug log
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSelectChange = (field) => (selected) => {
    console.log("Select change:", field, selected); // Debug log
    setFormData((prev) => ({
      ...prev,
      [field]: selected?.value || "",
    }));
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFileChange = (field) => (e) => {
    console.log("File change:", field, e.target.files[0]); // Debug log
    setFormData((prev) => ({ ...prev, [field]: e.target.files[0] }));
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const fetchSingleDocument = async (documentId) => {
    if (!documentId) {
      console.warn("No document ID provided");
      return;
    }

    try {
      setIsLoadingSingle(true);
      console.log("Fetching single document with ID:", documentId); // Debug log

      // Find the document in local state (since we're using local storage)
      const document = savedDocuments.find(doc => doc.id === documentId);
      
      if (document) {
        console.log("Document data to populate:", document); // Debug log
        
        // Format the data to match form structure
        const formattedData = {
          id: document.id,
          category: document.category || "",
          file: document.file || null,
          expiryDate: document.expiryDate || "",
          currentStatus: document.currentStatus || "",
          issuingCountry: document.issuingCountry || "",
          currentLocation: document.currentLocation || "",
          workAvailableImmediately: document.workAvailableImmediately || "",
          numberOfDays: document.numberOfDays || "",
        };

        console.log("Formatted form data:", formattedData); // Debug log
        setFormData(formattedData);
      } else {
        console.warn("No document found with ID:", documentId);
        await notificationService.showToast("Document not found", "error");
      }

    } catch (err) {
      console.error("Error fetching single document:", err);
      await notificationService.showToast(err.message || "Error loading document data", "error");
    } finally {
      setIsLoadingSingle(false);
    }
  };

  const handleEditDocument = async (documentId) => {
    console.log("Edit document called with ID:", documentId); // Debug log
    setIsEditMode(true);
    setEditingDocumentId(documentId);
    setIsModalOpen(true);
    
    // Fetch and populate the document data
    await fetchSingleDocument(documentId);
  };

  const handleAddDocument = () => {
    console.log("Add new document"); // Debug log
    setIsEditMode(false);
    setEditingDocumentId(null);
    
    // Reset form data for new document
    setFormData({
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
    
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    let valid = true;
    if (!formData.category) errors.category = "Required", valid = false;
    if (!formData.expiryDate) errors.expiryDate = "Required", valid = false;
    if (!formData.currentStatus) errors.currentStatus = "Required", valid = false;
    if (!formData.issuingCountry) errors.issuingCountry = "Required", valid = false;
    if (!formData.currentLocation) errors.currentLocation = "Required", valid = false;
    if (!formData.workAvailableImmediately) errors.workAvailableImmediately = "Required", valid = false;
    if (formData.workAvailableImmediately === "No" && !formData.numberOfDays) {
      errors.numberOfDays = "Required when work is not immediately available", valid = false;
    }
    if (!formData.file && !isEditMode) errors.file = "Required", valid = false;
    
    setFormErrors(errors);
    return valid;
  };

  const fetchData = async () => {
    try {
      setIsInitialLoading(true);
      
      // Since this is using local state, we don't need to fetch from API
      // But we can simulate loading for consistency
      console.log("Loading documents from local state:", savedDocuments);

    } catch (err) {
      console.error("Error fetching data:", err);
      await notificationService.showToast(err.message || "Error loading data", "error");
    } finally {
      setTimeout(() => {
        setIsInitialLoading(false);
      }, 500);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    if (mounted) {
      fetchData();
    }
  }, [mounted]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData); // Debug log
    console.log("Is edit mode:", isEditMode, "Editing ID:", editingDocumentId); // Debug log
    
    if (!validateForm()) {
      const firstError = Object.values(formErrors)[0];
      console.log("Validation failed:", formErrors); // Debug log
      return notificationService.showToast(firstError || "Please fill required fields", "error");
    }
    
    try {
      setIsSubmitting(true);
      
      const payload = {
        ...formData,
        numberOfDays: formData.numberOfDays ? parseInt(formData.numberOfDays) : "",
      };

      // Add ID for edit mode or generate new one
      if (isEditMode && editingDocumentId) {
        payload.id = editingDocumentId;
      } else if (!payload.id) {
        payload.id = uuidv4();
      }
      
      console.log("Submitting payload:", payload); // Debug log
      
      if (isEditMode) {
        // Edit existing document
        setSavedDocuments(prevDocs => 
          prevDocs.map(doc => doc.id === payload.id ? payload : doc)
        );
        console.log("Document updated"); // Debug log
      } else {
        // Add new document
        setSavedDocuments(prevDocs => [...prevDocs, payload]);
        console.log("Document added"); // Debug log
      }
      
      const successMessage = isEditMode ? "Document updated successfully!" : "Document added successfully!";
      await notificationService.showToast(successMessage, "success");
      
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditingDocumentId(null);
      
      // Reset form data
      setFormData({
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
      
    } catch (err) {
      console.error("Submit error:", err); // Debug log
      const errorMessage = isEditMode ? "Failed to update document" : "Failed to add document";
      await notificationService.showToast(err.message || errorMessage, "error");
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 500);
    }
  };

  const handleBulkDelete = async (ids) => {
    console.log("Bulk delete called with:", ids);
    
    if (!ids || ids.length === 0) {
      console.warn("No IDs provided for deletion");
      return;
    }

    // Filter out valid IDs
    const validIds = ids.filter(id => id != null);
    
    if (validIds.length === 0) {
      console.warn("No valid IDs found");
      return;
    }

    try {
      // Remove documents from local state
      setSavedDocuments(prevDocs => prevDocs.filter(doc => !validIds.includes(doc.id)));
      console.log("Documents deleted from local state");
      
    } catch (error) {
      console.error("Error in bulk delete:", error);
      throw error;
    }
  };

  const refreshData = async () => {
    // For local state, we don't need to refresh from server
    // But we keep this function for consistency with the pattern
    console.log("Data refresh called - using local state");
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return <Loader text="Loading..." />;
  }

  return (
    <div className="relative min-h-screen">
      {(isInitialLoading || isSubmitting || isLoadingSingle) && (
        <Loader text={
          isLoadingSingle ? "Loading document..." : 
          isInitialLoading ? "Loading..." : 
          "Saving..."
        } />
      )}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
        <button
          onClick={handleAddDocument}
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
          Add Document
        </button>
      </div>

      <UploadDocumentTable
        data={savedDocuments}
        title="Uploaded Documents"
        handleBulkDelete={handleBulkDelete}
        onDataRefresh={refreshData}
        onEditDocument={handleEditDocument}
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
              setEditingDocumentId(null);
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
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{isEditMode ? "Edit Document" : "Add Document"}</h3>
            <UploadDocumentCardForm
              fields={formFields}
              formData={formData}
              handleChange={handleChange}
              handleSelectChange={handleSelectChange}
              handleFileChange={handleFileChange}
              onSubmit={handleSubmit}
              loading={isSubmitting || isLoadingSingle}
              formErrors={formErrors}
              buttonText={isEditMode ? "Update Document" : "Save Document"}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default UploadDocument;