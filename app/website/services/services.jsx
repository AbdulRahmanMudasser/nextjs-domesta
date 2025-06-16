'use client'

import React, { useState, useEffect } from "react";
import WsPageOuter from "@/templates/layouts/ws-page-outer";
import ListingCategories from "@/app/website/home/Listingcategories/ListingCategories";
import jobCatContent from "@/data/job-catergories";

const Services = () => {
    const [categories, setCategories] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCategories(jobCatContent || []);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <WsPageOuter>
            <section className="services-section pb-0">
                <div className="auto-container">
                    <div className="sec-title -type-2 text-center">
                        <h2>Our Services</h2>
                        <div className="text">
                            Explore our range of service categories tailored to your needs.
                        </div>
                    </div>
                    <div
                        className="row grid-base"
                        data-aos="fade-up"
                        data-aos-anchor-placement="top-bottom"
                    >
                        {categories ? (
                            <ListingCategories categories={categories} />
                        ) : (
                            <p style={{ color: "#555", fontSize: "1rem", textAlign: "center" }}>
                                Loading service categories...
                            </p>
                        )}
                    </div>
                </div>
            </section>
        </WsPageOuter>
    );
};

export default Services;