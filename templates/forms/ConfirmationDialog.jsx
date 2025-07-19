import React from "react";
import PropTypes from "prop-types";

const ConfirmationDialog = ({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
  type = "danger" // "danger", "warning", "info"
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          confirmBg: "#e53e3e",
          confirmHover: "#c53030",
          iconColor: "#e53e3e",
          icon: "la-exclamation-triangle"
        };
      case "warning":
        return {
          confirmBg: "#ed8936",
          confirmHover: "#dd6b20",
          iconColor: "#ed8936",
          icon: "la-exclamation-triangle"
        };
      case "info":
        return {
          confirmBg: "#3182ce",
          confirmHover: "#2c5aa0",
          iconColor: "#3182ce",
          icon: "la-info-circle"
        };
      default:
        return {
          confirmBg: "#e53e3e",
          confirmHover: "#c53030",
          iconColor: "#e53e3e",
          icon: "la-exclamation-triangle"
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={onCancel}
      >
        {/* Dialog */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "2rem",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            maxWidth: "400px",
            width: "90%",
            margin: "1rem",
            position: "relative",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: `${typeStyles.iconColor}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                className={`la ${typeStyles.icon}`}
                style={{
                  fontSize: "24px",
                  color: typeStyles.iconColor,
                }}
              ></span>
            </div>
          </div>

          {/* Title */}
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#2d3748",
              textAlign: "center",
              marginBottom: "0.5rem",
              margin: 0,
            }}
          >
            {title}
          </h3>

          {/* Message */}
          <p
            style={{
              fontSize: "0.875rem",
              color: "#718096",
              textAlign: "center",
              marginBottom: "2rem",
              lineHeight: "1.5",
              margin: "0.5rem 0 2rem 0",
            }}
          >
            {message}
          </p>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={onCancel}
              disabled={isLoading}
              style={{
                padding: "0.75rem 1.5rem",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                backgroundColor: "#fff",
                color: "#4a5568",
                fontSize: "0.875rem",
                fontWeight: "500",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                opacity: isLoading ? 0.6 : 1,
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = "#f7fafc";
                  e.target.style.borderColor = "#cbd5e0";
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = "#fff";
                  e.target.style.borderColor = "#e2e8f0";
                }
              }}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              style={{
                padding: "0.75rem 1.5rem",
                border: "none",
                borderRadius: "8px",
                backgroundColor: isLoading ? "#fed7d7" : typeStyles.confirmBg,
                color: "#fff",
                fontSize: "0.875rem",
                fontWeight: "500",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                opacity: isLoading ? 0.7 : 1,
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = typeStyles.confirmHover;
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = typeStyles.confirmBg;
                }
              }}
            >
              {isLoading && (
                <span
                  className="la la-spinner la-spin"
                  style={{ fontSize: "14px" }}
                ></span>
              )}
              {isLoading ? "Processing..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

ConfirmationDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  type: PropTypes.oneOf(["danger", "warning", "info"]),
};

export default ConfirmationDialog;