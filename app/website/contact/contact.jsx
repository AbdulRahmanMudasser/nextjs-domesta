import MapBox from "./components/mapbox";
import ContactForm from "./components/contactform";
import Address from "./components/address";
import WsPageOuter from "@/templates/layouts/ws-page-outer";

const Contact = () => {
  return (
    <WsPageOuter>
     <section className="map-section">
        <div className="map-outer">
          <MapBox />
        </div>
      </section>
      {/* <!-- End Map Section --> */}

      <section className="contact-section">
        <div className="auto-container">
          <div className="upper-box">
            <div className="row">
              <Address />
            </div>
            {/* End .row */}
          </div>
          {/* End upperbox */}

          {/* <!-- Contact Form --> */}
          <div className="contact-form default-form">
            <h3>Leave A Message</h3>
            <ContactForm />
            {/* <!--Contact Form--> */}
          </div>
          {/* <!--End Contact Form --> */}
        </div>
      </section>
      {/* <!-- Contact Section --> */}
    </WsPageOuter>
  );
};

export default Contact;
