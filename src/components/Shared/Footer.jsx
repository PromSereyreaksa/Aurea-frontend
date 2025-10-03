import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-[#1a1a1a] text-white py-8 sm:py-10 md:py-12 relative z-10">
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
        <div className="text-center md:text-left">
          <h3 className="text-xl sm:text-2xl font-bold tracking-wide uppercase mb-2 text-[#fb8500]">
            AUREA
          </h3>
          <p className="text-gray-400 text-xs sm:text-sm">
            A toolkit for designers
          </p>
        </div>

        <nav className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm font-medium tracking-wide">
          <Link
            to="/about"
            className="text-white hover:text-[#fb8500] transition-colors uppercase cursor-pointer relative z-20 pointer-events-auto"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-white hover:text-[#fb8500] transition-colors uppercase cursor-pointer relative z-20 pointer-events-auto"
          >
            Contact
          </Link>
          <Link
            to="/terms"
            className="text-white hover:text-[#fb8500] transition-colors uppercase cursor-pointer relative z-20 pointer-events-auto"
          >
            Terms
          </Link>
        </nav>
      </div>

      <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
        <p className="text-gray-400 text-xs sm:text-sm">
          © {new Date().getFullYear()} AUREA. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
