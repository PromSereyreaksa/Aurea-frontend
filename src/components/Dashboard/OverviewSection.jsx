import React from "react";
import { Link } from "react-router-dom";
import StatsCard from "./StatsCard";

const OverviewSection = ({ portfolios, user, setActiveSection }) => {
  // Calculate only relevant stats
  const publishedPortfolios = portfolios.filter((p) => p.isPublished || p.published).length;
  const totalPortfolios = portfolios.length;
  const unpublishedPortfolios = totalPortfolios - publishedPortfolios;
  
  // Get the latest unpublished portfolio for editing
  const latestUnpublishedPortfolio = portfolios.find((p) => !(p.isPublished || p.published));

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
      change: portfolios.length === 1 ? "portfolio created" : "portfolios created",
      changeType: "neutral",
      color: "orange",
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
      change: portfolios.length > 0 ? `${publishedPortfolios} of ${portfolios.length} live` : "0 portfolios",
      changeType: "neutral",
      color: "green",
    },
  ];

  const quickActions = [
    {
      title: "Create Portfolio",
      description: "Start building a new portfolio",
      link: "/portfolio-builder/new",
      color: "bg-[#fb8500] hover:bg-[#fb8500]/90",
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
      {/* Hero Section - No grid overlay, just gradient blobs */}
      <div className="relative mb-12 overflow-hidden">
        {/* Gradient Blobs - Background only */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#fb8500]/10 via-purple-500/10 to-blue-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#fb8500]/10 to-pink-500/10 rounded-full blur-3xl -z-10"></div>
        
        {/* Welcome Header */}
        <div className="relative">
          {/* Decorative geometric elements */}
          <div className="absolute -right-4 -top-4 w-32 h-32 border-4 border-[#fb8500] opacity-10 -z-10"></div>
          <div className="absolute -left-8 top-20 w-24 h-24 bg-[#fb8500] opacity-5 -z-10"></div>
          
          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none mb-4 text-[#1a1a1a]">
            Welcome back, {user?.name || 'Designer'}
          </h1>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-24 h-1.5 bg-[#fb8500]"></div>
            <div className="w-16 h-1.5 bg-[#fb8500] opacity-60"></div>
            <div className="w-8 h-1.5 bg-[#fb8500] opacity-30"></div>
          </div>
          
          {/* Dynamic Welcome Message with Animation - Full Width */}
          <div className="animate-fade-in">
            {unpublishedPortfolios > 0 ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 bg-orange-50 border-2 border-orange-200 rounded-xl">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 bg-[#fb8500] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base font-bold text-[#1a1a1a] mb-1">You're almost there!</p>
                    <p className="text-sm text-neutral-700">
                      Finish or continue building your portfolio to publish it and share it with the world.
                    </p>
                  </div>
                </div>
                <Link
                  to={latestUnpublishedPortfolio ? `/portfolio-builder/${latestUnpublishedPortfolio._id}` : '/portfolio-builder/new'}
                  className="px-5 py-2.5 bg-[#fb8500] hover:bg-[#ff9500] text-white font-bold text-sm rounded-lg transition-all duration-300 hover:shadow-lg flex-shrink-0 uppercase tracking-wider"
                >
                  Continue Editing
                </Link>
              </div>
            ) : publishedPortfolios > 0 ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 bg-green-50 border-2 border-green-200 rounded-xl">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base font-bold text-[#1a1a1a] mb-1">Your portfolio is live!</p>
                    <p className="text-sm text-neutral-700">
                      Keep creating amazing work or edit your existing portfolios to keep them fresh.
                    </p>
                  </div>
                </div>
                <Link
                  to={portfolios[0] ? `/portfolio-builder/${portfolios[0]._id}` : '/portfolio-builder/new'}
                  className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold text-sm rounded-lg transition-all duration-300 hover:shadow-lg flex-shrink-0 uppercase tracking-wider"
                >
                  Continue Editing
                </Link>
              </div>
            ) : (
              <p className="text-lg text-neutral-600">
                Manage your portfolios, track performance, and create stunning designs.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* PROFESSIONAL DASHBOARD LAYOUT - Clear Hierarchy */}
      
      {/* Section 1: Quick Stats - Primary Focus */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Portfolios */}
          <div className="bg-white border-2 border-neutral-200 p-6 rounded-xl hover:border-[#fb8500] transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-500 uppercase font-bold tracking-wider mb-2">Total Portfolios</p>
                <p className="text-4xl font-black text-[#1a1a1a]">{totalPortfolios}</p>
              </div>
              <div className="w-14 h-14 bg-[#fb8500]/10 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-[#fb8500]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
          </div>

          {/* Published */}
          <div className="bg-white border-2 border-neutral-200 p-6 rounded-xl hover:border-[#fb8500] transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-500 uppercase font-bold tracking-wider mb-2">Published</p>
                <p className="text-4xl font-black text-[#1a1a1a]">{publishedPortfolios}</p>
              </div>
              <div className="w-14 h-14 bg-[#fb8500]/10 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-[#fb8500]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Active Projects */}
          <div className="bg-white border-2 border-neutral-200 p-6 rounded-xl hover:border-[#fb8500] transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-500 uppercase font-bold tracking-wider mb-2">Active Projects</p>
                <p className="text-4xl font-black text-[#1a1a1a]">{totalPortfolios}</p>
              </div>
              <div className="w-14 h-14 bg-[#fb8500]/10 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-[#fb8500]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Quick Actions - Easy Access */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-6 bg-[#fb8500] rounded-full"></div>
          <h2 className="text-sm font-black text-[#1a1a1a] uppercase tracking-wider">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Link
            to="/portfolio-builder/new"
            className="flex items-center gap-3 p-4 bg-white border-2 border-neutral-200 hover:border-[#fb8500] rounded-xl transition-all duration-300 group shadow-sm hover:shadow-md"
          >
            <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-black text-[#1a1a1a] text-sm">Create New</p>
              <p className="text-neutral-500 text-xs">Start a new portfolio</p>
            </div>
          </Link>
          
          <button
            onClick={() => setActiveSection("portfolios")}
            className="flex items-center gap-3 p-4 bg-white border-2 border-neutral-200 hover:border-[#fb8500] rounded-xl transition-all duration-300 group shadow-sm hover:shadow-md text-left"
          >
            <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="font-black text-[#1a1a1a] text-sm">View All</p>
              <p className="text-neutral-500 text-xs">Browse portfolios</p>
            </div>
          </button>

          <Link
            to="/profile"
            className="flex items-center gap-3 p-4 bg-white border-2 border-neutral-200 hover:border-[#fb8500] rounded-xl transition-all duration-300 group shadow-sm hover:shadow-md"
          >
            <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-black text-[#1a1a1a] text-sm">Settings</p>
              <p className="text-neutral-500 text-xs">Manage account</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Section 3: Two Column Layout - Portfolio Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Last Edited Portfolio - Left */}
        <div>
        <div className="bg-white border-2 border-neutral-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#fb8500] rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h2 className="text-sm font-black text-[#1a1a1a] uppercase tracking-wider">Last Edited</h2>
            </div>

            {portfolios.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center rounded-xl border-2 border-dashed border-neutral-300 p-8">
                <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mb-3">
                  <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-sm text-neutral-600 font-bold mb-1">No portfolios yet</p>
                <p className="text-xs text-neutral-500">Create your first portfolio to get started</p>
              </div>
            ) : (
              <Link
                to={`/portfolio-builder/${portfolios[0]._id}`}
                className="group block rounded-xl border-2 border-neutral-200 p-5 hover:border-[#fb8500] hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-black text-[#1a1a1a] mb-2 group-hover:text-[#fb8500] transition-colors duration-300">
                      {portfolios[0].name || portfolios[0].title || 'Untitled Portfolio'}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-block px-3 py-1 bg-neutral-100 rounded-lg text-xs font-bold text-neutral-600 uppercase">
                        {portfolios[0].templateId || 'echelon'}
                      </span>
                      {(portfolios[0].isPublished || portfolios[0].published) && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#fb8500] text-white text-xs font-bold uppercase rounded-lg">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                          LIVE
                        </span>
                      )}
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-neutral-400 group-hover:text-[#fb8500] group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4 pt-4 border-t-2 border-neutral-100">
                  <div>
                    <p className="text-xs text-neutral-500 font-bold mb-1">Views</p>
                    <p className="text-2xl font-black text-[#1a1a1a]">{portfolios[0].viewCount || 0}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-neutral-500 font-bold mb-1">Updated</p>
                    <p className="text-sm font-black text-[#1a1a1a]">{new Date(portfolios[0].updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
        </div>

        {/* Published Portfolio Stats - Right */}
        <div>
        <div className="bg-white border-2 border-neutral-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#fb8500] rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-sm font-black text-[#1a1a1a] uppercase tracking-wider">Published Portfolio</h2>
            </div>

            {publishedPortfolios === 0 ? (
              <div className="flex flex-col items-center justify-center text-center rounded-xl border-2 border-dashed border-neutral-300 p-8">
                <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mb-3">
                  <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
                <p className="text-sm text-neutral-600 font-bold mb-1">No published portfolio</p>
                <p className="text-xs text-neutral-500">Publish to see it here</p>
              </div>
            ) : (() => {
              const publishedPortfolio = portfolios.find(p => p.isPublished || p.published);
              return publishedPortfolio ? (
                <a
                  href={`https://aurea.com/${user?.username || 'user'}/${publishedPortfolio.slug || publishedPortfolio._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-xl border-2 border-neutral-200 p-5 hover:border-[#fb8500] hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-black text-[#1a1a1a] mb-2 group-hover:text-[#fb8500] transition-colors duration-300">
                        {publishedPortfolio.name || publishedPortfolio.title || 'Untitled Portfolio'}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-block px-3 py-1 bg-neutral-100 rounded-lg text-xs font-bold text-neutral-600 uppercase">
                          {publishedPortfolio.templateId || 'echelon'}
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-xs font-bold uppercase rounded-lg">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                          LIVE
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 font-medium truncate">
                        aurea.com/{user?.username || 'user'}/{publishedPortfolio.slug || publishedPortfolio._id}
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-neutral-400 group-hover:text-[#fb8500] group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t-2 border-neutral-100">
                    <div>
                      <p className="text-xs text-neutral-500 font-bold mb-1">Views</p>
                      <p className="text-2xl font-black text-[#1a1a1a]">{publishedPortfolio.viewCount || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 font-bold mb-1">Status</p>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <p className="text-xs font-black text-green-600">Active</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 font-bold mb-1">Updated</p>
                      <p className="text-sm font-black text-[#1a1a1a]">
                        {new Date(publishedPortfolio.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </a>
              ) : null;
            })()}
          </div>
        </div>
        </div>

      </div>
    </div>
  );
};

export default OverviewSection;
