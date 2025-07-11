import React from "react";
import PropTypes from "prop-types";
import InputField from "@/templates/inputs/input-field";
import SelectField from "@/templates/inputs/select-field";
import ImageField from "@/templates/inputs/image-field";

const ProfileCardForm = ({
  fields,
  formData,
  handleChange = () => {},
  handleSelectChange = () => () => {},
  handleFileChange = () => () => {},
  onSubmit = (e) => e.preventDefault(),
  loading = false,
}) => {
  const buttonStyle = {
    backgroundColor: "#8C956B",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: loading ? "not-allowed" : "pointer",
    transition: "background-color 0.2s",
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
    };

    switch (field.type) {
      case "text":
      case "number":
      case "date":
      case "email":
      case "tel":
        return (
          <InputField
            field={{ ...field, style: { ...field.style, ...commonInputStyle } }}
            value={formData[field.name] || ""}
            handleChange={handleChange}
          />
        );
      case "textarea":
        return (
          <textarea
            name={field.name}
            placeholder={field.placeholder}
            value={formData[field.name] || ""}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
            readOnly={field.readOnly}
            style={{ ...field.style, ...commonInputStyle }}
          />
        );
      case "select":
        return (
          <SelectField
            field={{ ...field, style: { ...field.style, ...commonInputStyle }, isMulti: field.isMulti || false }}
            value={formData[field.name]}
            handleSelectChange={(name) => (option) => {
              handleSelectChange(name)(option);
            }}
          />
        );
      case "file":
        return (
          <div>
            <ImageField
              field={{ ...field, style: { ...field.style, ...commonInputStyle } }}
              value={formData[field.name]}
              handleFileChange={(name, event) => {
                handleFileChange(name)(event);
              }}
            />
            {field.previewComponent && (
              <div style={{ marginTop: "10px" }}>
                {field.previewComponent}
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
    <form className="default-form card p-4" onSubmit={onSubmit} style={{ padding: "1rem" }}>
      <div className="row">
        {fields.map((field, index) => (
          <div
            key={index}
            className={`form-group ${field.colClass}`}
            style={field.type === "file" ? { position: "relative", minHeight: "60px", ...inputContainerStyle } : inputContainerStyle}
          >
            <label style={labelStyle}>
              {field.label} {field.required && <span style={{ color: "red" }}>*</span>}
            </label>
            {renderField(field)}
          </div>
        ))}

        {/* Submit Button */}
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
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
};

ProfileCardForm.propTypes = {
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
      preview: PropTypes.string,
      previewComponent: PropTypes.node,
    })
  ).isRequired,
  formData: PropTypes.object.isRequired,
  handleChange: PropTypes.func,
  handleSelectChange: PropTypes.func,
  handleFileChange: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
};

export default ProfileCardForm;