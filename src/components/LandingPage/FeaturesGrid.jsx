import { motion } from "framer-motion";
import {
  Clock,
  Wrench,
  Rocket,
} from "lucide-react";
import animations from "../../utils/animationConfig";

const features = [
  {
    icon: Clock,
    title: "Efficient",
    description:
      "Portfolio setup in just a few minutes. No hassle, no waiting, just seamless creation from start to finish.",
  },
  {
    icon: Wrench,
    title: "Zero Code",
    description:
      "Focus on design, not development. Every layout, animation, and section is built visually—no coding required.",
  },
  {
    icon: Rocket,
    title: "Instant Deploy",
    description:
      "With one click, your portfolio is live. Hosted, optimized, and ready to share instantly.",
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
