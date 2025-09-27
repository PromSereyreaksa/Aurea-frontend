import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Shared/Navbar";
import FeatureSection from "../components/LandingPage/FeatureSection";
import TestimonialsSection from "../components/LandingPage/TestimonialsSection";
import FAQSection from "../components/LandingPage/FAQSection";
import PricingSection from "../components/LandingPage/PricingSection";
import EmailCaptureSection from "../components/LandingPage/EmailCaptureSection";
import Footer from "../components/Shared/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-12">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-8xl md:text-9xl font-bold tracking-wider uppercase text-black leading-none"
          >
            AUREA
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-xl md:text-2xl font-medium text-black max-w-lg mx-auto"
          >
            A toolkit for designers.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="pt-8"
          >
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              AUREA is a comprehensive launchpad dedicated to supporting emerging designers to build their identity, refine their skills, and succeed in the global creative market.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <FeatureSection />
      
      {/* FAQ */}
      <FAQSection />
      
      {/* Testimonials */}
      <TestimonialsSection />
      
      {/* Pricing */}
      <PricingSection />
      
      {/* Email Capture */}
      <EmailCaptureSection />
      
      <Footer />
    </div>
  );
};

export default HomePage;