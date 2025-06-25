"use client";

import React, { useState, useEffect } from "react";
import Hero from "./herosection/Hero";
import About from "./about/About";
import Candidates from "./candidates/Candidates";
import WsPageOuter from "@/templates/layouts/ws-page-outer";
import ListingCategories from "./Listingcategories/ListingCategories";
import About6 from "@/components/whyemployer";
import About7 from "@/components/whyagency";
import About8 from "@/components/whyemployee";
import Shimmer from "@/templates/misc/Shimmer";
import { userService } from "@/services/user.service";

const LandingPage = () => {
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log("Fetching services from getServices API...");
        const services = await userService.getServices();
        console.log("Services fetched:", services);
        if (services && Array.isArray(services)) {
          const mappedCategories = services.map((service) => ({
            id: service.id,
            catTitle: service.name,
            jobDescription: service.description || "", // Fallback for missing description
            jobNumber: service.employee_counter,
            icon: service.class_name || "fi-rs-circle", // Fallback for missing icon
          }));
          console.log("Mapped categories:", mappedCategories);
          setCategories(mappedCategories);
        } else {
          console.warn("No services returned from getServices API");
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        setCategories([]);
      }
    };

    fetchServices();
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
              <div className="row grid-base">
                {[...Array(6)].map((_, i) => (
                  <div
                    className="category-block col-lg-4 col-md-6 col-sm-12"
                    key={i}
                    style={{ marginBottom: "1rem" }}
                  >
                    <div className="inner-box">
                      <Shimmer height="200px" width="100%" borderRadius="8px" />
                    </div>
                  </div>
                ))}
              </div>
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