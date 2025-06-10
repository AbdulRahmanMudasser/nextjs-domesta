'use client'

import React from "react";
import DsPageOuter from "@/templates/layouts/ds-page-outer";
import { ProfileTypes } from "@/data/globalKeys";
import FancyTable from "@/templates/tables/fancy-table";
import employerProfile from "@/data/employer-profile";

export const metadata = {
  title: "Employer Profile || Domesta - Listing Board",
  description: "Domesta - Listing Board",
};

const EmployerList = () => {
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
  const employerFields = employerProfile[0]?.keys
    .find((k) => k.key === "profile")
    ?.value.map((field) => ({
      key: field.key,
      label: formatFieldName(field.key),
    })) || [];

  // Map employerProfile to table data
  const employers = employerProfile.map((employer) => {
    const row = { id: employer.id };
    employerFields.forEach((field) => {
      row[field.key] = findKeyValue(employer.keys, "profile", field.key, "N/A");
    });
    return row;
  });

  // Handle Contact and Remove actions (kept for future use)
  const handleContact = (id) => {
    console.log(`Contact employer with ID: ${id}`);
  };

  const handleRemove = (id) => {
    console.log(`Remove employer with ID: ${id}`);
  };

  return (
    <DsPageOuter
      headerType={ProfileTypes.SUPERADMIN}
      title="Employers List!"
      subtitle="Manage Your Business Clients"
    >
      <FancyTable
        fields={employerFields}
        data={employers}
        title="Employers"
        filterOptions={[]}
      />
    </DsPageOuter>
  );
};

export default EmployerList;