/**
 * Dynamic Template Renderer
 *
 * Renders portfolio templates dynamically based on schema from backend
 * Replaces the need for hardcoded template components
 */

import React, { useMemo, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

// Dynamic section components based on type
const sectionComponents = {
  hero: lazy(() => import('./Sections/DynamicHeroSection')),
  about: lazy(() => import('./Sections/DynamicAboutSection')),
  work: lazy(() => import('./Sections/DynamicWorkSection')),
  gallery: lazy(() => import('./Sections/DynamicGallerySection')),
  contact: lazy(() => import('./Sections/DynamicContactSection')),
  custom: lazy(() => import('./Sections/DynamicCustomSection')),
  // Additional section type mappings
  projects: lazy(() => import('./Sections/DynamicWorkSection')), // Alias for work
  portfolio: lazy(() => import('./Sections/DynamicWorkSection')), // Alias for work
  navigation: lazy(() => import('./Sections/DynamicCustomSection')), // Use custom for nav
};

// Loading placeholder
const SectionLoader = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-64"></div>
    </div>
  </div>
);

/**
 * Dynamic Template Renderer Component
 */
const DynamicTemplateRenderer = ({
  template,           // Template object with schema
  content,           // Portfolio content data
  styling,           // Portfolio styling overrides
  isEditing = false, // Enable edit mode
  isPreview = false, // Preview mode
  onContentChange,   // Content change handler
  className,         // Additional classes
  portfolioId,       // Portfolio ID
  caseStudies = [],  // Case studies data
}) => {
  // Merge template styling with portfolio overrides
  const mergedStyling = useMemo(() => {
    if (!template?.styling) return styling || {};

    return {
      ...template.styling,
      ...styling,
      colors: { ...template.styling.colors, ...styling?.colors },
      fonts: { ...template.styling.fonts, ...styling?.fonts },
      typography: { ...template.styling.typography, ...styling?.typography },
      spacing: { ...template.styling.spacing, ...styling?.spacing },
    };
  }, [template, styling]);

  // Generate CSS variables from styling
  const cssVariables = useMemo(() => {
    const vars = {};

    // Colors
    if (mergedStyling.colors) {
      Object.entries(mergedStyling.colors).forEach(([key, value]) => {
        vars[`--color-${key}`] = value;
      });
    }

    // Fonts
    if (mergedStyling.fonts) {
      Object.entries(mergedStyling.fonts).forEach(([key, value]) => {
        vars[`--font-${key}`] = value;
      });
    }

    // Typography
    if (mergedStyling.typography?.scale) {
      Object.entries(mergedStyling.typography.scale).forEach(([key, value]) => {
        vars[`--text-${key}`] = value;
      });
    }

    // Spacing
    if (mergedStyling.spacing) {
      Object.entries(mergedStyling.spacing).forEach(([key, value]) => {
        vars[`--spacing-${key}`] = value;
      });
    }

    return vars;
  }, [mergedStyling]);

  // Get sections from template schema
  const sections = useMemo(() => {
    if (!template?.schema?.sections) return [];

    return Object.entries(template.schema.sections).map(([id, config]) => ({
      id,
      ...config,
      content: content?.[id] || template.defaultContent?.[id] || {},
    }));
  }, [template, content]);

  // Handle content updates
  const handleSectionChange = (sectionId, fieldId, value) => {
    if (!onContentChange) return;

    // Special handling for section operations
    if (sectionId === '_sections') {
      onContentChange(sectionId, fieldId, value);
      return;
    }

    // Regular field update
    onContentChange(sectionId, fieldId, value);
  };

  // Render section based on type
  const renderSection = (section) => {
    const SectionComponent = sectionComponents[section.type] || sectionComponents.custom;

    if (!SectionComponent) {
      console.warn(`Unknown section type: ${section.type}`);
      return null;
    }

    return (
      <Suspense key={section.id} fallback={<SectionLoader />}>
        <SectionComponent
          id={section.id}
          config={section}
          content={section.content}
          styling={mergedStyling}
          isEditing={isEditing}
          onChange={(fieldId, value) => handleSectionChange(section.id, fieldId, value)}
          portfolioId={portfolioId}
          caseStudies={section.type === 'work' ? caseStudies : undefined}
        />
      </Suspense>
    );
  };

  // Apply template-specific wrapper classes
  const wrapperClasses = cn(
    'min-h-screen',
    'dynamic-template',
    `template-${template?.id}`,
    `category-${template?.category}`,
    {
      'edit-mode': isEditing,
      'preview-mode': isPreview,
    },
    className
  );

  return (
    <div
      className={wrapperClasses}
      style={cssVariables}
      data-template-id={template?.id}
      data-template-version={template?.version}
    >
      {/* Global styles injection */}
      <style jsx global>{`
        .template-${template?.id} {
          --font-heading: ${mergedStyling.fonts?.heading || 'inherit'};
          --font-body: ${mergedStyling.fonts?.body || 'inherit'};
          --font-mono: ${mergedStyling.fonts?.mono || 'monospace'};
        }

        .template-${template?.id} h1,
        .template-${template?.id} h2,
        .template-${template?.id} h3,
        .template-${template?.id} h4,
        .template-${template?.id} h5,
        .template-${template?.id} h6 {
          font-family: var(--font-heading);
        }

        .template-${template?.id} body,
        .template-${template?.id} p,
        .template-${template?.id} span {
          font-family: var(--font-body);
        }

        .template-${template?.id} code,
        .template-${template?.id} pre {
          font-family: var(--font-mono);
        }
      `}</style>

      {/* Render sections */}
      <AnimatePresence mode="wait">
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
          >
            {renderSection(section)}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Edit mode overlay */}
      {isEditing && (
        <div className="fixed bottom-4 left-4 z-50">
          <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Edit Mode
          </div>
        </div>
      )}

      {/* Template info (development mode) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50 text-xs bg-black/50 text-white p-2 rounded">
          Template: {template?.name} (v{template?.version})
        </div>
      )}
    </div>
  );
};

export default DynamicTemplateRenderer;