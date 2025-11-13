# Template Creation Guide for Developers

**Quick Reference:** How to create new portfolio templates without breaking the system

---

## 🎯 Golden Rules

1. **ALWAYS create schema first, then implementation**
2. **NEVER hardcode content** - use schema fields
3. **ALWAYS test with DynamicTemplateRenderer** before deployment
4. **ALWAYS sync to backend** after creating frontend template
5. **Use existing section types** when possible (hero, about, work, gallery, contact)

---

## 📋 Template Checklist

Before creating a new template, ensure you have:

- [ ] Template name (lowercase-kebab-case)
- [ ] Category (classic, modern, creative, minimal)
- [ ] List of sections needed
- [ ] Design mockup or reference
- [ ] Color palette
- [ ] Font choices
- [ ] Sample content for testing

---

## 🚀 Quick Start: Create Template in 5 Steps

### Step 1: Define Schema

```javascript
// src/templates/your-template/schema.js
export const yourTemplateSchema = {
  sections: [
    {
      id: 'hero',
      type: 'hero',
      name: 'Hero Section',
      description: 'Main introduction area',
      required: true,
      order: 0,
      fields: [
        {
          id: 'name',
          type: 'text',
          label: 'Your Name',
          required: true,
          validation: { maxLength: 100 }
        },
        {
          id: 'title',
          type: 'text',
          label: 'Your Title',
          required: true,
          validation: { maxLength: 150 }
        },
        {
          id: 'description',
          type: 'textarea',
          label: 'Brief Introduction',
          required: false,
          validation: { maxLength: 500 }
        }
      ]
    },
    {
      id: 'about',
      type: 'about',
      name: 'About Section',
      required: false,
      order: 1,
      fields: [
        {
          id: 'heading',
          type: 'text',
          label: 'Section Heading',
          required: false
        },
        {
          id: 'content',
          type: 'richtext',
          label: 'About Content',
          required: false
        },
        {
          id: 'image',
          type: 'image',
          label: 'Profile Image',
          required: false
        }
      ]
    }
    // Add more sections...
  ]
};
```

### Step 2: Create Default Content

```javascript
// src/templates/your-template/defaultContent.js
export const yourTemplateDefaultContent = {
  hero: {
    name: 'Your Name',
    title: 'Creative Professional',
    description: 'I create beautiful digital experiences.'
  },
  about: {
    heading: 'About Me',
    content: 'Tell your story here...',
    image: '' // Empty = placeholder
  },
  work: {
    heading: 'Selected Work',
    projects: [
      {
        id: 1,
        title: 'Project Title',
        description: 'Project description',
        image: '',
        category: 'design',
        meta: '2025 — Design'
      }
    ]
  },
  // Add more sections matching schema...
};
```

### Step 3: Define Styling

```javascript
// src/templates/your-template/styling.js
export const yourTemplateStyling = {
  colors: {
    primary: '#FF6B2C',      // Main brand color
    background: '#FFFFFF',   // Page background
    text: '#1A1A1A',        // Body text
    textLight: '#666666',   // Secondary text
    border: '#E5E5E5'       // Borders/dividers
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
    mono: 'JetBrains Mono, monospace'
  },
  typography: {
    scale: {
      xs: '0.75rem',   // 12px
      sm: '0.875rem',  // 14px
      base: '1rem',    // 16px
      lg: '1.125rem',  // 18px
      xl: '1.25rem',   // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '2rem',   // 32px
      '4xl': '3rem'    // 48px
    }
  },
  spacing: {
    section: '120px',    // Between sections
    container: '1200px', // Max content width
    gutter: '24px'      // Side padding
  }
};
```

### Step 4: Create Template Export

