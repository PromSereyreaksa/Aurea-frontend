import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useForm, ValidationError } from "@formspree/react";
import Navbar from "../components/Shared/Navbar";
import Footer from "../components/Shared/Footer";

const contactMethods = [
  {
    title: "Email Us",
    description: "Get in touch with our team for any questions or support.",
    contact: "aureatool@gmail.com",
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
    title: "Contact Via Facebook",
    description: "Connect with us on our official Facebook page.",
    contact: "AUREA",
    link: "https://web.facebook.com/profile.php?id=61580414833465",
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

const ContactPage = () => {
  const [state, handleSubmit] = useForm("xnngjrqd");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Show success modal when form is submitted successfully
  useEffect(() => {
    if (state.succeeded) {
      setShowSuccessModal(true);
      // Reset form data
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }
  }, [state.succeeded]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const scrollToContactForm = () => {
    const contactFormSection = document.getElementById("contact-form-section");
    if (contactFormSection) {
      contactFormSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center group cursor-pointer"
                onClick={() => {
                  if (method.link) {
                    window.open(method.link, "_blank");
                  } else if (method.title === "Email Us") {
                    scrollToContactForm();
                  } else {
                    window.location.href = `mailto:${method.contact}`;
                  }
                }}
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
                <p className="text-[#fb8500] font-medium tracking-wide hover:text-[#e07400] transition-colors">
                  {method.contact}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form-section" className="py-24 px-6 bg-white">
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
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#1a1a1a] mb-2 tracking-wide uppercase"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#fb8500] outline-none transition-colors"
                placeholder="Enter your full name"
                required
              />
              <ValidationError
                prefix="Name"
                field="name"
                errors={state.errors}
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#1a1a1a] mb-2 tracking-wide uppercase"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#fb8500] outline-none transition-colors"
                placeholder="Enter your email address"
                required
              />
              <ValidationError
                prefix="Email"
                field="email"
                errors={state.errors}
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-[#1a1a1a] mb-2 tracking-wide uppercase"
              >
                Subject
              </label>
              <input
                id="subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#fb8500] outline-none transition-colors"
                placeholder="What's this about?"
                required
              />
              <ValidationError
                prefix="Subject"
                field="subject"
                errors={state.errors}
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-[#1a1a1a] mb-2 tracking-wide uppercase"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#fb8500] outline-none transition-colors resize-none"
                placeholder="Tell us more about your inquiry..."
                required
              />
              <ValidationError
                prefix="Message"
                field="message"
                errors={state.errors}
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={state.submitting}
              className={`w-full py-4 px-8 font-medium tracking-wide uppercase transition-all ${
                state.submitting
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-[#fb8500] text-white hover:bg-[#fb8500]/90"
              }`}
            >
              {state.submitting ? "Sending..." : "Send Message"}
            </motion.button>
          </motion.form>
        </div>
      </section>

      {/* Success Modal */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4"
          style={{ backdropFilter: "blur(8px)" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-100"
          >
            <div className="text-center">
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>

              {/* Success Message */}
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-2xl font-bold text-[#1a1a1a] mb-3"
              >
                Message Sent Successfully!
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="text-gray-600 mb-2"
              >
                Thank you for reaching out to us.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="text-gray-600 mb-8"
              >
                We'll get back to you within 24 hours.
              </motion.p>

              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={closeSuccessModal}
                className="w-full py-3 px-6 bg-[#fb8500] text-white font-medium tracking-wide uppercase rounded-lg hover:bg-[#e07400] transition-colors duration-200"
              >
                Continue
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ContactPage;
