import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function V2Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-[#1a1a1a]"
    >
      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 text-center px-6"
      >
        {/* Large Typography */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-12"
        >
          <h1 className="text-[12vw] md:text-[10vw] lg:text-[8vw] font-black leading-none tracking-tighter">
            <span className="block text-[#fb8500]">AUREA</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 tracking-wide"
        >
          BUILD YOUR PORTFOLIO IN MINUTES
        </motion.p>
      </motion.div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#fb850020_1px,transparent_1px),linear-gradient(to_bottom,#fb850020_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>
    </section>
  );
}
