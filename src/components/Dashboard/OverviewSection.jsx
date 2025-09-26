import React from "react";
import { Link } from "react-router-dom";
import StatsCard from "./StatsCard";

const OverviewSection = ({ portfolios, user }) => {
  // Calculate stats
  const totalViews = portfolios.reduce(
    (sum, portfolio) => sum + (portfolio.viewCount || 0),
    0
  );
  const publishedPortfolios = portfolios.filter((p) => p.published).length;
  const averageViews =
    portfolios.length > 0 ? Math.round(totalViews / portfolios.length) : 0;

  const statsData = [
    {
      icon: (
        <svg
          className="w-8 h-8"
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
      title: "Total Portfolios",
      value: portfolios.length.toString(),
      change: "+2 this month",
      changeType: "increase",
      color: "blue",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ),
      title: "Total Views",
      value: totalViews.toLocaleString(),
      change: "+18% from last month",
      changeType: "increase",
      color: "green",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Published",
      value: publishedPortfolios.toString(),
      change: `${
        Math.round((publishedPortfolios / portfolios.length) * 100) || 0
      }% published`,
      changeType: "neutral",
      color: "purple",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
      title: "Avg. Views",
      value: averageViews.toString(),
      change: "+12% improvement",
      changeType: "increase",
      color: "orange",
    },
  ];

  const quickActions = [
    {
      title: "Create Portfolio",
      description: "Start building a new portfolio",
      link: "/portfolio-builder/new",
      color: "bg-black hover:bg-gray-800",
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
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      ),
    },
    {
      title: "Browse Templates",
      description: "Choose from curated templates",
      link: "/templates",
      color: "bg-blue-600 hover:bg-blue-700",
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
      title: "View Analytics",
      description: "Check performance metrics",
      link: "#analytics",
      color: "bg-green-600 hover:bg-green-700",
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
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-lg text-gray-600">
          Here's what's happening with your portfolios today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatsCard
            key={index}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            color={stat.color}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className={`flex items-center p-4 rounded-lg text-white transition-colors ${action.color}`}
            >
              <div className="mr-3">{action.icon}</div>
              <div>
                <h4 className="font-semibold">{action.title}</h4>
                <p className="text-sm opacity-90">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Portfolios */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Recent Portfolios</h3>
          <Link
            to="#portfolios"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </Link>
        </div>

        {portfolios.length > 0 ? (
          <div className="space-y-4">
            {portfolios.slice(0, 3).map((portfolio) => (
              <div
                key={portfolio._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {portfolio.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {portfolio.content?.sections?.length || 0} sections •
                    {portfolio.published ? " Published" : " Draft"}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">
                    {portfolio.viewCount || 0} views
                  </span>
                  <Link
                    to={`/portfolio-builder/${portfolio._id}`}
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No portfolios yet
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first portfolio to get started
            </p>
            <Link
              to="/portfolio-builder/new"
              className="inline-block bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Create First Portfolio
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewSection;
