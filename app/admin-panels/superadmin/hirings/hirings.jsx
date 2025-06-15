
'use client'

import React, { useState, useEffect } from "react";
import DsPageOuter from "@/templates/layouts/ds-page-outer";
import { ProfileTypes } from "@/data/globalKeys";
import FancyTableV2 from "@/templates/tables/fancy-table-v2";
import Shimmer from "@/templates/misc/Shimmer";

export const metadata = {
  title: "Agency Hirings || Domesta - Listing Board",
  description: "Domesta - Listing Board",
};

const Hirings = () => {
  const [hirings, setHirings] = useState(null);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setHirings([
        { id: 1, name: "Alice Smith", position: "Nanny", clientName: "Johnson Family", hireDate: "2024-12-15", status: "Active" },
        { id: 2, name: "Bob Johnson", position: "Driver", clientName: "Smith Corp", hireDate: "2024-10-10", status: "Active" },
        { id: 3, name: "Emma Wilson", position: "Housekeeper", clientName: "Brown Household", hireDate: "2024-08-05", status: "Inactive" },
      ]);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleBulkDelete = (ids) => {
    setHirings(hirings.filter(hiring => !ids.includes(hiring.id)));
  };

  const hiringFields = [
    { key: "name", label: "Name" },
    { key: "position", label: "Position" },
    { key: "clientName", label: "Client Name" },
    { key: "hireDate", label: "Hire Date" },
    { key: "status", label: "Status" },
  ];

  const filterOptions = [
    {
      key: "name",
      label: "Name",
      type: "text",
    },
    {
      key: "position",
      label: "Position",
      type: "select",
      options: [
        { value: "Nanny", label: "Nanny" },
        { value: "Driver", label: "Driver" },
        { value: "Housekeeper", label: "Housekeeper" },
      ],
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ],
    },
  ];

  if (!hirings) {
    return (
      <DsPageOuter headerType={ProfileTypes.SUPERADMIN}>
        <div style={{ padding: "1.5rem", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          <Shimmer width="200px" height="24px" style={{ marginBottom: "0.5rem" }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
            {[...Array(3)].map((_, i) => (
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
        fields={hiringFields}
        data={hirings}
        title="Manage Hirings"
        filterOptions={filterOptions}
        handleBulkDelete={handleBulkDelete}
      />
    </DsPageOuter>
  );
};

export default Hirings;
