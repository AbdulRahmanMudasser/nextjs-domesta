'use client'

import Link from "next/link";
import ListingShowing from "@/components/ListingShowing";
import employerProfile from "@/data/employer-profile";
import { useDispatch, useSelector } from "react-redux";
import {
  addCategory,
  addDestination,
  addFoundationDate,
  addKeyword,
  addLocation,
  addPerPage,
  addSort,
} from "../../../features/filter/employerFilterSlice";
import Image from "next/image";

const FilterTopBox = () => {
  const {
    keyword,
    location,
    destination,
    category,
    foundationDate,
    sort,
    perPage,
  } = useSelector((state) => state.employerFilter) || {};
  const dispatch = useDispatch();

  // keyword filter
  const keywordFilter = (item) =>
    keyword !== ""
      ? item?.name?.toLowerCase()?.includes(keyword?.toLowerCase()) && item
      : item;

  // location filter
  const locationFilter = (item) =>
    location !== ""
      ? item?.location?.toLowerCase()?.includes(location?.toLowerCase())
      : item;

  // destination filter
  const destinationFilter = (item) =>
    destination?.min && destination?.max && item?.destination
      ? item.destination.min >= destination.min &&
        item.destination.max <= destination.max
      : item;

  // category filter
  const categoryFilter = (item) =>
    category !== ""
      ? item?.category?.toLowerCase() === category?.toLowerCase()
      : item;

  // foundation date filter
  const foundationDataFilter = (item) =>
    foundationDate?.min && foundationDate?.max && item?.foundationDate
      ? item.foundationDate.min >= foundationDate.min &&
        item.foundationDate.max <= foundationDate.max
      : item;

  // sort filter
  const sortFilter = (a, b) =>
    sort === "des" ? (a.id > b.id ? -1 : 1) : a.id < b.id ? -1 : 1;

  const content = Array.isArray(employerProfile) && employerProfile.length > 0 ? (
    employerProfile
      ?.slice(perPage.start || 0, perPage.end || 20)
      ?.filter(keywordFilter)
      ?.filter(locationFilter)
      ?.filter(destinationFilter)
      ?.filter(categoryFilter)
      ?.filter(foundationDataFilter)
      ?.sort(sortFilter)
      ?.map((company) => (
        <div className="company-block-three" key={company.id}>
          <div className="inner-box">
            <div className="content">
              <div className="content-inner">
                <span className="company-logo">
                  <Image
                    width={50}
                    height={50}
                    src={company.img || "/images/company/fallback.png"}
                    alt="company brand"
                    onError={(e) => {
                      e.target.src = "/images/company/fallback.png";
                    }}
                  />
                </span>
                <h4>
                  <Link href={`/website/employers/profile/${company.id}`}>
                    {company.name || "Unnamed Company"}
                  </Link>
                </h4>
                <ul className="job-info">
                  <li>
                    <span className="icon flaticon-map-locator"></span>{" "}
                    {company.location || "Unknown Location"}
                  </li>
                  <li>
                    <span className="icon flaticon-briefcase"></span>{" "}
                    {company.jobType || "N/A"}
                  </li>
                </ul>
              </div>

              <ul className="job-other-info">
                {company.isFeatured ? (
                  <li className="privacy">Featured</li>
                ) : null}
                <li className="time">
                  Open Listings – {company.jobNumber || 0}
                </li>
              </ul>
            </div>

            <div className="text">{company.jobDetails || "No details available"}</div>

            <button className="bookmark-btn">
              <span className="flaticon-bookmark"></span>
            </button>
          </div>
        </div>
      ))
  ) : (
    <p className="text-muted">No companies available</p>
  );

  // per page handler
  const perPageHandler = (e) => {
    const pageData = JSON.parse(e.target.value);
    dispatch(addPerPage(pageData));
  };

  // sort handler
  const sortHandler = (e) => {
    dispatch(addSort(e.target.value));
  };

  // clear handler
  const clearAll = () => {
    dispatch(addKeyword(""));
    dispatch(addLocation(""));
    dispatch(addDestination({ min: 0, max: 100 }));
    dispatch(addCategory(""));
    dispatch(addFoundationDate({ min: 1900, max: 2028 }));
    dispatch(addSort(""));
    dispatch(addPerPage({ start: 0, end: 0 }));
  };

  return (
    <>
      <div className="ls-switcher">
        <div className="showing-result">
          <div className="text">
            <strong>
              {Array.isArray(content) ? content.length : 0} Listings
            </strong>
          </div>
        </div>
        {/* End showing-result */}

        <div className="sort-by">
          {keyword !== "" ||
          location !== "" ||
          destination.min !== 0 ||
          destination.max !== 100 ||
          category !== "" ||
          foundationDate.min !== 1900 ||
          foundationDate.max !== 2028 ||
          sort !== "" ||
          perPage.start !== 0 ||
          perPage.end !== 0 ? (
            <button
              onClick={clearAll}
              className="btn btn-danger text-nowrap me-2"
              style={{
                minHeight: "45px",
                marginBottom: "15px",
              }}
            >
              Clear All
            </button>
          ) : null}

          <select
            value={sort}
            className="chosen-single form-select"
            onChange={sortHandler}
          >
            <option value="">Sort by (default)</option>
            <option value="asc">Newest</option>
            <option value="des">Oldest</option>
          </select>
          {/* End select */}

          <select
            onChange={perPageHandler}
            className="chosen-single form-select ms-3"
            value={JSON.stringify(perPage)}
          >
            <option
              value={JSON.stringify({
                start: 0,
                end: 0,
              })}
            >
              All
            </option>
            <option
              value={JSON.stringify({
                start: 0,
                end: 10,
              })}
            >
              10 per page
            </option>
            <option
              value={JSON.stringify({
                start: 0,
                end: 20,
              })}
            >
              20 per page
            </option>
            <option
              value={JSON.stringify({
                start: 0,
                end: 24,
              })}
            >
              24 per page
            </option>
          </select>
          {/* End select */}
        </div>
      </div>
      {/* End top filter bar box */}

      {content}

      <ListingShowing />
      {/* <!-- Listing Show More --> */}
    </>
  );
};

export default FilterTopBox;