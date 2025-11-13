import React, { useState } from "react";
import { Link } from "react-router-dom";
import PublishModal from "../PortfolioBuilder/PublishModal";

const PortfoliosSection = ({
  portfolios,
  isLoading,
  handleDeletePortfolio,
  handleTogglePublish,
}) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);

  const handlePublishClick = (portfolio) => {
    setSelectedPortfolio(portfolio);
    setPublishModalOpen(true);
    setOpenMenuId(null);
  };

  const handlePublishSubmit = async (slug) => {
    if (selectedPortfolio) {
      await handleTogglePublish(selectedPortfolio, slug);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            My Portfolios
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Manage and organize your portfolio collection
          </p>
        </div>
        <Link
          to="/portfolio-builder/new"
          className="w-full sm:w-auto bg-[#fb8500] text-white px-4 sm:px-6 py-3 border-2 border-[#fb8500] font-bold uppercase tracking-wider hover:bg-white hover:text-[#fb8500] transition-all duration-300 flex items-center justify-center space-x-2 rounded-lg"
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
          <span className="text-sm sm:text-base">New Portfolio</span>
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
            className="inline-block bg-[#fb8500] text-white px-8 py-4 border-2 border-[#fb8500] font-bold uppercase tracking-wider hover:bg-white hover:text-[#fb8500] transition-all duration-300 rounded-lg"
          >
            Create First Portfolio
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((portfolio, index) => {
            // Validate portfolio has an _id
            if (!portfolio._id) {
              console.warn('Portfolio missing _id:', portfolio);
              return null;
            }

            return (
            <div
              key={portfolio._id || `portfolio-${index}`}
              className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow overflow-visible relative"
            >
              {/* Portfolio Preview */}
              <div className="aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden rounded-t-xl">
                {portfolio.content?.sections?.length > 0 ? (
                  <div className="absolute inset-0 p-1 scale-[0.15] origin-top-left transform">
                    <div className="w-[667%] h-[600%] bg-white shadow-2xl">
                      <div className="p-12 space-y-8">
                        {portfolio.content.sections
                          .slice(0, 3)
                          .map((section, idx) => (
                            <div
                              key={`section-${portfolio._id}-${idx}`}
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

                {/* Action Buttons - Improved Design */}
                <div className="flex gap-2">
                  {/* Edit Button - Primary */}
                  <Link
                    to={`/portfolio-builder/${portfolio._id}`}
                    className="flex-1 bg-[#fb8500] text-white px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold hover:bg-[#ff9500] transition-all duration-300 flex items-center justify-center gap-2 rounded-xl shadow-sm hover:shadow-md group"
                  >
                    <svg className="w-4 sm:w-5 h-4 sm:h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className="uppercase tracking-wider">Edit Portfolio</span>
                  </Link>

                  {/* View Button - If Published */}
                  {portfolio.published && (
                    <Link
                      to={`/${portfolio.slug}/html`}
                      className="bg-white border-2 border-neutral-200 text-neutral-700 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold hover:border-[#fb8500] hover:text-[#fb8500] transition-all duration-300 flex items-center justify-center gap-2 rounded-xl group"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span className="uppercase tracking-wider hidden sm:inline">View</span>
                    </Link>
                  )}

                  {/* Three Dots Menu */}
                  <div className="relative z-10">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === portfolio._id ? null : portfolio._id)}
                      className="bg-white border-2 border-neutral-200 text-neutral-700 px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-bold hover:border-[#fb8500] hover:text-[#fb8500] transition-all duration-300 rounded-xl"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {openMenuId === portfolio._id && (
                      <>
                        {/* Backdrop to close menu */}
                        <div 
                          className="fixed inset-0 z-[100]" 
                          onClick={() => setOpenMenuId(null)}
                        ></div>
                        
                        {/* Menu Items */}
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border-2 border-neutral-200 overflow-visible z-[200]">
                          {/* Publish/Unpublish Option */}
                          <button
                            onClick={() => handlePublishClick(portfolio)}
                            className={`w-full px-4 py-3 text-left text-sm font-bold flex items-center gap-3 transition-all duration-300 ${
                              portfolio.published
                                ? "text-yellow-600 hover:bg-yellow-50"
                                : "text-green-600 hover:bg-green-50"
                            }`}
                          >
                            {portfolio.published ? (
                              <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                                <span>Unpublish</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Publish</span>
                              </>
                            )}
                          </button>

                          {/* Divider */}
                          <div className="border-t border-neutral-200"></div>

                          {/* Delete Option */}
                          <button
                            onClick={() => {
                              handleDeletePortfolio(portfolio._id);
                              setOpenMenuId(null);
                            }}
                            className="w-full px-4 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-3 transition-all duration-300"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Delete</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}

      {/* Publish Modal */}
      <PublishModal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        onPublish={handlePublishSubmit}
        currentSlug={selectedPortfolio?.slug || ''}
        portfolioTitle={selectedPortfolio?.title || 'My Portfolio'}
        isPublished={selectedPortfolio?.published || false}
        portfolioId={selectedPortfolio?._id}
      />
    </div>
  );
};

export default PortfoliosSection;
