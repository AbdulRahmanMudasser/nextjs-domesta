"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import "react-circular-progressbar/dist/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { menuToggle } from "@/features/toggle/toggleSlice";
import { logout } from "@/features/auth/authSlice";
import candidatesMenuData from "@/data/candidatesMenuData";
import employerMenuData from "@/data/employerMenuData";
import { useEffect, useState } from "react";
import { ProfileTypes } from "@/data/globalKeys";
import agencyMenuData from "@/data/agencyMenuData";
import superAdminMenuData from "@/data/superAdminMenu";
import { userService } from "@/services/user.service";

const DashboardSidebar = ({ headerType }) => {
  const [profileType, setProfileType] = useState(null);
  useEffect(() => {
    if (headerType) {
      setProfileType(headerType);
    }
  }, [headerType]);

  let menuData = [];
  switch (profileType) {
    case ProfileTypes.CANDIDATE:
      menuData = candidatesMenuData;
      break;
    case ProfileTypes.EMPLOYER:
      menuData = employerMenuData;
      break;
    case ProfileTypes.AGENCY:
      menuData = agencyMenuData;
      break;
    case ProfileTypes.SUPERADMIN:
      menuData = superAdminMenuData;
      break;
    default:
      menuData = [];
  }

  const { menu } = useSelector((state) => state.toggle);
  const percentage = 30;

  const router = useRouter();
  const dispatch = useDispatch();

  const menuToggleHandler = () => {
    dispatch(menuToggle());
  };

  const handleLogout = async () => {
    try {
      await userService.logoutUser();
      dispatch(logout());
      router.push("/");
    } catch (error) {
      dispatch(logout());
      router.push("/");
    }
  };

  const isActiveLink = (routePath, currentPath) => routePath === currentPath;

  return (
    <div
      className={`user-sidebar ${menu ? "sidebar_open" : ""}`}
      style={{ width: "240px" }}
    >
      <div className="pro-header text-end pb-0 mb-0 show-1023">
        <div className="fix-icon" onClick={menuToggleHandler}>
          <span className="flaticon-close"></span>
        </div>
      </div>

      <div className="sidebar-inner" style={{ padding: "20px" }}>
        <ul className="navigation">
          {menuData.map((item) => (
            <li
              className={`${
                isActiveLink(item.routePath, usePathname()) ? "active" : ""
              } mb-1`}
              key={item.id}
              onClick={menuToggleHandler}
            >
              {item.name === "Logout" ? (
                <Link href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                  <i className={`la ${item.icon}`}></i> {item.name}
                </Link>
              ) : (
                <Link href={item.routePath}>
                  <i className={`la ${item.icon}`}></i> {item.name}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardSidebar;