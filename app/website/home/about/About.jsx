import Image from "next/image";
import Link from "next/link";

const About = () => {
  return (
    <>
      <div className="content-column col-lg-6 col-md-12 col-sm-12 order-2">
        <div className="inner-column" data-aos="fade-left">
          <div className="sec-title">
            <h2>About Us: Connecting Households with Trusted Help</h2>
            <div className="text">
              Discover the easiest way to hire skilled cooks, nannies, and household workers. Our platform connects employers, employees, and agents to create seamless job matches, ensuring every household finds the perfect help.
            </div>
          </div>
          <ul className="list-style-one">
            <li>Effortlessly match employers with verified employees</li>
            <li>Empower agents to facilitate perfect job placements</li>
            <li>Explore thousands of job listings tailored for you</li>
          </ul>
          <Link href="/" className="theme-btn btn-style-one bg-blue">
            <span className="btn-title">Get Started</span>
          </Link>
        </div>
      </div>
      {/* End .col about left content */}

      <div className="image-column col-lg-6 col-md-12 col-sm-12">
        <figure className="image" data-aos="fade-right">
          <Image
            width={600}
            height={600}
            src="/images/resource/image-3.png"
            alt="about"
          />
        </figure>

        {/* <!-- Count Employers --> */}
        <div className="count-employers" data-aos="flip-right">
          <div className="check-box">
            <span className="flaticon-tick"></span>
          </div>
          <span className="title">300k+ Employers</span>
          {/* <figure className="image">
            <Image
              width={234}
              height={61}
              layout="responsive"
              src="/images/resource/multi-logo.png"
              alt="resource"
            />
          </figure> */}
        </div>
      </div>
      {/* <!-- Image Column --> */}
    </>
  );
};

export default About;