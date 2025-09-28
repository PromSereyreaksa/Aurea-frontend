import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Shared/Navbar";
import Footer from "../components/Shared/Footer";

const AllEventsPage = () => {
  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-12 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Under Development Notice */}
          <div className="bg-white rounded-3xl p-12 shadow-2xl border border-orange-200 mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-4 h-4 bg-orange-400 rounded-full animate-pulse"></div>
              <h1 className="text-4xl md:text-5xl font-bold text-orange-800">Under Development</h1>
              <div className="w-4 h-4 bg-orange-400 rounded-full animate-pulse"></div>
            </div>
            
            <div className="text-8xl mb-8">🚧</div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-6">
              All Events & Workshops
            </h2>
            
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              <strong>Thank you for your interest!</strong> We're currently fine-tuning our comprehensive events catalog to provide you with the best possible experience.
            </p>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Our team is working hard to bring you an amazing collection of workshops, bootcamps, conferences, and networking events. This page will feature our complete event directory with advanced filtering, detailed descriptions, and easy registration.
            </p>
            
            <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold text-orange-800 mb-4">What's Coming Soon:</h3>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-orange-700">Complete event calendar</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-orange-700">Advanced search & filtering</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-orange-700">One-click registration</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-orange-700">Event recommendations</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-orange-700 mb-8">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span className="text-lg font-semibold">Expected launch: Coming Soon</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/events"
                className="bg-[#fb8500] text-white px-8 py-4 rounded-2xl font-semibold hover:bg-[#e6780e] transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:-translate-y-1"
              >
                View Current Events
              </Link>
              <Link
                to="/"
                className="bg-white text-[#1a1a1a] px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-300 border border-gray-200 hover:shadow-lg"
              >
                Back to Home
              </Link>
            </div>
          </div>
          
          <p className="text-lg text-orange-600 italic">
            Sorry for any inconvenience. We appreciate your patience! 🙏
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AllEventsPage;