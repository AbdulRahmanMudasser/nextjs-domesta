import Link from "next/link";
import Hero from "./herosection/Hero";
import JobFeatured from "./jobfeatured/JobFeatured";
import About from "./about/About";
import TopCompany from "./topcompany/TopCompany";
import Candidates from "./candidates/Candidates";
import WsPageOuter from "@/templates/layouts/ws-page-outer";
import ListingCategories from "./Listingcategories/ListingCategories";
import About6 from "@/components/whyemployer";
import About7 from "@/components/whyagency";
import About8 from "@/components/whyemployee";


const LandingPage = () => {
  return (
    <WsPageOuter>
      <Hero />
         <section className="candidates-section">
        <div className="auto-container">
          <div className="sec-title text-center">
            <h2>Featured Employees</h2>
            <div className="text">
              Lorem ipsum dolor sit amet elit, sed do eiusmod tempor
            </div>
          </div>

          <div className="carousel-outer" data-aos="fade-up">
            <div className="candidates-carousel default-dots">
              <Candidates />
            </div>
          </div>
         
        </div>
        
      </section>
      <About6/>
      <About7/>
      <About8/>
      <section className="job-categories ui-job-categories">
        <div className="auto-container">
          <div className="sec-title text-center">
            <h2>Services</h2>
            <div className="text">2025 Listings - 293 added today.</div>
          </div>

          <div
            className="row "
            data-aos="fade-up"
            data-aos-anchor-placement="top-bottom"
          >
            {/* <!-- Category Block --> */}
            <ListingCategories />
          </div>
        </div>
      </section>
      {/* <section className="top-companies">
        <div className="auto-container" >
          <div className="sec-title text-center">
            <h2>Featured Employers</h2>
            <div className="text">
              Know your worth and find the listing that qualify your life
            </div>
          </div>
          <div className="carousel-outer" data-aos="fade-up">
            <div className="companies-carousel">
              <TopCompany />
            </div>
          </div>
          
        </div>
        
      </section> */}
      {/* <section className="job-section">
        <div className="auto-container">
          <div className="sec-title text-center">
            <h2>Featured Agencies</h2>
            <div className="text">
              Know your worth and find the Agency that qualify your life
            </div>
          </div>

          <div className="row " data-aos="fade-up">
            <JobFeatured />
          </div>

          <div className="btn-box">
            <Link
              href="/website/agents"
              className="theme-btn btn-style-one bg-blue"
            >
              <span className="btn-title">Load More Listing</span>
            </Link>
          </div>
        </div>
      </section>  */}
      
      <section className="about-section-two">
        <div className="auto-container">
          <div className="row">
            <About />
          </div>
        </div>
      </section>
    </WsPageOuter>
  );
};

export default LandingPage;
