'use client'

import React, { useState, useEffect } from "react";
import DsPageOuter from "@/templates/layouts/ds-page-outer";
import { ProfileTypes } from "@/data/globalKeys";
import FancyTableV2 from "@/templates/tables/fancy-table-v2";
import employerProfile from "@/data/employer-profile";
import Shimmer from "@/templates/misc/Shimmer";

export const metadata = {
  title: "Employer Profile || Domesta - Listing Board",
  description: "Domesta - Listing Board",
};

const EmployerList = () => {
  const [employersData, setEmployersData] = useState(null);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setEmployersData(employerProfile);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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
  const employerFields = employersData?.[0]?.keys
    ?.find((k) => k.key === "profile")
    ?.value.map((field) => ({
      key: field.key,
      label: formatFieldName(field.key),
    })) || [];

  // Map employerProfile to table data
  const employers = employersData?.map((employer) => {
    const row = { id: employer.id };
    employerFields.forEach((field) => {
      row[field.key] = findKeyValue(employer.keys, "profile", field.key, "N/A");
    });
    return row;
  }) || [];

  // Define filter options with religion filter added
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
    {
      key: "religion",
      label: "Religion",
      type: "select",
      options: [
        { value: "christianity", label: "Christianity" },
        { value: "islam", label: "Islam" },
        { value: "hinduism", label: "Hinduism" },
        { value: "buddhism", label: "Buddhism" },
        { value: "sikhism", label: "Sikhism" },
        { value: "judaism", label: "Judaism" },
        { value: "other", label: "Other" },
        { value: "none", label: "None" },
      ],
    },
  ];

  if (!employersData) {
    return (
      <DsPageOuter headerType={ProfileTypes.SUPERADMIN}>
        <div style={{ padding: "1.5rem", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          <Shimmer width="200px" height="24px" style={{ marginBottom: "0.5rem" }} />
          <Shimmer width="300px" height="16px" style={{ marginBottom: "1rem" }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
            {[...Array(5)].map((_, i) => (
              <Shimmer key={i} width="150px" height="32px" />
            ))}
          </div>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {[...Array(5)].map((_, i) => (
              <Shimmer key={i} width="100%" height="40px" />
            ))}
          </div>
        </div>
      </DsPageOuter>
    );
  }

  return (
    <DsPageOuter headerType={ProfileTypes.SUPERADMIN}>
      <FancyTableV2
        context="employer"
        fields={employerFields}
        data={employers}
        title="Manage Employers"
        subtitle="Manage Your Business Clients."
        filterOptions={filterOptions}
      />
    </DsPageOuter>
  );
};

export default EmployerList;