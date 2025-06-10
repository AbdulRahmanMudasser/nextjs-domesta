"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import employeeProfile from "@/data/employee-profile";
import Image from "next/image";
import WsPageOuter from "@/templates/layouts/ws-page-outer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faPhone,
  faWhatsapp,
  faEnvelope,
  faMapMarkerAlt,
  faUser,
  faBook,
  faUnlock,
  faFileAlt,
  faClipboardList,
  faCalendarCheck,
  faGlobe,
  faPassport,
  faFlag,
} from "@fortawesome/free-solid-svg-icons";

// Mock authentication state (replace with actual auth logic if needed)
const useAuth = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return { isAuthenticated };
};

const CandidateSingleDynamicV3 = ({ params }) => {
  const id = params.id;
  const candidate = employeeProfile.find((item) => String(item.id) === id);
  const primaryColor = "rgb(140, 149, 107)";
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // State for the dropdowns
  const [isWorkExpOpen, setIsWorkExpOpen] = useState({});
  const [isEmpDetailsOpen, setIsEmpDetailsOpen] = useState(false);
  const [isUploadDocOpen, setIsUploadDocOpen] = useState({});

  // Helper to toggle the dropdown
  const toggleDropdown = (setter, key) => {
    setter((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Helper to determine image source
  const getImageSrc = () => {
    return candidate?.profilePic || "/images/profession.jpeg";
  };

  // Helper to handle contact unlock for non-authenticated users
  const handleUnlockContacts = () => {
    if (!isAuthenticated) {
      // Trigger Bootstrap modal
      document.getElementById("loginPopupModal")?.click();
    }
  };

  // Helper to handle contact me button
  const handleContactMe = () => {
    if (!isAuthenticated) {
      // Trigger Bootstrap modal
      document.getElementById("loginPopupModal")?.click();
    } else {
      // Optionally redirect to a contact form or action
      router.push(`/contact-candidate/${id}`);
    }
  };

  // Helper to extract nested key values
  const findKeyValue = (keys, keyName, field, fallback = "") => {
    try {
      const keyObj = keys?.find((k) => k.key === keyName);
      const fieldObj = Array.isArray(keyObj?.value)
        ? keyObj.value.find((v) => v.key === field)
        : keyObj?.value?.value?.find((v) => v.key === field);
      return fieldObj?.value || fallback;
    } catch (error) {
      return fallback;
    }
  };

  // Helper to get all key-value pairs for a section
  const getKeyFields = (keys, keyName) => {
    try {
      const keyObj = keys?.find((k) => k.key === keyName);
      if (!keyObj || !keyObj.value) {
        console.warn(`No valid data found for ${keyName}`);
        return [];
      }

      // For other sections, return the value array directly
      if (!Array.isArray(keyObj.value)) {
        console.warn(`Expected array for ${keyName}, got:`, keyObj.value);
        return [];
      }
      return keyObj.value.filter(
        (field) => field.key && field.value !== undefined
      );
    } catch (error) {
      console.error(`Error processing ${keyName} fields:`, error);
      return [];
    }
  };

  // Helper to get work experience data
  const getWorkExperienceData = (keys) => {
    try {
      const keyObj = keys?.find((k) => k.key === "workExperience");
      if (!keyObj || !keyObj.value || !Array.isArray(keyObj.value)) {
        return [];
      }
      return keyObj.value;
    } catch (error) {
      console.error("Error processing work experience:", error);
      return [];
    }
  };

  // Helper to get upload document data
  const getUploadDocumentData = (keys) => {
    try {
      const keyObj = keys?.find((k) => k.key === "uploadDocument");
      if (!keyObj || !keyObj.value || !Array.isArray(keyObj.value)) {
        return [];
      }
      return keyObj.value;
    } catch (error) {
      console.error("Error processing upload documents:", error);
      return [];
    }
  };

  // Helper to get visa status data
  const getVisaStatusData = (keys) => {
    try {
      const keyObj = keys?.find((k) => k.key === "visaStatus");
      if (!keyObj || !keyObj.value) {
        console.warn("No valid visa status data found");
        return null;
      }
      // Assuming visa status is a single value (e.g., "Self Sponsored")
      return keyObj.value;
    } catch (error) {
      console.error("Error processing visa status:", error);
      return null;
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

  if (!candidate) {
    return (
      <WsPageOuter>
        <section className="candidate-detail-section">
          <div className="auto-container">
            <h4>Candidate Not Found</h4>
            <p>No candidate found with ID: {id}</p>
          </div>
        </section>
      </WsPageOuter>
    );
  }

  // Extract data for each section
  const profileData = getKeyFields(candidate.keys, "profile");
  const contactInfoData = getKeyFields(candidate.keys, "contactInformation");
  const workExperienceData = getWorkExperienceData(candidate.keys);
  const employmentDetailsData = getKeyFields(
    candidate.keys,
    "employmentDetails"
  );
  const uploadDocumentData = getUploadDocumentData(candidate.keys);
  const applicationManagementData = getKeyFields(
    candidate.keys,
    "applicationManagement"
  );
  const interviewManagementData = getKeyFields(
    candidate.keys,
    "interviewManagement"
  );
  const socialNetworksData = getKeyFields(candidate.keys, "socialNetworks");
  const visaStatusData = getVisaStatusData(candidate.keys);
  const nationality = findKeyValue(
    candidate.keys,
    "profile",
    "nationality",
    "N/A"
  );
  const fullName = findKeyValue(
    candidate.keys,
    "profile",
    "fullName",
    candidate.name || "N/A"
  );
  const role = findKeyValue(candidate.keys, "profile", "role", "N/A");
  const city = findKeyValue(
    candidate.keys,
    "contactInformation",
    "city",
    "Unknown"
  );

  return (
    <WsPageOuter>
      {/* Header Section with Background Image and Dynamic Text */}
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
          Profile - {fullName} {nationality} {role} In {city}
        </h1>
      </section>

      <section className="candidate-detail-section">
        <div className="profile-container">
          {/* Left Column */}
          <div className="left-column">
            {/* Profile Card */}
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
                  src={getImageSrc()}
                  alt={candidate.name || "Candidate"}
                />
              </div>
              <h2 className="profile-name">
                <FontAwesomeIcon
                  icon={faFlag}
                  style={{ marginRight: "8px", color: "#8C956B" }}
                />
                {fullName}
              </h2>
              <p className="profile-designation">
                {role} In {city}
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

            {/* Profile Details */}
            <div className="profile-details">
              <h3 className="section-title">
                <FontAwesomeIcon icon={faUser} />
                Profile Details
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

            {/* Employment Details */}
            <div className="employment-details">
              <h3 className="section-title">
                <FontAwesomeIcon icon={faBook} />
                Employment Details
              </h3>
              {employmentDetailsData.length > 0 ? (
                <div className="experience-item">
                  <div
                    className="experience-header"
                    onClick={() =>
                      toggleDropdown(setIsEmpDetailsOpen, "empDetails")
                    }
                  >
                    <span className="experience-title">Employment Details</span>
                    <FontAwesomeIcon
                      icon={
                        isEmpDetailsOpen["empDetails"]
                          ? faChevronUp
                          : faChevronDown
                      }
                    />
                  </div>
                  {isEmpDetailsOpen["empDetails"] && (
                    <div className="experience-details">
                      {employmentDetailsData.map((item, index) => (
                        <div key={index} className="experience-info">
                          <strong>{formatKey(item.key)}</strong>
                          <p>{item.value || "N/A"}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p>No employment details available.</p>
              )}
            </div>

            {/* Employment History */}
            <div className="employment-history">
              <h3 className="section-title">
                <FontAwesomeIcon icon={faBook} />
                Employment History
              </h3>
              {workExperienceData.length > 0 ? (
                workExperienceData.map((exp, index) => (
                  <div key={index} className="experience-item">
                    <div
                      className="experience-header"
                      onClick={() => toggleDropdown(setIsWorkExpOpen, index)}
                    >
                      <span className="experience-title">
                        {exp.value.find((v) => v.key === "employerName")
                          ?.value || `Work Experience ${index + 1}`}{" "}
                        -{" "}
                        {exp.value.find((v) => v.key === "designation")
                          ?.value || "Position"}
                      </span>
                      <FontAwesomeIcon
                        icon={
                          isWorkExpOpen[index] ? faChevronUp : faChevronDown
                        }
                      />
                    </div>
                    {isWorkExpOpen[index] && (
                      <div className="experience-details">
                        {exp.value.map((item, itemIndex) => (
                          <div key={itemIndex} className="experience-info">
                            <strong>{formatKey(item.key)}</strong>
                            <p>{item.value || "N/A"}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>No work experience available.</p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="right-column">
            {/* About Me */}
            <div className="content-section">
              <h3 className="section-title">About Me</h3>
              {profileData.length > 0 ? (
                <p className="about-text">
                  {profileData.map((item, index) => (
                    <span key={index}>
                      {formatKey(item.key)}: {item.value || "N/A"}
                      {index < profileData.length - 1 ? " | " : ""}
                    </span>
                  ))}
                </p>
              ) : (
                <p>No details available.</p>
              )}
            </div>

            {/* Contacts */}
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
                      <div className="contact-label">Current location</div>
                      <div className="contact-value">
                        {findKeyValue(
                          candidate.keys,
                          "contactInformation",
                          "current_location",
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
                      <div className="contact-label">Calling number</div>
                      <div className="contact-value">
                        {findKeyValue(
                          candidate.keys,
                          "contactInformation",
                          "dialCode",
                          ""
                        )}{" "}
                        {findKeyValue(
                          candidate.keys,
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
                      <FontAwesomeIcon icon={faWhatsapp} />
                    </div>
                    <div className="contact-info">
                      <div className="contact-label">WhatsApp number</div>
                      <div className="contact-value">
                        {findKeyValue(
                          candidate.keys,
                          "contactInformation",
                          "dialCode",
                          ""
                        )}{" "}
                        {findKeyValue(
                          candidate.keys,
                          "contactInformation",
                          "whatsapp_number",
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
                        {candidate.email ||
                          findKeyValue(
                            candidate.keys,
                            "profile",
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
                      <div className="contact-label">Current location</div>
                      <div className="contact-value">
                        {findKeyValue(
                          candidate.keys,
                          "contactInformation",
                          "current_location",
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
                      <div className="contact-label">Calling number</div>
                      <div className="contact-value">*********</div>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div
                      className="contact-icon"
                      style={{ backgroundColor: primaryColor, color: "white" }}
                    >
                      <FontAwesomeIcon icon={faWhatsapp} />
                    </div>
                    <div className="contact-info">
                      <div className="contact-label">WhatsApp number</div>
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

            {/* Visa Status */}
            <div className="content-section">
              <h3 className="section-title">
                <FontAwesomeIcon icon={faPassport} />
                Visa Status
              </h3>
              {visaStatusData ? (
                <div className="visa-status-item">
                  <div className="contact-info">
                    <div className="contact-label">Status</div>
                    <div className="contact-value">{visaStatusData}</div>
                  </div>
                </div>
              ) : (
                <p>No visa status available.</p>
              )}
            </div>

            {/* Upload Document */}
            <div className="upload-documents">
              <h3 className="section-title">
                <FontAwesomeIcon icon={faFileAlt} />
                Upload Document
              </h3>
              {uploadDocumentData.length > 0 ? (
                uploadDocumentData.map((doc, index) => (
                  <div key={index} className="experience-item">
                    <div
                      className="experience-header"
                      onClick={() => toggleDropdown(setIsUploadDocOpen, index)}
                    >
                      <span className="experience-title">
                        {doc.value.find((v) => v.key === "category")?.value ||
                          `Document ${index + 1}`}
                      </span>
                      <FontAwesomeIcon
                        icon={
                          isUploadDocOpen[index] ? faChevronUp : faChevronDown
                        }
                      />
                    </div>
                    {isUploadDocOpen[index] && (
                      <div className="experience-details">
                        {doc.value.map((item, itemIndex) => (
                          <div key={itemIndex} className="experience-info">
                            <strong>{formatKey(item.key)}</strong>
                            {item.key === "file_url" ? (
                              <p>
                                <a
                                  href={item.value}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {item.value || "N/A"}
                                </a>
                              </p>
                            ) : (
                              <p>{item.value || "N/A"}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>No documents available.</p>
              )}
            </div>

            {/* Application Management */}
            <div className="profile-details">
              <h3 className="section-title">
                <FontAwesomeIcon icon={faClipboardList} />
                Application Management
              </h3>
              {applicationManagementData.length > 0 ? (
                applicationManagementData.map((item, index) => (
                  <div key={index} className="detail-row">
                    <span className="detail-label">{formatKey(item.key)}</span>
                    <span className="detail-value">{item.value || "N/A"}</span>
                  </div>
                ))
              ) : (
                <p>No application data available.</p>
              )}
            </div>

            {/* Interview Management */}
            <div className="profile-details">
              <h3 className="section-title">
                <FontAwesomeIcon icon={faCalendarCheck} />
                Interview Management
              </h3>
              {interviewManagementData.length > 0 ? (
                interviewManagementData.map((item, index) => (
                  <div key={index} className="detail-row">
                    <span className="detail-label">{formatKey(item.key)}</span>
                    <span className="detail-value">{item.value || "N/A"}</span>
                  </div>
                ))
              ) : (
                <p>No interview data available.</p>
              )}
            </div>

            {/* Social Network */}
            <div className="profile-details">
              <h3 className="section-title">
                <FontAwesomeIcon icon={faGlobe} />
                Social Network
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

            {/* Hire Button */}
            <button className="hire-now-btn">Hire Now</button>

            {/* Verified Badge */}
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

export default CandidateSingleDynamicV3;
