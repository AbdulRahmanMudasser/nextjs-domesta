'use client';

import Image from "next/image";
import Link from "next/link";
import footerContent from "@/data/footerContent";
import Rights from "./right";

const CopyrightFooter = ({ footerStyle = "" }) => {
  return (
    <footer className={`main-footer ${footerStyle}`}>
      <div className="auto-container">
        {/* <!--Widgets Section--> */}
        <div className="widgets-section" data-aos="fade-up">
          <div className="row">
            <div className="big-column col-xl-4 col-lg-3 col-md-12">
              <div className="footer-column about-widget">
                <div className="logo">
                  <Link href="/" style={{ display: "flex", gap: "10px" }}>
                    <Image
                      alt="brand"
                      src="/images/domesta_icon_2.png"
                      width={50}
                      height={50}
                      priority
                    />
                    <Image
                      alt="brand"
                      src="/images/retro-icon-text.png"
                      width={150}
                      height={50}
                      priority
                    />
                  </Link>
                </div>
                <p className="phone-num">
                  <span>Call us </span>
                  <a >123 456 7890</a>
                </p>
                <p className="address">
                  329 Queensberry Street, North Melbourne VIC
                  <br /> 3051, Australia. <br />
                  <a href="mailto:support@Domesta.com" className="email">
                    support@Domesta.com
                  </a>
                </p>
              </div>
            </div>
            {/* End footer left widget */}

            <div className="big-column col-xl-8 col-lg-9 col-md-12">
              <div className="row">
                {footerContent.map((item) => (
                  <div
                    className="footer-column col-lg-3 col-md-6 col-sm-12"
                    key={item.id}
                  >
                    <div className="footer-widget links-widget">
                      <h4 className="widget-title">{item.title}</h4>
                      <div className="widget-content">
                        <ul className="list">
                          {item?.menuList?.map((menu, i) => (
                            <li key={i}>
                              <Link href={menu.route}>{menu.name}</Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* End col-xl-8 */}
          </div>
        </div>
      </div>
      {/* End auto-container */}

      <Rights />
      {/* <!--Bottom--> */}
    </footer>
    //   {/* <!-- End Main Footer --> */}
  );
};

export default CopyrightFooter;
