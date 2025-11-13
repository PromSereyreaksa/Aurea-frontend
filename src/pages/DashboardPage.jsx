import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import usePortfolioStore from "../stores/portfolioStore";
import Navbar from "../components/Shared/Navbar";
import DashboardSidebar from "../components/Dashboard/DashboardSidebar";
import DashboardBottomBar from "../components/Dashboard/DashboardBottomBar";
import OverviewSection from "../components/Dashboard/OverviewSection";
import PortfoliosSection from "../components/Dashboard/PortfoliosSection";
import AnalyticsSection from "../components/Dashboard/AnalyticsSection";
import PriceCalculator from "../components/Dashboard/PriceCalculator";
import TipsAndTutorials from "../components/Dashboard/TipsAndTutorials";

const DashboardPage = () => {
  const { user, isAuthenticated } = useAuthStore();
  const {
    portfolios,
    isLoading,
    fetchUserPortfolios,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
    publishPortfolio,
    unpublishPortfolio,
  } = usePortfolioStore();

  const [activeSection, setActiveSection] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Wrapper function to handle section change and close sidebar on mobile
  const handleSetActiveSection = (section) => {
    setActiveSection(section);
    setIsSidebarOpen(false); // Close sidebar when switching tabs
  };

  // Close sidebar on scroll (mobile only)
  useEffect(() => {
    const handleScroll = () => {
      if (isSidebarOpen && window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserPortfolios();
    }
  }, [isAuthenticated, fetchUserPortfolios]);

  if (!isAuthenticated) {
    return (
      <div className="app-page min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Please log in to access your dashboard
            </h1>
            <Link
              to="/login"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleCreatePortfolio = async () => {
    const newPortfolio = {
      title: "New Portfolio",
      description: "Description for new portfolio",
      isPublic: false,
      content: { sections: [] },
    };
    await createPortfolio(newPortfolio);
  };

  const handleDeletePortfolio = async (id) => {
    if (window.confirm("Are you sure you want to delete this portfolio?")) {
      await deletePortfolio(id);
    }
  };

  const handleTogglePublish = async (portfolio, slug = null) => {
    if (portfolio.published) {
      await unpublishPortfolio(portfolio._id);
    } else {
      await publishPortfolio(portfolio._id, slug);
    }
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <OverviewSection
            user={user}
            portfolios={portfolios}
            onCreatePortfolio={handleCreatePortfolio}
            isLoading={isLoading}
            setActiveSection={setActiveSection}
          />
        );
      case "portfolios":
        return (
          <PortfoliosSection
            portfolios={portfolios}
            isLoading={isLoading}
            handleDeletePortfolio={handleDeletePortfolio}
            handleTogglePublish={handleTogglePublish}
          />
        );
      case "analytics":
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-[#fb8500] to-[#fb8500]/80 p-6 md:p-8 text-white">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-white/20 p-3 md:p-4 rounded-full">
                  <svg
                    className="w-8 h-8 md:w-12 md:h-12"
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
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
                Analytics Dashboard
              </h2>
              <p className="text-orange-100 text-center text-base md:text-lg">
                Coming Soon
              </p>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 md:p-8">
              <div className="text-center mb-6 md:mb-8">
                <p className="text-gray-600 text-base md:text-lg mb-4 md:mb-6">
                  We're building powerful analytics to help you understand your
                  portfolio performance. Soon, you'll be able to:
                </p>
              </div>

              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#fb8500]/10 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-[#fb8500]"
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
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Track Portfolio Views
                    </h3>
                    <p className="text-gray-600 text-sm">
                      See how many people are viewing your portfolios and which
                      sections they engage with most
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#fb8500]/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-[#fb8500]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Performance Insights
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Get detailed insights into visitor behavior, popular
                      projects, and engagement metrics
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#fb8500]/15 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-[#fb8500]"
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
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Growth Tracking
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Monitor your portfolio's growth over time with beautiful
                      charts and trends
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#fb8500]/25 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-[#fb8500]"
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
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Real-time Updates
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Stay updated with live visitor tracking and instant
                      performance notifications
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center px-4 py-2 bg-[#fb8500]/10 text-[#fb8500] rounded-full text-sm font-medium">
                  <svg
                    className="w-4 h-4 mr-2"
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
                  Thank you for your patience—we can't wait to share this with
                  you!
                </div>
              </div>
            </div>
          </div>
        );
      case "pricing":
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-[#fb8500] to-[#fb8500]/70 p-6 md:p-8 text-white">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-white/20 p-3 md:p-4 rounded-full">
                  <svg
                    className="w-8 h-8 md:w-12 md:h-12"
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
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
                Pricing Section
              </h2>
              <p className="text-orange-100 text-center text-base md:text-lg">
                Under Development
              </p>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 md:p-8">
              <div className="text-center mb-6 md:mb-8">
                <p className="text-gray-600 text-base md:text-lg mb-4 md:mb-6">
                  We're currently building this feature. Soon, you'll be able
                  to:
                </p>
              </div>

              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#fb8500]/10 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-[#fb8500]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Upload Client Briefs
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Simply upload a client's brief or requirements document to
                      get started
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#fb8500]/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-[#fb8500]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Manual Entry
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Or manually enter requirements and deliverables for
                      complete control
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#fb8500]/15 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-[#fb8500]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Instant Pricing
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Instantly calculate pricing based on project scope and
                      deliverables
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#fb8500]/25 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-[#fb8500]"
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
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Generate Proposals
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Generate a ready-to-send invoice and proposal template
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center px-4 py-2 bg-[#fb8500]/10 text-[#fb8500] rounded-full text-sm font-medium">
                  <svg
                    className="w-4 h-4 mr-2"
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
                  Thank you for your patience—we can't wait to share this with
                  you!
                </div>
              </div>
            </div>
          </div>
        );
      case "learning":
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-[#fb8500] to-[#fb8500]/60 p-6 md:p-8 text-white">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-white/20 p-3 md:p-4 rounded-full">
                  <svg
                    className="w-8 h-8 md:w-12 md:h-12"
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
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
                Business Hub
              </h2>
              <p className="text-orange-100 text-center text-base md:text-lg">
                Coming Soon
              </p>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 md:p-8">
              <div className="text-center mb-6 md:mb-8">
                <p className="text-gray-600 text-base md:text-lg mb-4 md:mb-6">
                  We're building a comprehensive business hub to help you grow
                  your freelance career and win more clients. Soon, you'll have
                  access to:
                </p>
              </div>

              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#fb8500]/10 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-[#fb8500]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Pitch Templates
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Professional pitch templates that help you win clients and
                      close deals faster
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#fb8500]/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-[#fb8500]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Client Acquisition Strategies
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Learn proven strategies to find, approach, and convert
                      potential clients
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#fb8500]/15 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-[#fb8500]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Email Templates
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Ready-to-use email templates for follow-ups, proposals,
                      and client communication
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#fb8500]/25 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-[#fb8500]"
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
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Pricing Strategies
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Master different pricing models and strategies to maximize
                      your earnings
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center px-4 py-2 bg-[#fb8500]/10 text-[#fb8500] rounded-full text-sm font-medium">
                  <svg
                    className="w-4 h-4 mr-2"
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
                  Get ready to level up your business skills—coming soon!
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <OverviewSection
            user={user}
            portfolios={portfolios}
            onCreatePortfolio={handleCreatePortfolio}
            isLoading={isLoading}
          />
        );
    }
  };

  return (
    <div className="app-page min-h-screen bg-white overflow-x-hidden">
      {/* Mobile/Tablet Logo in Top-Center (hidden when sidebar opens on small screens) */}
      <div 
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-center py-4 bg-white border-b border-gray-100 transition-all duration-300 ease-in-out ${
          isSidebarOpen 
            ? 'hidden sm:flex sm:justify-start sm:px-4' 
            : 'flex'
        } lg:hidden`}
      >
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200">
          <img
            src="/AUREA - Logo.jpg"
            alt="AUREA Logo"
            className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg object-cover ring-2 ring-[#fb8500]/30"
          />
          <span className="text-lg sm:text-xl font-black text-[#fb8500] tracking-tight">
            AUREA
          </span>
        </Link>
      </div>

      {/* Mobile/Tablet Hamburger Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 bg-gradient-to-r from-[#fb8500] to-[#ff9500] text-white p-2 sm:p-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isSidebarOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      <div className="flex">
        {/* Sidebar - Desktop (left) and Mobile/Tablet (right slide-in) */}
        <div
          className={`fixed top-0 h-screen w-full sm:w-80 md:w-96 lg:w-72 z-50 transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'right-0 translate-x-0' : 'right-0 translate-x-full'}
            lg:left-0 lg:right-auto lg:translate-x-0`}
        >
          <DashboardSidebar
            activeSection={activeSection}
            setActiveSection={handleSetActiveSection}
            user={user}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>

        {/* Main Content - Click to close sidebar on mobile */}
        <div 
          className="flex-1 w-full lg:ml-72"
          onClick={() => {
            if (isSidebarOpen && window.innerWidth < 1024) {
              setIsSidebarOpen(false);
            }
          }}
        >
          <div className="p-4 pt-24 sm:pt-28 lg:pt-8 lg:p-8 xl:p-10">
            <div className="max-w-7xl mx-auto">{renderActiveSection()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
