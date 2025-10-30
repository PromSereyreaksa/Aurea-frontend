# Backend Dynamic Template System

## Executive Summary

This document outlines the **backend infrastructure** needed to support the frontend's schema-driven template system. The backend must store, validate, and serve template schemas dynamically, enabling template creation without code deployment.

**Goal:** Backend becomes a **Template Management System** that stores templates as structured data, not code.

---

## Current Backend Problems

### 1. **Templates Are Not Properly Stored**

```javascript
// ❌ CURRENT: Backend has incomplete template schema
{
  templateId: "echelon",
  name: "Echelon",
  schema: {
    sections: [...], // Incomplete field definitions
    styling: {...}   // Basic styling only
  }
}
```

**Issues:**
- Field definitions incomplete (missing validation, types, constraints)
- No section variants stored
- No component mapping
- Frontend has to guess structure

### 2. **No Template Versioning**

```javascript
// ❌ No version control
// What happens when template schema changes?
// How do existing portfolios handle updates?
```

### 3. **No Template Validation**

```javascript
// ❌ Backend doesn't validate:
// - Are all required fields present?
// - Are field types valid?
// - Are section types supported?
// - Are variants defined?
```

### 4. **Portfolio Content Not Validated Against Schema**

```javascript
// ❌ User can save ANY content structure
// No validation that content matches template schema
{
  hero: {
    randomField: "value"  // Not in schema, but allowed
  }
}
```

---

## Solution Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────┐
│                    TEMPLATE LIFECYCLE                         │
└──────────────────────────────────────────────────────────────┘

1. TEMPLATE CREATION
   ┌─────────────────────────────────────────┐
   │ Developer/Designer creates schema       │
   │ POST /api/templates                     │
   └─────────────────────────────────────────┘
                    ↓
   ┌─────────────────────────────────────────┐
   │ Backend validates schema                │
   │ - Check required fields                 │
   │ - Validate field types                  │
   │ - Verify section types exist            │
   │ - Check variant definitions             │
   └─────────────────────────────────────────┘
                    ↓
   ┌─────────────────────────────────────────┐
   │ Store in templates collection           │
   │ - Assign version (1.0.0)                │
   │ - Set as active                         │
   │ - Generate template ID                  │
   └─────────────────────────────────────────┘

2. TEMPLATE USAGE
   ┌─────────────────────────────────────────┐
   │ User selects template                   │
   │ Frontend: GET /api/templates/:id        │
   └─────────────────────────────────────────┘
                    ↓
   ┌─────────────────────────────────────────┐
   │ Backend returns complete schema         │
   │ - All section definitions               │
   │ - All field definitions with validation │
   │ - All variants                          │
   │ - Default values                        │
   └─────────────────────────────────────────┘
                    ↓
   ┌─────────────────────────────────────────┐
   │ User fills content via setup form       │
   │ Frontend validates against schema       │
   └─────────────────────────────────────────┘
                    ↓
   ┌─────────────────────────────────────────┐
   │ User saves portfolio                    │
   │ POST /api/portfolios                    │
   └─────────────────────────────────────────┘
                    ↓
   ┌─────────────────────────────────────────┐
   │ Backend validates content               │
   │ - Check against template schema         │
   │ - Validate required fields              │
   │ - Validate field types                  │
   │ - Validate constraints                  │
   └─────────────────────────────────────────┘
                    ↓
   ┌─────────────────────────────────────────┐
   │ Store portfolio with template version   │
   │ - Link to template                      │
   │ - Store template version used           │
   │ - Store validated content               │
   └─────────────────────────────────────────┘

3. TEMPLATE UPDATES
   ┌─────────────────────────────────────────┐
   │ Developer updates template schema       │
   │ PUT /api/templates/:id                  │
   └─────────────────────────────────────────┘
                    ↓
   ┌─────────────────────────────────────────┐
   │ Backend creates new version (1.1.0)     │
   │ - Old version remains for existing      │
   │ - New version for new portfolios        │
   └─────────────────────────────────────────┘
                    ↓
   ┌─────────────────────────────────────────┐
   │ Existing portfolios keep old version    │
   │ - No breaking changes                   │
   │ - Can migrate later                     │
   └─────────────────────────────────────────┘
