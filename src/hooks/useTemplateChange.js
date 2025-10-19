/**
 * useTemplateChange Hook
 *
 * Handles switching between templates with content migration
 * Maps content from old template schema to new template schema
 */

import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

/**
 * Analyzes compatibility between two templates
 * @param {Object} fromTemplate - Current template
 * @param {Object} toTemplate - Target template
 * @param {Object} currentContent - Current portfolio content
 * @returns {Object} Compatibility analysis
 */
function analyzeCompatibility(fromTemplate, toTemplate, currentContent) {
  const issues = [];
  const warnings = [];
  const mappable = [];
  const unmappable = [];

  // Get sections from both templates
  const fromSections = fromTemplate.schema?.sections ||
    Object.keys(fromTemplate.defaultContent || {});
  const toSections = toTemplate.schema?.sections ||
    Object.keys(toTemplate.defaultContent || {});

  // Convert to arrays if needed
  const fromSectionIds = Array.isArray(fromSections)
    ? fromSections.map(s => s.id || s)
    : fromSections;
  const toSectionIds = Array.isArray(toSections)
    ? toSections.map(s => s.id || s)
    : toSections;

  // Check which sections can be mapped
  fromSectionIds.forEach(sectionId => {
    if (currentContent[sectionId] && Object.keys(currentContent[sectionId]).length > 0) {
      if (toSectionIds.includes(sectionId)) {
        mappable.push(sectionId);
      } else {
        unmappable.push(sectionId);
        warnings.push(`Section "${sectionId}" exists in current template but not in new template`);
      }
    }
  });

  // Check for new required sections
  const toSectionsArray = Array.isArray(toSections) ? toSections : [];
  toSectionsArray.forEach(section => {
    const sectionId = section.id || section;
    if (section.required && !fromSectionIds.includes(sectionId)) {
      issues.push(`New template requires "${sectionId}" section which doesn't exist in current template`);
    }
  });

  return {
    compatible: issues.length === 0,
    issues,
    warnings,
    mappable,
    unmappable,
    summary: {
      totalSections: fromSectionIds.length,
      mappableSections: mappable.length,
      unmappableSections: unmappable.length,
      newRequiredSections: issues.length,
    }
  };
}

/**
 * Migrates content from one template to another
 * @param {Object} fromTemplate - Current template
 * @param {Object} toTemplate - Target template
 * @param {Object} currentContent - Current portfolio content
 * @returns {Object} Migrated content
 */
function migrateContent(fromTemplate, toTemplate, currentContent) {
  console.log('🔄 Migrating content from', fromTemplate.id, 'to', toTemplate.id);

  // Start with new template's default content
  const migratedContent = JSON.parse(JSON.stringify(toTemplate.defaultContent || {}));

  // Get sections from new template
  const toSections = toTemplate.schema?.sections || Object.keys(toTemplate.defaultContent || {});
  const toSectionIds = Array.isArray(toSections)
    ? toSections.map(s => s.id || s)
    : toSections;

  // Map content from old to new
  Object.keys(currentContent).forEach(sectionId => {
    const sectionContent = currentContent[sectionId];

    // If section exists in new template, try to map it
    if (toSectionIds.includes(sectionId)) {
      // Direct mapping for sections with same ID
      migratedContent[sectionId] = {
        ...migratedContent[sectionId], // Start with defaults
        ...sectionContent, // Override with current content
      };

      console.log(`✅ Mapped section: ${sectionId}`);
    } else {
      console.log(`⚠️ Skipped unmappable section: ${sectionId}`);
    }
  });

  // Special handling for common sections with different IDs
  // Map 'hero' to 'header' or vice versa
  if (currentContent.hero && !migratedContent.hero && toSectionIds.includes('header')) {
    migratedContent.header = {
      ...migratedContent.header,
      ...currentContent.hero,
    };
    console.log('✅ Mapped hero → header');
  }

  if (currentContent.header && !migratedContent.header && toSectionIds.includes('hero')) {
    migratedContent.hero = {
      ...migratedContent.hero,
      ...currentContent.header,
    };
    console.log('✅ Mapped header → hero');
  }

  // Map 'projects' to 'work' or vice versa
  if (currentContent.projects && !migratedContent.projects && toSectionIds.includes('work')) {
    migratedContent.work = {
      ...migratedContent.work,
      projects: currentContent.projects.projects || currentContent.projects,
    };
    console.log('✅ Mapped projects → work');
  }

  if (currentContent.work && !migratedContent.work && toSectionIds.includes('projects')) {
    migratedContent.projects = {
      ...migratedContent.projects,
      projects: currentContent.work.projects || currentContent.work,
    };
    console.log('✅ Mapped work → projects');
  }

  return migratedContent;
}

/**
 * Hook for handling template changes
 */
export default function useTemplateChange() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [compatibility, setCompatibility] = useState(null);

  /**
   * Analyze compatibility between templates
   */
  const analyzeChange = useCallback(async (fromTemplate, toTemplate, currentContent) => {
    setIsAnalyzing(true);

    try {
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 300));

      const analysis = analyzeCompatibility(fromTemplate, toTemplate, currentContent);
      setCompatibility(analysis);

      return analysis;
    } catch (error) {
      console.error('Error analyzing template change:', error);
      toast.error('Failed to analyze template compatibility');
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  /**
   * Execute template change with content migration
   */
  const changeTemplate = useCallback(async (fromTemplate, toTemplate, currentContent) => {
    try {
      console.log('🎨 Changing template:', fromTemplate.id, '→', toTemplate.id);

      // Analyze compatibility first
      const analysis = await analyzeChange(fromTemplate, toTemplate, currentContent);

      if (!analysis) {
        throw new Error('Failed to analyze template compatibility');
      }

      // Migrate content
      const migratedContent = migrateContent(fromTemplate, toTemplate, currentContent);

      // Return migrated portfolio data
      return {
        success: true,
        content: migratedContent,
        analysis,
        message: `Successfully migrated ${analysis.summary.mappableSections} sections`,
      };
    } catch (error) {
      console.error('Error changing template:', error);
      toast.error('Failed to change template');
      return {
        success: false,
        error: error.message,
      };
    }
  }, [analyzeChange]);

  /**
   * Reset analysis
   */
  const resetAnalysis = useCallback(() => {
    setCompatibility(null);
  }, []);

  return {
    isAnalyzing,
    compatibility,
    analyzeChange,
    changeTemplate,
    resetAnalysis,
  };
}
