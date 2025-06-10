import React from "react";
import PropTypes from "prop-types";

const InputField = ({ field, value, handleChange }) => {
  return (
    <input
      type={field.type}
      name={field.name}
      placeholder={field.placeholder}
      value={value}
      onChange={(e) => handleChange(field.name, e.target.value)}
      required={field.required}
      readOnly={field.readOnly}
      min={field.min}
      style={field.style}
    />
  );
};

InputField.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  handleChange: PropTypes.func.isRequired,
};

export default InputField;