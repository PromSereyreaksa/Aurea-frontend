import React from "react";

const HeroSection = ({ onGetStarted }) => (
  <section className="flex flex-col items-center justify-center min-h-[60vh] py-20">
    <h1 className="text-6xl font-bold tracking-wide uppercase font-sans text-[#1a1a1a] mb-6">AUREA</h1>
    <p className="text-xl font-medium font-sans text-[#1a1a1a] mb-10">A toolkit for modern designers.</p>
    <button
      className="px-8 py-3 bg-[#fb8500] text-white font-sans font-medium text-lg rounded transition hover:bg-[#fb8500]/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#fb8500]/50 transform hover:scale-105"
      onClick={onGetStarted}
    >
      Get Started Now
    </button>
  </section>
);

export default HeroSection;
