# Frontend Dynamic Template System Refactor

## Executive Summary

The current template system is **hardcoded and rigid**. Each template requires custom React components, manual setup forms, and complex integration code. This document outlines a refactor to a **schema-driven, dynamic template system** inspired by Wix, Webflow, and Readymag.

**Goal:** Enable template creation without writing code. Make the system truly dynamic where templates are pure JSON schemas that the system renders automatically.

---

## Current Problems

### 1. **Hardcoded Templates**
```javascript
// ❌ Current: Each template is a custom React component
src/templates/Echelon/EchelonTemplate.jsx  // ~500 lines of custom code
src/templates/Serene/SereneTemplate.jsx    // ~400 lines of custom code
```

- New templates require writing full React components
- Sections (Hero, Gallery, About) are template-specific
- No reusability across templates

### 2. **Non-Dynamic Setup Forms**
```javascript
// ❌ Current: Setup form tries to be dynamic but still template-specific
templateAnalyzer.js generates steps from defaultContent
But each template has different structure requirements
Setup form fields are inferred, not schema-defined
```

- Setup forms don't truly adapt to templates
- Field types are guessed, not defined
- No validation or constraints from schema

### 3. **Messy Editing Experience**
```javascript
// ❌ Current: Editing happens in a separate TemplatePreview component
- isEditing prop passed down
- onContentChange callbacks bubbled up
- Content stored separately from display
- No inline editing (not like Wix/Webflow)
```

- Users can't see what they're editing
- Separate "edit mode" vs "preview mode"
- Complex state management

### 4. **Template-Specific Logic Everywhere**
```javascript
// ❌ Current: Every file checks template type
if (templateId === 'echelon') { ... }
else if (templateId === 'serene') { ... }
```

---

## The Solution: Schema-Driven Architecture

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    BACKEND (Source of Truth)            │
│                                                         │
│  Template Schema (JSON)                                 │
│  ├─ metadata (id, name, category)                      │
│  ├─ sections[] (hero, gallery, contact, etc.)         │
│  │   ├─ id, type, layout                              │
│  │   ├─ fields[] (with validation, types)            │
│  │   └─ styling (colors, spacing)                     │
│  └─ globalStyling (fonts, colors, theme)              │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND                           │
│                                                         │
│  1. UniversalTemplateRenderer                          │
│     ├─ Reads schema from backend                       │
│     ├─ Maps section types to components               │
│     └─ Renders any template from schema               │
│                                                         │
│  2. SectionLibrary (Component Registry)                │
│     ├─ HeroSection (20+ variants)                     │
│     ├─ GallerySection (10+ layouts)                   │
│     ├─ AboutSection (15+ styles)                      │
│     ├─ ContactSection (5+ types)                      │
│     └─ CustomSection (user-defined)                   │
│                                                         │
│  3. SchemaFormGenerator                                │
│     ├─ Auto-generates setup form from schema          │
│     ├─ Validates inputs against schema rules          │
│     └─ Maps form data to content structure            │
│                                                         │
│  4. InlineEditor (Wix-style editing)                   │
│     ├─ Click-to-edit any text                         │
│     ├─ Drag-to-reorder sections                       │
│     ├─ Visual style controls                           │
│     └─ Real-time preview                               │
└─────────────────────────────────────────────────────────┘
```

---

## Implementation Plan

### Phase 1: Template Schema Definition

#### 1.1 Define Universal Schema Format

```javascript
// NEW: templates/schemas/template.schema.js
{
  // Metadata
  templateId: "modern-portfolio-v1",
  name: "Modern Portfolio",
  version: "1.0.0",
  category: "creative",

  // Global Styling
  styling: {
    theme: {
      primary: "#000000",
      secondary: "#666666",
      accent: "#FF6B35"
    },
    typography: {
      headingFont: "Inter",
      bodyFont: "Inter",
      scale: "default" // default, large, small
    },
    spacing: "default", // default, compact, loose
    borderRadius: "minimal" // minimal, rounded, pill
  },

  // Sections Configuration
  sections: [
    {
      id: "hero",
      type: "hero", // Maps to SectionLibrary component
      variant: "centered-large", // Which variant to use
      order: 0,
      required: true,

      // Section-specific styling overrides
      styling: {
        background: "gradient",
        height: "fullscreen"
      },

      // Fields that users can edit
      fields: [
        {
          id: "title",
          type: "text",
          label: "Main Heading",
          placeholder: "Welcome to my portfolio",
          required: true,
          validation: {
            minLength: 5,
            maxLength: 100
          },
          defaultValue: "Hello, I'm a Designer"
        },
        {
          id: "subtitle",
          type: "text",
          label: "Subheading",
          placeholder: "What you do",
          required: false,
          validation: {
            maxLength: 200
          }
        },
        {
          id: "backgroundImage",
          type: "image",
          label: "Background Image",
          required: false,
          validation: {
            maxSize: 5242880, // 5MB
            allowedFormats: ["jpg", "png", "webp"]
          }
        },
        {
          id: "ctaButton",
          type: "object",
          label: "Call to Action",
          fields: [
            { id: "text", type: "text", defaultValue: "View My Work" },
            { id: "link", type: "url", defaultValue: "#work" }
          ]
        }
      ]
    },

    {
      id: "about",
      type: "about",
      variant: "split-image-text",
      order: 1,
      required: false,

      fields: [
        {
          id: "name",
          type: "text",
          label: "Your Name",
          required: true
        },
        {
          id: "role",
          type: "text",
          label: "Your Role",
          defaultValue: "Designer & Developer"
        },
        {
          id: "bio",
          type: "richtext", // TipTap editor
          label: "Biography",
          placeholder: "Tell us about yourself...",
          required: true,
          validation: {
            minLength: 50,
            maxLength: 1000
          }
        },
        {
          id: "profileImage",
          type: "image",
          label: "Profile Photo",
          required: false
        },
        {
          id: "skills",
          type: "array",
          label: "Skills",
          itemType: "text",
          defaultValue: ["UI Design", "UX Research", "Prototyping"]
        }
      ]
    },

    {
      id: "gallery",
      type: "gallery",
      variant: "masonry-grid",
      order: 2,
      required: false,

      fields: [
        {
          id: "heading",
          type: "text",
          label: "Gallery Title",
          defaultValue: "My Work"
        },
        {
          id: "images",
          type: "array",
          label: "Gallery Images",
          itemType: "object",
          minItems: 1,
          maxItems: 20,
          fields: [
            { id: "image", type: "image", required: true },
            { id: "title", type: "text" },
            { id: "description", type: "textarea" },
            { id: "category", type: "select", options: ["design", "development", "art", "photography"] }
          ]
        }
      ]
    },

    {
      id: "contact",
      type: "contact",
      variant: "centered-form",
      order: 3,
      required: false,

      fields: [
        {
          id: "heading",
          type: "text",
          defaultValue: "Get in Touch"
        },
        {
          id: "email",
          type: "email",
          label: "Your Email",
          required: true
        },
        {
          id: "phone",
          type: "tel",
          label: "Phone Number"
        },
        {
          id: "social",
          type: "object",
          label: "Social Links",
          fields: [
            { id: "twitter", type: "url" },
            { id: "linkedin", type: "url" },
            { id: "github", type: "url" },
            { id: "dribbble", type: "url" }
          ]
        }
      ]
    }
  ]
}
```

### Phase 2: Section Component Library

Create a universal library of section components that work with ANY template:

```javascript
// NEW: src/components/Sections/SectionRegistry.js

import HeroSection from './HeroSection';
import AboutSection from './AboutSection';
import GallerySection from './GallerySection';
import ContactSection from './ContactSection';
import WorkSection from './WorkSection';
import TestimonialsSection from './TestimonialsSection';
import FAQSection from './FAQSection';
import CustomSection from './CustomSection';

