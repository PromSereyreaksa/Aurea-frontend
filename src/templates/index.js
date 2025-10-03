// Template system for portfolio builder
// Each template defines structure, default content, and styling

// Import template components
import EchelonTemplate from './Echelon/EchelonTemplate';

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
        primary: '#000000',       // Pure black
        secondary: '#666666',     // Medium gray
        accent: '#B80000',        // Swiss red for accents
        background: '#FFFFFF',    // Pure white
        surface: '#FFFFFF',       // Pure white
        text: '#000000',          // Pure black
        textSecondary: '#666666', // Medium gray
        border: '#000000'         // Black borders
      },
      fonts: {
        heading: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
        body: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
        mono: '"IBM Plex Mono", "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
      },
      typography: {
        scale: {
          h1: '72px',   // Large headlines
          h2: '48px',   // Section headings
          h3: '32px',   // Subsection headings
          h4: '24px',   // Small headings
          body: '18px', // Body text
          small: '16px', // Small text
          meta: '14px'  // Metadata
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
        section: '120px',  // Large section spacing
        element: '40px',   // Element spacing
        tight: '16px',     // Tight spacing
        baseline: '8px'    // Baseline grid
      },
      borderRadius: {
        none: '0px'        // No border radius for Swiss style
      }
    },

    // Responsive breakpoints
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
  return templates[templateId];
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
  const template = templates[templateId];
  return template ? template.component : null;
};