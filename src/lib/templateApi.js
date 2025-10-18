/**
 * Template API Service
 *
 * Handles all template-related API calls to fetch dynamic templates from backend
 * Replaces the static client-side template definitions
 */

import api from './baseApi';

class TemplateAPI {
  /**
   * Get all available templates
   * @param {Object} params - Query parameters (category, isActive, etc.)
   * @returns {Promise<Array>} List of templates
   */
  async getTemplates(params = {}) {
    try {
      const response = await api.get('/api/templates', { params });
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  }

  /**
   * Get template by ID
   * @param {string} id - Template ID
   * @returns {Promise<Object>} Template data
   */
  async getTemplateById(id) {
    try {
      const response = await api.get(`/api/templates/${id}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error(`Error fetching template ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get template schema (structure and fields)
   * @param {string} id - Template ID
   * @returns {Promise<Object>} Template schema
   */
  async getTemplateSchema(id) {
    try {
      const response = await api.get(`/api/templates/${id}/schema`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error(`Error fetching template schema for ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get template categories
   * @returns {Promise<Array>} List of categories
   */
  async getTemplateCategories() {
    try {
      const response = await api.get('/api/templates/categories');
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('Error fetching template categories:', error);
      throw error;
    }
  }

  /**
   * Get default template
   * @returns {Promise<Object>} Default template data
   */
  async getDefaultTemplate() {
    try {
      const response = await api.get('/api/templates/default');
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error fetching default template:', error);
      throw error;
    }
  }

  /**
   * Cache templates in memory for performance
   */
  _cache = new Map();
  _cacheTimeout = 5 * 60 * 1000; // 5 minutes

  /**
   * Get template with caching
   * @param {string} id - Template ID
   * @returns {Promise<Object>} Cached or fresh template data
   */
  async getCachedTemplate(id) {
    const cacheKey = `template_${id}`;
    const cached = this._cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this._cacheTimeout) {
      return cached.data;
    }

    const template = await this.getTemplateById(id);
    this._cache.set(cacheKey, {
      data: template,
      timestamp: Date.now()
    });

    return template;
  }

  /**
   * Get template schema with caching
   * @param {string} id - Template ID
   * @returns {Promise<Object>} Cached or fresh schema
   */
  async getCachedSchema(id) {
    const cacheKey = `schema_${id}`;
    const cached = this._cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this._cacheTimeout) {
      return cached.data;
    }

    const schema = await this.getTemplateSchema(id);
    this._cache.set(cacheKey, {
      data: schema,
      timestamp: Date.now()
    });

    return schema;
  }

  /**
   * Clear cache (useful when templates are updated)
   */
  clearCache() {
    this._cache.clear();
  }

  /**
   * Transform backend template to frontend format
   * @param {Object} backendTemplate - Template from API
   * @returns {Object} Frontend-compatible template
   */
  transformTemplate(backendTemplate) {
    return {
      id: backendTemplate._id || backendTemplate.id,
      name: backendTemplate.name,
      description: backendTemplate.description,
      category: backendTemplate.category,
      preview: backendTemplate.thumbnailUrl || backendTemplate.preview,
      previewUrl: `/template-preview/${backendTemplate.slug || backendTemplate.id}`,

      // Schema defines the structure
      schema: backendTemplate.schema || {
        sections: backendTemplate.sections || {},
        fields: backendTemplate.fields || {},
        layouts: backendTemplate.layouts || {}
      },

      // Default content for new portfolios
      defaultContent: backendTemplate.defaultContent || {},

      // Styling configuration
      styling: backendTemplate.styling || {
        colors: {},
        fonts: {},
        typography: {},
        spacing: {}
      },

      // Metadata
      version: backendTemplate.version || '1.0.0',
      isActive: backendTemplate.isActive !== false,
      isPremium: backendTemplate.isPremium || false,
      features: backendTemplate.features || [],

      // Component type for dynamic rendering
      componentType: backendTemplate.componentType || 'dynamic',

      // Original backend data
      _original: backendTemplate
    };
  }

  /**
   * Get all templates transformed for frontend use
   * @returns {Promise<Array>} Transformed templates
   */
  async getAllTemplatesFormatted() {
    const templates = await this.getTemplates({ isActive: true });
    return templates.map(t => this.transformTemplate(t));
  }

  /**
   * Sync/Create template schema to backend
   * Creates template if it doesn't exist, updates if it does
   * @param {Object} templateDefinition - Frontend template definition
   * @returns {Promise<Object>} Created/Updated template
   */
  async syncTemplateSchema(templateDefinition) {
    try {
      // Convert frontend template definition to backend schema format
      const backendSchema = this.convertFrontendToBackendSchema(templateDefinition);

      // Try to check if template exists first
      let existingTemplate;
      try {
        existingTemplate = await this.getTemplateById(templateDefinition.id);
      } catch (error) {
        // Template doesn't exist, will create new one
        existingTemplate = null;
      }

      // Create or update template
      if (existingTemplate) {
        // Update existing template
        const response = await api.put(`/api/templates/${templateDefinition.id}`, backendSchema);
        console.log(`✅ Updated template schema for: ${templateDefinition.id}`);
        return response.data?.data || response.data;
      } else {
        // Create new template
        const response = await api.post('/api/templates', backendSchema);
        console.log(`✅ Created new template schema for: ${templateDefinition.id}`);
        return response.data?.data || response.data;
      }
    } catch (error) {
      console.error(`Error syncing template schema for ${templateDefinition.id}:`, error);
      throw error;
    }
  }

  /**
   * Convert frontend template definition to backend schema format
   * @param {Object} template - Frontend template definition
   * @returns {Object} Backend-compatible schema
   */
  convertFrontendToBackendSchema(template) {
    // Extract sections from structure
    const sections = Object.entries(template.structure || {}).map(([sectionId, sectionConfig], index) => {
      // Extract fields from defaultContent
      const sectionContent = template.defaultContent?.[sectionId] || {};
      const fields = Object.entries(sectionContent).map(([fieldId, defaultValue]) => {
        return {
          id: fieldId,
          label: this.humanizeFieldName(fieldId),
          type: this.inferFieldType(defaultValue),
          placeholder: typeof defaultValue === 'string' ? defaultValue : '',
          required: sectionConfig.required || false,
          validation: {
            maxLength: fieldId === 'bio' ? 500 : fieldId === 'description' ? 200 : 100
          }
        };
      });

      return {
        id: sectionId,
        name: this.humanizeFieldName(sectionId),
        description: `${this.humanizeFieldName(sectionId)} section`,
        fields: fields,
        required: true,
        order: index
      };
    });

    // Convert styling to backend format
    const styling = {
      colorScheme: template.styling?.colors || {},
      typography: {
        headingFont: template.styling?.fonts?.heading || 'Inter',
        bodyFont: template.styling?.fonts?.body || 'Inter',
        scale: 'default'
      },
      spacing: 'default',
      customCSS: ''
    };

    // Map frontend categories to valid backend categories
    const categoryMap = {
      'swiss': 'classic',
      'creative': 'creative',
      'modern': 'modern',
      'minimal': 'classic',
      'elegant': 'creative'
    };

    const validCategory = categoryMap[template.category] || 'creative';

    // Generate tags from template properties
    const tags = this.generateTags(template);

    return {
      templateId: template.id,
      name: template.name,
      description: template.description,
      category: validCategory,
      slug: template.id,
      thumbnail: template.preview || '',
      schema: {
        sections: sections,
        styling: styling
      },
      tags: tags,
      isActive: true,
      isPremium: false,
      version: template.version || '1.0.0',
      createdBy: 'Aurea'
    };
  }

  /**
   * Generate tags from template properties
   * @param {Object} template - Template definition
   * @returns {Array<string>} Tags
   */
  generateTags(template) {
    const tags = [];

    // Add category as tag
    if (template.category) {
      tags.push(template.category);
    }

    // Add name words as tags
    if (template.name) {
      const nameWords = template.name.toLowerCase().split(' ');
      tags.push(...nameWords);
    }

    // Add common design terms from description
    if (template.description) {
      const descriptionLower = template.description.toLowerCase();
      const commonTerms = ['minimal', 'modern', 'elegant', 'clean', 'professional', 'creative', 'bold', 'swiss', 'typography', 'grid'];

      commonTerms.forEach(term => {
        if (descriptionLower.includes(term)) {
          tags.push(term);
        }
      });
    }

    // Remove duplicates and limit to 5 tags
    return [...new Set(tags)].slice(0, 5);
  }

  /**
   * Infer field type from default value
   * @param {*} value - Default value
   * @returns {string} Field type
   */
  inferFieldType(value) {
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object' && value !== null) return 'object';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'string' && value.length > 100) return 'textarea';
    if (typeof value === 'string' && value.includes('http')) return 'url';
    return 'text';
  }

  /**
   * Convert camelCase or snake_case to Title Case
   * @param {string} str - Field name
   * @returns {string} Human-readable name
   */
  humanizeFieldName(str) {
    return str
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^./, s => s.toUpperCase())
      .trim();
  }

  /**
   * Sync all frontend templates to backend
   * Useful for initial setup or migrations
   * @param {Object} templates - Object containing all template definitions
   * @returns {Promise<Array>} Results of sync operations
   */
  async syncAllTemplates(templates) {
    const results = [];

    for (const [templateId, templateDef] of Object.entries(templates)) {
      try {
        const result = await this.syncTemplateSchema(templateDef);
        results.push({ templateId, success: true, data: result });
      } catch (error) {
        console.error(`Failed to sync template ${templateId}:`, error);
        results.push({ templateId, success: false, error: error.message });
      }
    }

    console.log('📊 Template sync summary:', {
      total: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    });

    return results;
  }
}

// Export singleton instance
export const templateApi = new TemplateAPI();

// Also export class for testing
export default TemplateAPI;