// FormImageField.jsx
import React from "react";
import PropTypes from "prop-types";

const FormImageField = ({ field, value, handleFileChange, error }) => {
  const tickBoxStyle = (isSelected) => ({
    position: "absolute",
    top: "10px",
    right: "10px",
    transform: "translateY(50%)",
    backgroundColor: isSelected ? "#28a745" : "#e9ecef",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  });

  const inputStyle = {
    ...field.style,
    border: error ? "1px solid #dc3545" : "none",
  };

  return (
    <div style={{ position: "relative" }}>
      <div>
        <input
          type="file"
          name={field.name}
          accept={field.accept}
          onChange={(event) => handleFileChange(field.name, event)}
          required={field.required}
          style={inputStyle}
          className=""
          disabled={field.disabled}
        />
        {value && (
          <div className="mt-2 text-muted small">Selected: {value.name}</div>
        )}
      </div>
      <div style={tickBoxStyle(!!value)}>
        <span
          style={{
            color: value ? "#ffffff" : "gray",
            fontSize: "1rem",
          }}
        >
          ✔
        </span>
      </div>
      {error && (
        <div className="invalid-feedback" style={{ display: "block", color: "#dc3545", fontSize: "0.875rem", marginTop: "0.25rem" }}>
          {error}
        </div>
      )}
    </div>
  );
};

FormImageField.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.object,
  handleFileChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default FormImageField;