// Template system for portfolio builder
// This is the FALLBACK when backend API is unavailable
// Templates are fetched from backend in production

// Import template components
import EchelonTemplate from './Echelon/EchelonTemplate';
import SereneTemplate from './Serene/SereneTemplate';
import ChicTemplate from './Chic/ChicTemplate';
import BoldFolioTemplate from './BoldFolio/BoldFolioTemplate';

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
        logo: 'Blossom',
        logoImage: '',
        menuItems: [
          { label: 'About', link: '#about' }
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
        heroText1: 'Melbourne-based tattoo artist Rachel Garcia creates tattoos inspired by nature with a soft watercolor technique.',
        heroText2: 'Her delicate, nostalgic flowers, plants and birds are inked with the precision of scientific illustrations (grandma would approve).',
        firstRow: [
          { image: '', title: 'Project 1', description: 'Description', price: '', caption: '', span: 2 },
          { image: '', title: 'Project 2', description: 'Description', price: '', caption: '', span: 1 },
          { image: '', title: 'Project 3', description: 'Description', price: '', caption: '', span: 2 }
        ],
        secondRow: [
          { image: '', title: 'Project 4', description: 'Description', price: '', caption: '', span: 2 },
          { image: '', title: 'Project 5', description: 'Description', price: '', caption: '', span: 3 },
          { image: '', title: 'Project 6', description: 'Description', price: '', caption: '', span: 2 },
          { image: '', title: 'Project 7', description: 'Description', price: '', caption: '', span: 2 }
        ],
        thirdRow: [
          { image: '', title: 'Project 8', description: 'Description', price: '', caption: '', span: 2 },
          { image: '', title: 'Project 9', description: 'Description', price: '', caption: '', span: 2 },
          { image: '', title: 'Project 10', description: 'Description', price: '', caption: '', span: 1 }
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
  },

  'chic': {
    id: 'chic',
    name: 'Chic',
    description: 'Editorial/Magazine-inspired portfolio with asymmetric sidebar layout and clean typography. Features a sticky left info panel and a two-column project grid with alternating layouts.',
    category: 'editorial',
    preview: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    previewUrl: '/template-preview/chic',
    component: ChicTemplate,

    structure: {
      hero: {
        type: 'hero',
        layout: 'sidebar_info_panel',
        editable: ['name', 'initials', 'bio', 'instagram', 'linkedin', 'behance']
      },
      about: {
        type: 'about',
        layout: 'sidebar_additional',
        editable: ['skills', 'experience']
      },
      work: {
        type: 'work',
        layout: 'asymmetric_editorial_grid',
        editable: ['projects', 'image']
      },
      contact: {
        type: 'contact',
        layout: 'sidebar_bottom',
        editable: ['email', 'phone', 'telegram', 'whatsapp', 'availability']
      }
    },

    defaultContent: {
      hero: {
        name: 'Your Name',
        initials: 'Y.N.',
        bio: 'I am a designer focused on brand identity, editorial design, and typography. My work emphasizes clarity, strategic whitespace, and creating visual systems that communicate with precision and elegance.',
        instagram: 'https://instagram.com/yourname',
        instagramLabel: 'INSTAGRAM',
        linkedin: 'https://linkedin.com/in/yourname',
        linkedinLabel: 'LINKEDIN',
        behance: 'https://behance.net/yourname',
        behanceLabel: 'BEHANCE'
      },
      about: {
        skills: 'Brand Identity, Editorial Design, Typography, Art Direction',
        experience: '5+ years experience working with studios and agencies globally'
      },
      work: {
        projects: [
          {
            id: 1,
            title: 'CHAOSK',
            subtitle: 'Brand Identity',
            description: 'Complete brand identity system for an innovative design collective. Including logo design, typography selection, color system, and comprehensive brand guidelines.',
            image: '',
            category: 'Brand Identity',
            year: '2023',
            awards: 'Awwwards Nominee 2023',
            link: ''
          },
          {
            id: 2,
            title: 'NOVA EDITORIAL',
            subtitle: 'Magazine Design',
            description: 'Art direction and layout design for a contemporary art and culture publication. Focus on bold typography and strategic use of whitespace.',
            image: '',
            category: 'Editorial',
            year: '2024',
            awards: '',
            link: ''
          },
          {
            id: 3,
            title: 'SPECTRUM',
            subtitle: 'Web Experience',
            description: 'UI/UX design for an interactive digital experience showcasing emerging artists. Minimalist interface with emphasis on content.',
            image: '',
            category: 'Digital',
            year: '2024',
            awards: '',
            link: ''
          },
          {
            id: 4,
            title: 'APEX STUDIOS',
            subtitle: 'Visual Identity',
            description: 'Complete visual identity system for a multidisciplinary creative studio based in Berlin.',
            image: '',
            category: 'Branding',
            year: '2023',
            awards: '',
            link: ''
          }
        ]
      },
      contact: {
        email: 'hello@yourname.com',
        emailLabel: 'EMAIL',
        phone: '+1 (123) 456-7890',
        phoneLabel: 'PHONE',
        telegram: 'https://t.me/yourname',
        telegramLabel: 'TELEGRAM',
        whatsapp: '',
        whatsappLabel: 'WHATSAPP',
        availability: 'Available for freelance work and collaborations'
      }
    },

    styling: {
      colors: {
        primary: '#000000',
        secondary: '#333333',
        accent: '#FFD700',
        background: '#FFFFFF',
        surface: '#F8F7F5',
        text: '#000000',
        textSecondary: '#333333',
        textLight: '#666666',
        border: '#E5E5E5',
        borderDark: '#CCCCCC',
        hover: '#000000'
      },
      fonts: {
        heading: '"Helvetica Neue", -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", "Suisse Intl", "Inter", Roboto, Arial, sans-serif',
        body: '"Helvetica Neue", -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", "Suisse Intl", "Inter", Roboto, Arial, sans-serif',
        mono: '"SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
      },
      typography: {
        scale: {
          h1: '3.5rem',
          h2: '2rem',
          h3: '1.25rem',
          h4: '1rem',
          body: '0.9375rem',
          small: '0.75rem',
          meta: '0.75rem'
        },
        lineHeight: {
          tight: 1.1,
          normal: 1.5,
          relaxed: 1.7
        },
        fontWeight: {
          normal: 400,
          medium: 500,
          semibold: 600,
          bold: 700
        },
        letterSpacing: {
          tight: '-0.02em',
          normal: '0',
          wide: '0.05em'
        }
      },
      spacing: {
        section: '4rem',
        element: '2rem',
        tight: '1.5rem',
        baseline: '8px'
      },
      borderRadius: {
        none: '0px',
        sm: '0px',
        md: '0px',
        lg: '0px',
        full: '0px'
      }
    },

    responsive: {
      mobile: '640px',
      tablet: '768px',
      desktop: '1024px',
      wide: '1400px'
    }
  },

  'boldfolio': {
    id: 'boldfolio',
    name: 'BoldFolio',
    description: 'Bold, creative portfolio template with striking typography and vibrant magenta accents. Perfect for designers and creatives who want to make a statement.',
    category: 'creative',
    preview: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    previewUrl: '/template-preview/boldfolio',
    component: BoldFolioTemplate,

    structure: {
      hero: {
        type: 'hero',
        layout: 'fullscreen_bold',
        editable: ['title', 'subtitle', 'description', 'cta']
      },
      work: {
        type: 'work',
        layout: 'project_showcase',
        editable: ['projects', 'images']
      },
      about: {
        type: 'about',
        layout: 'minimal',
        editable: ['heading', 'name', 'role', 'bio', 'location', 'email']
      },
      contact: {
        type: 'contact',
        layout: 'centered',
        editable: ['heading', 'text', 'email', 'social']
      }
    },

    defaultContent: {
      hero: {
        title: 'Driven by passion—and<br />fuelled by curiosity.',
        subtitle: 'Designer and art-director<br />based in Montreal, Quebec.',
        description: 'Think of design as a way<br />to transform problems into<br />empowering opportunities<br />and create appealing visuals<br />that connect with people.',
        cta: 'Open for collaborations!'
      },
      work: {
        projects: [
          {
            title: 'Ice Peak',
            description: 'A flexible design identity that<br />strengthens the overall image of<br />Ice Peak, an adventure company<br />focused on alpinism.',
            images: [
              { width: '580px', height: '380px', src: '' },
              { width: '450px', height: '280px', src: '' }
            ],
            logo: '<span>|||</span><span>|||</span><span style="font-size: 100px; letter-spacing: 12px">ICE</span><span style="font-size: 100px; letter-spacing: 12px">PEAK</span>',
            link: ''
          },
          {
            title: 'The Recreationist',
            description: 'Brand identity and<br />creative campaign for The<br />Recreationist, an online<br />boutique that sells<br />independent designers and<br />global goods for summer<br />vacations by the sea.',
            images: [
              { width: '250px', height: '280px', src: '' },
              { width: '580px', height: '380px', src: '' }
            ],
            logo: '',
            link: ''
          },
          {
            title: 'Hyperloop',
            description: 'Identity and store for a brand<br />selling minimalistic jewelry.',
            images: [
              { width: '250px', height: '280px', src: '' },
              { width: '500px', height: '500px', src: '' }
            ],
            logo: '',
            link: ''
          }
        ]
      },
      about: {
        heading: 'About',
        name: 'Your Name',
        role: 'Designer & Art Director',
        bio: 'I believe in design as a transformative force that turns problems into empowering opportunities. My work focuses on creating appealing visuals that connect with people on a deeper level.',
        location: 'Montreal, Quebec',
        email: 'hello@yourname.com'
      },
      contact: {
        heading: "Let's Work Together",
        text: 'Have a project in mind? Let\'s create something amazing together.',
        email: 'hello@yourname.com',
        social: {
          twitter: '',
          linkedin: '',
          instagram: '',
          behance: '',
          dribbble: ''
        }
      }
    },

    styling: {
      colors: {
        primary: '#ff0080',
        secondary: '#000000',
        accent: '#ff0080',
        background: '#FFFFFF',
        text: '#000000',
        textSecondary: '#666666'
      },
      fonts: {
        heading: 'Graphik, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Fira Sans", Roboto, "Avenir Next", "Helvetica Neue", Helvetica, Arial, sans-serif',
        body: 'Graphik, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Fira Sans", Roboto, "Avenir Next", "Helvetica Neue", Helvetica, Arial, sans-serif',
        mono: '"SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
      },
      typography: {
        scale: {
          h1: '52px',
          h2: '52px',
          h3: '36px',
          h4: '24px',
          body: '24px',
          small: '18px',
          meta: '14px'
        },
        lineHeight: {
          tight: 1.2,
          normal: 1.5,
          relaxed: 1.7
        },
        fontWeight: {
          normal: 400,
          medium: 500,
          bold: 700
        }
      },
      spacing: {
        section: '120px',
        element: '60px',
        tight: '20px',
        baseline: '10px'
      }
    },

    responsive: {
      mobile: '640px',
      tablet: '768px',
      desktop: '1024px',
      wide: '1400px'
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