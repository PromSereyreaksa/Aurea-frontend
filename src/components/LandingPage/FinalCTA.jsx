import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Palette } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="py-24 px-6 bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#2a2a2a] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#fb8500] rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#ff9500] rounded-full filter blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full mb-8"
        >
          <Sparkles className="w-4 h-4 text-[#fb8500]" />
          <span className="text-sm font-semibold text-white tracking-wide uppercase">
            Ready to Shine?
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
        >
          Start building your
          <br />
          <span className="text-[#fb8500]">dream portfolio today</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
        >
          Join thousands of designers who've already made the switch.
          <br />
          No credit card required. No setup fees. Just your best work,
          beautifully presented.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            href="/signup"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-[#fb8500] text-white font-semibold rounded-lg hover:bg-[#ff9500] transition-all duration-300 shadow-lg hover:shadow-2xl"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.a>
          <motion.a
            href="/contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-lg border-2 border-white/20 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
          >
            Talk to Sales
          </motion.a>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 flex items-center justify-center gap-8 text-gray-400 text-sm"
        >
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#fb8500]" />
            <span>10-minute setup</span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-gray-600" />
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#fb8500]" />
            <span>No credit card</span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-gray-600" />
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#fb8500]" />
            <span>Cancel anytime</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
