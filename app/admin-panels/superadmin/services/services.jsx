'use client'

import React from "react";
import DsPageOuter from "@/templates/layouts/ds-page-outer";
import { ProfileTypes } from "@/data/globalKeys";
import ListingCategories from "@/app/website/home/Listingcategories/ListingCategories";

const ServicesList = () => {
  return (
    <DsPageOuter
      headerType={ProfileTypes.SUPERADMIN}
      // title="Employers List!"
      // subtitle="Manage Your Business Clients"
    >
      <div>
        <div
          style={{
            backgroundColor: "#fff",
            padding: "1.5rem",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <h4 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#333", margin: 0 }}>
            Services List
          </h4>
          <p style={{ fontSize: "1rem", color: "#555", margin: "0.25rem 0 1rem" }}>
            Explore and Manage Service Categories
          </p>
          <div
            className="row"
            data-aos="fade-up"
            data-aos-anchor-placement="top-bottom"
          >
            <ListingCategories />
          </div>
        </div>
      </div>
    </DsPageOuter>
  );
};

export default ServicesList;