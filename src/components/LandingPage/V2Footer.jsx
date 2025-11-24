import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
const aureaLogo = "/AUREA - Logo.png";

export default function V2Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    sitemap: [
      { label: "Home", link: "/" },
      { label: "Templates", link: "/templates" },
      { label: "Contact", link: "/contact" },
    ],
    utilities: [
      { label: "Terms of Service", link: "/terms" },
      { label: "Privacy Policy", link: "/privacy" },
      { label: "Documentation", link: "/docs" },
    ],
    social: [
      { label: "Facebook", link: "https://www.facebook.com/share/1A4c5CNGSe/?mibextid=wwXIfr" },
      { label: "TikTok", link: "https://www.tiktok.com/@aureatool?_r=1&_t=ZS-91MDnNGGcwE" },
      { label: "Gmail", link: "mailto:aureatool@gmail.com" },
    ],
  };

  return (
    <footer className="relative bg-[#1a1a1a] text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Section - CTA */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="text-[#fb8500] font-bold text-sm uppercase tracking-[0.3em]">
              (Ready to start?)
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-black mb-8"
          >
            CREATE YOUR PORTFOLIO
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/80 text-xl md:text-2xl mb-12 max-w-3xl mx-auto"
          >
            Join thousands of designers showcasing their work beautifully
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              to="/signup"
              className="inline-block bg-[#fb8500] hover:bg-[#ff9500] text-white px-12 py-4 rounded-full font-bold text-lg uppercase tracking-wider transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Get Started Free
            </Link>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mb-16"></div>

        {/* Middle Section - Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Logo */}
          <div>
            <img
              src={aureaLogo}
              alt="AUREA"
              className="h-10 w-auto mb-4"
            />
            <p className="text-white/60 text-sm leading-relaxed">
              Where creative visions become beautiful websites.
            </p>
          </div>

          {/* Sitemap */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-[#fb8500]">
              Sitemap
            </h3>
            <ul className="space-y-3">
              {footerLinks.sitemap.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.link}
                    className="text-white/60 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Utilities */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-[#fb8500]">
              Utilities
            </h3>
            <ul className="space-y-3">
              {footerLinks.utilities.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.link}
                    className="text-white/60 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-[#fb8500]">
              Social
            </h3>
            <ul className="space-y-3">
              {footerLinks.social.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div className="flex items-center justify-center pt-8 border-t border-white/10">
          <p className="text-white/40 text-sm">© {currentYear} AUREA</p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#fb8500]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#fb8500]/5 rounded-full blur-3xl pointer-events-none"></div>
    </footer>
  );
}
