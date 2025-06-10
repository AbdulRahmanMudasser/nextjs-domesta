'use client'

import Link from "next/link";
import Slider from "react-slick";
import employeeProfile from "@/data/employee-profile";
import Image from "next/image";
import { useSelector } from "react-redux";

// Mock authentication state (replace with actual auth logic)
const useAuth = () => {
  const { isAuthenticated } = useSelector((state) => state.auth || {});
  return { isAuthenticated };
};

const Candidates = () => {
  const { isAuthenticated } = useAuth();

  const settings = {
    dots: true,
    speed: 1400,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // Ensure employeeProfile is an array, fallback to empty array if not
  const candidates = Array.isArray(employeeProfile) ? employeeProfile : [];

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

  // Helper to determine image source
  const getImageSrc = (candidate) => {
    if (candidate?.profilePic) {
      return candidate.profilePic;
    }
    if (candidate?.keys) {
      const profileImage = findKeyValue(candidate.keys, "profile", "profileImage", "");
      if (profileImage) return `/images/${profileImage}`;
    }
    return "/images/demo-profile.jpg";
  };

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  // Helper to get posting date (using DOB or current date)
  const getPostingDate = (candidate) => {
    const dob = findKeyValue(candidate.keys, "profile", "dob", "");
    return dob ? formatDate(dob) : formatDate();
  };

  // Helper to get country name
  const getCountryName = (candidate) => {
    return findKeyValue(candidate.keys, "contactInformation", "country", "India");
  };

  // Helper to get experience text
  const getExperienceText = (candidate) => {
    const experience = findKeyValue(candidate.keys, "employmentDetails", "experience", "0");
    return `${experience} Years+ experience`;
  };

  // Helper to get verification status
  const isVerified = (candidate) => {
    const status = findKeyValue(candidate.keys, "employmentDetails", "verificationStatus", "");
    return status.toLowerCase() === "verified";
  };

  // Helper to get salary range
  const getSalaryRange = (candidate) => {
    const salary = findKeyValue(candidate.keys, "employmentDetails", "salary", "0");
    const baseSalary = parseInt(salary) || 1000;
    const minSalary = baseSalary;
    const maxSalary = baseSalary + 500;
    return `${minSalary}-${maxSalary} AED`;
  };

  // Helper to get desired job type
  const getDesiredJob = (candidate) => {
    const employmentPreference = findKeyValue(candidate.keys, "employmentDetails", "employmentPreference", "");
    const category = findKeyValue(candidate.keys, "employmentDetails", "employeeCategory", "");
    
    if (employmentPreference.toLowerCase().includes("live")) {
      return employmentPreference;
    } else if (category) {
      return category;
    } else {
      return "Full Time";
    }
  };

  return (
    <Slider {...settings} arrows={false}>
      {candidates.slice(0, 12).map((candidate) => (
        <div key={candidate.id} className="col-12 col-md-6 col-lg-4">
          <div className="card h-100 mx-2">
            <figure className="mb-0" style={{ height: '200px', overflow: 'hidden' }}>
              <Image
                width={400}
                height={200}
                src={getImageSrc(candidate)}
                alt={candidate.name || "Candidate"}
                onError={(e) => { e.target.src = "/images/demo-profile.jpg"; }}
                className="img-fluid"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '10px 10px 0 0'
                }}
              />
            </figure>
            <div className="card-body text-center">
              <h4 className="card-title mb-1" style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                {candidate.name || findKeyValue(candidate.keys, "profile", "fullName", "N/A")}
              </h4>
              <span className="d-block mb-2" style={{ fontSize: '16px', color: '#666' }}>
                {findKeyValue(candidate.keys, "profile", "role", "Professional")} {findKeyValue(candidate.keys, "contactInformation", "city", "")}
              </span>
              <div className="d-flex justify-content-between align-items-center mb-2" style={{ fontSize: '11px', color: '#666', fontWeight: '600' }}>
                <span>Posted on {getPostingDate(candidate)}</span>
                <span className="d-flex align-items-center">
                  <i className="flaticon-map-locator me-1"></i>
                  {findKeyValue(candidate.keys, "contactInformation", "city", "Unknown")} ({getCountryName(candidate)})
                </span>
              </div>
              <div className="d-flex justify-content-between gap-2 mb-2">
                <span style={{
                  backgroundColor: 'white',
                  border: '1px solid #6E7A48',
                  color: '#6E7A48',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                }}>
                  {getExperienceText(candidate)}
                </span>
                {isVerified(candidate) && (
                  <span style={{
                    backgroundColor: '#6E7A48',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: '500',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                    Verified
                  </span>
                )}
              </div>
              <div style={{ borderBottom: '1px solid #6E7A48' }} className="mb-1 mt-1"></div>
              <div className="d-flex justify-content-between" style={{ fontSize: '14px', color: '#333' }}>
                <span>Salary: </span>
                <span style={{ marginRight: '20px' }}>Job Type: </span>
              </div>
              <div className="d-flex justify-content-between" style={{ fontSize: '14px', color: '#333', fontWeight: '600' }}>
                <span>{getSalaryRange(candidate)}</span>
                <span>{getDesiredJob(candidate)}</span>
              </div>
              <div style={{ borderBottom: '1px solid #6E7A48' }} className="mb-2 mt-1"></div>
              <div className="d-flex justify-content-between">
                <Link
                  href={`/website/employees/profile/${candidate.id}`}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #6E7A48',
                    color: '#6E7A48',
                    padding: '6px 20px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    display: 'inline-block',
                  }}
                >
                  View Profile
                </Link>
                <Link
                  href={isAuthenticated ? `/website/employees/profile/${candidate.id}` : '/login'}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #6E7A48',
                    color: '#6E7A48',
                    padding: '6px 20px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    display: 'inline-block',
                    cursor: 'pointer',
                  }}
                  {...(!isAuthenticated && {
                    "data-bs-toggle": "modal",
                    "data-bs-target": "#loginPopupModal",
                  })}
                >
                  Contact Me
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default Candidates;