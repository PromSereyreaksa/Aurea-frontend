import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useAuthStore from "../../stores/authStore";
import { StaggeredMenu } from "./StaggeredMenu";
import aureaLogo from "../../assets/AUREA - Logo.png";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  // Show navigation items only on landing page and about page
  const showNavItems = location.pathname === '/' || location.pathname === '/about';

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Get user initials
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    const names = user.name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Define menu items based on current page
  const getMenuItems = () => {
    let baseItems = [];
    
    if (location.pathname === '/') {
      baseItems = [
        { 
          label: 'Home', 
          link: '#', 
          onClick: () => scrollToSection('home')
        },
        { 
          label: 'Features', 
          link: '#', 
          onClick: () => scrollToSection('features')
        },
        { 
          label: 'FAQ', 
          link: '#', 
          onClick: () => scrollToSection('faq')
        },
        { 
          label: 'Pricing', 
          link: '#', 
          onClick: () => scrollToSection('pricing')
        },
        { 
          label: 'About', 
          link: '/about'
        }
      ];
    } else if (location.pathname === '/about') {
      baseItems = [
        { 
          label: 'Home', 
          link: '/'
        },
        { 
          label: 'Our Story', 
          link: '#', 
          onClick: () => scrollToSection('story')
        },
        { 
          label: 'Our Values', 
          link: '#', 
          onClick: () => scrollToSection('values')
        },
        { 
          label: 'Our Team', 
          link: '#', 
          onClick: () => scrollToSection('team')
        },
        { 
          label: 'Our Mission', 
          link: '#', 
          onClick: () => scrollToSection('mission')
        }
      ];
    } else {
      // Default items for other pages
      baseItems = [
        { label: 'Home', link: '/' },
        { label: 'About', link: '/about' },
        { label: 'Contact', link: '/contact' }
      ];
    }

    // Add user-specific items if authenticated
    if (isAuthenticated) {
      baseItems.push(
        { label: 'Dashboard', link: '/dashboard' }
      );
    } else {
      baseItems.push(
        { label: 'Login', link: '/login' },
        { label: 'Sign Up', link: '/signup' }
      );
    }

    return baseItems;
  };

  const socialItems = [
    { label: 'Facebook', link: 'https://facebook.com' },
    { label: 'Twitter', link: 'https://twitter.com' },
    { label: 'Instagram', link: 'https://instagram.com' }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // For landing and about pages, use StaggeredMenu
  if (location.pathname === '/' || location.pathname === '/about') {
    return (
      <div className="fixed top-0 left-0 w-full h-screen pointer-events-none z-50">
        <StaggeredMenu
          position="right"
          colors={['#fb8500', '#e07400']}
          items={getMenuItems()}
          socialItems={socialItems}
          displaySocials={true}
          displayItemNumbering={true}
          logoUrl={aureaLogo}
          menuButtonColor="#1a1a1a"
          openMenuButtonColor="#1a1a1a"
          changeMenuColorOnOpen={false}
          accentColor="#fb8500"
          className="staggered-menu-container pointer-events-auto"
          user={user}
          isAuthenticated={isAuthenticated}
          onLogout={() => {
            logout();
            navigate('/');
          }}
        />
      </div>
    );
  }

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 py-4 px-6"
    >
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link to="/" className="flex items-center space-x-3">
          <img 
            src={aureaLogo} 
            alt="AUREA Logo" 
            className="h-8 w-auto"
          />
          <span className="text-2xl font-bold tracking-wide uppercase text-[#1a1a1a]">
            UREA
          </span>
          
        </Link>
      </motion.div>
      
      <div className="hidden md:flex items-center space-x-8">
        {/* Navigation items based on current page */}
        {location.pathname === '/' && (
          <>
            <button 
              onClick={() => scrollToSection('home')}
              className="text-[#1a1a1a] hover:text-[#fb8500] font-medium transition-colors relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#fb8500] transition-all group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="text-[#1a1a1a] hover:text-[#fb8500] font-medium transition-colors relative group"
            >
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#fb8500] transition-all group-hover:w-full"></span>
            </button>
             <button 
              onClick={() => scrollToSection('faq')}
              className="text-[#1a1a1a] hover:text-[#fb8500] font-medium transition-colors relative group"
            >
              FAQ
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#fb8500] transition-all group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="text-[#1a1a1a] hover:text-[#fb8500] font-medium transition-colors relative group"
            >
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#fb8500] transition-all group-hover:w-full"></span>
            </button>
            <Link 
              to="/about"
              className="text-[#1a1a1a] hover:text-[#fb8500] font-medium transition-colors relative group flex items-center space-x-1"
            >
              <span>About</span>
              <svg 
                className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                viewBox="0 0 24 24"
              >
                <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#fb8500] transition-all group-hover:w-full"></span>
            </Link>
          </>
        )}
        
        {location.pathname === '/about' && (
          <>
            <button 
              onClick={() => navigate('/')}
              className="text-[#1a1a1a] hover:text-[#fb8500] font-medium transition-colors relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#fb8500] transition-all group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => scrollToSection('story')}
              className="text-[#1a1a1a] hover:text-[#fb8500] font-medium transition-colors relative group"
            >
              Our Story
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#fb8500] transition-all group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => scrollToSection('values')}
              className="text-[#1a1a1a] hover:text-[#fb8500] font-medium transition-colors relative group"
            >
              Our Values
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#fb8500] transition-all group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => scrollToSection('team')}
              className="text-[#1a1a1a] hover:text-[#fb8500] font-medium transition-colors relative group"
            >
              Our Team
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#fb8500] transition-all group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => scrollToSection('mission')}
              className="text-[#1a1a1a] hover:text-[#fb8500] font-medium transition-colors relative group"
            >
              Our Mission
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#fb8500] transition-all group-hover:w-full"></span>
            </button>
          </>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center justify-center w-10 h-10 bg-[#fb8500] text-white rounded-full font-semibold hover:bg-[#fb8500]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#fb8500] focus:ring-offset-2"
              >
                {getUserInitials()}
              </button>
              
              {/* Dropdown Menu */}
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                >
                  {/* User Info Header */}
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  
                  <div className="py-2">
                    <Link
                      to="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
                    >
                      <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
                    >
                      <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Dashboard
                    </Link>
                  </div>
                  
                  <div className="border-t border-gray-100">
                    <button
                      onClick={() => {
                        logout();
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors group"
                    >
                      <svg className="w-4 h-4 mr-3 text-red-400 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Public Navigation */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/login" 
                className="text-[#1a1a1a] hover:text-[#fb8500] font-medium transition-colors"
              >
                Log In
              </Link>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/signup" 
                className="bg-[#fb8500] text-white px-6 py-2 rounded-md font-medium tracking-wide uppercase transition-all hover:bg-[#fb8500]/90 relative overflow-hidden group shadow-lg"
              >
                <span className="relative z-10">Sign Up</span>
                <div className="absolute inset-0 bg-[#1a1a1a] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </div>
  </motion.nav>
  );
};

export default Navbar;