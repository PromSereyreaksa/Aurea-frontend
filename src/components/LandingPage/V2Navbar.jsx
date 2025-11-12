import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import useAuthStore from "../../stores/authStore";
import aureaLogo from "../../assets/AUREA - Logo.png";

const V2Navbar = () => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Templates", link: "/templates" },
    { label: "Contact", link: "/contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#1a1a1a]/95 backdrop-blur-md py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="relative z-50">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-2"
          >
            <img
              src={aureaLogo}
              alt="AUREA"
              className="h-8 md:h-10 w-auto brightness-0 invert"
            />
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-12">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="relative text-white/80 hover:text-white font-medium transition-colors duration-200 text-sm uppercase tracking-wider group"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#fb8500] group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="bg-[#fb8500] hover:bg-[#ff9500] text-white px-6 py-2.5 rounded-full font-semibold text-sm uppercase tracking-wider transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white/80 hover:text-white font-medium transition-colors duration-200 text-sm uppercase tracking-wider"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="bg-[#fb8500] hover:bg-[#ff9500] text-white px-6 py-2.5 rounded-full font-semibold text-sm uppercase tracking-wider transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden relative z-50 text-white"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#1a1a1a] lg:hidden z-40"
          >
            <div className="flex flex-col items-center justify-center h-full space-y-8 px-6">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-3xl font-bold text-white hover:text-[#fb8500] transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}

              <div className="pt-8 space-y-4 w-full max-w-xs">
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full bg-[#fb8500] hover:bg-[#ff9500] text-white px-8 py-4 rounded-full font-semibold text-center uppercase tracking-wider transition-all duration-300"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full border-2 border-white text-white hover:bg-white hover:text-[#1a1a1a] px-8 py-4 rounded-full font-semibold text-center uppercase tracking-wider transition-all duration-300"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full bg-[#fb8500] hover:bg-[#ff9500] text-white px-8 py-4 rounded-full font-semibold text-center uppercase tracking-wider transition-all duration-300"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default V2Navbar;