export const SECTION_REGISTRY = {
  hero: HeroSection,
  about: AboutSection,
  gallery: GallerySection,
  contact: ContactSection,
  work: WorkSection,
  testimonials: TestimonialsSection,
  faq: FAQSection,
  custom: CustomSection
};

// Each section component follows this interface:
export interface SectionComponent {
  // Props
  schema: SectionSchema;     // Schema for this section
  content: Object;           // User's content data
  styling: Object;           // Styling configuration
  isEditing: boolean;        // Edit mode flag
  onContentChange: Function; // Content update callback

  // Variants - each section supports multiple layouts
  variant: string;  // e.g., "centered-large", "split-image-text", "masonry-grid"
}
```

#### Example: Universal Hero Section

```javascript
// NEW: src/components/Sections/HeroSection/index.jsx

const HeroSection = ({ schema, content, styling, isEditing, onContentChange }) => {
  const variant = schema.variant || 'default';

  // Get the correct variant component
  const VariantComponent = HERO_VARIANTS[variant] || HERO_VARIANTS.default;

  return (
    <VariantComponent
      schema={schema}
      content={content}
      styling={styling}
      isEditing={isEditing}
      onContentChange={onContentChange}
    />
  );
};

// Variant implementations
const HERO_VARIANTS = {
  'centered-large': CenteredLargeHero,
  'split-image-text': SplitImageTextHero,
  'minimal-text': MinimalTextHero,
  'full-screen-video': FullScreenVideoHero,
  'animated-gradient': AnimatedGradientHero,
  // ... 20+ variants
};

// Example variant component
const CenteredLargeHero = ({ schema, content, styling, isEditing, onContentChange }) => {
  return (
    <section className="hero-section" style={getStyling(styling)}>
      {/* Editable Title */}
      <EditableField
        field={schema.fields.find(f => f.id === 'title')}
        value={content.title}
        onChange={(value) => onContentChange('title', value)}
        isEditing={isEditing}
      >
        <h1>{content.title || schema.fields.find(f => f.id === 'title').defaultValue}</h1>
      </EditableField>

      {/* Editable Subtitle */}
      <EditableField
        field={schema.fields.find(f => f.id === 'subtitle')}
        value={content.subtitle}
        onChange={(value) => onContentChange('subtitle', value)}
        isEditing={isEditing}
      >
        <p>{content.subtitle}</p>
      </EditableField>

      {/* Background Image */}
      {content.backgroundImage && (
        <div className="bg-image" style={{ backgroundImage: `url(${content.backgroundImage})` }} />
      )}

      {/* CTA Button */}
      {content.ctaButton && (
        <a href={content.ctaButton.link} className="cta-button">
          {content.ctaButton.text}
        </a>
      )}
    </section>
  );
};
```

### Phase 3: Universal Template Renderer

Replace all individual template components with ONE universal renderer:

```javascript
// NEW: src/components/TemplateRenderer/UniversalTemplateRenderer.jsx

const UniversalTemplateRenderer = ({
  templateSchema,  // Template schema from backend
  content,         // User's content
  styling,         // User's styling overrides
  isEditing,
  onContentChange
}) => {
  // Sort sections by order
  const sortedSections = [...templateSchema.sections].sort((a, b) => a.order - b.order);

  // Merge global styling with section-specific styling
  const getStyleForSection = (section) => ({
    ...templateSchema.styling,
    ...section.styling,
    ...styling // User overrides
  });

  return (
    <div className="template-container" data-template={templateSchema.templateId}>
      {/* Global Styles */}
      <GlobalStyles styling={templateSchema.styling} />

      {/* Render Each Section */}
      {sortedSections.map((sectionSchema) => {
        // Get the section component from registry
        const SectionComponent = SECTION_REGISTRY[sectionSchema.type];

        if (!SectionComponent) {
          console.warn(`Section type "${sectionSchema.type}" not found in registry`);
          return null;
        }

        // Get content for this section
        const sectionContent = content[sectionSchema.id] || {};

        return (
          <SectionComponent
            key={sectionSchema.id}
            schema={sectionSchema}
            content={sectionContent}
            styling={getStyleForSection(sectionSchema)}
            isEditing={isEditing}
            onContentChange={(field, value) =>
              onContentChange(sectionSchema.id, field, value)
            }
          />
        );
      })}
    </div>
  );
};

