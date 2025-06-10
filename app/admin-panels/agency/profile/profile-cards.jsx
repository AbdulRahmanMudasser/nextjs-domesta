import React from "react";
import MyProfile from "./components/MyProfile";
import LegalCompliance from "./components/LegalCompliance";
import ServicesOffering from "./components/ServicesOffering";

const ProfileCards = ({ activeTab }) => {
  const tabComponents = {
    MyProfile: <MyProfile />,
    LegalCompliance: <LegalCompliance />,
    ServicesOffering: <ServicesOffering />,
  };

  return <div>{tabComponents[activeTab]}</div>;
};

export default ProfileCards;