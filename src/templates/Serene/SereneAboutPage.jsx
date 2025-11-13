/**
 * Serene About Page
 *
 * Standalone About page with 3-column text layout matching Blossom design
 */

import React from 'react';
import { motion } from 'framer-motion';
import SereneNavigation from './sections/SereneNavigation';

const SereneAboutPage = ({
  content = {},
  styling = {},
  isEditing = false,
  onContentChange = () => {},
  className = '',
}) => {
  // Merge styling from backend with defaults
  const colors = styling?.colorScheme || styling?.colors || {
    primary: '#4a5568',
    secondary: '#9ca3af',
    accent: '#e5e7eb',
    background: '#ffffff',
    surface: '#ffffff',
    text: '#6b7280',
    textSecondary: '#9ca3af',
    border: '#e5e7eb'
  };

  const fonts = styling?.typography || styling?.fonts || {
    headingFont: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    bodyFont: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    monoFont: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  };

  // Apply global styling
  const globalStyle = {
    '--color-primary': colors.primary,
    '--color-secondary': colors.secondary,
    '--color-accent': colors.accent,
    '--color-background': colors.background,
    '--color-surface': colors.surface,
    '--color-text': colors.text,
    '--color-text-secondary': colors.textSecondary,
    '--color-border': colors.border,
    '--font-heading': fonts.headingFont,
    '--font-body': fonts.bodyFont,
    '--font-mono': fonts.monoFont,
    backgroundColor: colors.background,
    color: colors.text,
    fontFamily: fonts.bodyFont,
  };

  return (
    <div
      className={`serene-about-page min-h-screen ${className}`}
      style={globalStyle}
    >
      {/* Global Font Import */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* Navigation */}
      {content.navigation && (
        <SereneNavigation
          content={content.navigation}
          styling={{ colors, fonts }}
          isEditing={isEditing}
          onChange={(fieldId, value) => onContentChange('navigation', fieldId, value)}
        />
      )}

      {/* About Content - 3 Column Layout */}
      <section
        className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8"
        style={{ backgroundColor: colors.background }}
      >
        <div>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
            {/* Column 1 */}
            <div className="text-gray-500 leading-relaxed">
              <p
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => isEditing && onContentChange('about', 'bio1', e.target.textContent)}
                className="text-base md:text-lg lg:text-xl"
                style={{
                  color: colors.text,
                  fontFamily: fonts.bodyFont,
                  fontWeight: 600,
                  lineHeight: '1.7'
                }}
              >
                {content.about?.bio1 || (isEditing ? 'Click to edit: First paragraph of your about section. Share your background and story.' : 'Specializing in minimalist logo design and comprehensive brand identity systems that bring clarity and recognition to modern businesses.')}
              </p>

              <div className="mt-8">
                <span
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => isEditing && onContentChange('about', 'tagline', e.target.textContent)}
                  className="text-base md:text-lg lg:text-xl"
                  style={{
                    color: colors.text,
                    fontFamily: fonts.bodyFont,
                    fontWeight: 600,
                    lineHeight: '1.7'
                  }}
                >
                  {content.about?.tagline || (isEditing ? 'Click to edit: Add a special tagline or quote about your work here.' : '')}
                </span>
              </div>
            </div>

            {/* Column 2 */}
            <div className="text-gray-500 leading-relaxed">
              <p
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => isEditing && onContentChange('about', 'bio2', e.target.textContent)}
                className="text-base md:text-lg lg:text-xl"
                style={{
                  color: colors.text,
                  fontFamily: fonts.bodyFont,
                  fontWeight: 600,
                  lineHeight: '1.7'
                }}
              >
                {content.about?.bio2 || (isEditing ? 'Click to edit: Second paragraph. Describe your education, experience, or approach.' : 'With over 8 years of experience, I create distinctive logos that capture the essence of brands through clean, memorable design solutions.')}
              </p>
            </div>

            {/* Column 3 */}
            <div className="text-gray-500 leading-relaxed">
              <p
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => isEditing && onContentChange('about', 'bio3', e.target.textContent)}
                className="text-base md:text-lg lg:text-xl"
                style={{
                  color: colors.text,
                  fontFamily: fonts.bodyFont,
                  fontWeight: 600,
                  lineHeight: '1.7'
                }}
              >
                {content.about?.bio3 || (isEditing ? 'Click to edit: Third paragraph. Share what inspires you or recent achievements.' : 'Award-winning logo designer specializing in creating distinctive brand identities for global companies across various industries.')}
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default SereneAboutPage;
