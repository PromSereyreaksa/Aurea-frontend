/**
 * Serene Navigation Component
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useParams } from 'react-router-dom';

const SereneNavigation = ({ content, styling, isEditing, onChange, portfolioId }) => {
  const { colors, fonts } = styling;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Check if we're in builder mode (editing) or preview mode
  const isInBuilder = isEditing;

  const defaultMenuItems = [
    { label: 'About', link: isInBuilder ? `/portfolio-builder/${portfolioId}/about` : '/template-preview/serene/about' },
  ];

  // In builder mode, always use the new about editor link, otherwise use content.menuItems if available
  const menuItems = isInBuilder ? defaultMenuItems : (content.menuItems || defaultMenuItems);

  return (
    <header
      className="border-b border-gray-200 bg-white"
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
      }}
    >
      <div className="px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo - Blossom style - BOLD */}
          <button
            onClick={() => {
              if (isInBuilder) {
                // In builder mode, scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                // In preview mode, navigate to home
                navigate('/template-preview/serene');
              }
            }}
            className="text-2xl tracking-wider transition-opacity hover:opacity-70"
            style={{
              color: colors.text,
              fontFamily: fonts.bodyFont,
              fontWeight: 600,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0
            }}
          >
            <span
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => isEditing && onChange('logo', e.target.textContent)}
            >
              {content.logo || 'Blossom'}
            </span>
          </button>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-12">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                style={{
                  color: colors.secondary,
                  fontFamily: fonts.bodyFont,
                  fontWeight: 500,
                  fontSize: '16px',
                  textDecoration: 'none'
                }}
              >
                {item.label}
              </Link>
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
              <Link
                key={index}
                to={item.link}
                className="block py-2 text-[16px] transition-colors"
                style={{
                  color: colors.secondary,
                  fontFamily: fonts.bodyFont,
                  textDecoration: 'none',
                  fontWeight: 500,
                  padding: '8px 0'
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default SereneNavigation;