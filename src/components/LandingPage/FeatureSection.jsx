import React, { useEffect, useRef } from "react";
import FeatureCard from "./FeatureCard";

const features = [
  {
    title: "Portfolio Builder",
    desc: "Create stunning online portfolios that showcase your best work.",
    details: "Professional drag-and-drop interface with customizable templates designed by award-winning designers. Choose from minimalist, bold, or classic layouts, each optimized for different design disciplines. Upload your projects, add descriptions, and organize your work into collections that tell your design story. Built-in SEO optimization ensures your portfolio gets discovered by potential clients.",
    icon: (
      <svg className="w-16 h-16 text-[#fb8500]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M16 3v4M8 3v4" />
        <circle cx="9" cy="11" r="1" />
        <path d="M13 13l3-3" />
      </svg>
    ),
  },
  {
    title: "Client Pitch Templates",
    desc: "Win more clients with professional presentation templates.",
    details: "Access to 50+ proven pitch deck templates that convert prospects into paying clients. Each template includes sections for project overview, timeline, pricing breakdown, and terms. Customize with your branding, add client-specific details, and export as PDF or interactive presentations. Templates are based on successful pitches from top design agencies and freelancers.",
    icon: (
      <svg className="w-16 h-16 text-[#fb8500]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M8 8h8M8 12h6M8 16h4" />
        <circle cx="18" cy="6" r="2" />
      </svg>
    ),
  },
  {
    title: "Smart Pricing Calculator",
    desc: "Price your projects confidently with data-driven insights.",
    details: "Intelligent pricing tool that factors in your experience level, project complexity, client budget, timeline, and current market rates. Get personalized recommendations based on industry standards and your geographic location. Track your pricing history, analyze which rates perform best, and automatically adjust for inflation and skill development over time.",
    icon: (
      <svg className="w-16 h-16 text-[#fb8500]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
];

const FeatureSection = () => {
  return (
    <section id="features" className="py-32 px-6 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-[#1a1a1a] mb-8 tracking-wide">
            Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need to elevate your design practice and build a thriving creative business
          </p>
        </div>
        
        <div className="space-y-16">
          {features.map((feature, index) => (
            <FeatureCard 
              key={feature.title}
              feature={feature}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;