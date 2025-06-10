import React, { useRef, useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ProfileTabs = ({ activeTab, setActiveTab }) => {
  const scrollRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  const tabs = [
    { name: "MyProfile", label: "Employer Profile" },
    { name: "ResidenceInfo", label: "Residence Info" },
    { name: "ContactInfoBox", label: "Contact Information" },
    { name: "CommunicationCulturalFit", label: "Communication & Cultural Fit" },
    { name: "JobPreference", label: "Job Preference" },
    { name: "WorkScheduleOfferDetails", label: "Work Schedule Offer Details" },
    { name: "InterviewAccountPreferences", label: "Interview Account Preferences" },
  ];

  const scrollLeft = () => {
    if (scrollRef.current) {
      const newPosition = Math.max(scrollPosition - 150, 0);
      setScrollPosition(newPosition);
      scrollRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
      const newPosition = Math.min(scrollPosition + 150, maxScroll);
      setScrollPosition(newPosition);
      scrollRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      setScrollPosition(scrollRef.current.scrollLeft);
      setMaxScroll(scrollRef.current.scrollWidth - scrollRef.current.clientWidth);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      // Initialize scroll position and max scroll on mount
      setScrollPosition(container.scrollLeft);
      setMaxScroll(container.scrollWidth - container.clientWidth);

      // Add scroll event listener
      container.addEventListener("scroll", handleScroll);

      // Force a recalculation after a short delay to ensure DOM is fully rendered
      const timer = setTimeout(() => {
        setScrollPosition(container.scrollLeft);
        setMaxScroll(container.scrollWidth - container.clientWidth);
      }, 100);
      
      return () => {
        container.removeEventListener("scroll", handleScroll);
        clearTimeout(timer);
      };
    }
  }, []);

  return (
    <div className="mb-4">
      <div className="d-flex align-items-center justify-content-between position-relative">
        <div
          className="d-none d-md-flex align-items-center position-relative w-100"
          style={{ overflow: "visible" }}
        >
          <button
            onClick={scrollLeft}
            style={{
              background: "#8C956B",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: scrollPosition === 0 ? "not-allowed" : "pointer",
              opacity: scrollPosition === 0 ? 0.5 : 1,
              zIndex: 1000,
              position: "absolute",
              left: "0",
              top: "50%",
              transform: "translateY(-50%)",
              flexShrink: 0,
            }}
            disabled={scrollPosition === 0}
          >
            <FaChevronLeft size={20} />
          </button>

          <div
            ref={scrollRef}
            className="d-flex align-items-center gap-2 flex-nowrap"
            style={{
              overflowX: "auto",
              scrollBehavior: "smooth",
              whiteSpace: "nowrap",
              width: "calc(100% - 90px)",
              margin: "0 45px",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`theme-btn ${activeTab === tab.name ? "btn-style-one" : "btn-style-three"}`}
                style={{ flexShrink: 0 }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={scrollRight}
            style={{
              background: "#8C956B",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: scrollPosition >= maxScroll ? "not-allowed" : "pointer",
              opacity: scrollPosition >= maxScroll ? 0.5 : 1,
              zIndex: 1000,
              position: "absolute",
              right: "0",
              top: "50%",
              transform: "translateY(-50%)",
              flexShrink: 0,
            }}
            disabled={scrollPosition >= maxScroll}
          >
            <FaChevronRight size={20} />
          </button>
        </div>

        <div className="d-md-none w-100">
          <select
            className="form-select"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            {tabs.map((tab) => (
              <option key={tab.name} value={tab.name}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProfileTabs;