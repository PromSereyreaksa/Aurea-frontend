import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SplitText from "../components/Shared/SplitText";
import Navbar from "../components/Shared/Navbar";
import FeatureSection from "../components/LandingPage/FeatureSection";
import EventsSection from "../components/LandingPage/EventsSection";
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
              <SplitText
                text="AUREA"
                tag="h1"
                className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 text-gray-800 tracking-wide"
                delay={100}
                duration={0.8}
                from={{ opacity: 0, y: 50 }}
                to={{ opacity: 1, y: 0 }}
                ease="power3.out"
              />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-xl md:text-2xl font-medium text-black max-w-lg mx-auto"
          >
            A launchpad for designers.
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
      
      {/* Events Section */}
      <EventsSection />
      
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