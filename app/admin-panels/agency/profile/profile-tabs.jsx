import React from "react";

const ProfileTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { name: "MyProfile", label: "Agency Profile" },
    { name: "LegalCompliance", label: "Legal & Compliance" },
    { name: "ServicesOffering", label: "Services Offering" },
  ];
  return (
    <div className="mb-4">
      <div className="d-flex align-items-center justify-content-between position-relative">
        <div
          className="d-none d-md-flex align-items-center gap-2 flex-nowrap w-100"
          style={{ overflow: "visible" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`theme-btn ${
                activeTab === tab.name ? "btn-style-one" : "btn-style-three"
              }`}
              style={{ flexShrink: 0 }}
            >
              {tab.label}
            </button>
          ))}
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
