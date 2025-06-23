"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import HeaderNavContent from "./HeaderNavContent";
import { isActiveLink } from "../../utils/linkActiveChecker";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { userService } from "@/services/user.service";

const DashboardHeader = ({ headerType }) => {
  const [navbar, setNavbar] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const changeBackground = () => {
    if (window.scrollY >= 0) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    return () => {
      window.removeEventListener("scroll", changeBackground);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await userService.logoutUser();
      dispatch(logout());
      router.push("/");
    } catch (error) {
      console.error("Logout error in DashboardHeader:", error);
      dispatch(logout());
      router.push("/");
    }
  };

  return (
    <header
      className={`main-header header-shaddow ${navbar ? "fixed-header" : ""}`}
    >
      <div>
        <div className="main-box">
          <div className="nav-outer">
            <div className="logo-box">
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
            </div>

            <HeaderNavContent />
          </div>

          <div className="outer-box">
            <div className="dropdown dashboard-option" ref={dropdownRef}>
              <button
                className="dropdown-toggle"
                role="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <Image
                  alt="avatar"
                  className="thumb"
                  src={user?.image || "/images/profession.jpeg"}
                  width={50}
                  height={50}
                />
                <span className="name">{user?.name}</span>
              </button>

              {dropdownOpen && (
                <ul className="dropdown-menu show">
                  <li className="mb-1">
                    <Link
                      href="#"
                      onClick={(e) => { e.preventDefault(); handleLogout(); }}
                      className="dropdown-item"
                    >
                      <i className="la la-sign-out"></i> Logout
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;