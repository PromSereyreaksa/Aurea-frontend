# CLAUDE.md - Frontend Development Guide

This file provides comprehensive guidance to Claude Code (claude.ai/code) when working with this React frontend repository.

## Project Overview

**AUREA Frontend** is a sophisticated React 19 application for creating and managing professional portfolio websites. It integrates with the AUREA Backend API to provide a complete portfolio builder experience.

**Core Purpose**: Allow users to build, customize, and publish professional portfolios using multiple templates without coding.

**Technology Stack**: React 19.1.1, Vite 7.1.2, Zustand 5.0.8, Tailwind CSS 4.1.13, React Router 7.9.0

## Quick Development Commands

```bash
# Install & start development
npm install
npm run dev                    # Runs on http://localhost:5173

# Build & preview
npm run build                  # Production build (output: dist/)
npm run preview               # Preview production build

# Code quality
npm run lint                  # Check ESLint
npm run lint -- --fix        # Auto-fix ESLint issues

# Clean cache (if issues)
rm -rf .vite dist node_modules package-lock.json
npm install && npm run dev
```

## Project Architecture

### High-Level Data Flow

```
User UI (React Components)
    ↓
Zustand State Management (Global State)
    ↓
API Layer (Axios with auth interceptors)
    ↓
Backend API (Express.js on port 5000)
    ↓
Database (MongoDB)
```

### Directory Structure - Detailed

```
src/
├── pages/                          # Page-level components (lazy-loaded)
│   ├── HomePage.jsx                # Landing page (eagerly loaded)
│   ├── LoginPage.jsx               # User authentication
│   ├── SignupPage.jsx              # User registration
│   ├── DashboardPage.jsx           # Portfolio list dashboard
│   ├── DashboardNew.jsx            # Redesigned dashboard
│   ├── PortfolioBuilderPage.jsx    # Main portfolio editor
│   ├── AccountNew.jsx              # Account management
│   ├── *PreviewPage.jsx            # Template preview pages (5 templates)
│   └── ...other pages
│
├── components/
│   ├── PortfolioBuilder/           # Portfolio editing UI
│   │   ├── SchemaFormGenerator.jsx  # Dynamic form from JSON schema
│   │   ├── TemplateSelector.jsx     # Template selection UI
│   │   ├── TemplatePreview.jsx      # Live template preview
│   │   ├── ImageUpload.jsx          # Image upload handling
│   │   ├── MultiImageUpload.jsx     # Batch image upload
│   │   ├── ImageUploadModal.jsx     # Upload UI modal
│   │   ├── PDFExport.jsx            # PDF generation (frontend)
│   │   ├── PDFExportBackend.jsx     # PDF generation (backend)
│   │   ├── PublishModal.jsx         # Publishing UI
│   │   ├── SectionEditor.jsx        # Individual section editing
│   │   ├── DynamicStepForm.jsx      # Multi-step form handler
│   │   ├── ValidationDisplay.jsx    # Validation messages
│   │   ├── EditorNavbar.jsx         # Editor top navigation
│   │   ├── DesignToolsPanel.jsx     # Design customization
│   │   ├── TemplateSpecificSetup.jsx # Template-specific config
│   │   └── ...other builder components
│   │
│   ├── Dashboard/                  # Dashboard components
│   │   ├── PortfolioCard.jsx       # Portfolio list item
│   │   └── ...dashboard elements
│   │
│   ├── DashboardNew/               # New dashboard redesign
│   │   └── ...new dashboard components
│   │
│   ├── LandingPage/                # Landing page sections
│   │   ├── ModernHero.jsx          # Hero section
│   │   ├── FeaturesGrid.jsx        # Features section
│   │   └── ...other sections
│   │
│   ├── Shared/                     # Reusable components
│   │   ├── Navbar.jsx              # Navigation bar
│   │   ├── Footer.jsx              # Footer component
│   │   ├── LoadingSpinner.jsx      # Loading indicator
│   │   └── ...shared UI components
│   │
│   └── Templates/                  # Template-specific components
│       └── ...template components
│
├── templates/                      # Portfolio template designs
│   ├── Echelon/                    # Swiss minimalist design
│   │   ├── EchelonTemplate.jsx     # Main template component
│   │   ├── EchelonPreviewPage.jsx  # Preview page
│   │   └── ...sections
│   │
│   ├── Serene/                     # Botanical elegant design
│   │   ├── SereneTemplate.jsx      # Main template
│   │   ├── SerenePreviewPage.jsx   # Preview page
│   │   └── ...sections
│   │
│   ├── Chic/                       # Modern sophisticated
│   │   └── ...Chic template files
│   │
│   ├── BoldFolio/                  # Bold statement design
│   │   └── ...BoldFolio template files
│   │
│   └── Shared/                     # Shared template utilities
│       ├── AnimationTypes.jsx      # Reusable animations
│       ├── BackgroundTypes.jsx     # Background patterns
│       └── ...shared template logic
│
├── stores/                         # Zustand state management
│   ├── authStore.js                # Auth & user session
│   ├── portfolioStore.js           # Portfolio CRUD operations
│   ├── templateStore.js            # Template metadata & selection
│   └── uploadStore.js              # Image upload progress
│
├── lib/                            # API layer & utilities
│   ├── baseApi.js                  # Axios instance with interceptors
│   ├── api.js                      # API exports
│   ├── authApi.js                  # Auth endpoints
│   ├── portfolioApi.js             # Portfolio endpoints
│   ├── templateApi.js              # Template endpoints
│   ├── caseStudyApi.js             # Case study endpoints
│   ├── uploadApi.js                # Image upload endpoints
│   ├── templateAdapter.js          # Template data adapter
│   └── cloudinaryDirectUpload.js  # Direct Cloudinary upload
│
├── hooks/                          # Custom React hooks
│   ├── usePortfolioBuilder.js      # Portfolio builder state
│   ├── useImageUpload.js           # Image upload handler
│   ├── useTemplateChange.js        # Template switching logic
│   └── useTemplateValidation.js    # Schema validation
│
├── utils/                          # Utility functions
│   ├── templateMigration.js        # Template version migration
│   ├── animationConfig.js          # GSAP animation config
│   └── ...other utilities
│
├── styles/                         # Global CSS
│   └── ...global styles
│
├── assets/                         # Static files
│   └── ...images, fonts, etc
│
├── App.jsx                         # Root component (routing)
├── main.jsx                        # Entry point
├── index.css                       # Global styles
├── App.css                         # App styles
└── vite.config.js                  # Vite config
```

