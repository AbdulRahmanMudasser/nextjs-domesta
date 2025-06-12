'use client'

import React from "react";
import DsPageOuter from "@/templates/layouts/ds-page-outer";
import { ProfileTypes } from "@/data/globalKeys";
import FancyTableV2 from "@/templates/tables/fancy-table-v2";
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

  // Define filter options
  const filterOptions = [
    {
      key: "gender",
      label: "Gender",
      type: "select",
      options: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" },
      ],
    },
    {
      key: "nationality",
      label: "Nationality",
      type: "text",
    },
    {
      key: "householdType",
      label: "Household Type",
      type: "text",
    },
    {
      key: "elderlyDependents",
      label: "Elderly Dependents",
      type: "select",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    {
      key: "specialNeedsCare",
      label: "Special Needs Care",
      type: "select",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
  ];

  return (
    <DsPageOuter
      headerType={ProfileTypes.SUPERADMIN}
      // title="Employers List!"
      // subtitle="Manage Your Business Clients"
    >
      <FancyTableV2
        fields={employerFields}
        data={employers}
        title="Manage Employers"
        filterOptions={filterOptions}
      />
    </DsPageOuter>
  );
};

export default EmployerList;