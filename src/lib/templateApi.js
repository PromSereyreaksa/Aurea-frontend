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
}

// Export singleton instance
export const templateApi = new TemplateAPI();

// Also export class for testing
export default TemplateAPI;