'use client'

import React, { useState, useEffect } from "react";
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
import jobCatContent from "@/data/job-catergories";

const LandingPage = () => {
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    setCategories(jobCatContent || []);
  }, []);

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
      <About6 />
      <About7 />
      <About8 />
      <section className="job-categories ui-job-categories">
        <div className="auto-container">
          <div className="sec-title text-center">
            <h2>Services</h2>
            <div className="text">2025 Listings - 293 added today.</div>
          </div>

          <div
            className="row"
            data-aos="fade-up"
            data-aos-anchor-placement="top-bottom"
          >
            {categories ? (
              <ListingCategories categories={categories} />
            ) : (
              <p style={{ color: "#555", fontSize: "1rem", textAlign: "center" }}>
                Loading Service Categories...
              </p>
            )}
          </div>
        </div>
      </section>

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