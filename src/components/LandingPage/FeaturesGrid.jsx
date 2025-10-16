import { motion } from "framer-motion";
import {
  Zap,
  Palette,
  Smartphone,
  Rocket,
  Wrench,
  Infinity,
} from "lucide-react";
import animations from "../../utils/animationConfig";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Build and publish your portfolio in under 10 minutes. No setup, no hassle, just results.",
  },
  {
    icon: Palette,
    title: "Design Freedom",
    description:
      "Complete creative control with our intuitive visual editor. Your style, your way.",
  },
  {
    icon: Smartphone,
    title: "Mobile Perfect",
    description:
      "Every portfolio looks stunning on any device. Responsive by default, beautiful everywhere.",
  },
  {
    icon: Rocket,
    title: "One-Click Deploy",
    description:
      "Publish instantly with custom domains. Go live in seconds, not hours.",
  },
  {
    icon: Wrench,
    title: "Zero Code",
    description:
      "Focus on design, not development. No coding knowledge required, ever.",
  },
  {
    icon: Infinity,
    title: "Unlimited Projects",
    description:
      "Showcase as many projects as you want. No limits, no restrictions.",
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            {...animations.fadeInUp}
            viewport={animations.viewportConfig}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 rounded-full mb-6"
          >
            <span className="text-sm font-semibold text-[#fb8500] tracking-wide uppercase">
              Features
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
            Everything you need,
            <br />
            <span className="text-[#fb8500]">nothing you don't</span>
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
            Built for designers who want to focus on their craft, not wrestle
            with technology.
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={animations.staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={animations.viewportConfig}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={animations.staggerItem}
                {...animations.hoverLift}
                className="group p-8 bg-white border border-gray-200 rounded-2xl hover:border-[#fb8500] hover:shadow-xl transition-all duration-200 will-change-transform"
              >
                <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#fb8500] transition-colors duration-200">
                  <Icon className="w-7 h-7 text-[#fb8500] group-hover:text-white transition-colors duration-200" />
                </div>
                <h3 className="text-xl font-bold text-[#1a1a1a] mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
