'use client'

import React, { useState } from "react";
import DsPageOuter from "@/templates/layouts/ds-page-outer";
import { ProfileTypes } from "@/data/globalKeys";
import FancyTableV2 from "@/templates/tables/fancy-table-v2";

export const metadata = {
  title: "Agency Hirings || Domesta - Listing Board",
  description: "Domesta - Listing Board",
};

const Hirings = () => {
  const [hirings, setHirings] = useState([
    { id: 1, name: "Alice Smith", position: "Nanny", clientName: "Johnson Family", hireDate: "2024-12-15", status: "Active" },
    { id: 2, name: "Bob Johnson", position: "Driver", clientName: "Smith Corp", hireDate: "2024-10-10", status: "Active" },
    { id: 3, name: "Emma Wilson", position: "Housekeeper", clientName: "Brown Household", hireDate: "2024-08-05", status: "Inactive" },
  ]);

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

  return (
    <DsPageOuter
      headerType={ProfileTypes.SUPERADMIN}
    >
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