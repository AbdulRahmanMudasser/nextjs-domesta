
'use client'

import Link from "next/link";
import ListingShowing from "@/components/ListingShowing";
import employeeProfile from "@/data/employee-profile";
import { useDispatch, useSelector } from "react-redux";
import { 
    addCandidateGender,
    addCategory,
    addKeyword,
    addLocation,
    addPerPage,
    addSort,
    clearExperienceF,
    clearQualificationF, 
} from "@/features/filter/candidateFilterSlice";
import {
  clearExperience,
  clearQualification,
} from "@/features/candidate/candidateSlice";
import Image from "next/image";

// Mock authentication state (replace with actual auth logic)
const useAuth = () => {
  const { isAuthenticated } = useSelector((state) => state.auth || {});
  return { isAuthenticated };
};

const FilterTopBox = () => {
  const {
    keyword,
    location,
    category,
    candidateGender,
    experiences,
    qualifications,
    sort,
    perPage,
  } = useSelector((state) => state.candidateFilter) || {};

  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();

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

  // Filters
  const keywordFilter = (item) => 
    keyword ? item?.name?.toLowerCase().includes(keyword.toLowerCase()) : true;

  const locationFilter = (item) => 
    location ? findKeyValue(item.keys, "contactInformation", "city", "").toLowerCase().includes(location.toLowerCase()) : true;

  const categoryFilter = (item) => 
    category ? findKeyValue(item.keys, "employmentDetails", "employeeCategory", "").toLowerCase() === category.toLowerCase() : true;

  const genderFilter = (item) => 
    candidateGender ? findKeyValue(item.keys, "profile", "gender", "").toLowerCase() === candidateGender.toLowerCase() : true;

  const experienceFilter = (item) => 
    experiences?.length ? experiences.includes(findKeyValue(item.keys, "employmentDetails", "experience", "").toLowerCase().replace(" ", "-")) : true;

  const qualificationFilter = (item) => 
    qualifications?.length ? qualifications.some((q) => findKeyValue(item.keys, "employmentDetails", "skills", "").toLowerCase().includes(q.toLowerCase())) : true;

  const sortFilter = (a, b) => sort === "des" ? b.id - a.id : a.id - b.id;

  const content = employeeProfile
    ?.slice(perPage?.start || 0, perPage?.end || 10)
    ?.filter(keywordFilter)
    ?.filter(locationFilter)
    ?.filter(categoryFilter)
    ?.filter(genderFilter)
    ?.filter(experienceFilter)
    ?.filter(qualificationFilter)
    ?.sort(sortFilter)
    ?.map((candidate) => (
      <div key={candidate.id} className="col-12 col-md-6 col-lg-3 mb-4">
        <div className="card h-100">
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
            <div className="d-flex justify-content-between align-items-center mb-2" style={{ fontSize: '11px', color: '#666',fontWeight:'600' }}>
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
                color: ' #6E7A48',
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
                  // border: '1px solid #6E7A48',
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
            <div style={{borderBottom:'1px solid #6E7A48'}} className="mb-1 mt-1"></div>
            <div className="d-flex justify-content-between" style={{ fontSize: '14px', color: '#333' }}>
              <span>Salary: </span>
              <span style={{marginRight:'20px'}}>Job Type: </span>
            </div>
            <div className="d-flex justify-content-between " style={{ fontSize: '14px', color: '#333',fontWeight:'600' }}>
              <span>{getSalaryRange(candidate)}</span>
              <span>{getDesiredJob(candidate)}</span>
            </div>
            <div style={{borderBottom:'1px solid #6E7A48'}} className="mb-2 mt-1"></div>

            <div className="d-flex justify-content-between">
              <Link
                href={`/website/employees/profile/${candidate.id}`}
                className=""
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
    ));

  const sortHandler = (e) => dispatch(addSort(e.target.value));
  const perPageHandler = (e) => dispatch(addPerPage(JSON.parse(e.target.value)));
  const clearHandler = () => {
    dispatch(addKeyword(""));
    dispatch(addLocation(""));
    dispatch(addCategory(""));
    dispatch(addCandidateGender(""));
    dispatch(clearExperienceF());
    dispatch(clearExperience());
    dispatch(clearQualification());
    dispatch(clearQualificationF());
    dispatch(addSort(""));
    dispatch(addPerPage({ start: 0, end: 0 }));
  };

  return (
    <>
      <div className="ls-switcher">
        <div className="showing-result">
          <div className="show-1023">
            <button
              type="button"
              className="theme-btn toggle-filters"
              data-bs-toggle="offcanvas"
              data-bs-target="#filter-sidebar"
            >
              <span className="icon icon-filter"></span> Filter
            </button>
          </div>
          <div className="text">
            <strong>{content?.length || 0}</strong> Listings
          </div>
        </div>
        <div className="sort-by">
          {(keyword || location || category || candidateGender || experiences?.length || qualifications?.length || sort || perPage?.start !== 0 || perPage?.end !== 0) && (
            <button
              className="btn btn-danger text-nowrap me-2"
              style={{ minHeight: "45px", marginBottom: "15px" }}
              onClick={clearHandler}
            >
              Clear All
            </button>
          )}
          <select
            onChange={sortHandler}
            className="form-select"
            value={sort || ""}
          >
            <option value="">Sort by (default)</option>
            <option value="asc">Newest</option>
            <option value="des">Oldest</option>
          </select>
          <select
            className="form-select ms-3"
            onChange={perPageHandler}
            value={JSON.stringify(perPage || { start: 0, end: 0 })}
          >
            <option value={JSON.stringify({ start: 0, end: 0 })}>All</option>
            <option value={JSON.stringify({ start: 0, end: 15 })}>15 per page</option>
            <option value={JSON.stringify({ start: 0, end: 20 })}>20 per page</option>
            <option value={JSON.stringify({ start: 0, end: 25 })}>25 per page</option>
          </select>
        </div>
      </div>
      
      <div className="row">
        {content?.length ? content : <div className="col-12">No candidates found. Check data or clear filters.</div>}
      </div>
      
      <ListingShowing />
    </>
  );
};

export default FilterTopBox;
