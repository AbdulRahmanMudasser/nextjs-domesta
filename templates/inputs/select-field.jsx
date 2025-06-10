import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";

const SelectField = ({ field, value, handleSelectChange }) => {
 
  const isMulti = field.isMulti || false;

  
  const selectedValue = isMulti
    ? field.options.filter(option => value && value.includes(option.value)) 
    : field.options.find(option => option.value === value) || null; 

  
  const onChangeHandler = (selectedOption) => {
    if (isMulti) {
      
      const values = selectedOption ? selectedOption.map(option => option.value) : [];
      handleSelectChange(field.name)(values);
    } else {
      
      handleSelectChange(field.name)(selectedOption);
    }
  };

  return (
    <Select
      name={field.name}
      options={field.options}
      className="basic-multi-select"
      classNamePrefix="select"
      placeholder={field.placeholder}
      value={selectedValue}
      onChange={onChangeHandler}
      required={field.required}
      isMulti={isMulti}
      isClearable
    />
  );
};

SelectField.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    isMulti: PropTypes.bool,
  }).isRequired,
  value: PropTypes.any,
  handleSelectChange: PropTypes.func.isRequired,
};

export default SelectField;