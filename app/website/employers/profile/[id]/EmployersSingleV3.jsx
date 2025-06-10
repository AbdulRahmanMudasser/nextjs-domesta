"use client";

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
  faHome,
  faLanguage,
  faBriefcase,
  faClock,
  faCalendarCheck,
  faFlag,
} from "@fortawesome/free-solid-svg-icons";
import employerProfile from "@/data/employer-profile";

const useAuth = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return { isAuthenticated };
};

const EmployersSingleV3 = ({ params }) => {
  const id = params.id;
  const employer = employerProfile.find((item) => String(item.id) === id);
  const primaryColor = "rgb(140, 149, 107)";
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Helper to extract nested key values
  const findKeyValue = (keys, keyName, field, fallback = "N/A") => {
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
      router.push(`/contact-employer/${id}`);
    }
  };

  if (!employer) {
    return (
      <WsPageOuter>
        <section className="candidate-detail-section">
          <div className="auto-container">
            <h4>Employer Not Found</h4>
            <p>No employer found with ID: {id}</p>
          </div>
        </section>
      </WsPageOuter>
    );
  }

  // Extract data for each section
  const profileData = getKeyFields(employer.keys, "profile");
  const residenceInfoData = getKeyFields(employer.keys, "residenceInformation");
  const contactInfoData = getKeyFields(employer.keys, "contactInformation");
  const culturalFitData = getKeyFields(
    employer.keys,
    "communicationAndCulturalFit"
  );
  const jobPreferenceData = getKeyFields(employer.keys, "jobPreference");
  const workScheduleData = getKeyFields(employer.keys, "workSchedule");
  const interviewPreferenceData = getKeyFields(
    employer.keys,
    "interviewPreference"
  );
  const socialNetworksData = getKeyFields(employer.keys, "socialNetworks");
  const nationality = findKeyValue(
    employer.keys,
    "profile",
    "nationality",
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
          Employer - {employer.name} ({nationality}) In{" "}
          {employer.location || "Unknown"}
        </h1>
      </section>

      <section
        className="candidate-detail-section"
        
      >
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
                  src={employer?.img || "/images/company/fallback.png"}
                  alt={employer.name || "Employer"}
                  onError={(e) => {
                    e.target.src = "/images/company/fallback.png";
                  }}
                />
              </div>
              <h2 className="profile-name">
                <FontAwesomeIcon
                  icon={faFlag}
                  style={{ marginRight: "8px", color: "#8C956B" }}
                />
                {employer.name || "N/A"}
              </h2>
              <p className="profile-designation">
                Employer In {employer.location || "Unknown"}
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
            </div>

            <div className="profile-details">
              <h3 className="section-title">
                <FontAwesomeIcon icon={faUser} />
                Employer Profile
              </h3>
              {profileData.length > 0 ? (
                profileData.map((item, index) => (
                  <div key={index} className="detail-row">
                    <span className="detail-label">{formatKey(item.key)}</span>
                    <span className="detail-value">{item.value || "N/A"}</span>
                  </div>
                ))
              ) : (
                <p>No profile details available.</p>
              )}
            </div>
          </div>

          <div className="right-column">
            <div className="content-section">
              <h3 className="section-title">About Employer</h3>
              {profileData.length > 0 ? (
                <p className="about-text">
                  {profileData.map((item, index) => (
                    <span key={index}>
                      {formatKey(item.key)}: {item.value || "N/A"}
                      {index < profileData.length - 1 ? " | " : ""}
                    </span>
                  ))}
                  {employer.jobDetails && (
                    <span> | Job Details: {employer.jobDetails}</span>
                  )}
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
                      <div className="contact-label">Location</div>
                      <div className="contact-value">
                        {employer.location || "N/A"}
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
                          employer.keys,
                          "contactInformation",
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
                      <FontAwesomeIcon icon={faPhone} />
                    </div>
                    <div className="contact-info">
                      <div className="contact-label">WhatsApp Number</div>
                      <div className="contact-value">
                        {findKeyValue(
                          employer.keys,
                          "contactInformation",
                          "whatsappNumber",
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
                        {findKeyValue(
                          employer.keys,
                          "contactInformation",
                          "email",
                          "N/A"
                        )}
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
                      <div className="contact-label">Location</div>
                      <div className="contact-value">
                        {employer.location || "N/A"}
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
                      <FontAwesomeIcon icon={faPhone} />
                    </div>
                    <div className="contact-info">
                      <div className="contact-label">WhatsApp Number</div>
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
                <FontAwesomeIcon icon={faHome} />
                Residence Information
              </h3>
              {residenceInfoData.length > 0 ? (
                residenceInfoData.map((item, index) => (
                  <div key={index} className="detail-row">
                    <span className="detail-label">{formatKey(item.key)}</span>
                    <span className="detail-value">{item.value || "N/A"}</span>
                  </div>
                ))
              ) : (
                <p>No residence information available.</p>
              )}
            </div>

            <div className="profile-details">
              <h3 className="section-title">
                <FontAwesomeIcon icon={faLanguage} />
                Communication And Cultural Fit
              </h3>
              {culturalFitData.length > 0 ? (
                culturalFitData.map((item, index) => (
                  <div key={index} className="detail-row">
                    <span className="detail-label">{formatKey(item.key)}</span>
                    <span className="detail-value">{item.value || "N/A"}</span>
                  </div>
                ))
              ) : (
                <p>No communication and cultural fit data available.</p>
              )}
            </div>

            <div className="profile-details">
              <h3 className="section-title">
                <FontAwesomeIcon icon={faBriefcase} />
                Job Preference
              </h3>
              {jobPreferenceData.length > 0 ? (
                jobPreferenceData.map((item, index) => (
                  <div key={index} className="detail-row">
                    <span className="detail-label">{formatKey(item.key)}</span>
                    <span className="detail-value">
                      {item.key === "specificTasks" &&
                      typeof item.value === "string"
                        ? Object.entries(JSON.parse(item.value))
                            .filter(([_, value]) =>
                              Array.isArray(value) ? value.length > 0 : value
                            )
                            .map(
                              ([key, value]) =>
                                `${formatKey(key)}: ${
                                  Array.isArray(value)
                                    ? value.join(", ")
                                    : value
                                }`
                            )
                            .join(" | ")
                        : item.value || "N/A"}
                    </span>
                  </div>
                ))
              ) : (
                <p>No job preference data available.</p>
              )}
            </div>

            <div className="profile-details">
              <h3 className="section-title">
                <FontAwesomeIcon icon={faClock} />
                Work Schedule
              </h3>
              {workScheduleData.length > 0 ? (
                workScheduleData.map((item, index) => (
                  <div key={index} className="detail-row">
                    <span className="detail-label">{formatKey(item.key)}</span>
                    <span className="detail-value">{item.value || "N/A"}</span>
                  </div>
                ))
              ) : (
                <p>No work schedule data available.</p>
              )}
            </div>

            <div className="profile-details">
              <h3 className="section-title">
                <FontAwesomeIcon icon={faCalendarCheck} />
                Interview Preference
              </h3>
              {interviewPreferenceData.length > 0 ? (
                interviewPreferenceData.map((item, index) => (
                  <div key={index} className="detail-row">
                    <span className="detail-label">{formatKey(item.key)}</span>
                    <span className="detail-value">{item.value || "N/A"}</span>
                  </div>
                ))
              ) : (
                <p>No interview preference data available.</p>
              )}
            </div>

            <div className="profile-details">
              <h3 className="section-title">
                <FontAwesomeIcon icon={faGlobe} />
                Social Networks
              </h3>
              {socialNetworksData.length > 0 ? (
                socialNetworksData.map((item, index) => (
                  <div key={index} className="detail-row">
                    <span className="detail-label">{formatKey(item.key)}</span>
                    <span className="detail-value">
                      <a
                        href={item.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ cursor: "pointer" }}
                      >
                        {item.value || "N/A"}
                      </a>
                    </span>
                  </div>
                ))
              ) : (
                <p>No social network links available.</p>
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

export default EmployersSingleV3;
