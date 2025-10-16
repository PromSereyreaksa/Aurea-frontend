import { motion } from "framer-motion";
import { Upload, Wand2, Share2 } from "lucide-react";
import animations from "../../utils/animationConfig";

const steps = [
  {
    icon: Upload,
    number: "01",
    title: "Upload Your Work",
    description:
      "Drag and drop your design files, images, and case studies. We support all major formats.",
  },
  {
    icon: Wand2,
    number: "02",
    title: "Customize Your Portfolio",
    description:
      "Use our intuitive visual editor to personalize layouts, colors, and typography to match your brand.",
  },
  {
    icon: Share2,
    number: "03",
    title: "Publish & Share",
    description:
      "One click to go live. Share your custom URL or connect your own domain instantly.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 px-6 bg-gradient-to-b from-white to-orange-50/30"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            {...animations.fadeInUp}
            viewport={animations.viewportConfig}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 rounded-full mb-6"
          >
            <span className="text-sm font-semibold text-[#fb8500] tracking-wide uppercase">
              How It Works
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={animations.viewportConfig}
            transition={{
              duration: animations.config.duration,
              delay: animations.getDelay(1),
            }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1a1a] mb-6"
          >
            Three steps to
            <br />
            <span className="text-[#fb8500]">portfolio perfection</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={animations.viewportConfig}
            transition={{
              duration: animations.config.duration,
              delay: animations.getDelay(2),
            }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Getting your portfolio online has never been easier. No technical
            skills required.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#fb8500]/30 to-transparent transform -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={animations.viewportConfig}
                  transition={{
                    duration: animations.config.duration,
                    delay: animations.getDelay(index),
                  }}
                  className="relative"
                >
                  <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-[#fb8500] hover:shadow-xl transition-all duration-200 h-full will-change-transform">
                    {/* Step number */}
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#fb8500] text-white font-bold text-lg rounded-full flex items-center justify-center shadow-lg">
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className="w-16 h-16 bg-orange-50 rounded-xl flex items-center justify-center mb-6 mt-4">
                      <Icon className="w-8 h-8 text-[#fb8500]" />
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-[#1a1a1a] mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={animations.viewportConfig}
          transition={{
            duration: animations.config.duration,
            delay: animations.getDelay(4),
          }}
          className="text-center mt-16"
        >
          <motion.a
            href="/signup"
            {...animations.hoverScale}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#fb8500] text-white font-semibold rounded-lg hover:bg-[#ff9500] transition-colors duration-200 shadow-lg hover:shadow-xl will-change-transform"
          >
            Start Building Now
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
