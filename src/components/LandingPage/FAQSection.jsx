import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "What is AUREA and how can it help my design career?",
    answer: "AUREA is a comprehensive toolkit designed specifically for modern designers. It helps you showcase your work through professional portfolio builders, win more clients with proven pitch templates, and price your projects confidently with our smart calculator. Whether you're a freelancer or part of a design team, AUREA streamlines your workflow and elevates your professional practice."
  },
  {
    question: "How does the portfolio builder work?",
    answer: "Our portfolio builder features an intuitive editing interface with professionally designed templates. You can choose from minimalist, bold, or classic layouts optimized for different design disciplines. Simply upload your projects, add descriptions, organize work into collections, and publish. Built-in SEO optimization ensures your portfolio gets discovered by potential clients."
  },
  {
    question: "What makes the pitch templates effective?",
    answer: "Our 50+ pitch deck templates are based on successful presentations from top design agencies and freelancers. Each template includes proven sections for project overview, timeline, pricing breakdown, and terms. You can customize with your branding, add client-specific details, and export as PDF or interactive presentations. The templates are designed to convert prospects into paying clients."
  },
  {
    question: "How does the pricing calculator work?",
    answer: "The smart pricing calculator factors in your experience level, project complexity, client budget, timeline, and current market rates. It provides personalized recommendations based on industry standards and your geographic location. You can track your pricing history, analyze which rates perform best, and automatically adjust for inflation and skill development over time."
  },
  {
    question: "Is there a free plan available?",
    answer: "Yes! Our Starter plan is completely free and includes 3 portfolio projects, basic pitch templates, simple pricing calculator, and community support. It's perfect for getting started and exploring AUREA's features. You can upgrade to Pro ($19/month) or Team ($49/month) plans as your needs grow."
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 tracking-wide">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about AUREA and how it can transform your design practice
          </p>
        </motion.div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: index * 0.03 }}
              viewport={{ once: true }}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
              >
                <h3 className="text-lg font-semibold text-black pr-4">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-5 bg-white border-t border-gray-200">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">
            Still have questions? We're here to help!
          </p>
          <button
            className="bg-black text-white px-8 py-3 rounded-md font-medium tracking-wide uppercase transition-all hover:bg-gray-800"
          >
            Contact Support
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;