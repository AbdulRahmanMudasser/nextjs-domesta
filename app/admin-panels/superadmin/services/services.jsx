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
            <div
                className="row "
                data-aos="fade-up"
                data-aos-anchor-placement="top-bottom"
            >
                {/* <!-- Category Block --> */}
                <ListingCategories />
            </div>
        </DsPageOuter>
    );
};

export default ServicesList;