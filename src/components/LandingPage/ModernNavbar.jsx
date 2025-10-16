import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import useAuthStore from "../../stores/authStore";
import aureaLogo from "../../assets/AUREA - Logo.png";

const ModernNavbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else if (sectionId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Determine nav items based on current page
  const getNavItems = () => {
    if (location.pathname === "/") {
      return [
        { label: "Home", action: () => scrollToSection("home") },
        { label: "Features", action: () => scrollToSection("features") },
        {
          label: "How It Works",
          action: () => scrollToSection("how-it-works"),
        },
        {
          label: "Testimonials",
          action: () => scrollToSection("testimonials"),
        },
        { label: "About", link: "/about" },
      ];
    } else if (location.pathname === "/about") {
      return [
        { label: "Our Story", action: () => scrollToSection("story") },
        { label: "Our Values", action: () => scrollToSection("values") },
        { label: "Our Team", action: () => scrollToSection("team") },
        { label: "Our Mission", action: () => scrollToSection("mission") },
      ];
    } else {
      // Default nav for other pages (Profile, Dashboard, etc.)
      return [
        { label: "Home", link: "/" },
        { label: "About", link: "/about" },
        { label: "Dashboard", link: "/dashboard" },
      ];
    }
  };

  const navItems = getNavItems();

  // Get user initials
  const getUserInitials = () => {
    if (!user?.name) return "U";
    const names = user.name.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  };

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
          {navItems.map((item, index) => {
            if (item.link) {
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.link}
                    className="flex items-center gap-1.5 text-[#1a1a1a] hover:text-[#fb8500] font-medium transition-colors relative group"
                  >
                    {item.label}
                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                    <motion.span
                      className="absolute bottom-0 left-0 h-0.5 bg-[#fb8500]"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    ></motion.span>
                  </Link>
                </motion.div>
              );
            } else {
              return (
                <motion.button
                  key={index}
                  onClick={item.action}
                  className="text-[#1a1a1a] hover:text-[#fb8500] font-medium transition-colors relative group"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                  <motion.span
                    className="absolute bottom-0 left-0 h-0.5 bg-[#fb8500]"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  ></motion.span>
                </motion.button>
              );
            }
          })}
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

export default ModernNavbar;
