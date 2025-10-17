# Template Structure Comparison: Echelon vs Serene

This document compares the structure and organization of the Echelon and Serene templates to show consistency and best practices.

## File Structure Comparison

### Echelon Template

```
Echelon/
├── EchelonTemplate.jsx         # Main template component
├── index.js                    # Exports
├── README.md                   # Documentation
├── Echelon.json               # Configuration
├── components/                 # Reusable components
│   ├── SwissComponents.jsx
│   ├── SwissDecorations.jsx
│   ├── SwissGrid.jsx
│   └── SwissTypography.jsx
└── sections/                   # Section components
    ├── EchelonHero.jsx
    ├── EchelonAbout.jsx
    ├── EchelonWork.jsx
    ├── EchelonGallery.jsx
    └── EchelonContact.jsx
```

### Serene Template

```
Serene/
├── SereneTemplate.jsx          # Main template component
├── index.js                    # Exports
├── README.md                   # Documentation
├── Serene.json                # Configuration
└── sections/                   # Section components
    ├── SereneHero.jsx
    ├── SereneAbout.jsx
    ├── SereneGallery.jsx
    └── SereneContact.jsx
```

## Common Patterns

### 1. Main Template Component Structure

Both templates follow the same pattern:

```jsx
const TemplateComponent = ({
  content = {},
  isEditing = false,
  onContentChange,
  className = "",
  portfolioId = null,
}) => {
  // State management
  const [isScrolled, setIsScrolled] = useState(false);

  // Content change handler
  const handleSectionContentChange = (section, field, value) => {
    if (onContentChange) {
      onContentChange({
        ...content,
        [section]: {
          ...content[section],
          [field]: value,
        },
      });
    }
  };

  return (
    <div className={className}>
      {/* Navigation */}
      {/* Sections */}
      {/* Styles */}
    </div>
  );
};
```

### 2. Section Component Structure

Both templates use the same section pattern:

```jsx
const SectionComponent = ({ content, isEditing = false, onContentChange }) => {
  const { field1, field2, field3 } = content;

  const handleFieldChange = (field, value) => {
    if (onContentChange) {
      onContentChange("sectionName", field, value);
    }
  };

  const handleKeyDown = (e, field, value) => {
    // Keyboard shortcuts
  };

  return <section id="sectionName">{/* Section content */}</section>;
};
```

### 3. Image Upload Pattern

Both templates use the same image upload approach:

```jsx
const handleImageUpload = async (file) => {
  if (!file) return;

  // Validation
  if (!file.type.startsWith("image/")) {
    alert("Please select an image file");
    return;
  }

  if (file.size > 25 * 1024 * 1024) {
    alert("File size must be less than 25MB");
    return;
  }

  setIsUploading(true);

  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/upload/single`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("aurea_token") || ""}`,
        },
      }
    );

    // Handle response
    const result = await response.json();
    if (result.success && result.data?.url) {
      handleFieldChange("image", result.data.url);
    }
  } catch (error) {
    console.error("Upload error:", error);
    alert(`Failed to upload image: ${error.message}`);
  } finally {
    setIsUploading(false);
  }
};
```

### 4. Keyboard Shortcuts Pattern

Both templates implement the same keyboard shortcuts:

```jsx
const handleKeyDown = (e, field, value) => {
  // ESC - cancel editing without saving
  if (e.key === "Escape") {
    e.preventDefault();
    e.target.blur();
    return;
  }

  // Enter - save and exit (Shift+Enter for new line in textarea)
  if (e.key === "Enter") {
    const isTextarea = e.target.tagName.toLowerCase() === "textarea";

    if (!isTextarea || !e.shiftKey) {
      e.preventDefault();
      handleFieldChange(field, value);
      e.target.blur();
    }
  }

  // Ctrl+S / Cmd+S - save without exiting
  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
    e.preventDefault();
    handleFieldChange(field, value);
  }
};
```

### 5. Editing Mode Pattern

Both templates use the same conditional rendering for editing:

