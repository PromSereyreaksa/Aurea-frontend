import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function MarqueeSection() {
  const words = ["BUILD", "YOUR", "PORTFOLIO", "TODAY!"];
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Transform scroll progress to horizontal movement
  const xLeft = useTransform(scrollYProgress, [0, 1], [200, -2000]);
  const xRight = useTransform(scrollYProgress, [0, 1], [-2000, 200]);

  return (
    <section ref={containerRef} className="relative py-20 bg-[#1a1a1a] overflow-hidden">
      {/* First Row - Moving Left on Scroll */}
      <div className="relative mb-8">
        <motion.div
          style={{ x: xLeft }}
          className="flex gap-12 whitespace-nowrap"
        >
          {[...Array(6)].map((_, setIndex) => (
            <div key={setIndex} className="flex gap-12">
              {words.map((word, index) => (
                <span
                  key={index}
                  className="text-6xl md:text-8xl lg:text-9xl font-black text-transparent"
                  style={{
                    WebkitTextStroke: "2px #fb8500",
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Second Row - Moving Right on Scroll */}
      <div className="relative">
        <motion.div
          style={{ x: xRight }}
          className="flex gap-12 whitespace-nowrap"
        >
          {[...Array(6)].map((_, setIndex) => (
            <div key={setIndex} className="flex gap-12">
              {words.map((word, index) => (
                <span
                  key={index}
                  className="text-6xl md:text-8xl lg:text-9xl font-black text-[#fb8500]"
                >
                  {word}
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
