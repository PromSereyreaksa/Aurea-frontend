import React, { useState } from 'react';
import BoldFolioHero from './sections/BoldFolioHero';
import BoldFolioAbout from './sections/BoldFolioAbout';
import BoldFolioWork from './sections/BoldFolioWork';
import BoldFolioContact from './sections/BoldFolioContact';
import ProjectSidebar from '../../components/PortfolioBuilder/ProjectSidebar';
import { getProjectsForTemplate, ensureProjectIds } from '../../utils/projectUtils';

const BoldFolioTemplate = ({
  content = {},
  isEditing = false,
  isPreview = false,
  onContentChange,
  onSaveBeforeNavigate = null,
  onViewDetails = null,
  className = '',
  portfolioId = null
}) => {
  // Sidebar state for editing mode
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Get all projects for sidebar with ensured IDs
  const allProjects = isEditing
    ? ensureProjectIds(getProjectsForTemplate(content, 'boldfolio'), 'boldfolio')
    : [];

  // Pass onContentChange directly - BoldFolioWork expects (section, field, value) format

  return (
    <div
      className={`boldfolio-template ${className}`}
      style={{
        fontFamily: 'Graphik, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Fira Sans", Roboto, "Avenir Next", "Helvetica Neue", Helvetica, Arial, sans-serif',
        backgroundColor: '#FFFFFF',
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
        fontWeight: '500',
        fontStyle: 'normal'
      }}
    >
      {/* Project Sidebar - Show in editing mode when portfolio exists */}
      {isEditing && portfolioId && portfolioId !== 'new' && (
        <ProjectSidebar
          portfolioId={portfolioId}
          projects={allProjects}
          currentProjectId={null}
          templateType="boldfolio"
          isOpen={sidebarOpen}
          onToggle={setSidebarOpen}
          hasUnsavedChanges={false}
        />
      )}

      {/* Hero Section */}
      <BoldFolioHero
        content={content.hero || {}}
        isEditing={isEditing}
        onContentChange={(field, value) => onContentChange && onContentChange('hero', field, value)}
      />

      {/* Work Section */}
      {(content.work?.projects?.length > 0 || isEditing) && (
        <BoldFolioWork
          content={content.work || {}}
          isEditing={isEditing}
          isPreview={isPreview}
          onContentChange={onContentChange}
          portfolioId={portfolioId}
          onSaveBeforeNavigate={onSaveBeforeNavigate}
          onViewDetails={onViewDetails}
        />
      )}

      {/* About Section */}
      {(content.about || isEditing) && (
        <BoldFolioAbout
          content={content.about || {}}
          isEditing={isEditing}
          onContentChange={(field, value) => onContentChange && onContentChange('about', field, value)}
        />
      )}

      {/* Contact Section */}
      {(content.contact || isEditing) && (
        <BoldFolioContact
          content={content.contact || {}}
          isEditing={isEditing}
          onContentChange={(field, value) => onContentChange && onContentChange('contact', field, value)}
        />
      )}

      {/* Global Styles */}
      <style jsx>{`
        /* Reset & Base Styles */
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Selection */}
        ::selection {
          background-color: #ff0080;
          color: #FFFFFF;
        }

        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }

          html {
            scroll-behavior: auto;
          }
        }

        /* Focus Styles */
        *:focus-visible {
          outline: 2px solid #ff0080;
          outline-offset: 2px;
        }

        /* ContentEditable Styles */
        [contenteditable="true"] {
          outline: 2px dashed #ff0080;
          outline-offset: 4px;
          cursor: text;
        }

        [contenteditable="true"]:focus {
          outline: 2px solid #ff0080;
        }

        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .boldfolio-template {
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default BoldFolioTemplate;
