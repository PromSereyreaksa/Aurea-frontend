import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ImpactSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center py-32 px-6 bg-gradient-to-b from-white to-gray-50"
    >
      <motion.div
        style={{ scale, opacity }}
        className="max-w-5xl mx-auto text-center"
      >
        {/* Main Message */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1a1a1a] leading-tight mb-8">
            DESIGNERS SHOULDN'T WASTE TIME
            <br />
            <span className="text-[#fb8500]">ON TECHNICAL BARRIERS</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Every hour spent wrestling with code is an hour not spent on what
            truly matters: creating amazing work.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {[
            {
              stat: "85%",
              label: "Time saved on setup",
              description: "Get online faster than ever",
            },
            {
              stat: "100%",
              label: "Focus on creativity",
              description: "No technical distractions",
            },
            {
              stat: "∞",
              label: "Possibilities",
              description: "Your work, your way",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="relative group"
            >
              <div className="bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-[#fb8500] transition-all duration-300 hover:shadow-2xl">
                <div className="text-6xl md:text-7xl font-black text-[#fb8500] mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.stat}
                </div>
                <div className="text-lg font-bold text-[#1a1a1a] mb-2 uppercase tracking-wide">
                  {item.label}
                </div>
                <div className="text-gray-600">{item.description}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#fb8500] rounded-full blur-3xl"
        ></motion.div>
      </div>
    </section>
  );
}