## State Management - Zustand Pattern

### authStore.js - Authentication & User Session

**State Properties**:
```javascript
{
  user: null,              // Current user object
  token: null,             // JWT token
  isAuthenticated: false,  // Auth status
  loading: false,          // Loading state
}
```

**Key Actions**:
- `login(email, password)` - User login
- `signup(userData)` - User registration
- `logout()` - Clear session
- `checkToken()` - Validate token on app load
- `setUser(userData)` - Update user

**Persistence**: Saves to `localStorage` with key `"aurea-auth-storage"`

**Usage**:
```javascript
const { user, isAuthenticated, login, logout } = useAuthStore();
```

### portfolioStore.js - Portfolio CRUD

**State Properties**:
```javascript
{
  portfolios: [],          // User's portfolios
  currentPortfolio: null,  // Selected portfolio
  loading: false,          // Fetch loading
  error: null,             // Error state
}
```

**Key Actions**:
- `fetchPortfolios()` - Get user's portfolios
- `createPortfolio(data)` - Create new
- `updatePortfolio(id, data)` - Update existing
- `deletePortfolio(id)` - Delete portfolio
- `setCurrentPortfolio(portfolio)` - Select portfolio

**Usage**:
```javascript
const { portfolios, currentPortfolio, fetchPortfolios } = usePortfolioStore();
```

### templateStore.js - Template Metadata

**State Properties**:
```javascript
{
  templates: [],           // Available templates
  selectedTemplate: null,  // Selected template
  loading: false,          // Loading state
}
```

**Key Actions**:
- `fetchTemplates()` - Get all templates
- `selectTemplate(id)` - Select template
- `getTemplateById(id)` - Find template

**Caching**: Stores templates to reduce API calls

### uploadStore.js - Upload Progress

**State Properties**:
```javascript
{
  uploadProgress: 0,       // 0-100 percentage
  uploadedFiles: [],       // Successfully uploaded
  currentUpload: null,     // Current file being uploaded
}
```

**Usage**: Track upload progress in image upload components

## API Layer - baseApi.js & Endpoints

### baseApi.js Configuration

```javascript
// Automatically configured with:
- Base URL from VITE_API_BASE_URL
- Timeout (VITE_API_TIMEOUT default: 10000ms)
- Bearer token from authStore
- Request/response interceptors
```

**Auto-adds JWT token** to all requests:
```javascript
headers: {
  Authorization: `Bearer ${token}`
}
```

### API Endpoints by File

**authApi.js**:
- `login(email, password)` → POST /api/auth/login
- `signup(userData)` → POST /api/auth/signup
- `getProfile()` → GET /api/auth/me
- `updateProfile(data)` → PUT /api/auth/me

**portfolioApi.js**:
- `getUserPortfolios()` → GET /api/portfolios/user/me
- `createPortfolio(data)` → POST /api/portfolios
- `updatePortfolio(id, data)` → PUT /api/portfolios/{id}
- `deletePortfolio(id)` → DELETE /api/portfolios/{id}
- `publishPortfolio(id)` → PUT /api/portfolios/{id}/publish
- `unpublishPortfolio(id)` → PUT /api/portfolios/{id}/unpublish

**templateApi.js**:
- `getTemplates()` → GET /api/templates
- `getTemplate(id)` → GET /api/templates/{id}
- `getTemplateSchema(id)` → GET /api/templates/{id}/schema
- `validateContent(id, content)` → POST /api/templates/{id}/validate

**uploadApi.js**:
- `uploadImage(file)` → POST /api/upload/single
- `uploadMultiple(files)` → POST /api/upload/multiple

**caseStudyApi.js**:
- `createCaseStudy(data)` → POST /api/case-studies
- `updateCaseStudy(id, data)` → PUT /api/case-studies/{id}
- `getCaseStudy(id)` → GET /api/case-studies/{id}
- `deleteCaseStudy(id)` → DELETE /api/case-studies/{id}

### API Error Handling Pattern

```javascript
// In Zustand actions or components
try {
  const result = await api.someCall();
  // Update state
} catch (error) {
  const message = error.response?.data?.message || 'An error occurred';
  console.error('Error:', message);
  // Show toast notification
  toast.error(message);
}
```

## Authentication & Protected Routes

### ProtectedRoute Component

Located in `src/components/PortfolioBuilder/ProtectedRoute.jsx`

**Usage**:
```jsx
<Route
  path="/portfolio-builder/:id"
  element={
    <ProtectedRoute>
      <PortfolioBuilderPage />
    </ProtectedRoute>
  }
/>
```

**Behavior**:
- Checks `authStore.isAuthenticated`
- Redirects to `/login` if not authenticated
- Shows loading spinner while checking

### JWT Token Flow

1. User logs in via `/login` page
2. Backend returns JWT token
3. `authStore` saves token to localStorage
4. `baseApi` automatically adds to all requests
5. Token validated on each app startup
6. Auto-logout if token expired

## Component Development Guidelines

### 1. Smart vs Presentational Components

**Smart Components** (containers):
- Connect to Zustand stores
- Handle data fetching
- Manage component state
- Usually page-level or complex

```jsx
// pages/PortfolioBuilderPage.jsx
export default function PortfolioBuilderPage() {
  const { currentPortfolio, updatePortfolio } = usePortfolioStore();

  return <PortfolioBuilder portfolio={currentPortfolio} />;
}
```

**Presentational Components** (UI-focused):
- Receive data via props
- No store connections
- Reusable across app
- Focus on rendering

```jsx
// components/PortfolioBuilder/TemplateSelector.jsx
export default function TemplateSelector({ templates, onSelect }) {
  return (
    <div>
      {templates.map(t => (
        <div key={t.id} onClick={() => onSelect(t)}>
          {t.name}
        </div>
      ))}
    </div>
  );
}
```

### 2. Component Structure Pattern

```jsx
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import SomeComponent from '@/components/SomeComponent';

export default function MyComponent({ prop1, prop2 }) {
  // 1. Store hooks
  const { user } = useAuthStore();

  // 2. Local state
  const [localState, setLocalState] = useState(null);

  // 3. Effects
  useEffect(() => {
    // Load data on mount
  }, []);

  // 4. Handlers
  const handleClick = () => {
    // Handle event
  };

  // 5. Render
  return (
    <div className="...">
      <SomeComponent />
    </div>
  );
}
```

