import React, { useState } from "react";
import { motion } from "framer-motion";

const FeatureCard = ({ feature, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative"
    >
      {/* Main Card */}
      <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center mb-6">
            {feature.icon}
          </div>
          <h3 className="text-2xl lg:text-3xl font-bold text-black mb-4 tracking-wide">
            {feature.title}
          </h3>
          <p className="text-lg text-gray-700 mb-4 leading-relaxed font-medium">
            {feature.desc}
          </p>
        </div>
      </div>

      {/* Expanded Details - Drops down below the card */}
      <div 
        className={`absolute top-full left-0 right-0 bg-white rounded-xl border border-gray-100 shadow-lg z-20 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-2' : 'opacity-0 translate-y-0 pointer-events-none'
        }`}
      >
        <div className="p-6 border-t border-gray-200">
          <p className="text-base text-gray-600 leading-relaxed">
            {feature.details}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default FeatureCard;