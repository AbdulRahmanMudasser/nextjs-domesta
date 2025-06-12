'use client'

import React from "react";
import DsPageOuter from "@/templates/layouts/ds-page-outer";
import { ProfileTypes } from "@/data/globalKeys";
import FancyTableV2 from "@/templates/tables/fancy-table-v2";
import agentData from "@/data/agent-profile";

export const metadata = {
  title: "Agency || Domesta - Listing Board",
  description: "Domesta - Listing Board",
};

const Agents = () => {
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

  // Get all Agent Profile fields dynamically
  const agentFields = agentData[0]?.keys
    .find((k) => k.key === "Agent Profile")
    ?.value.map((field) => ({
      key: field.key,
      label: formatFieldName(field.key),
    })) || [];

  // Map agentData to table data
  const agents = agentData.map((agent) => {
    const row = { id: agent.id };
    agentFields.forEach((field) => {
      row[field.key] = findKeyValue(agent.keys, "Agent Profile", field.key, "N/A");
    });
    return row;
  });

  // Define filter options
  const filterOptions = [
    {
      key: "agencyName",
      label: "Agency Name",
      type: "text",
    },
    {
      key: "country",
      label: "Country",
      type: "text",
    },
    {
      key: "phoneNumber",
      label: "Phone Number",
      type: "text",
    },
    {
      key: "officeAddress",
      label: "Office Address",
      type: "text",
    },
  ];

  return (
    <DsPageOuter
      headerType={ProfileTypes.SUPERADMIN}
      // title="Agency"
      // subtitle="Manage Your Agencies!"
    >
      <FancyTableV2
        fields={agentFields}
        data={agents}
        title="Manage Agencies"
        filterOptions={filterOptions}
      />
    </DsPageOuter>
  );
};

export default Agents;