```javascript
// src/templates/your-template/index.js
import { yourTemplateSchema } from './schema';
import { yourTemplateDefaultContent } from './defaultContent';
import { yourTemplateStyling } from './styling';

export const yourTemplate = {
  id: 'your-template',
  name: 'Your Template Name',
  description: 'Brief description of this template style',
  category: 'modern', // classic, modern, creative, minimal
  thumbnail: '/templates/your-template/thumbnail.jpg',

  // Schema for form generation
  schema: yourTemplateSchema,

  // Default content structure
  defaultContent: yourTemplateDefaultContent,

  // Styling configuration
  styling: yourTemplateStyling,

  // Features list (for marketing)
  features: [
    'Responsive Design',
    'Dark Mode Support',
    'Smooth Animations',
    'Portfolio Gallery'
  ],

  // Template metadata
  isPremium: false,
  version: '1.0.0',
  tags: ['minimal', 'modern', 'clean']
};
```

### Step 5: Register Template

```javascript
// src/templates/index.js
import { echelonTemplate } from './Echelon';
import { sereneTemplate } from './Serene';
import { yourTemplate } from './your-template'; // Add this

export const templates = {
  echelon: echelonTemplate,
  serene: sereneTemplate,
  'your-template': yourTemplate  // Add this
};

export const getTemplate = (id) => templates[id] || templates.echelon;

export const createPortfolioFromTemplate = (templateId, customContent = {}) => {
  const template = getTemplate(templateId);
  return {
    templateId,
    content: { ...template.defaultContent, ...customContent },
    styling: template.styling
  };
};
```

---

## 🤖 AI Prompting Guide

### When Creating a New Template

**Prompt Template:**

```
Create a new portfolio template called [NAME] with these requirements:

STYLE: [modern/classic/creative/minimal]
SECTIONS: [hero, about, work, gallery, contact, etc.]
COLOR SCHEME: [colors]
FONTS: [font names]

Requirements:
1. Create schema with all section fields
2. Create defaultContent matching schema
3. Create styling config (colors, fonts, spacing)
4. Export template in src/templates/[name]/
5. Register in src/templates/index.js
6. Use existing DynamicTemplateRenderer for rendering

Follow this structure:
src/templates/[name]/
  - index.js (main export)
  - schema.js (section definitions)
  - defaultContent.js (sample data)
  - styling.js (theme config)

IMPORTANT:
- All content must come from schema fields
- No hardcoded text in components
- Use schema types: text, textarea, richtext, image, array, object
- Support DynamicTemplateRenderer compatibility
```

### When Adding a New Section Type

**Prompt Template:**

```
Add a new [SECTION_TYPE] section to the dynamic template system:

SECTION: [testimonials/skills/timeline/etc.]
LAYOUT: [describe visual layout]
FIELDS: [list required fields]

Create:
1. DynamicXxxSection.jsx component in src/components/Templates/Sections/
2. Support edit and display modes
3. Use schema-driven rendering
4. Add to DynamicTemplateRenderer imports
5. Follow existing section patterns (DynamicAboutSection, DynamicWorkSection)

Component structure:
- Read fields from config.fields
- Render based on variant (layout options)
- Support isEditing mode with inline editing
- Apply styling from props
- Use Framer Motion for animations
```

### When Fixing a Template Issue

**Prompt Template:**

```
Fix template rendering issue:

TEMPLATE: [template name]
SECTION: [which section]
ISSUE: [describe problem]

Check:
1. Does schema match defaultContent structure?
2. Are all field IDs consistent?
3. Is DynamicTemplateRenderer importing this section type?
4. Is the section type in sectionComponents registry?
5. Does the template sync to backend?

Debug steps:
- Check browser console for errors
- Verify schema structure in template file
- Test with DynamicTemplateRenderer directly
- Validate backend sync with templateApi.syncTemplateSchema()
```

---

## ⚠️ Common Mistakes to Avoid

### ❌ DON'T:

