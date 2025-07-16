import React from "react";
import PropTypes from "prop-types";
import InputField from "@/templates/inputs/input-field";
import SelectField from "@/templates/inputs/select-field";

const UploadDocumentCardForm = ({
  fields,
  formData,
  handleChange = () => {},
  handleSelectChange = () => () => {},
  handleFileChange = () => () => {},
  onSubmit = (e) => e.preventDefault(),
  loading = false,
  formErrors = {},
  buttonText = "Save",
}) => {
  const buttonStyle = {
    backgroundColor: "#8C956B",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: loading ? "not-allowed" : "pointer",
    transition: "background-color 0.2s",
    opacity: loading ? 0.6 : 1,
  };

  const labelStyle = {
    color: "#69697C",
    fontWeight: "450",
    marginBottom: "0.5rem",
    display: "block",
  };

  const inputContainerStyle = {
    marginBottom: "1rem",
  };

  const renderField = (field) => {
    const commonInputStyle = {
      borderRadius: "0.5rem",
      padding: "0.75rem",
      width: "100%",
      boxSizing: "border-box",
      transition: "border-color 0.2s",
      border: "none", // No border for all fields
      backgroundColor: "#f0f5f7", // Light gray background for all fields
      opacity: loading ? 0.6 : 1,
    };

    switch (field.type) {
      case "text":
      case "number":
      case "date":
      case "email":
      case "tel":
        return (
          <div>
            <InputField
              field={{
                ...field,
                style: { ...field.style, ...commonInputStyle },
                disabled: loading,
                className: formErrors[field.name] ? "is-invalid" : "",
              }}
              value={formData[field.name] || ""}
              handleChange={handleChange}
            />
            {formErrors[field.name] && (
              <div className="invalid-feedback" style={{ display: "block", color: "#dc3545", fontSize: "0.875rem" }}>
                {formErrors[field.name]}
              </div>
            )}
          </div>
        );
      case "textarea":
        return (
          <div>
            <textarea
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
              readOnly={field.readOnly || loading}
              className={formErrors[field.name] ? "is-invalid" : ""}
              style={{ ...field.style, ...commonInputStyle, height: "120px" }}
            />
            {formErrors[field.name] && (
              <div className="invalid-feedback" style={{ display: "block", color: "#dc3545", fontSize: "0.875rem" }}>
                {formErrors[field.name]}
              </div>
            )}
          </div>
        );
      case "select":
        return (
          <div>
            <SelectField
              field={{
                ...field,
                style: { ...field.style, ...commonInputStyle },
                isMulti: field.isMulti || false,
                disabled: loading,
                className: formErrors[field.name] ? "is-invalid" : "",
              }}
              value={formData[field.name]}
              handleSelectChange={(name) => (option) => {
                handleSelectChange(name)(option);
              }}
            />
            {formErrors[field.name] && (
              <div className="invalid-feedback" style={{ display: "block", color: "#dc3545", fontSize: "0.875rem" }}>
                {formErrors[field.name]}
              </div>
            )}
          </div>
        );
      case "file":
        return (
          <div>
            <div
              style={{
                ...commonInputStyle,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                textAlign: "center",
                position: "relative",
                minHeight: "60px",
                border: formErrors[field.name] ? "2px dashed #dc3545" : "2px dashed #8C956B",
                backgroundColor: formErrors[field.name] ? "#fed7d7" : "#f0f5f7",
              }}
              onClick={() => document.getElementById(`${field.name}Input`).click()}
            >
              {formData[field.name] ? (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className="la la-file" style={{ color: "#8C956B", fontSize: "1.5rem" }}></span>
                  <span>{formData[field.name].name || "File selected"}</span>
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
              onChange={handleFileChange(field.name)}
              style={{ display: "none" }}
              disabled={loading}
            />
            {formErrors[field.name] && (
              <div className="invalid-feedback" style={{ display: "block", color: "#dc3545", fontSize: "0.875rem" }}>
                {formErrors[field.name]}
              </div>
            )}
          </div>
        );
      case "checkbox":
        return (
          <div>
            <label style={{ display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                name={field.name}
                checked={formData[field.name] || false}
                onChange={(e) => handleChange(field.name, e.target.checked)}
                disabled={loading}
                style={{ marginRight: "0.5rem" }}
              />
              {field.label}
            </label>
            {formErrors[field.name] && (
              <div className="invalid-feedback" style={{ display: "block", color: "#dc3545", fontSize: "0.875rem" }}>
                {formErrors[field.name]}
              </div>
            )}
          </div>
        );
      case "custom":
        return field.render ? field.render() : null;
      default:
        return null;
    }
  };

  return (
    <form
      className="default-form card p-4 needs-validation"
      onSubmit={onSubmit}
      style={{ padding: "1rem", opacity: loading ? 0.6 : 1 }}
      noValidate
    >
      <div className="row">
        {fields.map((field, index) => (
          <div
            key={index}
            className={`form-group ${field.colClass}`}
            style={
              field.type === "file"
                ? { position: "relative", minHeight: "60px", ...inputContainerStyle }
                : inputContainerStyle
            }
          >
            <label style={{ ...labelStyle, opacity: loading ? 0.6 : 1 }}>
              {field.label} {field.required && <span style={{ color: "red" }}>*</span>}
            </label>
            {renderField(field)}
          </div>
        ))}

        <div
          className="form-group col-lg-12 col-md-12"
          style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}
        >
          <button
            type="submit"
            style={buttonStyle}
            onMouseOver={(e) => !loading && (e.target.style.backgroundColor = "#7a815d")}
            onMouseOut={(e) => !loading && (e.target.style.backgroundColor = "#8C956B")}
            disabled={loading}
          >
            {loading ? "Saving..." : buttonText}
          </button>
        </div>
      </div>
    </form>
  );
};

UploadDocumentCardForm.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      placeholder: PropTypes.string,
      required: PropTypes.bool,
      readOnly: PropTypes.bool,
      colClass: PropTypes.string,
      options: PropTypes.array,
      accept: PropTypes.string,
      style: PropTypes.object,
      render: PropTypes.func,
      isMulti: PropTypes.bool,
      disabled: PropTypes.bool,
      className: PropTypes.string,
    })
  ).isRequired,
  formData: PropTypes.object.isRequired,
  handleChange: PropTypes.func,
  handleSelectChange: PropTypes.func,
  handleFileChange: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  formErrors: PropTypes.object,
  buttonText: PropTypes.string,
};

export default UploadDocumentCardForm;