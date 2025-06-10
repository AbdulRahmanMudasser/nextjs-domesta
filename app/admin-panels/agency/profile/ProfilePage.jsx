"use client";

import React, { useState } from "react";
import DsPageOuter from "@/templates/layouts/ds-page-outer";
import candidatesMenuData from "@/data/candidatesMenuData";
import { ProfileTypes } from "@/data/globalKeys";
import ProfileCards from "./profile-cards";
import ProfileTabs from "./profile-tabs";

export const metadata = {
  title: "Agency Profile || Domesta  - Listing Board",
  description: "Domesta  - Listing Board",
};

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("MyProfile");

  return (
    <>
      <DsPageOuter
        headerType={ProfileTypes.AGENCY}
        title="Profile!"
        subtitle="Showcase Your Agency's Identity"
        menuData={candidatesMenuData}
      >
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <ProfileCards activeTab={activeTab} />
      </DsPageOuter>
    </>
  );
};

export default ProfilePage;
