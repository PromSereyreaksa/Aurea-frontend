/**
 * Template Adapter
 *
 * Bridges the backend template schema with existing frontend components
 * Converts backend schema format to frontend-compatible structure
 */

import api from './baseApi';

// Import existing template components (keep using them)
import EchelonTemplate from '../templates/Echelon/EchelonTemplate';
import SereneTemplate from '../templates/Serene/SereneTemplate';
import ChicTemplate from '../templates/Chic/ChicTemplate';
import BoldFolioTemplate from '../templates/BoldFolio/BoldFolioTemplate';

// Map template IDs to their components
const templateComponents = {
  'echelon': EchelonTemplate,
  'echolon': EchelonTemplate, // Handle typo in existing data
  'serene': SereneTemplate,
  'chic': ChicTemplate,
  'boldfolio': BoldFolioTemplate,
};

class TemplateAdapter {
  /**
   * Fetch template from backend and convert to frontend format
   */
  async getTemplateWithComponent(templateId) {
    try {
      // Fetch from backend
      const response = await api.get(`/api/templates/${templateId}`);
      const backendTemplate = response.data?.data || response.data;

      // Convert backend schema to frontend format
      const frontendTemplate = this.convertBackendToFrontend(backendTemplate);

      // Attach the React component
      frontendTemplate.component = templateComponents[templateId] || templateComponents['echelon'];

      return frontendTemplate;
    } catch (error) {
      console.error(`Failed to fetch template ${templateId}:`, error);

      // Fallback to static template if backend fails
      return this.getFallbackTemplate(templateId);
    }
  }

  /**
   * Convert backend schema to frontend template format
   */
  convertBackendToFrontend(backendTemplate) {
    // Extract sections and convert to content structure
    const defaultContent = {};
    const structure = {};

    // Process each section from schema
    backendTemplate.schema?.sections?.forEach(section => {
      const sectionId = section.id;

      // Build structure definition
      structure[sectionId] = {
        type: sectionId,
        layout: this.getLayoutForSection(sectionId),
        editable: section.fields.map(f => f.id),
        required: section.required,
        order: section.order?.$numberInt || section.order
      };

      // Build default content from field placeholders
      defaultContent[sectionId] = {};

      section.fields.forEach(field => {
        if (field.type === 'array') {
          defaultContent[sectionId][field.id] = [];
        } else if (field.type === 'object') {
          defaultContent[sectionId][field.id] = {};
        } else {
          defaultContent[sectionId][field.id] = field.placeholder || '';
        }
      });
    });

    // Special handling for work section projects
    if (defaultContent.work) {
      defaultContent.work.projects = [{
        id: 1,
        title: 'PROJECT TITLE',
        description: 'Brief description of your project',
        image: '',
        meta: '2025 — Category',
        category: 'design'
      }];
    }

    // Special handling for gallery if it exists
    if (defaultContent.gallery) {
      // For Serene template (has title, description, price fields)
      if (backendTemplate.templateId === 'serene') {
        defaultContent.gallery.images = [
          { image: '', title: 'Project 1', description: 'Description', price: '', caption: '' },
          { image: '', title: 'Project 2', description: 'Description', price: '', caption: '' },
          { image: '', title: 'Project 3', description: 'Description', price: '', caption: '' }
        ];
      } else {
        // For Echelon template (has src, caption, meta)
        defaultContent.gallery.images = [
          { src: '', caption: 'Visual exploration 01', meta: '01' },
          { src: '', caption: 'Visual exploration 02', meta: '02' },
          { src: '', caption: 'Visual exploration 03', meta: '03' },
          { src: '', caption: 'Visual exploration 04', meta: '04' },
          { src: '', caption: 'Visual exploration 05', meta: '05' },
          { src: '', caption: 'Visual exploration 06', meta: '06' }
        ];
      }
    }

    // Special handling for navigation (Serene template)
    if (defaultContent.navigation) {
      defaultContent.navigation.menuItems = [
        { label: 'Home', link: '#home' },
        { label: 'About', link: '#about' },
        { label: 'Gallery', link: '#gallery' }
      ];
    }

    return {
      id: backendTemplate.templateId || backendTemplate._id,
      name: backendTemplate.name,
      description: backendTemplate.description,
      category: backendTemplate.category,
      preview: backendTemplate.thumbnail,
      previewUrl: `/template-preview/${backendTemplate.slug}`,

      structure,
      defaultContent,

      // Use styling from backend schema
      styling: this.convertStyling(backendTemplate.schema?.styling),

      // Metadata
      version: backendTemplate.version,
      isActive: backendTemplate.isActive,
      isPremium: backendTemplate.isPremium,

      // Original backend data
      _backendSchema: backendTemplate
    };
  }

