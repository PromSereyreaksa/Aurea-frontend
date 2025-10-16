import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function ModernHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-orange-50/20 to-white pointer-events-none" />

      {/* Floating elements */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{
          y: [0, 30, 0],
          x: [0, -20, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 rounded-full mb-8"
        >
          <Sparkles className="w-4 h-4 text-[#fb8500]" />
          <span className="text-sm font-semibold text-[#fb8500] tracking-wide uppercase">
            Where Creativity Meets Simplicity
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#1a1a1a] mb-6 leading-tight"
        >
          Build your portfolio
          <br />
          <span className="text-[#fb8500]">in minutes, not weeks</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          The fastest way for designers to showcase their work.
          <br className="hidden md:block" />
          No coding required. No templates. Just your vision, beautifully
          presented.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <motion.a
            href="/signup"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-[#fb8500] text-white font-semibold rounded-lg hover:bg-[#ff9500] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.a>
          <motion.a
            href="#features"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#fb8500] font-semibold rounded-lg border-2 border-[#fb8500] hover:bg-orange-50 transition-all duration-300"
          >
            See How It Works
          </motion.a>
        </motion.div>

        {/* Hero Visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
            {/* Mock dashboard/preview */}
            <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 p-8">
              <div className="grid grid-cols-3 gap-4 h-full">
                <div className="col-span-2 bg-white rounded-lg shadow-sm p-4 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#fb8500] rounded-lg mx-auto mb-3 flex items-center justify-center text-3xl">
                      ⚡
                    </div>
                    <div className="text-sm font-semibold text-gray-700">
                      Your Portfolio Preview
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg shadow-sm h-1/3"></div>
                  <div className="bg-white rounded-lg shadow-sm h-1/3"></div>
                  <div className="bg-white rounded-lg shadow-sm h-1/3"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating badges */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -top-6 -left-6 bg-white rounded-lg shadow-lg px-4 py-2 border border-gray-200"
          >
            <div className="text-xs font-semibold text-gray-500">
              ⚡ 10min setup
            </div>
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-lg px-4 py-2 border border-gray-200"
          >
            <div className="text-xs font-semibold text-gray-500">
              🚀 Zero code
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
