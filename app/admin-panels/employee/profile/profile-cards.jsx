import React from "react";
import MyProfile from "./components/MyProfile";
import ContactInfoBox from "./components/ContactInfoBox";
import WorkExperiencesBox from "./components/WorkExperiencesBox";
import UploadDocument from "./components/UploadDocument";
import InterviewManagement from "./components/InterviewManagement";
import SocialNetworkBox from "./components/SocialNetworkBox";
import EmploymentDetails from "./components/EmployementDetails";
import ApplicationManagement from "./components/ApplicationManagement";

const ProfileCards = ({ activeTab }) => {
  const tabComponents = {
    MyProfile: <MyProfile />,
    ContactInfoBox: <ContactInfoBox />,
    WorkExperiencesBox: <WorkExperiencesBox />,
    EmploymentDetails: <EmploymentDetails />,
    UploadDocument: <UploadDocument />,
    ApplicationManagement: <ApplicationManagement />,
    InterviewManagement: <InterviewManagement />,
    SocialNetworkBox: <SocialNetworkBox />,
  };

  return <div>{tabComponents[activeTab]}</div>;
};

export default ProfileCards;