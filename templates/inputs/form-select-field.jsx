import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";

const FormSelectField = ({ field, value, handleSelectChange, error }) => {
  const isMulti = field.isMulti || false;

  const selectedValue = isMulti
    ? field.options.filter((option) => value && value.includes(option.value))
    : field.options.find((option) => option.value === value) || null;

  const onChangeHandler = (selectedOption) => {
    if (isMulti) {
      const values = selectedOption ? selectedOption.map((option) => option.value) : [];
      handleSelectChange(field.name)(values);
    } else {
      handleSelectChange(field.name)(selectedOption);
    }
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      ...field.style,
      border: error ? "1px solid #dc3545" : "none",
      outline: "none",
      boxShadow: "none",
      "&:hover": {
        border: error ? "1px solid #dc3545" : "none",
      },
    }),
  };

  return (
    <div>
      <Select
        name={field.name}
        options={field.options}
        className={`basic-multi-select ${field.className || ""} ${error ? "is-invalid" : ""}`.trim()}
        classNamePrefix="select"
        placeholder={field.placeholder}
        value={selectedValue}
        onChange={onChangeHandler}
        required={field.required}
        isMulti={isMulti}
        isClearable
        isDisabled={field.disabled}
        styles={customStyles}
      />
      {error && (
        <div className="invalid-feedback" style={{ display: "block", color: "#dc3545", fontSize: "0.875rem", marginTop: "0.25rem" }}>
          {error}
        </div>
      )}
    </div>
  );
};

FormSelectField.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    isMulti: PropTypes.bool,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
  }).isRequired,
  value: PropTypes.any,
  handleSelectChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

export default FormSelectField;