```

---

## Database Schema

### Templates Collection

```javascript
// models/Template.js

const mongoose = require('mongoose');

// ============================================
// FIELD DEFINITION SCHEMA
// ============================================

const FieldSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },

  type: {
    type: String,
    required: true,
    enum: [
      'text', 'textarea', 'richtext',
      'email', 'url', 'tel', 'number',
      'image', 'video', 'file',
      'array', 'object',
      'select', 'checkbox', 'radio',
      'date', 'time', 'datetime',
      'color', 'range', 'toggle'
    ]
  },

  label: {
    type: String,
    required: true
  },

  placeholder: String,

  defaultValue: mongoose.Schema.Types.Mixed,

  required: {
    type: Boolean,
    default: false
  },

  // Validation rules
  validation: {
    minLength: Number,
    maxLength: Number,
    min: Number,
    max: Number,
    pattern: String, // Regex pattern
    allowedFormats: [String], // For files
    maxSize: Number, // For files (bytes)
    options: [String], // For select/radio
    custom: String // Custom validator function name
  },

  // For array fields
  itemType: String,
  minItems: Number,
  maxItems: Number,

  // For object fields
  fields: [this], // Recursive for nested objects

  // UI hints
  uiHints: {
    helpText: String,
    group: String, // Group related fields
    column: Number, // For multi-column layouts
    order: Number,
    hidden: Boolean,
    conditional: {
      field: String, // Show only if this field...
      operator: String, // equals, notEquals, contains, etc.
      value: mongoose.Schema.Types.Mixed
    }
  }
}, { _id: false });

// ============================================
// SECTION DEFINITION SCHEMA
// ============================================

const SectionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },

  type: {
    type: String,
    required: true,
    enum: [
      'hero', 'about', 'gallery', 'contact',
      'work', 'services', 'testimonials',
      'pricing', 'faq', 'team', 'blog',
      'cta', 'footer', 'navigation', 'custom'
    ]
  },

  variant: {
    type: String,
    required: true,
    // e.g., "centered-large", "split-image-text", "masonry-grid"
  },

  name: {
    type: String,
    required: true
  },

  description: String,

  order: {
    type: Number,
    required: true,
    default: 0
  },

  required: {
    type: Boolean,
    default: false
  },

  // Section-specific styling
  styling: {
    background: String, // 'solid', 'gradient', 'image', 'video'
    backgroundColor: String,
    backgroundImage: String,
    height: String, // 'auto', 'fullscreen', 'custom'
    padding: String, // 'default', 'compact', 'loose'
    margin: String,
    customCSS: String
  },

  // Fields that users can edit
  fields: [FieldSchema]

}, { _id: false });

// ============================================
// TEMPLATE SCHEMA
// ============================================

const TemplateSchema = new mongoose.Schema({
  // ============================================
  // IDENTIFICATION
  // ============================================

  templateId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  name: {
    type: String,
    required: true
  },

  slug: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  description: {
    type: String,
    required: true
  },

  // ============================================
  // CATEGORIZATION
  // ============================================

  category: {
    type: String,
    required: true,
    enum: ['creative', 'modern', 'classic', 'minimal', 'professional', 'artistic'],
    index: true
  },

  tags: [{
    type: String,
    index: true
  }],

  // ============================================
  // TEMPLATE CONTENT
  // ============================================

  // Complete schema definition
  schema: {
    // Sections configuration
    sections: {
      type: [SectionSchema],
      required: true,
      validate: {
        validator: function(sections) {
          // At least one section required
          return sections.length > 0;
        },
        message: 'Template must have at least one section'
      }
    },

    // Global styling
    styling: {
      theme: {
        primary: { type: String, default: '#000000' },
        secondary: { type: String, default: '#666666' },
        accent: { type: String, default: '#FF6B35' },
        background: { type: String, default: '#FFFFFF' },
        surface: { type: String, default: '#FFFFFF' },
        text: { type: String, default: '#000000' },
        textSecondary: { type: String, default: '#666666' }
      },

      typography: {
        headingFont: { type: String, default: 'Inter' },
        bodyFont: { type: String, default: 'Inter' },
        monoFont: { type: String, default: 'Courier New' },
        scale: {
          type: String,
          enum: ['small', 'default', 'large'],
          default: 'default'
        }
      },

      spacing: {
        type: String,
        enum: ['compact', 'default', 'loose'],
        default: 'default'
      },

      borderRadius: {
        type: String,
        enum: ['none', 'minimal', 'rounded', 'pill'],
        default: 'minimal'
      },

      customCSS: String
    },

    // Layout configuration
    layout: {
      maxWidth: { type: String, default: '1200px' },
      columns: { type: Number, default: 12 },
      gutter: { type: String, default: '24px' }
    }
  },

  // ============================================
  // PREVIEW & ASSETS
  // ============================================

  thumbnail: {
    type: String,
    required: true
  },

  previewImages: [String],

  demoUrl: String, // Live demo link

  // ============================================
  // VERSIONING
  // ============================================

  version: {
    type: String,
    required: true,
    default: '1.0.0'
  },

  // Version history for rollback
  versionHistory: [{
    version: String,
    schema: mongoose.Schema.Types.Mixed,
    publishedAt: Date,
    changelog: String
  }],

  // ============================================
  // FEATURES & COMPATIBILITY
  // ============================================

  features: [{
    type: String,
    // e.g., ['responsive', 'dark-mode', 'animations', 'seo-optimized']
  }],

  requiredPlugins: [{
    name: String,
    version: String
  }],

  compatibility: {
    minFrontendVersion: String,
    maxFrontendVersion: String
  },

  // ============================================
  // STATUS & METADATA
  // ============================================

  isActive: {
    type: Boolean,
    default: true,
    index: true
  },

  isDefault: {
    type: Boolean,
    default: false
  },

  isPremium: {
    type: Boolean,
    default: false
  },

  // ============================================
  // USAGE TRACKING
  // ============================================

  usageCount: {
    type: Number,
    default: 0
  },

  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },

  // ============================================
  // OWNERSHIP
  // ============================================

  createdBy: {
    type: String,
    default: 'Aurea'
  },

  updatedBy: String

}, {
  timestamps: true
});

// ============================================
// INDEXES
// ============================================

TemplateSchema.index({ templateId: 1, version: 1 });
TemplateSchema.index({ category: 1, isActive: 1 });
TemplateSchema.index({ tags: 1 });
TemplateSchema.index({ usageCount: -1 });
TemplateSchema.index({ 'rating.average': -1 });

// ============================================
// METHODS
// ============================================

TemplateSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  return this.save();
};

TemplateSchema.methods.createNewVersion = function(newSchema, changelog) {
  // Save current version to history
  this.versionHistory.push({
    version: this.version,
    schema: this.schema,
    publishedAt: new Date(),
    changelog: changelog || 'Version update'
  });

  // Increment version (semantic versioning)
  const [major, minor, patch] = this.version.split('.').map(Number);
  this.version = `${major}.${minor + 1}.0`;
  this.schema = newSchema;

  return this.save();
};

TemplateSchema.methods.addRating = function(rating) {
  const totalRating = this.rating.average * this.rating.count;
  this.rating.count += 1;
  this.rating.average = (totalRating + rating) / this.rating.count;
  return this.save();
};

// ============================================
// STATICS
// ============================================

