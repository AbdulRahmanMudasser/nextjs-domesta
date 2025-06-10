'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Image from "next/image";
import WsPageOuter from "@/templates/layouts/ws-page-outer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faUser,
  faUnlock,
  faGlobe,
  faGavel,
  faBriefcase,
  faFlag,
} from "@fortawesome/free-solid-svg-icons";
import agentData from "@/data/agent-profile";

const useAuth = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return { isAuthenticated };
};

const AgentSingleProfile = ({ params }) => {
  const id = params.id;
  const agent = agentData.find((item) => String(item.id) === id);
  const primaryColor = "rgb(140, 149, 107)";
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Helper to extract nested key values
  const findKeyValue = (keys, keyName, field, fallback = "") => {
    try {
      const keyObj = keys?.find((k) => k.key === keyName);
      const fieldObj = keyObj?.value?.find((v) => v.key === field);
      return fieldObj?.value || fallback;
    } catch (error) {
      return fallback;
    }
  };

  // Helper to get all key-value pairs for a key
  const getKeyFields = (keys, keyName) => {
    try {
      const keyObj = keys?.find((k) => k.key === keyName);
      return keyObj?.value || [];
    } catch (error) {
      return [];
    }
  };

  // Helper to capitalize and format keys for display
  const formatKey = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .trim();
  };

  // Helper to handle contact unlock for non-authenticated users
  const handleUnlockContacts = () => {
    if (!isAuthenticated) {
      document.getElementById("loginPopupModal")?.click();
    }
  };

  // Helper to handle contact me button
  const handleContactMe = () => {
    if (!isAuthenticated) {
      document.getElementById("loginPopupModal")?.click();
    } else {
      router.push(`/contact-agent/${id}`);
    }
  };

  // Helper to handle view employers button
  const handleViewEmployers = () => {
    if (!isAuthenticated) {
      document.getElementById("loginPopupModal")?.click();
    } else {
      router.push(`/website/employees`);
    }
  };

  if (!agent) {
    return (
      <WsPageOuter>
        <section className="candidate-detail-section style-three">
          <div className="auto-container">
            <h4>Agency Not Found</h4>
            <p>No agency found with ID: {id}</p>
          </div>
        </section>
      </WsPageOuter>
    );
  }

  // Extract data for each section
  const agentProfileData = getKeyFields(agent.keys, "Agent Profile");
  const legalComplianceData = getKeyFields(agent.keys, "Legal Compliance");
  const servicesOfferingData = getKeyFields(agent.keys, "Services Offering");
  const nationality = findKeyValue(
    agent.keys,
    "Agent Profile",
    "country",
    "N/A"
  );

  return (
    <WsPageOuter>
      <section
        className="profile-header-section"
        style={{
          position: "relative",
          height: "150px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "#6E7A48",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url('/images/background/bg.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.7,
            zIndex: 1,
          }}
        ></div>
        <h1
          style={{
            fontSize: "28px",
            margin: "0",
            fontWeight: "600",
            zIndex: 2,
            position: "relative",
          }}
        >
          Agency -{" "}
          {findKeyValue(agent.keys, "Agent Profile", "name") ||
            agent.name || "N/A"}{" "}
          ({nationality}) In{" "}
          {findKeyValue(agent.keys, "Legal Compliance", "agencyType", "N/A")}
        </h1>
      </section>

      <section className="agent-detail-section style-three" style={{marginTop:"20px"}}>
        <div className="profile-container">
          <div className="left-column">
            <div className="profile-card">
              <div className="post-date">
                Posted Date:{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div className="profile-image">
                <Image
                  width={120}
                  height={120}
                  src={agent?.profilePic || "/images/profession.jpeg"}
                  alt={agent.name || "Agent"}
                />
              </div>
              <h2 className="profile-name">
                <FontAwesomeIcon
                  icon={faFlag}
                  style={{ marginRight: "8px", color: "#8C956B" }}
                />
                {findKeyValue(agent.keys, "Agent Profile", "name") ||
                  agent.name || "N/A"}
              </h2>
              <p className="profile-designation">
                {findKeyValue(
                  agent.keys,
                  "Legal Compliance",
                  "agencyType",
                  "N/A"
                )}{" "}
                In{" "}
                {findKeyValue(
                  agent.keys,
                  "Agent Profile",
                  "country",
                  "Unknown"
                )}
              </p>
              <button
                className="contact-me-btn"
                onClick={handleContactMe}
                {...(!isAuthenticated && {
                  "data-bs-toggle": "modal",
                  "data-bs-target": "#loginPopupModal",
                })}
              >
                Contact Me
              </button>
              <button
                className="view-employers-btn"
                onClick={handleViewEmployers}
                {...(!isAuthenticated && {
                  "data-bs-toggle": "modal",
                  "data-bs-target": "#loginPopupModal",
                })}
                style={{
                  textDecoration: 'underline',
                  color: primaryColor,
                  backgroundColor: 'transparent',
                  border: `1px solid ${primaryColor}`,
                  borderRadius:'6px',
                  padding: '8px 16px',
                  marginTop: '10px',
                  width: '100%',
                  cursor: 'pointer',
                 
                }}
               
              >
                View Employees
              </button>
            </div>

            <div className="profile-details">
              <h3 className="section-title">
                <FontAwesomeIcon icon={faUser} />
                Agency Profile
              </h3>
              {agentProfileData.length > 0 ? (
                agentProfileData.map((item, index) => (
                  <div key={index} className="detail-row">
                    <span className="detail-label">{formatKey(item.key)}</span>
                    <span className="detail-value">
                      {item.key === "agencyWebsite" ? (
                        <a
                          href={`https://${item.value}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.value || "N/A"}
                        </a>
                      ) : (
                        item.value || "N/A"
                      )}
                    </span>
                  </div>
                ))
              ) : (
                <p>No profile details available.</p>
              )}
            </div>
          </div>

          <div className="right-column">
            <div className="content-section">
              <h3 className="section-title">About Agency</h3>
              {agentProfileData.length > 0 ? (
                <p className="about-text">
                  {agentProfileData.map((item, index) => (
                    <span key={index}>
                      {formatKey(item.key)}: {item.value || "N/A"}
                      {index < agentProfileData.length - 1 ? " | " : ""}
                    </span>
                  ))}
                </p>
              ) : (
                <p>No details available.</p>
              )}
            </div>

            <div className="content-section">
              <h3 className="section-title">Contacts</h3>
              {isAuthenticated ? (
                <>
                  <div className="contact-item">
                    <div
                      className="contact-icon"
                      style={{ backgroundColor: primaryColor, color: "white" }}
                    >
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                    </div>
                    <div className="contact-info">
                      <div className="contact-label">Office Address</div>
                      <div className="contact-value">
                        {findKeyValue(
                          agent.keys,
                          "Agent Profile",
                          "officeAddress",
                          "N/A"
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div
                      className="contact-icon"
                      style={{ backgroundColor: primaryColor, color: "white" }}
                    >
                      <FontAwesomeIcon icon={faPhone} />
                    </div>
                    <div className="contact-info">
                      <div className="contact-label">Phone Number</div>
                      <div className="contact-value">
                        {findKeyValue(
                          agent.keys,
                          "Agent Profile",
                          "phoneNumber",
                          "N/A"
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div
                      className="contact-icon"
                      style={{ backgroundColor: primaryColor, color: "white" }}
                    >
                      <FontAwesomeIcon icon={faEnvelope} />
                    </div>
                    <div className="contact-info">
                      <div className="contact-label">Email</div>
                      <div className="contact-value">
                        {agent.email ||
                          findKeyValue(
                            agent.keys,
                            "Agent Profile",
                            "emailAddress",
                            "N/A"
                          )}
                      </div>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div
                      className="contact-icon"
                      style={{ backgroundColor: primaryColor, color: "white" }}
                    >
                      <FontAwesomeIcon icon={faGlobe} />
                    </div>
                    <div className="contact-info">
                      <div className="contact-label">Website</div>
                      <div className="contact-value">
                        <a
                          href={`https://${findKeyValue(
                            agent.keys,
                            "Agent Profile",
                            "agencyWebsite",
                            "N/A"
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {findKeyValue(
                            agent.keys,
                            "Agent Profile",
                            "agencyWebsite",
                            "N/A"
                          )}
                        </a>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="contact-item">
                    <div
                      className="contact-icon"
                      style={{ backgroundColor: primaryColor, color: "white" }}
                    >
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                    </div>
                    <div className="contact-info">
                      <div className="contact-label">Office Address</div>
                      <div className="contact-value">
                        {findKeyValue(
                          agent.keys,
                          "Agent Profile",
                          "officeAddress",
                          "N/A"
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div
                      className="contact-icon"
                      style={{ backgroundColor: primaryColor, color: "white" }}
                    >
                      <FontAwesomeIcon icon={faPhone} />
                    </div>
                    <div className="contact-info">
                      <div className="contact-label">Phone Number</div>
                      <div className="contact-value">*********</div>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div
                      className="contact-icon"
                      style={{ backgroundColor: primaryColor, color: "white" }}
                    >
                      <FontAwesomeIcon icon={faEnvelope} />
                    </div>
                    <div className="contact-info">
                      <div className="contact-label">Email</div>
                      <div className="contact-value">*********@gmail.com</div>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div
                      className="contact-icon"
                      style={{ backgroundColor: primaryColor, color: "white" }}
                    >
                      <FontAwesomeIcon icon={faGlobe} />
                    </div>
                    <div className="contact-info">
                      <div className="contact-label">Website</div>
                      <div className="contact-value">*********</div>
                    </div>
                  </div>
                  <button
                    className="unlock-contacts-btn"
                    onClick={handleUnlockContacts}
                    data-bs-toggle="modal"
                    data-bs-target="#loginPopupModal"
                  >
                    <FontAwesomeIcon icon={faUnlock} />
                    Unlock Contacts
                  </button>
                </>
              )}
            </div>

            <div className="profile-details">
              <h3 className="section-title">
                <FontAwesomeIcon icon={faGavel} />
                Legal Compliance
              </h3>
              {legalComplianceData.length > 0 ? (
                legalComplianceData.map((item, index) => (
                  <div key={index} className="detail-row">
                    <span className="detail-label">{formatKey(item.key)}</span>
                    <span className="detail-value">{item.value || "N/A"}</span>
                  </div>
                ))
              ) : (
                <p>No legal compliance data available.</p>
              )}
            </div>

            <div className="profile-details">
              <h3 className="section-title">
                <FontAwesomeIcon icon={faBriefcase} />
                Services Offering
              </h3>
              {servicesOfferingData.length > 0 ? (
                servicesOfferingData.map((item, index) => (
                  <div key={index} className="detail-row">
                    <span className="detail-label">{formatKey(item.key)}</span>
                    <span className="detail-value">
                      {Array.isArray(item.value)
                        ? item.value.join(", ")
                        : item.value || "N/A"}
                    </span>
                  </div>
                ))
              ) : (
                <p>No services offering data available.</p>
              )}
            </div>

            <div className="verified-badge">
              <FontAwesomeIcon icon={faUser} />
              This profile has been created and verified by Team
            </div>
          </div>
        </div>
      </section>
    </WsPageOuter>
  );
};

export default AgentSingleProfile;