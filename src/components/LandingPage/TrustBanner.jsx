import { motion } from "framer-motion";

const companies = [
  "Adobe",
  "Figma",
  "Sketch",
  "InVision",
  "Dribbble",
  "Behance",
];

export default function TrustBanner() {
  return (
    <section className="py-16 px-6 bg-[#f8f9fa] border-y border-gray-200">
      <div className="max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8"
        >
          Trusted by designers at
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-12"
        >
          {companies.map((company, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold text-gray-400 hover:text-[#fb8500] transition-colors duration-300 cursor-pointer"
            >
              {company}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
