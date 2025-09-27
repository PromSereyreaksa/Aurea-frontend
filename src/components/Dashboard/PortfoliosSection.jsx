import React from "react";
import { Link } from "react-router-dom";

const PortfoliosSection = ({
  portfolios,
  isLoading,
  handleDeletePortfolio,
  handleTogglePublish,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Portfolios
          </h1>
          <p className="text-lg text-gray-600">
            Manage and organize your portfolio collection
          </p>
        </div>
        <Link
          to="/portfolio-builder/new"
          className="bg-[#fb8500] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#fb8500]/90 transition-colors flex items-center space-x-2"
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span>New Portfolio</span>
        </Link>
      </div>

      {portfolios.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
          <svg
            className="w-20 h-20 text-gray-300 mx-auto mb-6"
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
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Your creative journey starts here
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first portfolio to showcase your amazing work
          </p>
          <Link
            to="/portfolio-builder/new"
            className="inline-block bg-[#fb8500] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#fb8500]/90 transition-colors"
          >
            Create First Portfolio
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((portfolio) => (
            <div
              key={portfolio._id}
              className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
            >
              {/* Portfolio Preview */}
              <div className="aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                {portfolio.content?.sections?.length > 0 ? (
                  <div className="absolute inset-0 p-1 scale-[0.15] origin-top-left transform">
                    <div className="w-[667%] h-[600%] bg-white shadow-2xl">
                      <div className="p-12 space-y-8">
                        {portfolio.content.sections
                          .slice(0, 3)
                          .map((section, idx) => (
                            <div
                              key={idx}
                              className="border-b border-gray-100 pb-6"
                            >
                              {section.type === "hero" && (
                                <div className="text-center py-12">
                                  <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-6"></div>
                                  <div className="h-8 bg-gray-800 w-48 mx-auto mb-4 rounded"></div>
                                  <div className="h-5 bg-gray-400 w-64 mx-auto rounded"></div>
                                </div>
                              )}
                              {section.type === "about" && (
                                <div className="flex space-x-6">
                                  <div className="w-32 h-32 bg-gray-300 rounded-lg"></div>
                                  <div className="flex-1 space-y-3">
                                    <div className="h-6 bg-gray-800 w-32 rounded"></div>
                                    <div className="h-4 bg-gray-400 w-full rounded"></div>
                                    <div className="h-4 bg-gray-400 w-4/5 rounded"></div>
                                    <div className="h-4 bg-gray-400 w-3/5 rounded"></div>
                                  </div>
                                </div>
                              )}
                              {section.type === "projects" && (
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="aspect-square bg-gray-300 rounded-lg"></div>
                                  <div className="aspect-square bg-gray-300 rounded-lg"></div>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <svg
                        className="w-12 h-12 text-gray-400 mx-auto mb-3"
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
                      <p className="text-sm text-gray-500">
                        No preview available
                      </p>
                    </div>
                  </div>
                )}

                {/* Template Badge */}
                {portfolio.templateId && (
                  <div className="absolute top-3 left-3 bg-[#fb8500]/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                    Template
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">
                    {portfolio.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {portfolio.content?.sections?.length || 0} sections •{" "}
                    {new Date(portfolio.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        portfolio.published
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {portfolio.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
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
                    {portfolio.viewCount || 0}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <Link
                    to={`/portfolio-builder/${portfolio._id}`}
                    className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors text-center"
                  >
                    Edit
                  </Link>
                  {portfolio.published && (
                    <Link
                      to={`/portfolio/${portfolio.slug}`}
                      className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors text-center"
                    >
                      View
                    </Link>
                  )}
                  <button
                    onClick={() => handleTogglePublish(portfolio)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      portfolio.published
                        ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {portfolio.published ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={() => handleDeletePortfolio(portfolio._id)}
                    className="px-3 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfoliosSection;
