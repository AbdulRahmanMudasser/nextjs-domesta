import { ProfileTypes } from "@/data/globalKeys";
import DsPageOuter from "@/templates/layouts/ds-page-outer";
import TopCardBlock from "./components/TopCardBlock";

const DashboardPage = () => {
  return (
    <DsPageOuter
      headerType={ProfileTypes.EMPLOYER}
      title="Welcome Peter!"
      subtitle="Ready to jump back in?">
         <div className="row">
        <TopCardBlock />
      </div>

    </DsPageOuter>
  );
};

export default DashboardPage;
