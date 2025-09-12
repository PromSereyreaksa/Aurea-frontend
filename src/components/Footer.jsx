import React from "react";

const Footer = () => (
  <footer className="bg-black text-white py-12">
    <div className="max-w-6xl mx-auto px-6">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold tracking-wide uppercase mb-2">AUREA</h3>
          <p className="text-gray-400 text-sm">A toolkit for modern designers</p>
        </div>
        
        <nav className="flex gap-8 text-sm font-medium tracking-wide">
          <a href="#about" className="text-white hover:text-gray-300 transition-colors uppercase">About</a>
          <a href="#contact" className="text-white hover:text-gray-300 transition-colors uppercase">Contact</a>
          <a href="#terms" className="text-white hover:text-gray-300 transition-colors uppercase">Terms</a>
        </nav>
      </div>
      
      <div className="border-t border-gray-800 mt-8 pt-8 text-center">
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} AUREA. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
