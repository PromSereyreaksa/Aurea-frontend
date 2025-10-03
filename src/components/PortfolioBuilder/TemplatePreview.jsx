import React from 'react';
import { getTemplateComponent } from '../../templates';

/**
 * TemplatePreview Component
 * 
 * A lightweight wrapper that dynamically loads and renders portfolio templates.
 * This component is intentionally minimal - all template-specific logic lives
 * in the individual template components (e.g., EchelonTemplate).
 * 
 * Props:
 * - template: Template metadata (id, name, etc.)
 * - portfolioData: User's portfolio data including content and templateId
 * - isEditing: Boolean flag to enable/disable edit mode
 * - onContentChange: Callback for content updates (section, field, value)
 */
const TemplatePreview = ({ 
  template, 
  portfolioData, 
  isEditing = false, 
  onContentChange 
}) => {
  // ========================================
  // 1. TEMPLATE LOADING
  // ========================================
  
  // Dynamically load the template component based on templateId
  const TemplateComponent = getTemplateComponent(
    portfolioData?.templateId || template?.id
  );
  
  // Show error if template component not found
  if (!TemplateComponent) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Template Not Found
          </h2>
          <p className="text-gray-600">
            The template "{portfolioData?.templateId || template?.id}" could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  // ========================================
  // 2. CONTENT MANAGEMENT
  // ========================================
  
  // Get content from portfolio data or use template defaults
  const content = portfolioData?.content || template?.defaultContent || {};

  // ========================================
  // 3. CONTENT CHANGE HANDLER
  // ========================================
  
  /**
   * Handle content changes from template components
   * 
   * Templates can call this in two ways:
   * 1. With entire updated content object (for batch updates)
   * 2. With (section, field, value) for individual field updates
   * 
   * We normalize both formats to (section, field, value) for the parent
   */
  const handleContentChange = (sectionOrContent, field, value) => {
    if (!onContentChange || !isEditing) return;

    // Case 1: Template passes entire content object (batch update)
    if (typeof sectionOrContent === 'object' && !field && !value) {
      // Compare with current content to find what changed
      Object.keys(sectionOrContent).forEach(section => {
        const sectionChanged = 
          JSON.stringify(sectionOrContent[section]) !== 
          JSON.stringify(content[section]);
          
        if (sectionChanged) {
          // Notify parent for each changed field in this section
          Object.keys(sectionOrContent[section] || {}).forEach(fieldKey => {
            onContentChange(
              section, 
              fieldKey, 
              sectionOrContent[section][fieldKey]
            );
          });
        }
      });
    } 
    // Case 2: Template passes individual field update (section, field, value)
    else {
      onContentChange(sectionOrContent, field, value);
    }
  };

  // ========================================
  // 4. RENDER
  // ========================================
  
  return (
    <div className="w-full bg-white">
      <TemplateComponent
        content={content}
        isEditing={isEditing}
        onContentChange={handleContentChange}
      />
    </div>
  );
};

export default TemplatePreview;
