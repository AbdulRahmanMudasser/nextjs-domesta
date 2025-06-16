'use client'

import React, { useState } from "react";
import DsPageOuter from "@/templates/layouts/ds-page-outer";
import { ProfileTypes } from "@/data/globalKeys";
import FancyTable from "@/templates/tables/fancy-table";
import employeeProfile from "@/data/employee-profile";

export const metadata = {
  title: "Agency Profile || Domesta - Listing Board",
  description: "Domesta - Listing Board",
};

const EmployeesList = () => {
  // Helper to extract nested key values
  const findKeyValue = (keys, keyName, field, fallback = "N/A") => {
    try {
      const keyObj = keys?.find((k) => k.key === keyName);
      const fieldObj = keyObj?.value?.find((v) => v.key === field);
      return fieldObj?.value || fallback;
    } catch (error) {
      return fallback;
    }
  };

  // Helper to format field names
  const formatFieldName = (fieldName) => {
    if (!fieldName || typeof fieldName !== 'string') return 'Unknown Field';
    let formatted = fieldName.replace(/_/g, ' ');
    formatted = formatted.replace(/([A-Z])/g, ' $1').trim();
    return formatted
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Initialize state with employeeProfile data
  const [employees, setEmployees] = useState(employeeProfile.map((employee) => {
    const row = { id: employee.id };
    const profileFields = employeeProfile[0]?.keys
      .find((k) => k.key === "profile")
      ?.value || [];
    profileFields.forEach((field) => {
      row[field.key] = findKeyValue(employee.keys, "profile", field.key, "N/A");
    });
    return row;
  }));

  // Get all profile fields dynamically
  const employeeFields = employeeProfile[0]?.keys
    .find((k) => k.key === "profile")
    ?.value.map((field) => ({
      key: field.key,
      label: formatFieldName(field.key),
    })) || [];

  // Handle Contact and Remove actions
  const handleContact = (id) => {
    console.log(`Contact employee with ID: ${id}`);
  };

  const handleRemove = (id) => {
    setEmployees(employees.filter(employee => employee.id !== id));
  };

  return (
    <DsPageOuter
      headerType={ProfileTypes.AGENCY}
      title="Employees List!"
      subtitle="Keep Your Crew Connected"
    >
      <FancyTableV2
        context="employee"
        fields={fields}
        data={data}
        title="Employees"
        filterOptions={filterOptions}
        handleBulkDelete={handleBulkDelete}
      />
    </DsPageOuter>
  );
};

export default EmployeesList;