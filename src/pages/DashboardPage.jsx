import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import usePortfolioStore from "../stores/portfolioStore";
import Navbar from "../components/Shared/Navbar";
import DashboardSidebar from "../components/Dashboard/DashboardSidebar";
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

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserPortfolios();
    }
  }, [isAuthenticated, fetchUserPortfolios]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
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

  const handleTogglePublish = async (portfolio) => {
    if (portfolio.published) {
      await unpublishPortfolio(portfolio._id);
    } else {
      await publishPortfolio(portfolio._id);
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
            <div className="bg-gradient-to-r from-[#fb8500] to-[#fb8500]/80 p-8 text-white">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-white/20 p-4 rounded-full">
                  <svg
                    className="w-12 h-12"
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
              <h2 className="text-3xl font-bold text-center mb-2">
                Analytics Dashboard
              </h2>
              <p className="text-orange-100 text-center text-lg">Coming Soon</p>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="text-center mb-8">
                <p className="text-gray-600 text-lg mb-6">
                  We're building powerful analytics to help you understand your
                  portfolio performance. Soon, you'll be able to:
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
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
            <div className="bg-gradient-to-r from-[#fb8500] to-[#fb8500]/70 p-8 text-white">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-white/20 p-4 rounded-full">
                  <svg
                    className="w-12 h-12"
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
              <h2 className="text-3xl font-bold text-center mb-2">
                Pricing Section
              </h2>
              <p className="text-orange-100 text-center text-lg">
                Under Development
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="text-center mb-8">
                <p className="text-gray-600 text-lg mb-6">
                  We're currently building this feature. Soon, you'll be able
                  to:
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
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
            <div className="bg-gradient-to-r from-[#fb8500] to-[#fb8500]/60 p-8 text-white">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-white/20 p-4 rounded-full">
                  <svg
                    className="w-12 h-12"
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
              <h2 className="text-3xl font-bold text-center mb-2">
                Business Hub
              </h2>
              <p className="text-orange-100 text-center text-lg">Coming Soon</p>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="text-center mb-8">
                <p className="text-gray-600 text-lg mb-6">
                  We're building a comprehensive business hub to help you grow
                  your freelance career and win more clients. Soon, you'll have
                  access to:
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
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
      case "settings":
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Settings
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Account Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue={user?.name || ""}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue={user?.email || ""}
                    />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Privacy Settings
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-3" defaultChecked />
                    <span className="text-gray-700">
                      Make my profile public
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-3" defaultChecked />
                    <span className="text-gray-700">
                      Allow others to view my portfolios
                    </span>
                  </label>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-200">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Save Changes
                </button>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navbar />

      <div className="flex pt-20">
        {/* Sidebar */}
        <div className="fixed left-0 top-20 h-[calc(100vh-5rem)] z-30">
          <DashboardSidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            user={user}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-48 lg:ml-56">
          <div className="p-4 lg:p-8">
            <div className="max-w-6xl mx-auto">{renderActiveSection()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
