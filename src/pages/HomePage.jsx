import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import AboutSection from "../components/AboutSection";
import TestimonialsSection from "../components/TestimonialsSection";
import FAQSection from "../components/FAQSection";
import PricingSection from "../components/PricingSection";
import EmailCaptureSection from "../components/EmailCaptureSection";
import Footer from "../components/Footer";

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
            A toolkit for modern designers.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="pt-8"
          >
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              AUREA helps designers showcase their work, pitch ideas with confidence, 
              and calculate pricing with ease.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <AboutSection />
      
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