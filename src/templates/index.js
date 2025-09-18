// Template system for portfolio builder
// Each template defines structure, default content, and styling

export const templates = {
  'minimal-designer': {
    id: 'minimal-designer',
    name: 'Minimal Designer',
    description: 'Clean, minimal template perfect for designers and creatives',
    category: 'design',
    preview: '/templates/minimal-designer-preview.jpg',
    
    // Template structure defines sections and their layout
    structure: {
      hero: {
        type: 'hero',
        layout: 'center_aligned',
        editable: ['name', 'title', 'description', 'image', 'background']
      },
      about: {
        type: 'about',
        layout: 'two_column',
        editable: ['heading', 'content', 'image', 'skills']
      },
      portfolio: {
        type: 'portfolio',
        layout: 'grid_3x3',
        editable: ['heading', 'projects', 'filters']
      },
      contact: {
        type: 'contact',
        layout: 'minimal_form',
        editable: ['heading', 'description', 'form_fields', 'social_links']
      }
    },

    // Default content that users can edit
    defaultContent: {
      hero: {
        name: 'Your Name',
        title: 'Creative Designer',
        description: 'Passionate about creating beautiful, functional designs that tell stories and solve problems.',
        image: '', // Empty string instead of placeholder path
        background: '#f8fafc'
      },
      about: {
        heading: 'About Me',
        content: 'I\'m a creative designer with over 5 years of experience in visual design, branding, and user experience. I believe in the power of good design to transform ideas into compelling visual narratives.',
        image: '', // Empty string instead of placeholder path
        skills: ['UI/UX Design', 'Branding', 'Typography', 'Illustration', 'Figma', 'Adobe Creative Suite']
      },
      portfolio: {
        heading: 'My Work',
        projects: [
          {
            id: 1,
            title: 'Project One',
            description: 'Description of your amazing project',
            image: '', // Main image for backward compatibility
            images: [], // New: Array of additional images for gallery
            category: 'branding',
            tags: ['Branding', 'Logo Design']
          },
          {
            id: 2,
            title: 'Project Two',
            description: 'Description of your amazing project',
            image: '', // Main image for backward compatibility
            images: [], // New: Array of additional images for gallery
            category: 'web',
            tags: ['Web Design', 'UI/UX']
          },
          {
            id: 3,
            title: 'Project Three',
            description: 'Description of your amazing project',
            image: '', // Main image for backward compatibility
            images: [], // New: Array of additional images for gallery
            category: 'print',
            tags: ['Print Design', 'Typography']
          }
        ],
        filters: ['All', 'Branding', 'Web', 'Print']
      },
      contact: {
        heading: 'Let\'s Work Together',
        description: 'I\'m always interested in new projects and opportunities.',
        form_fields: ['name', 'email', 'message'],
        social_links: [
          { platform: 'linkedin', url: 'https://linkedin.com/in/yourname' },
          { platform: 'dribbble', url: 'https://dribbble.com/yourname' },
          { platform: 'behance', url: 'https://behance.net/yourname' }
        ]
      }
    },

    // Style configuration
    styling: {
      colors: {
        primary: '#1f2937',      // Dark gray
        secondary: '#6b7280',    // Medium gray
        accent: '#3b82f6',       // Blue
        background: '#ffffff',    // White
        surface: '#f8fafc',      // Light gray
        text: '#1f2937',         // Dark gray
        textSecondary: '#6b7280' // Medium gray
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
        accent: 'Inter'
      },
      spacing: {
        section: '5rem',  // Space between sections
        element: '2rem',  // Space between elements
        tight: '1rem'     // Tight spacing
      },
      borderRadius: {
        small: '0.375rem',
        medium: '0.5rem',
        large: '0.75rem'
      },
      shadows: {
        small: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        medium: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        large: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
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

  return {
    templateId,
    content: { ...template.defaultContent, ...customizations },
    styling: { ...template.styling, ...customizations.styling },
    structure: template.structure,
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      templateVersion: '1.0.0'
    }
  };
};