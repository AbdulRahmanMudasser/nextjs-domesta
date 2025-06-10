'use client'

import Slider from "react-slick";
import Link from "next/link";
import Image from "next/image";
import employerProfile from "@/data/employer-profile";

const TopCompany = () => {
  const settings = {
    dots: true,
    speed: 500,
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

  // Ensure employerProfile is an array, fallback to empty array if not
  const companies = Array.isArray(employerProfile) ? employerProfile : [];

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
  const getImageSrc = (company) => {
    if (company?.img) {
      const cleanedImg = company.img
        .replace(/^\/images\/resource\//, '')
        .replace(/^\/images\//, '');
      return `/images/resource/${cleanedImg}`;
    }
    if (company?.keys) {
      const profileImage = findKeyValue(company.keys, "profile", "profileImage", "");
      if (profileImage) return `/images/resource/${profileImage}`;
    }
    return "/images/resource/fallback.png";
  };

  return (
    <Slider {...settings} arrows={false}>
      {companies.slice(0, 12).map((company) => (
        <div className="company-block" key={company.id}>
          <div className="inner-box">
            <figure className="image">
              <Image
                width={90}
                height={90}
                src={getImageSrc(company)}
                alt={company.name || "Company"}
                onError={(e) => { e.target.src = "/images/resource/fallback.png"; }}
              />
            </figure>
            <h4 className="name">
              <Link href={`/website/employers/profile/${company.id}`}>
                {company.name || "Unnamed Company"}
              </Link>
            </h4>
            <div className="location">
              <i className="flaticon-map-locator"></i> {company.location || "Unknown Location"}
            </div>
            <Link
              href={`/website/employers/profile/${company.id}`}
              className="theme-btn btn-style-three"
            >
              {company.jobNumber || 0} Open Position
            </Link>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default TopCompany;