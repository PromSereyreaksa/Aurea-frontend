import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Choose Your Template",
    description: "Pick from our curated collection of professional templates designed specifically for designers.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M7 8h10M7 12h10M7 16h4" />
      </svg>
    )
  },
  {
    number: "02",
    title: "Customize & Build",
    description: "Add your projects, testimonials, and personal branding. Our intuitive builder makes it effortless.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M12 3v18M3 12h18" />
      </svg>
    )
  },
  {
    number: "03",
    title: "Share & Pitch",
    description: "Present your work with confidence. Share your portfolio and pitch decks to win more clients.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M8.5 14.5L12 11l3.5 3.5L21 8" />
        <path d="M21 8v6h-6" />
      </svg>
    )
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const HowItWorksSection = () => (
  <section id="about" className="py-24 px-6 bg-white">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6 tracking-wide">
          How It Works
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          From concept to client presentation in three simple steps
        </p>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-12"
      >
        {steps.map((step, index) => (
          <div 
            key={index} 
            className="text-center group cursor-pointer"
          >
            <div className="relative mb-8">
              <motion.div 
                whileHover={{ 
                  scale: 1.1,
                  transition: { duration: 0.3 }
                }}
                className="w-16 h-16 bg-[#fb8500] text-white flex items-center justify-center mx-auto mb-4 group-hover:bg-[#fb8500]/90 transition-colors duration-300"
              >
                {step.icon}
              </motion.div>
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-gray-100 border-2 border-white flex items-center justify-center"
              >
                <span className="text-sm font-bold text-[#1a1a1a]">{step.number}</span>
              </motion.div>
            </div>
            <h3 className="text-2xl font-bold text-[#1a1a1a] mb-4 tracking-wide group-hover:text-gray-700 transition-colors">
              {step.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default HowItWorksSection;