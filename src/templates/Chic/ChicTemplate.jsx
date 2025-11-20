/**
 * Chic Template
 * Editorial/Magazine-inspired portfolio layout
 * Structure: Fixed left sidebar + scrollable right content area
 * Reference: Readymag-style layout with absolute positioning
 */

import React, { useState } from 'react';
import { useBreakpoints } from '../../hooks/useMediaQuery';
import ChicHero from './sections/ChicHero';
import ChicAbout from './sections/ChicAbout';
import ChicWork from './sections/ChicWork';
import ChicContact from './sections/ChicContact';
import ProjectSidebar from '../../components/PortfolioBuilder/ProjectSidebar';
import { getProjectsForTemplate, ensureProjectIds } from '../../utils/projectUtils';

const ChicTemplate = ({
  content = {},
  styling = {},
  isEditing = false,
  onContentChange,
  className = '',
  portfolioId = null,
  baseUrl = '/template-preview/chic'
}) => {
  const { isMobile, isTablet, isDesktop } = useBreakpoints();

  // Sidebar state for editing mode
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Get all projects for sidebar with ensured IDs
  const allProjects = isEditing
    ? ensureProjectIds(getProjectsForTemplate(content, 'chic'), 'chic')
    : [];

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
      display: {
        fontSize: isDesktop ? '90px' : 'clamp(2rem, 5vw, 5.625rem)',
        fontWeight: 400,
        lineHeight: isDesktop ? '102px' : 'clamp(2.25rem, 5.5vw, 6.375rem)',
        letterSpacing: isDesktop ? '-2px' : 'clamp(-1px, -0.15vw, -2px)'
      },
      h1: {
        fontSize: isDesktop ? '48px' : 'clamp(1.75rem, 3.5vw, 3rem)',
        fontWeight: 700,
        lineHeight: isDesktop ? '60px' : 'clamp(2rem, 4vw, 3.75rem)',
        letterSpacing: '-0.02em'
      },
      h2Large: {
        fontSize: isDesktop ? '36px' : 'clamp(1.5rem, 2.8vw, 2.25rem)',
        fontWeight: 500,
        lineHeight: 1.2,
        letterSpacing: isDesktop ? '-1.2px' : 'clamp(-0.6px, -0.08vw, -1.2px)'
      },
      h2: {
        fontSize: isDesktop ? '24px' : 'clamp(1rem, 1.8vw, 1.5rem)',
        fontWeight: 500,
        lineHeight: 1.3,
        letterSpacing: isDesktop ? '-0.6px' : 'clamp(-0.3px, -0.05vw, -0.6px)'
      },
      bodyLarge: {
        fontSize: isDesktop ? '19px' : 'clamp(1rem, 1.4vw, 1.1875rem)',
        fontWeight: 400,
        lineHeight: isDesktop ? '21px' : 'clamp(1.125rem, 1.5vw, 1.3125rem)',
        letterSpacing: isDesktop ? '-0.8px' : 'clamp(-0.4px, -0.06vw, -0.8px)'
      },
      body: {
        fontSize: isDesktop ? '19px' : 'clamp(1rem, 1.4vw, 1.1875rem)',
        fontWeight: 400,
        lineHeight: 1.7,
        letterSpacing: isDesktop ? '-0.2px' : 'clamp(-0.1px, -0.02vw, -0.2px)'
      },
      small: {
        fontSize: isDesktop ? '15px' : 'clamp(0.875rem, 1.2vw, 0.9375rem)',
        fontWeight: 400,
        lineHeight: 1.5,
        letterSpacing: isDesktop ? '-0.6px' : 'clamp(-0.3px, -0.05vw, -0.6px)'
      },
      micro: {
        fontSize: isDesktop ? '14px' : 'clamp(0.8125rem, 1.1vw, 0.875rem)',
        fontWeight: 400,
        lineHeight: 1.4,
        letterSpacing: isDesktop ? '-0.3px' : 'clamp(-0.15px, -0.03vw, -0.3px)'
      }
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
      {/* Project Sidebar - Show in editing mode when portfolio exists */}
      {isEditing && portfolioId && portfolioId !== 'new' && (
        <ProjectSidebar
          portfolioId={portfolioId}
          projects={allProjects}
          currentProjectId={null}
          templateType="chic"
          isOpen={sidebarOpen}
          onToggle={setSidebarOpen}
          hasUnsavedChanges={false}
        />
      )}

      {/* Fixed Left Sidebar - Sticky positioned */}
      <div
        className="fixed-position-container"
        style={{
          position: isDesktop ? 'sticky' : 'relative',
          left: isDesktop ? '40px' : '0',
          top: isDesktop ? '39px' : '0',
          width: isMobile ? '100%' : isTablet ? '300px' : '467px',
          height: isDesktop ? 'calc(100vh - 80px)' : 'auto',
          float: isDesktop ? 'left' : 'none',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: isDesktop ? 'space-between' : 'flex-start',
          paddingBottom: isDesktop ? '40px' : 'clamp(1rem, 3vw, 2.5rem)',
          paddingLeft: !isDesktop ? 'clamp(1rem, 3vw, 1.5rem)' : '0',
          paddingRight: !isDesktop ? 'clamp(1rem, 3vw, 1.5rem)' : '0',
          paddingTop: !isDesktop ? 'clamp(1rem, 3vw, 1.5rem)' : '0',
          overflow: 'visible'
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

        {/* Bottom Section: Contact - Always show in edit mode or when content exists */}
        <div style={{ marginTop: isDesktop ? '0' : 'clamp(2rem, 4vw, 3rem)' }}>
          <ChicContact
            content={content.contact || {}}
            styling={mergedStyling}
            isEditing={isEditing}
            onContentChange={handleSectionContentChange}
          />
        </div>
      </div>

      {/* Scrollable Right Content Area - 1024px canvas */}
      <div
        className="content-scroll-wrapper"
        style={{
          marginLeft: isDesktop ? '547px' : '0', // 40px (left margin) + 467px (sidebar width) + 40px (gap)
          width: isMobile || isTablet ? '100%' : '1024px',
          maxWidth: isDesktop ? '1024px' : '100%',
          minHeight: '100vh',
          paddingTop: '0px',
          paddingRight: !isDesktop ? 'clamp(1rem, 3vw, 1.5rem)' : '0px',
          paddingLeft: !isDesktop ? 'clamp(1rem, 3vw, 1.5rem)' : '0px',
          paddingBottom: isDesktop ? '80px' : 'clamp(3rem, 6vw, 5rem)',
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
            portfolioId={portfolioId}
            baseUrl={baseUrl}
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
