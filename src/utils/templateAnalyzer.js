/**
 * Template Analyzer Utility
 * 
 * Analyzes portfolio templates and generates dynamic step configurations
 * for the setup wizard based on the template's structure and content requirements.
 */

/**
 * Analyzes a template and generates step configuration
 * @param {Object} template - The template object to analyze
 * @returns {Array} Array of step configurations
 */
export const analyzeTemplate = (template) => {
  if (!template) return [];

  const steps = [];
  const { defaultContent, sections } = template;

  // Step 1: Basic Information (Always present)
  steps.push({
    id: 'basic',
    title: 'Basic Information',
    description: 'Set up your portfolio basics',
    fields: [
      {
        key: 'title',
        label: 'Portfolio Title',
        type: 'text',
        placeholder: 'My Portfolio',
        optional: true
      },
      {
        key: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: 'A brief description of your portfolio...',
        optional: true
      }
    ]
  });

  // Analyze default content structure
  if (defaultContent) {
    // Hero/Header Section
    if (defaultContent.hero) {
      const heroFields = generateFieldsFromObject(defaultContent.hero, 'hero');
      if (heroFields.length > 0) {
        steps.push({
          id: 'hero',
          title: 'Hero Section',
          description: 'Configure your portfolio header',
          fields: heroFields
        });
      }
    }

    // About Section
    if (defaultContent.about) {
      const aboutFields = generateFieldsFromObject(defaultContent.about, 'about');
      if (aboutFields.length > 0) {
        steps.push({
          id: 'about',
          title: 'About',
          description: 'Tell visitors about yourself',
          fields: aboutFields
        });
      }
    }

    // Work/Projects Section
    if (defaultContent.work) {
      let workFields = [];
      const hasMultipleProjects = Array.isArray(defaultContent.work.projects) && defaultContent.work.projects.length > 1;
      
      // Add heading field
      if (defaultContent.work.heading) {
        workFields.push({
          key: 'work.heading',
          label: 'Section Heading',
          type: 'text',
          placeholder: defaultContent.work.heading,
          optional: true
        });
      }
      
      // If there are projects, add fields for the first project
      if (Array.isArray(defaultContent.work.projects) && defaultContent.work.projects.length > 0) {
        const project = defaultContent.work.projects[0];
        
        // Only add specific fields we want, skip metadata
        if (project.title !== undefined) {
          workFields.push({
            key: 'work.projects.0.title',
            label: 'Project Title',
            type: 'text',
            placeholder: 'Project Title',
            optional: true
          });
        }
        if (project.description !== undefined) {
          workFields.push({
            key: 'work.projects.0.description',
            label: 'Project Description',
            type: 'textarea',
            placeholder: 'Brief description of your project...',
            optional: true
          });
        }
        if (project.image !== undefined) {
          workFields.push({
            key: 'work.projects.0.image',
            label: 'Project Image',
            type: 'image',
            placeholder: 'Upload project image',
            optional: true
          });
        }
        if (project.category !== undefined) {
          workFields.push({
            key: 'work.projects.0.category',
            label: 'Category',
            type: 'text',
            placeholder: 'design, development, etc.',
            optional: true
          });
        }
      }
      
      steps.push({
        id: 'work',
        title: 'Case Studies',
        description: hasMultipleProjects 
          ? 'Add your first case study' 
          : 'Add your case study details',
        fields: workFields,
        supportsMultiple: hasMultipleProjects
      });
    }

    // Gallery Section
    if (defaultContent.gallery) {
      let galleryFields = [];
      const maxGalleryImages = Array.isArray(defaultContent.gallery.images) 
        ? defaultContent.gallery.images.length 
        : 6;
      
      // Add heading field
      if (defaultContent.gallery.heading) {
        galleryFields.push({
          key: 'gallery.heading',
          label: 'Gallery Heading',
          type: 'text',
          placeholder: defaultContent.gallery.heading,
          optional: true
        });
      }
      
      // Add single multi-image upload field
      if (Array.isArray(defaultContent.gallery.images)) {
        galleryFields.push({
          key: 'gallery.images',
          label: 'Gallery Images',
          type: 'multi-image',
          placeholder: 'Upload your images',
          optional: true,
          maxImages: maxGalleryImages
        });
      }
      
      steps.push({
        id: 'gallery',
        title: 'Gallery',
        description: `Upload up to ${maxGalleryImages} images for your gallery`,
        fields: galleryFields,
        supportsMultiple: false
      });
    }

    // Contact Section
    if (defaultContent.contact) {
      const contactFields = generateFieldsFromObject(defaultContent.contact, 'contact');
      if (contactFields.length > 0) {
        steps.push({
          id: 'contact',
          title: 'Contact',
          description: 'Add your contact information',
          fields: contactFields
        });
      }
    }
  }

  return steps;
};

/**
 * Generates form fields from an object structure
 * @param {Object} obj - The object to analyze
 * @param {String} prefix - Prefix for field keys
 * @param {Boolean} isCollection - Whether this represents a collection
 * @returns {Array} Array of field configurations
 */
