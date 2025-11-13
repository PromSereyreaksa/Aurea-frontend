/**
 * Chic Template
 * Editorial/Magazine-inspired portfolio layout
 * Structure: Fixed left sidebar + scrollable right content area
 * Reference: Readymag-style layout with absolute positioning
 */

import React from 'react';
import ChicHero from './sections/ChicHero';
import ChicAbout from './sections/ChicAbout';
import ChicWork from './sections/ChicWork';
import ChicContact from './sections/ChicContact';

const ChicTemplate = ({
  content = {},
  styling = {},
  isEditing = false,
  onContentChange,
  className = '',
  portfolioId = null
}) => {
  // Default styling - Chic Editorial theme
  const defaultStyling = {
    colors: {
      background: '#FFFFFF',
      surface: '#FFFFFF',
      text: '#000000',
      textSecondary: '#141414',
      textBody: '#282828',
      textLight: '#666666',
      textMuted: 'rgba(129, 129, 129, 1)',
      accent: '#FF00A1',
      accentSecondary: '#E86223',
      hover: '#E86223',
      border: '#d6d6d6',
      borderDark: '#282828'
    },
    fonts: {
      inter: '"Inter", -apple-system, system-ui, sans-serif',
      graphik: '"Graphik", "Inter", sans-serif',
      titillium: '"Titillium Web", "Inter", sans-serif',
      nobel: '"Nobel", "Inter", "Helvetica Neue", sans-serif',
      heading: '"Nobel", "Inter", "Helvetica Neue", sans-serif',
      body: '"Inter", -apple-system, system-ui, sans-serif'
    },
    typography: {
      display: { fontSize: '90px', fontWeight: 400, lineHeight: '102px', letterSpacing: '-2px' },
      h1: { fontSize: '48px', fontWeight: 700, lineHeight: '60px', letterSpacing: '-0.02em' },
      h2Large: { fontSize: '36px', fontWeight: 500, lineHeight: 1.2, letterSpacing: '-1.2px' },
      h2: { fontSize: '24px', fontWeight: 500, lineHeight: 1.3, letterSpacing: '-0.6px' },
      bodyLarge: { fontSize: '19px', fontWeight: 400, lineHeight: '21px', letterSpacing: '-0.8px' },
      body: { fontSize: '19px', fontWeight: 400, lineHeight: 1.7, letterSpacing: '-0.2px' },
      small: { fontSize: '15px', fontWeight: 400, lineHeight: 1.5, letterSpacing: '-0.6px' },
      micro: { fontSize: '14px', fontWeight: 400, lineHeight: 1.4, letterSpacing: '-0.3px' }
    }
  };

  // Merge styling
  const mergedStyling = {
    colors: { ...defaultStyling.colors, ...styling?.colors },
    fonts: { ...defaultStyling.fonts, ...styling?.fonts },
    typography: { ...defaultStyling.typography, ...styling?.typography }
  };

  // Handle content changes
  const handleSectionContentChange = (section, field, value) => {
    if (onContentChange) {
      onContentChange({
        ...content,
        [section]: {
          ...content[section],
          [field]: value
        }
      });
    }
  };

  return (
    <div
      className={`chic-template ${className}`}
      style={{
        fontFamily: mergedStyling.fonts.body,
        color: mergedStyling.colors.text,
        backgroundColor: mergedStyling.colors.background,
        minHeight: '100vh',
        width: '100%',
        position: 'relative'
      }}
    >
      {/* Fixed Left Sidebar - Sticky positioned */}
      <div
        className="fixed-position-container"
        style={{
          position: 'sticky',
          left: '40px',
          top: '39px',
          width: '467px',
          height: 'calc(100vh - 80px)',
          float: 'left',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          paddingBottom: '40px'
        }}
      >
        {/* Top Section: Hero + About */}
        <div>
          <ChicHero
            content={content.hero || {}}
            styling={mergedStyling}
            isEditing={isEditing}
            onContentChange={handleSectionContentChange}
          />

          {(content.about || isEditing) && (
            <div style={{ marginTop: '3rem' }}>
              <ChicAbout
                content={content.about || {}}
                styling={mergedStyling}
                isEditing={isEditing}
                onContentChange={handleSectionContentChange}
              />
            </div>
          )}
        </div>

        {/* Bottom Section: Contact */}
        {(content.contact || isEditing) && (
          <div>
            <ChicContact
              content={content.contact || {}}
              styling={mergedStyling}
              isEditing={isEditing}
              onContentChange={handleSectionContentChange}
            />
          </div>
        )}
      </div>

      {/* Scrollable Right Content Area - 1024px canvas */}
      <div
        className="content-scroll-wrapper"
        style={{
          marginLeft: '547px', // 40px (left margin) + 467px (sidebar width) + 40px (gap)
          width: '1024px',
          maxWidth: '1024px',
          minHeight: '100vh',
          paddingTop: '0px',
          paddingRight: '0px',
          paddingBottom: '80px',
          position: 'relative'
        }}
      >
        {/* Work Section - Projects */}
        {(content.work || isEditing) && (
          <ChicWork
            content={content.work || {}}
            styling={mergedStyling}
            isEditing={isEditing}
            onContentChange={handleSectionContentChange}
          />
        )}
      </div>

      {/* Global Styles */}
      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .chic-template {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          font-variation-settings: 'wght' 400;
        }

        ::selection {
          background-color: ${mergedStyling.colors.textSecondary};
          color: ${mergedStyling.colors.background};
        }

        * {
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }

        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .fixed-position-container {
            position: relative !important;
            float: none !important;
            width: 100% !important;
            height: auto !important;
            padding: 2rem !important;
          }

          .content-scroll-wrapper {
            margin-left: 0 !important;
            padding: 2rem !important;
          }
        }

        /* Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: ${mergedStyling.colors.border};
        }

        ::-webkit-scrollbar-thumb {
          background: ${mergedStyling.colors.textSecondary};
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: ${mergedStyling.colors.accent};
        }

        /* Focus Styles */
        *:focus-visible {
          outline: 2px solid ${mergedStyling.colors.accent};
          outline-offset: 2px;
        }

        /* ContentEditable Styles */
        [contenteditable="true"] {
          outline: 2px dashed ${mergedStyling.colors.accent};
          outline-offset: 4px;
          cursor: text;
        }

        [contenteditable="true"]:focus {
          outline: 2px solid ${mergedStyling.colors.accent};
        }
      `}</style>
    </div>
  );
};

export default ChicTemplate;
