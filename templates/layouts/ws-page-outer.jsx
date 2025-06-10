import React from "react";
import PropTypes from "prop-types";
import LoginPopup from "@/globals/login/LoginPopup";
import MobileMenu from "@/globals/header/MobileMenu";
import WebsiteHeader from "@/globals/header/WebsiteHeader";
import CopyrightFooter from "@/globals/footer/CopyrightFooter";
// import WebsiteFooter from "@/globals/footer/WebsiteFooter/WebsiteFooter";

const WsPageOuter = ({ headerType, title, subtitle, children }) => {
  return (
    <div className="page-wrapper">
      <span className="header-span"></span>
      <LoginPopup />
      <WebsiteHeader />
      <MobileMenu />
      <div className="page-content">
        {children}
      </div>
      <CopyrightFooter />
      {/* <WebsiteFooter/> */}
          </div>
  );
};

WsPageOuter.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  children: PropTypes.node,
};

WsPageOuter.defaultProps = {
  subtitle: "",
};

export default WsPageOuter;
