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
  // Normalize template IDs (handle legacy IDs)
  const normalizeTemplateId = (id) => {
    if (!id) return 'echolon';
    const legacyMap = {
      'minimal-designer': 'echolon',
      'minimal': 'echolon',
      'designer': 'echolon',
      'swiss': 'echolon'
    };
    return legacyMap[id] || id;
  };

  console.log('📥 convertToTemplateFormat - Input portfolio:', {
    hasTemplate: !!portfolio.template,
    hasTemplateId: !!portfolio.templateId,
    hasContent: !!portfolio.content,
    hasSections: !!portfolio.sections,
    template: portfolio.template,
    templateId: portfolio.templateId,
    sectionsLength: portfolio.sections?.length,
    contentKeys: portfolio.content ? Object.keys(portfolio.content) : [],
    contentGallery: portfolio.content?.gallery
  });

  // Handle backend returning 'template' as string field
  // Check if portfolio has content field (new format)
  if (portfolio.content && typeof portfolio.content === 'object' && Object.keys(portfolio.content).length > 0) {
    const templateId = normalizeTemplateId(portfolio.template || portfolio.templateId || 'echolon');
    console.log('✅ Using content-based format with templateId:', templateId);
    console.log('   Content gallery:', {
      firstRow: portfolio.content.gallery?.firstRow?.length,
      secondRow: portfolio.content.gallery?.secondRow?.length,
      thirdRow: portfolio.content.gallery?.thirdRow?.length
    });
    return {
      ...portfolio,
      templateId: templateId,
      content: portfolio.content,
      styling: portfolio.styling || {},
      structure: portfolio.structure || {},
      metadata: portfolio.metadata || {},
    };
  }

  // Convert sections-based format to new template format
  if (portfolio.sections && Array.isArray(portfolio.sections) && portfolio.sections.length > 0) {
    console.log('✅ Converting sections-based format to template format');
    const content = portfolio.sections.reduce((acc, section) => {
      let sectionContent = section.content;

      // SPECIAL CASE: Reconstruct Serene gallery rows from flattened images array
      if (section.type === 'gallery' && sectionContent.images && sectionContent._rowLengths) {
        console.log('🔄 Reconstructing Serene gallery rows from flattened images');

        // Convert __EMPTY__ markers back to empty strings
        const unmarkEmptyImage = (item) => {
          if (item.image === '__EMPTY__') {
            return { ...item, image: '' };
          }
          return item;
        };

        const images = sectionContent.images.map(unmarkEmptyImage);
        const rowLengths = sectionContent._rowLengths;
        let currentIndex = 0;

        sectionContent = {
          heading: sectionContent.heading,
          heroText1: sectionContent.heroText1,
          heroText2: sectionContent.heroText2,
          firstRow: images.slice(currentIndex, currentIndex + rowLengths.firstRow),
          secondRow: images.slice(currentIndex + rowLengths.firstRow, currentIndex + rowLengths.firstRow + rowLengths.secondRow),
          thirdRow: images.slice(currentIndex + rowLengths.firstRow + rowLengths.secondRow, currentIndex + rowLengths.firstRow + rowLengths.secondRow + rowLengths.thirdRow)
        };

        console.log(`   Reconstructed rows:`, {
          firstRow: sectionContent.firstRow.length,
          secondRow: sectionContent.secondRow.length,
          thirdRow: sectionContent.thirdRow.length
        });
      }

      acc[section.type] = sectionContent;
      return acc;
    }, {});

    return {
      templateId: normalizeTemplateId(portfolio.template || portfolio.templateId || 'echolon'),
      content: content,
      styling: portfolio.styling || {},
      structure: portfolio.structure || {},
      metadata: portfolio.metadata || {},
    };
  }

  // Fallback to empty portfolio structure
  console.error('❌ Using fallback empty structure - NO CONTENT OR SECTIONS FOUND!');
  console.error('   This means the backend returned neither content nor sections');
  return {
    templateId: normalizeTemplateId(portfolio.template || portfolio.templateId || 'echolon'),
    content: {},
    styling: portfolio.styling || {},
    structure: portfolio.structure || {},
    metadata: portfolio.metadata || {},
  };
};

/**
 * Converts template content format to backend sections format
 * Used when saving to backend API
 *
 * IMPORTANT: Transforms template-specific structures to match backend schema
 */