### 3. Styling with Tailwind

✅ **Preferred**: Tailwind utility classes
```jsx
<div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
  <h1 className="text-2xl font-bold text-gray-800">Title</h1>
</div>
```

✅ **For complex styles**: CSS modules
```jsx
// Component.jsx
import styles from './Component.module.css';

export default function Component() {
  return <div className={styles.container}>...</div>;
}
```

❌ **Avoid**: Inline styles
```jsx
// Don't do this
<div style={{ backgroundColor: 'white', padding: '16px' }}>
```

### 4. Form Handling with React Hook Form

```jsx
import { useForm } from 'react-hook-form';

export default function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await api.submit(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('name', { required: 'Name required' })}
      />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Code Patterns & Best Practices

### 1. State Management Decision Tree

**Use Zustand for**:
- Authentication state
- User profile data
- Portfolio data across multiple pages
- Data that persists across page navigations

**Use React State for**:
- Form input values
- Modal open/close state
- Temporary UI state
- Data only needed in one component

```javascript
// ✅ Zustand - shared across app
const { user, logout } = useAuthStore();

// ✅ React state - component specific
const [isModalOpen, setIsModalOpen] = useState(false);
```

### 2. Async/Await Pattern

```javascript
// ✅ Good
const handleSave = async () => {
  setLoading(true);
  try {
    const result = await portfolioApi.updatePortfolio(id, data);
    toast.success('Saved!');
  } catch (error) {
    toast.error(error.response?.data?.message || 'Error');
  } finally {
    setLoading(false);
  }
};
```

### 3. useEffect Dependencies

```javascript
// ✅ Run on component mount only
useEffect(() => {
  fetchData();
}, []);

// ✅ Run when ID changes
useEffect(() => {
  fetchData(id);
}, [id]);

// ✅ Run on every render (avoid usually)
useEffect(() => {
  // code
});
```

### 4. Conditional Rendering

```jsx
// ✅ Good
{isLoading ? (
  <LoadingSpinner />
) : portfolio ? (
  <PortfolioCard portfolio={portfolio} />
) : (
  <EmptyState />
)}

// ❌ Avoid
{portfolio && portfolio.title && portfolio.id ? (
  <PortfolioCard />
) : null}
```

### 5. Key in Lists

```jsx
// ✅ Use unique ID
{portfolios.map(p => (
  <PortfolioCard key={p._id} portfolio={p} />
))}

// ❌ Never use index
{portfolios.map((p, index) => (
  <PortfolioCard key={index} portfolio={p} />
))}
```

## Routing Configuration

### App.jsx Routing Structure

**Eagerly Loaded** (critical):
- HomePage - Landing page

**Lazy Loaded** (non-critical):
- All other pages
- All template preview pages
- Dashboard pages

**Protected Routes**:
- `/portfolio-builder/:id`
- `/dashboard`
- Account pages

### Adding New Routes

1. Create page component in `src/pages/`
2. Lazy load in App.jsx
3. Add route to Routes
4. Wrap with `<ProtectedRoute>` if needed

```jsx
// In App.jsx
const MyNewPage = lazy(() => import('./pages/MyNewPage'));

// In Routes
<Route
  path="/my-page"
  element={
    <ProtectedRoute>
      <MyNewPage />
    </ProtectedRoute>
  }
/>
```

## Environment Variables

**.env.example template**:
```bash
# Backend API
VITE_API_BASE_URL=http://localhost:5000
VITE_API_TIMEOUT=10000

# Cloudinary (image uploads)
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

**Important**: `.env` is gitignored. Create local `.env` file after cloning.

## Performance Optimization

### 1. Code Splitting

All pages except HomePage are lazy-loaded:
```javascript
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
```

This creates separate chunks loaded on demand.

### 2. Image Optimization

Use Cloudinary for images:
- Automatic compression
- Format optimization (webp)
- Responsive images

### 3. React Optimization

```jsx
// Memoize expensive components
const ExpensiveComponent = memo(({ data }) => (
  // Component
));

// Memoize expensive calculations
const filtered = useMemo(
  () => items.filter(i => i.category === cat),
  [items, cat]
);

// Use useCallback for event handlers passed to children
const handleClick = useCallback(() => {
  // Handle
}, [dependencies]);
```

