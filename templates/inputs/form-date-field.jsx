import React from "react";
import PropTypes from "prop-types";

const FormDateField = ({ field, value, handleChange, error }) => {
  const inputStyle = {
    ...field.style,
    border: error ? "1px solid #dc3545" : "none",
    outline: "none",
  };

  return (
    <div>
      <input
        type="date"
        name={field.name}
        value={value || ""}
        onChange={(e) => handleChange(field.name, e.target.value)}
        required={field.required}
        disabled={field.disabled}
        style={inputStyle}
        className={`${field.className || ""} ${error ? "is-invalid" : ""}`.trim()}
      />
      {error && (
        <div className="invalid-feedback" style={{ display: "block", color: "#dc3545", fontSize: "0.875rem", marginTop: "0.25rem" }}>
          {error}
        </div>
      )}
    </div>
  );
};

FormDateField.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default FormDateField;