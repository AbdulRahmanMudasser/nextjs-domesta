import React from "react";
import PropTypes from "prop-types";
import InputField from "@/templates/inputs/input-field";
import SelectField from "@/templates/inputs/select-field";
import ImageField from "@/templates/inputs/image-field";

const CardForm = ({
  fields,
  formData,
  handleChange = () => {},
  handleSelectChange = () => () => {},
  handleFileChange = () => () => {},
  onSubmit = (e) => e.preventDefault(),
}) => {
  const buttonStyle = {
    backgroundColor: "#8C956B",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const labelStyle = {
    color: "#69697C",
    fontWeight: "450",
  };

  const renderField = (field) => {
    switch (field.type) {
      case "text":
      case "number":
      case "date":
      case "email":
      case "tel":
        return (
          <InputField
            field={field}
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
            style={field.style}
          />
        );
      case "select":
        return (
          <SelectField
            field={{ ...field, isMulti: field.isMulti || false }}
            value={formData[field.name]}
            handleSelectChange={(name) => (option) => {
              handleSelectChange(name)(option);
            }}
          />
        );
      case "file":
        return (
          <ImageField
            field={field}
            value={formData[field.name]}
            handleFileChange={(name, event) => {
              handleFileChange(name)(event);
            }}
          />
        );
      case "custom":
        return field.render ? field.render() : null;
      default:
        return null;
    }
  };

  return (
    <form className="default-form card p-4" onSubmit={onSubmit}>
      <div className="row">
        {fields.map((field, index) => (
          <div
            key={index}
            className={`form-group ${field.colClass}`}
            style={field.type === "file" ? { position: "relative", minHeight: "60px" } : {}}
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
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <button type="submit" style={buttonStyle}>
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

CardForm.propTypes = {
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
    })
  ).isRequired,
  formData: PropTypes.object.isRequired,
  handleChange: PropTypes.func,
  handleSelectChange: PropTypes.func,
  handleFileChange: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default CardForm;