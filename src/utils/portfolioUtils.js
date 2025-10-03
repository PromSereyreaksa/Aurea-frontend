/**
 * Portfolio Builder Utility Functions
 * 
 * Helper functions for data manipulation, validation, and transformations
 * used in the portfolio builder.
 */

// ========================================
// 1. DEBOUNCE UTILITY
// ========================================

/**
 * Creates a debounced version of a function
 * Delays execution until after wait milliseconds have passed since last call
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ========================================
// 2. DATA TRANSFORMATION
// ========================================

/**
 * Converts backend portfolio format to template format
 * Handles both new format (with templateId/content) and old format (with sections)
 */
export const convertToTemplateFormat = (portfolio) => {
  // If already in template format, return as-is
  if (portfolio.templateId && portfolio.content) {
    return portfolio;
  }

  // Convert old sections-based format to new template format
  const templateData = {
    templateId: portfolio.template || 'minimal-designer',
    content: portfolio.sections?.reduce((acc, section) => {
      acc[section.type] = section.content;
      return acc;
    }, {}) || {},
    styling: portfolio.styling || {},
    structure: portfolio.structure || {},
    metadata: portfolio.metadata || {},
  };

  return templateData;
};

/**
 * Converts template content format to backend sections format
 * Used when saving to backend API
 */
export const convertContentToSections = (content) => {
  if (!content) return [];

  const sections = [];
  // Define which fields are actual content sections (not metadata/styling)
  const contentFields = [
    'hero', 'about', 'projects', 'contact', 'experience', 
    'education', 'skills', 'testimonials', 'certifications', 'services'
  ];
  
  Object.entries(content).forEach(([sectionType, sectionContent]) => {
    // Only include actual content sections
    if (contentFields.includes(sectionType) && sectionContent) {
      sections.push({
        type: sectionType,
        content: sectionContent,
      });
    }
  });
  
  return sections;
};

// ========================================
// 3. DATA CLEANUP
// ========================================

/**
 * Cleans up placeholder data before saving to backend
 * Removes invalid placeholder image paths that would cause errors
 */
export const cleanupPlaceholderData = (portfolioData) => {
  if (!portfolioData || !portfolioData.content) {
    return portfolioData;
  }

  const cleanedContent = { ...portfolioData.content };

  // Helper to clean placeholder paths
  const cleanPlaceholderPath = (value) => {
    if (typeof value === 'string' && value.includes('/placeholder') && !value.startsWith('http')) {
      return ''; // Remove invalid placeholder paths
    }
    return value;
  };

  // Clean each section
  Object.keys(cleanedContent).forEach((sectionKey) => {
    const section = cleanedContent[sectionKey];

    if (typeof section === 'object' && section !== null) {
      Object.keys(section).forEach((fieldKey) => {
        const fieldValue = section[fieldKey];

        // Clean image fields
        if (fieldKey === 'image') {
          cleanedContent[sectionKey][fieldKey] = cleanPlaceholderPath(fieldValue);
        } 
        // Clean project images (array of projects)
        else if (fieldKey === 'projects' && Array.isArray(fieldValue)) {
          cleanedContent[sectionKey][fieldKey] = fieldValue.map((project) => ({
            ...project,
            image: cleanPlaceholderPath(project.image),
          }));
        }
      });
    }
  });

  return {
    ...portfolioData,
    content: cleanedContent,
    _version: (portfolioData._version || 0) + 1,
  };
};

// ========================================
// 4. IMAGE URL VALIDATION
// ========================================

// Default fallback images
const DEFAULT_HERO_IMAGE = 'https://via.placeholder.co/400x300?text=Default+Image';
const DEFAULT_PROJECT_IMAGE = 'https://via.placeholder.co/400x300?text=Default+Project';

/**
 * Ensures all image URLs are valid for rendering
 * Adds fallback images where needed
 */
export const ensureValidImageUrls = (portfolioData) => {
  if (!portfolioData || !portfolioData.content) {
    return portfolioData;
  }

  const updatedContent = { ...portfolioData.content };

  // Ensure hero image (empty string for proper placeholder rendering)
  updatedContent.hero = {
    ...updatedContent.hero,
    image: updatedContent.hero?.image || '',
  };

  // Ensure project images
  if (updatedContent.projects && Array.isArray(updatedContent.projects)) {
    updatedContent.projects = updatedContent.projects.map((project) => ({
      ...project,
      image: project.image || DEFAULT_PROJECT_IMAGE,
    }));
  } else {
    updatedContent.projects = [];
  }

  return {
    ...portfolioData,
    content: updatedContent,
    _version: (portfolioData._version || 0) + 1,
  };
};

// ========================================
// 5. LOCAL STORAGE HELPERS
// ========================================

/**
 * Generates local storage key for portfolio drafts
 */
export const getLocalStorageKey = (portfolioId) => {
  return `portfolio-draft-${portfolioId || 'new'}`;
};

/**
 * Saves portfolio draft to local storage
 */
export const saveToLocalStorage = (portfolioId, data, title, description, templateId) => {
  try {
    const key = getLocalStorageKey(portfolioId);
    const saveData = {
      portfolioData: data,
      title,
      description,
      selectedTemplateId: templateId,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(saveData));
    return true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    return false;
  }
};

/**
 * Loads portfolio draft from local storage
 */
export const loadFromLocalStorage = (portfolioId) => {
  try {
    const key = getLocalStorageKey(portfolioId);
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
  }
  return null;
};

/**
 * Clears portfolio draft from local storage
 */
export const clearLocalStorage = (portfolioId) => {
  try {
    const key = getLocalStorageKey(portfolioId);
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
    return false;
  }
};

// ========================================
// 6. VALIDATION
// ========================================

/**
 * Validates if an image URL is valid
 */
export const isValidImageUrl = (value) => {
  if (!value || typeof value !== 'string') return false;
  
  // Allow: http://, https://, data:image/, and relative paths
  return value.match(/^(https?:\/\/|\/|data:image\/)/);
};

/**
 * Checks if a field is an image field
 */
export const isImageField = (fieldId, value) => {
  return (
    fieldId === 'image' || 
    fieldId.includes('image') || 
    (typeof value === 'string' && value.startsWith('data:image/'))
  );
};
