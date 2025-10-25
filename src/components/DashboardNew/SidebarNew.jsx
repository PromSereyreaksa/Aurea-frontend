import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Folder, Copy, BarChart, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import '../../styles/android-animations.css';

const Sidebar = ({ currentPage, setCurrentPage, isCollapsed = false, setIsCollapsed, isMobileOpen = false, setIsMobileOpen }) => {
  const navigate = useNavigate();
  const [showAnalyticsModal, setShowAnalyticsModal] = React.useState(false);
  const [isDesktop, setIsDesktop] = React.useState(window.innerWidth >= 1024);

  // Detect screen size changes
  React.useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const styles = {
    sidebar: {
      width: isCollapsed ? '60px' : '200px',
      backgroundColor: '#f8f9fa',
      padding: isCollapsed ? '72px 4px 50px 4px' : '72px 8px 50px 8px',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid #e0e0e0',
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      overflowY: 'auto',
      overflowX: 'hidden',
      transition: 'all 280ms cubic-bezier(0.4, 0.0, 0.2, 1)',
      WebkitOverflowScrolling: 'touch',
      zIndex: 1001,
      maxHeight: '100vh',
    },
    sidebarMobile: {
      transform: isMobileOpen || isDesktop ? 'translateX(0)' : 'translateX(-100%)',
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: isMobileOpen ? 'block' : 'none',
      zIndex: 1000,
      transition: 'opacity 250ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    },
    navItem: {
      display: 'flex',
      alignItems: 'center',
      gap: isCollapsed ? '0' : '12px',
      padding: isCollapsed ? '10px 8px' : '10px 16px',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 150ms cubic-bezier(0.4, 0.0, 0.2, 1)',
      marginBottom: '4px',
      fontSize: '14px',
      color: '#1a1a1a',
      whiteSpace: 'nowrap',
    },
    navItemActive: {
      backgroundColor: '#fb8500',
      color: '#fff',
    },
    toggleButton: {
      position: 'absolute',
      bottom: '16px',
      right: isCollapsed ? 'auto' : '16px',
      left: isCollapsed ? '50%' : 'auto',
      transform: isCollapsed ? 'translateX(-50%)' : 'none',
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      backgroundColor: '#fff',
      border: '1px solid #e0e0e0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      zIndex: 10,
      transition: 'all 0.3s ease',
    },
  };

  const navItems = [
    { page: 'dashboard', icon: <Home size={18} />, label: 'Dashboard', isSection: true },
    { page: 'portfolios', icon: <Folder size={18} />, label: 'Portfolios', isSection: true },
    { page: 'templates', icon: <Copy size={18} />, label: 'Templates', route: '/templates' },
    { page: 'analytics', icon: <BarChart size={18} />, label: 'Analytics', isSection: false },
  ];

  const handleNavClick = (item) => {
    if (item.page === 'analytics') {
      // Show under development modal
      setShowAnalyticsModal(true);
    } else if (item.route) {
      navigate(item.route);
    } else if (item.isSection) {
      setCurrentPage(item.page);
    }
    // Close mobile menu after navigation
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Analytics Under Development Modal */}
      {showAnalyticsModal && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
            }}
            onClick={() => setShowAnalyticsModal(false)}
          >
            <div
              style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                padding: '32px',
                maxWidth: '400px',
                width: '90%',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                textAlign: 'center',
              }}
              onClick={(e) => e.stopPropagation()}
              className="scale-in"
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#fff5e6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <BarChart size={32} color="#fb8500" />
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1a1a1a',
                marginBottom: '12px',
              }}>
                Analytics Coming Soon
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#666',
                marginBottom: '24px',
                lineHeight: '1.5',
              }}>
                We're currently working on the analytics feature. Stay tuned for insights about your portfolio performance!
              </p>
              <button
                onClick={() => setShowAnalyticsModal(false)}
                style={{
                  padding: '12px 32px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#fb8500',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                }}
                className="button-press ripple-container"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ff9500'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fb8500'}
              >
                Got it
              </button>
            </div>
          </div>
        </>
      )}

      {/* Mobile Overlay */}
      <div
        style={styles.overlay}
        className="modal-backdrop"
        onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
      />

      {/* Sidebar */}
      <div
        style={{
          ...styles.sidebar,
          ...styles.sidebarMobile,
        }}
        className={`sidebar-desktop slide-in-left ${isMobileOpen ? 'mobile-open' : ''}`}
      >
      {/* Toggle Button */}
      {/* Copyright Text */}
      {!isCollapsed && (
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          fontSize: '11px',
          color: '#999',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
        }}>
          Aurea ©
        </div>
      )}

      {/* Toggle Button */}
      <div
        style={styles.toggleButton}
        className="button-press ripple-container"
        onClick={() => setIsCollapsed && setIsCollapsed(!isCollapsed)}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </div>

      {navItems.map((item) => (
        <div
          key={item.page}
          style={{
            ...styles.navItem,
            ...(currentPage === item.page ? styles.navItemActive : {}),
            justifyContent: isCollapsed ? 'center' : 'space-between',
          }}
          className="ripple-container"
          onClick={() => handleNavClick(item)}
          title={isCollapsed ? item.label : ''}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: isCollapsed ? '0' : '12px' }}>
            {item.icon}
            {!isCollapsed && <span>{item.label}</span>}
          </div>
          {!isCollapsed && item.route && (
            <ArrowUpRight size={14} style={{ opacity: 0.5 }} />
          )}
        </div>
      ))}

      </div>
    </>
  );
};

export default Sidebar;