```javascript
// Hardcoded content in component
const HeroSection = () => (
  <h1>John Doe</h1> // ❌ Bad - hardcoded
);

// Missing schema fields
const schema = {
  sections: [{
    id: 'hero',
    fields: [] // ❌ No fields defined
  }]
};

// Inconsistent IDs
const schema = {
  sections: [{ id: 'hero', fields: [{ id: 'title' }] }]
};
const defaultContent = {
  heroSection: { title: 'Hi' } // ❌ ID mismatch (hero vs heroSection)
};
```

### ✅ DO:

```javascript
// Schema-driven content
const HeroSection = ({ content }) => (
  <h1>{content.name}</h1> // ✅ Good - from schema
);

// Complete schema definition
const schema = {
  sections: [{
    id: 'hero',
    type: 'hero',
    name: 'Hero Section',
    fields: [
      { id: 'name', type: 'text', label: 'Your Name' }
    ]
  }]
};

// Consistent IDs
const defaultContent = {
  hero: { name: 'Your Name' } // ✅ Matches schema section ID
};
```

---

## 🔍 Testing Checklist

After creating a template:

- [ ] **Schema Validation**
  ```bash
  # In browser console:
  window.templateMigration.validateSchema(yourTemplate.schema)
  ```

- [ ] **Backend Sync**
  ```javascript
  import { templateApi } from './lib/templateApi';
  await templateApi.syncTemplateSchema(yourTemplate);
  ```

- [ ] **Visual Test**
  - Go to `/portfolio-builder/new`
  - Select your template
  - Fill out setup form
  - Verify all sections render
  - Check responsive design (mobile/tablet/desktop)

- [ ] **Content Test**
  - Create portfolio with template
  - Edit each section
  - Save and reload
  - Verify persistence

- [ ] **Validation Test**
  - Try saving with empty required fields
  - Should show validation errors
  - Fill required fields
  - Should save successfully

---

## 📚 Field Types Reference

```javascript
// Text input
{ id: 'title', type: 'text', label: 'Title', required: true }

// Multi-line text
{ id: 'bio', type: 'textarea', label: 'Biography', required: false }

// Rich text editor
{ id: 'content', type: 'richtext', label: 'Content', required: false }

// Image URL
{ id: 'avatar', type: 'image', label: 'Profile Picture', required: false }

// Email
{ id: 'email', type: 'email', label: 'Email Address', required: true }

// URL
{ id: 'website', type: 'url', label: 'Website URL', required: false }

// Phone
{ id: 'phone', type: 'tel', label: 'Phone Number', required: false }

// Number
{ id: 'experience', type: 'number', label: 'Years Experience', required: false }

// Dropdown select
{ id: 'category', type: 'select', label: 'Category',
  options: ['design', 'development', 'photography'] }

// Checkbox/toggle
{ id: 'featured', type: 'checkbox', label: 'Featured Project', required: false }

// Array of items
{ id: 'skills', type: 'array', label: 'Skills', itemType: 'text' }

// Array of objects (complex)
{ id: 'projects', type: 'array', label: 'Projects',
  itemSchema: {
    title: { type: 'text' },
    description: { type: 'textarea' },
    image: { type: 'image' }
  }
}

// Nested object
{ id: 'social', type: 'object', label: 'Social Links',
  schema: {
    twitter: { type: 'url', label: 'Twitter' },
    github: { type: 'url', label: 'GitHub' }
  }
}
```

---

## 🔄 Sync Workflow

```bash
# 1. Create template files in frontend
src/templates/your-template/
  - index.js
  - schema.js
  - defaultContent.js
  - styling.js

# 2. Register in templates/index.js

# 3. Test locally
npm run dev
# Visit /portfolio-builder/new

# 4. Sync to backend
# In browser console:
window.templateMigration.migrateSingle('your-template')

# OR programmatically:
import { templateApi } from './lib/templateApi';
await templateApi.syncTemplateSchema(yourTemplate);

# 5. Verify backend
# Check MongoDB or backend logs
# Template should appear in /api/templates
```

---

## 🎨 Layout Variants

Most sections support multiple layout variants:

