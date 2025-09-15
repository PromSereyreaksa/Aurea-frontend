import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useAuthStore from "../../stores/authStore";
import aureaLogo from "../../assets/AUREA - Logo.png";

const scrollToSection = (sectionId) => {
  if (sectionId === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();

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
          <span className="text-2xl font-bold tracking-wide uppercase text-black">
            UREA
          </span>
          
        </Link>
      </motion.div>
      
      <div className="hidden md:flex items-center space-x-8">
        <button 
          onClick={() => scrollToSection('home')}
          className="text-black hover:text-gray-600 font-medium transition-colors relative group"
        >
          Home
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
        </button>
        <button 
          onClick={() => scrollToSection('features')}
          className="text-black hover:text-gray-600 font-medium transition-colors relative group"
        >
          Features
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
        </button>
         <button 
          onClick={() => scrollToSection('faq')}
          className="text-black hover:text-gray-600 font-medium transition-colors relative group"
        >
          FAQ
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
        </button>
        <button 
          onClick={() => scrollToSection('pricing')}
          className="text-black hover:text-gray-600 font-medium transition-colors relative group"
        >
          Pricing
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
        </button>
       
      </div>
      
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            {/* Authenticated Navigation */}
            <Link 
              to="/dashboard" 
              className="text-black hover:text-gray-600 font-medium transition-colors"
            >
              Dashboard
            </Link>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-200 transition-colors"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Public Navigation */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/login" 
                className="text-black hover:text-gray-600 font-medium transition-colors"
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
                className="bg-black text-white px-6 py-2 rounded-md font-medium tracking-wide uppercase transition-all hover:bg-gray-800 relative overflow-hidden group"
              >
                <span className="relative z-10">Sign Up</span>
                <div className="absolute inset-0 bg-gray-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
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