```jsx
{
  isEditing ? (
    <input
      type="text"
      value={fieldValue}
      onChange={(e) => handleFieldChange("field", e.target.value)}
      onKeyDown={(e) => handleKeyDown(e, "field", e.target.value)}
      onBlur={(e) => handleFieldChange("field", e.target.value)}
      style={
        {
          /* editing styles */
        }
      }
    />
  ) : (
    <div>{fieldValue}</div>
  );
}
```

## Template Registration in index.js

Both templates are registered in `/src/templates/index.js` with:

- Unique ID
- Name and description
- Category
- Preview image
- Component reference
- Structure definition
- Default content
- Styling configuration
- Responsive breakpoints

## Props Interface

Both templates accept the same props:

| Prop            | Type     | Required | Description                  |
| --------------- | -------- | -------- | ---------------------------- |
| content         | object   | Yes      | Section content data         |
| isEditing       | boolean  | No       | Enable/disable editing mode  |
| onContentChange | function | No       | Callback for content updates |
| className       | string   | No       | Additional CSS classes       |
| portfolioId     | string   | No       | Portfolio identifier         |

## Shared Features

1. **Inline Editing**: Text fields editable in place
2. **Image Upload**: Cloudinary integration
3. **Keyboard Shortcuts**: ESC, Enter, Ctrl+S
4. **Responsive Design**: Mobile-first approach
5. **Smooth Scrolling**: Navigation scroll behavior
6. **Loading States**: Visual feedback during uploads
7. **Accessibility**: ARIA labels and semantic HTML
8. **Performance**: Lazy loading images

## Key Differences

### Design Philosophy

- **Echelon**: Swiss/International Typographic Style (grid-based, precise, minimal)
- **Serene**: Botanical/Elegant (organic, soft, nature-inspired)

### Section Variations

- **Echelon**: Has Work section with case studies
- **Serene**: Has simplified Gallery with prices

### Component Organization

- **Echelon**: Additional components folder for Swiss design elements
- **Serene**: More streamlined with sections only

### Typography

- **Echelon**: Neue Haas Grotesk + IBM Plex Mono (sans-serif)
- **Serene**: Crimson Text (serif)

### Color Schemes

- **Echelon**: Black/White/Red (high contrast)
- **Serene**: Warm earth tones (soft contrast)

## Best Practices Demonstrated

1. ✅ Consistent file naming (TemplateName + SectionName)
2. ✅ Reusable section components
3. ✅ Centralized content management
4. ✅ Proper prop types and defaults
5. ✅ Error handling in uploads
6. ✅ Accessibility considerations
7. ✅ Responsive design patterns
8. ✅ Performance optimizations
9. ✅ Documentation (README.md)
10. ✅ Configuration files (JSON)

## Migration from TypeScript to JSX

The Serene template was converted from Next.js/TypeScript to React/JSX following the Echelon pattern:

### Changes Made:

1. Converted `.tsx` files to `.jsx`
2. Removed TypeScript type annotations
3. Removed Next.js specific imports (`next/font`, `next/script`)
4. Updated component structure to match Echelon
5. Added sections folder organization
6. Implemented inline editing functionality
7. Added image upload capability
8. Created proper exports in index.js

### Structure Improvements:

- Removed `app/` folder (Next.js specific)
- Removed `components/ui/` folder (shadcn/ui dependency)
- Removed `lib/` folder (utility functions)
- Created dedicated `sections/` folder
- Simplified to core portfolio sections

## Testing Checklist

When creating new templates, verify:

- [ ] Main template component renders
- [ ] All sections display correctly
- [ ] Editing mode toggles properly
- [ ] Content changes save correctly
- [ ] Image uploads work
- [ ] Keyboard shortcuts function
- [ ] Responsive design works
- [ ] Navigation scrolls smoothly
- [ ] No console errors
- [ ] Template registered in index.js
- [ ] Preview image set
- [ ] Default content provided
- [ ] Documentation complete

## Conclusion

Both Echelon and Serene templates follow a consistent, maintainable structure that:

- Separates concerns (template, sections, components)
- Provides reusable patterns
- Supports editing and customization
- Maintains performance
- Ensures accessibility
- Scales well for future templates
