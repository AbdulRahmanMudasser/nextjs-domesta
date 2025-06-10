import React from "react";
import PropTypes from "prop-types";
import LoginPopup from "@/globals/login/LoginPopup";
import DashboardHeader from "@/globals/header/DashboardHeader";
import MobileMenu from "@/globals/header/MobileMenu";
import DashboardSidebar from "@/globals/sidebar/DashboardSidebar";
import DsPageTitle from "../misc/ds-page-titles";
// import CopyrightFooter from "@/globals/footer/CopyrightFooter";
import MenuToggler from "@/globals/header/MenuToggler";

const DsPageOuter = ({ headerType, title, subtitle, children }) => {
  return (
    <div
      className="page-wrapper dashboard"
      style={{
        position: "relative",
        backgroundColor: "#f5f7fc",
        paddingLeft: "245px",
        minHeight: "100vh",
      }}
    >
      <span className="header-span"></span>
      <LoginPopup />
      <DashboardHeader headerType={headerType} />
      <MobileMenu />
      <DashboardSidebar headerType={headerType} />

      <section className="user-dashboard">
        <div className="dashboard-outer" style={{ padding: "1rem" }}>
          <DsPageTitle title={title} subtitle={subtitle} />
          <MenuToggler style={{ marginBottom: "0" }} />

          {/* Content Yield */}
          {children}
        </div>
      </section>

      {/* <CopyrightFooter /> */}
    </div>
  );
};

DsPageOuter.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  children: PropTypes.node,
};

DsPageOuter.defaultProps = {
  subtitle: "",
};

export default DsPageOuter;
