# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AUREA Frontend is a React 19.1.1 application built with Vite 7.1.2 for the portfolio builder platform. It provides a portfolio builder UI, 4 portfolio templates, and publishing capabilities.

**Tech Stack**: React 19.1.1, Vite 7.1.2, Tailwind CSS 4.1.13, Zustand 5.0.8, Framer Motion 12.23.12, GSAP 3.13.0

## Development Commands

```bash
npm install           # Install dependencies (auto-runs before dev/build)
npm run dev           # Dev server (http://localhost:5173)
npm run build         # Production build (strips console.* and debugger)
npm run preview       # Preview production build
npm run lint          # ESLint
```

## Architecture (32 pages, 78 components)

### Directory Structure
```
src/
├── pages/                    # 32 page components (lazy-loaded except HomePage)
│   ├── HomePage.jsx          # Eager-loaded landing page
│   ├── LoginPage.jsx, SignupPage.jsx
│   ├── DashboardNew.jsx      # Main dashboard
│   ├── AccountNew.jsx        # Profile management
│   ├── PortfolioBuilderPage.jsx
│   ├── PublishedPortfolioPage.jsx
│   ├── TemplatesShowcasePage.jsx
│   ├── EchelonPreviewPage.jsx, SerenePreviewPage.jsx
│   ├── ChicPreviewPage.jsx, BoldFolioPreviewPage.jsx
│   ├── StaticHTMLViewer.jsx  # Subdomain hosting
│   └── [20+ more pages]
│
├── components/               # 78 components across 8 categories
│   ├── Dashboard/            # 9 dashboard components
│   ├── DashboardNew/         # 3 new dashboard components
│   ├── LandingPage/          # 12 landing page sections
│   ├── PortfolioBuilder/     # 23 builder components + 8 FormFields
│   │   ├── PortfolioBuilderUI.jsx
│   │   ├── SchemaFormGenerator.jsx
│   │   ├── TemplateSelector.jsx
│   │   ├── SectionEditor.jsx (21KB)
│   │   ├── DesignToolsPanel.jsx (37KB - largest)
│   │   ├── PublishModal.jsx (15KB)
│   │   ├── PDFExport.jsx (17KB)
│   │   └── FormFields/ (8 field types)
│   ├── Shared/               # 12 shared components
│   │   ├── Navbar.jsx (19KB)
│   │   ├── Footer.jsx
│   │   ├── ImageCropModal.jsx
│   │   └── StaggeredMenu.jsx (29KB)
│   └── Templates/            # Dynamic section renderers
│
├── templates/                # 4 complete portfolio templates
│   ├── Echelon/              # Swiss/minimalist style
│   │   ├── EchelonTemplate.jsx
│   │   ├── sections/ (5 sections)
│   │   └── components/ (4 Swiss components)
│   ├── Serene/               # Botanical/elegant style
│   │   ├── SereneTemplate.jsx
│   │   └── sections/ (4 sections)
│   ├── Chic/                 # Modern chic design
│   │   ├── ChicTemplate.jsx
│   │   └── sections/ (5 sections)
│   ├── BoldFolio/            # Bold portfolio style
│   │   ├── BoldFolioTemplate.jsx
│   │   └── sections/ (4 sections)
│   └── Shared/               # Shared template utilities
│       ├── Animations/ (ScrollReveal, SplitText)
│       ├── Backgrounds/ (Aurora, Plasma, Prism, Silk, DarkVeil)
│       └── Components/ (Masonry, DomeGallery, ScrollStack)
│
├── stores/                   # 4 Zustand stores (1,197 lines total)
│   ├── authStore.js          # JWT, user session, email verification
│   ├── portfolioStore.js     # Portfolio CRUD, current portfolio
│   ├── templateStore.js      # Template fetching, schema caching
│   └── uploadStore.js        # Image upload with blob preview
│
├── lib/                      # 10 API modules (2,415 lines)
│   ├── baseApi.js            # Axios wrapper with Bearer token
│   ├── authApi.js            # Auth endpoints (404 lines)
│   ├── portfolioApi.js       # Portfolio CRUD (274 lines)
│   ├── caseStudyApi.js       # Case study CRUD (145 lines)
│   ├── templateApi.js        # Template ops (430 lines - largest)
│   ├── templateAdapter.js    # Data transformation (373 lines)
│   ├── uploadApi.js          # Cloudinary upload (345 lines)
│   ├── cloudinaryDirectUpload.js
│   └── sitesApi.js           # Publishing (55 lines)
│
├── hooks/                    # 5 custom hooks
│   ├── usePortfolioBuilder.js (11.3KB)
│   ├── useImageUpload.js (7.4KB)
│   ├── useTemplateChange.js (7KB)
│   ├── useTemplateValidation.js (4.1KB)
│   └── useMediaQuery.js (1.5KB)
│
├── utils/                    # 7 utility modules
│   ├── portfolioUtils.js (18.4KB)
│   ├── templateAnalyzer.js (11KB)
│   ├── templateMigration.js (4.6KB)
│   ├── projectUtils.js (5.5KB)
│   ├── animationConfig.js (6.3KB)
│   ├── uploadPendingImages.js (3.9KB)
│   └── cn.js (class name utility)
│
└── assets/                   # Sample data, portfolio examples
```