TemplateSchema.statics.getActiveTemplates = function(category = null) {
  const query = { isActive: true };
  if (category) {
    query.category = category;
  }
  return this.find(query).sort({ usageCount: -1 });
};

TemplateSchema.statics.getDefaultTemplate = function() {
  return this.findOne({ isDefault: true, isActive: true });
};

TemplateSchema.statics.searchTemplates = function(searchTerm) {
  return this.find({
    isActive: true,
    $or: [
      { name: new RegExp(searchTerm, 'i') },
      { description: new RegExp(searchTerm, 'i') },
      { tags: new RegExp(searchTerm, 'i') }
    ]
  }).sort({ usageCount: -1 });
};

// ============================================
// VALIDATION HELPER
// ============================================

TemplateSchema.methods.validateContent = function(content) {
  const errors = [];

  // Validate each section
  for (const sectionDef of this.schema.sections) {
    const sectionContent = content[sectionDef.id];

    // Check required sections
    if (sectionDef.required && !sectionContent) {
      errors.push({
        section: sectionDef.id,
        error: 'Required section is missing'
      });
      continue;
    }

    if (!sectionContent) continue;

    // Validate fields within section
    for (const fieldDef of sectionDef.fields) {
      const fieldValue = sectionContent[fieldDef.id];

      // Check required fields
      if (fieldDef.required && !fieldValue) {
        errors.push({
          section: sectionDef.id,
          field: fieldDef.id,
          error: 'Required field is missing'
        });
        continue;
      }

      if (!fieldValue) continue;

      // Validate field type
      const typeValid = validateFieldType(fieldValue, fieldDef.type);
      if (!typeValid) {
        errors.push({
          section: sectionDef.id,
          field: fieldDef.id,
          error: `Invalid type. Expected ${fieldDef.type}`
        });
      }

      // Validate constraints
      if (fieldDef.validation) {
        const constraintErrors = validateConstraints(fieldValue, fieldDef.validation);
        errors.push(...constraintErrors.map(err => ({
          section: sectionDef.id,
          field: fieldDef.id,
          error: err
        })));
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

// Helper functions
function validateFieldType(value, expectedType) {
  switch (expectedType) {
    case 'text':
    case 'textarea':
    case 'richtext':
    case 'email':
    case 'url':
    case 'tel':
      return typeof value === 'string';
    case 'number':
      return typeof value === 'number';
    case 'array':
      return Array.isArray(value);
    case 'object':
      return typeof value === 'object' && !Array.isArray(value);
    case 'checkbox':
    case 'toggle':
      return typeof value === 'boolean';
    default:
      return true;
  }
}

function validateConstraints(value, validation) {
  const errors = [];

  if (validation.minLength && value.length < validation.minLength) {
    errors.push(`Minimum length is ${validation.minLength}`);
  }

  if (validation.maxLength && value.length > validation.maxLength) {
    errors.push(`Maximum length is ${validation.maxLength}`);
  }

  if (validation.min !== undefined && value < validation.min) {
    errors.push(`Minimum value is ${validation.min}`);
  }

  if (validation.max !== undefined && value > validation.max) {
    errors.push(`Maximum value is ${validation.max}`);
  }

  if (validation.pattern) {
    const regex = new RegExp(validation.pattern);
    if (!regex.test(value)) {
      errors.push('Value does not match required pattern');
    }
  }

  if (validation.allowedFormats && Array.isArray(validation.allowedFormats)) {
    const format = value.split('.').pop();
    if (!validation.allowedFormats.includes(format)) {
      errors.push(`Allowed formats: ${validation.allowedFormats.join(', ')}`);
    }
  }

  return errors;
}

module.exports = mongoose.model('Template', TemplateSchema);
```

---

## API Endpoints

### 1. Create Template

```javascript
// POST /api/templates
// Creates a new template with schema validation

const Template = require('../models/Template');

router.post('/', adminAuth, async (req, res) => {
  try {
    const {
      templateId,
      name,
      description,
      category,
      schema,
      thumbnail,
      tags,
      features
    } = req.body;

    // ============================================
    // 1. VALIDATE TEMPLATE ID UNIQUENESS
    // ============================================

    const existing = await Template.findOne({ templateId });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Template ID already exists'
      });
    }

    // ============================================
    // 2. VALIDATE SCHEMA
    // ============================================

    // Check sections
    if (!schema.sections || schema.sections.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Template must have at least one section'
      });
    }

    // Validate each section
    for (const section of schema.sections) {
      // Check required fields
      if (!section.id || !section.type || !section.variant) {
        return res.status(400).json({
          success: false,
          message: `Section missing required fields: id, type, variant`
        });
      }

      // Validate fields array
      if (!section.fields || !Array.isArray(section.fields)) {
        return res.status(400).json({
          success: false,
          message: `Section ${section.id} must have fields array`
        });
      }

      // Validate each field
      for (const field of section.fields) {
        if (!field.id || !field.type || !field.label) {
          return res.status(400).json({
            success: false,
            message: `Field in section ${section.id} missing required properties`
          });
        }
      }
    }

    // ============================================
    // 3. CREATE TEMPLATE
    // ============================================

    const template = new Template({
      templateId,
      name,
      slug: templateId,
      description,
      category,
      schema,
      thumbnail,
      tags: tags || [],
      features: features || [],
      version: '1.0.0',
      isActive: true,
      createdBy: req.user.email || 'admin'
    });

    await template.save();

    // ============================================
    // 4. RETURN SUCCESS
    // ============================================

    return res.status(201).json({
      success: true,
      message: 'Template created successfully',
      data: template
    });

  } catch (error) {
    console.error('Template creation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create template',
      error: error.message
    });
  }
});
```

### 2. Get Template with Schema

```javascript
// GET /api/templates/:id
// Returns complete template with full schema

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const template = await Template.findOne({
      templateId: id,
      isActive: true
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    // Increment usage count (async, don't wait)
    template.incrementUsage().catch(err => {
      console.error('Failed to increment usage:', err);
    });

    return res.status(200).json({
      success: true,
      message: 'Template retrieved successfully',
      data: template
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve template',
      error: error.message
    });
  }
});
```

### 3. Get All Templates

```javascript
// GET /api/templates
// Returns all active templates with optional filtering

