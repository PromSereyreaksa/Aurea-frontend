import React from "react";
import { motion } from "framer-motion";

export default function MarqueeSection() {
  const words = ["BUILD", "YOUR", "PORTFOLIO", "TODAY!"];

  return (
    <section className="relative py-20 bg-[#1a1a1a] overflow-hidden">
      {/* First Row - Moving Left */}
      <div className="relative mb-8">
        <motion.div
          animate={{
            x: [0, -2000],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
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

      {/* Second Row - Moving Right */}
      <div className="relative">
        <motion.div
          animate={{
            x: [-2000, 0],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
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
