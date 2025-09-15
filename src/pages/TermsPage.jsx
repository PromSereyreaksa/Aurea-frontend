import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Shared/Navbar";
import Footer from "../components/Shared/Footer";

const termsData = [
  {
    title: "Acceptance of Terms",
    content:
      "By accessing and using AUREA, you accept and agree to be bound by the terms and provision of this agreement. These Terms of Service apply to all visitors, users, and others who access or use the service.",
  },
  {
    title: "Use License",
    content:
      "Permission is granted to temporarily download one copy of AUREA for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not modify or copy the materials.",
  },
  {
    title: "User Account",
    content:
      "When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.",
  },
  {
    title: "Prohibited Uses",
    content:
      "You may not use our service for any unlawful purpose or to solicit others to perform unlawful acts, to violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances, or to infringe upon or violate our intellectual property rights or the intellectual property rights of others.",
  },
  {
    title: "Content",
    content:
      "Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the content that you post to the service, including its legality, reliability, and appropriateness.",
  },
  {
    title: "Privacy Policy",
    content:
      "Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our service. By using our service, you agree to the collection and use of information in accordance with our Privacy Policy.",
  },
  {
    title: "Intellectual Property",
    content:
      "The service and its original content, features, and functionality are and will remain the exclusive property of AUREA and its licensors. The service is protected by copyright, trademark, and other laws.",
  },
  {
    title: "Termination",
    content:
      "We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the service will cease immediately.",
  },
  {
    title: "Disclaimers",
    content:
      "The information on this website is provided on an 'as is' basis. To the fullest extent permitted by law, AUREA excludes all representations, warranties, conditions and terms whether express or implied by statute, common law or otherwise.",
  },
  {
    title: "Limitation of Liability",
    content:
      "In no event shall AUREA, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.",
  },
];

const TermsPage = () => {
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
            className="text-6xl md:text-8xl font-bold tracking-wider uppercase text-black leading-none"
          >
            Terms of Service
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-xl md:text-2xl font-medium text-black max-w-lg mx-auto"
          >
            Understanding our terms and conditions.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="pt-8"
          >
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Please read these Terms of Service carefully before using AUREA.
              These terms govern your use of our service and form a legal
              agreement between you and us.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: September 13, 2025
            </p>
          </motion.div>
        </div>
      </section>

      {/* Terms Content Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 tracking-wide">
              Terms & Conditions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These terms outline the rules and regulations for the use of
              AUREA's services
            </p>
          </div>

          <div className="space-y-12">
            {termsData.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 border-l-4 border-black"
              >
                <h3 className="text-2xl font-bold text-black mb-4 tracking-wide">
                  {index + 1}. {section.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-8 tracking-wide">
              Questions About Our Terms?
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              If you have any questions about these Terms of Service, please
              don't hesitate to contact us.
            </p>
            <motion.a
              href="mailto:legal@aurea.com"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="inline-block bg-black text-white px-8 py-4 font-medium tracking-wide uppercase transition-all hover:bg-gray-800"
            >
              Contact Legal Team
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Updates Section */}
      <section className="py-24 px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-wide">
              Terms Updates
            </h2>
            <p className="text-xl md:text-2xl leading-relaxed mb-8">
              We reserve the right to update these terms at any time. Changes
              will be effective immediately upon posting to this page.
            </p>
            <p className="text-lg text-gray-300">
              We recommend reviewing these terms periodically to stay informed
              of any updates or changes.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsPage;