router.get('/', async (req, res) => {
  try {
    const { category, search, premium, sortBy } = req.query;

    let query = { isActive: true };

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by premium
    if (premium !== undefined) {
      query.isPremium = premium === 'true';
    }

    let templatesQuery = Template.find(query);

    // Search
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { tags: new RegExp(search, 'i') }
      ];
    }

    // Sorting
    switch (sortBy) {
      case 'popular':
        templatesQuery = templatesQuery.sort({ usageCount: -1 });
        break;
      case 'rating':
        templatesQuery = templatesQuery.sort({ 'rating.average': -1 });
        break;
      case 'newest':
        templatesQuery = templatesQuery.sort({ createdAt: -1 });
        break;
      default:
        templatesQuery = templatesQuery.sort({ usageCount: -1 });
    }

    const templates = await templatesQuery.exec();

    return res.status(200).json({
      success: true,
      message: 'Templates retrieved successfully',
      data: templates,
      count: templates.length
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve templates',
      error: error.message
    });
  }
});
```

### 4. Update Template (Create New Version)

```javascript
// PUT /api/templates/:id
// Updates template schema and creates new version

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { schema, changelog } = req.body;

    const template = await Template.findOne({ templateId: id });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    // Create new version
    await template.createNewVersion(schema, changelog);

    return res.status(200).json({
      success: true,
      message: 'Template updated successfully',
      data: {
        templateId: template.templateId,
        version: template.version,
        changelog
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update template',
      error: error.message
    });
  }
});
```

### 5. Validate Portfolio Content Against Schema

```javascript
// POST /api/templates/:id/validate
// Validates portfolio content against template schema

