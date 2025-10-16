import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "AUREA transformed how I present my work. What used to take weeks now takes minutes. It's a game-changer for designers.",
    author: "Sarah Chen",
    role: "Product Designer",
    company: "Figma",
  },
  {
    quote:
      "Finally, a portfolio builder that gets it. No templates, no restrictions. Just pure creative freedom with zero code.",
    author: "Marcus Rodriguez",
    role: "UX/UI Designer",
    company: "Adobe",
  },
  {
    quote:
      "I've tried every portfolio platform out there. AUREA is the only one that feels like it was made by designers, for designers.",
    author: "Emily Watson",
    role: "Visual Designer",
    company: "Dribbble",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 rounded-full mb-6"
          >
            <span className="text-sm font-semibold text-[#fb8500] tracking-wide uppercase">
              Testimonials
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1a1a] mb-6"
          >
            Loved by designers
            <br />
            <span className="text-[#fb8500]">worldwide</span>
          </motion.h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-orange-50 to-white border border-gray-200 rounded-2xl p-8 hover:border-[#fb8500] hover:shadow-xl transition-all duration-300"
            >
              {/* Quote icon */}
              <div className="w-12 h-12 bg-[#fb8500] rounded-lg flex items-center justify-center mb-6">
                <Quote className="w-6 h-6 text-white" />
              </div>

              {/* Quote text */}
              <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                "{testimonial.quote}"
              </p>

              {/* Author info */}
              <div className="border-t border-gray-200 pt-6">
                <div className="font-bold text-[#1a1a1a] text-lg">
                  {testimonial.author}
                </div>
                <div className="text-sm text-gray-600">
                  {testimonial.role} at {testimonial.company}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
