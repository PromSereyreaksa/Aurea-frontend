# AUREA Frontend - Portfolio Builder UI

<div align="center">

# 🎨 AUREA Frontend
### Professional Portfolio Builder Application

[![React](https://img.shields.io/badge/React-19.1.1-61dafb?style=flat&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.1.2-646cff?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.13-06b6d4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-5.0.8-brown?style=flat)](https://zustand.docs.pmnd.rs/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

**A modern, production-ready React application for creating, customizing, and publishing professional portfolio websites.**

[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [Development](#-development) • [Best Practices](#-best-practices)

</div>

---

## 🎯 Overview

AUREA Frontend is a sophisticated React application that allows designers, developers, and creative professionals to build stunning portfolio websites without coding. It integrates with the AUREA Backend API to manage portfolios, templates, and publishing workflows.

**Key Capabilities**:
- 🎨 **Multi-Template System** - 4+ professional portfolio templates
- 🖼️ **Rich Content Editing** - TipTap rich text editor with image support
- 📱 **Responsive Design** - Mobile-optimized layouts across all devices
- 🚀 **One-Click Publishing** - Deploy to Vercel or custom subdomains
- 📊 **Portfolio Analytics** - Track views and engagement
- 🔐 **Secure Authentication** - JWT-based with protected routes
- ⚡ **High Performance** - Code splitting, lazy loading, optimized bundles
- 🎬 **Smooth Animations** - GSAP and Framer Motion for interactive UX

---

## ✨ Features

### 📁 Portfolio Management
- Create, edit, and delete portfolios
- Multiple template selection
- Drag-and-drop section organization
- Real-time preview and validation
- Version control and auto-save

### 🎨 Template System
- **Echelon**: Swiss-style minimalist design
- **Serene**: Botanical-style elegant template
- **Chic**: Modern sophisticated layout
- **BoldFolio**: Bold statement-making design
- Schema-driven validation
- Template-specific customization

### ✍️ Content Editing
- Rich text editor (TipTap) for descriptions
- Image upload with compression (Cloudinary)
- Case study management
- Responsive image galleries
- Auto-save functionality

### 🌐 Publishing
- **Vercel Deployment**: One-click deploy via API
- **Custom Subdomains**: Gmail-style custom domains (e.g., aurea.tool/your-name)
- Live preview before publishing
- HTML snapshot generation

### 📄 PDF Export
- High-quality PDF generation
- Template-aware rendering
- Complete portfolio export with case studies
- Download or view inline

### 🔐 Authentication & Authorization
- JWT-based secure authentication
- Protected routes with role-based access
- Remember me functionality
- Account management dashboard

---

## 🛠️ Technology Stack

### Core Framework
- **React 19.1.1** - UI library with Hooks
- **Vite 7.1.2** - Lightning-fast build tool
- **JavaScript (ES6+)** - No TypeScript

### State Management
- **Zustand 5.0.8** - Lightweight global state
  - authStore: Authentication & user session
  - portfolioStore: Portfolio CRUD & management
  - templateStore: Template metadata
  - uploadStore: Image upload progress

### Routing & Navigation
- **React Router DOM 7.9.0** - Client-side routing
- Lazy loading for code splitting
- Protected routes with authentication checks

### UI & Styling
- **Tailwind CSS 4.1.13** - Utility-first CSS framework
- **Framer Motion 12.23.12** - Component animations
- **GSAP 3.13.0** - Advanced animations
- **Lucide React** - Icon library

### Content & Forms
- **React Hook Form 7.62.0** - Efficient form handling
- **TipTap 3.4.2** - Rich text editor
- **React Easy Crop 5.5.3** - Image cropping
- **React Dropzone 14.3.8** - File uploads

### HTTP & API
- **Axios 1.12.1** - HTTP client with interceptors
- **Cloudinary** - Image hosting & optimization

### Development Tools
- **ESLint** - Code quality checks
- **Vercel Analytics** - Performance monitoring
- **React Hot Refresh** - Fast development loop

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- npm 9+ or yarn
- Git for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/aurea-frontend.git
   cd aurea-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your configuration:
   ```bash
   # Backend API
   VITE_API_BASE_URL=http://localhost:5000
   VITE_API_TIMEOUT=10000

   # Cloudinary (for image uploads)
   VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
   VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at: **http://localhost:5173**

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint for code quality checks
npm run lint

# Fix ESLint issues automatically
npm run lint -- --fix
```

---

## 🏗️ Architecture

### Project Structure

```
Aurea-frontend/
├── src/
│   ├── pages/                    # Page components (lazy-loaded)
│   │   ├── HomePage.jsx          # Landing page (eager)
│   │   ├── LoginPage.jsx         # Authentication
│   │   ├── DashboardPage.jsx     # User dashboard
│   │   ├── PortfolioBuilderPage.jsx # Portfolio editor
│   │   ├── *PreviewPage.jsx      # Template previews
│   │   └── ...
│   │
│   ├── components/               # Reusable UI components
│   │   ├── PortfolioBuilder/     # Builder-specific components
│   │   │   ├── SchemaFormGenerator.jsx  # Dynamic form from schema
│   │   │   ├── TemplateSelector.jsx     # Template selection
│   │   │   ├── ImageUpload.jsx          # Image management
│   │   │   ├── PDFExport.jsx            # PDF generation
│   │   │   ├── PublishModal.jsx         # Publishing UI
│   │   │   └── ...
│   │   │
│   │   ├── Dashboard/            # Dashboard components
│   │   ├── DashboardNew/         # New dashboard UI
│   │   ├── LandingPage/          # Landing page sections
│   │   ├── Shared/               # Shared components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ...
│   │   └── Templates/            # Template-specific components
│   │
│   ├── templates/                # Portfolio template designs
│   │   ├── Echelon/              # Swiss minimalist
│   │   ├── Serene/               # Botanical elegant
│   │   ├── Chic/                 # Modern sophisticated
│   │   ├── BoldFolio/            # Bold statement
│   │   └── Shared/               # Shared template utilities
│   │
│   ├── stores/                   # Zustand state management
│   │   ├── authStore.js          # Auth & user session
│   │   ├── portfolioStore.js     # Portfolio CRUD
│   │   ├── templateStore.js      # Template metadata
│   │   └── uploadStore.js        # Upload progress
│   │
│   ├── lib/                      # API layer & utilities
│   │   ├── baseApi.js            # Axios instance with interceptors
│   │   ├── authApi.js            # Authentication endpoints
│   │   ├── portfolioApi.js       # Portfolio endpoints
│   │   ├── templateApi.js        # Template endpoints
│   │   ├── caseStudyApi.js       # Case study endpoints
│   │   ├── uploadApi.js          # Upload endpoints
│   │   └── cloudinaryDirectUpload.js
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useImageUpload.js     # Image upload logic
│   │   ├── usePortfolioBuilder.js # Builder state management
│   │   ├── useTemplateChange.js  # Template switching
│   │   └── useTemplateValidation.js
│   │
│   ├── utils/                    # Utility functions
│   │   ├── templateMigration.js  # Template version migration
│   │   ├── animationConfig.js    # GSAP configurations
│   │   └── ...
│   │
│   ├── styles/                   # Global CSS
│   ├── assets/                   # Static images, fonts
│   ├── App.jsx                   # Root component with routing
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
│
├── public/                       # Static files
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind CSS config
├── package.json
├── .env.example                  # Environment template
└── README.md                     # This file
```

### Data Flow Diagram

```
┌─────────────────────┐
│   User Interface    │
│  (React Components) │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────────────────┐
│  State Management (Zustand)     │
│  - authStore (JWT, user data)   │
│  - portfolioStore (CRUD)        │
│  - templateStore (metadata)     │
└──────────┬──────────────────────┘
           │
           ↓
┌─────────────────────────────────┐
│  API Layer (Axios)              │
│  - baseApi (interceptors)       │
│  - Endpoints (auth, portfolio)  │
└──────────┬──────────────────────┘
           │
           ↓
┌─────────────────────────────────┐
│  Backend API                    │
│  (Express.js on port 5000)      │
└─────────────────────────────────┘
```

---

## 🎨 Component Architecture

### Component Patterns

#### Smart Components (Containers)
Components that:
- Connect to Zustand stores
- Handle data fetching
- Manage local state
- Pass data to presentational components

Example:
```jsx
// src/pages/PortfolioBuilderPage.jsx
import { usePortfolioStore } from '@/stores/portfolioStore';

export default function PortfolioBuilderPage() {
  const { portfolio, updatePortfolio } = usePortfolioStore();

  // Smart component logic here
  return <PortfolioBuilder portfolio={portfolio} />;
}
```

#### Presentational Components
Components that:
- Receive all data via props
- Focus on UI rendering
- Are fully reusable
- No store or API access

Example:
```jsx
// src/components/PortfolioBuilder/TemplateSelector.jsx
export default function TemplateSelector({ templates, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {templates.map(t => (
        <div key={t.id} onClick={() => onSelect(t)}>
          {t.name}
        </div>
      ))}
    </div>
  );
}
```

### Component Composition

```
App (Router setup)
├── HomePage (Landing)
├── LoginPage (Auth)
├── DashboardPage (Protected)
│   ├── PortfolioList
│   │   └── PortfolioCard (Presentational)
│   └── CreatePortfolioModal
│
└── PortfolioBuilderPage (Protected)
    ├── EditorNavbar (Presentational)
    ├── TemplateSelector (Presentational)
    ├── SchemaFormGenerator (Smart)
    ├── TemplatePreview (Smart)
    └── PublishModal (Presentational)
```

---

## 🔐 State Management with Zustand

### Store Structure

**authStore** - Authentication & User Session
```javascript
// Key state: user, token, isAuthenticated
// Key actions: login, signup, logout, checkToken
// Persists to: localStorage (key: "aurea-auth-storage")
```

**portfolioStore** - Portfolio Operations
```javascript
// Key state: portfolios, currentPortfolio, loading
// Key actions: createPortfolio, updatePortfolio, deletePortfolio
// Computed: getPortfolioById, getStats
```

**templateStore** - Template Metadata
```javascript
// Key state: templates, selectedTemplate
// Key actions: fetchTemplates, selectTemplate
// Cached: reduces API calls
```

**uploadStore** - Upload Progress
```javascript
// Key state: uploadProgress, uploadedFiles
// Key actions: startUpload, updateProgress, completeUpload
```

### Store Usage Pattern

```javascript
// In components
import { useAuthStore } from '@/stores/authStore';
import { usePortfolioStore } from '@/stores/portfolioStore';

function MyComponent() {
  // Get store state and actions
  const { user, logout } = useAuthStore();
  const { portfolios, createPortfolio } = usePortfolioStore();

  // Use in component
  return (
    <div>
      <p>Welcome, {user.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## 📡 API Integration

### Axios Configuration

**baseApi.js** - Configured with:
- ✅ Bearer token injection from authStore
- ✅ Request/response interceptors
- ✅ Error handling and retry logic
- ✅ Timeout management (default: 10s)
- ✅ Base URL from environment

### API Layer Organization

All API calls are organized by resource:
- `authApi.js` - Login, signup, profile
- `portfolioApi.js` - Portfolio CRUD
- `templateApi.js` - Template operations
- `caseStudyApi.js` - Case studies
- `uploadApi.js` - Image uploads

### API Call Pattern

```javascript
// src/lib/portfolioApi.js
import { baseApi } from './baseApi';

export const portfolioApi = {
  // Fetch user's portfolios
  getUserPortfolios: async () => {
    const res = await baseApi.get('/api/portfolios/user/me');
    return res.data.data;
  },

  // Create new portfolio
  createPortfolio: async (data) => {
    const res = await baseApi.post('/api/portfolios', data);
    return res.data.data;
  },

  // Update portfolio
  updatePortfolio: async (id, data) => {
    const res = await baseApi.put(`/api/portfolios/${id}`, data);
    return res.data.data;
  }
};
```

### Error Handling

```javascript
// In components
try {
  const portfolio = await portfolioApi.createPortfolio(data);
  toast.success('Portfolio created!');
} catch (error) {
  const message = error.response?.data?.message || 'An error occurred';
  toast.error(message);
}
```

---

## ⚙️ Development Patterns & Best Practices

### 1. Component Structure

✅ **GOOD**:
```jsx
export default function MyComponent({ title, data }) {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Load data
  }, []);

  return (
    <div className="...">
      <h1>{title}</h1>
    </div>
  );
}
```

❌ **AVOID**:
```jsx
// Large inline styles
// Business logic mixed with UI
// Unnecessary context props
```

### 2. State Management

✅ **Use Zustand for**:
- Global app state (auth, user)
- Cross-component data (portfolios)
- Persistent data (localStorage)

✅ **Use React State for**:
- Form inputs (local only)
- UI toggles (modals, dropdowns)
- Component-specific data

```javascript
// ✅ GOOD: Zustand for global
const { user, logout } = useAuthStore();

// ✅ GOOD: React state for local
const [isOpen, setIsOpen] = useState(false);
```

### 3. API Calls

✅ **In Zustand Actions**:
```javascript
// Store handles data fetching
const fetchPortfolios = async () => {
  const data = await portfolioApi.getUserPortfolios();
  setPortfolios(data);
};
```

✅ **In Components with useEffect**:
```javascript
useEffect(() => {
  const loadData = async () => {
    const result = await portfolioApi.getPortfolio(id);
    setData(result);
  };
  loadData();
}, [id]);
```

### 4. Styling

✅ **Use Tailwind Classes**:
```jsx
<div className="bg-white p-4 rounded-lg shadow-md">
  <p className="text-lg font-bold text-gray-800">Title</p>
</div>
```

✅ **Use Module CSS for Complex Styles**:
```css
/* Component.module.css */
.container {
  /* Complex styles */
}
```

### 5. Error Handling

✅ **Always Handle Errors**:
```javascript
try {
  const data = await api.fetch();
  setState(data);
} catch (error) {
  const message = error.response?.data?.message || 'Error';
  toast.error(message);
  setError(message);
}
```

### 6. Performance

✅ **Code Splitting**:
```javascript
// Lazy load pages except HomePage
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
```

✅ **Memo for Expensive Components**:
```javascript
const TemplateCard = memo(({ template, onSelect }) => (
  // Component content
));
```

✅ **useMemo for Expensive Calculations**:
```javascript
const filteredTemplates = useMemo(
  () => templates.filter(t => t.category === category),
  [templates, category]
);
```

---

## 📋 Routing Configuration

### Protected Routes

```javascript
// Using ProtectedRoute wrapper
<Route
  path="/portfolio-builder/:id"
  element={
    <ProtectedRoute>
      <PortfolioBuilderPage />
    </ProtectedRoute>
  }
/>
```

### Lazy-Loaded Pages

All pages except HomePage use lazy loading for better performance:
```javascript
// Eager load (critical)
import HomePage from './pages/HomePage';

// Lazy load (non-critical)
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
```

### Route List

| Path | Component | Auth | Description |
|------|-----------|------|-------------|
| `/` | HomePage | ❌ | Landing page |
| `/login` | LoginPage | ❌ | User login |
| `/signup` | SignupPage | ❌ | User registration |
| `/dashboard` | DashboardPage | ✅ | Portfolio list |
| `/portfolio-builder/:id` | PortfolioBuilderPage | ✅ | Portfolio editor |
| `/portfolio/:slug` | PublishedPortfolioPage | ❌ | Published portfolio |
| `/preview/:template/:id` | TemplatePreviewPage | ❌ | Template demo |

---

## 🚀 Deployment

### Production Build

```bash
# Build optimized production bundle
npm run build

# Outputs to: dist/
```

### Vercel Deployment

The app is pre-configured for Vercel:

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import from GitHub
   - Set environment variables
   - Deploy

3. **Environment Variables** (in Vercel)
   ```
   VITE_API_BASE_URL=https://your-backend-api.com
   VITE_API_TIMEOUT=10000
   VITE_CLOUDINARY_CLOUD_NAME=your-cloud
   VITE_CLOUDINARY_UPLOAD_PRESET=your-preset
   ```

### Environment-Specific Config

```bash
# Development
VITE_API_BASE_URL=http://localhost:5000

# Production
VITE_API_BASE_URL=https://api.aurea.com
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] **Authentication**
  - [ ] Sign up creates account
  - [ ] Login with valid credentials
  - [ ] Login fails with invalid credentials
  - [ ] Logout clears session

- [ ] **Portfolio Management**
  - [ ] Create new portfolio
  - [ ] Edit portfolio content
  - [ ] Delete portfolio
  - [ ] Select different template

- [ ] **Publishing**
  - [ ] Preview before publish
  - [ ] Deploy to Vercel
  - [ ] Deploy to custom subdomain
  - [ ] Access published portfolio

- [ ] **Responsive Design**
  - [ ] Mobile (320px)
  - [ ] Tablet (768px)
  - [ ] Desktop (1920px)

### Development Testing

```bash
# Check for console errors
npm run dev
# Browser DevTools → Console tab

# Run ESLint
npm run lint
npm run lint -- --fix  # Auto-fix
```

---

## 🔧 Configuration Files

### vite.config.js
- React plugin for JSX
- Tailwind CSS integration
- Console removal in production
- Source maps for debugging

### tailwind.config.js
- Custom color scheme
- Font families
- Responsive breakpoints
- Animation definitions

### .env.example
Template for environment variables. Copy to `.env` and update:
- Backend API URL
- Cloudinary credentials
- API timeout settings

---

## 📚 Documentation

### Project Documentation
- **CLAUDE.md** - Development guidelines for Claude AI
- **BACKEND_INTEGRATION.md** - Backend API integration details
- **TEMPLATE_EXPORT_GUIDE.md** - PDF export functionality
- **INTEGRATION_TESTING_GUIDE.md** - Testing procedures

### External Resources
- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://zustand.docs.pmnd.rs/)
- [React Router](https://reactrouter.com/)

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: Blank page on startup
- **Solution**: Clear node_modules and reinstall
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  npm run dev
  ```

**Issue**: API calls returning 401 Unauthorized
- **Solution**: JWT token expired or invalid
  - Clear localStorage: `localStorage.clear()`
  - Login again
  - Check backend is running

**Issue**: Images not uploading
- **Solution**: Verify Cloudinary credentials in .env
  - Check `VITE_CLOUDINARY_CLOUD_NAME`
  - Check `VITE_CLOUDINARY_UPLOAD_PRESET`
  - Verify upload preset exists in Cloudinary

**Issue**: Styles not applying
- **Solution**: Clear Vite cache
  ```bash
  rm -rf .vite dist
  npm run dev
  ```

---

## 📦 Dependencies

### Key Dependencies Summary

| Package | Version | Purpose |
|---------|---------|---------|
| react | 19.1.1 | UI library |
| vite | 7.1.2 | Build tool |
| zustand | 5.0.8 | State management |
| axios | 1.12.1 | HTTP client |
| tailwindcss | 4.1.13 | CSS framework |
| framer-motion | 12.23.12 | Animations |
| gsap | 3.13.0 | Advanced animations |
| react-router-dom | 7.9.0 | Routing |
| react-hook-form | 7.62.0 | Form handling |
| @tiptap/react | 3.4.2 | Rich text editor |

---

## 🤝 Contributing

### Code Style
- **ESLint Rules**: Follow `.eslintrc.cjs`
- **Naming Convention**: camelCase for variables, PascalCase for components
- **Indentation**: 2 spaces
- **Quotes**: Single quotes for JS, double for JSX attributes

### Commit Convention
```
feat: add new feature
fix: bug fix
docs: documentation
style: formatting
refactor: code reorganization
test: add tests
chore: maintenance
```

---

## 📄 License

ISC License - See LICENSE file for details

---

<div align="center">

**Made with ❤️ by the AUREA Team**

[GitHub](https://github.com/your-org/aurea-frontend) • [Documentation](https://docs.aurea.com) • [Support](https://support.aurea.com)

**v1.0.0** | Production Ready | Last Updated: October 2025

</div>