## Key Patterns

### State Management (Zustand)

**authStore.js** - Authentication state
```javascript
import { useAuthStore } from '@/stores/authStore';
const { user, isAuthenticated, login, logout } = useAuthStore();
// Persists to localStorage: "aurea-auth-storage"
// Auto-checks token expiration every 60 seconds
```

**portfolioStore.js** - Portfolio operations
```javascript
import { usePortfolioStore } from '@/stores/portfolioStore';
const { portfolios, currentPortfolio, fetchPortfolios } = usePortfolioStore();
```

**templateStore.js** - Template caching
```javascript
import { useTemplateStore } from '@/stores/templateStore';
const { templates, getTemplate, getSchema } = useTemplateStore();
// Caches templates and schemas in Map objects
```

**uploadStore.js** - Image uploads with instant preview
```javascript
import useUploadStore from '@/stores/uploadStore';
const { startUpload, getPreviewUrl, getFinalUrl } = useUploadStore();
// Creates instant blob URL preview while uploading to Cloudinary
```

### API Layer

All calls through `lib/baseApi.js` with Bearer token interceptor:
```javascript
import { portfolioApi } from '@/lib/portfolioApi';
const portfolios = await portfolioApi.getUserPortfolios();
```

### Routing (35+ routes)

All pages lazy-loaded except HomePage:
```javascript
const DashboardPage = lazy(() => import('./pages/DashboardNew'));
```

**Key Routes:**
- `/` - HomePage (eager-loaded)
- `/dashboard` - Main dashboard (protected)
- `/profile` - User profile (protected)
- `/portfolio-builder/:id` - Portfolio editor (protected)
- `/portfolio-builder/:id/case-study/:projectId` - Case study editor
- `/template-preview/{echelon|serene|chic|boldfolio}` - Template previews
- `/:subdomain/html` - Static published portfolio
- `/:subdomain/case-study/:projectId` - Case study view

### Template System

4 templates with shared components:
- **Echelon**: Swiss/minimalist design
- **Serene**: Botanical/elegant style
- **Chic**: Modern chic design
- **BoldFolio**: Bold portfolio style

**Template Sync** (browser console):
```javascript
window.resyncTemplates()    // Sync all templates to backend
window.resyncEchelon()      // Sync specific template
```

## Component Patterns

### Lazy Loading
```javascript
const DashboardPage = lazy(() => import('./pages/DashboardNew'));
// Wrapped in Suspense with fallback
```

### Form Fields (8 types)
Located in `components/PortfolioBuilder/FormFields/`:
- TextField, TextareaField, SelectField
- CheckboxField, ArrayField, ImageField
- ObjectField, RichTextField

### Schema-Based Forms
```javascript
import SchemaFormGenerator from '@/components/PortfolioBuilder/SchemaFormGenerator';
// Generates forms from template JSON schemas
```

## Environment Variables

```bash
VITE_API_BASE_URL=http://localhost:5000
VITE_API_TIMEOUT=10000
# Note: VITE_ prefixed vars are publicly visible in browser bundle
```

## Key Files by Size

| File | Size | Purpose |
|------|------|---------|
| `DesignToolsPanel.jsx` | 37.7KB | Design tools UI |
| `TemplateSpecificSetup.jsx` | 40.3KB | Template configuration |
| `StaggeredMenu.jsx` | 29KB | Animated menu |
| `TemplateSetupForm.jsx` | 29.9KB | Template setup |
| `OverviewSection.jsx` | 29.5KB | Dashboard overview |
| `Navbar.jsx` | 19.5KB | Main navigation |

## Build Configuration

**vite.config.js**:
- React plugin
- Tailwind CSS plugin
- Production: Strips `console.*` and `debugger` statements

**vercel.json**: SPA routing configured for Vercel deployment

## Common Workflows

### Adding a New Template
1. Create directory: `src/templates/YourTemplate/`
2. Create main component + sections
3. Export from `src/templates/index.js`
4. Add preview route in `App.jsx`
5. Run `window.resyncTemplates()` in browser console

### Working with Images
1. Use `uploadStore` for instant blob preview
2. Cloudinary upload happens in background
3. Progress tracked automatically (0-100%)

### Debugging
```javascript
// Check JWT in browser console
localStorage.getItem('aurea-auth-storage')

// Check store state
useAuthStore.getState()
usePortfolioStore.getState()
```

## Key Dependencies

- **react 19.1.1** - UI framework
- **vite 7.1.2** - Build tool
- **tailwindcss 4.1.13** - Styling
- **zustand 5.0.8** - State management
- **react-router-dom 7.9.0** - Routing
- **axios 1.12.1** - HTTP client
- **framer-motion 12.23.12** - Animations
- **gsap 3.13.0** - Advanced animations
- **@tiptap/react 3.4.2** - Rich text editor
- **react-hook-form 7.62.0** - Form handling
- **@react-pdf/renderer 4.3.0** - PDF export
- **react-dropzone 14.3.8** - File upload
- **lucide-react** - Icons

## Documentation

24 comprehensive guides in `/docs/`:
- System architecture (111KB)
- Template system details (52KB)
- Backend integration
- Testing procedures
- Template creation guide
