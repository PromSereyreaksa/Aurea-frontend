import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Zap, Rocket, Star } from "lucide-react";

export default function SolutionSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const services = [
    {
      icon: Zap,
      title: "THE WEBSITE",
      description: "Professional portfolios ready in minutes",
    },
    {
      icon: Rocket,
      title: "THE TOOL",
      description: "Intuitive builder with zero learning curve",
    },
    {
      icon: Star,
      title: "THE TEMPLATES",
      description: "Beautiful designs that make work shine",
    },
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center py-32 px-6 bg-gradient-to-b from-white to-gray-50"
    >
      <motion.div style={{ y, opacity }} className="max-w-7xl mx-auto w-full">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <span className="text-[#fb8500] font-bold text-sm uppercase tracking-[0.3em]">
            (Services)
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-black text-center text-[#1a1a1a] mb-20 leading-tight max-w-5xl mx-auto"
        >
          WE TAKE CARE OF THE WEBSITE, THE TOOL, THE TEMPLATES
          <br />
          <span className="text-[#fb8500]">
            DESIGNERS JUST SHOWCASE THEIR WORK
          </span>
        </motion.h2>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-20">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="group relative"
            >
              <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-[#fb8500] transition-all duration-300 hover:shadow-xl">
                <div className="mb-6">
                  <service.icon className="w-12 h-12 text-[#fb8500]" />
                </div>
                <h3 className="text-2xl font-bold text-[#1a1a1a] mb-4 tracking-wide">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#fb8500]/0 to-[#fb8500]/0 group-hover:from-[#fb8500]/5 group-hover:to-[#fb8500]/10 rounded-2xl transition-all duration-300 -z-10"></div>
            </motion.div>
          ))}
        </div>

        {/* Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center max-w-4xl mx-auto"
        >
          <p className="text-2xl md:text-3xl text-gray-700 leading-relaxed font-light">
            We make portfolio building{" "}
            <span className="font-bold text-[#1a1a1a]">
              easy, fast, and efficient
            </span>{" "}
            — so designers can focus on what matters most:{" "}
            <span className="text-[#fb8500] font-bold">their craft</span>.
          </p>
          <p className="text-xl text-gray-600 mt-8">
            We save them time while ensuring their work truly shines.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
