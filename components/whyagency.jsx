import Image from "next/image";
import Link from "next/link";

const About7 = () => {
  return (
    <>
      {/* <!-- About Section --> */}
      <section
        id="section-2"
        className="about-section-two style-two layout-pt-60 layout-pb-60 js-tab-menu-content"
      >
        <div className="auto-container">
          <div className="row grid-base align-items-center">
            {/* <!-- Image Column --> */}
            <div
              className="image-column -no-margin col-xl-5 col-lg-6 col-md-12 col-sm-12"
              data-aos="fade-left"
            >
              <figure className="image-box">
                <Image
                  width={516}
                  height={552}
                  src="/images/index-12/images/2.png"
                  alt="about"
                />
              </figure>
            </div>

            {/* <!-- Content Column --> */}
            <div className="content-column col-xl-4 offset-xl-2 col-lg-5 offset-lg-1 col-md-12 col-sm-12">
              <div data-aos="fade-right">
                <div className="sec-title">
                  <h2 className="fw-700">
                    Why Agency
                    <br /> Registration
                  </h2>
                  <div className="text mt-30">
                    Join our platform as an agent to connect employers with skilled cooks, nannies, and household workers. Facilitate seamless job matches and earn rewards for helping households find the perfect employee.
                  </div>
                </div>
                <ul className="list-style-one mt-24 mb-24">
                  <li>Register to connect with employers and employees</li>
                  <li>Access a vast network of job opportunities</li>
                  <li>Facilitate perfect matches and earn rewards</li>
                </ul>
                <Link href="/job-list-v9" className="theme-btn -blue">
                  Discover More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- End About Section --> */}
    </>
  );
};

export default About7;