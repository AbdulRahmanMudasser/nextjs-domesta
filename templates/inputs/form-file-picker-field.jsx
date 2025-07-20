import React from "react";
import PropTypes from "prop-types";

const FormFilePickerField = ({ field, value, handleChange, error }) => {
  // Check if field has previewComponent (FilePicker)
  if (field.previewComponent) {
    return (
      <div>
        <div style={{ opacity: field.disabled ? 0.6 : 1 }}>
          {/* Clone the previewComponent and inject error prop if it's a FilePicker */}
          {React.cloneElement(field.previewComponent, { formError: error })}
        </div>
      </div>
    );
  }

  // Fallback basic file input with consistent styling
  const inputStyle = {
    ...field.style,
    border: error ? "1px solid #dc3545" : "2px dashed #8C956B",
    outline: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    textAlign: "center",
    position: "relative",
    minHeight: "60px",
  };

  return (
    <div>
      <div
        style={inputStyle}
        onClick={() => document.getElementById(`${field.name}Input`).click()}
        className={`${field.className || ""} ${error ? "is-invalid" : ""}`.trim()}
      >
        {value ? (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span className="la la-file" style={{ color: "#8C956B", fontSize: "1.5rem" }}></span>
            <span>{value.name || "File selected"}</span>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span className="la la-upload" style={{ color: "#8C956B", fontSize: "1.5rem" }}></span>
            <span>Click to upload {field.label}</span>
          </div>
        )}
      </div>
      <input
        type="file"
        id={`${field.name}Input`}
        name={field.name}
        accept={field.accept}
        onChange={(e) => {
          const file = e.target.files[0];
          handleChange(field.name, file);
        }}
        style={{ display: "none" }}
        disabled={field.disabled}
      />
      {error && (
        <div className="invalid-feedback" style={{ display: "block", color: "#dc3545", fontSize: "0.875rem", marginTop: "0.25rem" }}>
          {error}
        </div>
      )}
    </div>
  );
};

FormFilePickerField.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    accept: PropTypes.string,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
    previewComponent: PropTypes.node,
  }).isRequired,
  value: PropTypes.any,
  handleChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default FormFilePickerField;