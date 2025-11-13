import React from "react";
import { motion } from "framer-motion";

export default function TimelineSection() {
  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto text-center">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span className="text-[#fb8500] font-bold text-sm uppercase tracking-[0.3em]">
            (Journey)
          </span>
        </motion.div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
            COPPSARY pitched at the Turing Hackathon and joined ACTSmart incubation program, validating the need for a simpler solution.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
