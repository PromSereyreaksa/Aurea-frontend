import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const QuickActions = () => {
  const actions = [
    {
      title: "Create Portfolio",
      description: "Start building a new portfolio from scratch",
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
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      ),
      link: "/portfolio-builder/new",
      color: "bg-blue-600 hover:bg-blue-700",
      priority: "high",
    },
    {
      title: "Browse Templates",
      description: "Choose from our curated template collection",
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
      link: "/portfolio-builder/new",
      color: "bg-purple-600 hover:bg-purple-700",
      priority: "medium",
    },
    {
      title: "Analytics Dashboard",
      description: "View your portfolio performance metrics",
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
      link: "/analytics",
      color: "bg-green-600 hover:bg-green-700",
      priority: "medium",
    },
    {
      title: "Account Settings",
      description: "Manage your profile and preferences",
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
      link: "/settings",
      color: "bg-gray-600 hover:bg-gray-700",
      priority: "low",
    },
    {
      title: "Export Portfolio",
      description: "Download your portfolio as PDF",
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
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      link: "/export",
      color: "bg-orange-600 hover:bg-orange-700",
      priority: "low",
    },
    {
      title: "Help Center",
      description: "Get help and browse documentation",
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
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      link: "/help",
      color: "bg-indigo-600 hover:bg-indigo-700",
      priority: "low",
    },
  ];

  const highPriorityActions = actions.filter(
    (action) => action.priority === "high"
  );
  const otherActions = actions.filter((action) => action.priority !== "high");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
    >
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Quick Actions</h3>
        <p className="text-gray-600">Get started with these common tasks</p>
      </div>

      {/* High Priority Actions */}
      <div className="mb-8">
        <div className="grid grid-cols-1 gap-4">
          {highPriorityActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Link
                to={action.link}
                className={`flex items-center p-6 rounded-xl text-white transition-all duration-300 ${action.color}`}
              >
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    {action.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold mb-1">{action.title}</h4>
                  <p className="text-white/80">{action.description}</p>
                </div>
                <div className="flex-shrink-0">
                  <svg
                    className="w-6 h-6 group-hover:translate-x-1 transition-transform"
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
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Other Actions Grid */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          More Actions
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index + highPriorityActions.length) * 0.1 }}
              whileHover={{ y: -2 }}
              className="group"
            >
              <Link
                to={action.link}
                className="block p-6 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center mb-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform ${action.color}`}
                  >
                    {action.icon}
                  </div>
                </div>
                <h5 className="font-semibold text-gray-900 mb-2 group-hover:text-black transition-colors">
                  {action.title}
                </h5>
                <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                  {action.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default QuickActions;
