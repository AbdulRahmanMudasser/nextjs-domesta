import TopCardBlock from "./components/TopCardBlock";
import EmployeeTableCards from "./components/EmployeeTableCards";
import DsPageOuter from "@/templates/layouts/ds-page-outer";
import { ProfileTypes } from "@/data/globalKeys";

const DashboardPage = () => {
  return (
    <DsPageOuter
    headerType={ProfileTypes.SUPERADMIN}
      title="Welcome John!"
      subtitle="Ready to jump back in?"
    >
      <div className="row">
        <TopCardBlock />
        <EmployeeTableCards />
      </div>
     
    </DsPageOuter>
  );
};

export default DashboardPage;
