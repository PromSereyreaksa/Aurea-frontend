// Template system for portfolio builder
// This is the FALLBACK when backend API is unavailable
// Templates are fetched from backend in production

// Import template components
import EchelonTemplate from './Echelon/EchelonTemplate';
import SereneTemplate from './Serene/SereneTemplate';

export const templates = {
  'echolon': {
    id: 'echolon',
    name: 'Echelon',
    description: 'Swiss/International Typographic Style - clean, precise, grid-driven design',
    category: 'swiss',
    preview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    previewUrl: '/template-preview/echelon',
    component: EchelonTemplate,

    // Template structure defines sections and their layout
    structure: {
      hero: {
        type: 'hero',
        layout: 'swiss_minimal',
        editable: ['title', 'subtitle']
      },
      about: {
        type: 'about',
        layout: 'two_column_swiss',
        editable: ['image', 'bio', 'name']
      },
      work: {
        type: 'work',
        layout: 'project_list_swiss',
        editable: ['projects']
      },
      gallery: {
        type: 'gallery',
        layout: 'image_grid_swiss',
        editable: ['images']
      },
      contact: {
        type: 'contact',
        layout: 'minimal_swiss',
        editable: ['text', 'button']
      }
    },

    // Default content that users can edit
    defaultContent: {
      hero: {
        title: 'DESIGNING WITH PRECISION',
        subtitle: 'Case studies in clarity and form'
      },
      about: {
        name: 'DESIGNER NAME',
        image: '',
        bio: 'I am a designer focused on minimalism, clarity, and modernist design systems. My work emphasizes grid-based layouts, precise typography, and functional design solutions that prioritize clarity and usability above all else.'
      },
      work: {
        heading: 'SELECTED WORK',
        projects: [
          {
            id: 1,
            title: 'PROJECT TITLE',
            description: 'Brief description of your project and what it accomplishes.',
            image: '',
            meta: '2025 — Category',
            category: 'design'
          }
        ]
      },
      gallery: {
        heading: 'VISUAL STUDIES',
        images: [
          { src: '', caption: 'Visual exploration 01', meta: '01' },
          { src: '', caption: 'Visual exploration 02', meta: '02' },
          { src: '', caption: 'Visual exploration 03', meta: '03' },
          { src: '', caption: 'Visual exploration 04', meta: '04' },
          { src: '', caption: 'Visual exploration 05', meta: '05' },
          { src: '', caption: 'Visual exploration 06', meta: '06' }
        ]
      },
      contact: {
        heading: 'GET IN TOUCH',
        text: 'Available for new projects and collaborations.',
        button: 'CONTACT',
        email: 'hello@designer.com'
      }
    },

    // Swiss/International Typographic Style configuration
    styling: {
      colors: {
        primary: '#000000',
        secondary: '#666666',
        accent: '#B80000',
        background: '#FFFFFF',
        surface: '#FFFFFF',
        text: '#000000',
        textSecondary: '#666666',
        border: '#000000'
      },
      fonts: {
        heading: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
        body: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
        mono: '"IBM Plex Mono", "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
      },
      typography: {
        scale: {
          h1: '72px',
          h2: '48px',
          h3: '32px',
          h4: '24px',
          body: '18px',
          small: '16px',
          meta: '14px'
        },
        lineHeight: {
          tight: 1.1,
          normal: 1.4,
          relaxed: 1.6
        },
        fontWeight: {
          regular: 400,
          bold: 700
        }
      },
      grid: {
        columns: 12,
        gutter: '24px',
        margin: '80px',
        baseline: '8px'
      },
      spacing: {
        section: '120px',
        element: '40px',
        tight: '16px',
        baseline: '8px'
      },
      borderRadius: {
        none: '0px'
      }
    },

    responsive: {
      mobile: '640px',
      tablet: '768px',
      desktop: '1024px',
      wide: '1280px'
    }
  },

  'serene': {
    id: 'serene',
    name: 'Serene',
    description: 'Botanical and elegant portfolio template with soft, organic, nature-inspired design',
    category: 'creative',
    preview: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    previewUrl: '/template-preview/serene',
    component: SereneTemplate,

    structure: {
      navigation: {
        type: 'navigation',
        layout: 'sticky_nav',
        editable: ['logo', 'logoImage', 'menuItems']
      },
      hero: {
        type: 'hero',
        layout: 'centered_elegant',
        editable: ['title', 'subtitle', 'description1', 'description2']
      },
      about: {
        type: 'about',
        layout: 'split_layout',
        editable: ['name', 'role', 'image', 'bio', 'location', 'experience']
      },
      gallery: {
        type: 'gallery',
        layout: 'asymmetric_grid',
        editable: ['heading', 'images']
      }
    },

    defaultContent: {
      navigation: {
        logo: 'Your Name',
        logoImage: '',
        menuItems: [
          { label: 'Home', link: '#home' },
          { label: 'About', link: '#about' },
          { label: 'Gallery', link: '#gallery' }
        ]
      },
      hero: {
        title: 'Welcome to My Portfolio',
        subtitle: 'Creating beauty through design',
        description1: '',
        description2: ''
      },
      about: {
        name: 'Jane Doe',
        role: 'Creative Designer',
        image: '',
        bio: 'Tell us about yourself...',
        location: 'City, Country',
        experience: '5+ years'
      },
      gallery: {
        heading: 'My Work',
        images: [
          { image: '', title: 'Project 1', description: 'Description', price: '', caption: '' },
          { image: '', title: 'Project 2', description: 'Description', price: '', caption: '' },
          { image: '', title: 'Project 3', description: 'Description', price: '', caption: '' }
        ]
      }
    },

    styling: {
      colors: {
        primary: '#403f33',
        secondary: '#6c6258',
        accent: '#c4c3bd',
        background: '#fafbfb',
        surface: '#FFFFFF',
        text: '#403f33',
        textSecondary: '#6c6258',
        border: '#d4d2cd'
      },
      fonts: {
        heading: "'Crimson Text', serif",
        body: "'Crimson Text', serif",
        mono: "'Crimson Text', serif"
      },
      typography: {
        scale: {
          h1: '72px',
          h2: '48px',
          h3: '32px',
          h4: '24px',
          body: '18px',
          small: '16px',
          meta: '14px'
        },
        lineHeight: {
          tight: 1.1,
          normal: 1.4,
          relaxed: 1.6
        },
        fontWeight: {
          regular: 400,
          bold: 600
        }
      },
      spacing: {
        section: '120px',
        element: '40px',
        tight: '16px',
        baseline: '8px'
      }
    },

    responsive: {
      mobile: '640px',
      tablet: '768px',
      desktop: '1024px',
      wide: '1280px'
    }
  }
};

