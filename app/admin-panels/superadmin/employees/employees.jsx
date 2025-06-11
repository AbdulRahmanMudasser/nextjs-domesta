'use client'

import React from "react";
import DsPageOuter from "@/templates/layouts/ds-page-outer";
import { ProfileTypes } from "@/data/globalKeys";
import FancyTableV2 from "@/templates/tables/fancy-table-v2";
import employeeProfile from "@/data/employee-profile";

export const metadata = {
  title: "Agency Profile || Domesta - Listing Board",
  description: "Domesta - Listing Board",
};

const EmployeesList = () => {
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

  // Get all profile fields dynamically
  const profileFields = employeeProfile[0]?.keys
    .find((k) => k.key === "profile")
    ?.value.map((field) => ({
      key: field.key,
      label: formatFieldName(field.key),
    })) || [];

  // Map employeeProfile to table data
  const employees = employeeProfile.map((employee) => {
    const row = { id: employee.id };
    profileFields.forEach((field) => {
      row[field.key] = findKeyValue(employee.keys, "profile", field.key, "N/A");
    });
    return row;
  });

  // Handle Contact and Remove actions (kept for future use)
  const handleContact = (id) => {
    console.log(`Contact employee with ID: ${id}`);
  };

  const handleRemove = (id) => {
    console.log(`Remove employee with ID: ${id}`);
  };

  return (
    <DsPageOuter
      headerType={ProfileTypes.SUPERADMIN}
      title="Employees List!"
      subtitle="Keep Your Crew Connected"
    >
      <FancyTableV2
        fields={profileFields}
        data={employees}
        title="Employees"
        filterOptions={[]}
      />
    </DsPageOuter>
  );
};

export default EmployeesList;