# Template Schema Auto-Sync Guide

This guide explains how the automatic template schema synchronization works in Aurea.

## Overview

The frontend now automatically syncs template definitions to the backend whenever a developer creates or selects a template. This eliminates the need for backend developers to manually create template schemas.

## How It Works

### 1. **Automatic Sync on Portfolio Creation**

When a user selects a template to create a new portfolio:

```javascript
// In PortfolioBuilderPage.jsx
const handleTemplateSelect = async (template) => {
  // Automatically syncs the template schema to backend
  await templateApi.syncTemplateSchema(template);

  // Then creates the portfolio
  await portfolioStore.createPortfolio(initialPortfolioData);
};
```

The sync happens **before** portfolio creation, ensuring the backend always has the latest template definition.

### 2. **Auto-Migration on App Startup (Development Only)**

In development mode, the app automatically checks and syncs templates on startup:

```javascript
// In App.jsx
useEffect(() => {
  if (import.meta.env.DEV) {
    autoMigrateIfNeeded();
  }
}, []);
```

This ensures all templates are synced during development without manual intervention.

### 3. **Manual Migration via Console**

Developers can manually trigger migrations using the browser console:

```javascript
// Sync all templates
await window.templateMigration.migrateAll();

// Sync a specific template
await window.templateMigration.migrateSingle('echolon');

// Check migration status
await window.templateMigration.checkStatus();

// Auto-migrate if needed
await window.templateMigration.autoMigrate();
```

## Creating a New Template

### Step 1: Define Template in Frontend

Add your template definition to `src/templates/index.js`:

```javascript
export const templates = {
  'my-new-template': {
    id: 'my-new-template',
    name: 'My New Template',
    description: 'Description of the template',
    category: 'creative',
    preview: 'https://example.com/preview.jpg',

    structure: {
      hero: {
        type: 'hero',
        layout: 'centered',
        editable: ['title', 'subtitle']
      },
      about: {
        type: 'about',
        layout: 'two_column',
        editable: ['name', 'bio', 'image']
      }
    },

    defaultContent: {
      hero: {
        title: 'Welcome',
        subtitle: 'This is my portfolio'
      },
      about: {
        name: 'Your Name',
        bio: 'Your bio here',
        image: ''
      }
    },

    styling: {
      colors: {
        primary: '#000000',
        secondary: '#666666',
        accent: '#FF5733'
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter'
      }
    }
  }
};
```

### Step 2: Create Template Component

Create your template component in `src/templates/MyNewTemplate/`:

```javascript
// MyNewTemplate.jsx
import React from 'react';

const MyNewTemplate = ({ content, styling, isEditing }) => {
  return (
    <div>
      {/* Your template JSX */}
    </div>
  );
};

export default MyNewTemplate;
```

### Step 3: Register Component

Update `src/lib/templateAdapter.js` to register your component:

```javascript
import MyNewTemplate from '../templates/MyNewTemplate/MyNewTemplate';

const templateComponents = {
  'echelon': EchelonTemplate,
  'serene': SereneTemplate,
  'my-new-template': MyNewTemplate, // Add your template
};
```

### Step 4: That's It!

The template will automatically sync to the backend when:
- The app starts in development mode
- A user selects your template
- You manually run `window.templateMigration.migrateAll()`

## Backend Schema Format

The frontend automatically converts your template definition to the backend schema format:

```javascript
{
  templateId: 'my-new-template',
  name: 'My New Template',
  description: 'Description of the template',
  category: 'creative',
  slug: 'my-new-template',
  thumbnail: 'https://example.com/preview.jpg',

  schema: {
    sections: [
      {
        id: 'hero',
        name: 'Hero',
        description: 'Hero section',
        fields: [
          {
            id: 'title',
            label: 'Title',
            type: 'text',
            placeholder: 'Welcome',
            required: false
          },
          {
            id: 'subtitle',
            label: 'Subtitle',
            type: 'text',
            placeholder: 'This is my portfolio',
            required: false
          }
        ],
        required: true,
        order: 0
      }
    ],
    styling: {
      colorScheme: { /* colors */ },
      typography: {
        headingFont: 'Inter',
        bodyFont: 'Inter',
        scale: 'default'
      },
      spacing: 'default'
    }
  },

  isActive: true,
  isPremium: false,
  version: '1.0.0'
}
```

## API Endpoints Used

### POST /api/templates
Creates a new template in the database.

### PUT /api/templates/:id
Updates an existing template.

### GET /api/templates/:id
Retrieves a template by ID.

### GET /api/templates
Lists all templates.

## Migration Behavior

### When Template Exists
- Compares template ID with existing backend templates
- If found, **updates** the existing template with new schema
- Preserves backend-specific fields (createdAt, etc.)

### When Template Doesn't Exist
- Creates a new template in the database
- Generates schema from frontend definition
- Sets default values for backend fields

## Troubleshooting

### Template Not Syncing

1. Check browser console for errors
2. Verify template is properly defined in `src/templates/index.js`
3. Run manual sync: `window.templateMigration.migrateSingle('template-id')`

### Schema Mismatch

If the backend schema doesn't match your template:

```javascript
// Force re-sync
await window.templateMigration.migrateSingle('template-id');
```

### Check Migration Status

```javascript
const status = await window.templateMigration.checkStatus();
console.log(status);
// Shows: frontendTemplates, backendTemplates, missingInBackend, etc.
```

## Best Practices

1. **Always define templates in frontend first** - The frontend is the source of truth
2. **Test in development** - Auto-migration runs in dev mode only
3. **Version your templates** - Use semantic versioning for template updates
4. **Document changes** - Keep track of template schema changes
5. **Sync before releases** - Ensure all templates are synced before deploying

## Production Deployment

In production, templates won't auto-sync on startup. You should:

1. Sync all templates during development
2. Verify templates exist in backend before deploying
3. Use manual migration if needed: `window.templateMigration.migrateAll()`

## Example: Updating an Existing Template

```javascript
// 1. Update template definition in src/templates/index.js
export const templates = {
  'echolon': {
    // ... updated structure
    version: '1.1.0' // Bump version
  }
};

// 2. Either wait for auto-sync or manually sync
await window.templateMigration.migrateSingle('echolon');

// 3. The backend will be updated automatically
```

## Summary

- ✅ Templates auto-sync to backend on creation
- ✅ No manual schema creation needed
- ✅ Old templates automatically updated
- ✅ Console utilities for manual control
- ✅ Works in both development and production
- ✅ Frontend is the source of truth

The backend no longer needs to manually create template schemas - it happens automatically!
