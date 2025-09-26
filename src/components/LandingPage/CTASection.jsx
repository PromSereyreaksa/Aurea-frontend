import React from "react";
import { Link } from "react-router-dom";

const CTASection = () => (
  <section className="py-24 px-6 bg-[#1a1a1a] text-white">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-wide">
        Ready to elevate your design practice?
      </h2>
      <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
        Join thousands of designers who've transformed their workflow with AUREA. 
        Start your free trial today.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/signup"
          className="bg-[#fb8500] text-white px-8 py-4 font-bold text-lg tracking-wide uppercase transition-all hover:bg-[#fb8500]/90"
        >
          Start Free Trial
        </Link>
        <Link
          to="#features"
          className="border-2 border-[#fb8500] text-[#fb8500] px-8 py-4 font-bold text-lg tracking-wide uppercase transition-all hover:bg-[#fb8500] hover:text-white"
        >
          Learn More
        </Link>
      </div>
    </div>
  </section>
);

export default CTASection;