router.post('/:id/validate', async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const template = await Template.findOne({ templateId: id });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    // Validate content
    const validation = template.validateContent(content);

    return res.status(200).json({
      success: true,
      message: validation.valid ? 'Content is valid' : 'Content has errors',
      data: validation
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Validation failed',
      error: error.message
    });
  }
});
```

### 6. Get Template Categories

```javascript
// GET /api/templates/categories
// Returns available template categories

router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Template.distinct('category', { isActive: true });

    return res.status(200).json({
      success: true,
      data: categories
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve categories',
      error: error.message
    });
  }
});
```

---

## Portfolio Schema Update

Update Portfolio model to store template version:

```javascript
// models/Portfolio.js

const PortfolioSchema = new mongoose.Schema({
  // ... existing fields

  // Template reference
  template: {
    type: String,
    required: true
  },

  // NEW: Store template version
  templateVersion: {
    type: String,
    required: true,
    default: '1.0.0'
  },

  // Content (validated against template schema)
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },

  // NEW: Add validation method
  async validateContent() {
    const Template = mongoose.model('Template');
    const template = await Template.findOne({
      templateId: this.template,
      version: this.templateVersion
    });

    if (!template) {
      throw new Error('Template not found');
    }

    return template.validateContent(this.content);
  }
});

// Pre-save hook to validate content
PortfolioSchema.pre('save', async function(next) {
  if (this.isModified('content')) {
    try {
      const validation = await this.validateContent();

      if (!validation.valid) {
        const error = new Error('Content validation failed');
        error.validationErrors = validation.errors;
        throw error;
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});
```

---

## Content Validation Middleware

```javascript
// middleware/validatePortfolioContent.js

const Template = require('../models/Template');

async function validatePortfolioContent(req, res, next) {
  try {
    const { template, content } = req.body;

    if (!template || !content) {
      return next();
    }

    // Get template
    const templateDoc = await Template.findOne({
      templateId: template,
      isActive: true
    });

    if (!templateDoc) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    // Validate content
    const validation = templateDoc.validateContent(content);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: 'Content validation failed',
        errors: validation.errors
      });
    }

    // Attach template version to request
    req.templateVersion = templateDoc.version;

    next();

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Validation error',
      error: error.message
    });
  }
}

module.exports = validatePortfolioContent;
```

Use in portfolio routes:

```javascript
// routes/portfolios.js

const validatePortfolioContent = require('../middleware/validatePortfolioContent');

// Create portfolio
router.post('/', auth, validatePortfolioContent, async (req, res) => {
  // ... create portfolio
  // Use req.templateVersion for version
});

// Update portfolio
router.put('/:id', auth, validatePortfolioContent, async (req, res) => {
  // ... update portfolio
});
```

---

## Template Migration/Seeding

```javascript
// scripts/seed-templates.js

const Template = require('../models/Template');
const fs = require('fs');
const path = require('path');

async function seedTemplates() {
  console.log('Seeding templates...');

  // Load template schemas from JSON files
  const templatesDir = path.join(__dirname, '../templates');
  const templateFiles = fs.readdirSync(templatesDir);

  for (const file of templateFiles) {
    if (!file.endsWith('.json')) continue;

    const templatePath = path.join(templatesDir, file);
    const templateData = JSON.parse(fs.readFileSync(templatePath, 'utf8'));

    try {
      // Check if template exists
      const existing = await Template.findOne({
        templateId: templateData.templateId
      });

      if (existing) {
        console.log(`Template ${templateData.templateId} already exists, skipping...`);
        continue;
      }

      // Create template
      const template = new Template(templateData);
      await template.save();

      console.log(`✅ Created template: ${templateData.name}`);

    } catch (error) {
      console.error(`❌ Failed to create template ${templateData.templateId}:`, error.message);
    }
  }

  console.log('Template seeding complete');
}

