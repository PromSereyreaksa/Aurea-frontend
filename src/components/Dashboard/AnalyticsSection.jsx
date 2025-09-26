import React from "react";

const AnalyticsSection = ({ portfolios }) => {
  // Calculate analytics data
  const totalViews = portfolios.reduce(
    (sum, portfolio) => sum + (portfolio.viewCount || 0),
    0
  );
  const publishedPortfolios = portfolios.filter((p) => p.published).length;
  const averageViews =
    portfolios.length > 0 ? Math.round(totalViews / portfolios.length) : 0;

  // Mock data for charts (in real app, this would come from API)
  const monthlyData = [
    { month: "Jan", views: 120 },
    { month: "Feb", views: 195 },
    { month: "Mar", views: 280 },
    { month: "Apr", views: 245 },
    { month: "May", views: 320 },
    { month: "Jun", views: 410 },
  ];

  const topPerformingPortfolios = [...portfolios]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-lg text-gray-600">
          Track your portfolio performance and audience engagement
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-3xl font-bold text-gray-900">
                {totalViews.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
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
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">+18% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Avg. Views per Portfolio
              </p>
              <p className="text-3xl font-bold text-gray-900">{averageViews}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
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
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">+12% improvement</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Published Rate
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {Math.round((publishedPortfolios / portfolios.length) * 100) ||
                  0}
                %
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-purple-600"
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
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {publishedPortfolios} of {portfolios.length} published
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-3xl font-bold text-gray-900">410</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">+28% vs last month</p>
        </div>
      </div>

      {/* Views Chart */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Views Over Time
        </h3>
        <div className="h-64 flex items-end justify-between space-x-4">
          {monthlyData.map((data, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className="bg-blue-600 rounded-t w-full transition-all duration-500"
                style={{ height: `${(data.views / 410) * 200}px` }}
              ></div>
              <p className="text-sm text-gray-600 mt-2">{data.month}</p>
              <p className="text-xs text-gray-500">{data.views}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Performing Portfolios */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Top Performing Portfolios
          </h3>
          {topPerformingPortfolios.length > 0 ? (
            <div className="space-y-4">
              {topPerformingPortfolios.map((portfolio, index) => (
                <div
                  key={portfolio._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {portfolio.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {portfolio.published ? "Published" : "Draft"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {portfolio.viewCount || 0}
                    </p>
                    <p className="text-sm text-gray-600">views</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">
              No portfolio data available
            </p>
          )}
        </div>

        {/* Recent Activity Summary */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-green-600"
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
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Portfolio Published
                </p>
                <p className="text-xs text-gray-600">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-blue-600"
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
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  47 New Views
                </p>
                <p className="text-xs text-gray-600">Today</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-purple-600"
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
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  New Portfolio Created
                </p>
                <p className="text-xs text-gray-600">Yesterday</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;
