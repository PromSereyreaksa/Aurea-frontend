import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Clock, Code, Palette } from "lucide-react";

export default function TransitionSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  const challenges = [
    {
      icon: Clock,
      before: "Weeks of work",
      after: "10 minutes",
    },
    {
      icon: Code,
      before: "Complex coding",
      after: "Zero code",
    },
    {
      icon: Palette,
      before: "Limited designs",
      after: "Beautiful templates",
    },
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center py-32 px-6 bg-white"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#fb8500] font-bold text-sm uppercase tracking-[0.3em]">
            (Transformation)
          </span>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {challenges.map((challenge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="relative group"
            >
              <div className="text-center">
                {/* Icon */}
                <motion.div
                  style={index === 1 ? { rotate } : {}}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#fb8500] to-[#ff9500] rounded-full mb-8 group-hover:scale-110 transition-transform duration-300"
                >
                  <challenge.icon className="w-10 h-10 text-white" />
                </motion.div>

                {/* Before */}
                <div className="mb-8">
                  <div className="text-sm text-gray-400 uppercase tracking-wider mb-2 line-through">
                    Before
                  </div>
                  <div className="text-2xl font-bold text-gray-400 line-through">
                    {challenge.before}
                  </div>
                </div>

                {/* Arrow */}
                <div className="mb-8">
                  <svg
                    className="w-8 h-8 mx-auto text-[#fb8500]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>

                {/* After */}
                <div>
                  <div className="text-sm text-[#fb8500] uppercase tracking-wider mb-2 font-bold">
                    Now
                  </div>
                  <div className="text-3xl font-black text-[#1a1a1a]">
                    {challenge.after}
                  </div>
                </div>
              </div>

              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#fb8500]/0 to-[#fb8500]/0 group-hover:from-[#fb8500]/5 group-hover:to-[#fb8500]/10 rounded-2xl transition-all duration-300 -z-10 blur-xl"></div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-20 max-w-3xl mx-auto"
        >
          <p className="text-2xl md:text-3xl text-gray-700 leading-relaxed">
            We didn't just make it easier —{" "}
            <span className="font-black text-[#1a1a1a]">
              we made it effortless
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