// Helper function to get template by ID
export const getTemplate = (templateId) => {
  // Normalize template ID (handle old IDs)
  const normalizedId = normalizeTemplateId(templateId);

  // Return template or null if not found
  return templates[normalizedId] || null;
};

// Normalize template IDs to handle legacy/old IDs
const normalizeTemplateId = (templateId) => {
  if (!templateId) return 'echolon';

  // Map old template IDs to new ones
  const legacyMap = {
    'minimal-designer': 'echolon',
    'minimal': 'echolon',
    'designer': 'echolon',
    'swiss': 'echolon',
    'echelon': 'echolon' // Handle correct spelling
  };

  return legacyMap[templateId] || templateId;
};

// Helper function to get all templates
export const getAllTemplates = () => {
  return Object.values(templates);
};

// Helper function to create a new portfolio from template
export const createPortfolioFromTemplate = (templateId, customizations = {}) => {
  const template = getTemplate(templateId);
  if (!template) {
    throw new Error(`Template with ID ${templateId} not found`);
  }

  // Deep merge function to merge nested objects
  const deepMerge = (target, source) => {
    const result = { ...target };

    for (const key in source) {
      if (source[key] !== null && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }

    return result;
  };

  // Merge content with customizations
  const mergedContent = deepMerge(template.defaultContent, customizations);

  // Merge styling if provided
  const mergedStyling = customizations.styling
    ? deepMerge(template.styling, customizations.styling)
    : template.styling;

  return {
    templateId,
    content: mergedContent,
    styling: mergedStyling,
    structure: template.structure,
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      templateVersion: '1.0.0'
    }
  };
};

// Get template component for rendering
export const getTemplateComponent = (templateId) => {
  // Normalize template ID to handle legacy IDs
  const normalizedId = normalizeTemplateId(templateId);
  const template = templates[normalizedId];
  return template ? template.component : null;
};