// Run
seedTemplates()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });
```

Example template JSON:

```json
// templates/modern-portfolio.json
{
  "templateId": "modern-portfolio-v1",
  "name": "Modern Portfolio",
  "slug": "modern-portfolio-v1",
  "description": "A clean, modern portfolio template with bold typography",
  "category": "modern",
  "tags": ["minimal", "clean", "professional"],
  "thumbnail": "https://example.com/modern-portfolio-thumb.jpg",
  "features": ["responsive", "dark-mode", "animations"],
  "schema": {
    "sections": [
      {
        "id": "hero",
        "type": "hero",
        "variant": "centered-large",
        "name": "Hero Section",
        "order": 0,
        "required": true,
        "fields": [
          {
            "id": "title",
            "type": "text",
            "label": "Main Heading",
            "placeholder": "Your Name",
            "required": true,
            "validation": {
              "minLength": 2,
              "maxLength": 100
            }
          }
        ]
      }
    ],
    "styling": {
      "theme": {
        "primary": "#000000",
        "accent": "#FF6B35"
      },
      "typography": {
        "headingFont": "Inter",
        "bodyFont": "Inter",
        "scale": "default"
      }
    }
  }
}
```

---

## Testing

```javascript
// tests/templates.test.js

describe('Templates API', () => {

  describe('POST /api/templates', () => {
    it('should create template with valid schema', async () => {
      const templateData = {
        templateId: 'test-template',
        name: 'Test Template',
        description: 'Test description',
        category: 'modern',
        schema: {
          sections: [{
            id: 'hero',
            type: 'hero',
            variant: 'centered',
            name: 'Hero',
            order: 0,
            fields: [{
              id: 'title',
              type: 'text',
              label: 'Title',
              required: true
            }]
          }],
          styling: {}
        },
        thumbnail: 'https://example.com/thumb.jpg'
      };

      const res = await request(app)
        .post('/api/templates')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(templateData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('should reject template with missing sections', async () => {
      const res = await request(app)
        .post('/api/templates')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          templateId: 'invalid',
          name: 'Invalid',
          schema: { sections: [] }
        });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/templates/:id/validate', () => {
    it('should validate valid content', async () => {
      const res = await request(app)
        .post(`/api/templates/test-template/validate`)
        .send({
          content: {
            hero: {
              title: 'My Title'
            }
          }
        });

      expect(res.status).toBe(200);
      expect(res.body.data.valid).toBe(true);
    });

    it('should reject invalid content', async () => {
      const res = await request(app)
        .post(`/api/templates/test-template/validate`)
        .send({
          content: {
            hero: {} // Missing required title
          }
        });

      expect(res.status).toBe(200);
      expect(res.body.data.valid).toBe(false);
      expect(res.body.data.errors.length).toBeGreaterThan(0);
    });
  });
});
```

---

## Deployment Checklist

- [ ] Create Template model with complete schema
- [ ] Add indexes to templates collection
- [ ] Implement all API endpoints
- [ ] Add content validation middleware
- [ ] Update Portfolio model with templateVersion
- [ ] Create template seeding script
- [ ] Write comprehensive tests
- [ ] Document template schema format
- [ ] Create admin UI for template management
- [ ] Set up template versioning system
- [ ] Add rollback capability
- [ ] Implement caching for templates
- [ ] Add monitoring/logging
- [ ] Deploy to production

---

## Summary

This backend system provides:

✅ **Complete schema storage** - All field definitions, validation, constraints
✅ **Version control** - Track template changes, rollback if needed
✅ **Content validation** - Ensure portfolios match template schemas
✅ **No-code template creation** - Upload JSON, backend handles rest
✅ **Backward compatibility** - Old portfolios keep old versions
✅ **Performance** - Caching, indexing, optimized queries
✅ **Scalability** - Support unlimited templates

The backend becomes a **Template Management System** that makes template creation as simple as uploading a JSON file.
