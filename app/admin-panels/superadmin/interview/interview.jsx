'use client'

import React, { useState } from "react";
import DsPageOuter from "@/templates/layouts/ds-page-outer";
import { ProfileTypes } from "@/data/globalKeys";
import FancyTableV2 from "@/templates/tables/fancy-table-v2";
import Link from "next/link";

export const metadata = {
  title: "Agency Interviews || Domesta - Listing Board",
  description: "Domesta - Listing Board",
};

const Interview = () => {
  const [interviews, setInterviews] = useState([
    {
      id: 1,
      employee: "John Doe",
      employer: "Acme Corp",
      service: "Web Development",
      dateTime: "2025-05-01 10:00 AM",
      status: "Pending",
      handleChangeStatus: (id) => {
        setInterviews(interviews.map(interview =>
          interview.id === id ? { 
            ...interview, 
            status: interview.status === "Pending" ? "Confirmed" : interview.status === "Confirmed" ? "Completed" : "Pending" 
          } : interview
        ));
      },
    },
    {
      id: 2,
      employee: "Sarah Smith",
      employer: "Beta Inc",
      service: "Graphic Design",
      dateTime: "2025-05-03 2:00 PM",
      status: "Confirmed",
      handleChangeStatus: (id) => {
        setInterviews(interviews.map(interview =>
          interview.id === id ? { 
            ...interview, 
            status: interview.status === "Pending" ? "Confirmed" : interview.status === "Confirmed" ? "Completed" : "Pending" 
          } : interview
        ));
      },
    },
    {
      id: 3,
      employee: "Mike Johnson",
      employer: "Gamma Ltd",
      service: "Marketing Strategy",
      dateTime: "2025-04-20 11:00 AM",
      status: "Completed",
      handleChangeStatus: (id) => {
        setInterviews(interviews.map(interview =>
          interview.id === id ? { 
            ...interview, 
            status: interview.status === "Pending" ? "Confirmed" : interview.status === "Confirmed" ? "Completed" : "Pending" 
          } : interview
        ));
      },
    },
  ]);

  const handleBulkDelete = (ids) => {
    setInterviews(interviews.filter(interview => !ids.includes(interview.id)));
  };

  const interviewFields = [
    { key: "employee", label: "Employee" },
    { key: "employer", label: "Employer" },
    { key: "service", label: "Service" },
    { key: "dateTime", label: "Date & time" },
    { key: "status", label: "Status" },
  ];

  const customActions = {
    key: "actions",
    label: "Action",
    render: (row) => (
      <div className="option-box">
        <ul className="option-list" style={{ display: "flex", gap: "0.25rem" }}>
          <li>
            <Link
              href={`/website/employees/profile/${row.id}`}
              title="View Profile"
              data-text="View Profile"
            >
              <span className="la la-eye"></span>
            </Link>
          </li>
          <li>
            <Link
              href={`/website/employees/edit/${row.id}`}
              title="Edit Profile"
              data-text="Edit Profile"
            >
              <span className="la la-pencil"></span>
            </Link>
          </li>
          <li>
            <Link
              href={`/website/employees/documents/${row.id}`}
              title="View Documents"
              data-text="View Documents"
            >
              <span className="la la-file-alt"></span>
            </Link>
          </li>
          <li>
            <button
              title="Delete Record"
              data-text="Delete Record"
              onClick={() => handleBulkDelete([row.id])}
            >
              <span className="la la-trash"></span>
            </button>
          </li>
          <li>
            <Link
              href={`/website/interviews/notes/${row.id}`}
              title="Notes"
              data-text="Notes"
            >
              <span className="la la-sticky-note"></span>
            </Link>
          </li>
          <li>
            <Link
              href={`/website/interviews/logs/${row.id}`}
              title="Logs"
              data-text="Logs"
            >
              <span className="la la-history"></span>
            </Link>
          </li>
          <li>
            <button
              title="Change Status"
              data-text="Change Status"
              onClick={() => row.handleChangeStatus(row.id)}
            >
              <span className="la la-exchange-alt"></span>
            </button>
          </li>
        </ul>
      </div>
    ),
  };

  return (
    <DsPageOuter
      headerType={ProfileTypes.SUPERADMIN}
      // title="Interviews"
      // subtitle="Stay on Top of Your Interviews!"
    >
      <FancyTableV2
        fields={interviewFields}
        data={interviews}
        title="Manage Interviews"
        filterOptions={[]}
        handleBulkDelete={handleBulkDelete}
        customActions={customActions}
      />
    </DsPageOuter>
  );
};

export default Interview;