export const convertContentToSections = (content) => {
  if (!content) return [];

  const sections = [];
  // Define which fields are actual content sections (not metadata/styling)
  const contentFields = [
    'navigation', 'hero', 'about', 'work', 'gallery', 'projects', 'contact',
    'experience', 'education', 'skills', 'testimonials', 'certifications', 'services'
  ];

  console.log('📦 convertContentToSections - Input content keys:', Object.keys(content));

  Object.entries(content).forEach(([sectionType, sectionContent]) => {
    // Only include actual content sections
    if (contentFields.includes(sectionType) && sectionContent) {
      let transformedContent = sectionContent;

      // SPECIAL CASE: Serene gallery uses firstRow/secondRow/thirdRow
      // Backend schema expects gallery.images array
      if (sectionType === 'gallery' && (sectionContent.firstRow || sectionContent.secondRow || sectionContent.thirdRow)) {
        console.log('🔄 Transforming Serene gallery format to backend schema');

        // IMPORTANT: Use a special marker for empty images so backend doesn't filter them
        // We use "__EMPTY__" as a placeholder that will be converted back to "" when loading
        const markEmptyImage = (item) => {
          if (!item.image || item.image === '') {
            return { ...item, image: '__EMPTY__' };
          }
          return item;
        };

        // Flatten all rows into a single images array with marked empty images
        const images = [
          ...(sectionContent.firstRow || []).map(markEmptyImage),
          ...(sectionContent.secondRow || []).map(markEmptyImage),
          ...(sectionContent.thirdRow || []).map(markEmptyImage)
        ];

        transformedContent = {
          heading: sectionContent.heading || sectionContent.heroText1 || 'My Work',
          heroText1: sectionContent.heroText1,
          heroText2: sectionContent.heroText2,
          images: images,
          // Store row lengths for reconstruction
          _rowLengths: {
            firstRow: (sectionContent.firstRow || []).length,
            secondRow: (sectionContent.secondRow || []).length,
            thirdRow: (sectionContent.thirdRow || []).length
          }
        };

        console.log(`   Flattened ${images.length} images from rows (with empty markers)`);
      }

      sections.push({
        type: sectionType,
        content: transformedContent,
      });
      console.log(`✅ Added section "${sectionType}" to sections array`);
    } else if (sectionContent) {
      console.log(`⚠️ Skipped section "${sectionType}" (not in contentFields list)`);
    }
  });

  console.log(`📦 convertContentToSections - Output: ${sections.length} sections`);

  return sections;
};

// ========================================
// 3. DATA CLEANUP
// ========================================

/**
 * Cleans up placeholder data before saving to backend
 * Removes invalid placeholder image paths that would cause errors
 * IMPORTANT: This should ONLY clean invalid paths, NOT remove empty placeholders
 */
