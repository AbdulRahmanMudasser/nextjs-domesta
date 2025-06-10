
import Pricing from "./components/pricing2";

import Image from "next/image";
import WsPageOuter from "@/templates/layouts/ws-page-outer";

const index = () => {
  return (
<WsPageOuter> 


    
      {/* End Job Categorie Section */}

    
      {/* <!-- End Job Section --> */}

 
      {/* <!-- End App Section --> */}

      <section className="pricing-section pb-0">
        <div className="auto-container">
          <div className="sec-title -type-2 text-center">
            <h2>Pricing Packages</h2>
            <div className="text">
              Lorem ipsum dolor sit amet elit, sed do eiusmod tempor.
            </div>
          </div>

          <div className="row grid-base" data-aos="fade-up">
            <Pricing />
          </div>
        </div>
      </section>
      {/* <!-- End Pricing Section --> */}

      
      {/* <!-- End Clients Section --> */}

      
      {/* <!-- End Main Footer --> */}
    </WsPageOuter>
  );
};

export default index;
