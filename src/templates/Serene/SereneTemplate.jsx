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
  // Merge styling from backend with defaults - Blossom color palette (exact match)
  const colors = styling?.colorScheme || styling?.colors || {
    primary: '#3d3d3d',
    secondary: '#9e9b95',
    accent: '#d4cfc8',
    background: '#e8e6e3',
    surface: '#ffffff',
    text: '#3d3d3d',
    textSecondary: '#9e9b95',
    border: '#c4c3c3'
  };

  const fonts = styling?.typography || styling?.fonts || {
    headingFont: "tscy, 'Crimson Text', serif",
    bodyFont: "tscy, 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    monoFont: "tscy, 'Crimson Text', serif"
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
        href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap"
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

      {/* Gallery Section (includes hero text and masonry grid) */}
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