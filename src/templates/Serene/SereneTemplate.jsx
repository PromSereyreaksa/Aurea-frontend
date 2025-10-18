/**
 * Serene Template
 *
 * Botanical and elegant portfolio template with soft, organic, nature-inspired design
 * Schema-driven template that adapts to backend configuration
 */

import React from 'react';
import { motion } from 'framer-motion';
import SereneNavigation from './sections/SereneNavigation';
import SereneHero from './sections/SereneHero';
import SereneAbout from './sections/SereneAbout';
import SereneGallery from './sections/SereneGallery';

const SereneTemplate = ({
  content = {},
  styling = {},
  isEditing = false,
  onContentChange = () => {},
  className = '',
  portfolioId,
}) => {
  // Merge styling from backend with defaults
  const colors = styling?.colorScheme || styling?.colors || {
    primary: '#403f33',
    secondary: '#6c6258',
    accent: '#c4c3bd',
    background: '#fafbfb',
    surface: '#FFFFFF',
    text: '#403f33',
    textSecondary: '#6c6258',
    border: '#d4d2cd'
  };

  const fonts = styling?.typography || styling?.fonts || {
    headingFont: "'Crimson Text', serif",
    bodyFont: "'Crimson Text', serif",
    monoFont: "'Crimson Text', serif"
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
      className={`serene-template min-h-screen ${className}`}
      style={globalStyle}
    >
      {/* Global Font Import */}
      <link
        href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&display=swap"
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

      {/* Hero Section */}
      {content.hero && (
        <SereneHero
          content={content.hero}
          styling={{ colors, fonts }}
          isEditing={isEditing}
          onChange={(fieldId, value) => onContentChange('hero', fieldId, value)}
        />
      )}

      {/* About Section */}
      {content.about && (
        <SereneAbout
          content={content.about}
          styling={{ colors, fonts }}
          isEditing={isEditing}
          onChange={(fieldId, value) => onContentChange('about', fieldId, value)}
        />
      )}

      {/* Gallery Section */}
      {content.gallery && (
        <SereneGallery
          content={content.gallery}
          styling={{ colors, fonts }}
          isEditing={isEditing}
          onChange={(fieldId, value) => onContentChange('gallery', fieldId, value)}
        />
      )}

      {/* Footer */}
      <footer
        className="py-12 text-center border-t"
        style={{
          borderColor: colors.border,
          backgroundColor: colors.surface
        }}
      >
        <p className="text-sm opacity-60" style={{ color: colors.textSecondary }}>
          © {new Date().getFullYear()} {content.about?.name || 'Portfolio'}. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default SereneTemplate;