'use client'

import { useState } from "react";
import SearchForm from "../searchform/SearchForm";
import ImageBox from "./ImageBox";
import PopularSearch from "../searchform/PopularSearch";

const Hero = () => {
  // State for selected filters
  const [selectedCandidateTypes, setSelectedCandidateTypes] = useState([]);
  const [selectedQuickFilters, setSelectedQuickFilters] = useState([]);

  // Toggle selection for Candidate Type Filters
  const toggleCandidateType = (filter) => {
    if (selectedCandidateTypes.includes(filter)) {
      setSelectedCandidateTypes(selectedCandidateTypes.filter((item) => item !== filter));
    } else {
      setSelectedCandidateTypes([...selectedCandidateTypes, filter]);
    }
  };

  // Toggle selection for Quick Filters
  const toggleQuickFilter = (filter) => {
    if (selectedQuickFilters.includes(filter)) {
      setSelectedQuickFilters(selectedQuickFilters.filter((item) => item !== filter));
    } else {
      setSelectedQuickFilters([...selectedQuickFilters, filter]);
    }
  };

  return (
    <section className="banner-section">
      <div className="auto-container">
        <div className="row">
          <div className="content-column col-lg-7 col-md-12 col-sm-12">
            <div
              className="inner-column"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <div className="title-box">
                <h3>
                  Find the <span className="colored">Perfect Match</span> for
                  <br />your Home
                </h3>
                <div className="text">
                  Verified Domestic Professionals Ready to Assist
                </div>
              </div>

              {/* <!-- Job Search Form --> */}
              <div className="job-search-form">
                <SearchForm />
              </div>
              {/* <!-- Job Search Form --> */}

              {/* <!-- Filters Section --> */}
              <div className="filters-section">
                <div className="filter-group">
                  <h4 className="filter-title">Candidate Type Filters:</h4>
                  <div className="filter-options">
                    {["Direct Hire", "Agent Managed", "Live In", "Live Out", "Full Time", "Part Time"].map((filter) => (
                      <span
                        key={filter}
                        className={`filter-tag ${selectedCandidateTypes.includes(filter) ? "selected" : ""}`}
                        onClick={() => toggleCandidateType(filter)}
                      >
                        {filter}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="filter-group">
                  <h4 className="filter-title">Quick Filters:</h4>
                  <div className="filter-options">
                    {["Filipino", "Indonesian", "Nepali", "Indian", "Sri Lankan"].map((filter) => (
                      <span
                        key={filter}
                        className={`filter-tag ${selectedQuickFilters.includes(filter) ? "selected" : ""}`}
                        onClick={() => toggleQuickFilter(filter)}
                      >
                        {filter}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {/* <!-- End Filters Section --> */}

              {/* <!-- Popular Search --> */}
              {/* <PopularSearch /> */}
              {/* <!-- End Popular Search --> */}
            </div>
          </div>
          {/* End .col */}

          <div className="image-column col-lg-5 col-md-12">
            <ImageBox />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;