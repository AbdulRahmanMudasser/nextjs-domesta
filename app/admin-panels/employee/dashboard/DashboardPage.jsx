import TopCardBlock from "./components/TopCardBlock";
import DsPageOuter from "@/templates/layouts/ds-page-outer";
import { ProfileTypes } from "@/data/globalKeys";

const DashboardPage = () => {
  return (

    <DsPageOuter 
    headerType={ProfileTypes.CANDIDATE}
     title="Welcome John!"
      subtitle="Ready to jump back in?">
      <div className="row">
        <TopCardBlock />
      </div>
     

     
      {/* End .row profile and notificatins */}
    </DsPageOuter>

  );
};

export default DashboardPage;
