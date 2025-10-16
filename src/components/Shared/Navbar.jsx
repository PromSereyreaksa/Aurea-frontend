import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useAuthStore from "../../stores/authStore";
import { StaggeredMenu } from "./StaggeredMenu";
import aureaLogo from "../../assets/AUREA - Logo.png";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Show navigation items only on landing page, about page, and events page
  const showNavItems =
    location.pathname === "/" ||
    location.pathname === "/about" ||
    location.pathname === "/events";

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else if (sectionId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Get user initials
  const getUserInitials = () => {
    if (!user?.name) return "U";
    const names = user.name.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  };

  // Define menu items based on current page
  const getMenuItems = () => {
    let baseItems = [];

    if (location.pathname === "/") {
      baseItems = [
        {
          label: "Home",
          link: "#",
          onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
        },
        {
          label: "How It Works",
          link: "#",
          onClick: () => scrollToSection("how-it-works"),
        },
        {
          label: "Playground",
          link: "#",
          onClick: () => scrollToSection("playground"),
        },
        {
          label: "About",
          link: "/about",
        },
      ];
    } else if (location.pathname === "/about") {
      baseItems = [
        {
          label: "Home",
          link: "/",
        },
        {
          label: "Our Story",
          link: "#",
          onClick: () => scrollToSection("story"),
        },
        {
          label: "Our Values",
          link: "#",
          onClick: () => scrollToSection("values"),
        },
        {
          label: "Our Team",
          link: "#",
          onClick: () => scrollToSection("team"),
        },
        {
          label: "Our Mission",
          link: "#",
          onClick: () => scrollToSection("mission"),
        },
      ];
    } else if (location.pathname === "/events") {
      baseItems = [
        {
          label: "Home",
          link: "/",
        },
        {
          label: "Overview",
          link: "#",
          onClick: () => scrollToSection("home"),
        },
        {
          label: "Why Join",
          link: "#",
          onClick: () => scrollToSection("about"),
        },
        {
          label: "Events",
          link: "#",
          onClick: () => scrollToSection("events"),
        },
        {
          label: "Newsletter",
          link: "#",
          onClick: () => scrollToSection("newsletter"),
        },
      ];
    } else {
      // Default items for other pages
      baseItems = [
        { label: "Home", link: "/" },
        { label: "About", link: "/about" },
        { label: "Contact", link: "/contact" },
      ];
    }

    // Login and Signup removed from sidebar menu

    return baseItems;
  };

  const socialItems = [
    {
      label: "Facebook",
      link: "https://web.facebook.com/profile.php?id=61580414833465",
    },
    {
      label: "Tiktok",
      link: "https://www.tiktok.com/@aureatool?_t=ZS-906MF0fRW8W&_r=1",
    },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // For landing, about, and events pages, use StaggeredMenu
  if (
    location.pathname === "/" ||
    location.pathname === "/about" ||
    location.pathname === "/events"
  ) {
    return (
      <div
        className="fixed top-0 left-0 w-full h-screen z-50"
        style={{ pointerEvents: "none" }}
      >
        <div style={{ pointerEvents: "auto" }}>
          <StaggeredMenu
            position="right"
            colors={["#fb8500", "#e07400"]}
            items={getMenuItems()}
            socialItems={socialItems}
            displaySocials={true}
            displayItemNumbering={true}
            logoUrl={aureaLogo}
            menuButtonColor="#fb8500"
            openMenuButtonColor="#fb8500"
            changeMenuColorOnOpen={false}
            accentColor="#fb8500"
            user={user}
            isAuthenticated={isAuthenticated}
            onLogout={() => {
              logout();
              navigate("/");
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 py-3 px-4 sm:py-4 sm:px-6"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/"
            className="flex items-center space-x-2 sm:space-x-3 group"
          >
            <motion.img
              src={aureaLogo}
              alt="AUREA Logo"
              className="h-6 sm:h-8 w-auto transition-all duration-300 group-hover:brightness-110"
              whileHover={{
                rotate: [0, -5, 5, 0],
                transition: { duration: 0.5 },
              }}
            />
            <span className="text-lg sm:text-2xl font-bold tracking-wide uppercase text-[#1a1a1a] group-hover:text-[#fb8500] transition-colors duration-300">
              AUREA
            </span>
          </Link>
        </motion.div>

        <div className="hidden lg:flex items-center space-x-8">
          {/* Navigation items based on current page */}
          {location.pathname === "/" && (
            <>
              <motion.button
                onClick={() => scrollToSection("home")}
                className="text-[#1a1a1a] hover:text-[#fb8500] font-medium transition-colors relative group"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Home
                <motion.span
                  className="absolute bottom-0 left-0 h-0.5 bg-[#fb8500]"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                ></motion.span>
              </motion.button>
              <motion.button
                onClick={() => scrollToSection("features")}
                className="text-[#1a1a1a] hover:text-[#fb8500] font-medium transition-colors relative group"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Features
                <motion.span
                  className="absolute bottom-0 left-0 h-0.5 bg-[#fb8500]"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                ></motion.span>
              </motion.button>
              <motion.button
                onClick={() => scrollToSection("faq")}
                className="text-[#1a1a1a] hover:text-[#fb8500] font-medium transition-colors relative group"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                FAQ
                <motion.span
                  className="absolute bottom-0 left-0 h-0.5 bg-[#fb8500]"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                ></motion.span>
              </motion.button>
              <motion.button
                onClick={() => scrollToSection("pricing")}
                className="text-[#1a1a1a] hover:text-[#fb8500] font-medium transition-colors relative group"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Pricing
                <motion.span
                  className="absolute bottom-0 left-0 h-0.5 bg-[#fb8500]"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                ></motion.span>
              </motion.button>
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/about"
                  className="text-[#1a1a1a] hover:text-[#fb8500] font-medium transition-colors relative group flex items-center space-x-1"
                >
                  <span>About</span>
                  <motion.svg
                    className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    whileHover={{ x: 2, y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </motion.svg>
                  <motion.span
                    className="absolute bottom-0 left-0 h-0.5 bg-[#fb8500]"
                    initial={{ width: 0 }}
                    whileHover={{ width: "calc(100% - 16px)" }}
                    transition={{ duration: 0.3 }}
                  ></motion.span>
                </Link>
              </motion.div>
            </>
          )}

          {location.pathname === "/about" && (
            <>
              <button
                onClick={() => navigate("/")}
                className="text-[#1a1a1a] hover:text-[#fb8500] font-medium transition-colors relative group"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#fb8500] transition-all group-hover:w-full"></span>
              </button>
              <button
                onClick={() => scrollToSection("story")}
                className="text-[#1a1a1a] hover:text-[#fb8500] font-medium transition-colors relative group"
              >
                Our Story
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#fb8500] transition-all group-hover:w-full"></span>
              </button>
              <button
                onClick={() => scrollToSection("values")}
                className="text-[#1a1a1a] hover:text-[#fb8500] font-medium transition-colors relative group"
              >
                Our Values
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#fb8500] transition-all group-hover:w-full"></span>
              </button>
              <button
                onClick={() => scrollToSection("team")}
                className="text-[#1a1a1a] hover:text-[#fb8500] font-medium transition-colors relative group"
              >
                Our Team
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#fb8500] transition-all group-hover:w-full"></span>
              </button>
              <button
                onClick={() => scrollToSection("mission")}
                className="text-[#1a1a1a] hover:text-[#fb8500] font-medium transition-colors relative group"
              >
                Our Mission
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#fb8500] transition-all group-hover:w-full"></span>
              </button>
            </>
          )}
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {isAuthenticated ? (
            <>
              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-[#fb8500] to-[#ff9500] text-white rounded-full font-semibold text-sm sm:text-base hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#fb8500] focus:ring-offset-2"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {getUserInitials()}
                </motion.button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                  >
                    {/* User Info Header */}
                    <div className="px-4 py-3 bg-gradient-to-r from-[#fb8500]/10 to-[#ff9500]/10 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                    </div>

                    <div className="py-2">
                      <motion.div
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link
                          to="/profile"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-[#fb8500]/10 hover:text-[#fb8500] transition-colors group"
                        >
                          <svg
                            className="w-4 h-4 mr-3 text-gray-400 group-hover:text-[#fb8500]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          Profile
                        </Link>
                      </motion.div>
                      <motion.div
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link
                          to="/dashboard"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-[#fb8500]/10 hover:text-[#fb8500] transition-colors group"
                        >
                          <svg
                            className="w-4 h-4 mr-3 text-gray-400 group-hover:text-[#fb8500]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                          Dashboard
                        </Link>
                      </motion.div>
                    </div>

                    <div className="border-t border-gray-100">
                      <motion.button
                        onClick={() => {
                          logout();
                          setShowDropdown(false);
                        }}
                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors group"
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <svg
                          className="w-4 h-4 mr-3 text-red-400 group-hover:text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Logout
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Public Navigation - Hide login text on mobile */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:block"
              >
                <Link
                  to="/login"
                  className="text-[#1a1a1a] hover:text-[#fb8500] font-medium transition-all duration-200 px-3 sm:px-4 py-2 rounded-lg hover:bg-[#fb8500]/10 text-sm sm:text-base"
                >
                  Log In
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-[#fb8500] to-[#ff9500] text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg font-medium tracking-wide uppercase transition-all hover:shadow-lg relative overflow-hidden group text-xs sm:text-base"
                >
                  <motion.div
                    className="absolute inset-0 bg-[#1a1a1a]"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ originX: 0 }}
                  />
                  <span className="relative z-10">Sign Up</span>
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
