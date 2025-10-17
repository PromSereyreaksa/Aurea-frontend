import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import useAuthStore from "../../stores/authStore";
import aureaLogo from "../../assets/AUREA - Logo.png";

const ModernNavbar = () => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else if (sectionId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Determine nav items based on current page - memoized to prevent recalculation
  const navItems = useMemo(() => {
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
  }, [location.pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 py-3 px-4 sm:py-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="transition-transform hover:scale-105">
          <Link
            to="/"
            className="flex items-center space-x-2 sm:space-x-3 group"
          >
            <img
              src={aureaLogo}
              alt="AUREA Logo"
              className="h-6 sm:h-8 w-auto transition-all duration-200 group-hover:brightness-110"
            />
            <span className="text-lg sm:text-2xl font-black tracking-tight uppercase text-[#fb8500] group-hover:text-[#ff9500] transition-colors duration-200">
              AUREA
            </span>
          </Link>
        </div>

        <div className="hidden lg:flex items-center space-x-8">
          {navItems.map((item, index) => {
            if (item.link) {
              return (
                <div key={index} className="relative group">
                  <Link
                    to={item.link}
                    className="flex items-center gap-1.5 text-[#1a1a1a] hover:text-[#fb8500] font-medium transition-colors duration-200"
                  >
                    {item.label}
                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </Link>
                  <span className="absolute bottom-0 left-0 h-0.5 bg-[#fb8500] w-0 group-hover:w-full transition-all duration-200"></span>
                </div>
              );
            } else {
              return (
                <button
                  key={index}
                  onClick={item.action}
                  className="text-[#1a1a1a] hover:text-[#fb8500] font-medium transition-colors duration-200 relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 h-0.5 bg-[#fb8500] w-0 group-hover:w-full transition-all duration-200"></span>
                </button>
              );
            }
          })}
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {isAuthenticated ? (
            <>
              {/* Dashboard Button */}
              <Link
                to="/dashboard"
                className="flex items-center gap-2 bg-gradient-to-r from-[#fb8500] to-[#ff9500] text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 text-sm sm:text-base"
              >
                <svg
                  className="w-4 h-4"
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
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            </>
          ) : (
            <>
              {/* Public Navigation */}
              <div className="hidden sm:block">
                <Link
                  to="/login"
                  className="text-[#1a1a1a] hover:text-[#fb8500] font-medium transition-all duration-200 px-3 sm:px-4 py-2 rounded-lg hover:bg-[#fb8500]/10 text-sm sm:text-base"
                >
                  Log In
                </Link>
              </div>
              <div>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-[#fb8500] to-[#ff9500] text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg font-medium tracking-wide uppercase transition-all duration-200 hover:shadow-lg hover:scale-105 text-xs sm:text-base"
                >
                  Sign Up
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default ModernNavbar;
