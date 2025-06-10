'use client'

import React, { useState } from "react";
import DsPageOuter from "@/templates/layouts/ds-page-outer";
import { ProfileTypes } from "@/data/globalKeys";
import FancyTable from "@/templates/tables/fancy-table";

export const metadata = {
  title: "Employer Hirings || Domesta - Listing Board",
  description: "Domesta - Listing Board",
};

const Hirings = () => {
  // Dummy data for hirings
  const [hirings, setHirings] = useState([
    { id: 1, name: "Alice Smith", position: "Nanny", hireDate: "2024-12-15", status: "Active" },
    { id: 2, name: "Bob Johnson", position: "Driver", hireDate: "2024-10-10", status: "Active" },
    { id: 3, name: "Emma Wilson", position: "Housekeeper", hireDate: "2024-08-05", status: "Inactive" },
  ]);

  // Handle Contact and Remove actions
  const handleContact = (id) => {
    console.log(`Contact employee with ID: ${id}`);
  };

  const handleRemove = (id) => {
    setHirings(hirings.filter(hiring => hiring.id !== id));
  };

  // Field configurations for hirings table
  const hiringFields = [
    { key: "name", label: "Name" },
    { key: "position", label: "Position" },
    { key: "hireDate", label: "Hire Date" },
    { key: "status", label: "Status" },
   
  ];

  return (
    <>
      <DsPageOuter
        headerType={ProfileTypes.EMPLOYER}
        title="Hirings"
        subtitle="Track Your Hiring Success!"
      >
        <FancyTable
          fields={hiringFields}
          data={hirings}
          title="Hirings"
          filterOptions={[]}
        />
      </DsPageOuter>
    </>
  );
};

export default Hirings;