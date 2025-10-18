/**
 * Serene Navigation Component
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SereneNavigation = ({ content, styling, isEditing, onChange }) => {
  const { colors, fonts } = styling;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const defaultMenuItems = [
    { label: 'About', link: '#about' },
    { label: 'Shipping & returns', link: '#shipping' },
    { label: 'Cart', link: '#cart' },
  ];

  const menuItems = content.menuItems || defaultMenuItems;

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
      }}
    >
      <div className="px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Logo - Blossom style with superscript 's' */}
          <div className="flex items-center">
            <div
              className="text-[32px] tracking-[0.02em]"
              style={{
                color: colors.primary,
                fontFamily: fonts.bodyFont,
                fontWeight: 500,
                paddingTop: '4px'
              }}
            >
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => isEditing && onChange('logo', e.target.textContent)}
              >
                {content.logo || (
                  <>
                    Blo<sup className="text-[18px] relative -top-2">s</sup>som
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-10">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="transition-colors hover:text-[#3d3d3d]"
                style={{
                  color: colors.secondary,
                  fontFamily: fonts.bodyFont,
                  fontWeight: 500,
                  fontSize: '13px',
                  paddingTop: '4px'
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>

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
                className="block py-2 text-[14px] transition-colors"
                style={{
                  color: colors.secondary,
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