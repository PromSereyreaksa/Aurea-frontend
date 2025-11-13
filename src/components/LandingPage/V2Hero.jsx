import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function V2Hero() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const handleGetStarted = () => {
    navigate("/dashboard");
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-[30vh] flex items-start justify-start overflow-hidden bg-[#1a1a1a] -mt-24 pt-4"
    >
      {/* Hero Content */}
      <motion.div
        style={{ opacity, scale }}
        className="relative z-20 text-left px-4 md:px-12 py-4 max-w-7xl w-full"
      >
        {/* Main CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <motion.button
            onClick={handleGetStarted}
            className="text-[3.5vw] md:text-[5vw] lg:text-[4vw] font-black leading-tight tracking-tight text-white bg-[rgb(251,133,0)] px-8 md:px-12 py-6 md:py-8 shadow-2xl cursor-pointer whitespace-nowrap"
          >
            Build your portfolio in minutes
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