### 4. Bundle Analysis

```bash
# Check which dependencies add size
npm ls --depth=0

# Look for unused imports before committing
```

## Template System

### Adding a New Template

1. Create folder: `src/templates/TemplateName/`
2. Create main component: `TemplateName.jsx`
3. Create preview page: `TemplateNamePreviewPage.jsx`
4. Create schema: JSON schema for form validation
5. Register in backend template registry

### Schema Structure

Templates use JSON schema to define editable fields:
```javascript
{
  "type": "object",
  "properties": {
    "hero": {
      "type": "object",
      "properties": {
        "title": { "type": "string" },
        "subtitle": { "type": "string" }
      }
    }
  }
}
```

Forms are generated from schema using `SchemaFormGenerator.jsx`

## Testing

### Manual Testing Checklist

- [ ] **Auth Flow**
  - Sign up creates account
  - Login with valid credentials
  - Login rejects invalid credentials
  - Logout clears session

- [ ] **Portfolio CRUD**
  - Create portfolio
  - Edit portfolio
  - Delete portfolio
  - Switch templates

- [ ] **Publishing**
  - Preview works
  - Vercel deploy works
  - Subdomain deploy works
  - Can access published portfolio

- [ ] **Responsive**
  - Mobile (320px)
  - Tablet (768px)
  - Desktop (1920px)

### Development Testing

```bash
# Check for console errors
npm run dev
# Open browser console (F12)

# Lint check
npm run lint

# Fix issues automatically
npm run lint -- --fix
```

## Common Patterns & Gotchas

### localStorage Access

```javascript
// ✅ Safe - checks if localStorage available
if (typeof window !== 'undefined') {
  localStorage.setItem('key', 'value');
}

// ❌ Unsafe in SSR
localStorage.setItem('key', 'value');
```

### Async State Updates

```javascript
// ❌ State might not update in time
setState(value);
console.log(state); // old value

// ✅ Use callback or effect
useEffect(() => {
  console.log(state); // updated value
}, [state]);
```

### Component Re-renders

```javascript
// ⚠️ Object literals create new reference
<Component style={{ color: 'red' }} /> // Re-renders every time

// ✅ Use className instead
<Component className="text-red-500" /> // Stable reference
```

## Debugging Tips

### Check Store State
```javascript
// In console
localStorage.getItem('aurea-auth-storage')
```

### Check API Calls
```javascript
// Network tab in DevTools
// See all API requests and responses
```

### Check Component Props
```jsx
// Add debugging in component
console.log('Component props:', { prop1, prop2 });
```

### Check Errors
```bash
# Vite shows errors in console and browser
# React DevTools extension helps
# Use `npm run lint` to catch issues
```

## Important Notes

- **No TypeScript**: This is a pure JavaScript project
- **No Testing Framework**: Manual testing only
- **localStorage for Auth**: Tokens stored client-side
- **Lazy Loading**: Most pages load on demand for performance
- **Vite Hot Reload**: Changes reflect immediately in dev
- **Console Removal**: Production builds remove console.* calls
- **Mobile First**: Design is responsive from mobile up

## Recent Updates (October 2025)

- ✅ Updated to React 19.1.1
- ✅ Vite 7.1.2 with Tailwind CSS 4.1.13 integration
- ✅ 4 professional templates (Echelon, Serene, Chic, BoldFolio)
- ✅ Template-aware PDF generation
- ✅ Custom subdomain publishing
- ✅ Enhanced image upload system
- ✅ Case study management with rich content

## References

- **Backend**: AUREA---Backend/README.md
- **Backend API**: http://localhost:5000/api-docs
- **React Docs**: https://react.dev
- **Vite**: https://vitejs.dev
- **Zustand**: https://zustand.docs.pmnd.rs
- **Tailwind**: https://tailwindcss.com

## Getting Help

- Check console for errors: F12 → Console
- Check network requests: F12 → Network
- Check if backend is running: curl http://localhost:5000/health
- Clear cache: `rm -rf .vite dist node_modules && npm install`
- Ask Claude Code with specific error messages

---

**Last Updated**: October 2025
**Version**: 1.0.0
**Status**: Production Ready
