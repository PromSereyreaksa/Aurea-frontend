/**
 * Serene Hero Section - Elegant and minimal hero with botanical feel
 */

import React from 'react';
import { motion } from 'framer-motion';

const SereneHero = ({ content, styling, isEditing, onChange }) => {
  const { colors, fonts } = styling;

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center px-6 py-20"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Title */}
          <h1
            className="text-5xl md:text-7xl font-serif mb-6"
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => isEditing && onChange('title', e.target.textContent)}
            style={{
              fontFamily: fonts.headingFont,
              color: colors.primary,
              fontWeight: 400
            }}
          >
            {content.title || 'Welcome to My Portfolio'}
          </h1>

          {/* Subtitle */}
          <p
            className="text-xl md:text-2xl mb-8 opacity-80"
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => isEditing && onChange('subtitle', e.target.textContent)}
            style={{
              fontFamily: fonts.bodyFont,
              color: colors.secondary
            }}
          >
            {content.subtitle || 'Creating beauty through design'}
          </p>

          {/* Decorative Divider */}
          <div className="flex items-center justify-center my-12">
            <div
              className="h-px w-24"
              style={{ backgroundColor: colors.accent }}
            />
            <span
              className="mx-4 text-2xl"
              style={{ color: colors.accent }}
            >
              ✦
            </span>
            <div
              className="h-px w-24"
              style={{ backgroundColor: colors.accent }}
            />
          </div>

          {/* Description 1 */}
          {(content.description1 || isEditing) && (
            <div className="max-w-2xl mx-auto mb-6">
              <p
                className="text-base md:text-lg leading-relaxed"
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => isEditing && onChange('description1', e.target.textContent)}
                style={{
                  fontFamily: fonts.bodyFont,
                  color: colors.text
                }}
              >
                {content.description1 || (isEditing ? 'First description paragraph...' : '')}
              </p>
            </div>
          )}

          {/* Description 2 */}
          {(content.description2 || isEditing) && (
            <div className="max-w-2xl mx-auto">
              <p
                className="text-base md:text-lg leading-relaxed"
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => isEditing && onChange('description2', e.target.textContent)}
                style={{
                  fontFamily: fonts.bodyFont,
                  color: colors.text
                }}
              >
                {content.description2 || (isEditing ? 'Second description paragraph...' : '')}
              </p>
            </div>
          )}

          {/* Scroll Indicator */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <a
              href="#about"
              className="inline-block"
              style={{ color: colors.accent }}
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </motion.div>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SereneHero;