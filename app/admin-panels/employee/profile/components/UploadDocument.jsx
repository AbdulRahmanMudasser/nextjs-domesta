'use client';

import { useState, useEffect, useMemo } from "react";
import UploadDocumentCardForm from "@/templates/forms/UploadDocumentCardForm";
import UploadDocumentTable from "@/templates/tables/UploadDocumentTable";
import { networkService } from "@/services/network.service";
import { notificationService } from "@/services/notification.service";
import Loader from "@/globals/Loader";
import Modal from "./Modal";
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
  const [documentTypeOptions, setDocumentTypeOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [documentPreviews, setDocumentPreviews] = useState({
    file: "",
  });
  const [modalContent, setModalContent] = useState(null);
  const [isModalPreviewOpen, setIsModalPreviewOpen] = useState(false);

  // Handle client-side mounting to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const [formData, setFormData] = useState({
    id: uuidv4(),
    category: "",
    file: null,
    fileUrl: "",
    fileId: null,
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

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Expired", label: "Expired" },
    { value: "Pending", label: "Pending" },
  ];

  const yesNoOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

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

  const handleFileChange = (field) => async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [field]: file }));
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
      setIsModalPreviewOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalPreviewOpen(false);
    setModalContent(null);
  };

  const formFields = useMemo(() => [
    {
      type: "select", name: "category", label: "Document Type", options: documentTypeOptions, placeholder: "Select Category", colClass: "col-lg-6 col-md-12", required: true, disabled: isInitialLoading || isSubmitting,
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
      type: "file", name: "file", label: "Upload Document", colClass: "col-lg-6 col-md-12", accept: ".pdf,.jpg,.png", required: !formData.fileUrl, disabled: isInitialLoading || isSubmitting, style: inputStyle,
      preview: documentPreviews.file,
      previewComponent: (
        <div className="file-placeholder" style={{ position: "relative", cursor: "pointer" }}>
          {documentPreviews.file ? (
            <>
              {formData.fileUrl && formData.fileUrl.endsWith(".pdf") ? (
                <button
                  onClick={handlePreviewClick("file", formData.fileUrl)}
                  style={previewButtonStyle}
                >
                  View Document
                </button>
              ) : (
                <img
                  src={documentPreviews.file}
                  alt="Document Preview"
                  style={{
                    maxWidth: "100px",
                    maxHeight: "100px",
                    marginTop: "10px",
                    borderRadius: "0.5rem",
                    objectFit: "cover",
                  }}
                  onClick={handlePreviewClick("file", formData.fileUrl)}
                  onError={() => console.error("Error loading document preview")}
                />
              )}
              <button
                onClick={handleRemoveFile("file")}
                style={removeButtonStyle}
                title="Remove Document"
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
                border: formErrors.file ? "1px solid #dc3545" : "1px solid transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                cursor: "pointer"
              }}
              className={formErrors.file ? "is-invalid" : ""}
              onClick={() => document.getElementById("fileInput").click()}
            >
              Choose Document
            </div>
          )}
          <input
            type="file"
            id="fileInput"
            name="file"
            accept=".pdf,.jpg,.png"
            onChange={handleFileChange("file")}
            style={{ display: "none" }}
            disabled={isSubmitting || isInitialLoading}
          />
          {formErrors.file && (
            <div className="invalid-feedback" style={{ display: "block", color: "#dc3545", fontSize: "0.875rem", marginTop: "0.25rem" }}>
              {formErrors.file}
            </div>
          )}
        </div>
      ),
    },
  ], [documentTypeOptions, statusOptions, countryOptions, yesNoOptions, formData.workAvailableImmediately, formData.fileUrl, documentPreviews.file, formErrors.file, isInitialLoading, isSubmitting, inputStyle]);

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
          fileUrl: document.fileUrl || "",
          fileId: document.fileId || null,
          expiryDate: document.expiryDate || "",
          currentStatus: document.currentStatus || "",
          issuingCountry: document.issuingCountry || "",
          currentLocation: document.currentLocation || "",
          workAvailableImmediately: document.workAvailableImmediately || "",
          numberOfDays: document.numberOfDays || "",
        };

        // Set document preview if exists
        if (document.fileUrl) {
          setDocumentPreviews(prev => ({
            ...prev,
            file: document.fileUrl.includes('thumb') ? document.fileUrl : document.fileUrl,
          }));
        }

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
      fileUrl: "",
      fileId: null,
      expiryDate: "",
      currentStatus: "",
      issuingCountry: "",
      currentLocation: "",
      workAvailableImmediately: "",
      numberOfDays: "",
    });

    setDocumentPreviews({
      file: "",
    });
    
    setFormErrors({});
    setIsModalOpen(true);
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
      if (!formData[field] || formData[field] === "") {
        errors[field] = `${fieldLabels[field]} is required`;
        isValid = false;
      }
    });

    // Specific validations
    if (formData.numberOfDays && (isNaN(formData.numberOfDays) || formData.numberOfDays < 0)) {
      errors.numberOfDays = `${fieldLabels.numberOfDays} must be a non-negative number`;
      isValid = false;
    }

    if (formData.expiryDate && !/^\d{4}-\d{2}-\d{2}$/.test(formData.expiryDate)) {
      errors.expiryDate = `Please enter a valid ${fieldLabels.expiryDate.toLowerCase()} (YYYY-MM-DD)`;
      isValid = false;
    }

    // File field validation
    if (!formData.file && !formData.fileUrl && !isEditMode) {
      errors.file = `${fieldLabels.file} is required`;
      isValid = false;
    }

    // Conditional validation for numberOfDays
    if (formData.workAvailableImmediately === "No" && !formData.numberOfDays) {
      errors.numberOfDays = "Required when work is not immediately available";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const fetchData = async () => {
    try {
      setIsInitialLoading(true);
      
      // Fetch document type options
      await fetchDocumentTypeOptions();
      
      // Fetch country options
      await fetchCountryOptions();
      
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

  const fetchDocumentTypeOptions = async () => {
    try {
      const documentTypeResponse = await networkService.getDropdowns("document_type");
      if (documentTypeResponse?.document_type) {
        const documentTypeOptions = documentTypeResponse.document_type.map((item) => ({
          value: item.value,
          label: item.value,
          id: item.id,
        }));
        setDocumentTypeOptions(documentTypeOptions);
      }
    } catch (error) {
      console.error("Error fetching document type options:", error);
    }
  };

  const fetchCountryOptions = async () => {
    try {
      const countryResponse = await networkService.get("/country");
      if (countryResponse) {
        const countryOptions = countryResponse.map((item) => ({
          value: item.name,
          label: item.name,
          id: item.id,
        }));
        setCountryOptions(countryOptions);
      } else {
        throw new Error("No country options returned");
      }
    } catch (error) {
      console.error("Error fetching country options:", error);
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
    setFormErrors({});
    
    console.log("Form submitted with data:", formData); // Debug log
    console.log("Is edit mode:", isEditMode, "Editing ID:", editingDocumentId); // Debug log
    
    if (!validateForm()) {
      const firstError = Object.values(formErrors)[0] || "Please fill in all required fields";
      console.log("Validation failed:", formErrors); // Debug log
      await notificationService.showToast(firstError, "error");
      return;
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
        fileUrl: "",
        fileId: null,
        expiryDate: "",
        currentStatus: "",
        issuingCountry: "",
        currentLocation: "",
        workAvailableImmediately: "",
        numberOfDays: "",
      });

      setDocumentPreviews({
        file: "",
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

      <Modal isOpen={isModalPreviewOpen} onClose={closeModal} isWide={modalContent?.type === "iframe"}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default UploadDocument;