export const cleanupPlaceholderData = (portfolioData) => {
  if (!portfolioData || !portfolioData.content) {
    return portfolioData;
  }

  console.log('🧹 cleanupPlaceholderData - Before cleanup:', {
    galleryFirstRow: portfolioData.content.gallery?.firstRow?.length,
    gallerySecondRow: portfolioData.content.gallery?.secondRow?.length,
    galleryThirdRow: portfolioData.content.gallery?.thirdRow?.length,
    workProjects: portfolioData.content.work?.projects?.length
  });

  const cleanedContent = { ...portfolioData.content };

  // Helper to clean placeholder paths
  const cleanPlaceholderPath = (value) => {
    // Don't clean our special __EMPTY__ marker
    if (value === '__EMPTY__') {
      return value;
    }
    // Clean invalid placeholder paths
    if (typeof value === 'string' && value.includes('/placeholder') && !value.startsWith('http')) {
      return ''; // Remove invalid placeholder paths
    }
    return value;
  };

  // Helper to recursively clean objects and arrays
  const cleanImageValue = (value) => {
    if (typeof value === 'string') {
      return cleanPlaceholderPath(value);
    } else if (Array.isArray(value)) {
      // Keep all array items, just clean their image URLs
      return value.map(item => cleanImageValue(item));
    } else if (value && typeof value === 'object') {
      // Clean object properties recursively
      const cleaned = {};
      Object.keys(value).forEach(key => {
        if (key === 'image' || key === 'src') {
          cleaned[key] = cleanPlaceholderPath(value[key]);
        } else if (key === 'images' && Array.isArray(value[key])) {
          // Preserve all images in array, just clean their URLs
          cleaned[key] = value[key].map(img => {
            if (typeof img === 'string') {
              return cleanPlaceholderPath(img);
            } else if (img && typeof img === 'object') {
              return {
                ...img,
                src: img.src ? cleanPlaceholderPath(img.src) : img.src
              };
            }
            return img;
          });
        } else {
          cleaned[key] = value[key];
        }
      });
      return cleaned;
    }
    return value;
  };

  // Clean each section - preserve all structure, just clean invalid paths
  Object.keys(cleanedContent).forEach((sectionKey) => {
    const section = cleanedContent[sectionKey];

    if (typeof section === 'object' && section !== null) {
      Object.keys(section).forEach((fieldKey) => {
        const fieldValue = section[fieldKey];

        // Clean single image fields
        if (fieldKey === 'image' || fieldKey === 'src') {
          cleanedContent[sectionKey][fieldKey] = cleanPlaceholderPath(fieldValue);
        }
        // Clean projects array (Chic, BoldFolio templates)
        else if (fieldKey === 'projects' && Array.isArray(fieldValue)) {
          cleanedContent[sectionKey][fieldKey] = fieldValue.map((project) => {
            const cleaned = { ...project };
            if (cleaned.image) {
              cleaned.image = cleanPlaceholderPath(cleaned.image);
            }
            // BoldFolio has nested images array
            if (cleaned.images && Array.isArray(cleaned.images)) {
              cleaned.images = cleaned.images.map(img => ({
                ...img,
                src: img.src ? cleanPlaceholderPath(img.src) : img.src
              }));
            }
            return cleaned;
          });
        }
        // Clean Serene template rows (firstRow, secondRow, thirdRow)
        else if ((fieldKey === 'firstRow' || fieldKey === 'secondRow' || fieldKey === 'thirdRow') && Array.isArray(fieldValue)) {
          cleanedContent[sectionKey][fieldKey] = fieldValue.map((item) => ({
            ...item,
            image: item.image ? cleanPlaceholderPath(item.image) : item.image
          }));
        }
        // Clean gallery images array
        else if (fieldKey === 'images' && Array.isArray(fieldValue)) {
          cleanedContent[sectionKey][fieldKey] = fieldValue.map((img) => {
            if (typeof img === 'string') {
              return cleanPlaceholderPath(img);
            } else if (img && typeof img === 'object') {
              return {
                ...img,
                src: img.src ? cleanPlaceholderPath(img.src) : img.src
              };
            }
            return img;
          });
        }
      });
    }
  });

  console.log('🧹 cleanupPlaceholderData - After cleanup:', {
    galleryFirstRow: cleanedContent.gallery?.firstRow?.length,
    gallerySecondRow: cleanedContent.gallery?.secondRow?.length,
    galleryThirdRow: cleanedContent.gallery?.thirdRow?.length,
    workProjects: cleanedContent.work?.projects?.length,
    galleryFirstRowSample: cleanedContent.gallery?.firstRow?.[0],
    gallerySecondRowSample: cleanedContent.gallery?.secondRow?.[0]
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
  
  // Trim whitespace
  const trimmedValue = value.trim();
  
  // Empty strings are valid (for placeholder images)
  if (trimmedValue === '') return true;
  
  // Allow: http://, https://, blob:, data:image/, relative paths, and cloudinary/s3/etc URLs
  const isValid = !!trimmedValue.match(/^(https?:\/\/|blob:|\/|data:image\/|\.\/)/);

  // Debug logging
  if (!isValid) {
    console.warn('❌ Invalid image URL detected:', {
      value: trimmedValue,
      length: trimmedValue.length,
      startsWithHttp: trimmedValue.startsWith('http'),
      startsWithHttps: trimmedValue.startsWith('https'),
      startsWithBlob: trimmedValue.startsWith('blob:'),
      regexTest: /^(https?:\/\/|blob:)/.test(trimmedValue)
    });
  }

  return isValid;
};

/**
 * Detects if portfolio data contains any blob URLs (temporary local URLs)
 * Returns true if blob URLs are found, indicating uploads still in progress
 */
export const hasBlobUrls = (portfolioData) => {
  if (!portfolioData || !portfolioData.content) return false;

  const checkValue = (value) => {
    if (typeof value === 'string') {
      return value.startsWith('blob:');
    }
    if (Array.isArray(value)) {
      return value.some(item => {
        if (typeof item === 'string') return item.startsWith('blob:');
        if (typeof item === 'object' && item !== null) {
          return Object.values(item).some(checkValue);
        }
        return false;
      });
    }
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(checkValue);
    }
    return false;
  };

  return Object.values(portfolioData.content).some(section => {
    if (typeof section === 'object' && section !== null) {
      return Object.values(section).some(checkValue);
    }
    return false;
  });
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
