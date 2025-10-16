import { motion } from "framer-motion";

const stats = [
  {
    number: "10min",
    label: "Average setup time",
  },
  {
    number: "5,000+",
    label: "Designers trust us",
  },
  {
    number: "99.9%",
    label: "Uptime guarantee",
  },
  {
    number: "24/7",
    label: "Support available",
  },
];

export default function StatsSection() {
  return (
    <section className="py-20 px-6 bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1 + 0.2,
                  type: "spring",
                }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#fb8500] mb-3"
              >
                {stat.number}
              </motion.div>
              <div className="text-sm md:text-base text-gray-400 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
