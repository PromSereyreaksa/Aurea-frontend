import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore";

const DashboardSidebar = ({
  activeSection,
  setActiveSection,
  user: rawUser,
  onClose,
}) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Handle nested user object structure (same as ProfilePage)
  const user = rawUser?.user || rawUser;

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      // Add a delay to show the loading state
      await new Promise(resolve => setTimeout(resolve, 1500));
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  // Main menu items
  const menuItems = [
    {
      id: "overview",
      name: "Overview",
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
          className="w-5 h-5"
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
      external: true,
    },
    {
      id: "analytics",
      name: "Analytics",
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
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
  ];

  // General section items
  const generalItems = [
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
      isLink: true,
      link: "/profile",
    },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-b from-[#fb8500] to-[#ff9500] flex flex-col shadow-xl relative">
      {/* Mobile Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 lg:hidden bg-white/20 text-white p-2 sm:p-3 rounded-lg hover:bg-white/30 transition-all duration-300 z-10"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      {/* Logo Section - Show on small mobile when sidebar is open, always show on desktop */}
      <div className="p-4 lg:p-6 border-b border-white/20 sm:hidden lg:block">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/AUREA - Logo.jpg"
            alt="Aurea Logo"
            className="h-10 w-10 lg:h-12 lg:w-12 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105 ring-2 ring-white/30"
          />
          <div>
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">
              AUREA
            </h1>
            <p className="text-[10px] lg:text-xs text-white/80 font-bold uppercase tracking-wider">
              Portfolio Builder
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 lg:px-5 py-4 lg:py-6 pt-16 lg:pt-4 overflow-y-auto">
        {/* MENU Section */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3 px-3">
            Menu
          </p>
          <div className="space-y-1">
            {menuItems.map((item) => {
              // If item is a link, render as Link component
              if (item.isLink) {
                return (
                  <Link
                    key={item.id}
                    to={item.link}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all duration-200 text-white/90 hover:bg-white/10 rounded-lg group"
                  >
                    <div className="flex items-center justify-center flex-shrink-0">
                      {React.cloneElement(item.icon, { className: "w-5 h-5" })}
                    </div>
                    <span className="font-medium text-sm truncate flex-1">
                      {item.name}
                    </span>
                    {item.external && (
                      <svg
                        className="w-4 h-4 flex-shrink-0 opacity-70"
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
                    )}
                  </Link>
                );
              }

              // Otherwise, render as button for section navigation
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all duration-200 rounded-lg ${
                    activeSection === item.id
                      ? "bg-white text-[#fb8500]"
                      : "text-white/90 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-center flex-shrink-0">
                    {React.cloneElement(item.icon, { className: "w-5 h-5" })}
                  </div>
                  <span className="font-medium text-sm truncate">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* GENERAL Section */}
        <div>
          <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3 px-3">
            General
          </p>
          <div className="space-y-1">
            {generalItems.map((item) => {
              // If item is a link, render as Link component
              if (item.isLink) {
                return (
                  <Link
                    key={item.id}
                    to={item.link}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all duration-200 text-white/90 hover:bg-white/10 rounded-lg group"
                  >
                    <div className="flex items-center justify-center flex-shrink-0">
                      {React.cloneElement(item.icon, { className: "w-5 h-5" })}
                    </div>
                    <span className="font-medium text-sm truncate">
                      {item.name}
                    </span>
                  </Link>
                );
              }

              // Otherwise, render as button
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all duration-200 text-white/90 hover:bg-white/10 rounded-lg"
                >
                  <div className="flex items-center justify-center flex-shrink-0">
                    {React.cloneElement(item.icon, { className: "w-5 h-5" })}
                  </div>
                  <span className="font-medium text-sm truncate">
                    {item.name}
                  </span>
                </button>
              );
            })}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all duration-200 text-white/90 hover:bg-white/10 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center flex-shrink-0">
                {isLoggingOut ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
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
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                )}
              </div>
              <span className="font-medium text-sm truncate">
                {isLoggingOut ? "Logging out..." : "Logout"}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* User Profile Section - Bottom */}
      <div className="border-t border-white/20 p-4 bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0 overflow-hidden">
            {user?.avatar || user?.profilePicture ? (
              <img
                src={user.avatar || user.profilePicture}
                alt={user?.name || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[#fb8500] text-lg font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || user?.firstName?.charAt(0)?.toUpperCase() || "U"}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-l font-semibold text-white truncate">
              {user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : user?.name || user?.username || "User"}
            </p>
            <p className="text-xs text-white/70 truncate">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DashboardSidebar;
