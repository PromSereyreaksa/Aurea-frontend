import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Package } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import usePortfolioStore from '../stores/portfolioStore';
import TopNavBar from '../components/DashboardNew/TopNavbarNew';
import Sidebar from '../components/DashboardNew/SidebarNew';
import PortfoliosSectionNew from '../components/DashboardNew/PortfoliosSectionNew';
import '../styles/dashboard-responsive.css';
import '../styles/android-animations.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user: rawUser, isAuthenticated } = useAuthStore();
  const { portfolios, isLoading, fetchUserPortfolios } = usePortfolioStore();

  // Handle nested user object structure (same as TopNavBar)
  const user = rawUser?.user || rawUser;

  // Persist current page to localStorage
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('dashboard-current-page') || 'dashboard';
  });
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Save current page to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('dashboard-current-page', currentPage);
  }, [currentPage]);

  // Fetch portfolios on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserPortfolios();
    }
  }, [isAuthenticated, fetchUserPortfolios]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Handle creating new portfolio
  const handleCreatePortfolio = () => {
    navigate('/templates');
  };

  return (
    <>
      <TopNavBar
        isUserMenuOpen={isUserMenuOpen}
        setIsUserMenuOpen={setIsUserMenuOpen}
        setCurrentPage={setCurrentPage}
        user={user}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />

      <div className="dashboard-main-content" style={{ marginLeft: isSidebarCollapsed ? '60px' : '200px', paddingTop: '56px', transition: 'margin-left 280ms cubic-bezier(0.4, 0.0, 0.2, 1)' }}>
        {/* Render different sections based on currentPage */}
        {currentPage === 'portfolios' ? (
          <div className="fade-in">
            <PortfoliosSectionNew portfolios={portfolios} isLoading={isLoading} />
          </div>
        ) : (
          <div className="fade-in dashboard-content-wrapper" style={{ padding: '32px', backgroundColor: '#fafafa' }}>
            {/* User Header Section */}
            <div className="dashboard-section" style={{ padding: '32px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e0e0e0', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: '#fb8500', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Building size={24} color="#fff" />
                </div>
                <div style={{ fontSize: '24px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
                  {user?.username || user?.name || 'User'}
                </div>
              </div>
            </div>

            {/* Portfolios Section */}
            <div className="dashboard-section" style={{ padding: '32px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e0e0e0', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              PORTFOLIOS
              <span style={{ color: '#999', fontWeight: '400', textTransform: 'none', marginLeft: '8px' }}>
                {portfolios.length} {portfolios.length === 1 ? 'portfolio' : 'portfolios'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span
                onClick={() => setCurrentPage('portfolios')}
                style={{ fontSize: '13px', color: '#fb8500', cursor: 'pointer', fontWeight: '500' }}
              >
                View all
              </span>
            </div>
          </div>

              <div style={{ marginBottom: '48px' }}>
                {portfolios.length === 0 ? (
                  <div style={{ padding: '48px', textAlign: 'center', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                    <Package size={48} color="#ccc" style={{ margin: '0 auto 16px' }} />
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' }}>
                      No portfolios yet
                    </div>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
                      Create your first portfolio to get started
                    </div>
                    <button
                      onClick={handleCreatePortfolio}
                      style={{ padding: '12px 24px', borderRadius: '6px', border: 'none', backgroundColor: '#fb8500', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
                    >
                      Create Portfolio
                    </button>
                  </div>
                ) : (
                  <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
                    {portfolios.slice(0, 4).map((portfolio, index) => {
                      // Consistent color based on portfolio ID
                      const colors = ['#ff9900', '#5588ff', '#00ccaa', '#ff6633', '#9966ff', '#ff3399'];
                      const getColorForPortfolio = (portfolioId) => {
                        if (!portfolioId) return colors[0];
                        let hash = 0;
                        for (let i = 0; i < portfolioId.length; i++) {
                          hash = portfolioId.charCodeAt(i) + ((hash << 5) - hash);
                        }
                        return colors[Math.abs(hash) % colors.length];
                      };
                      const color = getColorForPortfolio(portfolio._id);

                      // Calculate time since last update
                      const updatedDate = new Date(portfolio.updatedAt || portfolio.createdAt);
                      const now = Date.now();
                      const diffMs = now - updatedDate.getTime();
                      const hoursAgo = Math.floor(diffMs / (1000 * 60 * 60));
                      const daysAgo = Math.floor(diffMs / (1000 * 60 * 60 * 24));

                      let dateText;
                      if (hoursAgo < 1) {
                        dateText = 'Updated recently';
                      } else if (hoursAgo < 24) {
                        dateText = `Updated ${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`;
                      } else if (daysAgo === 1) {
                        dateText = 'Updated 1 day ago';
                      } else {
                        dateText = `Updated ${daysAgo} days ago`;
                      }

                      return (
                        <div
                          key={portfolio._id}
                          onClick={() => navigate(`/portfolio-builder/${portfolio._id}`)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            padding: '12px 16px',
                            backgroundColor: '#fff',
                            cursor: 'pointer',
                            borderBottom: index < portfolios.slice(0, 4).length - 1 ? '1px solid #e0e0e0' : 'none',
                          }}
                        >
                          <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Package size={20} color="#fff" />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '15px', fontWeight: '500', color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {portfolio.title || 'Untitled Portfolio'}
                            </div>
                            <div style={{ fontSize: '13px', color: '#666' }}>{dateText}</div>
                          </div>
                          {portfolio.published && (
                            <div style={{ padding: '4px 8px', backgroundColor: '#00ccaa', color: '#fff', borderRadius: '4px', fontSize: '11px', fontWeight: '600', flexShrink: 0 }}>
                              PUBLISHED
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Discover Section */}
            <div className="dashboard-section" style={{ padding: '32px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>DISCOVER</div>
              <div className="discover-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {[
                  { label: 'PRICING', title: 'Pricing Plans', desc: 'Explore our flexible pricing options tailored for your needs' },
                  { label: 'LEARNING', title: 'Learning Resources', desc: 'Access tutorials, guides, and documentation to master your portfolio' },
                ].map((card, i) => (
                  <div key={i} style={{ padding: '24px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0', cursor: 'pointer' }} className="button-press ripple-container">
                    <div style={{ fontSize: '11px', color: '#fb8500', marginBottom: '12px', fontWeight: '600' }}>{card.label}</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' }}>{card.title}</div>
                    <div style={{ fontSize: '14px', color: '#666' }}>{card.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;