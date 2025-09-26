import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Shared/Navbar";
import Footer from "../components/Shared/Footer";

const contactMethods = [
  {
    title: "Email Us",
    description: "Get in touch with our team for any questions or support.",
    contact: "hello@aurea.com",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    title: "Support Center",
    description: "Need help with your account or have technical questions?",
    contact: "support@aurea.com",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
      </svg>
    ),
  },
  {
    title: "Business Inquiries",
    description: "Interested in partnerships or enterprise solutions?",
    contact: "business@aurea.com",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
      </svg>
    ),
  },
];

const ContactPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-12">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-bold tracking-wider uppercase text-[#1a1a1a] leading-none"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-xl md:text-2xl font-medium text-[#1a1a1a] max-w-lg mx-auto"
          >
            We'd love to hear from you.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="pt-8"
          >
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Have questions about AUREA? Need support? Want to explore
              partnership opportunities? Our team is here to help you succeed.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6 tracking-wide">
              Get In Touch
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the best way to reach us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center group cursor-pointer"
              >
                <div className="relative mb-8">
                  <motion.div
                    whileHover={{
                      scale: 1.1,
                      transition: { duration: 0.3 },
                    }}
                    className="w-16 h-16 bg-[#fb8500] text-white flex items-center justify-center mx-auto mb-4 group-hover:bg-[#fb8500]/90 transition-colors duration-300"
                  >
                    {method.icon}
                  </motion.div>
                </div>
                <h3 className="text-2xl font-bold text-[#1a1a1a] mb-4 tracking-wide group-hover:text-gray-700 transition-colors">
                  {method.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {method.description}
                </p>
                <motion.a
                  href={`mailto:${method.contact}`}
                  whileHover={{ scale: 1.05 }}
                  className="inline-block text-[#fb8500] font-medium border-b-2 border-[#fb8500] hover:border-[#fb8500]/80 transition-colors"
                >
                  {method.contact}
                </motion.a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6 tracking-wide">
              Send Us A Message
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Fill out the form below and we'll get back to you within 24 hours
            </p>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-2 tracking-wide uppercase">
                  First Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#fb8500] outline-none transition-colors"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-2 tracking-wide uppercase">
                  Last Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#fb8500] outline-none transition-colors"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-2 tracking-wide uppercase">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#fb8500] outline-none transition-colors"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-2 tracking-wide uppercase">
                Subject
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#fb8500] outline-none transition-colors"
                placeholder="What's this about?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-2 tracking-wide uppercase">
                Message
              </label>
              <textarea
                rows={6}
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#fb8500] outline-none transition-colors resize-none"
                placeholder="Tell us more about your inquiry..."
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-[#fb8500] text-white py-4 px-8 font-medium tracking-wide uppercase transition-all hover:bg-[#fb8500]/90"
            >
              Send Message
            </motion.button>
          </motion.form>
        </div>
      </section>

      {/* Office Section */}
      <section className="py-24 px-6 bg-[#1a1a1a] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-wide">
              Visit Our Studio
            </h2>
            <p className="text-xl md:text-2xl leading-relaxed mb-8">
              Located in the heart of the design district, our studio is always
              open to creative minds and passionate designers.
            </p>
            <div className="text-lg">
              <p className="mb-2">123 Design Street</p>
              <p className="mb-2">Creative District, CD 12345</p>
              <p>San Francisco, CA</p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