  /**
   * Convert backend styling to frontend format
   */
  convertStyling(backendStyling) {
    if (!backendStyling) {
      // Return default Echelon styling if not provided
      return {
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
      };
    }

    // Map backend styling to frontend format
    return {
      colors: backendStyling.colorScheme || {},
      fonts: {
        heading: backendStyling.typography?.headingFont || 'Inter',
        body: backendStyling.typography?.bodyFont || 'Inter',
        mono: 'monospace'
      },
      typography: {
        scale: this.getTypographyScale(backendStyling.typography?.scale),
        lineHeight: { tight: 1.1, normal: 1.4, relaxed: 1.6 },
        fontWeight: { regular: 400, bold: 700 }
      },
      spacing: this.getSpacingConfig(backendStyling.spacing)
    };
  }

  /**
   * Get layout type for section
   */
  getLayoutForSection(sectionId) {
    const layoutMap = {
      navigation: 'sticky_nav',
      hero: 'swiss_minimal',
      about: 'two_column_swiss',
      work: 'project_list_swiss',
      gallery: 'image_grid_swiss',
      contact: 'minimal_swiss'
    };
    return layoutMap[sectionId] || 'default';
  }

  /**
   * Get typography scale
   */
  getTypographyScale(scale) {
    if (scale === 'large') {
      return {
        h1: '96px',
        h2: '64px',
        h3: '48px',
        h4: '32px',
        body: '20px',
        small: '18px',
        meta: '16px'
      };
    } else if (scale === 'small') {
      return {
        h1: '48px',
        h2: '36px',
        h3: '24px',
        h4: '20px',
        body: '16px',
        small: '14px',
        meta: '12px'
      };
    }
    // Default scale
    return {
      h1: '72px',
      h2: '48px',
      h3: '32px',
      h4: '24px',
      body: '18px',
      small: '16px',
      meta: '14px'
    };
  }

  /**
   * Get spacing configuration
   */
  getSpacingConfig(spacing) {
    if (spacing === 'compact') {
      return {
        section: '60px',
        element: '20px',
        tight: '8px',
        baseline: '4px'
      };
    } else if (spacing === 'loose') {
      return {
        section: '180px',
        element: '60px',
        tight: '24px',
        baseline: '12px'
      };
    }
    // Default spacing
    return {
      section: '120px',
      element: '40px',
      tight: '16px',
      baseline: '8px'
    };
  }

  /**
   * Get fallback template (uses existing static definition)
   */
  getFallbackTemplate(templateId) {
    // Import existing template definition as fallback
    const { templates } = require('../templates/index.js');
    const normalizedId = templateId === 'echelon' ? 'echolon' : templateId;

    return templates[normalizedId] || templates['echolon'];
  }

  /**
   * Fetch all templates from backend
   */
  async getAllTemplates() {
    try {
      const response = await api.get('/api/templates');
      const backendTemplates = response.data?.data || response.data || [];

      // Convert each template
      return backendTemplates.map(t => this.convertBackendToFrontend(t));
    } catch (error) {
      console.error('Failed to fetch templates:', error);

      // Fallback to static templates
      const { getAllTemplates } = require('../templates/index.js');
      return getAllTemplates();
    }
  }

  /**
   * Convert portfolio content to match backend schema
   */
  convertContentForBackend(content, templateSchema) {
    const convertedContent = {};

    templateSchema?.sections?.forEach(section => {
      const sectionId = section.id;
      if (!content[sectionId]) return;

      convertedContent[sectionId] = {};

      section.fields.forEach(field => {
        const fieldId = field.id;
        const value = content[sectionId][fieldId];

        // Convert based on field type
        if (field.type === 'array' && value) {
          convertedContent[sectionId][fieldId] = Array.isArray(value) ? value : [];
        } else if (field.type === 'object' && value) {
          convertedContent[sectionId][fieldId] = typeof value === 'object' ? value : {};
        } else if (value !== undefined) {
          convertedContent[sectionId][fieldId] = value;
        }
      });
    });

    return convertedContent;
  }
}

// Export singleton instance
export const templateAdapter = new TemplateAdapter();

// Also export class for testing
export default TemplateAdapter;