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
import RecentActivity from "../components/Dashboard/RecentActivity";
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
          />
        );
      case "portfolios":
        return (
          <PortfoliosSection
            portfolios={portfolios}
            onCreatePortfolio={handleCreatePortfolio}
            onUpdatePortfolio={updatePortfolio}
            onDeletePortfolio={handleDeletePortfolio}
            onPublishPortfolio={handleTogglePublish}
            isLoading={isLoading}
          />
        );
      case "analytics":
        return <AnalyticsSection portfolios={portfolios} user={user} />;
      case "pricing":
        return <PriceCalculator />;
      case "activity":
        return <RecentActivity portfolios={portfolios} user={user} />;
      case "learning":
        return <TipsAndTutorials />;
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
        <div className="fixed left-0 top-20 h-[calc(100vh-5rem)] overflow-y-auto z-30">
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
