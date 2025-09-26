import React from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "UI/UX Designer",
    company: "Spotify",
    quote: "AUREA transformed how I present my work to clients. The pitch templates are incredibly professional and saved me hours.",
    avatar: "SC"
  },
  {
    name: "Marcus Rodriguez",
    role: "Freelance Designer",
    company: "Independent",
    quote: "The pricing calculator helped me value my work properly. I've increased my rates by 40% and clients respect the transparency.",
    avatar: "MR"
  },
  {
    name: "Emily Watson",
    role: "Creative Director",
    company: "Adobe",
    quote: "Building portfolios used to take weeks. With AUREA, I can create stunning showcases in minutes. Game changer.",
    avatar: "EW"
  }
];

const containerVariants = {};

const itemVariants = {};

const TestimonialsSection = () => (
  <section className="py-24 px-6 bg-white">
    <div className="max-w-6xl mx-auto">
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6 tracking-wide">
          Loved by designers
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Join thousands of creatives who've elevated their practice with AUREA
        </p>
      </motion.div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {testimonials.map((testimonial, index) => (
          <div 
            key={index} 
            className="border border-gray-200 p-8 bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300 cursor-pointer group"
          >
            <motion.div 
              className="mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-lg text-[#1a1a1a] leading-relaxed italic group-hover:text-gray-700 transition-colors">
                "{testimonial.quote}"
              </p>
            </motion.div>
            <div className="flex items-center">
              <motion.div 
                whileHover={{ 
                  scale: 1.1,
                  rotate: 5,
                  transition: { duration: 0.3 }
                }}
                className="w-12 h-12 bg-[#fb8500] text-white flex items-center justify-center font-bold mr-4 group-hover:bg-[#fb8500]/90 transition-colors"
              >
                {testimonial.avatar}
              </motion.div>
              <div>
                <h4 className="font-bold text-[#1a1a1a] group-hover:text-gray-700 transition-colors">{testimonial.name}</h4>
                <p className="text-gray-600 text-sm">{testimonial.role} at {testimonial.company}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default TestimonialsSection;