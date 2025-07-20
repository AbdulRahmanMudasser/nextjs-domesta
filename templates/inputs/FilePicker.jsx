import React, { useState, useEffect } from "react";
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
  // New props for external state management
  previewUrl,
  fileUrl,
  mediaId,
  // Legacy props for backward compatibility
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
  // Internal state (for backward compatibility)
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialPreview);
  const [internalFileUrl, setInternalFileUrl] = useState(initialFileUrl);
  const [fileId, setFileId] = useState(initialFileId);
  const [isUploading, setIsUploading] = useState(false);

  const inputId = `${fieldName}Input`;

  // Determine if we're using external state management or internal state
  const useExternalState = previewUrl !== undefined || fileUrl !== undefined || mediaId !== undefined;

  // Update internal state when initial props change (for backward compatibility)
  useEffect(() => {
    if (!useExternalState) {
      setImagePreview(initialPreview);
      setInternalFileUrl(initialFileUrl);
      setFileId(initialFileId);
    }
  }, [initialPreview, initialFileUrl, initialFileId, useExternalState]);

  // Get current values based on state management mode
  const currentPreviewUrl = useExternalState ? previewUrl : imagePreview;
  const currentFileUrl = useExternalState ? fileUrl : internalFileUrl;
  const currentMediaId = useExternalState ? mediaId : fileId;

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!useExternalState) {
        setFile(selectedFile);
      }
      
      // Clear any existing error
      if (onClearError) {
        onClearError(fieldName);
      }

      try {
        console.log(`Starting upload for ${fieldName}, isUploading: true`);
        setIsUploading(true);
        
        const response = await networkService.uploadMedia(selectedFile);
        if (response && response[0]?.base_url && response[0]?.thumb_size) {
          const newPreviewUrl = `${response[0].base_url}${response[0].thumb_size}`;
          const newFullUrl = `${response[0].base_url}${response[0].unique_name}`;
          const newMediaId = response[0].id;

          if (useExternalState) {
            // Notify parent component for external state management
            if (onFileDataChange) {
              onFileDataChange(fieldName, {
                file: selectedFile,
                previewUrl: newPreviewUrl,
                fullUrl: newFullUrl,
                mediaId: newMediaId,
              });
            }
          } else {
            // Update internal state for backward compatibility
            setImagePreview(newPreviewUrl);
            setInternalFileUrl(newFullUrl);
            setFileId(newMediaId);

            // Still notify parent if callback exists
            if (onFileDataChange) {
              onFileDataChange(fieldName, {
                file: selectedFile,
                previewUrl: newPreviewUrl,
                fullUrl: newFullUrl,
                mediaId: newMediaId,
              });
            }
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
    if (useExternalState) {
      // Notify parent component for external state management
      if (onFileDataChange) {
        onFileDataChange(fieldName, {
          file: null,
          previewUrl: "",
          fullUrl: "",
          mediaId: null,
        });
      }
    } else {
      // Clear internal state for backward compatibility
      setFile(null);
      setImagePreview("");
      setInternalFileUrl("");
      setFileId(null);

      // Still notify parent if callback exists
      if (onFileDataChange) {
        onFileDataChange(fieldName, {
          file: null,
          previewUrl: "",
          fullUrl: "",
          mediaId: null,
        });
      }
    }

    // Clear any existing error
    if (onClearError) {
      onClearError(fieldName);
    }
  };

  const handlePreviewClick = () => {
    if (onPreviewClick && currentFileUrl) {
      onPreviewClick(fieldName, currentFileUrl);
    }
  };

  const isDisabled = isUploading || isGlobalSubmitting || isGlobalLoading;

  // Debug log
  console.log(`📸 FilePicker ${fieldName}:`, {
    useExternalState,
    currentPreviewUrl,
    currentFileUrl,
    currentMediaId,
    hasImage: !!currentPreviewUrl
  });

  return (
    <div className="file-placeholder" style={{ position: "relative", cursor: "pointer" }}>
      {currentPreviewUrl ? (
        <>
          {currentFileUrl && currentFileUrl.endsWith(".pdf") ? (
            <button
              onClick={handlePreviewClick}
              style={previewButtonStyle}
              disabled={isDisabled}
            >
              View Document
            </button>
          ) : (
            <img
              src={currentPreviewUrl}
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
            border: formError ? "1px solid #dc3545" : "1px solid transparent",
            backgroundColor: "#F0F5F7",
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