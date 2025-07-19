import React from "react";
import PropTypes from "prop-types";

const FormInputField = ({ field, value, handleChange, error }) => {
  const inputStyle = {
    ...field.style,
    border: error ? "1px solid #dc3545" : "none",
    outline: "none",
  };

  return (
    <div>
      <input
        type={field.type}
        name={field.name}
        placeholder={field.placeholder}
        value={value}
        onChange={(e) => handleChange(field.name, e.target.value)}
        required={field.required}
        readOnly={field.readOnly}
        min={field.min}
        style={inputStyle}
        className={`${field.className || ""} ${error ? "is-invalid" : ""}`.trim()}
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

FormInputField.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  handleChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default FormInputField;