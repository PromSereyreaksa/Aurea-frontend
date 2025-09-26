import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for getting started",
    features: [
      "3 portfolio projects",
      "Basic pitch templates",
      "Simple pricing calculator",
      "Community support"
    ],
    cta: "Start Free",
    popular: false
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For serious designers",
    features: [
      "Unlimited portfolio projects",
      "Premium pitch templates",
      "Advanced pricing calculator",
      "Priority support",
      "Custom branding",
      "Analytics dashboard"
    ],
    cta: "Start Pro Trial",
    popular: true
  },
  {
    name: "Team",
    price: "$49",
    period: "/month",
    description: "For design teams",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Shared asset library",
      "Team analytics",
      "Admin controls",
      "White-label options"
    ],
    cta: "Contact Sales",
    popular: false
  }
];

const containerVariants = {};

const itemVariants = {};

const PricingSection = () => (
  <section id="pricing" className="py-24 px-6 bg-gray-50">
    <div className="max-w-6xl mx-auto">
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6 tracking-wide">
          Simple Pricing
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose the plan that fits your needs. Upgrade or downgrade at any time.
        </p>
      </motion.div>
      
      <div 
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {plans.map((plan, index) => (
          <div 
            key={index} 
            className={`bg-white border-2 p-8 relative hover:shadow-xl transition-all duration-300 ${
              plan.popular ? 'border-[#fb8500] scale-105 shadow-lg' : 'border-gray-200'
            }`}
          >
            {plan.popular && (
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                viewport={{ once: true }}
                className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#fb8500] text-white px-4 py-1 text-sm font-bold tracking-wide uppercase rounded-full"
              >
                Most Popular
              </motion.div>
            )}
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-[#1a1a1a] mb-2">{plan.name}</h3>
              <div className="mb-2">
                <span className="text-4xl font-bold text-[#1a1a1a]">{plan.price}</span>
                {plan.period && <span className="text-gray-600">{plan.period}</span>}
              </div>
              <p className="text-gray-600">{plan.description}</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, idx) => (
                <motion.li 
                  key={idx} 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx, duration: 0.4 }}
                  viewport={{ once: true }}
                  className="flex items-center"
                >
                  <svg className="w-5 h-5 text-[#fb8500] mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[#1a1a1a]">{feature}</span>
                </motion.li>
              ))}
            </ul>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to="/signup"
                className={`block w-full text-center py-3 px-6 rounded-md font-bold tracking-wide uppercase transition-all duration-300 ${
                  plan.popular 
                    ? 'bg-[#fb8500] text-white hover:bg-[#fb8500]/90 shadow-lg' 
                    : 'border-2 border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PricingSection;