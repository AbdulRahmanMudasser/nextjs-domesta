'use client'

import React, { useState, useEffect } from "react";
import DsPageOuter from "@/templates/layouts/ds-page-outer";
import { ProfileTypes } from "@/data/globalKeys";
import FancyTableV2 from "@/templates/tables/fancy-table-v2";
import agentData from "@/data/agent-profile";
import Shimmer from "@/templates/misc/Shimmer";

export const metadata = {
  title: "Agency || Domesta - Listing Board",
  description: "Domesta - Listing Board",
};

const Agents = () => {
  const [agentsData, setAgentsData] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAgentsData(agentData || []);
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

  // Get all Agent Profile fields dynamically
  const agentFields = agentsData?.[0]?.keys
    ?.find((k) => k.key === "Agent Profile")
    ?.value.map((field) => ({
      key: field.key,
      label: formatFieldName(field.key),
    })) || [];

  // Map agentData to table data
  const agents = agentsData?.map((agent) => {
    const row = { id: agent.id };
    agentFields.forEach((field) => {
      row[field.key] = findKeyValue(agent.keys, "Agent Profile", field.key, "N/A");
    });
    return row;
  }) || [];

  // Define filter options
  const filterOptions = [
    {
      key: "name",
      label: "Name",
      type: "text",
    },
    {
      key: "email",
      label: "Email",
      type: "text",
    },
    {
      key: "phoneNumber",
      label: "Phone Number",
      type: "text",
    },
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
      key: "officeAddress",
      label: "Office Address",
      type: "text",
    },
  ];

  if (!agentsData) {
    return (
      <DsPageOuter headerType={ProfileTypes.SUPERADMIN}>
        <div style={{ padding: "1.5rem", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          <Shimmer width="200px" height="24px" style={{ marginBottom: "0.5rem" }} />
          <Shimmer width="300px" height="16px" style={{ marginBottom: "1rem" }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
            {[...Array(4)].map((_, i) => (
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
        context="agency"
        fields={agentFields}
        data={agents}
        title="Manage Agencies"
        subtitle="Manage Your Agency Partners."
        filterOptions={filterOptions}
      />
    </DsPageOuter>
  );
};

export default Agents;