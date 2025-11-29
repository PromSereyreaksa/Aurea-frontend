/**
 * Serene Template
 *
 * Botanical and elegant portfolio template with soft, organic, nature-inspired design
 * Schema-driven template that adapts to backend configuration
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SereneNavigation from './sections/SereneNavigation';
import SereneHero from './sections/SereneHero';
import SereneGallery from './sections/SereneGallery';
import ProjectSidebar from '../../components/PortfolioBuilder/ProjectSidebar';
import { getProjectsForTemplate, ensureProjectIds } from '../../utils/projectUtils';

const SereneTemplate = ({
  content = {},
  styling = {},
  isEditing = false,
  isPreview = false,
  onContentChange = () => {},
  onSaveBeforeNavigate = null,
  onViewDetails = null,
  className = '',
  portfolioId,
  baseUrl = '/template-preview/serene',
}) => {
  // Sidebar state for editing mode
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Get all projects for sidebar with ensured IDs
  const allProjects = isEditing
    ? ensureProjectIds(getProjectsForTemplate(content, 'serene'), 'serene')
    : [];

  // Merge styling from backend with defaults - Clean Blossom color palette
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
      className={`serene-template min-h-screen ${className}`}
      style={globalStyle}
    >
      {/* Global Font Import */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* Project Sidebar - Show in editing mode when portfolio exists */}
      {isEditing && portfolioId && portfolioId !== 'new' && (
        <ProjectSidebar
          portfolioId={portfolioId}
          projects={allProjects}
          currentProjectId={null}
          templateType="serene"
          isOpen={sidebarOpen}
          onToggle={setSidebarOpen}
          hasUnsavedChanges={false}
        />
      )}

      {/* Navigation */}
      {content.navigation && (
        <SereneNavigation
          content={content.navigation}
          styling={{ colors, fonts }}
          isEditing={isEditing}
          onChange={(fieldId, value) => onContentChange('navigation', fieldId, value)}
          portfolioId={portfolioId}
        />
      )}

      {/* Gallery Section (includes hero text and masonry grid) */}
      {content.gallery && (
        <SereneGallery
          content={content.gallery}
          styling={{ colors, fonts }}
          isEditing={isEditing}
          isPreview={isPreview}
          onChange={(fieldId, value) => onContentChange('gallery', fieldId, value)}
          portfolioId={portfolioId}
          baseUrl={baseUrl}
          onSaveBeforeNavigate={onSaveBeforeNavigate}
          onViewDetails={onViewDetails}
        />
      )}

      {/* About Section removed - now on separate page accessed via navbar */}

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