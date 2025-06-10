import Image from "next/image";
import Link from "next/link";

const About6 = () => {
  return (
    <>
      {/* <!-- About Section --> */}
      <section
        id="section-1"
        className="about-section-two style-two pt-0 layout-pb-60 js-tab-menu-content"
      >
        <div className="auto-container">
          <div className="row grid-base justify-content-between align-items-center">
            {/* <!-- Content Column --> */}
            <div className="content-column col-xl-4 col-lg-5 col-md-12 col-sm-12 order-2 order-lg-1">
              <div className="inner-column -no-padding" data-aos="fade-right">
                <div className="sec-title">
                  <h2 className="fw-700">
                    Why Employer
                    <br /> Registration
                  </h2>
                  <div className="text mt-30">
                    Join our platform to hire skilled cooks, nannies, and household workers effortlessly. Our agents simplify the process, connecting you with verified employees to meet your household needs.
                  </div>
                </div>
                <ul className="list-style-one mt-24 mb-24">
                  <li>Register to access a vast pool of employees</li>
                  <li>Browse thousands of qualified professionals</li>
                  <li>Let agents find the perfect employee for you</li>
                </ul>
                <Link href="/job-list-v8" className="theme-btn -blue">
                  Discover More
                </Link>
              </div>
            </div>

            {/* <!-- Image Column --> */}
            <div
              className="image-column -no-margin col-lg-6 col-md-12 col-sm-12 order-1 order-lg-2"
              data-aos="fade-left"
            >
              <figure className="image-box">
                <Image
                  width={625}
                  height={497}
                  src="/images/index-12/images/1.png"
                  alt="about"
                />
              </figure>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- End About Section --> */}
    </>
  );
};

export default About6;