'use client'

import employeeProfile from '@/data/employee-profile';
import agentData from "@/data/agent-profile";
import employerProfile from "@/data/employer-profile";

const TopCardBlock = () => {
  const totalEmployees = employeeProfile.length;
  const totalAgencies = agentData.length;
  const totalEmployers = employerProfile.length;

  const cardContent = [
    {
      id: 1,
      icon: "la-users",
      countNumber: totalEmployees.toString(),
      metaName: "Total Employees",
      uiClass: "ui-blue",
    },
    {
      id: 2,
      icon: "la-building",
      countNumber: totalAgencies.toString(),
      metaName: "Total Agencies",
      uiClass: "ui-red",
    },
    {
      id: 3,
      icon: "la-user ",
      countNumber: totalEmployers.toString(),
      metaName: "Total Employers",
      uiClass: "ui-yellow",
    },
    {
      id: 4,
      icon: "la-handshake",
      countNumber: "3",
      metaName: "Total Hiring",
      uiClass: "ui-green",
    },
  ];

  return (
    <>
      {cardContent.map((item) => (
        <div
          className="ui-block col-xl-3 col-lg-6 col-md-6 col-sm-12"
          key={item.id}
        >
          <div className={`ui-item ${item.uiClass}`}>
            <div className="left">
              <i className={`icon la ${item.icon}`}></i>
            </div>
            <div className="right">
              <h4>{item.countNumber}</h4>
              <p>{item.metaName}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default TopCardBlock;
