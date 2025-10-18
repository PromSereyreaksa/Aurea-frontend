/**
 * Template Store
 *
 * Zustand store for managing dynamic templates fetched from backend
 * Replaces the static template definitions in /src/templates/index.js
 */

import { create } from 'zustand';
import { templateApi } from '../lib/templateApi';
import toast from 'react-hot-toast';

const useTemplateStore = create((set, get) => ({
  // State
  templates: [],              // All available templates
  templateCache: new Map(),   // Cache for individual templates
  schemaCache: new Map(),     // Cache for template schemas
  categories: [],             // Template categories
  defaultTemplate: null,      // Default template for new portfolios
  isLoading: false,
  isLoadingSchema: false,
  error: null,

  // Actions

  /**
   * Fetch all templates from backend
   */
  fetchTemplates: async (params = {}) => {
    set({ isLoading: true, error: null });

    try {
      const templates = await templateApi.getAllTemplatesFormatted();

      // Store in cache
      templates.forEach(template => {
        get().templateCache.set(template.id, template);
      });

      set({
        templates,
        isLoading: false
      });

      return { success: true, templates };
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      set({
        isLoading: false,
        error: error.message
      });

      // Fallback to cached templates if available
      const cachedTemplates = Array.from(get().templateCache.values());
      if (cachedTemplates.length > 0) {
        set({ templates: cachedTemplates });
        return { success: true, templates: cachedTemplates, fromCache: true };
      }

      return { success: false, error: error.message };
    }
  },

  /**
   * Get template by ID (with caching)
   */
  getTemplateById: async (id) => {
    // Check cache first
    const cached = get().templateCache.get(id);
    if (cached) {
      return { success: true, template: cached, fromCache: true };
    }

    set({ isLoading: true, error: null });

    try {
      const backendTemplate = await templateApi.getTemplateById(id);
      const template = templateApi.transformTemplate(backendTemplate);

      // Store in cache
      get().templateCache.set(id, template);

      set({ isLoading: false });
      return { success: true, template };
    } catch (error) {
      console.error(`Failed to fetch template ${id}:`, error);
      set({
        isLoading: false,
        error: error.message
      });

      // Try fallback to Echelon if template not found
      if (error.response?.status === 404) {
        console.warn(`Template ${id} not found, using fallback`);
        return get().getFallbackTemplate();
      }

      return { success: false, error: error.message };
    }
  },

  /**
   * Get template schema (structure and fields)
   */
  getTemplateSchema: async (id) => {
    // Check cache first
    const cached = get().schemaCache.get(id);
    if (cached) {
      return { success: true, schema: cached, fromCache: true };
    }

    set({ isLoadingSchema: true, error: null });

    try {
      const schema = await templateApi.getTemplateSchema(id);

      // Store in cache
      get().schemaCache.set(id, schema);

      set({ isLoadingSchema: false });
      return { success: true, schema };
    } catch (error) {
      console.error(`Failed to fetch schema for ${id}:`, error);
      set({
        isLoadingSchema: false,
        error: error.message
      });

      return { success: false, error: error.message };
    }
  },

  /**
   * Fetch template categories
   */
  fetchCategories: async () => {
    try {
      const categories = await templateApi.getTemplateCategories();
      set({ categories });
      return { success: true, categories };
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Fetch default template
   */
  fetchDefaultTemplate: async () => {
    try {
      const backendTemplate = await templateApi.getDefaultTemplate();
      const defaultTemplate = templateApi.transformTemplate(backendTemplate);

      set({ defaultTemplate });
      get().templateCache.set(defaultTemplate.id, defaultTemplate);

      return { success: true, template: defaultTemplate };
    } catch (error) {
      console.error('Failed to fetch default template:', error);

      // Fallback to first available template
      const templates = get().templates;
      if (templates.length > 0) {
        set({ defaultTemplate: templates[0] });
        return { success: true, template: templates[0], fallback: true };
      }

      return { success: false, error: error.message };
    }
  },

  /**
   * Get fallback template (for error scenarios)
   */
  getFallbackTemplate: () => {
    // Try to use default template
    const defaultTemplate = get().defaultTemplate;
    if (defaultTemplate) {
      return { success: true, template: defaultTemplate, fallback: true };
    }

    // Try first template in list
    const templates = get().templates;
    if (templates.length > 0) {
      return { success: true, template: templates[0], fallback: true };
    }

    // Last resort - return minimal template structure
    const minimalTemplate = {
      id: 'minimal',
      name: 'Basic Template',
      description: 'A minimal portfolio template',
      category: 'basic',
      schema: {
        sections: {
          hero: { type: 'hero', editable: ['title', 'subtitle'] },
          about: { type: 'about', editable: ['bio'] },
          contact: { type: 'contact', editable: ['email'] }
        }
      },
      defaultContent: {
        hero: { title: 'Welcome', subtitle: 'Portfolio' },
        about: { bio: 'About me...' },
        contact: { email: 'email@example.com' }
      },
      styling: {
        colors: { primary: '#000', background: '#fff', text: '#000' },
        fonts: { body: 'sans-serif', heading: 'sans-serif' }
      }
    };

    return { success: true, template: minimalTemplate, fallback: true, minimal: true };
  },

  /**
   * Create portfolio from template
   */
  createPortfolioFromTemplate: async (templateId, customizations = {}) => {
    const result = await get().getTemplateById(templateId);

    if (!result.success) {
      throw new Error(`Template ${templateId} not found`);
    }

    const template = result.template;

    // Deep merge customizations with template defaults
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

    const content = deepMerge(template.defaultContent, customizations.content || {});
    const styling = deepMerge(template.styling, customizations.styling || {});

    return {
      templateId: template.id,
      templateName: template.name,
      content,
      styling,
      schema: template.schema,
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        templateVersion: template.version || '1.0.0'
      }
    };
  },

  /**
   * Validate portfolio content against template schema
   */
  validatePortfolioContent: async (templateId, content) => {
    const schemaResult = await get().getTemplateSchema(templateId);

    if (!schemaResult.success) {
      return { valid: false, errors: ['Unable to fetch template schema'] };
    }

    const schema = schemaResult.schema;
    const errors = [];

    // Validate required sections
    if (schema.requiredSections) {
      for (const section of schema.requiredSections) {
        if (!content[section]) {
          errors.push(`Missing required section: ${section}`);
        }
      }
    }

    // Validate field types
    if (schema.fields) {
      for (const [sectionId, sectionFields] of Object.entries(schema.fields)) {
        if (!content[sectionId]) continue;

        for (const [fieldId, fieldConfig] of Object.entries(sectionFields)) {
          const value = content[sectionId][fieldId];

          if (fieldConfig.required && !value) {
            errors.push(`Missing required field: ${sectionId}.${fieldId}`);
          }

          if (value && fieldConfig.type) {
            // Type validation
            if (fieldConfig.type === 'array' && !Array.isArray(value)) {
              errors.push(`Invalid type for ${sectionId}.${fieldId}: expected array`);
            }
            if (fieldConfig.type === 'object' && typeof value !== 'object') {
              errors.push(`Invalid type for ${sectionId}.${fieldId}: expected object`);
            }
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  },

  /**
   * Clear all caches
   */
  clearCache: () => {
    get().templateCache.clear();
    get().schemaCache.clear();
    templateApi.clearCache();
    set({ templates: [], categories: [], defaultTemplate: null });
  },

  /**
   * Initialize store (fetch initial data)
   */
  initialize: async () => {
    const results = await Promise.allSettled([
      get().fetchTemplates(),
      get().fetchCategories(),
      get().fetchDefaultTemplate()
    ]);

    const errors = results
      .filter(r => r.status === 'rejected')
      .map(r => r.reason?.message || 'Unknown error');

    if (errors.length > 0) {
      console.error('Template store initialization errors:', errors);
      toast.error('Some template data could not be loaded');
    }

    return {
      success: errors.length === 0,
      partial: errors.length > 0 && errors.length < results.length,
      errors
    };
  }
}));

export default useTemplateStore;