export default UniversalTemplateRenderer;
```

### Phase 4: Dynamic Form Generator

Auto-generate setup forms from schema:

```javascript
// NEW: src/components/FormGenerator/SchemaFormGenerator.jsx

const SchemaFormGenerator = ({ templateSchema, onComplete }) => {
  const [formData, setFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(0);

  // Generate steps from schema sections
  const steps = templateSchema.sections.map(section => ({
    id: section.id,
    title: section.label || formatLabel(section.id),
    description: section.description || `Configure your ${section.id} section`,
    fields: section.fields,
    required: section.required
  }));

  return (
    <Stepper currentStep={currentStep}>
      {steps.map((step, index) => (
        <Step key={step.id}>
          <DynamicFieldRenderer
            fields={step.fields}
            values={formData[step.id] || {}}
            onChange={(fieldId, value) => {
              setFormData(prev => ({
                ...prev,
                [step.id]: {
                  ...prev[step.id],
                  [fieldId]: value
                }
              }));
            }}
          />
        </Step>
      ))}
    </Stepper>
  );
};

// Dynamic field renderer
const DynamicFieldRenderer = ({ fields, values, onChange }) => {
  return fields.map(field => {
    // Get the appropriate input component for field type
    const InputComponent = FIELD_TYPE_COMPONENTS[field.type] || TextInput;

    return (
      <InputComponent
        key={field.id}
        field={field}
        value={values[field.id]}
        onChange={(value) => onChange(field.id, value)}
      />
    );
  });
};

// Field type component registry
const FIELD_TYPE_COMPONENTS = {
  text: TextInput,
  textarea: TextareaInput,
  richtext: RichTextEditor,
  email: EmailInput,
  url: UrlInput,
  tel: PhoneInput,
  number: NumberInput,
  image: ImageUpload,
  array: ArrayInput,
  object: ObjectInput,
  select: SelectInput,
  checkbox: CheckboxInput,
  radio: RadioInput,
  date: DateInput,
  color: ColorPicker
};
```

### Phase 5: Inline Editing (Wix-Style)

```javascript
// NEW: src/components/InlineEditor/EditableField.jsx

const EditableField = ({
  field,        // Field schema
  value,        // Current value
  onChange,     // Change handler
  isEditing,    // Edit mode
  children      // Display component
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  if (!isEditing) {
    // View mode - just render children
    return children;
  }

  // Edit mode - wrap with click-to-edit
  return (
    <div
      className="editable-field"
      onClick={() => setIsEditing(true)}
      onBlur={() => {
        setIsEditing(false);
        onChange(localValue);
      }}
    >
      {isEditing ? (
        <InlineInput
          type={field.type}
          value={localValue}
          onChange={setLocalValue}
          field={field}
        />
      ) : (
        <div className="editable-field-overlay">
          {children}
          <div className="edit-indicator">
            <PencilIcon />
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## Migration Strategy

### Step 1: Keep Old System Running
- Don't delete existing templates yet
- Run both systems in parallel
- Feature flag for new system

### Step 2: Create Component Library
- Build section components one by one
- Start with Hero, About, Gallery, Contact
- Test each component with mock data

### Step 3: Create Schema for Existing Templates
- Convert Echelon → schema
- Convert Serene → schema
- Validate schemas work with renderer

### Step 4: Test with Real Data
- Load real portfolios
- Render with UniversalTemplateRenderer
- Compare output with old system

### Step 5: Gradual Rollout
- New templates use new system only
- Existing portfolios stay on old system
- Provide migration tool for users

### Step 6: Deprecate Old System
- Once all templates converted
- Remove old template files
- Clean up codebase

---

## Benefits of New System

### For Developers
✅ **No code for new templates** - Just JSON schema
✅ **Reusable components** - Build once, use everywhere
✅ **Easier maintenance** - One renderer vs. many templates
✅ **Type safety** - Schema validation prevents errors
✅ **Faster development** - Create templates in minutes

### For Designers
✅ **Create templates without code** - Use schema editor UI
✅ **Mix and match sections** - Like Lego blocks
✅ **Experiment with layouts** - Change variants easily
✅ **Visual feedback** - See changes instantly

### For Users
✅ **Better editing experience** - Inline editing like Wix
✅ **More template choices** - Easy to add new templates
✅ **Faster loading** - Optimized universal renderer
✅ **Consistent UX** - All templates work the same way

---

## Comparison with Modern Builders

### Wix
- **Schema-driven**: ✅ Templates are JSON schemas
- **Component library**: ✅ Reusable sections
- **Inline editing**: ✅ Click to edit
- **Drag-and-drop**: ⏳ Future phase

### Webflow
- **Visual builder**: ⏳ Future phase
- **CSS control**: ✅ Via styling schema
- **Responsive**: ✅ Built into sections
- **Interactions**: ⏳ Future phase

### Readymag
- **Templates**: ✅ Schema-based
- **Flexibility**: ✅ Section variants
- **Polish**: ✅ Professional sections

---

## Example: Creating a New Template (No Code!)

### Old Way (Current)
```javascript
// 1. Create React component (500+ lines)
src/templates/NewTemplate/NewTemplate.jsx

// 2. Create all section components
src/templates/NewTemplate/sections/Hero.jsx
src/templates/NewTemplate/sections/About.jsx
src/templates/NewTemplate/sections/Gallery.jsx

// 3. Register template
src/templates/index.js

// 4. Create setup form logic
src/utils/templateAnalyzer.js

// 5. Test and debug
// Total: ~3-5 days of work
```

### New Way (Proposed)
```javascript
// 1. Create JSON schema (copy and modify existing)
{
  "templateId": "new-template",
  "name": "New Template",
  "sections": [
    {
      "type": "hero",
      "variant": "split-image-text",  // Pick from library
      "fields": [...] // Define fields
    },
    {
      "type": "gallery",
      "variant": "masonry-grid",  // Pick from library
      "fields": [...]
    }
  ]
}

// 2. Upload to backend
POST /api/templates

// 3. Done! Template works immediately
// Total: ~30 minutes
```

---

## Next Steps

1. **Review this proposal** with team
2. **Prototype Phase 2** (Section Library) - Start with Hero section
3. **Build UniversalTemplateRenderer** (Phase 3)
4. **Test with one template** (Echelon)
5. **Iterate and expand**

---

## Questions to Address

1. **Performance**: Will rendering from schema be slower?
   - *Answer*: No, React optimizes well. Can memoize section components.

2. **Flexibility**: What if we need custom logic?
   - *Answer*: Sections can have "custom" type with code injection points

3. **Backward compatibility**: What about existing portfolios?
   - *Answer*: Migration tool + parallel systems during transition

4. **Learning curve**: Is this too complex?
   - *Answer*: Simpler for developers. Schema is self-documenting.

---

## Conclusion

This refactor transforms Aurea from a **code-heavy** template system to a **schema-driven platform** like modern website builders.

**Key Principle**: Templates should be data, not code.

Once implemented, anyone can create templates using schemas, designers can build visually, and users get a better editing experience. This is the foundation for scaling to hundreds of templates without scaling complexity.

