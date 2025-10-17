// Template system for portfolio builder
// Each template defines structure, default content, and styling

// Import template components
import EchelonTemplate from "./Echelon/EchelonTemplate";
import SereneTemplate from "./Serene/SereneTemplate";

export const templates = {
  echelon: {
    id: "echelon",
    name: "Echelon",
    description:
      "Swiss/International Typographic Style - clean, precise, grid-driven design",
    category: "swiss",
    preview:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    previewUrl: "/template-preview/echelon",
    component: EchelonTemplate,

    // Template structure defines sections and their layout
    structure: {
      hero: {
        type: "hero",
        layout: "swiss_minimal",
        editable: ["title", "subtitle"],
      },
      about: {
        type: "about",
        layout: "two_column_swiss",
        editable: ["image", "bio", "name"],
      },
      work: {
        type: "work",
        layout: "project_list_swiss",
        editable: ["projects"],
      },
      gallery: {
        type: "gallery",
        layout: "image_grid_swiss",
        editable: ["images"],
      },
      contact: {
        type: "contact",
        layout: "minimal_swiss",
        editable: ["text", "button"],
      },
    },

    // Default content that users can edit
    defaultContent: {
      hero: {
        title: "DESIGNING WITH PRECISION",
        subtitle: "Case studies in clarity and form",
      },
      about: {
        name: "DESIGNER NAME",
        image: "",
        bio: "I am a designer focused on minimalism, clarity, and modernist design systems. My work emphasizes grid-based layouts, precise typography, and functional design solutions that prioritize clarity and usability above all else.",
      },
      work: {
        heading: "SELECTED WORK",
        projects: [
          {
            id: 1,
            title: "PROJECT TITLE",
            description:
              "Brief description of your project and what it accomplishes.",
            image: "",
            meta: "2025 — Category",
            category: "design",
          },
        ],
      },
      gallery: {
        heading: "VISUAL STUDIES",
        images: [
          { src: "", caption: "Visual exploration 01", meta: "01" },
          { src: "", caption: "Visual exploration 02", meta: "02" },
          { src: "", caption: "Visual exploration 03", meta: "03" },
          { src: "", caption: "Visual exploration 04", meta: "04" },
          { src: "", caption: "Visual exploration 05", meta: "05" },
          { src: "", caption: "Visual exploration 06", meta: "06" },
        ],
      },
      contact: {
        heading: "GET IN TOUCH",
        text: "Available for new projects and collaborations.",
        button: "CONTACT",
        email: "hello@designer.com",
      },
    },

    // Swiss/International Typographic Style configuration
    styling: {
      colors: {
        primary: "#000000", // Pure black
        secondary: "#666666", // Medium gray
        accent: "#B80000", // Swiss red for accents
        background: "#FFFFFF", // Pure white
        surface: "#FFFFFF", // Pure white
        text: "#000000", // Pure black
        textSecondary: "#666666", // Medium gray
        border: "#000000", // Black borders
      },
      fonts: {
        heading:
          '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
        body: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
        mono: '"IBM Plex Mono", "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
      },
      typography: {
        scale: {
          h1: "72px", // Large headlines
          h2: "48px", // Section headings
          h3: "32px", // Subsection headings
          h4: "24px", // Small headings
          body: "18px", // Body text
          small: "16px", // Small text
          meta: "14px", // Metadata
        },
        lineHeight: {
          tight: 1.1,
          normal: 1.4,
          relaxed: 1.6,
        },
        fontWeight: {
          regular: 400,
          bold: 700,
        },
      },
      grid: {
        columns: 12,
        gutter: "24px",
        margin: "80px",
        baseline: "8px",
      },
      spacing: {
        section: "120px", // Large section spacing
        element: "40px", // Element spacing
        tight: "16px", // Tight spacing
        baseline: "8px", // Baseline grid
      },
      borderRadius: {
        none: "0px", // No border radius for Swiss style
      },
    },

    // Responsive breakpoints
    responsive: {
      mobile: "640px",
      tablet: "768px",
      desktop: "1024px",
      wide: "1280px",
    },
  },

  serene: {
    id: "serene",
    name: "Serene",
    description: "Botanical & Elegant - soft, organic, nature-inspired design",
    category: "elegant",
    preview:
      "https://images.unsplash.com/photo-1513735492246-483525079686?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    previewUrl: "/template-preview/serene",
    component: SereneTemplate,

    // Template structure defines sections and their layout
    structure: {
      hero: {
        type: "hero",
        layout: "botanical_hero",
        editable: ["title", "subtitle", "description1", "description2", "cta"],
      },
      about: {
        type: "about",
        layout: "elegant_two_column",
        editable: [
          "image",
          "bio",
          "name",
          "role",
          "location",
          "experience",
          "philosophy",
        ],
      },
      services: {
        type: "services",
        layout: "service_cards",
        editable: ["heading", "subheading", "services"],
      },
      gallery: {
        type: "gallery",
        layout: "asymmetric_grid",
        editable: ["images", "heading", "categories"],
      },
      testimonials: {
        type: "testimonials",
        layout: "carousel",
        editable: ["heading", "subheading", "testimonials"],
      },
      contact: {
        type: "contact",
        layout: "elegant_contact",
        editable: ["heading", "text", "email", "phone", "instagram", "address"],
      },
    },

    // Default content that users can edit
    defaultContent: {
      hero: {
        title: "Blossom",
        subtitle: "Botanical Artistry",
        description1:
          "Creating ethereal floral designs that celebrate the delicate beauty of nature.",
        description2:
          "Transform your special moments with our bespoke botanical arrangements and styling services.",
        cta: "Explore Our Work",
      },
      about: {
        name: "Isabella Rose",
        role: "Botanical Artist & Floral Designer",
        image:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500",
        bio: "With over 8 years of experience in botanical design, I specialize in creating organic, garden-style arrangements that bring the beauty of nature indoors. My philosophy embraces the imperfect beauty of each bloom, creating designs that feel both elegant and effortlessly natural.",
        location: "Melbourne, Australia",
        experience: "Est. 2016",
        philosophy:
          "Every flower has a story to tell, and every arrangement is a poem written in petals.",
      },
      services: {
        heading: "Our Services",
        subheading: "Bringing nature's beauty to your special moments",
        services: [
          {
            id: 1,
            title: "Floral Design",
            description:
              "Custom arrangements for weddings, events, and special occasions with seasonal blooms",
            icon: "🌸",
            price: "From $150",
          },
          {
            id: 2,
            title: "Botanical Styling",
            description:
              "Interior styling with plants and flowers to transform your living spaces",
            icon: "🌿",
            price: "From $300",
          },
          {
            id: 3,
            title: "Garden Consultation",
            description:
              "Expert advice on creating and maintaining your own botanical paradise",
            icon: "🌺",
            price: "From $200",
          },
          {
            id: 4,
            title: "Workshops",
            description:
              "Learn the art of flower arrangement in intimate, hands-on sessions",
            icon: "🌻",
            price: "From $85/person",
          },
        ],
      },
      gallery: {
        heading: "Portfolio",
        categories: ["All", "Weddings", "Events", "Installations"],
        images: [
          {
            id: 1,
            src: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=800",
            caption: "Spring Wedding Bouquet",
            category: "Weddings",
          },
          {
            id: 2,
            src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800",
            caption: "Garden Party Installation",
            category: "Events",
          },
          {
            id: 3,
            src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
            caption: "Bridal Arrangement",
            category: "Weddings",
          },
          {
            id: 4,
            src: "https://images.unsplash.com/photo-1522836924445-4478bdeb860c?w=800",
            caption: "Corporate Event Design",
            category: "Events",
          },
          {
            id: 5,
            src: "https://images.unsplash.com/photo-1465495976277-9d29418c3f9d?w=800",
            caption: "Botanical Installation",
            category: "Installations",
          },
          {
            id: 6,
            src: "https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=800",
            caption: "Summer Garden Party",
            category: "Events",
          },
        ],
      },
      testimonials: {
        heading: "Client Love",
        subheading: "What our clients say about their experience",
        testimonials: [
          {
            id: 1,
            name: "Sarah Mitchell",
            role: "Bride",
            text: "The floral arrangements for our wedding were absolutely breathtaking. Every detail was perfect, and the team understood our vision completely.",
            rating: 5,
            image:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
          },
          {
            id: 2,
            name: "Emma Thompson",
            role: "Event Planner",
            text: "Working with Blossom has been an absolute pleasure. Their creativity and attention to detail never cease to amaze our clients.",
            rating: 5,
            image:
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
          },
          {
            id: 3,
            name: "Michael Chen",
            role: "Restaurant Owner",
            text: "The botanical styling transformed our restaurant into an oasis. Our customers constantly compliment the beautiful arrangements.",
            rating: 5,
            image:
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
          },
        ],
      },
      contact: {
        heading: "Get in Touch",
        text: "Let's create something beautiful together",
        email: "hello@blossomstudio.com",
        phone: "+61 (0) 400 000 000",
        instagram: "@blossomstudio",
        address: "123 Garden Lane, Melbourne VIC 3000",
      },
    },

    // Serene/Botanical styling configuration
    styling: {
      colors: {
        primary: "#4a5444", // Deep forest green
        secondary: "#7a8574", // Sage green
        accent: "#c9a961", // Warm gold
        background: "#fefef8", // Cream white
        surface: "#ffffff", // Pure white
        text: "#4a5444", // Deep forest green
        textSecondary: "#7a8574", // Sage green
        border: "rgba(201, 169, 97, 0.2)", // Light gold border
        hover: "#a08754", // Dark gold
      },
      fonts: {
        heading: "'Playfair Display', serif",
        body: "'Crimson Text', serif",
        accent: "'Cormorant Garamond', serif",
      },
      typography: {
        scale: {
          h1: "64px", // Display headlines
          h2: "48px", // Section headings
          h3: "32px", // Subsection headings
          h4: "24px", // Small headings
          body: "18px", // Body text
          small: "14px", // Small text
          meta: "12px", // Metadata
        },
        lineHeight: {
          tight: 1.1,
          normal: 1.7,
          relaxed: 1.9,
        },
        fontWeight: {
          light: 300,
          regular: 400,
          medium: 500,
          semibold: 600,
          bold: 700,
        },
      },
      grid: {
        columns: 12,
        gutter: "24px",
        margin: "32px",
        baseline: "4px",
      },
      spacing: {
        section: "100px", // Section spacing
        element: "32px", // Element spacing
        tight: "16px", // Tight spacing
        baseline: "4px", // Baseline grid
      },
      borderRadius: {
        small: "2px", // Subtle rounded corners
      },
    },

    // Responsive breakpoints
    responsive: {
      mobile: "640px",
      tablet: "768px",
      desktop: "1024px",
      wide: "1280px",
    },
  },
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
  if (!templateId) return "echelon";

  // Map old template IDs to new ones
  const legacyMap = {
    echolon: "echelon", // Handle old misspelling
    "minimal-designer": "echelon",
    minimal: "echelon",
    designer: "echelon",
    swiss: "echelon",
    botanical: "serene",
    elegant: "serene",
    blossom: "serene",
  };
  
  return legacyMap[templateId] || templateId;
};

// Helper function to get all templates
export const getAllTemplates = () => {
  return Object.values(templates);
};

// Helper function to create a new portfolio from template
export const createPortfolioFromTemplate = (
  templateId,
  customizations = {}
) => {
  const template = getTemplate(templateId);
  if (!template) {
    throw new Error(`Template with ID ${templateId} not found`);
  }

  // Deep merge function to merge nested objects
  const deepMerge = (target, source) => {
    const result = { ...target };

    for (const key in source) {
      if (
        source[key] !== null &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key])
      ) {
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
      templateVersion: "1.0.0",
    },
  };
};

// Get template component for rendering
export const getTemplateComponent = (templateId) => {
  // Normalize template ID to handle legacy IDs
  const normalizedId = normalizeTemplateId(templateId);
  const template = templates[normalizedId];
  return template ? template.component : null;
};
