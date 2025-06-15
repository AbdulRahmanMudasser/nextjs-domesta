
'use client'

import React, { useState, useEffect } from "react";
import TopCardBlock from "./components/TopCardBlock";
import Hirings from "./components/Hirings";
import DsPageOuter from "@/templates/layouts/ds-page-outer";
import { ProfileTypes } from "@/data/globalKeys";
import SimpleTable from "@/templates/tables/simple-table";
import Shimmer from "@/templates/misc/Shimmer";

const recentEmployees = [
  { id: 1, name: "John Doe", email: "john.doe@example.com", role: "Developer" },
  { id: 2, name: "Jane Smith", email: "jane.smith@example.com", role: "Designer" },
  { id: 3, name: "Bob Johnson", email: "bob.johnson@example.com", role: "Manager" },
];

const recentAgencies = [
  { id: 1, name: "Tech Talent", email: "contact@techtalent.com", role: "Recruitment Agency" },
  { id: 2, name: "Creative Hire", email: "info@creativehire.com", role: "Creative Agency" },
  { id: 3, name: "Pro Staff", email: "support@prostaff.com", role: "Staffing Agency" },
];

const recentEmployers = [
  { id: 1, name: "Acme Corp", email: "hr@acmecorp.com", role: "Tech Employer" },
  { id: 2, name: "Beta Inc", email: "careers@betainc.com", role: "Marketing Employer" },
  { id: 3, name: "Gamma Ltd", email: "jobs@gammaltd.com", role: "Finance Employer" },
];

const tableFields = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
];

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <DsPageOuter headerType={ProfileTypes.SUPERADMIN} title="Welcome John!" subtitle="Ready to jump back in?">
        <div className="row">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "2.5rem" }}>
            {[...Array(4)].map((_, i) => (
              <Shimmer key={i} width="200px" height="100px" style={{ flex: "1 1 200px" }} />
            ))}
          </div>
          <div className="d-flex flex-nowrap" style={{ gap: "5px", marginBottom: "2.5rem" }}>
            {[...Array(3)].map((_, j) => (
              <div key={j} className="col-lg-4" style={{ flex: 1, minWidth: 0 }}>
                <Shimmer width="150px" height="24px" style={{ marginBottom: "0.5rem" }} />
                <div style={{ display: "grid", gap: "0.5rem" }}>
                  {[...Array(3)].map((_, i) => (
                    <Shimmer key={i} width="100%" height="40px" />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: "1.5rem", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <Shimmer width="200px" height="24px" style={{ marginBottom: "0.5rem" }} />
            <div style={{ display: "grid", gap: "0.5rem" }}>
              {[...Array(5)].map((_, i) => (
                <Shimmer key={i} width="100%" height="40px" />
              ))}
            </div>
          </div>
        </div>
      </DsPageOuter>
    );
  }

  return (
    <DsPageOuter headerType={ProfileTypes.SUPERADMIN} title="Welcome John!" subtitle="Ready to jump back in?">
      <div className="row">
        <TopCardBlock />
        <div className="d-flex flex-nowrap" style={{ gap: "5px", marginBottom: "2.5rem" }}>
          <div className="col-lg-4" style={{ flex: 1, minWidth: 0 }}>
            <SimpleTable
              fields={tableFields}
              data={recentEmployees}
              title="Recent Employees"
            />
          </div>
          <div className="col-lg-4" style={{ flex: 1, minWidth: 0 }}>
            <SimpleTable
              fields={tableFields}
              data={recentAgencies}
              title="Recent Agencies"
            />
          </div>
          <div className="col-lg-4" style={{ flex: 1, minWidth: 0 }}>
            <SimpleTable
              fields={tableFields}
              data={recentEmployers}
              title="Recent Employers"
            />
          </div>
        </div>
        <Hirings />
      </div>
    </DsPageOuter>
  );
};

export default DashboardPage;