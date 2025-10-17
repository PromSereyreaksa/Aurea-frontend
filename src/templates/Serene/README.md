# Serene Template

A botanical and elegant portfolio template with soft, organic, nature-inspired design.

## Overview

The Serene template is designed for artists, designers, and creatives who want to showcase their work with an elegant, nature-inspired aesthetic. It features a soft color palette, serif typography, and asymmetric grid layouts.

## File Structure

```
Serene/
├── SereneTemplate.jsx           # Main template component
├── index.js                     # Template exports
├── sections/                    # Individual section components
│   ├── SereneHero.jsx          # Hero section with featured images
│   ├── SereneAbout.jsx         # About section with portrait
│   ├── SereneGallery.jsx       # Asymmetric gallery grid
│   └── SereneContact.jsx       # Contact section with footer
└── README.md                   # This file
```

## Template Structure

### 1. SereneTemplate.jsx

Main template wrapper that:

- Manages overall layout and styling
- Handles section content changes
- Provides sticky header navigation
- Includes global typography styles

### 2. Hero Section (SereneHero.jsx)

- Grid-based layout with description and featured images
- Editable title, subtitle, and descriptions
- 3 featured image placeholders
- Responsive design

### 3. About Section (SereneAbout.jsx)

- Two-column layout with portrait and bio
- Editable fields: name, role, bio, location, experience
- Image upload functionality
- Metadata display

### 4. Gallery Section (SereneGallery.jsx)

- Asymmetric grid layout with varying image sizes
- Editable images with captions and prices
- Add/remove image functionality
- Hover effects on images
- Image upload support

### 5. Contact Section (SereneContact.jsx)

- Contact information display
- Editable fields: heading, text, email, phone, instagram
- Call-to-action button
- Footer copyright

## Design System

### Colors

- Primary: `#403f33` (Dark sage)
- Secondary: `#6c6258` (Medium warm gray)
- Accent: `#c4c3bd` (Light sage)
- Background: `#fafbfb` (Warm white)
- Border: `#d4d2cd` (Light border)

### Typography

- Font Family: 'Crimson Text', serif
- Sizes: 11px - 52px (responsive with clamp)
- Weights: 400 (regular), 600 (semibold), 700 (bold)

### Grid System

- 12-column grid
- Gutter: 24px
- Margin: 32px
- Max width: 1280px

## Features

### Editing Mode

When `isEditing={true}`:

- All text fields become editable
- Images can be uploaded via click
- Add/remove gallery images
- Visual indicators for editable areas

### Keyboard Shortcuts

- `ESC`: Cancel editing without saving
- `Enter`: Save and exit editing
- `Shift+Enter` (textarea): New line
- `Ctrl+S` / `Cmd+S`: Save without exiting

### Image Upload

- Cloudinary integration
- File size limit: 25MB
- Supported formats: All image types
- Upload progress indicator

## Usage

```jsx
import { SereneTemplate } from "./templates/Serene";

<SereneTemplate
  content={portfolioContent}
  isEditing={true}
  onContentChange={handleContentChange}
  portfolioId={portfolioId}
/>;
```

## Props

- `content` (object): Section content data
- `isEditing` (boolean): Enable/disable editing mode
- `onContentChange` (function): Callback for content updates
- `className` (string): Additional CSS classes
- `portfolioId` (string): Portfolio identifier

## Responsive Breakpoints

- Mobile: 640px
- Tablet: 768px
- Desktop: 1024px
- Wide: 1280px

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- All sections support smooth scroll navigation
- Images lazy load for performance
- Accessibility features included
- Reduced motion support
- High contrast mode support
