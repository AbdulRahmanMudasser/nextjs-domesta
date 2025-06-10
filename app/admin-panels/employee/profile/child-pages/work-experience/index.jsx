"use client";

import React, { useState } from "react";
import DsPageOuter from "@/templates/layouts/ds-page-outer";
import candidatesMenuData from "@/data/candidatesMenuData";
import ProfileCards from "./profile-cards";
import ProfileTabs from "./profile-tabs";

const index = () => {
  const [activeTab, setActiveTab] = useState("MyProfile");

  return (
    <DsPageOuter
      headerType={"candidate"}
      title="Add Work Experience!"
      subtitle="Ready to jump back in?"
      menuData={candidatesMenuData}
    >
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <ProfileCards activeTab={activeTab} />
    </DsPageOuter>
  );
};

export default index;
