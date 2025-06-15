import TopCardBlock from "./components/TopCardBlock";
import Hirings from "./components/Hirings";
import DsPageOuter from "@/templates/layouts/ds-page-outer";
import { ProfileTypes } from "@/data/globalKeys";
import SimpleTable from "@/templates/tables/simple-table";

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
  return (
    <DsPageOuter
      headerType={ProfileTypes.SUPERADMIN}
      title="Welcome John!"
      subtitle="Ready to jump back in?"
    >
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