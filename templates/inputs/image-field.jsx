import React from "react";
import PropTypes from "prop-types";

const ImageField = ({ field, value, handleFileChange }) => {
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

  return (
    <div style={{ position: "relative" }}>
      <div>
        <input
          type="file"
          name={field.name}
          accept={field.accept}
          onChange={(event) => handleFileChange(field.name, event)}
          required={field.required}
          style={field.style}
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
    </div>
  );
};

ImageField.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.object,
  handleFileChange: PropTypes.func.isRequired,
};

export default ImageField;