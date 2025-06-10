import React, { useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Tabs = ({ activeTab, setActiveTab }) => {
  const scrollRef = useRef(null);

  const tabs = [
    { name: "MyProfile", label: "Employee's Profile" },
    { name: "ContactInfoBox", label: "Contact Information" },
    { name: "WorkExperiencesBox", label: "Work Experiences" },
    { name: "EmploymentDetails", label: "Employment Details" },
    { name: "Document", label: "Upload Document" },
    { name: "ApplicationManagement", label: "Application Management" },
    { name: "InterviewManagement", label: "Interview Management" },
    { name: "SocialNetworkBox", label: "Social Networks" },
  ];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 150;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        position: "relative",
        width: "100%",
      }}
    >
      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        style={{
          background: "#8C956B",
          border: "none",
          color: "#696969",
          cursor: "pointer",
        }}
      >
        <FaArrowLeft size={14} />
      </button>

      <div
        style={{
          flex: 1,
          overflow: "hidden",
          position: "relative",
        }}
        className="px-2"
      >
        <div
          ref={scrollRef}
          style={{
            display: "flex",
            overflowX: "auto",
            scrollBehavior: "smooth",
            whiteSpace: "nowrap",
            flexWrap: "nowrap",
            minHeight: "60px",
            msOverflowStyle: "none", // hide scrollbar in IE/Edge
            scrollbarWidth: "none", // hide scrollbar in Firefox
          }}
        >
          <ul
            className="nav nav-tabs"
            style={{
              display: "flex",
              flexWrap: "nowrap",
              padding: 0,
              margin: 0,
            }}
          >
            {tabs.map((tab) => (
              <li
                key={tab.name}
                className="nav-item"
                style={{
                  height: "100%",
                  flex: "0 0 auto",
                }}
              >
                <button
                  className={`nav-link ${activeTab === tab.name ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.name)}
                  style={{
                    height: "100%",
                    padding: "0.3rem 0.8rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    fontSize: "1.1rem",
                    whiteSpace: "nowrap",
                    backgroundColor: activeTab === tab.name ? "#1a73e8" : "transparent",
                    color: activeTab === tab.name ? "white" : "black",
                  }}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        style={{
          background: "#8C956B",
          border: "none",
          color: "#696969",
          cursor: "pointer",
        }}
      >
        <FaArrowRight size={14} />
      </button>
    </div>
  );
};

export default Tabs;