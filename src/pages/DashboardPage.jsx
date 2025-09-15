import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../stores/authStore';
import usePortfolioStore from '../stores/portfolioStore';
import Navbar from '../components/Shared/Navbar';

const DashboardPage = () => {
  const { user, logout } = useAuthStore();
  const { 
    portfolios, 
    isLoading, 
    fetchUserPortfolios, 
    deletePortfolio, 
    publishPortfolio, 
    unpublishPortfolio 
  } = usePortfolioStore();

  useEffect(() => {
    fetchUserPortfolios();
  }, [fetchUserPortfolios]);

  const handleDeletePortfolio = async (id) => {
    if (window.confirm('Are you sure you want to delete this portfolio?')) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-xl text-gray-600">
                Manage your portfolios and create stunning designs
              </p>
            </div>
            <Link
              to="/portfolio-builder/new"
              className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Create Portfolio
            </Link>
          </div>

          {/* Portfolios Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
          ) : portfolios.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="bg-white rounded-2xl p-12 shadow-sm">
                <svg className="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No portfolios yet</h3>
                <p className="text-gray-600 mb-6">Create your first portfolio to get started</p>
                <Link
                  to="/portfolio-builder/new"
                  className="inline-block bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Create Your First Portfolio
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolios.map((portfolio, index) => (
                <motion.div
                  key={portfolio._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
                >
                  {/* Portfolio Preview */}
                  <div className="aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                    {portfolio.content?.sections?.length > 0 ? (
                      <div className="absolute inset-0 p-2 scale-[0.2] origin-top-left transform">
                        <div className="w-[500%] h-[500%] bg-white">
                          {/* Mini preview of the first few sections */}
                          <div className="p-8 space-y-6">
                            {portfolio.content.sections.slice(0, 3).map((section, idx) => (
                              <div key={idx} className="border-b border-gray-100 pb-4">
                                {section.type === 'hero' && (
                                  <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
                                    <div className="h-6 bg-gray-800 w-32 mx-auto mb-2 rounded"></div>
                                    <div className="h-4 bg-gray-400 w-48 mx-auto rounded"></div>
                                  </div>
                                )}
                                {section.type === 'about' && (
                                  <div className="flex space-x-4">
                                    <div className="w-20 h-20 bg-gray-300 rounded"></div>
                                    <div className="flex-1 space-y-2">
                                      <div className="h-4 bg-gray-800 w-24 rounded"></div>
                                      <div className="h-3 bg-gray-400 w-full rounded"></div>
                                      <div className="h-3 bg-gray-400 w-3/4 rounded"></div>
                                    </div>
                                  </div>
                                )}
                                {section.type === 'projects' && (
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="aspect-square bg-gray-300 rounded"></div>
                                    <div className="aspect-square bg-gray-300 rounded"></div>
                                  </div>
                                )}
                                {section.type === 'contact' && (
                                  <div className="text-center space-y-2">
                                    <div className="h-4 bg-gray-800 w-20 mx-auto rounded"></div>
                                    <div className="h-3 bg-gray-400 w-32 mx-auto rounded"></div>
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
                          <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          <p className="text-xs text-gray-500">No preview available</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Template Badge */}
                    {portfolio.templateId && (
                      <div className="absolute top-2 left-2 bg-black/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                        {portfolio.templateId === 'minimal-designer' ? 'Minimal Designer' : 'Template'}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{portfolio.title}</h3>
                      <p className="text-gray-600 text-sm">
                        {portfolio.content?.sections?.length || 0} sections • Created {new Date(portfolio.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          portfolio.published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {portfolio.published ? 'Published' : 'Draft'}
                        </span>
                        {portfolio.isPublic && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Public
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">{portfolio.viewCount || 0} views</span>
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
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {portfolio.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => handleDeletePortfolio(portfolio._id)}
                        className="px-3 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;