"use client";

import { useState, useEffect, useMemo } from "react";
import UploadDocumentCardForm from "@/templates/forms/UploadDocumentCardForm";
import UploadDocumentTable from "@/templates/tables/UploadDocumentTable";
import { networkService } from "@/services/network.service";
import { userService } from "@/services/user.service";
import { notificationService } from "@/services/notification.service";
import Loader from "@/globals/Loader";
import Modal from "./Modal";
import FilePicker from "@/templates/inputs/FilePicker";
import { v4 as uuidv4 } from "uuid";

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
  const [statusOptions, setStatusOptions] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [isModalPreviewOpen, setIsModalPreviewOpen] = useState(false);

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
    id: uuidv4(),
    category: "",
    expiryDate: "",
    currentStatus: "",
    issuingCountry: "",
    currentLocation: "",
    workAvailableImmediately: "",
    numberOfDays: "",
    employee_id: employeeId,
  });

  // Separate state for file data
  const [fileData, setFileData] = useState({
    file: {
      file: null,
      previewUrl: "",
      fullUrl: "",
      mediaId: null,
    },
  });

  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "0.5rem",
    backgroundColor: "#F0F5F7",
    boxSizing: "border-box",
    height: "60px",
  };

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

  // Handle file data changes from FilePicker component
  const handleFileDataChange = (fieldName, data) => {
    setFileData(prev => ({
      ...prev,
      [fieldName]: data,
    }));
  };

  // Handle clearing form errors
  const handleClearError = (fieldName) => {
    setFormErrors((prev) => ({ ...prev, [fieldName]: "" }));
  };

  const handlePreviewClick = (field, url) => {
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

  // Helper function to find option by value
  const findOptionByValue = (options, value) => {
    return options.find(option => option.value === value);
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
      document_type_id: getDropdownId(documentTypeOptions, formData.category),
      expiry_date: formData.expiryDate || null,
      document_status_id: getDropdownId(statusOptions, formData.currentStatus),
      issuing_country_id: getDropdownId(countryOptions, formData.issuingCountry),
      current_location_id: getDropdownId(countryOptions, formData.currentLocation),
      work_available_immediately: formData.workAvailableImmediately === "Yes" ? true : formData.workAvailableImmediately === "No" ? false : null,
      number_of_days: formData.workAvailableImmediately === "No" && formData.numberOfDays ? parseInt(formData.numberOfDays) : null,
      media_id: fileData.file.mediaId || null,
      employee_id: userId,
    };

    console.log("Form data:", formData);
    console.log("File data:", fileData);
    console.log("Mapped API data:", apiData);
    return apiData;
  };

  const formFields = useMemo(() => [
    {
      type: "select", 
      name: "category", 
      label: "Document Type", 
      options: documentTypeOptions, 
      placeholder: "Select Category", 
      colClass: "col-lg-6 col-md-12", 
      required: true, 
      disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "date", 
      name: "expiryDate", 
      label: "Expiry Date", 
      colClass: "col-lg-6 col-md-12", 
      required: true, 
      disabled: isInitialLoading || isSubmitting, 
      style: inputStyle,
    },
    {
      type: "select", 
      name: "currentStatus", 
      label: "Current Status", 
      options: statusOptions, 
      placeholder: "Select Status", 
      colClass: "col-lg-6 col-md-12", 
      required: true, 
      disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "select", 
      name: "issuingCountry", 
      label: "Issuing Country", 
      options: countryOptions, 
      placeholder: "Select Country", 
      colClass: "col-lg-6 col-md-12", 
      required: true, 
      disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "select", 
      name: "currentLocation", 
      label: "Current Location", 
      options: countryOptions, 
      placeholder: "Select Location", 
      colClass: "col-lg-6 col-md-12", 
      required: true, 
      disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "select", 
      name: "workAvailableImmediately", 
      label: "Work Available Immediately", 
      options: yesNoOptions, 
      placeholder: "Select Option", 
      colClass: "col-lg-6 col-md-12", 
      required: true, 
      disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "number", 
      name: "numberOfDays", 
      label: "Number of Days (if not immediate)", 
      placeholder: "Enter days", 
      colClass: "col-lg-6 col-md-12", 
      min: "0", 
      required: formData.workAvailableImmediately === "No", 
      disabled: isInitialLoading || isSubmitting,
    },
    {
      type: "file", 
      name: "file", 
      label: "Upload Document", 
      colClass: "col-lg-6 col-md-12", 
      accept: ".pdf,.jpg,.png", 
      required: !fileData.file.fullUrl, 
      disabled: isInitialLoading || isSubmitting, 
      style: inputStyle,
      previewComponent: (
        <div>
          <FilePicker
            fieldName="file"
            label="Document"
            accept=".pdf,.jpg,.png"
            initialPreview={fileData.file.previewUrl}
            initialFileUrl={fileData.file.fullUrl}
            initialFileId={fileData.file.mediaId}
            formError={formErrors.file}
            onFileDataChange={handleFileDataChange}
            onPreviewClick={handlePreviewClick}
            onClearError={handleClearError}
            isGlobalSubmitting={isSubmitting}
            isGlobalLoading={isInitialLoading}
          />
        </div>
      ),
    },
  ], [
    documentTypeOptions, 
    statusOptions, 
    countryOptions, 
    yesNoOptions, 
    formData.workAvailableImmediately, 
    fileData.file.fullUrl,
    fileData.file.previewUrl,
    fileData.file.mediaId,
    formErrors.file, 
    isInitialLoading, 
    isSubmitting, 
    inputStyle
  ]);

  const fetchSingleDocument = async (documentId) => {
    if (!documentId) {
      console.warn("No document ID provided");
      return;
    }

    try {
      setIsLoadingSingle(true);
      console.log("Fetching single document with ID:", documentId); // Debug log

      // Find the document in local state
      const document = savedDocuments.find(doc => doc.id === documentId);
      
      if (document) {
        console.log("Document data to populate:", document); // Debug log
        
        // Format the data to match form structure
        const formattedData = {
          id: document.id,
          category: document.document_type?.value || document.category || "",
          expiryDate: document.expiry_date ? document.expiry_date.split('T')[0] : document.expiryDate || "",
          currentStatus: document.document_status?.value || document.currentStatus || "",
          issuingCountry: document.issuing_country?.name || document.issuingCountry || "",
          currentLocation: document.current_location?.name || document.currentLocation || "",
          workAvailableImmediately: document.work_available_immediately ? "Yes" : document.work_available_immediately === false ? "No" : document.workAvailableImmediately || "",
          numberOfDays: document.number_of_days?.toString() || document.numberOfDays || "",
          employee_id: employeeId,
        };

        // Set file data separately
        const documentUrl = document.media ? `${document.media.base_url}${document.media.unique_name}` : document.fileUrl || "";
        setFileData({
          file: {
            file: null,
            previewUrl: documentUrl,
            fullUrl: documentUrl,
            mediaId: document.media_id || document.fileId || null,
          },
        });

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
      expiryDate: "",
      currentStatus: "",
      issuingCountry: "",
      currentLocation: "",
      workAvailableImmediately: "",
      numberOfDays: "",
      employee_id: employeeId,
    });

    // Reset file data
    setFileData({
      file: {
        file: null,
        previewUrl: "",
        fullUrl: "",
        mediaId: null,
      },
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
    if (!fileData.file.file && !fileData.file.fullUrl && !isEditMode) {
      errors.file = `Upload Document is required`;
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
      
      // Fetch document status options  
      await fetchDocumentStatusOptions();
      
      // Fetch country options
      await fetchCountryOptions();
      
      // Fetch existing documents
      if (employeeId) {
        const documents = await userService.getDocuments(employeeId);
        console.log("Documents response:", documents);
        
        // Map API response to local state format
        const formattedDocuments = documents.map(doc => ({
          id: doc.id,
          document_type: doc.document_type || { value: doc.category },
          expiry_date: doc.expiry_date ? doc.expiry_date.split('T')[0] : "",
          document_status: doc.document_status || { value: doc.currentStatus },
          issuing_country: doc.issuing_country || { name: doc.issuingCountry },
          current_location: doc.current_location || { name: doc.currentLocation },
          work_available_immediately: doc.work_available_immediately,
          number_of_days: doc.number_of_days,
          media: doc.media || { base_url: doc.fileUrl, unique_name: doc.file?.name },
          media_id: doc.media_id || doc.fileId,
          file: doc.file || { name: doc.media?.unique_name || "Document" },
          fileUrl: doc.media ? `${doc.media.base_url}${doc.media.unique_name}` : doc.fileUrl,
          fileId: doc.media_id || doc.fileId,
        }));
        
        setSavedDocuments(formattedDocuments);
      } else {
        console.warn("No employee ID available for fetching documents");
        setSavedDocuments([]);
      }

      console.log("Data loading completed");

    } catch (err) {
      console.error("Error fetching data:", err);
      await notificationService.showToast(err.message || "Error loading data", "error");
      setSavedDocuments([]);
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

  const fetchDocumentStatusOptions = async () => {
    try {
      const statusResponse = await networkService.getDropdowns("document_verification_status");
      if (statusResponse?.document_verification_status) {
        const statusOptions = statusResponse.document_verification_status.map((item) => ({
          value: item.value,
          label: item.value,
          id: item.id,
        }));
        setStatusOptions(statusOptions);
      }
    } catch (error) {
      console.error("Error fetching document verification status options:", error);
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

  // UPDATED handleSubmit method with edit functionality
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    
    console.log("Form submitted with data:", formData);
    console.log("File data:", fileData);
    console.log("Is edit mode:", isEditMode, "Editing ID:", editingDocumentId);
    
    if (!validateForm()) {
      const firstError = Object.values(formErrors)[0] || "Please fill in all required fields";
      console.log("Validation failed:", formErrors);
      await notificationService.showToast(firstError, "error");
      return;
    }
    
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
      
      // Add ID for edit mode
      if (isEditMode && editingDocumentId) {
        apiData.id = editingDocumentId;
      }
      
      console.log("Submitting API data:", apiData);

      // Validate that we have all required IDs
      if (!apiData.document_type_id) {
        throw new Error("Please select a valid document type");
      }
      if (!apiData.document_status_id) {
        throw new Error("Please select a valid document status");
      }
      if (!apiData.issuing_country_id) {
        throw new Error("Please select a valid issuing country");
      }
      if (!apiData.current_location_id) {
        throw new Error("Please select a valid current location");
      }
      if (!apiData.media_id) {
        throw new Error("Please upload a document file");
      }
      
      let response;
      if (isEditMode) {
        // Edit existing document via API
        response = await userService.editDocument(apiData);
        console.log("Edit document response:", response);
        
        if (response) {
          // Update the document in local state
          setSavedDocuments(prevDocs => 
            prevDocs.map(doc => 
              doc.id === editingDocumentId 
                ? {
                    ...doc,
                    document_type: { value: response.document_type?.value || formData.category },
                    expiry_date: response.expiry_date ? response.expiry_date.split('T')[0] : formData.expiryDate,
                    document_status: { value: response.document_status?.value || formData.currentStatus },
                    issuing_country: { name: response.issuing_country?.name || formData.issuingCountry },
                    current_location: { name: response.current_location?.name || formData.currentLocation },
                    work_available_immediately: response.work_available_immediately,
                    number_of_days: response.number_of_days || formData.numberOfDays,
                    media: response.media || { base_url: fileData.file.fullUrl, unique_name: response.media?.unique_name || fileData.file.file?.name },
                    media_id: response.media_id || fileData.file.mediaId,
                    fileUrl: response.media ? `${response.media.base_url}${response.media.unique_name}` : fileData.file.fullUrl,
                    fileId: response.media_id || fileData.file.mediaId,
                  }
                : doc
            )
          );
        }
      } else {
        // Add new document via API
        response = await userService.addDocument(apiData);
        console.log("Add document response:", response);
        
        if (response) {
          // Format the response to match table data structure
          const newDocument = {
            id: response.id || uuidv4(),
            document_type: { value: response.document_type?.value || formData.category },
            expiry_date: response.expiry_date ? response.expiry_date.split('T')[0] : formData.expiryDate,
            document_status: { value: response.document_status?.value || formData.currentStatus },
            issuing_country: { name: response.issuing_country?.name || formData.issuingCountry },
            current_location: { name: response.current_location?.name || formData.currentLocation },
            work_available_immediately: response.work_available_immediately,
            number_of_days: response.number_of_days || formData.numberOfDays,
            media: response.media || { base_url: fileData.file.fullUrl, unique_name: response.media?.unique_name || fileData.file.file?.name },
            media_id: response.media_id || fileData.file.mediaId,
            file: { name: response.media?.unique_name || "Document" },
            fileUrl: response.media ? `${response.media.base_url}${response.media.unique_name}` : fileData.file.fullUrl,
            fileId: response.media_id || fileData.file.mediaId,
          };
          setSavedDocuments(prevDocs => [...prevDocs, newDocument]);
        }
      }
      
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditingDocumentId(null);
      
      // Reset form data
      setFormData({
        id: uuidv4(),
        category: "",
        expiryDate: "",
        currentStatus: "",
        issuingCountry: "",
        currentLocation: "",
        workAvailableImmediately: "",
        numberOfDays: "",
        employee_id: employeeId,
      });

      // Reset file data
      setFileData({
        file: {
          file: null,
          previewUrl: "",
          fullUrl: "",
          mediaId: null,
        },
      });
      
    } catch (err) {
      console.error("Submit error:", err);
      const errorMessage = isEditMode ? "Failed to update document" : "Failed to add document";
      // Error handling is done in userService methods
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
    // Refresh data from server
    await fetchData();
    console.log("Data refreshed from server");
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
              handleFileChange={() => {}} // Not used anymore, handled by FilePicker
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