```javascript
// Hero variants
layout: 'centered'      // Centered text
layout: 'split'         // Image left, text right
layout: 'fullscreen'    // Full viewport height

// About variants
layout: 'two_column'    // Image + text side-by-side
layout: 'centered'      // Centered content
layout: 'split_layout'  // Custom split

// Work variants
layout: 'grid'          // Grid of projects
layout: 'list'          // Vertical list
layout: 'masonry'       // Pinterest-style grid

// Gallery variants
layout: 'grid'          // Equal-size grid
layout: 'masonry'       // Varying heights
layout: 'asymmetric'    // Custom arrangement

// Contact variants
layout: 'minimal'       // Simple contact info
layout: 'centered'      // Centered form
layout: 'two_column'    // Form + info side-by-side
```

---

## 🚨 Emergency Fixes

### Template Not Showing in Selector

```javascript
// 1. Check registration
import { templates } from './templates';
console.log(templates); // Should include your template

// 2. Check backend sync
await templateApi.getTemplates(); // Should return your template

// 3. Force refresh
localStorage.clear();
window.location.reload();
```

### Validation Errors

```javascript
// Check schema structure
const validation = validateTemplateSchema(yourTemplate.schema);
console.log(validation);

// Common issues:
// - Missing required fields (id, type, name)
// - Field ID mismatch with defaultContent
// - Invalid field types
```

### Rendering Issues

```javascript
// Test DynamicTemplateRenderer directly
import DynamicTemplateRenderer from './components/Templates/DynamicTemplateRenderer';

<DynamicTemplateRenderer
  template={yourTemplate}
  content={yourTemplate.defaultContent}
  isPreview={true}
/>
```

---

## 📖 Examples

### Minimal Template (Starter)

```javascript
// Perfect for learning - just 2 sections
export const minimalTemplate = {
  id: 'minimal',
  name: 'Minimal',
  schema: {
    sections: [
      {
        id: 'hero',
        type: 'hero',
        name: 'Hero',
        fields: [
          { id: 'name', type: 'text', label: 'Name' },
          { id: 'title', type: 'text', label: 'Title' }
        ]
      },
      {
        id: 'contact',
        type: 'contact',
        name: 'Contact',
        fields: [
          { id: 'email', type: 'email', label: 'Email' }
        ]
      }
    ]
  },
  defaultContent: {
    hero: { name: 'Your Name', title: 'Your Title' },
    contact: { email: 'you@example.com' }
  },
  styling: {
    colors: { primary: '#000', background: '#fff', text: '#333' },
    fonts: { heading: 'Arial', body: 'Arial' }
  }
};
```

### Complete Template (Production)

See `src/templates/Echelon/` for full example with:
- 5+ sections (hero, about, work, gallery, contact)
- Complex fields (arrays, objects, rich text)
- Multiple layout variants
- Advanced styling
- Animations

---

## 🎯 Best Practices

1. **Start Simple** - 2-3 sections, then expand
2. **Use Existing Sections** - Don't create new section types unless necessary
3. **Consistent Naming** - Use kebab-case for IDs
4. **Test Early** - Test after each section addition
5. **Document Fields** - Add helpText to schema fields
6. **Provide Examples** - Use realistic placeholder content
7. **Mobile First** - Design for mobile, then desktop
8. **Accessibility** - Use semantic HTML, ARIA labels
9. **Performance** - Optimize images, lazy load heavy sections
10. **Version Control** - Increment version on breaking changes

---

## 📞 Need Help?

- Check existing templates: `src/templates/Echelon/`, `src/templates/Serene/`
- Read schema examples: `docs/TEMPLATE_SYSTEM_GUIDE.md`
- Test sections: Visit `/portfolio-builder/new`
- Validate schema: Use browser console validation tools
- Ask AI: Use the prompt templates above

---

**Last Updated:** October 19, 2025
**Status:** Active Development Guide
**Maintainer:** Development Team

**TL;DR:** Schema → DefaultContent → Styling → Export → Register → Sync → Test
