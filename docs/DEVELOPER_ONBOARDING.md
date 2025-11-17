# AUREA Frontend - Developer Onboarding Guide

**Welcome to the AUREA Frontend Team!**

This comprehensive guide will take you from new developer to productive team member. Estimated reading time: 2-3 hours. Work through sections progressively.

---

## 📚 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack-deep-dive)
3. [Getting Started](#3-getting-started)
4. [Architecture Overview](#4-architecture-overview)
5. [State Management with Zustand](#5-state-management-with-zustand)
6. [API Integration Layer](#6-api-integration-layer)
7. [Routing & Navigation](#7-routing--navigation)
8. [Component Architecture](#8-component-architecture)
9. [Template System](#9-template-system)
10. [Custom Hooks](#10-custom-hooks)
11. [Common Development Tasks](#11-common-development-tasks)
12. [Best Practices](#12-best-practices--patterns)
13. [Testing & Debugging](#13-testing--debugging)
14. [Performance Optimization](#14-performance-optimization)
15. [Resources & Next Steps](#15-resources--next-steps)

---

## 1. Project Overview

### 1.1 What is AUREA?

AUREA is a modern portfolio builder platform that enables users to create, customize, and publish professional portfolios with case studies using database-driven templates. Think of it as "Squarespace for portfolios" with advanced customization capabilities.

**Key Features:**
- **4 Premium Templates**: Echelon, Serene, Chic, BoldFolio
- **Schema-Driven Form Generation**: Dynamic forms based on template structure
- **Real-Time Preview**: See changes instantly as you edit
- **Instant Image Upload**: Blob-based preview before cloud upload
- **Dual Publishing**: Vercel deployment or custom subdomain hosting
- **Case Study System**: Detailed project documentation pages
- **Responsive Design**: Mobile-first, works on all devices

### 1.2 Tech Stack Summary

**Frontend:**
- **React 19.1.1** - UI framework with latest concurrent features
- **Vite 7.1.2** - Lightning-fast build tool (200ms startup)
- **Zustand 5.0.8** - Lightweight state management (1KB)
- **React Router 7.9.0** - Client-side routing
- **Tailwind CSS 4.1.13** - Utility-first styling
- **Framer Motion 12.23.12** - Smooth animations
- **Axios 1.12.1** - HTTP client with interceptors

**Development:**
- **ES6+ JavaScript** - Modern JavaScript features
- **ESLint** - Code quality enforcement
- **Hot Module Replacement** - Instant UI updates
- **Lazy Loading** - Route-based code splitting

### 1.3 Codebase Statistics

```
Total Lines: 48,596
Total Files: 171 JavaScript files
State Management: 4 Zustand stores (1,196 lines)
Components: 75 components
Pages: 22 pages (21 lazy-loaded)
Templates: 4 templates (48 files)
API Modules: 9 modules
Custom Hooks: 5 hooks
Utilities: 6 utility modules
```

---

## 2. Technology Stack Deep Dive

### 2.1 Why This Stack?

**React 19.1.1:**
- Automatic batching (better performance)
- Improved concurrent rendering
- Transitions API for smooth UX
- Server Component ready (future)

**Vite 7.1.2 over Create React App:**
- ⚡ **10x faster** - Instant HMR (< 50ms)
- 📦 **Smaller bundles** - esbuild + Rollup
- 🎯 **Native ESM** - No bundling in dev
- 🔧 **Simple config** - 20 lines vs 200+

**Zustand over Redux:**
- 🎯 **90% less boilerplate** - No actions/reducers
- 📦 **98% smaller** - 1KB vs 11KB + React-Redux
- ⚡ **Faster** - Direct subscriptions
- 💾 **Built-in persistence** - localStorage sync

**Tailwind CSS over CSS-in-JS:**
- 🎨 **Design system** - Consistent spacing, colors
- 📦 **Tree-shaking** - Only used classes shipped
- ⚡ **No runtime** - Unlike styled-components
- 📱 **Mobile-first** - Responsive utilities

### 2.2 Key Dependencies Explained

```json
{
  "dependencies": {
    // Core
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-router-dom": "^7.9.0",

    // State & Data
    "zustand": "^5.0.8",                  // Global state
    "axios": "^1.12.1",                   // HTTP client

    // UI & Styling
    "tailwindcss": "^4.1.13",             // Utility CSS
    "@headlessui/react": "^2.2.0",        // Accessible UI components
    "@heroicons/react": "^2.2.0",         // Icon library

    // Rich Content
    "@tiptap/react": "^3.4.2",            // Rich text editor
    "@tiptap/starter-kit": "^3.4.2",      // TipTap plugins

    // Animations
    "framer-motion": "^12.23.12",         // Declarative animations
    "gsap": "^3.13.0",                    // Advanced animations
    "lenis": "^1.1.20",                   // Smooth scroll

    // File Handling
    "react-dropzone": "^14.3.9",          // Drag & drop
    "react-easy-crop": "^5.1.2",          // Image cropping
    "browser-image-compression": "^2.0.3", // Client-side compression

    // Drag & Drop
    "@dnd-kit/core": "^6.3.1",            // Accessible DnD
    "@dnd-kit/sortable": "^9.0.5",        // List reordering

    // Utilities
    "react-hot-toast": "^2.6.0",          // Toast notifications
    "clsx": "^2.1.1",                     // Conditional classes
    "tailwind-merge": "^2.7.2"            // Merge Tailwind classes
  }
}
```

### 2.3 Development Tools

**Vite Configuration** (`vite.config.js`):
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),           // JSX transformation, Fast Refresh
    tailwindcss()      // Tailwind processing
  ],

  esbuild: {
    drop: process.env.NODE_ENV === 'production'
      ? ['console', 'debugger']  // Remove in prod
      : []
  },

  server: {
    port: 5173,        // Dev server port
    host: true,        // Expose to network
    open: false        // Don't auto-open browser
  },

  build: {
    outDir: 'dist',
    sourcemap: true,   // Enable source maps

    rollupOptions: {
      output: {
        // Code splitting
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'editor': ['@tiptap/react', '@tiptap/starter-kit'],
          'animation': ['framer-motion', 'gsap'],
        }
      }
    }
  }
});
```

**What this enables:**
- Lightning-fast HMR (changes appear in < 50ms)
- Automatic code splitting by route
- Tree shaking (only used code shipped)
- Source maps for debugging

---

## 3. Getting Started

### 3.1 Prerequisites

**Required:**
- Node.js 18+ or 20+ LTS
- npm 9+
- Git
- Backend running at `http://localhost:5000`

**Recommended:**
- VS Code with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - ES7+ React Snippets
- React Developer Tools (browser extension)
- Redux DevTools (for Zustand inspection)

### 3.2 Initial Setup

**Step 1: Clone and Install**
```bash
cd /path/to/Aurea-frontend
npm install
```

**Step 2: Environment Configuration**
```bash
# Create .env file
cat > .env << EOF
VITE_API_BASE_URL=http://localhost:5000
VITE_API_TIMEOUT=10000
EOF
```

**Important:** All environment variables MUST start with `VITE_` to be exposed to the app.

**Step 3: Start Development Server**
```bash
npm run dev

# Expected output:
# VITE v7.1.2  ready in 842 ms
# ➜  Local:   http://localhost:5173/
```

**Step 4: Verify Setup**

Open `http://localhost:5173` and verify:
- [ ] Homepage loads without errors
- [ ] Browser console has no red errors
- [ ] Can navigate to `/login` and `/signup`
- [ ] Backend health check passes: `curl http://localhost:5000/health`

### 3.3 Your First Task

**Goal:** Create a test page to verify your setup.

**Create `src/pages/TestPage.jsx`:**
```jsx
export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-xl p-12 max-w-2xl">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Setup Complete! 🎉
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          You successfully created a new page in the AUREA frontend.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">What you learned:</h3>
          <ul className="list-disc list-inside text-green-800 space-y-1">
            <li>How to create a page component</li>
            <li>How to use Tailwind CSS classes</li>
            <li>How to add routes</li>
            <li>How Hot Module Replacement works</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
```

**Add to `src/App.jsx`:**
```jsx
// At top of file
import TestPage from './pages/TestPage';

// Inside <Routes>
<Route path="/test" element={<TestPage />} />
```

**Access:** Navigate to `http://localhost:5173/test`

**Expected:** You should see your test page with gradient background and success message.

**What you learned:**
- ✅ Creating React components
- ✅ Using Tailwind CSS utilities
- ✅ Adding routes
- ✅ Hot Module Replacement (changes appear instantly)

---

## 4. Architecture Overview

### 4.1 Directory Structure

```
Aurea-frontend/
├── src/
│   ├── App.jsx                  # Root component, routing setup
│   ├── main.jsx                 # Entry point, React 18 root
│   ├── index.css                # Global styles, Tailwind imports
│   │
│   ├── stores/                  # Zustand state management
│   │   ├── authStore.js         # Authentication (247 lines)
│   │   ├── portfolioStore.js    # Portfolio CRUD (320 lines)
│   │   ├── templateStore.js     # Templates (348 lines)
│   │   └── uploadStore.js       # File uploads (281 lines)
│   │
│   ├── lib/                     # API integration layer
│   │   ├── axios.js             # Base axios instance
│   │   ├── authApi.js           # Auth endpoints
│   │   ├── portfolioApi.js      # Portfolio endpoints
│   │   ├── templateApi.js       # Template endpoints
│   │   ├── caseStudyApi.js      # Case study endpoints
│   │   ├── uploadApi.js         # Upload endpoints
│   │   └── ... (9 modules total)
│   │
│   ├── pages/                   # Page components
│   │   ├── HomePage.jsx         # Landing page (eagerly loaded)
│   │   ├── Dashboard.jsx        # User dashboard
│   │   ├── PortfolioBuilder.jsx # Portfolio editor
│   │   └── ... (22 pages, 21 lazy-loaded)
│   │
│   ├── components/              # Reusable components
│   │   ├── PortfolioBuilder/    # Builder-specific (32 components)
│   │   │   ├── FormFields/      # 8 field types
│   │   │   ├── Steps/           # Multi-step flow
│   │   │   ├── Modals/          # Modal dialogs
│   │   │   └── ...
│   │   │
│   │   ├── Shared/              # Common components (10)
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── AnimatedLogo.jsx
│   │   │   └── ...
│   │   │
│   │   └── Dashboard/           # Dashboard components
│   │       ├── OverviewSection.jsx
│   │       ├── QuickActions.jsx
│   │       └── ...
│   │
│   ├── templates/               # Portfolio templates
│   │   ├── index.js             # Template registry
│   │   ├── Echelon/             # Swiss/minimal style
│   │   ├── Serene/              # Botanical/nature style
│   │   ├── Chic/                # Editorial/magazine style
│   │   ├── BoldFolio/           # Bold/creative style
│   │   └── Shared/              # Shared template components
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── usePortfolioBuilder.js # 5 builder hooks
│   │   ├── useImageUpload.js
│   │   ├── useTemplateValidation.js
│   │   └── ... (5 hooks total)
│   │
│   ├── utils/                   # Helper utilities
│   │   ├── portfolioUtils.js    # Data transformation
│   │   ├── templateMigration.js # Template sync
│   │   ├── animationConfig.js   # Framer Motion variants
│   │   └── ... (6 utilities total)
│   │
│   └── assets/                  # Static assets
│       ├── images/
│       └── fonts/
│
├── docs/                        # Documentation
│   ├── SYSTEM_ARCHITECTURE.md
│   ├── DEVELOPER_ONBOARDING.md  # This file
│   └── ... (20+ files)
│
├── public/                      # Public assets
├── package.json
├── vite.config.js
├── tailwind.config.js
├── eslint.config.js
└── .env                         # Environment variables
```

### 4.2 Request Flow Example

**User Action:** Save portfolio content

```
1. User clicks "Save" button
   ↓
2. Component calls portfolioStore.updatePortfolio()
   ↓
3. Store performs optimistic update (UI updates immediately)
   ↓
4. Store calls portfolioApi.update()
   ↓
5. API module sends PATCH /api/portfolios/:id
   ├─ Adds JWT token from authStore
   ├─ Sets Content-Type: application/json
   └─ Includes portfolio data
   ↓
6. Axios interceptor handles response
   ├─ Success → Store updated with server response
   └─ Error → Rollback optimistic update, show error toast
   ↓
7. Component re-renders with updated data
```

### 4.3 Data Flow Architecture

```
┌─────────────────────────────────────────────────┐
│                 User Interface                  │
│           (React Components + Pages)            │
└───────────┬─────────────────────┬───────────────┘
            │                     │
            │ Actions             │ Selectors
            ↓                     ↓
┌─────────────────────────────────────────────────┐
│              Zustand Stores                     │
│   (authStore, portfolioStore, templateStore)    │
└───────────┬─────────────────────────────────────┘
            │
            │ API Calls
            ↓
┌─────────────────────────────────────────────────┐
│           API Integration Layer                 │
│        (axios, authApi, portfolioApi)           │
└───────────┬─────────────────────────────────────┘
            │
            │ HTTP Requests (JWT attached)
            ↓
┌─────────────────────────────────────────────────┐
│            Backend REST API                     │
│         (Node.js/Express on :5000)              │
└─────────────────────────────────────────────────┘
```

### 4.4 Key Architectural Decisions

**1. Zustand over Redux:**
- **Reason:** 90% less boilerplate, 1KB vs 11KB
- **Trade-off:** Less middleware ecosystem
- **Result:** Faster development, simpler codebase

**2. Lazy Loading for All Pages:**
- **Reason:** Initial bundle reduced from 800KB → 200KB
- **Trade-off:** First navigation to new page has small delay
- **Result:** 3x faster initial page load

**3. Client-Side Image Compression:**
- **Reason:** Reduce upload time by 60-80%
- **Trade-off:** Uses user CPU (1-2 seconds)
- **Result:** Better UX, lower bandwidth costs

**4. localStorage for Auth Persistence:**
- **Reason:** Persist sessions across tabs
- **Trade-off:** Vulnerable to XSS (mitigated by httpOnly cookies for refresh tokens)
- **Result:** Better UX, fewer re-authentications

**5. Optimistic Updates:**
- **Reason:** Instant UI feedback
- **Trade-off:** Need rollback logic for errors
- **Result:** App feels 10x faster

---

## 5. State Management with Zustand

### 5.1 Why Zustand?

**Comparison:**

| Feature | Zustand | Redux | Context API |
|---------|---------|-------|-------------|
| Bundle Size | 1.2 KB | 11 KB + 5 KB | 0 KB (built-in) |
| Boilerplate | Minimal | High | Medium |
| Learning Curve | Easy | Steep | Medium |
| Performance | Excellent | Good | Poor (re-renders) |
| DevTools | ✅ (via plugin) | ✅ | ❌ |
| Persistence | ✅ Built-in | Requires middleware | Manual |

**Zustand wins on:**
- Simplicity (no actions, reducers, providers)
- Performance (direct subscriptions)
- DX (less code, faster development)

### 5.2 Store Architecture

AUREA uses **4 specialized stores**, each managing a specific domain:

#### 5.2.1 Auth Store (`stores/authStore.js`)

**Purpose:** User authentication, session management, JWT token handling

**State Schema:**
```javascript
{
  user: {                        // Current user
    _id: string,
    email: string,
    name: string,
    avatar: string,
    isPremium: boolean,
    createdAt: string
  } | null,

  isAuthenticated: boolean,      // Quick auth check
  isLoading: boolean,            // Loading state
  _tokenCheckInterval: number    // Token expiration check (60s)
}
```

**Key Actions:**

```javascript
// Login
login: async (email, password) => {
  const response = await authApi.login({ email, password });

  if (response.success) {
    set({
      user: response.data.user,
      isAuthenticated: true
    });

    // Start token expiration monitoring
    get().startTokenExpirationCheck();

    return { success: true };
  }

  return { success: false, error: response.error };
}

// Signup
signup: async (name, email, password) => {
  const response = await authApi.signup({ name, email, password });

  if (response.success) {
    // Auto-login after signup
    return await get().login(email, password);
  }

  return { success: false, error: response.error };
}

// Logout
logout: () => {
  authApi.logout();
  set({ user: null, isAuthenticated: false });
  get().stopTokenExpirationCheck();
  localStorage.clear();
  window.location.href = '/login';
}

// Check auth status
checkAuth: async () => {
  try {
    const user = await authApi.getCurrentUser();
    set({ user, isAuthenticated: true });
    get().startTokenExpirationCheck();
    return true;
  } catch (error) {
    get().clearAuth();
    return false;
  }
}
```

**Token Expiration Monitoring:**
```javascript
startTokenExpirationCheck: () => {
  // Check every 60 seconds
  const interval = setInterval(() => {
    const token = localStorage.getItem('aurea_token');

    if (!token || !authApi.isAuthenticated()) {
      toast.error('Session expired. Please login again.');
      get().logout();
    }
  }, 60000);

  set({ _tokenCheckInterval: interval });
}

stopTokenExpirationCheck: () => {
  clearInterval(get()._tokenCheckInterval);
  set({ _tokenCheckInterval: null });
}
```

**Persistence Configuration:**
```javascript
persist(
  (set, get) => ({ /* state */ }),
  {
    name: 'aurea-auth-storage',  // localStorage key
    partialize: (state) => ({     // Only persist these
      user: state.user,
      isAuthenticated: state.isAuthenticated,
    }),
  }
)
```

**Usage Example:**
```jsx
import useAuthStore from '../stores/authStore';

function LoginPage() {
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(email, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <input value={password} onChange={e => setPassword(e.target.value)} type="password" />
      <button disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

#### 5.2.2 Portfolio Store (`stores/portfolioStore.js`)

**Purpose:** Portfolio CRUD operations, caching, optimistic updates

**State Schema:**
```javascript
{
  portfolios: [                  // User's portfolios
    {
      _id: string,
      title: string,
      description: string,
      templateId: string,
      content: object,
      styling: object,
      isPublished: boolean,
      slug: string | null,
      createdAt: string,
      updatedAt: string
    }
  ],

  currentPortfolio: Portfolio | null,  // Active portfolio
  portfolioStats: {                    // Dashboard stats
    total: number,
    published: number,
    drafts: number
  } | null,

  isLoading: boolean,
  isCreating: boolean,
  isUpdating: boolean,
  lastFetchTime: number | null   // For 30s cache
}
```

**Caching Strategy:**
```javascript
fetchUserPortfolios: async (published = null, forceRefresh = false) => {
  const now = Date.now();
  const lastFetch = get().lastFetchTime;

  // Use cache if fresh (30 seconds)
  if (!forceRefresh && lastFetch && (now - lastFetch < 30000)) {
    console.log('Using cached portfolios');
    return { success: true, data: get().portfolios };
  }

  set({ isLoading: true });

  try {
    const response = await portfolioApi.getUserPortfolios(published);

    // Handle multiple response formats
    const portfolios = response.data?.data ||
                      response.data?.data?.portfolios ||
                      [];

    set({
      portfolios,
      lastFetchTime: now,
      isLoading: false
    });

    return { success: true, data: portfolios };
  } catch (error) {
    set({ isLoading: false });
    return { success: false, error };
  }
}
```

**Optimistic Updates:**
```javascript
updatePortfolio: async (id, updates) => {
  // 1. Store original for rollback
  const original = get().portfolios.find(p => p._id === id);

  // 2. Optimistic update (UI updates immediately)
  set((state) => ({
    portfolios: state.portfolios.map(p =>
      p._id === id ? { ...p, ...updates } : p
    ),
    isUpdating: true
  }));

  try {
    // 3. Send to backend
    const response = await portfolioApi.update(id, updates);

    // 4. Update with server response
    set((state) => ({
      portfolios: state.portfolios.map(p =>
        p._id === id ? response.data.data.portfolio : p
      ),
      isUpdating: false
    }));

    toast.success('Portfolio updated!');
    return { success: true, data: response.data.data.portfolio };
  } catch (error) {
    // 5. Rollback on error
    set((state) => ({
      portfolios: state.portfolios.map(p =>
        p._id === id ? original : p
      ),
      isUpdating: false
    }));

    toast.error('Update failed');
    return { success: false, error };
  }
}
```

**Usage Example:**
```jsx
function Dashboard() {
  const { portfolios, fetchUserPortfolios, deletePortfolio } = usePortfolioStore();

  useEffect(() => {
    fetchUserPortfolios(); // Uses cache if fresh
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Delete this portfolio?')) {
      const result = await deletePortfolio(id);

      if (result.success) {
        toast.success('Portfolio deleted');
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {portfolios.map(portfolio => (
        <PortfolioCard
          key={portfolio._id}
          {...portfolio}
          onDelete={() => handleDelete(portfolio._id)}
        />
      ))}
    </div>
  );
}
```

#### 5.2.3 Template Store (`stores/templateStore.js`)

**Purpose:** Template management, schema caching, validation

**State Schema:**
```javascript
{
  templates: Template[],         // All available templates
  templateCache: Map<string, Template>,  // Memory cache
  schemaCache: Map<string, Schema>,      // Schema cache
  categories: string[],          // ['creative', 'professional', ...]
  defaultTemplate: Template | null,
  isLoading: boolean,
  isLoadingSchema: boolean,
  error: string | null
}
```

**Multi-Level Caching:**
```javascript
getTemplateById: async (id) => {
  // Level 1: Memory cache (instant)
  const cached = get().templateCache.get(id);
  if (cached) {
    console.log('Template from memory cache');
    return { success: true, template: cached };
  }

  // Level 2: Try from existing templates array
  const existing = get().templates.find(t => t._id === id || t.id === id);
  if (existing) {
    get().templateCache.set(id, existing);
    return { success: true, template: existing };
  }

  // Level 3: Fetch from API
  set({ isLoading: true });

  try {
    const response = await templateApi.getTemplateById(id);
    const template = response.data.data.template;

    // Update caches
    get().templateCache.set(id, template);

    set({
      templates: [...get().templates, template],
      isLoading: false
    });

    return { success: true, template };
  } catch (error) {
    // Level 4: Fallback to static template
    const fallback = get().getFallbackTemplate();
    return { success: true, template: fallback, usedFallback: true };
  }
}
```

**Fallback Strategy:**
```javascript
getFallbackTemplate: () => {
  // 1. Try default template
  if (get().defaultTemplate) {
    return get().defaultTemplate;
  }

  // 2. Try first available
  const templates = get().templates;
  if (templates.length > 0) {
    return templates[0];
  }

  // 3. Hardcoded minimal fallback
  return {
    id: 'minimal',
    name: 'Minimal',
    schema: { sections: [] },
    defaultContent: {},
    styling: {
      colors: { primary: '#000', background: '#fff' },
      fonts: { body: 'Inter, sans-serif' }
    }
  };
}
```

**Create Portfolio from Template:**
```javascript
createPortfolioFromTemplate: async (id, customizations = {}) => {
  const { template } = await get().getTemplateById(id);

  if (!template) {
    throw new Error('Template not found');
  }

  // Deep merge defaults + customizations
  const content = deepMerge(
    template.defaultContent || {},
    customizations.content || {}
  );

  const styling = deepMerge(
    template.styling || {},
    customizations.styling || {}
  );

  return {
    templateId: id,
    content,
    styling,
    structure: template.structure,
    metadata: {
      createdAt: new Date().toISOString(),
      templateVersion: template.version || '1.0.0'
    }
  };
}
```

**Usage Example:**
```jsx
function TemplateSelector() {
  const { templates, fetchTemplates, createPortfolioFromTemplate } = useTemplateStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTemplates({ category: 'creative' });
  }, []);

  const handleSelectTemplate = async (templateId) => {
    const portfolioData = await createPortfolioFromTemplate(templateId);

    // Create portfolio
    const result = await portfolioStore.createPortfolio({
      title: 'New Portfolio',
      ...portfolioData
    });

    if (result.success) {
      navigate(`/portfolio-builder/${result.portfolio._id}`);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {templates.map(template => (
        <TemplateCard
          key={template.id}
          {...template}
          onSelect={() => handleSelectTemplate(template.id)}
        />
      ))}
    </div>
  );
}
```

#### 5.2.4 Upload Store (`stores/uploadStore.js`)

**Purpose:** Track file uploads with instant preview, progress, memory management

**State Schema:**
```javascript
{
  uploads: {
    [uploadId]: {
      file: File,              // Original file
      preview: string,         // Blob URL (blob:http://...)
      progress: number,        // 0-100
      url: string | null,      // Final Cloudinary URL
      error: string | null,
      status: 'uploading' | 'success' | 'error',
      startedAt: number,
      completedAt: number | null,
      failedAt: number | null
    }
  }
}
```

**Instant Preview with Fake Progress:**
```javascript
startUpload: (file, uploadId = Date.now().toString()) => {
  // Create blob URL for instant preview
  const preview = URL.createObjectURL(file);

  set((state) => ({
    uploads: {
      ...state.uploads,
      [uploadId]: {
        file,
        preview,
        progress: 0,
        url: null,
        error: null,
        status: 'uploading',
        startedAt: Date.now(),
        completedAt: null,
        failedAt: null
      }
    }
  }));

  // Fake fast progress: 0 → 30% in 300ms (perceived speed)
  let progress = 0;
  const fakeProgressInterval = setInterval(() => {
    progress += 2;

    if (progress >= 30) {
      clearInterval(fakeProgressInterval);
    } else {
      get().updateProgress(uploadId, progress);
    }
  }, 20);

  return uploadId;
}
```

**Progress Mapping (30-100%):**
```javascript
updateProgress: (uploadId, progress) => {
  set((state) => {
    const upload = state.uploads[uploadId];
    if (!upload) return state;

    // Never go backwards
    const newProgress = Math.max(upload.progress, progress);

    return {
      uploads: {
        ...state.uploads,
        [uploadId]: {
          ...upload,
          progress: newProgress
        }
      }
    };
  });
}
```

**Complete with Memory Cleanup:**
```javascript
completeUpload: (uploadId, cloudinaryUrl) => {
  set((state) => {
    const upload = state.uploads[uploadId];
    if (!upload) return state;

    // FREE MEMORY: Revoke blob URL
    if (upload.preview) {
      URL.revokeObjectURL(upload.preview);
    }

    return {
      uploads: {
        ...state.uploads,
        [uploadId]: {
          ...upload,
          preview: null,         // Blob URL removed
          url: cloudinaryUrl,    // Final URL
          progress: 100,
          status: 'success',
          completedAt: Date.now()
        }
      }
    };
  });
}
```

**Cleanup Old Uploads:**
```javascript
cleanupOldUploads: () => {
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;

  set((state) => {
    const updatedUploads = { ...state.uploads };

    Object.entries(updatedUploads).forEach(([id, upload]) => {
      const age = now - upload.startedAt;

      if (age > fiveMinutes) {
        // Cleanup blob URL
        if (upload.preview) {
          URL.revokeObjectURL(upload.preview);
        }

        delete updatedUploads[id];
      }
    });

    return { uploads: updatedUploads };
  });
}
```

**Usage Example:**
```jsx
function ImageUploader() {
  const { startUpload, getPreviewUrl, getFinalUrl } = useUploadStore();
  const [uploadId, setUploadId] = useState(null);

  const handleFileSelect = async (file) => {
    // 1. Start upload (instant preview)
    const id = startUpload(file);
    setUploadId(id);

    // 2. Upload in background
    try {
      const url = await uploadImage(file, (progress) => {
        updateProgress(id, 30 + (progress * 0.7)); // Map to 30-100%
      });

      // 3. Complete (cleanup blob, set final URL)
      completeUpload(id, url);
    } catch (error) {
      failUpload(id, error.message);
    }
  };

  // Get preview (blob or final URL)
  const previewUrl = uploadId ? getPreviewUrl(uploadId) : null;

  return (
    <div>
      {previewUrl && <img src={previewUrl} alt="Preview" />}

      <input
        type="file"
        onChange={(e) => handleFileSelect(e.target.files[0])}
      />
    </div>
  );
}
```

### 5.3 Store Best Practices

**✅ DO:**
- Use stores for global state only (auth, portfolios, templates)
- Use `useState` for component-local state (form inputs, UI state)
- Call store actions from event handlers, not during render
- Leverage caching to reduce API calls
- Use optimistic updates for instant feedback
- Clean up resources (intervals, blob URLs)

**❌ DON'T:**
- Put derived state in stores (compute in components with useMemo)
- Store UI state globally (modals, dropdowns, tooltips)
- Mutate store state directly (always use `set()`)
- Create circular dependencies between stores
- Store temporary data that doesn't need persistence

**Pattern: Computed State**
```javascript
// ❌ BAD: Storing derived state
{
  portfolios: [...],
  publishedCount: 0,  // Manually updated, can get out of sync
  draftCount: 0
}

// ✅ GOOD: Compute in component
function Dashboard() {
  const { portfolios } = usePortfolioStore();

  const publishedCount = useMemo(
    () => portfolios.filter(p => p.isPublished).length,
    [portfolios]
  );

  const draftCount = portfolios.length - publishedCount;
}
```

**Pattern: Store Composition**
```javascript
// Access multiple stores in one component
function PortfolioBuilder() {
  const { user } = useAuthStore();
  const { currentPortfolio, updatePortfolio } = usePortfolioStore();
  const { templates } = useTemplateStore();

  // Combine data as needed
  const currentTemplate = templates.find(t => t.id === currentPortfolio?.templateId);
}
```

---

## 6. API Integration Layer

### 6.1 Base API Configuration

**File:** `src/lib/axios.js`

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  timeout: 15000,  // 15 seconds
  headers: {
    'Content-Type': 'application/json'
  },
  retry: 3,        // Retry failed requests
  retryDelay: 1000 // 1 second between retries
});

// REQUEST INTERCEPTOR: Add JWT token
api.interceptors.request.use(
  (config) => {
    // Add auth token to all requests
    const token = localStorage.getItem('aurea_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Performance monitoring (development only)
    if (import.meta.env.DEV) {
      config.metadata = { startTime: Date.now() };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR: Error handling + retry
api.interceptors.response.use(
  (response) => {
    // Log performance in development
    if (import.meta.env.DEV && response.config.metadata) {
      const duration = Date.now() - response.config.metadata.startTime;
      console.log(`✅ ${response.config.method.toUpperCase()} ${response.config.url}: ${duration}ms`);
    }

    return response;
  },
  async (error) => {
    const config = error.config;

    // Retry logic for network errors
    if (error.code === 'NETWORK_ERROR' && config && config.retry > 0) {
      config.retry--;

      // Exponential backoff: 1s, 2s, 4s
      const delay = config.retryDelay * Math.pow(2, 3 - config.retry);

      console.log(`⏳ Retrying request (${config.retry} attempts left)...`);

      await new Promise(resolve => setTimeout(resolve, delay));
      return api(config);
    }

    // Handle specific status codes
    if (error.response) {
      switch (error.response.status) {
        case 401: // Unauthorized
          localStorage.clear();
          toast.error('Session expired. Please login again.');
          window.location.href = '/login';
          break;

        case 403: // Forbidden
          toast.error('You do not have permission to perform this action');
          break;

        case 429: // Rate limited
          toast.error('Too many requests. Please wait and try again.');
          break;

        case 500: // Server error
          toast.error('Server error. Please try again later.');
          break;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

**What this provides:**
- Automatic JWT token injection
- Request/response logging (development)
- Automatic retry with exponential backoff
- Centralized error handling
- Performance monitoring

### 6.2 API Module Pattern

**Example:** `src/lib/portfolioApi.js`

```javascript
import api from './axios';
import toast from 'react-hot-toast';

// Helper: Consistent error handling
const apiRequest = async (requestFn, errorMessage) => {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    console.error(errorMessage, error);
    throw error;
  }
};

export const portfolioApi = {
  // Get user's portfolios
  getUserPortfolios: async (published = null) => {
    return apiRequest(
      () => api.get('/api/portfolios/user/me', {
        params: { published }
      }),
      'Failed to fetch portfolios'
    );
  },

  // Get single portfolio by ID
  getById: async (id) => {
    return apiRequest(
      () => api.get(`/api/portfolios/${id}`),
      `Failed to fetch portfolio ${id}`
    );
  },

  // Get portfolio by slug (public)
  getBySlug: async (slug) => {
    return apiRequest(
      () => api.get(`/api/portfolios/slug/${slug}`),
      `Failed to fetch portfolio with slug ${slug}`
    );
  },

  // Create new portfolio
  create: async (portfolioData) => {
    return apiRequest(
      () => api.post('/api/portfolios', portfolioData),
      'Failed to create portfolio'
    );
  },

  // Update portfolio
  update: async (id, updates) => {
    return apiRequest(
      () => api.put(`/api/portfolios/${id}`, updates),
      `Failed to update portfolio ${id}`
    );
  },

  // Delete portfolio
  delete: async (id) => {
    return apiRequest(
      () => api.delete(`/api/portfolios/${id}`),
      `Failed to delete portfolio ${id}`
    );
  },

  // Publish portfolio
  publish: async (id, customSubdomain) => {
    return apiRequest(
      () => api.post('/api/sites/sub-publish', {
        portfolioId: id,
        customSubdomain
      }, {
        timeout: 30000  // 30s for HTML generation
      }),
      'Failed to publish portfolio'
    );
  },

  // Debounced update (auto-save)
  updateDebounced: (() => {
    const timeouts = new Map();

    return async (id, updates, delay = 1000) => {
      // Clear previous timeout
      if (timeouts.has(id)) {
        clearTimeout(timeouts.get(id));
      }

      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(async () => {
          try {
            const result = await portfolioApi.update(id, updates);
            timeouts.delete(id);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }, delay);

        timeouts.set(id, timeoutId);
      });
    };
  })()
};
```

### 6.3 All API Modules

**Available modules:**
- `authApi.js` - Authentication & user management
- `portfolioApi.js` - Portfolio CRUD operations
- `templateApi.js` - Template management
- `caseStudyApi.js` - Case study operations
- `uploadApi.js` - File uploads to Cloudinary
- `pdfApi.js` - PDF generation
- `siteApi.js` - Publishing & deployment

### 6.4 API Best Practices

**✅ DO:**
- Show loading states during API calls
- Handle errors with user-friendly messages
- Retry failed requests (network errors)
- Cancel ongoing requests on unmount
- Debounce frequent API calls (search, auto-save)
- Use appropriate timeouts (30s for file uploads)

**❌ DON'T:**
- Make API calls in render functions
- Ignore error responses
- Forget to cleanup (abort controllers)
- Make redundant API calls (use caching)
- Trust client-side validation only (backend validates)

**Pattern: Loading States**
```jsx
function PortfolioList() {
  const [isLoading, setIsLoading] = useState(false);
  const [portfolios, setPortfolios] = useState([]);

  useEffect(() => {
    const fetchPortfolios = async () => {
      setIsLoading(true);

      try {
        const response = await portfolioApi.getUserPortfolios();
        setPortfolios(response.data.portfolios);
      } catch (error) {
        toast.error('Failed to load portfolios');
      } finally {
        setIsLoading(false);  // Always cleanup
      }
    };

    fetchPortfolios();
  }, []);

  if (isLoading) return <Spinner />;

  return portfolios.map(p => <PortfolioCard key={p._id} {...p} />);
}
```

**Pattern: Request Cancellation**
```jsx
useEffect(() => {
  const abortController = new AbortController();

  const fetchData = async () => {
    try {
      const response = await api.get('/api/portfolios', {
        signal: abortController.signal
      });

      setData(response.data);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request cancelled');
      } else {
        toast.error('Failed to fetch data');
      }
    }
  };

  fetchData();

  // Cleanup: Cancel request if component unmounts
  return () => {
    abortController.abort();
  };
}, []);
```

---

*Due to length constraints, I'll continue the rest of the sections in subsequent messages. This covers sections 1-6 of the comprehensive onboarding guide. Shall I continue with sections 7-15?*