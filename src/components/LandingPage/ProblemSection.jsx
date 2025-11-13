import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ProblemSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center py-32 px-6 bg-[#1a1a1a]"
    >
      <motion.div style={{ scale, opacity }} className="max-w-6xl mx-auto">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <span className="text-[#fb8500] font-bold text-sm uppercase tracking-[0.3em]">
            (Insight)
          </span>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center space-y-12"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
            DESIGNERS POUR THEIR CREATIVITY INTO THEIR WORK
          </h2>

          <div className="max-w-4xl mx-auto space-y-8 text-xl md:text-2xl text-gray-400 leading-relaxed">
            <p>
              Yet when it comes to showcasing it online, they often struggle.
              Building a personal website takes time, technical know-how, and
              patience.
            </p>

            <p className="text-[#fb8500] font-semibold">
              The thought of coding or using complex site builders can be
              overwhelming.
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#fb850040_1px,transparent_1px),linear-gradient(to_bottom,#fb850040_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>
    </section>
  );
}
