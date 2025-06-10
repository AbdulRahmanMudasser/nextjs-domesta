'use client'

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import HeaderNavContent from "./HeaderNavContent";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import headerdropdownmenu from "@/data/headerdropdownmenu";

const WebsiteHeader = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [navbar, setNavbar] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef(null); // Ref for dropdown menu

  // Handle scroll for fixed header
  const changeBackground = () => {
    if (window.scrollY >= 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    // const dropdownRef=null;
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

  // Handle scroll event
  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    return () => window.removeEventListener("scroll", changeBackground);
  }, []);

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  // Handle menu item click
  const handleClick = (item, e) => {
    e.preventDefault();
    if (item.name !== "Logout") {
      switch (user?.role?.slug) { // Use `user` instead of `userData`
        case "employer":
          router.push("/panels/employer/dashboard");
          break;
        case "employee":
          router.push("/panels/employee/dashboard");
          break;
        case "agency":
          router.push("/panels/agency/dashboard");
          break;
        case "super-admin":
          router.push("/panels/superadmin/dashboard");
          break;
        default:
          router.push("/login"); // If role not found, redirect to login
          console.log("Unknown role:", user?.role);
      }
      console.log("User role:", user?.role); // Debugging log
    }
  };

  return (
    <header
      className={`main-header ${navbar ? "fixed-header animated slideInDown" : ""
        }`}
    >
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
          {isAuthenticated ? (
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

              <ul className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}>
                {dropdownOpen &&
                  headerdropdownmenu.map((item, index) => {
                    console.log("Rendering item with key:", item.id || index); // Debugging log
                    return (
                      <li key={item.id || index}>
                        {item.name === "Logout" ? (
                          <Link
                            href="#"
                            onClick={(e) => { e.preventDefault(); handleLogout(); }}
                            className="dropdown-item"
                          >
                            <i className={`la ${item.icon}`}></i> {item.name}
                          </Link>
                        ) : (
                          <Link
                            href={item.routePath}
                            onClick={(e) => handleClick(item, e)}
                            className="dropdown-item"
                          >
                            <i className={`la ${item.icon}`}></i> {item.name}
                          </Link>
                        )}
                      </li>
                    );
                  })}
              </ul>
            </div>
          ) : (
            <div className="btn-box">
              <a
                href="#"
                className="theme-btn btn-style-three call-modal"
                data-bs-toggle="modal"
                data-bs-target="#loginPopupModal"
              >
                Login / Register
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default WebsiteHeader;