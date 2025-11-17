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
    preview: '/template-preview/echolon.png',
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
    preview: '/template-preview/blossom.png',
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
        heroText1: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        heroText2: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.',
        firstRow: [
          {
            id: 'project-1',
            image: '/portfolios/10.jpg',
            title: 'Project One',
            description: 'Creative design showcase',
            detailedDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            price: '',
            caption: '',
            span: 2
          },
          {
            id: 'project-2',
            image: '/portfolios/12.jpg',
            title: 'Project Two',
            description: 'Innovative visual concept',
            detailedDescription: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.\n\nNemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
            price: '',
            caption: '',
            span: 1
          },
          {
            id: 'project-3',
            image: '/portfolios/13.jpg',
            title: 'Project Three',
            description: 'Modern artistic approach',
            detailedDescription: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.\n\nUt enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.',
            price: '',
            caption: '',
            span: 2
          }
        ],
        secondRow: [
          {
            id: 'project-4',
            image: '/portfolios/4.png',
            title: 'Project Four',
            description: 'Contemporary design study',
            detailedDescription: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.\n\nSimilique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
            price: '',
            caption: '',
            span: 2
          },
          {
            id: 'project-5',
            image: '/portfolios/5.jpg',
            title: 'Project Five',
            description: 'Elegant composition work',
            detailedDescription: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.\n\nTemporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.',
            price: '',
            caption: '',
            span: 3
          },
          {
            id: 'project-6',
            image: '/portfolios/6.jpg',
            title: 'Project Six',
            description: 'Minimalist aesthetic vision',
            detailedDescription: 'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis unde omnis iste natus error.\n\nVoluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
            price: '',
            caption: '',
            span: 2
          },
          {
            id: 'project-7',
            image: '/portfolios/7.jpg',
            title: 'Project Seven',
            description: 'Bold creative expression',
            detailedDescription: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt neque porro quisquam est.\n\nQui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
            price: '',
            caption: '',
            span: 2
          }
        ],
        thirdRow: [
          {
            id: 'project-8',
            image: '/portfolios/8.jpg',
            title: 'Project Eight',
            description: 'Strategic visual design',
            detailedDescription: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse.\n\nQuam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. At vero eos et accusamus et iusto odio dignissimos ducimus.',
            price: '',
            caption: '',
            span: 2
          },
          {
            id: 'project-9',
            image: '/portfolios/9.jpg',
            title: 'Project Nine',
            description: 'Refined artistic detail',
            detailedDescription: 'Qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi.\n\nId est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio.',
            price: '',
            caption: '',
            span: 2
          },
          {
            id: 'project-10',
            image: '/portfolios/10.jpg',
            title: 'Project Ten',
            description: 'Sophisticated visual narrative',
            detailedDescription: 'Cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus.\n\nSaepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur.',
            price: '',
            caption: '',
            span: 1
          }
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
    preview: '/template-preview/chic.png',
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
            id: 'project-1',
            title: 'PROJECT ONE',
            subtitle: 'Creative Direction',
            description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
            detailedDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            image: '/mockDataImage/1.jpg',
            category: 'Brand Identity',
            year: '2024',
            awards: '',
            link: ''
          },
          {
            id: 'project-2',
            title: 'PROJECT TWO',
            subtitle: 'Visual Design',
            description: 'Sed ut perspiciatis unde omnis iste natus error.',
            detailedDescription: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.\n\nNemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
            image: '/mockDataImage/2.jpg',
            category: 'Editorial',
            year: '2024',
            awards: '',
            link: ''
          },
          {
            id: 'project-3',
            title: 'PROJECT THREE',
            subtitle: 'Art Direction',
            description: 'Neque porro quisquam est qui dolorem ipsum.',
            detailedDescription: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.\n\nUt enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.',
            image: '/mockDataImage/5.jpg',
            category: 'Digital',
            year: '2023',
            awards: '',
            link: ''
          },
          {
            id: 'project-4',
            title: 'PROJECT FOUR',
            subtitle: 'Brand Strategy',
            description: 'At vero eos et accusamus et iusto odio dignissimos.',
            detailedDescription: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.\n\nSimilique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
            image: '/mockDataImage/6.jpg',
            category: 'Branding',
            year: '2023',
            awards: '',
            link: ''
          },
          {
            id: 'project-5',
            title: 'PROJECT FIVE',
            subtitle: 'Design System',
            description: 'Nam libero tempore cum soluta nobis est eligendi.',
            detailedDescription: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.\n\nTemporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.',
            image: '/mockDataImage/7.jpg',
            category: 'UX/UI',
            year: '2024',
            awards: '',
            link: ''
          },
          {
            id: 'project-6',
            title: 'PROJECT SIX',
            subtitle: 'Print Design',
            description: 'Itaque earum rerum hic tenetur a sapiente delectus.',
            detailedDescription: 'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.',
            image: '/mockDataImage/8.jpg',
            category: 'Print',
            year: '2023',
            awards: '',
            link: ''
          },
          {
            id: 'project-7',
            title: 'PROJECT SEVEN',
            subtitle: 'Typography',
            description: 'Nemo enim ipsam voluptatem quia voluptas sit.',
            detailedDescription: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt neque porro quisquam est.\n\nQui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
            image: '/mockDataImage/9.jpg',
            category: 'Typography',
            year: '2024',
            awards: '',
            link: ''
          },
          {
            id: 'project-8',
            title: 'PROJECT EIGHT',
            subtitle: 'Motion Design',
            description: 'Ut enim ad minima veniam quis nostrum exercitationem.',
            detailedDescription: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse.\n\nQuam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. At vero eos et accusamus et iusto odio dignissimos ducimus.',
            image: '/mockDataImage/10.jpg',
            category: 'Motion',
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
    preview: '/template-preview/boldfolio.png',
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