import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const DashboardBottomBar = ({ activeSection, setActiveSection, user }) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Primary tabs - most frequently used
  const primaryTabs = [
    {
      id: "overview",
      name: "Home",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
    },
    {
      id: "portfolios",
      name: "Portfolios",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    },
    {
      id: "analytics",
      name: "Analytics",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
  ];

  // Secondary tabs - less frequently used, shown in "More" menu
  const secondaryTabs = [
    {
      id: "templates",
      name: "Templates",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z"
          />
        </svg>
      ),
      isLink: true,
      link: "/templates",
    },
    {
      id: "pricing",
      name: "Pricing",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
      ),
    },
    {
      id: "learning",
      name: "Learning",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
    {
      id: "settings",
      name: "Settings",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  // Check if any secondary tab is active
  const isSecondaryTabActive = secondaryTabs.some(
    (tab) => tab.id === activeSection
  );

  const handleTabClick = (tabId) => {
    setActiveSection(tabId);
    setShowMoreMenu(false);
  };

  return (
    <>
      {/* Bottom Navigation Bar - Always Visible on mobile/tablet */}
      <div
        className="dashboard-bottom-bar fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 safe-bottom"
        data-dashboard-bottom-bar="true"
      >
        <div className="grid grid-cols-4 h-14 sm:h-16 px-1">
          {/* Primary Tabs */}
          {primaryTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              aria-label={tab.name}
              className={`relative flex flex-col items-center justify-center gap-0.5 sm:gap-1 transition-all duration-200 w-full ${
                activeSection === tab.id
                  ? "text-[#fb8500]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div
                className={`transition-transform duration-200 ${
                  activeSection === tab.id ? "scale-110" : ""
                }`}
              >
                {React.cloneElement(tab.icon, {
                  className: "w-5 h-5 sm:w-6 sm:h-6",
                })}
              </div>
              <span
                className={`text-[10px] sm:text-xs font-medium whitespace-nowrap max-[360px]:hidden ${
                  activeSection === tab.id ? "font-semibold" : ""
                }`}
              >
                {tab.name}
              </span>
              {activeSection === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 left-0 right-0 h-0.5 bg-[#fb8500]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}

          {/* More Button */}
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            aria-label="More options"
            aria-expanded={showMoreMenu}
            className={`relative flex flex-col items-center justify-center gap-0.5 sm:gap-1 transition-all duration-200 w-full ${
              isSecondaryTabActive || showMoreMenu
                ? "text-[#fb8500]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div
              className={`transition-transform duration-200 ${
                showMoreMenu ? "scale-110" : ""
              }`}
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </div>
            <span
              className={`text-[10px] sm:text-xs font-medium whitespace-nowrap max-[360px]:hidden ${
                isSecondaryTabActive || showMoreMenu ? "font-semibold" : ""
              }`}
            >
              More
            </span>
            {(isSecondaryTabActive || showMoreMenu) && (
              <motion.div
                layoutId="activeTab"
                className="absolute top-0 left-0 right-0 h-0.5 bg-[#fb8500]"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            {/* Active Indicator Dot for Secondary Tabs */}
            {isSecondaryTabActive && !showMoreMenu && (
              <div className="absolute top-1 right-2 sm:top-2 sm:right-4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#fb8500] rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* More Menu Overlay */}
      <AnimatePresence>
        {showMoreMenu && (
          <>
            {/* Menu Panel */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-16 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[70] lg:hidden max-h-[70vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    More Options
                  </h3>
                  <button
                    onClick={() => setShowMoreMenu(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* User Profile */}
              <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                <Link
                  to="/profile"
                  onClick={() => setShowMoreMenu(false)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#fb8500] to-[#ff9500] flex items-center justify-center shadow-md">
                    <span className="text-white text-base sm:text-lg font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-bold text-gray-900">
                      {user?.name || "User"}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      View & edit profile
                    </p>
                  </div>
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>

              {/* Secondary Menu Items */}
              <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-1">
                {secondaryTabs.map((tab) => {
                  if (tab.isLink) {
                    return (
                      <Link
                        key={tab.id}
                        to={tab.link}
                        onClick={() => setShowMoreMenu(false)}
                        className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                      >
                        <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-orange-50 text-[#fb8500] group-hover:bg-orange-100 transition-colors">
                          {tab.icon}
                        </div>
                        <span className="text-sm sm:text-base font-semibold text-gray-700 flex-1">
                          {tab.name}
                        </span>
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-[#fb8500] transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </Link>
                    );
                  }

                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={`w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 ${
                        activeSection === tab.id
                          ? "bg-orange-50 text-[#fb8500]"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl transition-colors ${
                          activeSection === tab.id
                            ? "bg-[#fb8500] text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {tab.icon}
                      </div>
                      <span className="text-sm sm:text-base font-semibold flex-1 text-left">
                        {tab.name}
                      </span>
                      {activeSection === tab.id && (
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Safe area for bottom */}
              <div className="h-6" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardBottomBar;
