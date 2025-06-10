import WsPageOuter from "@/templates/layouts/ws-page-outer";
import TermsText from "./termstext";

const Terms = () => {
  return (
    <WsPageOuter>
     <section className="tnc-section">
        <div className="auto-container">
          <div className="sec-title text-center">
            <h2>Terms and Conditions</h2>
            <div className="text">Home / Terms and Conditions</div>
          </div>
          {/* End sec-title */}
          <TermsText />
        </div>
      </section>
    </WsPageOuter>
  );
};

export default Terms;
