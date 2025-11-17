# AUREA Frontend System Architecture

**Version**: 1.0.0
**Framework**: React 19.1.1 + Vite 7.1.2
**Last Updated**: November 14, 2025

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [State Management (Zustand)](#4-state-management-zustand)
5. [Routing Architecture](#5-routing-architecture)
6. [API Integration Layer](#6-api-integration-layer)
7. [Component Architecture](#7-component-architecture)
8. [Template System](#8-template-system)
9. [Custom Hooks & Utilities](#9-custom-hooks--utilities)
10. [Configuration & Build](#10-configuration--build)
11. [Styling Approach](#11-styling-approach)
12. [Performance Optimizations](#12-performance-optimizations)
13. [Request Flow Examples](#13-request-flow-examples)
14. [Unique Architectural Decisions](#14-unique-architectural-decisions)
15. [Security Considerations](#15-security-considerations)
16. [Development Workflows](#16-development-workflows)

---

## 1. Architecture Overview

### 1.1 Project Purpose

AUREA Frontend is a **modern portfolio builder platform** that enables users to create, customize, and publish professional portfolios using dynamic, database-driven templates. Built with React 19.1.1 and Vite 7.1.2, it provides an intuitive drag-and-drop interface for portfolio creation without requiring coding knowledge.

### 1.2 Key Metrics

**Codebase Statistics**:
- **Total Source Files**: 171 JavaScript/JSX files
- **Total Lines of Code**: 48,596 lines
- **Component Count**: 75 component files
- **State Stores**: 4 Zustand stores (1,196 lines)
- **API Modules**: 9 API integration files
- **Templates**: 4 portfolio templates (48 template files)
- **Pages**: 22 route-based pages
- **Custom Hooks**: 5 hooks
- **Utilities**: 6 utility modules
- **Documentation**: 20+ markdown files

### 1.3 Architecture Pattern

**Pattern**: **Component-Based Architecture** with feature-based organization

```
┌─────────────────────────────────────────────────────────────┐
│                    USER BROWSER                              │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              React Application                      │    │
│  │                                                      │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │         Pages (22 Routes)                    │  │    │
│  │  │  - HomePage (eager loaded)                   │  │    │
│  │  │  - Dashboard, Profile, Builder, etc.         │  │    │
│  │  │  - All lazy loaded via React.lazy()         │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  │              ↓                                       │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │      Components (75 files)                   │  │    │
│  │  │  - Dashboard, LandingPage, PortfolioBuilder │  │    │
│  │  │  - Shared, Templates, FormFields            │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  │              ↓                                       │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │     Zustand Stores (4 stores)                │  │    │
│  │  │  - authStore (JWT, user session)             │  │    │
│  │  │  - portfolioStore (CRUD, caching)            │  │    │
│  │  │  - templateStore (templates, schemas)        │  │    │
│  │  │  - uploadStore (image upload state)          │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  │              ↓                                       │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │       API Layer (9 modules)                  │  │    │
│  │  │  - baseApi.js (axios + interceptors)         │  │    │
│  │  │  - authApi, portfolioApi, templateApi, etc.  │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  │              ↓                                       │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              ↓ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND API SERVER                         │
│  https://aurea-backend-production-8a87.up.railway.app       │
│                                                              │
│  - RESTful API endpoints                                    │
│  - JWT authentication                                        │
│  - MongoDB database                                          │
│  - Cloudinary image storage                                 │
└─────────────────────────────────────────────────────────────┘
```

### 1.4 Key Architectural Characteristics

1. **Functional Components Only**: No class components, 100% React Hooks
2. **Lazy Loading**: All pages lazy-loaded except HomePage (performance)
3. **Service Layer Pattern**: API modules abstract backend communication
4. **Repository Pattern**: Zustand stores abstract state management
5. **Schema-Driven Forms**: Dynamic form generation from JSON schemas
6. **Optimistic UI**: Immediate feedback before API confirmation
7. **Caching Strategy**: 30-second cache for portfolio lists, in-memory template cache
8. **Error Boundaries**: Graceful error handling with user-friendly messages

---

## 2. Technology Stack

### 2.1 Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.1 | UI framework (latest version) |
| **Vite** | 7.1.2 | Build tool & dev server |
| **React Router DOM** | 7.9.0 | Client-side routing |
| **Zustand** | 5.0.8 | State management |
| **Axios** | 1.12.1 | HTTP client |
| **Tailwind CSS** | 4.1.13 | Utility-first styling |

### 2.2 Animation Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| **Framer Motion** | 12.23.12 | Declarative animations |
| **GSAP** | 3.13.0 | Timeline animations |
| **Lenis** | 1.3.11 | Smooth scrolling |

### 2.3 Form & Rich Text

| Library | Version | Purpose |
|---------|---------|---------|
| **React Hook Form** | 7.62.0 | Form management |
| **TipTap** | 3.4.2 | Rich text editor |
| **@dnd-kit** | Latest | Drag & drop |

### 2.4 Image Processing

| Library | Version | Purpose |
|---------|---------|---------|
| **browser-image-compression** | 2.0.2 | Client-side compression |
| **react-easy-crop** | 5.5.3 | Image cropping |
| **react-dropzone** | 14.3.8 | Drag & drop uploads |

### 2.5 Utilities

| Library | Version | Purpose |
|---------|---------|---------|
| **react-hot-toast** | 2.6.0 | Notifications |
| **Lucide React** | 0.544.0 | Icon library |
| **@react-pdf/renderer** | 4.3.0 | PDF generation |
| **Vercel Analytics** | Latest | Performance tracking |

### 2.6 Development Tools

| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting |
| **Vite Plugin React** | Fast Refresh |
| **Vite Plugin Tailwind** | Tailwind integration |

---

## 3. Project Structure

### 3.1 Complete Directory Tree

```
Aurea-frontend/
├── src/ (171 files, 48,596 lines)
│   ├── components/ (75 files)
│   │   ├── Dashboard/ (8 files)          # Legacy dashboard components
│   │   ├── DashboardNew/ (3 files)       # New dashboard UI (active)
│   │   ├── LandingPage/ (14 files)       # Marketing site sections
│   │   ├── PortfolioBuilder/ (35 files)  # Core builder interface
│   │   │   ├── FormFields/ (8 files)     # Schema-driven fields
│   │   │   ├── DynamicTemplateSetup.jsx
│   │   │   ├── SchemaFormGenerator.jsx
│   │   │   ├── PortfolioBuilderUI.jsx
│   │   │   ├── EditorNavbar.jsx
│   │   │   ├── PublishModal.jsx
│   │   │   └── ... (20+ components)
│   │   ├── Shared/ (10 files)            # Global components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ImageCropModal.jsx
│   │   │   └── ... (7 more)
│   │   └── Templates/ (5 files)          # Template-specific components
│   │
│   ├── pages/ (22 files)
│   │   ├── HomePage.jsx                  # Landing (eager loaded)
│   │   ├── DashboardNew.jsx              # Main dashboard
│   │   ├── AccountNew.jsx                # User profile
│   │   ├── PortfolioBuilderPage.jsx     # Portfolio editor
│   │   ├── LoginPage.jsx / SignupPage.jsx
│   │   ├── EchelonPreviewPage.jsx
│   │   ├── SerenePreviewPage.jsx
│   │   ├── ChicPreviewPage.jsx
│   │   ├── BoldFolioPreviewPage.jsx
│   │   ├── PublishedPortfolioPage.jsx
│   │   ├── StaticHTMLViewer.jsx
│   │   └── ... (22 total)
│   │
│   ├── templates/ (48 files)
│   │   ├── Echelon/                      # Swiss-style minimalist
│   │   │   ├── EchelonTemplate.jsx
│   │   │   ├── EchelonCaseStudyPage.jsx
│   │   │   ├── components/ (4 files)     # Swiss design system
│   │   │   └── sections/ (5 files)       # Hero, About, Work, etc.
│   │   ├── Serene/                       # Botanical elegant
│   │   │   ├── SereneTemplate.jsx
│   │   │   ├── SereneAboutPage.jsx
│   │   │   └── sections/ (5 files)
│   │   ├── Chic/                         # Modern chic
│   │   │   ├── ChicTemplate.jsx
│   │   │   └── sections/ (5 files)
│   │   ├── BoldFolio/                    # Bold portfolio
│   │   │   ├── BoldFolioTemplate.jsx
│   │   │   └── sections/ (5 files)
│   │   └── Shared/                       # Cross-template
│   │       ├── Backgrounds/              # Aurora, Plasma, Prism, Silk
│   │       ├── Components/               # Common UI
│   │       └── Animations/               # Reusable configs
│   │
│   ├── stores/ (4 files, 1,196 lines)
│   │   ├── authStore.js (247 lines)
│   │   ├── portfolioStore.js (320 lines)
│   │   ├── templateStore.js (348 lines)
│   │   └── uploadStore.js (281 lines)
│   │
│   ├── lib/ (9 files)                    # API integration
│   │   ├── baseApi.js                    # Axios config
│   │   ├── authApi.js
│   │   ├── portfolioApi.js
│   │   ├── templateApi.js
│   │   ├── caseStudyApi.js
│   │   ├── uploadApi.js
│   │   ├── templateAdapter.js
│   │   ├── cloudinaryDirectUpload.js
│   │   └── api.js
│   │
│   ├── hooks/ (5 files)                  # Custom hooks
│   │   ├── usePortfolioBuilder.js
│   │   ├── useImageUpload.js
│   │   ├── useTemplateChange.js
│   │   ├── useTemplateValidation.js
│   │   └── useMediaQuery.js
│   │
│   ├── utils/ (6 files)                  # Utilities
│   │   ├── portfolioUtils.js
│   │   ├── templateAnalyzer.js
│   │   ├── templateMigration.js
│   │   ├── animationConfig.js
│   │   ├── cn.js
│   │   └── uploadPendingImages.js
│   │
│   ├── styles/                           # Global styles
│   │   └── index.css
│   │
│   ├── assets/                           # Static assets
│   │   └── portfolio_sample/
│   │
│   ├── App.jsx                           # Root component
│   ├── main.jsx                          # React entry
│   └── index.css                         # Global CSS
│
├── public/                               # Static files
│   ├── favicon files (7 variants)
│   ├── AUREA - Logo.png/jpg
│   └── mockDataImage/
│
├── docs/ (20 files)                      # Documentation
│   ├── TEMPLATE_SYSTEM_GUIDE.md
│   ├── BACKEND_INTEGRATION.md
│   ├── SYSTEM_ARCHITECTURE.md (this file)
│   └── ... (17+ more guides)
│
├── package.json                          # Dependencies
├── vite.config.js                        # Vite config
├── tailwind.config.js                    # Tailwind config
├── eslint.config.js                      # ESLint config
├── vercel.json                           # Vercel deployment
├── CLAUDE.md                             # AI instructions
└── README.md                             # Project overview
```

### 3.2 File Count by Category

| Directory | Files | Purpose |
|-----------|-------|---------|
| `src/components/` | 75 | Reusable UI components |
| `src/pages/` | 22 | Route-based pages |
| `src/templates/` | 48 | Portfolio templates |
| `src/stores/` | 4 | Zustand state stores |
| `src/lib/` | 9 | API integration layer |
| `src/hooks/` | 5 | Custom React hooks |
| `src/utils/` | 6 | Helper utilities |
| `docs/` | 20+ | Documentation files |
| **Total** | **171+** | **Source files** |

---

## 4. State Management (Zustand)

### 4.1 Overview

**Library**: Zustand 5.0.8
**Total Stores**: 4 stores, 1,196 lines of code
**Pattern**: Centralized state with persistence and caching

```
┌─────────────────────────────────────────────────────────────┐
│                   ZUSTAND STORES                             │
│                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │  authStore     │  │ portfolioStore │  │templateStore │  │
│  │  (247 lines)   │  │  (320 lines)   │  │ (348 lines)  │  │
│  │                │  │                │  │              │  │
│  │ • user         │  │ • portfolios   │  │ • templates  │  │
│  │ • isAuth       │  │ • current      │  │ • cache      │  │
│  │ • JWT token    │  │ • stats        │  │ • schemas    │  │
│  │ • 60s monitor  │  │ • 30s cache    │  │ • fallbacks  │  │
│  └────────────────┘  └────────────────┘  └──────────────┘  │
│                                                              │
│  ┌────────────────┐                                         │
│  │  uploadStore   │                                         │
│  │  (281 lines)   │                                         │
│  │                │                                         │
│  │ • uploads      │  Instant preview with blob URLs        │
│  │ • progress     │  Fake progress (0-30%) + real (30-100%)│
│  │ • blob URLs    │  Memory cleanup via revokeObjectURL    │
│  └────────────────┘                                         │
│                                                              │
│  Persistence: localStorage with selective fields            │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 authStore.js (247 lines)

**Purpose**: User authentication, session management, JWT handling

**State**:
```javascript
{
  user: {
    _id: string,
    name: string,
    email: string,
    avatar: string,
    isPremium: boolean,
    premiumType: 'free' | 'monthly' | 'yearly' | 'lifetime'
  },
  isAuthenticated: boolean,
  isLoading: boolean,
  _tokenCheckInterval: number | null
}
```

**Key Actions**:

| Action | Description | Side Effects |
|--------|-------------|--------------|
| `login(email, password)` | Authenticate user | Store JWT, start token monitoring, navigate to dashboard |
| `signup(name, email, password)` | Register new user | Auto-login after signup |
| `logout()` | Clear session | Stop monitoring, clear localStorage, redirect to `/login` |
| `checkAuth()` | Validate token on app load | Fetch fresh user data from backend |
| `updateProfile(userData)` | Update user profile | Validate fields, sync with backend |
| `uploadAvatar(file)` | Upload profile picture | 5MB limit, compression before upload |
| `startTokenExpirationCheck()` | Monitor JWT expiration | Check every 60 seconds |
| `stopTokenExpirationCheck()` | Stop monitoring | Clear interval |

**Persistence**:
- **localStorage Key**: `"aurea-auth-storage"`
- **Persisted Fields**: `user`, `isAuthenticated`
- **Token Storage**: Separate key `"aurea_token"`

**Auto-Features**:
- ✅ Periodic token validation (60-second intervals)
- ✅ Auto-logout on token expiration
- ✅ Auto-redirect to `/login` when session expires
- ✅ Token attached to all API requests via axios interceptor

**Usage Example**:
```javascript
import { useAuthStore } from './stores/authStore';

function LoginPage() {
  const { login, isLoading } = useAuthStore();

  const handleLogin = async () => {
    await login(email, password);
    // Auto-redirects to dashboard on success
  };
}
```

---

### 4.3 portfolioStore.js (320 lines)

**Purpose**: Portfolio CRUD operations and state management

**State**:
```javascript
{
  portfolios: Array<Portfolio>,
  currentPortfolio: Portfolio | null,
  portfolioStats: {
    total: number,
    published: number,
    unpublished: number
  },
  isLoading: boolean,
  isCreating: boolean,
  isUpdating: boolean,
  lastFetchTime: number | null
}
```

**Key Actions**:

| Action | Description | Cache Strategy |
|--------|-------------|----------------|
| `createPortfolio(data)` | Create new portfolio | Extract ID from response |
| `fetchUserPortfolios(published?, force?)` | Fetch portfolios | 30s cache, skip if fresh |
| `fetchPortfolioStats()` | Get statistics | Aggregate counts |
| `fetchPortfolioById(id)` | Load specific portfolio | ID validation |
| `fetchPortfolioBySlug(slug)` | Fetch by slug | Public access |
| `updatePortfolio(id, updates)` | Update portfolio | **Doesn't update currentPortfolio** |
| `deletePortfolio(id)` | Delete portfolio | Remove from array |
| `publishPortfolio(id, slug?)` | Mark as published | Optional custom slug |
| `unpublishPortfolio(id)` | Mark as unpublished | - |
| `updatePortfolioOptimistic(id, updates)` | Immediate UI update | Before API call |

**Cache Strategy**:
```javascript
// 30-second cache for portfolio list
const CACHE_DURATION = 30 * 1000; // 30 seconds

fetchUserPortfolios: async (published, forceRefresh = false) => {
  const now = Date.now();
  const lastFetch = get().lastFetchTime;

  // Skip fetch if data is fresh
  if (!forceRefresh && lastFetch && (now - lastFetch) < CACHE_DURATION) {
    return { cached: true, portfolios: get().portfolios };
  }

  // Fetch from backend
  const portfolios = await portfolioApi.getUserPortfolios(published);
  set({ portfolios, lastFetchTime: now });
  return { cached: false, portfolios };
}
```

**Important Pattern**:
```javascript
// updatePortfolio() intentionally doesn't update currentPortfolio
// This prevents unwanted re-renders in the portfolio builder editor
updatePortfolio: async (id, updates) => {
  await portfolioApi.update(id, updates);

  // Update in portfolios array
  set(state => ({
    portfolios: state.portfolios.map(p =>
      p._id === id ? { ...p, ...updates } : p
    )
  }));

  // DON'T update currentPortfolio to prevent editor refresh
  // currentPortfolio stays unchanged
}
```

**Usage Example**:
```javascript
import { usePortfolioStore } from './stores/portfolioStore';

function Dashboard() {
  const { portfolios, fetchUserPortfolios, isLoading } = usePortfolioStore();

  useEffect(() => {
    fetchUserPortfolios(); // Uses 30s cache
  }, []);

  return portfolios.map(p => <PortfolioCard key={p._id} {...p} />);
}
```

---

### 4.4 templateStore.js (348 lines)

**Purpose**: Dynamic template management from backend database

**State**:
```javascript
{
  templates: Array<Template>,
  templateCache: Map<templateId, Template>,
  schemaCache: Map<templateId, JSONSchema>,
  categories: Array<string>,
  defaultTemplate: Template | null,
  isLoading: boolean,
  isLoadingSchema: boolean,
  error: string | null
}
```

**Key Actions**:

| Action | Description | Caching |
|--------|-------------|---------|
| `fetchTemplates(params?)` | Fetch all templates | Cache each in Map |
| `getTemplateById(id)` | Get template | Check cache first, fallback to Echelon on 404 |
| `getTemplateSchema(id)` | Get JSON schema | Check schema cache first |
| `fetchCategories()` | Get template categories | - |
| `fetchDefaultTemplate()` | Get default template | Fallback to first available |
| `getFallbackTemplate()` | Emergency fallback | Minimal template structure |
| `createPortfolioFromTemplate(id, custom)` | Generate portfolio | Deep merge customizations |
| `validatePortfolioContent(id, content)` | Validate against schema | - |
| `clearCache()` | Clear all caches | Both template and schema caches |
| `initialize()` | Bootstrap store | Called on app load |

**Cache Strategy**:
```javascript
// In-memory Map objects for templates and schemas
templateCache: new Map(),
schemaCache: new Map(),

getTemplateById: async (id) => {
  const cache = get().templateCache;

  // Check cache first
  if (cache.has(id)) {
    return { template: cache.get(id), fromCache: true };
  }

  // Fetch from backend
  try {
    const template = await templateApi.getTemplateById(id);
    cache.set(id, template);
    return { template, fromCache: false };
  } catch (error) {
    // Fallback to Echelon on 404
    if (error.response?.status === 404) {
      return get().getTemplateById('echelon');
    }
    throw error;
  }
}
```

**Fallback Logic** (4 levels):
```javascript
1. Try requested template
   ↓ (404 or error)
2. Fall back to default template
   ↓ (404 or error)
3. Fall back to first available template
   ↓ (empty array or error)
4. Return minimal template structure (last resort)
```

**Minimal Template Structure**:
```javascript
{
  _id: 'fallback',
  name: 'Fallback Template',
  displayName: 'Basic Portfolio',
  schema: {
    type: 'object',
    properties: {
      hero: { type: 'object', properties: { title: { type: 'string' } } },
      about: { type: 'object', properties: { name: { type: 'string' } } }
    }
  },
  defaultContent: {
    hero: { title: 'Welcome' },
    about: { name: 'Your Name' }
  }
}
```

**Usage Example**:
```javascript
import { useTemplateStore } from './stores/templateStore';

function TemplateSelector() {
  const { templates, fetchTemplates } = useTemplateStore();

  useEffect(() => {
    fetchTemplates(); // Caches all templates
  }, []);

  return templates.map(t => <TemplateCard key={t._id} {...t} />);
}
```

---

### 4.5 uploadStore.js (281 lines)

**Purpose**: Centralized image upload state with instant preview

**State**:
```javascript
{
  uploads: {
    [uploadId]: {
      file: File,
      preview: string,      // Blob URL for instant preview
      progress: number,     // 0-100
      url: string | null,   // Final Cloudinary URL
      error: string | null,
      status: 'uploading' | 'success' | 'error'
    }
  }
}
```

**Key Features**:

1. **Instant Preview**: Creates blob URL immediately via `URL.createObjectURL()`
2. **Fake Fast Progress**: Animates 0→30% in 300ms for perceived performance
3. **Real Progress**: Maps 30-100% from actual Cloudinary upload
4. **Memory Management**: Auto-cleanup of blob URLs via `URL.revokeObjectURL()`

**Actions**:

| Action | Description | Side Effects |
|--------|-------------|--------------|
| `startUpload(file, uploadId)` | Create instant preview | Blob URL, fake progress to 30% |
| `updateProgress(uploadId, progress)` | Update progress | Map 0-100 to 30-100 range |
| `completeUpload(uploadId, url)` | Mark success | Cleanup blob, store Cloudinary URL |
| `failUpload(uploadId, error)` | Mark as failed | Keep preview for retry |
| `retryUpload(uploadId)` | Reset failed upload | - |
| `removeUpload(uploadId)` | Cancel and cleanup | Revoke blob URL |
| `getPreviewUrl(uploadId)` | Get current URL | Blob or Cloudinary |
| `getFinalUrl(uploadId)` | Get Cloudinary URL only | - |
| `clearAllUploads()` | Cleanup all blobs | - |
| `cleanupOldUploads()` | Remove >5min old | - |

**Upload Flow**:
```javascript
// 1. Start upload - instant preview
startUpload: (file, uploadId) => {
  const preview = URL.createObjectURL(file); // Instant blob URL

  set(state => ({
    uploads: {
      ...state.uploads,
      [uploadId]: {
        file,
        preview,
        progress: 0,
        url: null,
        error: null,
        status: 'uploading'
      }
    }
  }));

  // Fake fast progress: 0 → 30% in 300ms
  setTimeout(() => updateProgress(uploadId, 30), 300);
}

// 2. Update progress - real upload
updateProgress: (uploadId, progress) => {
  // Map 0-100 from API to 30-100 for UI
  const mappedProgress = 30 + (progress * 0.7);

  set(state => ({
    uploads: {
      ...state.uploads,
      [uploadId]: {
        ...state.uploads[uploadId],
        progress: mappedProgress
      }
    }
  }));
}

// 3. Complete upload - cleanup blob
completeUpload: (uploadId, cloudinaryUrl) => {
  const upload = get().uploads[uploadId];

  // Revoke blob URL to free memory
  URL.revokeObjectURL(upload.preview);

  set(state => ({
    uploads: {
      ...state.uploads,
      [uploadId]: {
        ...state.uploads[uploadId],
        url: cloudinaryUrl,
        progress: 100,
        status: 'success'
      }
    }
  }));
}
```

**Perceived Performance Optimization**:

```
User Experience Timeline:

0ms:    User selects file
        ↓
10ms:   Instant preview appears (blob URL)
        Progress: 0%
        ↓
300ms:  Progress jumps to 30% (fake, feels fast!)
        ↓
1-5s:   Real Cloudinary upload (30% → 100%)
        ↓
Done:   Final URL stored, blob URL cleaned up
```

**Memory Management**:
```javascript
// Automatic cleanup when upload completes
URL.revokeObjectURL(blobUrl);

// Periodic cleanup of old uploads
setInterval(() => {
  cleanupOldUploads(); // Remove >5min old
}, 60000); // Every minute
```

**Usage Example**:
```javascript
import { useUploadStore } from './stores/uploadStore';

function ImageUpload() {
  const { startUpload, updateProgress, completeUpload, getPreviewUrl } = useUploadStore();

  const handleUpload = async (file) => {
    const uploadId = `upload-${Date.now()}`;

    // 1. Instant preview
    startUpload(file, uploadId);

    // 2. Upload to backend (which uploads to Cloudinary)
    const cloudinaryUrl = await uploadApi.uploadImage(file, (progress) => {
      updateProgress(uploadId, progress);
    });

    // 3. Complete
    completeUpload(uploadId, cloudinaryUrl);

    // Preview URL is always available
    const previewUrl = getPreviewUrl(uploadId);
    return previewUrl;
  };
}
```

---

## 5. Routing Architecture

### 5.1 Routing Overview

**Library**: React Router DOM 7.9.0
**Total Routes**: 22+ routes
**Performance Strategy**:
- **Eager Loading**: Only `HomePage` (critical landing page)
- **Lazy Loading**: All other 21 pages via `React.lazy()`
- **Loading Fallback**: `<PageLoader />` component with spinner

### 5.2 Route Configuration (App.jsx)

```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import PageLoader from './components/Shared/PageLoader';

// Eager load (immediate)
import HomePage from './pages/HomePage';

// Lazy load (on-demand)
const DashboardNew = lazy(() => import('./pages/DashboardNew'));
const AccountNew = lazy(() => import('./pages/AccountNew'));
const PortfolioBuilderPage = lazy(() => import('./pages/PortfolioBuilderPage'));
// ... 18 more lazy imports

function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardNew />
            </ProtectedRoute>
          } />

          {/* Template Previews */}
          <Route path="/template-preview/echelon" element={<EchelonPreviewPage />} />

          {/* Static HTML Routes (last to avoid conflicts) */}
          <Route path="/:subdomain/html" element={<StaticHTMLViewer />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
```

### 5.3 Route Categories

#### **Public Routes** (no authentication required)

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | HomePage | Landing page (eager loaded) |
| `/about` | AboutPage | About AUREA |
| `/contact` | ContactPage | Contact form |
| `/events` | EventsPage | Events showcase |
| `/events/all` | AllEventsPage | All events list |
| `/terms` | TermsPage | Terms of service |
| `/login` | LoginPage | User login |
| `/signup` | SignupPage | User registration |
| `/templates` | TemplatesPage | Template showcase |

#### **Protected Routes** (require authentication)

| Route | Component | Description |
|-------|-----------|-------------|
| `/dashboard` | DashboardNew | Main dashboard (active) |
| `/dashboard-old` | DashboardPage | Legacy dashboard (deprecated) |
| `/profile` | AccountNew | User account settings |
| `/portfolio-builder/:id` | PortfolioBuilderPage | Portfolio editor |
| `/portfolio-builder/:portfolioId/case-study/:projectId` | CaseStudyEditorPage | Case study editor |
| `/portfolio-builder/:portfolioId/about` | SereneAboutEditorPage | Serene about page editor |

#### **Template Preview Routes** (public)

| Route | Component | Template |
|-------|-----------|----------|
| `/template-preview/echelon` | EchelonPreviewPage | Echelon template |
| `/template-preview/serene` | SerenePreviewPage | Serene template |
| `/template-preview/serene/about` | SereneAboutPage | Serene about page |
| `/template-preview/chic` | ChicPreviewPage | Chic template |
| `/template-preview/boldfolio` | BoldFolioPreviewPage | BoldFolio template |

#### **Public Portfolio Routes**

| Route | Component | Description |
|-------|-----------|-------------|
| `/portfolio/:slug` | PublishedPortfolioPage | Published portfolio view |
| `/case-study/logo-design-process` | StaticCaseStudyPage | Static case study example |
| `/portfolio/:portfolioId/project/:projectId` | DynamicCaseStudyPage | Dynamic case study |

#### **Static HTML Routes** (subdomain hosting)

| Route | Component | Description |
|-------|-----------|-------------|
| `/:subdomain/html` | StaticHTMLViewer | Serve static HTML |
| `/:subdomain/case-study-:projectId.html` | StaticCaseStudyViewer | Serve case study HTML |

**Important**: Static HTML routes registered **LAST** to avoid conflicts with API routes.

### 5.4 Protected Route Implementation

```javascript
// components/PortfolioBuilder/ProtectedRoute.jsx

import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to="/login" replace />;
  }

  return children;
}
```

### 5.5 Route Utilities

**ScrollToTop Component**:
```javascript
// Automatically scroll to top on route change
function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    toast.dismiss(); // Dismiss all toasts on navigation
  }, [location.pathname]);

  return null;
}
```

**Route Transition**:
```javascript
// Smooth transitions between routes using Framer Motion
<AnimatePresence mode="wait">
  <Routes location={location} key={location.pathname}>
    {/* routes */}
  </Routes>
</AnimatePresence>
```

---

## 6. API Integration Layer

### 6.1 API Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND APP                              │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │            Components & Pages                       │    │
│  └────────────────────────────────────────────────────┘    │
│                         ↓                                    │
│  ┌────────────────────────────────────────────────────┐    │
│  │           Zustand Stores (4)                       │    │
│  │  Use API modules for backend communication         │    │
│  └────────────────────────────────────────────────────┘    │
│                         ↓                                    │
│  ┌────────────────────────────────────────────────────┐    │
│  │          API Modules (9 files)                     │    │
│  │  - authApi, portfolioApi, templateApi, etc.        │    │
│  └────────────────────────────────────────────────────┘    │
│                         ↓                                    │
│  ┌────────────────────────────────────────────────────┐    │
│  │            baseApi.js (Axios)                      │    │
│  │  • Request interceptor (JWT token)                 │    │
│  │  • Response interceptor (errors, retry)            │    │
│  │  • Retry logic (3 attempts, exponential backoff)   │    │
│  └────────────────────────────────────────────────────┘    │
│                         ↓                                    │
└─────────────────────────────────────────────────────────────┘
                         ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│               BACKEND API SERVER                             │
│  https://aurea-backend-production-8a87.up.railway.app       │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 baseApi.js - Axios Configuration

**File**: `src/lib/baseApi.js`

**Base Configuration**:
```javascript
const baseApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  timeout: 15000, // 15 seconds
  headers: {
    'Content-Type': 'application/json'
  }
});

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second base delay
```

**Request Interceptor**:
```javascript
baseApi.interceptors.request.use((config) => {
  // 1. Add JWT token from localStorage
  const token = localStorage.getItem('aurea_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 2. Add timestamp for performance monitoring
  config.metadata = { startTime: Date.now() };

  // 3. Log request in development
  if (import.meta.env.DEV) {
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`);
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});
```

**Response Interceptor**:
```javascript
baseApi.interceptors.response.use(
  (response) => {
    // Success response

    // 1. Log API call duration in dev mode
    if (import.meta.env.DEV) {
      const duration = Date.now() - response.config.metadata.startTime;
      console.log(`[API Response] ${response.config.url} - ${duration}ms`);
    }

    return response;
  },
  async (error) => {
    // Error response

    // 1. Retry logic for network errors
    const config = error.config;
    if (!config || !config.retry) {
      config.retry = 0;
    }

    const shouldRetry =
      config.retry < MAX_RETRIES &&
      (error.code === 'ECONNABORTED' ||
       error.code === 'NETWORK_ERROR' ||
       !error.response);

    if (shouldRetry) {
      config.retry += 1;
      const delay = RETRY_DELAY * Math.pow(2, config.retry - 1); // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
      return baseApi(config);
    }

    // 2. Handle specific HTTP status codes
    const status = error.response?.status;

    switch (status) {
      case 401: // Unauthorized
        // Clear auth state and redirect to login
        localStorage.removeItem('aurea_token');
        localStorage.removeItem('aurea-auth-storage');
        window.location.href = '/login';
        window.location.reload(); // Force full reload
        break;

      case 403: // Forbidden
        toast.error('Access denied');
        break;

      case 404: // Not Found
        // Silent (don't show toast during editing to prevent false warnings)
        break;

      case 429: // Too Many Requests
        toast.error('Too many requests. Please slow down.');
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        toast.error('Server error. Please try again later.');
        break;

      default:
        if (status >= 400) {
          const message = error.response?.data?.message || 'An error occurred';
          toast.error(message);
        }
    }

    return Promise.reject(error);
  }
);
```

**Helper Functions**:
```javascript
// Consistent error handling wrapper
export const apiRequest = async (requestFn, errorMessage) => {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    console.error(errorMessage, error);
    throw error;
  }
};

// Optimistic update pattern with rollback
export const optimisticUpdate = async (updateFn, rollbackFn) => {
  try {
    await updateFn();
  } catch (error) {
    rollbackFn();
    throw error;
  }
};
```

**Backend URL**:
- **Production**: `https://aurea-backend-production-8a87.up.railway.app`
- **Development**: `http://localhost:5000`

---

### 6.3 API Modules

#### **authApi.js** - Authentication Endpoints

```javascript
export const authApi = {
  // Login user
  login: async ({ email, password }) => {
    const response = await baseApi.post('/api/auth/login', { email, password });
    return response.data;
  },

  // Register new user
  signup: async ({ name, email, password }) => {
    const response = await baseApi.post('/api/auth/signup', { name, email, password });
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await baseApi.get('/api/auth/me');
    return response.data;
  },

  // Update profile
  updateProfile: async (userData) => {
    const response = await baseApi.put('/api/users/profile', userData);
    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await baseApi.post('/api/upload/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Logout
  logout: async () => {
    // No backend call needed, just clear local storage
    localStorage.removeItem('aurea_token');
    localStorage.removeItem('aurea-auth-storage');
  },

  // Check if authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('aurea_token');
  }
};
```

#### **portfolioApi.js** - Portfolio Management

```javascript
export const portfolioApi = {
  // Create portfolio
  create: async (data) => {
    const response = await baseApi.post('/api/portfolios', data);
    return response.data;
  },

  // Get user's portfolios
  getUserPortfolios: async (published) => {
    const url = published !== undefined
      ? `/api/portfolios/user/me?published=${published}`
      : '/api/portfolios/user/me';
    const response = await baseApi.get(url);
    return response.data.data.portfolios;
  },

  // Get portfolio by ID
  getById: async (id) => {
    const response = await baseApi.get(`/api/portfolios/${id}`);
    return response.data.data.portfolio;
  },

  // Get portfolio by slug (public)
  getBySlug: async (slug) => {
    const response = await baseApi.get(`/api/portfolios/public/${slug}`);
    return response.data.data.portfolio;
  },

  // Update portfolio
  update: async (id, updates) => {
    const response = await baseApi.put(`/api/portfolios/${id}`, updates);
    return response.data;
  },

  // Delete portfolio
  delete: async (id) => {
    const response = await baseApi.delete(`/api/portfolios/${id}`);
    return response.data;
  },

  // Publish portfolio
  publish: async (id, slug) => {
    const response = await baseApi.put(`/api/portfolios/${id}/publish`, { slug });
    return response.data;
  },

  // Unpublish portfolio
  unpublish: async (id) => {
    const response = await baseApi.put(`/api/portfolios/${id}/unpublish`);
    return response.data;
  },

  // Check slug availability
  checkSlug: async (slug) => {
    const response = await baseApi.post('/api/portfolios/check-slug', { slug });
    return response.data;
  }
};
```

#### **templateApi.js** - Template System

```javascript
export const templateApi = {
  // Get all templates
  getAllTemplatesFormatted: async () => {
    const response = await baseApi.get('/api/templates');
    return response.data.data.templates.map(transformTemplate);
  },

  // Get template by ID
  getTemplateById: async (id) => {
    const response = await baseApi.get(`/api/templates/${id}`);
    return transformTemplate(response.data.data.template);
  },

  // Get template schema
  getTemplateSchema: async (id) => {
    const response = await baseApi.get(`/api/templates/${id}/schema`);
    return response.data.data.schema;
  },

  // Get template categories
  getTemplateCategories: async () => {
    const response = await baseApi.get('/api/templates/categories');
    return response.data.data.categories;
  },

  // Get default template
  getDefaultTemplate: async () => {
    const response = await baseApi.get('/api/templates/default');
    return transformTemplate(response.data.data.template);
  },

  // Validate template content
  validateTemplate: async (id, content) => {
    const response = await baseApi.post(`/api/templates/${id}/validate`, { content });
    return response.data;
  },

  // Transform backend template to frontend format
  transformTemplate: (backendTemplate) => {
    return {
      ...backendTemplate,
      id: backendTemplate._id,
      // Additional transformations
    };
  },

  // Clear cache
  clearCache: () => {
    // Handled in templateStore
  }
};
```

#### **caseStudyApi.js** - Case Study Management

```javascript
export const caseStudyApi = {
  create: async (portfolioId, data) => {
    const response = await baseApi.post('/api/case-studies', { portfolioId, ...data });
    return response.data;
  },

  getByPortfolioId: async (portfolioId) => {
    const response = await baseApi.get(`/api/case-studies/portfolio/${portfolioId}`);
    return response.data.data.caseStudies;
  },

  getById: async (id) => {
    const response = await baseApi.get(`/api/case-studies/${id}`);
    return response.data.data.caseStudy;
  },

  update: async (id, updates) => {
    const response = await baseApi.put(`/api/case-studies/${id}`, updates);
    return response.data;
  },

  delete: async (id) => {
    const response = await baseApi.delete(`/api/case-studies/${id}`);
    return response.data;
  }
};
```

#### **uploadApi.js** - Image Upload

```javascript
export const uploadApi = {
  // Upload image to Cloudinary (via backend proxy)
  uploadImage: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await baseApi.post('/api/upload/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress?.(percentCompleted);
      }
    });

    return response.data.data.url; // Cloudinary URL
  },

  // Delete image from Cloudinary
  deleteImage: async (publicId) => {
    const response = await baseApi.delete(`/api/upload/image`, { data: { publicId } });
    return response.data;
  }
};
```

---

## 7. Component Architecture

### 7.1 Component Organization

**Total Components**: 75 files across 5 categories

```
src/components/
├── Dashboard/ (8 files)         # Legacy dashboard
├── DashboardNew/ (3 files)      # New dashboard (active)
├── LandingPage/ (14 files)      # Marketing site
├── PortfolioBuilder/ (35 files) # Core builder
├── Shared/ (10 files)           # Global components
└── Templates/ (5 files)         # Template-specific
```

### 7.2 Dashboard Components

#### **Legacy Dashboard** (deprecated, `/dashboard-old`)
- **Files**: 8 components
- **Components**:
  - AnalyticsSection
  - OverviewSection
  - PortfoliosSection
  - QuickActions
  - StatsCard
  - TipsAndTutorials
  - PriceCalculator

#### **DashboardNew** (active, `/dashboard`)
- **Files**: 3 components
- **Components**:
  - `TopNavbarNew.jsx` - Top navigation bar
  - `SidebarNew.jsx` - Side navigation
  - `PortfoliosSectionNew.jsx` - Portfolio grid/list view

**Usage**:
```javascript
// pages/DashboardNew.jsx
function DashboardNew() {
  return (
    <div className="flex h-screen">
      <SidebarNew />
      <div className="flex-1 flex flex-col">
        <TopNavbarNew />
        <main className="flex-1 overflow-y-auto p-8">
          <PortfoliosSectionNew />
        </main>
      </div>
    </div>
  );
}
```

### 7.3 LandingPage Components (14 files)

**Marketing Site Sections**:
- `V2Hero.jsx` - Hero section with CTA
- `V2Navbar.jsx` - Landing page navbar
- `V2Footer.jsx` - Site footer
- `HowItWorksSection.jsx` - Step-by-step guide
- `ImpactSection.jsx` - Impact statistics
- `ProblemSection.jsx` - Problem statement
- `SolutionSection.jsx` - AUREA solution
- `TransitionSection.jsx` - Smooth transitions
- `MarqueeSection.jsx` - Scrolling testimonials
- `PortfolioGalleryMarquee.jsx` - Portfolio showcase
- `TimelineSection.jsx` - Feature timeline
- `ScrollProgress.jsx` - Scroll progress indicator

### 7.4 PortfolioBuilder Components (35 files)

**Core Builder Components**:

**Main Interface**:
- `PortfolioBuilderUI.jsx` - Main builder interface with live preview
- `EditorNavbar.jsx` - Top navigation (save, preview, publish, settings)
- `SectionEditor.jsx` - Section-level editing interface
- `SchemaFormGenerator.jsx` - Dynamic form generation from JSON schemas
- `DynamicTemplateSetup.jsx` - Template initialization wizard
- `DynamicStepForm.jsx` - Multi-step form wizard with progress indicator

**Modals & Dialogs**:
- `PublishModal.jsx` - Publishing options (Vercel, subdomain, custom domain)
- `TemplateChangeModal.jsx` - Template switching with content migration
- `TemplatePreview.jsx` - Live preview panel (desktop/tablet/mobile views)
- `MaintenanceModal.jsx` - Maintenance mode overlay

**Upload Components**:
- `ImageUpload.jsx` - Single image upload with cropping
- `MultiImageUpload.jsx` - Batch image upload with drag & drop
- `ImageCropModal.jsx` - Image cropping modal (shared)

**PDF Export**:
- `PDFExport.jsx` - Frontend PDF generation using @react-pdf/renderer
- `PDFExportBackend.jsx` - Backend PDF generation (Puppeteer)

**UI Components**:
- `FloatingActionButtons.jsx` - Quick actions (save, preview, undo, redo)
- `SaveButtonAnimation.jsx` - Animated save feedback
- `DesignToolsPanel.jsx` - Design customization panel (colors, fonts, spacing)
- `StepIndicator.jsx` - Multi-step progress indicator
- `ProtectedRoute.jsx` - Authentication guard wrapper

**FormFields/** (8 schema-driven field types):
- `TextField.jsx` - Single-line text input
- `TextareaField.jsx` - Multi-line text area
- `RichTextField.jsx` - TipTap rich text editor with formatting
- `SelectField.jsx` - Dropdown select with search
- `CheckboxField.jsx` - Checkbox input
- `ImageField.jsx` - Image upload field with preview
- `ArrayField.jsx` - Dynamic array of items (add/remove/reorder)
- `ObjectField.jsx` - Nested object field with sub-fields

**Schema Form Generation**:
```javascript
// SchemaFormGenerator.jsx - Renders form from JSON schema

function SchemaFormGenerator({ schema, value, onChange }) {
  const renderField = (fieldSchema, fieldName, fieldValue) => {
    switch (fieldSchema.type) {
      case 'string':
        if (fieldSchema.format === 'rich-text') {
          return <RichTextField name={fieldName} value={fieldValue} onChange={onChange} />;
        }
        if (fieldSchema.maxLength > 100) {
          return <TextareaField name={fieldName} value={fieldValue} onChange={onChange} />;
        }
        return <TextField name={fieldName} value={fieldValue} onChange={onChange} />;

      case 'object':
        return <ObjectField schema={fieldSchema} value={fieldValue} onChange={onChange} />;

      case 'array':
        return <ArrayField schema={fieldSchema} value={fieldValue} onChange={onChange} />;

      case 'boolean':
        return <CheckboxField name={fieldName} value={fieldValue} onChange={onChange} />;

      default:
        return <TextField name={fieldName} value={fieldValue} onChange={onChange} />;
    }
  };

  return (
    <form>
      {Object.entries(schema.properties).map(([fieldName, fieldSchema]) => (
        <div key={fieldName}>
          {renderField(fieldSchema, fieldName, value[fieldName])}
        </div>
      ))}
    </form>
  );
}
```

### 7.5 Shared Components (10 files)

**Global Reusable Components**:
- `Navbar.jsx` - Main site navigation (logo, links, auth state)
- `Footer.jsx` - Site footer (links, social, copyright)
- `AnimatedLogo.jsx` - Animated AUREA logo with GSAP
- `ImageCropModal.jsx` - Image cropping modal (react-easy-crop)
- `ScrollReveal.jsx` - Scroll-triggered reveal animations
- `ScrollStack.jsx` - Sticky scroll stacking effect
- `SplitText.jsx` - Text animation utility (split into chars/words)
- `StaggeredMenu.jsx` - Animated navigation menu
- `Masonry.jsx` - Masonry grid layout for galleries
- `Stepper.jsx` - Multi-step form progress indicator

**Example - ScrollReveal**:
```javascript
// Shared/ScrollReveal.jsx
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

function ScrollReveal({ children, className }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

### 7.6 Template Components (5 files)

**Template-Specific UI**:
- Template selector cards
- Template preview thumbnails
- Template category filters
- Template rating displays
- Template comparison views

---

## 8. Template System

### 8.1 Template Overview

**Total Templates**: 4 portfolio templates
**Total Template Files**: 48 files
**Template Locations**: `src/templates/`

### 8.2 Available Templates

#### **1. Echelon Template** (Swiss-style minimalist)

**Location**: `src/templates/Echelon/`
**Design Style**: Swiss design principles, minimalist, grid-based typography
**Files**: 14 files

**Features**:
- ✅ Customizable animated backgrounds (Aurora, Plasma, Prism, Silk)
- ✅ Case study support with dedicated editor
- ✅ Responsive grid-based layout
- ✅ Clean typography with Swiss design system
- ✅ Project gallery with hover effects
- ✅ Smooth transitions and animations

**Components**:
```
Echelon/
├── EchelonTemplate.jsx             # Main template component
├── EchelonCaseStudyPage.jsx        # Case study view
├── EchelonCaseStudyEditorPage.jsx  # Case study editor
├── components/                      # Swiss design system
│   ├── SwissGrid.jsx               # Grid layout system
│   ├── SwissTypography.jsx         # Typography components
│   ├── SwissComponents.jsx         # UI components
│   └── SwissDecorations.jsx        # Decorative elements
└── sections/                        # Template sections
    ├── HeroSection.jsx              # Hero with animated background
    ├── AboutSection.jsx             # About/bio section
    ├── WorkSection.jsx              # Project showcase
    ├── GallerySection.jsx           # Image gallery
    └── ContactSection.jsx           # Contact information
```

**JSON Schema Example**:
```json
{
  "type": "object",
  "properties": {
    "hero": {
      "type": "object",
      "properties": {
        "title": { "type": "string", "maxLength": 100 },
        "subtitle": { "type": "string", "maxLength": 200 },
        "backgroundType": {
          "type": "string",
          "enum": ["aurora", "plasma", "prism", "silk"]
        }
      },
      "required": ["title"]
    },
    "about": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "bio": { "type": "string", "format": "rich-text" },
        "skills": {
          "type": "array",
          "items": { "type": "string" }
        }
      }
    },
    "projects": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "title": { "type": "string" },
          "description": { "type": "string" },
          "image": { "type": "string", "format": "image" },
          "hasCaseStudy": { "type": "boolean" }
        }
      }
    }
  }
}
```

---

#### **2. Serene Template** (Botanical elegant)

**Location**: `src/templates/Serene/`
**Design Style**: Botanical-inspired, elegant, soft pastel colors
**Files**: 10 files

**Features**:
- ✅ Separate about page with dedicated editor
- ✅ Bio and gallery sections
- ✅ Botanical imagery and nature themes
- ✅ Smooth page transitions
- ✅ Elegant typography

**Components**:
```
Serene/
├── SereneTemplate.jsx       # Main template
├── SereneAboutPage.jsx      # About page view
├── SereneAboutEditorPage.jsx # About page editor
└── sections/
    ├── HeroSection.jsx
    ├── AboutSection.jsx
    ├── WorkSection.jsx
    ├── GallerySection.jsx
    └── ContactSection.jsx
```

---

#### **3. Chic Template** (Modern chic)

**Location**: `src/templates/Chic/`
**Design Style**: Modern, fashionable, bold typography
**Files**: 6 files

**Components**:
```
Chic/
├── ChicTemplate.jsx
└── sections/
    ├── HeroSection.jsx
    ├── AboutSection.jsx
    ├── WorkSection.jsx
    ├── GallerySection.jsx
    └── ContactSection.jsx
```

---

#### **4. BoldFolio Template** (Bold portfolio)

**Location**: `src/templates/BoldFolio/`
**Design Style**: Bold, impactful, strong visual hierarchy
**Files**: 6 files

**Components**:
```
BoldFolio/
├── BoldFolioTemplate.jsx
└── sections/
    ├── HeroSection.jsx
    ├── AboutSection.jsx
    ├── WorkSection.jsx
    ├── ContactSection.jsx
    └── TestimonialsSection.jsx (optional)
```

---

### 8.3 Shared Template Resources

**Location**: `src/templates/Shared/`

**Backgrounds/** (4 animated backgrounds):
- `Aurora.jsx` - Northern lights inspired animation
- `Plasma.jsx` - Liquid plasma effect
- `Prism.jsx` - Geometric prism patterns
- `Silk.jsx` - Flowing silk animation

**Components/** - Reusable template UI elements

**Animations/** - GSAP animation configurations

---

### 8.4 Template System Flow

```
┌─────────────────────────────────────────────────────────────┐
│  1. TEMPLATE DEFINITION (Frontend)                          │
│     - Create template in src/templates/                     │
│     - Define JSON schema for structure                      │
│     - Create default content                                │
│     - Build React components                                │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  2. DATABASE SYNC (Backend)                                 │
│     - Use templateMigration.js utilities                    │
│     - Run window.resyncTemplates() in console               │
│     - Template stored in MongoDB                            │
│     - Available via API                                     │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  3. TEMPLATE SELECTION (User)                               │
│     - User browses template gallery                         │
│     - Preview available at /template-preview/{name}         │
│     - User selects template for new portfolio               │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  4. SCHEMA-DRIVEN FORMS (Builder)                           │
│     - SchemaFormGenerator reads JSON schema                 │
│     - Dynamically generates form fields                     │
│     - User fills in content                                 │
│     - Real-time validation against schema                   │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  5. TEMPLATE RENDERING (Preview/Published)                  │
│     - Template component receives portfolio content         │
│     - Renders based on template-specific design             │
│     - Live preview in editor                                │
│     - Published view at /portfolio/{slug}                   │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  6. TEMPLATE MIGRATION (Optional)                           │
│     - User switches to different template                   │
│     - TemplateChangeModal handles migration                 │
│     - Content mapped between template structures            │
│     - Validation against new template schema                │
└─────────────────────────────────────────────────────────────┘
```

### 8.5 Template Migration

**Utility**: `src/utils/templateMigration.js`

**Functions**:
- `autoMigrateIfNeeded()` - Auto-sync on app start (disabled by default)
- `migrateAllTemplates()` - Sync all templates to backend
- `migrateSingleTemplate(templateId)` - Sync specific template
- `mapContentBetweenTemplates(oldTemplate, newTemplate, content)` - Content migration

**Console Access**:
```javascript
// Available in browser console
window.resyncTemplates(); // Sync all templates
window.resyncEchelon();   // Sync Echelon template only
```

**Usage**:
```javascript
// When user switches template
const migrateToNewTemplate = async (currentContent, newTemplateId) => {
  const currentTemplate = await templateStore.getTemplateById(currentTemplateId);
  const newTemplate = await templateStore.getTemplateById(newTemplateId);

  const migratedContent = mapContentBetweenTemplates(
    currentTemplate,
    newTemplate,
    currentContent
  );

  // Validate migrated content
  const validation = await templateStore.validatePortfolioContent(
    newTemplateId,
    migratedContent
  );

  if (!validation.valid) {
    throw new Error('Migration failed validation');
  }

  return migratedContent;
};
```

---

## 9. Custom Hooks & Utilities

### 9.1 Custom Hooks (5 hooks)

#### **usePortfolioBuilder.js**
**Purpose**: Manages portfolio builder state and operations

**Features**:
- Form data management
- Auto-save functionality
- Undo/redo stack
- Validation against template schema
- Integration with portfolioStore

**Usage**:
```javascript
const {
  formData,
  updateField,
  savePortfolio,
  isSaving,
  hasUnsavedChanges,
  undo,
  redo,
  canUndo,
  canRedo
} = usePortfolioBuilder(portfolioId);
```

---

#### **useImageUpload.js**
**Purpose**: Wraps uploadStore for simplified image uploads

**Features**:
- Single/batch upload
- Progress tracking
- Error handling
- Retry failed uploads

**Usage**:
```javascript
const {
  upload,
  uploadMultiple,
  getProgress,
  isUploading,
  error,
  retry
} = useImageUpload();

// Single upload
const url = await upload(file);

// Batch upload
const urls = await uploadMultiple([file1, file2, file3]);
```

---

#### **useTemplateChange.js**
**Purpose**: Handles template switching logic

**Features**:
- Content migration between templates
- Validation compatibility
- Conflict resolution
- Rollback on failure

**Usage**:
```javascript
const {
  changeTemplate,
  isChanging,
  conflicts,
  resolveConflicts
} = useTemplateChange(portfolioId);

await changeTemplate(newTemplateId, {
  migrateContent: true,
  preserveImages: true
});
```

---

#### **useTemplateValidation.js**
**Purpose**: Validates portfolio content against template schema

**Features**:
- Real-time validation
- Field-level error messages
- Schema compliance checking

**Usage**:
```javascript
const {
  validate,
  errors,
  isValid,
  getFieldError
} = useTemplateValidation(templateId);

const valid = await validate(portfolioContent);
const titleError = getFieldError('hero.title');
```

---

#### **useMediaQuery.js**
**Purpose**: Responsive design hook for screen size detection

**Usage**:
```javascript
const isMobile = useMediaQuery('(max-width: 768px)');
const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
const isDesktop = useMediaQuery('(min-width: 1025px)');
```

---

### 9.2 Utility Modules (6 utilities)

#### **portfolioUtils.js**
**Purpose**: Data transformation functions for portfolios

**Functions**:
- `normalizePortfolioData(data)` - Normalize portfolio structure
- `extractSections(content)` - Extract sections from content
- `validateFieldValues(field, value)` - Field-level validation
- `generateSlug(title)` - Generate URL-friendly slug
- `mergePortfolioData(base, updates)` - Deep merge portfolio data

---

#### **templateAnalyzer.js**
**Purpose**: Analyzes template structure and compatibility

**Functions**:
- `analyzeTemplate(template)` - Extract template metadata
- `compareTemplates(template1, template2)` - Find differences
- `checkCompatibility(oldTemplate, newTemplate)` - Migration compatibility
- `extractRequiredFields(schema)` - Get required fields from schema

---

#### **templateMigration.js**
**Purpose**: Frontend-to-backend template synchronization

**Functions**:
- `autoMigrateIfNeeded()` - Auto-sync on app start (disabled)
- `migrateAllTemplates()` - Sync all templates to backend
- `migrateSingleTemplate(templateId)` - Sync specific template
- `mapContentBetweenTemplates(oldTpl, newTpl, content)` - Content migration

**Console API**:
```javascript
window.resyncTemplates();  // Sync all templates
window.resyncEchelon();    // Sync Echelon only
window.resyncSerene();     // Sync Serene only
window.resyncChic();       // Sync Chic only
window.resyncBoldFolio();  // Sync BoldFolio only
```

---

#### **animationConfig.js**
**Purpose**: GSAP animation configurations

**Presets**:
- `fadeIn` - Fade in animation
- `slideUp` - Slide up from bottom
- `scaleIn` - Scale from 0 to 1
- `staggerChildren` - Stagger child elements
- `timeline` - Create GSAP timeline

**Usage**:
```javascript
import { fadeIn, slideUp, staggerChildren } from './animationConfig';

gsap.to(element, fadeIn);
gsap.from(element, slideUp);
gsap.from(children, staggerChildren(0.1));
```

---

#### **cn.js**
**Purpose**: Class name utility for conditional classes

**Usage**:
```javascript
import cn from './utils/cn';

const classes = cn(
  'base-class',
  isActive && 'active-class',
  isDisabled ? 'disabled' : 'enabled'
);
```

---

#### **uploadPendingImages.js**
**Purpose**: Handles pending image uploads

**Functions**:
- `queueImage(file)` - Add to upload queue
- `uploadPending()` - Upload all queued images
- `clearQueue()` - Clear upload queue
- `getQueueStatus()` - Get queue statistics

---

## 10. Configuration & Build

### 10.1 Environment Variables

**File**: `.env` (gitignored)

```bash
# API Configuration
VITE_API_BASE_URL=https://aurea-backend-production-8a87.up.railway.app
VITE_API_TIMEOUT=10000
VITE_NODE_ENV=development
```

**Important**:
- All environment variables must be prefixed with `VITE_` to be accessible
- Variables are **publicly visible** in browser bundle (no sensitive credentials)
- Access via `import.meta.env.VITE_API_BASE_URL`

---

### 10.2 Vite Configuration

**File**: `vite.config.js`

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),           // React Fast Refresh + JSX transform
    tailwindcss()      // Tailwind CSS integration
  ],

  // Production optimizations
  esbuild: {
    drop: process.env.NODE_ENV === 'production'
      ? ['console', 'debugger']  // Remove in production
      : []
  },

  // Build configuration
  build: {
    target: 'es2015',
    minify: 'esbuild',
    sourcemap: process.env.NODE_ENV !== 'production',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          animations: ['framer-motion', 'gsap'],
          forms: ['react-hook-form', '@tiptap/react']
        }
      }
    }
  },

  // Dev server
  server: {
    port: 5173,
    open: true,
    cors: true
  }
});
```

**Build Optimizations**:
- ✅ Tree-shaking enabled
- ✅ Code splitting (automatic + manual chunks)
- ✅ Console statements removed in production
- ✅ Debugger statements removed in production
- ✅ esbuild minification (fast)
- ✅ Source maps in development only

---

### 10.3 Tailwind Configuration

**File**: `tailwind.config.js`

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Monda", "sans-serif"]  // Custom font
      },
      animation: {
        spin: "spin 1s linear infinite",
        ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        bounce: "bounce 1s infinite"
      },
      colors: {
        // Custom colors (if defined)
      }
    }
  },
  plugins: []
}
```

**Tailwind Features**:
- ✅ Utility-first CSS
- ✅ Custom font (Monda from Google Fonts)
- ✅ Custom animations
- ✅ Responsive variants
- ✅ Production purging (automatic)

---

### 10.4 Vercel Deployment

**File**: `vercel.json`

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Purpose**: SPA routing support - all routes serve `index.html`

**Deployment**:
```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to Vercel (automatic via Git integration)
git push origin main
```

---

### 10.5 NPM Scripts

**File**: `package.json`

```json
{
  "scripts": {
    "predev": "npm install",
    "dev": "vite",
    "prebuild": "npm install",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --fix"
  }
}
```

**Usage**:
```bash
npm run dev      # Start dev server at http://localhost:5173
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint with auto-fix
```

---

## 11. Styling Approach

### 11.1 CSS Framework

**Framework**: Tailwind CSS 4.1.13

**Strategy**: Utility-first styling with minimal custom CSS

**Benefits**:
- ✅ No CSS naming conflicts
- ✅ Consistent design system
- ✅ Responsive variants built-in
- ✅ Purging unused styles in production
- ✅ Small CSS bundle size

### 11.2 Global Styles

**File**: `src/index.css`

```css
@import 'tailwindcss';

/* Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Monda:wght@400;700&display=swap');

/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Monda', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### 11.3 Tailwind Usage Patterns

**Example Component**:
```javascript
function Button({ variant = 'primary', children, onClick }) {
  const baseClasses = "px-6 py-3 rounded-lg font-semibold transition-all";
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

**Responsive Design**:
```javascript
<div className="
  flex flex-col          /* Mobile: stack vertically */
  md:flex-row            /* Tablet: horizontal layout */
  lg:grid lg:grid-cols-3 /* Desktop: 3-column grid */
  gap-4 p-4
">
  {/* Content */}
</div>
```

---

## 12. Performance Optimizations

### 12.1 Code Splitting & Lazy Loading

**Strategy**:
```javascript
// Eager load (HomePage only)
import HomePage from './pages/HomePage';

// Lazy load (all other pages)
const DashboardNew = lazy(() => import('./pages/DashboardNew'));
const AccountNew = lazy(() => import('./pages/AccountNew'));
const PortfolioBuilderPage = lazy(() => import('./pages/PortfolioBuilderPage'));
// ... 18 more lazy imports

// Wrap in Suspense with fallback
<Suspense fallback={<PageLoader />}>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/dashboard" element={<DashboardNew />} />
  </Routes>
</Suspense>
```

**Benefits**:
- ✅ Initial bundle size reduced by ~70%
- ✅ Faster First Contentful Paint (FCP)
- ✅ On-demand loading for routes
- ✅ Better caching (split bundles)

---

### 12.2 Image Optimization

**Client-Side Compression**:
```javascript
import imageCompression from 'browser-image-compression';

const compressImage = async (file) => {
  const options = {
    maxSizeMB: 1,              // Max 1MB
    maxWidthOrHeight: 1920,    // Max dimension
    useWebWorker: true,        // Use web worker (non-blocking)
    fileType: 'image/webp'     // Convert to WebP
  };

  return await imageCompression(file, options);
};
```

**Upload Flow**:
```
1. User selects file
   ↓
2. Compress in browser (1920px, 1MB max, WebP)
   ↓
3. Create instant blob preview (URL.createObjectURL)
   ↓
4. Upload compressed file to backend → Cloudinary
   ↓
5. Store Cloudinary URL, cleanup blob URL
```

**Lazy Loading Images**:
```javascript
<img
  src={lowResPreview}
  data-src={highResUrl}
  loading="lazy"  // Native lazy loading
  className="opacity-0 transition-opacity duration-300"
  onLoad={(e) => e.target.classList.remove('opacity-0')}
/>
```

---

### 12.3 State Management Optimizations

**Portfolio List Caching** (30 seconds):
```javascript
// portfolioStore.js
const CACHE_DURATION = 30 * 1000;

fetchUserPortfolios: async (published, forceRefresh = false) => {
  const now = Date.now();
  const lastFetch = get().lastFetchTime;

  // Skip fetch if data is fresh
  if (!forceRefresh && lastFetch && (now - lastFetch) < CACHE_DURATION) {
    return { cached: true, portfolios: get().portfolios };
  }

  // Fetch from backend
  const portfolios = await portfolioApi.getUserPortfolios(published);
  set({ portfolios, lastFetchTime: now });
  return { cached: false, portfolios };
}
```

**Template Caching** (in-memory Map):
```javascript
// templateStore.js
templateCache: new Map(),
schemaCache: new Map(),

getTemplateById: async (id) => {
  // Check cache first
  if (get().templateCache.has(id)) {
    return { template: get().templateCache.get(id), fromCache: true };
  }

  // Fetch and cache
  const template = await templateApi.getTemplateById(id);
  get().templateCache.set(id, template);
  return { template, fromCache: false };
}
```

**Optimistic UI Updates**:
```javascript
updatePortfolioOptimistic: (id, updates) => {
  // 1. Update UI immediately
  set(state => ({
    portfolios: state.portfolios.map(p =>
      p._id === id ? { ...p, ...updates } : p
    )
  }));

  // 2. Send to backend (async)
  portfolioApi.update(id, updates).catch((error) => {
    // 3. Rollback on error
    set(state => ({
      portfolios: state.portfolios.map(p =>
        p._id === id ? { ...p, ...originalData } : p
      )
    }));
    toast.error('Update failed, changes reverted');
  });
}
```

---

### 12.4 Upload Optimization (Instant Preview)

**Fake + Real Progress**:
```javascript
// uploadStore.js
startUpload: (file, uploadId) => {
  // 1. Instant blob preview
  const preview = URL.createObjectURL(file);
  set(state => ({
    uploads: {
      ...state.uploads,
      [uploadId]: { file, preview, progress: 0, status: 'uploading' }
    }
  }));

  // 2. Fake fast progress: 0 → 30% in 300ms
  setTimeout(() => updateProgress(uploadId, 30), 300);
}

updateProgress: (uploadId, progress) => {
  // 3. Real progress: map 0-100 to 30-100
  const mappedProgress = 30 + (progress * 0.7);
  set(state => ({
    uploads: {
      ...state.uploads,
      [uploadId]: { ...state.uploads[uploadId], progress: mappedProgress }
    }
  }));
}
```

**Perceived Performance**:
```
User sees:
0ms:   File selected
10ms:  Preview appears (feels instant!)
300ms: Progress at 30% (fast!)
1-5s:  Progress 30% → 100% (real upload)
```

---

### 12.5 Bundle Optimization

**Manual Chunks** (vite.config.js):
```javascript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor': ['react', 'react-dom', 'react-router-dom'],
        'animations': ['framer-motion', 'gsap', 'lenis'],
        'forms': ['react-hook-form', '@tiptap/react'],
        'utils': ['axios', 'zustand', 'react-hot-toast']
      }
    }
  }
}
```

**Benefits**:
- ✅ Better caching (vendor bundle rarely changes)
- ✅ Parallel loading of chunks
- ✅ Smaller individual bundles

**Production Build**:
```bash
npm run build

# Output:
dist/
├── index.html
├── assets/
│   ├── vendor-[hash].js      # 200KB (React, Router)
│   ├── animations-[hash].js  # 150KB (Framer, GSAP)
│   ├── forms-[hash].js       # 100KB (Hook Form, TipTap)
│   ├── utils-[hash].js       # 80KB (Axios, Zustand)
│   ├── HomePage-[hash].js    # 50KB (eager loaded)
│   ├── Dashboard-[hash].js   # 30KB (lazy)
│   ├── Builder-[hash].js     # 40KB (lazy)
│   └── index-[hash].css      # 15KB (Tailwind purged)
```

---

### 12.6 Network Optimization

**DNS Prefetch & Preconnect**:
```html
<!-- public/index.html -->
<head>
  <!-- DNS prefetch -->
  <link rel="dns-prefetch" href="https://aurea-backend-production-8a87.up.railway.app">
  <link rel="dns-prefetch" href="https://res.cloudinary.com">

  <!-- Preconnect for critical domains -->
  <link rel="preconnect" href="https://aurea-backend-production-8a87.up.railway.app" crossorigin>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
</head>
```

**Retry Logic** (baseApi.js):
```javascript
// Exponential backoff retry (3 attempts)
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1s base

const retry = async (fn, attempt = 0) => {
  try {
    return await fn();
  } catch (error) {
    if (attempt < MAX_RETRIES && isNetworkError(error)) {
      const delay = RETRY_DELAY * Math.pow(2, attempt);
      await sleep(delay);
      return retry(fn, attempt + 1);
    }
    throw error;
  }
};
```

---

## 13. Request Flow Examples

### 13.1 Creating a Portfolio

**Complete Flow**:

```
┌──────────────────────────────────────────────────────────────┐
│  1. USER INTERACTION                                         │
│     User clicks "Create Portfolio" button                    │
│     Opens template selection modal                           │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│  2. TEMPLATE SELECTION (DashboardNew.jsx)                    │
│     User selects template (e.g., "Echelon")                 │
│     Navigates to /portfolio-builder/new                      │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│  3. TEMPLATE SETUP (DynamicTemplateSetup.jsx)                │
│     • Fetch template from templateStore                      │
│     • Load JSON schema                                       │
│     • Generate default content                               │
│     • Show setup wizard                                      │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│  4. USER FILLS FORM (SchemaFormGenerator.jsx)                │
│     • Schema-driven form fields                              │
│     • User enters: title, subtitle, bio, skills, etc.       │
│     • Real-time validation against schema                    │
│     • Image uploads with instant preview                     │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│  5. SAVE PORTFOLIO (portfolioStore.createPortfolio)          │
│     const portfolio = {                                      │
│       title: "My Portfolio",                                 │
│       description: "My work showcase",                       │
│       templateId: "echelon",                                 │
│       content: {                                             │
│         hero: { title: "...", subtitle: "..." },           │
│         about: { name: "...", bio: "...", skills: [...] }, │
│         projects: [...]                                      │
│       }                                                       │
│     };                                                        │
│     portfolioStore.createPortfolio(portfolio);              │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│  6. API CALL (portfolioApi.create)                           │
│     POST /api/portfolios                                     │
│     Headers:                                                  │
│       Authorization: Bearer <JWT>                            │
│       Content-Type: application/json                         │
│     Body: { title, description, templateId, content }       │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│  7. REQUEST INTERCEPTOR (baseApi.js)                         │
│     • Add JWT token from localStorage                        │
│     • Add timestamp for monitoring                           │
│     • Log request in dev mode                                │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│  8. BACKEND API (AUREA Backend)                              │
│     • Validate JWT token                                     │
│     • Validate request body                                  │
│     • Validate content against template schema               │
│     • Save to MongoDB                                        │
│     • Return created portfolio                               │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│  9. RESPONSE INTERCEPTOR (baseApi.js)                        │
│     • Log API duration (e.g., "POST /api/portfolios - 234ms")│
│     • Return response data                                   │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│  10. UPDATE STORE (portfolioStore)                           │
│      • Add portfolio to portfolios array                     │
│      • Set currentPortfolio                                  │
│      • Update portfolioStats                                 │
│      • Cache timestamp for 30s cache                         │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│  11. NAVIGATE TO EDITOR                                      │
│      • Extract portfolio ID from response                    │
│      • Navigate to /portfolio-builder/{id}                  │
│      • Load PortfolioBuilderPage                             │
│      • Show success toast                                    │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│  12. USER CONTINUES EDITING                                  │
│      • Portfolio builder UI loads                            │
│      • Live preview panel shows template                     │
│      • User can continue editing                             │
│      • Auto-save every 30 seconds                            │
└──────────────────────────────────────────────────────────────┘

Total Time: ~500-800ms (with instant UI feedback)
```

---

### 13.2 Image Upload Flow

**Complete Flow with Instant Preview**:

```
┌──────────────────────────────────────────────────────────────┐
│  1. USER SELECTS FILE                                        │
│     <input type="file" accept="image/*" />                  │
│     File: portrait.jpg (3.2MB)                               │
└──────────────────────────────────────────────────────────────┘
                         ↓ (10ms)
┌──────────────────────────────────────────────────────────────┐
│  2. INSTANT BLOB PREVIEW (uploadStore.startUpload)           │
│     const preview = URL.createObjectURL(file);              │
│     uploadStore.set({                                        │
│       [uploadId]: {                                          │
│         file: file,                                          │
│         preview: 'blob:http://localhost:5173/abc123',       │
│         progress: 0,                                         │
│         status: 'uploading'                                  │
│       }                                                       │
│     });                                                       │
│     → User sees image IMMEDIATELY                            │
└──────────────────────────────────────────────────────────────┘
                         ↓ (300ms)
┌──────────────────────────────────────────────────────────────┐
│  3. FAKE FAST PROGRESS                                       │
│     setTimeout(() => {                                       │
│       uploadStore.updateProgress(uploadId, 30);             │
│     }, 300);                                                 │
│     → Progress bar animates to 30%                           │
│     → Feels fast and responsive!                             │
└──────────────────────────────────────────────────────────────┘
                         ↓ (parallel)
┌──────────────────────────────────────────────────────────────┐
│  4. CLIENT-SIDE COMPRESSION                                  │
│     const compressed = await imageCompression(file, {        │
│       maxSizeMB: 1,                                          │
│       maxWidthOrHeight: 1920,                                │
│       fileType: 'image/webp'                                 │
│     });                                                       │
│     → 3.2MB → 800KB (75% reduction!)                         │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│  5. UPLOAD TO BACKEND (uploadApi.uploadImage)                │
│     const formData = new FormData();                         │
│     formData.append('image', compressed);                    │
│                                                               │
│     baseApi.post('/api/upload/single', formData, {          │
│       onUploadProgress: (e) => {                             │
│         const percent = (e.loaded / e.total) * 100;         │
│         uploadStore.updateProgress(uploadId, percent);      │
│       }                                                       │
│     });                                                       │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│  6. REAL PROGRESS UPDATES (30% → 100%)                       │
│     updateProgress(uploadId, 45);  // 30 + (45 * 0.7)       │
│     updateProgress(uploadId, 67);  // 30 + (67 * 0.7)       │
│     updateProgress(uploadId, 89);  // 30 + (89 * 0.7)       │
│     updateProgress(uploadId, 100); // 30 + (100 * 0.7)      │
│     → Smooth progress bar animation                          │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│  7. BACKEND UPLOADS TO CLOUDINARY                            │
│     • Receives compressed WebP file (800KB)                  │
│     • Uploads to Cloudinary                                  │
│     • Returns Cloudinary URL                                 │
│     Response: {                                              │
│       url: "https://res.cloudinary.com/.../portrait.webp"   │
│     }                                                         │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│  8. COMPLETE UPLOAD (uploadStore.completeUpload)             │
│     // Cleanup blob URL to free memory                       │
│     URL.revokeObjectURL(upload.preview);                    │
│                                                               │
│     uploadStore.set({                                        │
│       [uploadId]: {                                          │
│         ...upload,                                           │
│         url: cloudinaryUrl,                                  │
│         progress: 100,                                       │
│         status: 'success'                                    │
│       }                                                       │
│     });                                                       │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│  9. UPDATE PORTFOLIO DATA                                    │
│     portfolioStore.updateField('hero.image', cloudinaryUrl);│
│     → Portfolio now has final Cloudinary URL                │
│     → Auto-save triggered                                    │
└──────────────────────────────────────────────────────────────┘

Perceived Performance:
• Preview appears: 10ms (instant!)
• Progress to 30%: 300ms (feels fast)
• Full upload: 2-5s (real upload time)
• Total user wait: 2-5s with instant feedback
```

---

## 14. Unique Architectural Decisions

### 14.1 Dual Dashboard System

**Rationale**: Migration from old to new design without breaking existing users

**Implementation**:
```
Dashboard/         → Legacy dashboard components
DashboardPage.jsx  → Old dashboard page
Route: /dashboard-old

DashboardNew/      → New dashboard components
DashboardNew.jsx   → New dashboard page (active)
Route: /dashboard  → Uses DashboardNew
```

**Why**:
- ✅ Gradual migration without downtime
- ✅ Fallback available if new dashboard has issues
- ✅ A/B testing opportunity

---

### 14.2 Template Auto-Migration Disabled

**Code**:
```javascript
// templateMigration.js
export const autoMigrateIfNeeded = async () => {
  // Intentionally disabled to prevent fetch errors on startup
  return;
};
```

**Why**:
- ❌ Auto-sync on app start caused unnecessary API calls
- ❌ Fetch errors on cold starts when backend slow
- ✅ Manual sync via console: `window.resyncTemplates()`
- ✅ Prevents unwanted network requests

---

### 14.3 No Console Logs in Production

**Vite Config**:
```javascript
esbuild: {
  drop: process.env.NODE_ENV === 'production'
    ? ['console', 'debugger']  // Stripped in production
    : []
}
```

**Why**:
- ✅ Cleaner production console
- ✅ Smaller bundle size
- ✅ No accidental data leaks
- ✅ Professional appearance

---

### 14.4 JWT in localStorage (Not httpOnly Cookies)

**Implementation**:
```javascript
// authStore.js
login: async (email, password) => {
  const response = await authApi.login({ email, password });
  const { token, user } = response.data;

  // Store in localStorage
  localStorage.setItem('aurea_token', token);

  // Start token monitoring
  startTokenExpirationCheck();
}
```

**Why**:
- ✅ Simplicity for development
- ✅ Works with all deployment platforms
- ✅ Easy to access from any component
- ❌ Less secure than httpOnly cookies (XSS vulnerability)
- 🔄 Production consideration: Migrate to httpOnly cookies

**Mitigation**:
- ✅ Token expiration monitoring (60s intervals)
- ✅ Auto-logout on expiration
- ✅ No sensitive data in token payload
- ✅ HTTPS only in production

---

### 14.5 Instant Upload Preview with Blob URLs

**Implementation**:
```javascript
// uploadStore.js
const preview = URL.createObjectURL(file);  // Instant local preview
// ... upload to Cloudinary in background
URL.revokeObjectURL(preview);  // Cleanup after upload
```

**Why**:
- ✅ Instant user feedback (10ms vs 2-5s wait)
- ✅ Better perceived performance
- ✅ User can continue editing immediately
- ✅ Memory management via cleanup

**Trade-off**: Slightly more complex code for better UX

---

### 14.6 Optimistic UI Updates

**Pattern**:
```javascript
// portfolioStore.js
updatePortfolioOptimistic: (id, updates) => {
  // 1. Update UI immediately
  set(state => ({ portfolios: updatedPortfolios }));

  // 2. Send to backend (async)
  portfolioApi.update(id, updates).catch((error) => {
    // 3. Rollback on error
    set(state => ({ portfolios: originalPortfolios }));
    toast.error('Update failed, changes reverted');
  });
}
```

**Why**:
- ✅ Instant user feedback
- ✅ Better perceived performance
- ✅ Rollback mechanism for errors
- ✅ Professional UX

---

### 14.7 Template Caching in Memory (Not localStorage)

**Implementation**:
```javascript
// templateStore.js
templateCache: new Map(),  // In-memory
schemaCache: new Map(),    // In-memory
// NOT localStorage
```

**Why**:
- ✅ Faster access (no JSON parse)
- ✅ Survives navigation (until page refresh)
- ✅ No localStorage quota issues
- ✅ Automatic cleanup on page refresh
- ❌ Lost on page refresh (acceptable trade-off)

---

### 14.8 Silent 404 Errors During Editing

**Error Handling**:
```javascript
// baseApi.js response interceptor
case 404:
  // Silent - don't show toast
  // Prevents false warnings during editing
  break;
```

**Why**:
- ❌ Showing 404 toasts during editing was annoying
- ❌ Frequent false positives (e.g., unsaved portfolio ID)
- ✅ Silent handling prevents notification spam
- ✅ Real 404s still logged in console (dev mode)

---

### 14.9 No TypeScript

**Decision**: Pure JavaScript/JSX project

**Why**:
- ✅ Faster development (no type definitions)
- ✅ Simpler setup (no tsconfig)
- ✅ Smaller learning curve for contributors
- ❌ No compile-time type checking
- ❌ Relies on runtime validation

**Mitigation**:
- ✅ Extensive JSDoc comments
- ✅ PropTypes in some components
- ✅ Schema validation via JSON schemas

---

### 14.10 Schema-Driven Forms

**Architecture**:
```javascript
// Backend defines structure
const schema = {
  type: 'object',
  properties: {
    hero: {
      type: 'object',
      properties: {
        title: { type: 'string', maxLength: 100 }
      }
    }
  }
};

// Frontend dynamically generates form
<SchemaFormGenerator schema={schema} value={content} onChange={handleChange} />
```

**Why**:
- ✅ Flexible for new templates (no frontend changes needed)
- ✅ Backend controls structure
- ✅ Automatic validation
- ✅ Consistent UI across templates
- ✅ Easy to add new field types

---

## 15. Security Considerations

### 15.1 Frontend Security Measures

**1. No Sensitive Credentials in Frontend**:
```javascript
// ❌ NEVER in frontend code or .env
const CLOUDINARY_API_KEY = 'abc123';  // WRONG!

// ✅ All uploads via backend proxy
const url = await uploadApi.uploadImage(file);  // Backend handles Cloudinary
```

**2. JWT Token Management**:
```javascript
// ✅ Token stored in localStorage (consider httpOnly cookies for production)
localStorage.setItem('aurea_token', token);

// ✅ Token expiration monitoring (60s intervals)
startTokenExpirationCheck();

// ✅ Auto-logout on expiration
if (isTokenExpired(token)) {
  logout();
  navigate('/login');
}
```

**3. XSS Prevention**:
- ✅ React auto-escapes rendered content
- ✅ Rich text sanitized via TipTap
- ✅ No `dangerouslySetInnerHTML` usage
- ✅ Helmet CSP headers from backend

**4. CORS Strategy**:
```javascript
// Backend validates origin
// Frontend makes requests from allowed origins only
baseURL: import.meta.env.VITE_API_BASE_URL
```

**5. Input Validation**:
```javascript
// ✅ Client-side validation (UX)
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ✅ Server-side validation (security)
// Backend validates all inputs via express-validator
```

### 15.2 Known Security Limitations

**1. Environment Variables Publicly Visible**:
```javascript
// ⚠️ WARNING: All VITE_* variables visible in browser bundle
VITE_API_BASE_URL=https://aurea-backend...  // Public
```

**Mitigation**: Never put sensitive credentials in frontend `.env`

**2. JWT in localStorage (XSS Risk)**:
- ⚠️ Vulnerable to XSS attacks
- 🔄 Production recommendation: Migrate to httpOnly cookies
- ✅ Current mitigation: Token expiration monitoring, HTTPS only

**3. No Rate Limiting on Frontend**:
- Frontend doesn't limit requests
- ✅ Backend has rate limiting (protection)

**4. Client-Side Form Validation Only**:
- User can bypass frontend validation
- ✅ Backend has server-side validation (critical)

---

## 16. Development Workflows

### 16.1 Adding a New Template

**Steps**:

1. **Create Template Directory**:
```bash
mkdir src/templates/YourTemplate
cd src/templates/YourTemplate
```

2. **Create Template Component**:
```javascript
// YourTemplate.jsx
export const YourTemplate = ({ portfolio }) => {
  return (
    <div>
      <HeroSection data={portfolio.content.hero} />
      <AboutSection data={portfolio.content.about} />
      {/* More sections */}
    </div>
  );
};

// Define JSON schema
export const yourTemplateSchema = {
  type: 'object',
  properties: {
    hero: { type: 'object', properties: { title: { type: 'string' } } },
    about: { type: 'object', properties: { name: { type: 'string' } } }
  }
};

// Default content
export const yourTemplateDefaults = {
  hero: { title: 'Welcome' },
  about: { name: 'Your Name' }
};
```

3. **Create Sections**:
```bash
mkdir sections
# Create HeroSection.jsx, AboutSection.jsx, etc.
```

4. **Add Template Export**:
```javascript
// src/templates/index.js
export { YourTemplate, yourTemplateSchema, yourTemplateDefaults } from './YourTemplate';
```

5. **Sync to Backend**:
```javascript
// In browser console
window.resyncTemplates(); // Syncs all templates to backend
```

6. **Add Preview Route**:
```javascript
// App.jsx
const YourTemplatePreview = lazy(() => import('./pages/YourTemplatePreviewPage'));

<Route path="/template-preview/yourtemplate" element={<YourTemplatePreview />} />
```

7. **Test**:
```bash
npm run dev
# Navigate to http://localhost:5173/template-preview/yourtemplate
```

---

### 16.2 Working with Images

**Upload Flow**:
```javascript
import { useUploadStore } from './stores/uploadStore';
import { uploadApi } from './lib/uploadApi';

function ImageUploadComponent() {
  const { startUpload, updateProgress, completeUpload, getPreviewUrl } = useUploadStore();

  const handleUpload = async (file) => {
    const uploadId = `upload-${Date.now()}`;

    // 1. Start upload with instant blob preview
    startUpload(file, uploadId);

    // 2. Show preview immediately
    const previewUrl = getPreviewUrl(uploadId);
    setLocalPreview(previewUrl); // User sees image instantly

    // 3. Upload to Cloudinary via backend
    const cloudinaryUrl = await uploadApi.uploadImage(file, (progress) => {
      updateProgress(uploadId, progress);
    });

    // 4. Complete and get final URL
    completeUpload(uploadId, cloudinaryUrl);

    return cloudinaryUrl;
  };
}
```

---

### 16.3 Debugging API Issues

**Steps**:

1. **Check Network Tab**:
```
DevTools → Network → XHR/Fetch
Look for failed requests
```

2. **Verify JWT Token**:
```javascript
// In browser console
localStorage.getItem('aurea_token');
// Should return JWT token string
```

3. **Check Auth State**:
```javascript
// In browser console
useAuthStore.getState();
// Returns: { user, isAuthenticated, isLoading }
```

4. **Verify Backend URL**:
```javascript
// In browser console
import.meta.env.VITE_API_BASE_URL;
// Should return: https://aurea-backend-production-8a87.up.railway.app
```

5. **Check API Logs** (dev mode):
```
Console will show:
[API Request] POST /api/portfolios
[API Response] /api/portfolios - 234ms
```

6. **Test Backend Directly**:
```bash
curl -X GET https://aurea-backend-production-8a87.up.railway.app/health
```

---

### 16.4 Testing Portfolio Publishing

**Steps**:

1. **Create Portfolio**:
```
Dashboard → Create Portfolio → Select Template → Fill Form → Save
```

2. **Edit Content**:
```
Portfolio Builder → Edit Sections → Save Changes
```

3. **Publish**:
```
Editor Navbar → Publish Button → PublishModal
Options:
- Vercel deployment
- Subdomain (e.g., "yourname" → aurea.tool/yourname)
- Custom domain (premium)
```

4. **Access Published Portfolio**:
```
Subdomain: https://aurea.tool/yourname/html
Case Study: https://aurea.tool/yourname/case-study-projectId.html
```

5. **Verify**:
```
- Check HTML is served correctly
- Images load from Cloudinary
- Responsive design works
- Case studies accessible
```

---

## Conclusion

The AUREA Frontend is a **production-ready, modern React application** built with performance and user experience as top priorities:

- **48,596 lines of code** across **171 files**
- **Component-based architecture** with feature-based organization
- **Zustand state management** (4 stores) with intelligent caching
- **Dynamic template system** powered by JSON schemas
- **Instant upload preview** with perceived performance optimizations
- **Comprehensive API layer** with retry logic and error handling
- **Lazy loading** for 95% of routes (performance)
- **Production-ready build** with Vite and Tailwind CSS

The architecture demonstrates **professional development practices** including optimistic updates, caching strategies, error boundaries, and performance optimizations, making it suitable for scaling and future enhancements.

---

**Document Version**: 1.0.0
**Last Updated**: November 14, 2025
**Author**: AUREA Development Team
**Status**: Complete ✅
