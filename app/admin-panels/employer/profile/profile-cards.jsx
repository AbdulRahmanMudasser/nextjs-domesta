import React from "react";
import ContactInfoBox from "./components/ContactInfoBox";
import ResidenceInfo from "./components/ResidenceInfo";
import WorkScheduleOfferDetails from "./components/WorkScheduleDetails";
import InterviewAccountPreferences from "./components/InterviewAccountPreferences";
import CommunicationCulturalFit from "./components/CommunicationCulruralFit";
import JobPreference from "./components/JobPreference";
import MyProfile from "./components/MyProfile";

const ProfileCards = ({ activeTab }) => {
  const tabComponents = {
    MyProfile: <MyProfile />,
    ResidenceInfo: <ResidenceInfo />,
    ContactInfoBox: <ContactInfoBox />,
    CommunicationCulturalFit: <CommunicationCulturalFit />,
    JobPreference: <JobPreference />,
    WorkScheduleOfferDetails: <WorkScheduleOfferDetails />,
    InterviewAccountPreferences: <InterviewAccountPreferences />,
  };

  return <div>{tabComponents[activeTab]}</div>;
};

export default ProfileCards;