const generateFieldsFromObject = (obj, prefix, isCollection = false) => {
  const fields = [];

  // Skip arrays and handle them separately
  if (Array.isArray(obj)) {
    return fields;
  }

  for (const [key, value] of Object.entries(obj)) {
    // Skip metadata fields
    if (key === 'id' || key === 'key') continue;

    // Handle nested social links
    if (key === 'social' && typeof value === 'object' && !Array.isArray(value)) {
      for (const [socialKey, socialValue] of Object.entries(value)) {
        fields.push({
          key: `${prefix}.social.${socialKey}`,
          label: formatLabel(socialKey),
          type: 'url',
          placeholder: `https://...`,
          optional: true
        });
      }
      continue;
    }

    // Skip arrays in this iteration
    if (Array.isArray(value)) {
      continue;
    }

    // Skip nested objects (except social)
    if (typeof value === 'object' && value !== null) {
      continue;
    }

    const fieldType = inferFieldType(key, value);
    const field = {
      key: `${prefix}.${key}`,
      label: formatLabel(key),
      type: fieldType,
      placeholder: generatePlaceholder(key, fieldType),
      optional: true
    };

    fields.push(field);
  }

  return fields;
};

/**
 * Infers the field type based on key name and value
 * @param {String} key - Field key
 * @param {*} value - Field value
 * @returns {String} Field type
 */
const inferFieldType = (key, value) => {
  const lowerKey = key.toLowerCase();

  // Image fields
  if (lowerKey.includes('image') || lowerKey.includes('photo') || lowerKey.includes('avatar') || 
      lowerKey.includes('picture') || lowerKey === 'src') {
    return 'image';
  }

  // URL fields
  if (lowerKey.includes('url') || lowerKey.includes('link') || lowerKey.includes('website')) {
    return 'url';
  }

  // Email fields
  if (lowerKey.includes('email')) {
    return 'email';
  }

  // Phone fields
  if (lowerKey.includes('phone') || lowerKey.includes('mobile') || lowerKey.includes('tel')) {
    return 'tel';
  }

  // Textarea fields (longer text)
  if (lowerKey.includes('description') || lowerKey.includes('bio') || lowerKey.includes('about') || 
      lowerKey.includes('content') || lowerKey.includes('message') || lowerKey.includes('summary')) {
    return 'textarea';
  }

  // Number fields
  if (lowerKey.includes('year') || lowerKey.includes('age') || lowerKey.includes('count')) {
    return 'number';
  }

  // Default to text
  return 'text';
};

/**
 * Formats a field key into a readable label
 * @param {String} key - Field key
 * @returns {String} Formatted label
 */
const formatLabel = (key) => {
  return key
    .replace(/([A-Z])/g, ' $1') // Add space before capitals
    .replace(/[_-]/g, ' ') // Replace underscores and hyphens with spaces
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
};

/**
 * Generates an appropriate placeholder based on field type
 * @param {String} key - Field key
 * @param {String} type - Field type
 * @returns {String} Placeholder text
 */
const generatePlaceholder = (key, type) => {
  const lowerKey = key.toLowerCase();

  switch (type) {
    case 'email':
      return 'example@email.com';
    case 'tel':
      return '+1 (555) 123-4567';
    case 'url':
      return 'https://example.com';
    case 'number':
      if (lowerKey.includes('year')) return '2024';
      return '0';
    case 'textarea':
      return 'Enter your text here...';
    case 'image':
      return 'Upload an image';
    default:
      return `Enter ${formatLabel(key).toLowerCase()}`;
  }
};

/**
 * Extracts field paths from nested objects
 * @param {Object} obj - Object to extract from
 * @param {String} prefix - Path prefix
 * @returns {Array} Array of field paths
 */
export const extractFieldPaths = (obj, prefix = '') => {
  const paths = [];

  for (const [key, value] of Object.entries(obj)) {
    const currentPath = prefix ? `${prefix}.${key}` : key;

    if (Array.isArray(value)) {
      paths.push({ path: currentPath, type: 'array', structure: value[0] });
    } else if (typeof value === 'object' && value !== null) {
      paths.push(...extractFieldPaths(value, currentPath));
    } else {
      paths.push({ path: currentPath, type: typeof value, value });
    }
  }

  return paths;
};

/**
 * Determines if a template has specific section
 * @param {Object} template - Template to check
 * @param {String} sectionName - Section name to look for
 * @returns {Boolean}
 */
export const hasSection = (template, sectionName) => {
  return template?.defaultContent?.[sectionName] !== undefined;
};

/**
 * Gets the structure of a repeatable section (projects, gallery items, etc.)
 * @param {Object} template - Template object
 * @param {String} sectionName - Section name
 * @param {String} arrayKey - Key of the array within the section
 * @returns {Object|null} Structure object or null
 */
export const getRepeatableStructure = (template, sectionName, arrayKey) => {
  const section = template?.defaultContent?.[sectionName];
  if (!section || !section[arrayKey] || !Array.isArray(section[arrayKey])) {
    return null;
  }

  return section[arrayKey][0] || {};
};
