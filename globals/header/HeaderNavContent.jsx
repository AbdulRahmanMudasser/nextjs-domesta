"use client";

import Link from "next/link";
import {  
  homeItems,
  pageItems,
} from "../../data/mainMenuData";
import {
  isActiveParent,
  isActiveLink,
  isActiveParentChaild,
} from "../../utils/linkActiveChecker";
import { usePathname } from "next/navigation";

const HeaderNavContent = () => {
  return (
    <>
      <nav className="nav main-menu">
        <ul className="navigation" id="navbar">
          {/* Home */}
          <li
            className={`${
              isActiveParent(homeItems, usePathname()) ? "current" : ""
            }`}
          >
            <Link href="/">
              <span>Home</span>
            </Link>
          </li>



          {/* Direct Page Links - Former "Others" dropdown items */}
          {pageItems.map((item) => {
            return (
              <li style={{}}
                className={`${
                  isActiveLink(item.routePath, usePathname()) ? "current" : ""
                }`}
                key={item.id || `${item.name}-${item.routePath}`}
              >
                <Link href={item.routePath}>
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}

          
        </ul>
      </nav>
    </>
  );
};

export default HeaderNavContent;
