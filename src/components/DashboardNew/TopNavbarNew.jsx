import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Shield, HelpCircle, MessageSquare, Grid, CreditCard, ChevronRight, Globe, LogOut, Menu } from 'lucide-react';
import useAuthStore from '../../stores/authStore';
import '../../styles/android-animations.css';

const TopNavBar = ({ isUserMenuOpen, setIsUserMenuOpen, setCurrentPage, user: propUser, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);
  const storeUser = useAuthStore(state => state.user);
  const [isClosing, setIsClosing] = React.useState(false);

  // Use prop user if provided, otherwise get from store
  // Handle nested user object structure (same as ProfilePage)
  const rawUser = propUser || storeUser;
  const user = rawUser?.user || rawUser;

  console.log('TopNavBar - Raw user:', rawUser);
  console.log('TopNavBar - Processed user:', user);
  console.log('TopNavBar - isUserMenuOpen:', isUserMenuOpen);

  // Close dropdown with animation
  const handleCloseDropdown = React.useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsUserMenuOpen(false);
      setIsClosing(false);
    }, 150); // Match dropdown-exit animation duration
  }, [setIsUserMenuOpen]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !isClosing) {
        handleCloseDropdown();
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isUserMenuOpen, isClosing, handleCloseDropdown]);

  // Get user initials
  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    if (user?.name) {
      const names = user.name.split(' ');
      return names.length > 1
        ? `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase()
        : user.name.slice(0, 2).toUpperCase();
    }
    return user?.username?.slice(0, 2).toUpperCase() || 'U';
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  const styles = {
    topNav: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '56px',
      backgroundColor: '#fff',
      color: '#1a1a1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      zIndex: 1002,
      borderBottom: '1px solid #e0e0e0',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '18px',
      fontWeight: '600',
      color: '#1a1a1a',
      padding: '6px 12px 6px 6px',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'background-color 150ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    },
    topNavIcons: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    iconButton: {
      width: '36px',
      height: '36px',
      borderRadius: '6px',
      border: 'none',
      backgroundColor: 'transparent',
      color: '#666',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 150ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    },
    userSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 12px',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'background-color 150ms cubic-bezier(0.4, 0.0, 0.2, 1)',
      position: 'relative',
    },
    userAvatar: {
      width: '28px',
      height: '28px',
      borderRadius: '50%',
      backgroundColor: '#fb8500',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '600',
      fontSize: '12px',
      color: '#fff',
      pointerEvents: 'none',
    },
    userDropdown: {
      position: 'absolute',
      top: '48px',
      right: 0,
      width: '280px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      border: '1px solid #e0e0e0',
      padding: '8px',
      zIndex: 2000,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
  };

  return (
    <div style={styles.topNav}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
        {/* Mobile Burger Menu */}
        <button
          style={{
            ...styles.iconButton,
            display: 'block',
          }}
          className="mobile-burger-menu"
          onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu size={20} />
        </button>

        {/* Logo */}
        <div
          style={styles.logo}
          onClick={() => navigate('/')}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          className="button-press ripple-container"
        >
          <img
            src="/AUREA - Logo.png"
            alt="Aurea Logo"
            style={{ height: '24px', width: 'auto', flexShrink: 0, pointerEvents: 'none' }}
            className="logo-image-mobile"
          />
          <span className="logo-text-desktop" style={{ color: '#fb8500', fontWeight: '700', fontSize: '24px', flexShrink: 0, pointerEvents: 'none' }}>AUREA</span>
        </div>
      </div>

      <div style={styles.topNavIcons}>
        <div
          style={styles.userSection}
          onClick={(e) => {
            e.stopPropagation();
            console.log('User section clicked!');
            if (isUserMenuOpen) {
              handleCloseDropdown();
            } else {
              setIsUserMenuOpen(true);
            }
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <span style={{ fontSize: '14px', color: '#1a1a1a', pointerEvents: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
            {user?.username || user?.name || 'User'}
          </span>
          <div style={{ ...styles.userAvatar, flexShrink: 0 }} className="scale-in">
            {user?.avatar || user?.profilePicture ? (
              <img
                src={user.avatar || user.profilePicture}
                alt="Avatar"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', pointerEvents: 'none' }}
              />
            ) : (
              getInitials()
            )}
          </div>

          {isUserMenuOpen && (
            <div style={styles.userDropdown} className={isClosing ? "dropdown-exit" : "dropdown-enter"}>
              {/* Centered User Profile Section */}
              <div style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #e0e0e0' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fb8500', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '18px', color: '#fff', overflow: 'hidden', margin: '0 auto 12px' }}>
                  {user?.avatar || user?.profilePicture ? (
                    <img
                      src={user.avatar || user.profilePicture}
                      alt="Avatar"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    getInitials()
                  )}
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', marginBottom: '2px' }}>
                  {user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user?.name || user?.username || 'User'}
                </div>
                <div style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>
                  {user?.email || 'email@example.com'}
                </div>
                <button
                  style={{ width: '100%', padding: '8px 12px', backgroundColor: 'transparent', color: '#fb8500', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 150ms cubic-bezier(0.4, 0.0, 0.2, 1)', transform: 'scale(1)' }}
                  className="button-press ripple-container"
                  onClick={() => {
                    handleCloseDropdown();
                    setTimeout(() => navigate('/profile'), 150);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border = '1px solid #fb8500';
                    e.currentTarget.style.backgroundColor = 'rgba(251, 133, 0, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.border = 'none';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Account
                </button>
              </div>

              {/* Menu Items */}
              <div style={{ padding: '8px' }}>
                {[
                  { icon: <CreditCard size={16} />, text: 'Billing' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '6px', cursor: 'pointer', color: '#1a1a1a', fontSize: '14px', transition: 'background-color 150ms cubic-bezier(0.4, 0.0, 0.2, 1)' }}
                    className="ripple-container"
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                      <div style={{ flexShrink: 0 }}>{item.icon}</div>
                      <span>{item.text}</span>
                    </div>
                    {item.hasChevron && <div style={{ flexShrink: 0 }}><ChevronRight size={16} /></div>}
                  </div>
                ))}

                <div style={{ height: '1px', backgroundColor: '#e0e0e0', margin: '8px 0' }} />

                {[
                  { icon: <Globe size={16} />, text: 'Language', hasChevron: true },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '6px', cursor: 'pointer', color: '#1a1a1a', fontSize: '14px', transition: 'background-color 150ms cubic-bezier(0.4, 0.0, 0.2, 1)' }}
                    className="ripple-container"
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                      <div style={{ flexShrink: 0 }}>{item.icon}</div>
                      <span>{item.text}</span>
                    </div>
                    {item.hasChevron && <div style={{ flexShrink: 0 }}><ChevronRight size={16} /></div>}
                  </div>
                ))}

                <div style={{ height: '1px', backgroundColor: '#e0e0e0', margin: '8px 0' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '6px', cursor: 'pointer', color: '#1a1a1a', fontSize: '14px', transition: 'background-color 150ms cubic-bezier(0.4, 0.0, 0.2, 1)' }}
                  className="ripple-container"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <div style={{ flexShrink: 0 }}><MessageSquare size={16} /></div>
                  <span>Submit a request</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '6px', cursor: 'pointer', color: '#1a1a1a', fontSize: '14px', transition: 'background-color 150ms cubic-bezier(0.4, 0.0, 0.2, 1)' }}
                  className="ripple-container"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <div style={{ flexShrink: 0 }}><HelpCircle size={16} /></div>
                  <span>Help and support</span>
                </div>
                <div
                  onClick={handleLogout}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '6px', cursor: 'pointer', color: '#1a1a1a', fontSize: '14px', transition: 'background-color 150ms cubic-bezier(0.4, 0.0, 0.2, 1)' }}
                  className="ripple-container"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <div style={{ flexShrink: 0 }}><LogOut size={16} /></div>
                  <span>Sign out</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNavBar;