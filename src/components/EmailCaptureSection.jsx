import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const EmailCaptureSection = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate to signup page with email pre-filled
    navigate("/signup", { state: { email } });
  };

  return (
    <section className="py-24 px-6 bg-black text-white">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-5xl md:text-6xl font-bold mb-6 tracking-wide"
        >
          Ready to elevate your design practice?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
        >
          Join thousands of designers who've transformed their workflow with AUREA. 
          Enter your email to get started.
        </motion.p>
        
        <motion.form 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto flex items-center gap-4"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email address"
            className="flex-1 px-6 py-3 text-lg text-black bg-white rounded-md focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-20 transition-all"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-black px-6 py-3 font-bold text-lg tracking-wide uppercase rounded-md transition-all hover:bg-gray-100 whitespace-nowrap"
          >
            Get Started
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
};

export default EmailCaptureSection;