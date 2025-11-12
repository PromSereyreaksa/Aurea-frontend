import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function TimelineSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  const timeline = [
    {
      year: "2023",
      title: "THE BEGINNING",
      description:
        "A group of university students noticed a problem many designers face: showcasing their work online was unnecessarily complex.",
    },
    {
      year: "2024",
      title: "THE VALIDATION",
      description:
        "COPPSARY pitched at the Turing Hackathon and joined ACTSmart incubation program, validating the need for a simpler solution.",
    },
    {
      year: "2025",
      title: "THE REVOLUTION",
      description:
        "AUREA launches, empowering designers worldwide to create stunning portfolios in minutes, not weeks.",
    },
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center py-32 px-6 bg-gradient-to-b from-gray-50 to-white"
    >
      <motion.div style={{ opacity, y }} className="max-w-6xl mx-auto w-full">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#fb8500] font-bold text-sm uppercase tracking-[0.3em]">
            (Journey)
          </span>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#fb8500]/20 via-[#fb8500] to-[#fb8500]/20 hidden md:block"></div>

          <div className="space-y-24">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } flex-col`}
              >
                {/* Content */}
                <div className="flex-1 mb-8 md:mb-0">
                  <div
                    className={`max-w-md ${
                      index % 2 === 0
                        ? "md:ml-auto md:text-right"
                        : "md:mr-auto"
                    }`}
                  >
                    <div className="text-6xl md:text-8xl font-black text-[#fb8500]/20 mb-4">
                      {item.year}
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-[#1a1a1a] mb-4 tracking-wide">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Center Dot */}
                <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-[#fb8500] rounded-full border-4 border-white shadow-lg hidden md:block"></div>

                {/* Spacer */}
                <div className="flex-1"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
