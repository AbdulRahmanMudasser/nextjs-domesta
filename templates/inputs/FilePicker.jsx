import React, { useState } from "react";
import { networkService } from "@/services/network.service";
import { notificationService } from "@/services/notification.service";

// Define inputStyle for file inputs
const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  borderRadius: "0.5rem",
  backgroundColor: "#F0F5F7",
  boxSizing: "border-box",
  height: "60px",
};

// Define preview image style
const previewImageStyle = {
  maxWidth: "100px",
  maxHeight: "100px",
  marginTop: "10px",
  borderRadius: "0.5rem",
  objectFit: "cover",
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

const FilePicker = ({
  fieldName,
  label,
  accept,
  initialPreview = "",
  initialFileUrl = "",
  initialFileId = null,
  formError,
  onFileDataChange,
  onPreviewClick,
  onClearError,
  isGlobalSubmitting = false,
  isGlobalLoading = false,
}) => {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialPreview);
  const [fileUrl, setFileUrl] = useState(initialFileUrl);
  const [fileId, setFileId] = useState(initialFileId);
  const [isUploading, setIsUploading] = useState(false);

  const inputId = `${fieldName}Input`;

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Clear any existing error
      if (onClearError) {
        onClearError(fieldName);
      }

      try {
        console.log(`Starting upload for ${fieldName}, isUploading: true`);
        setIsUploading(true);
        
        const response = await networkService.uploadMedia(selectedFile);
        if (response && response[0]?.base_url && response[0]?.thumb_size) {
          const previewUrl = `${response[0].base_url}${response[0].thumb_size}`;
          const fullUrl = `${response[0].base_url}${response[0].unique_name}`;
          const mediaId = response[0].id;

          // Update local state
          setImagePreview(previewUrl);
          setFileUrl(fullUrl);
          setFileId(mediaId);

          // Notify parent component
          if (onFileDataChange) {
            onFileDataChange(fieldName, {
              file: selectedFile,
              previewUrl,
              fullUrl,
              mediaId,
            });
          }
        }
      } catch (error) {
        console.error(`Error uploading ${fieldName}:`, error);
        await notificationService.showToast(
          `Failed to upload ${label}. Please try again.`,
          "error"
        );
      } finally {
        setTimeout(() => {
          setIsUploading(false);
          console.log(`Finished upload for ${fieldName}, isUploading: false`);
        }, 500);
      }
    }
  };

  const handleRemove = () => {
    // Clear local state
    setFile(null);
    setImagePreview("");
    setFileUrl("");
    setFileId(null);

    // Clear any existing error
    if (onClearError) {
      onClearError(fieldName);
    }

    // Notify parent component
    if (onFileDataChange) {
      onFileDataChange(fieldName, {
        file: null,
        previewUrl: "",
        fullUrl: "",
        mediaId: null,
      });
    }
  };

  const handlePreviewClick = () => {
    if (onPreviewClick && fileUrl) {
      onPreviewClick(fieldName, fileUrl);
    }
  };

  const isDisabled = isUploading || isGlobalSubmitting || isGlobalLoading;

  return (
    <div className="file-placeholder" style={{ position: "relative", cursor: "pointer" }}>
      {imagePreview ? (
        <>
          {fileUrl && fileUrl.endsWith(".pdf") ? (
            <button
              onClick={handlePreviewClick}
              style={previewButtonStyle}
              disabled={isDisabled}
            >
              View Document
            </button>
          ) : (
            <img
              src={imagePreview}
              alt={`${label} Preview`}
              style={previewImageStyle}
              onClick={handlePreviewClick}
              onError={() => console.error(`Error loading ${fieldName} image`)}
            />
          )}
          <button
            onClick={handleRemove}
            style={removeButtonStyle}
            title={`Remove ${label}`}
            disabled={isDisabled}
          >
            ×
          </button>
        </>
      ) : (
        <div
          style={{ 
            ...inputStyle, 
            textAlign: "center", 
            lineHeight: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: isDisabled ? 0.6 : 1,
          }}
          className={formError ? "is-invalid" : ""}
          onClick={() => !isDisabled && document.getElementById(inputId).click()}
        >
          {isUploading ? "Uploading..." : `Choose ${label}`}
        </div>
      )}
      <input
        type="file"
        id={inputId}
        name={fieldName}
        accept={accept}
        onChange={handleFileChange}
        style={{ display: "none" }}
        disabled={isDisabled}
      />
      {formError && (
        <div className="invalid-feedback" style={{ display: "block", color: "#dc3545", fontSize: "0.875rem" }}>
          {formError}
        </div>
      )}
    </div>
  );
};

export default FilePicker;