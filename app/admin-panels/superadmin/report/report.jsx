'use client'

import React, { useState, useEffect } from "react";
import DsPageOuter from "@/templates/layouts/ds-page-outer";
import { ProfileTypes } from "@/data/globalKeys";
import FancyTableV2 from "@/templates/tables/fancy-table-v2";
import dynamic from "next/dynamic";

// Dynamically import Chart.js components to avoid SSR issues
const BarChart = dynamic(() => import("../report/components/BarChart"), { ssr: false });
const PieChart = dynamic(() => import("../report/components/PieChart"), { ssr: false });

export const metadata = {
  title: "User Activity Report || Domesta - Listing Board",
  description: "Domesta - Listing Board",
};

const ReportsReport = () => {
  const [userData, setUserData] = useState([]);

  // Mock data fetch (replace with your API call)
  useEffect(() => {
    const mockData = [
      { id: 1, name: "John Doe", status: "Active", activityCount: 120 },
      { id: 2, name: "Jane Smith", status: "Inactive", activityCount: 45 },
      { id: 3, name: "Alice Johnson", status: "Active", activityCount: 200 },
      { id: 4, name: "Bob Wilson", status: "Active", activityCount: 80 },
      { id: 5, name: "Emma Brown", status: "Inactive", activityCount: 30 },
    ];
    setUserData(mockData);
  }, []);

  // Table fields for FancyTableV2
  const tableFields = [
    { key: "name", label: "Name", className: "text-left" },
    { key: "status", label: "Status", className: "text-left" },
    { key: "activityCount", label: "Activity Count", className: "text-left" },
  ];

  // Filter options for FancyTableV2
  const filterOptions = [
    {
      key: "name",
      label: "Name",
      type: "text",
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

  // Data for charts
  const barChartData = {
    labels: userData.map(user => user.name),
    datasets: [{
      label: "Activity Count",
      data: userData.map(user => user.activityCount),
      backgroundColor: "rgba(59, 130, 246, 0.5)",
      borderColor: "rgba(59, 130, 246, 1)",
      borderWidth: 1,
    }],
  };

  const pieChartData = {
    labels: ["Active", "Inactive"],
    datasets: [{
      data: [
        userData.filter(user => user.status === "Active").length,
        userData.filter(user => user.status === "Inactive").length,
      ],
      backgroundColor: ["rgba(59, 130, 246, 0.5)", "rgba(239, 68, 68, 0.5)"],
      borderColor: ["rgba(59, 130, 246, 1)", "rgba(239, 68, 68, 1)"],
      borderWidth: 1,
    }],
  };

  return (
    <DsPageOuter
      headerType={ProfileTypes.SUPERADMIN}
      // title="User Activity Report"
      // subtitle="Stay on Top of Your User Statistics!"
    >
      <div>
        <FancyTableV2
          fields={tableFields}
          data={userData}
          title="User Statistics"
          filterOptions={filterOptions}
          rightOptionsHtml=""
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
            marginTop: "1.5rem",
            marginBottom: "1.5rem",
          }}
          className="grid-cols-1 md:grid-cols-2"
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "1.5rem",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#333", marginBottom: "1rem" }}>
              Activity Distribution
            </h2>
            <BarChart data={barChartData} />
          </div>
          <div
            style={{
              backgroundColor: "#fff",
              padding: "1.5rem",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#333", marginBottom: "1rem" }}>
              Status Distribution
            </h2>
            <PieChart data={pieChartData} />
          </div>
        </div>
      </div>
    </DsPageOuter>
  );
};

export default ReportsReport;