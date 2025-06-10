import Link from "next/link";
import agentData from "@/data/agent-profile";
import Image from "next/image";

const JobFeatured = () => {
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
  const getImageSrc = (agent) => {
    return agent?.profilePic || "/images/agency1.jpg";
  };

  return (
    <>
      {agentData.slice(0, 6).map((item) => (
        <div className="job-block col-lg-6 col-md-12 col-sm-12" key={item.id}>
          <div className="inner-box">
            <div className="content">
              <span className="company-logo">
                <Image
                  width={50}
                  height={49}
                  src={getImageSrc(item)}
                  alt={item.name || "Agent"}
                />
              </span>
              <h4>
                <Link href={`/website/agents/profile/${item.id}`}>
                  {item.name}
                </Link>
              </h4>

              <ul className="job-info">
                <li>
                  <span className="icon flaticon-briefcase"></span>
                  {findKeyValue(item.keys, "Legal Compliance", "agencyType", "N/A")}
                </li>
                {/* agency type info */}
                <li>
                  <span className="icon flaticon-map-locator"></span>
                  {findKeyValue(item.keys, "Agent Profile", "country", "Unknown")}
                </li>
                {/* location info */}
                <li>
                  <span className="icon flaticon-money"></span>
                  {Array.isArray(findKeyValue(item.keys, "Services Offering", "servicesProvided", "No Services"))
                    ? findKeyValue(item.keys, "Services Offering", "servicesProvided", "No Services").join(", ")
                    : findKeyValue(item.keys, "Services Offering", "servicesProvided", "No Services")}
                </li>
                {/* services info */}
              </ul>
              {/* End .job-info */}

              <ul className="job-other-info">
                {(Array.isArray(findKeyValue(item.keys, "Services Offering", "servicesProvided", "No Services"))
                  ? findKeyValue(item.keys, "Services Offering", "servicesProvided", "No Services")
                  : findKeyValue(item.keys, "Services Offering", "servicesProvided", "No Services").split(", "))
                  .map((val, i) => (
                    <li key={i} className="time">
                      {val}
                    </li>
                  ))}
              </ul>
              {/* End .job-other-info */}

              <button className="bookmark-btn">
                <span className="flaticon-bookmark"></span>
              </button>
            </div>
          </div>
        </div>
        // End job-block
      ))}
    </>
  );
};

export default JobFeatured;