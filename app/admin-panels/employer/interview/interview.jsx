'use client'

import React, { useState } from "react";
import DsPageOuter from "@/templates/layouts/ds-page-outer";
import { ProfileTypes } from "@/data/globalKeys";
import FancyTable from "@/templates/tables/fancy-table";

export const metadata = {
  title: "Employer Interviews || Domesta - Listing Board",
  description: "Domesta - Listing Board",
};

const Interview = () => {
  // Dummy data for interviews
  const [interviews, setInterviews] = useState([
    { id: 1, title: "Interview with John", date: "2025-05-01", label: "Upcoming", status: "Pending" },
    { id: 2, title: "Interview with Sarah", date: "2025-05-03", label: "Upcoming", status: "Confirmed" },
    { id: 3, title: "Interview with Mike", date: "2025-04-20", label: "Past", status: "Confirmed" },
  ]);

  // Handle Confirm and Cancel actions
  const handleConfirm = (id) => {
    setInterviews(interviews.map(interview =>
      interview.id === id ? { ...interview, status: "Confirmed" } : interview
    ));
  };

  const handleCancel = (id) => {
    setInterviews(interviews.filter(interview => interview.id !== id));
  };

  // Field configurations for interviews table
  const interviewFields = [
    { key: "title", label: "Title" },
    { key: "date", label: "Date" },
    { key: "label", label: "Label" },
    { key: "status", label: "Status" },
    
  ];

  return (
    <>
      <DsPageOuter
        headerType={ProfileTypes.EMPLOYER}
        title="Interviews"
        subtitle="Stay on Top of Your Interviews!"
      >
        <FancyTable
          fields={interviewFields}
          data={interviews}
          title="Interviews"
          filterOptions={[]}
        />
      </DsPageOuter>
    </>
  );
};

export default Interview;