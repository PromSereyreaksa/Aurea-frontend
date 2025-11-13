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
      className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="max-w-lg md:max-w-xl lg:max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Title - Left aligned, Blossom style */}
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif mb-4 md:mb-6 leading-relaxed"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => isEditing && onChange('title', e.target.textContent)}
              style={{
                fontFamily: fonts.headingFont,
                color: colors.primary,
                fontWeight: 400,
                lineHeight: '1.6'
              }}
            >
              {content.title || 'Rachel Garcia is a tattoo artist based in Queens, NY'}
            </h1>

            {/* Description */}
            <div className="space-y-3 md:space-y-4">
              {(content.description1 || isEditing) && (
                <p
                  className="text-sm sm:text-base md:text-lg leading-relaxed opacity-80"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => isEditing && onChange('description1', e.target.textContent)}
                  style={{
                    fontFamily: fonts.bodyFont,
                    color: colors.text,
                    lineHeight: '1.8'
                  }}
                >
                  {content.description1 || (isEditing ? 'First description paragraph. Tell your story here...' : '')}
                </p>
              )}

              {(content.description2 || isEditing) && (
                <p
                  className="text-sm sm:text-base md:text-lg leading-relaxed opacity-80"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => isEditing && onChange('description2', e.target.textContent)}
                  style={{
                    fontFamily: fonts.bodyFont,
                    color: colors.text,
                    lineHeight: '1.8'
                  }}
                >
                  {content.description2 || (isEditing ? 'Second description paragraph...' : '')}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SereneHero;