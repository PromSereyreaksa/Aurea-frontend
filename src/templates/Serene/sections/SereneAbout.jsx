/**
 * Serene About Section - Profile and biography
 */

import React from 'react';
import { motion } from 'framer-motion';

const SereneAbout = ({ content, styling, isEditing, onChange }) => {
  const { colors, fonts } = styling;

  return (
    <section
      id="about"
      className="py-20 px-6"
      style={{ backgroundColor: colors.surface }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-2 md:order-1"
          >
            {content.image ? (
              <img
                src={content.image}
                alt={content.name || 'Profile'}
                className="w-full aspect-square rounded-lg object-cover shadow-lg"
                style={{ borderColor: colors.border }}
              />
            ) : (
              isEditing && (
                <div
                  className="w-full aspect-square rounded-lg flex items-center justify-center bg-gray-100"
                  style={{ borderColor: colors.border }}
                >
                  <p className="text-gray-400">Click to add image</p>
                </div>
              )
            )}
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-1 md:order-2"
          >
            {/* Name */}
            <h2
              className="text-4xl md:text-5xl font-serif mb-4"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => isEditing && onChange('name', e.target.textContent)}
              style={{
                fontFamily: fonts.headingFont,
                color: colors.primary
              }}
            >
              {content.name || 'About Me'}
            </h2>

            {/* Role */}
            <p
              className="text-xl mb-6 opacity-70"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => isEditing && onChange('role', e.target.textContent)}
              style={{
                fontFamily: fonts.bodyFont,
                color: colors.secondary
              }}
            >
              {content.role || (isEditing ? 'Your Role' : '')}
            </p>

            {/* Divider */}
            <div
              className="h-px w-16 mb-6"
              style={{ backgroundColor: colors.accent }}
            />

            {/* Bio */}
            <p
              className="text-base md:text-lg leading-relaxed whitespace-pre-wrap mb-8"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => isEditing && onChange('bio', e.target.textContent)}
              style={{
                fontFamily: fonts.bodyFont,
                color: colors.text
              }}
            >
              {content.bio || (isEditing ? 'Tell us about yourself...' : '')}
            </p>

            {/* Details */}
            <div className="space-y-3">
              {(content.location || isEditing) && (
                <div className="flex items-center space-x-3">
                  <span style={{ color: colors.accent }}>📍</span>
                  <span
                    className="text-sm"
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => isEditing && onChange('location', e.target.textContent)}
                    style={{
                      fontFamily: fonts.bodyFont,
                      color: colors.textSecondary
                    }}
                  >
                    {content.location || (isEditing ? 'City, Country' : '')}
                  </span>
                </div>
              )}

              {(content.experience || isEditing) && (
                <div className="flex items-center space-x-3">
                  <span style={{ color: colors.accent }}>⏱</span>
                  <span
                    className="text-sm"
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => isEditing && onChange('experience', e.target.textContent)}
                    style={{
                      fontFamily: fonts.bodyFont,
                      color: colors.textSecondary
                    }}
                  >
                    {content.experience || (isEditing ? '5+ years' : '')}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SereneAbout;