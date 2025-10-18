/**
 * Serene Navigation Component
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SereneNavigation = ({ content, styling, isEditing, onChange }) => {
  const { colors, fonts } = styling;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = content.menuItems || [
    { label: 'Home', link: '#home' },
    { label: 'About', link: '#about' },
    { label: 'Gallery', link: '#gallery' },
  ];

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={{
        backgroundColor: `${colors.surface}ee`,
        borderColor: colors.border,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            {content.logoImage && !isEditing && (
              <img
                src={content.logoImage}
                alt="Logo"
                className="h-8 w-auto"
              />
            )}
            <span
              className="text-xl font-semibold"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => isEditing && onChange('logo', e.target.textContent)}
              style={{ fontFamily: fonts.headingFont, color: colors.primary }}
            >
              {content.logo || 'Portfolio'}
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="transition-colors hover:opacity-70"
                style={{
                  color: colors.text,
                  fontFamily: fonts.bodyFont
                }}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ color: colors.primary }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 pb-4 space-y-3"
          >
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="block py-2 transition-colors hover:opacity-70"
                style={{
                  color: colors.text,
                  fontFamily: fonts.bodyFont
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default SereneNavigation;