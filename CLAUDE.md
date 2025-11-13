# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AUREA is a portfolio builder application with a React frontend (this repo) and a separate backend API. The application allows users to create, customize, and publish professional portfolios using various templates.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Architecture & Structure

### Technology Stack
- **Framework**: React 19.1.1 with Vite 7.1.2
- **Language**: JavaScript/JSX (no TypeScript)
- **Styling**: Tailwind CSS 4.1.13
- **State Management**: Zustand 5.0.8
- **Routing**: React Router DOM 7.9.0 with lazy loading
- **Animations**: Framer Motion 12.23.12, GSAP 3.13.0
- **Form Handling**: React Hook Form 7.62.0
- **Rich Text Editor**: TipTap 3.4.2
- **PDF Export**: react-pdf/renderer 4.3.0
- **File Upload**: Cloudinary integration
- **HTTP Client**: Axios 1.12.1

### Core Directory Structure

```
src/
├── components/         # Reusable UI components
│   ├── Dashboard/      # Dashboard-specific components
│   ├── LandingPage/    # Landing page sections (ModernHero, FeaturesGrid, etc.)
│   ├── PortfolioBuilder/ # Portfolio builder UI components
│   └── Shared/         # Shared components (Navbar, Footer, etc.)
├── pages/              # Page components (lazy-loaded except HomePage)
├── templates/          # Portfolio templates
│   ├── Echelon/        # Swiss-style design template
│   ├── Serene/         # Botanical-style elegant template
│   └── Shared/         # Shared template components (Animations, Backgrounds)
├── stores/             # Zustand state management
│   ├── authStore.js    # Authentication state & JWT management
│   └── portfolioStore.js # Portfolio CRUD operations
├── lib/                # API layer
│   ├── baseApi.js      # Axios wrapper with auth interceptor
│   ├── authApi.js      # Authentication endpoints
│   ├── portfolioApi.js # Portfolio management endpoints
│   ├── caseStudyApi.js # Case study endpoints
│   └── cloudinaryApi.js # Image upload integration
├── hooks/              # Custom React hooks
│   └── usePortfolioBuilder.js # Portfolio builder hooks
└── utils/              # Utility functions
    ├── portfolioUtils.js # Data transformations
    ├── templateAnalyzer.js # Template analysis
    └── animationConfig.js # GSAP configurations
```

### Routing Structure

All routes are defined in `src/App.jsx`. Protected routes require authentication via the `ProtectedRoute` component.

Key routes:
- `/` - HomePage (eager loaded)
- `/dashboard` - User dashboard (protected, uses DashboardNew)
- `/dashboard-old` - Legacy dashboard (protected)
- `/profile` - User profile/account page (protected, uses AccountNew)
- `/portfolio-builder/:id` - Portfolio editor (protected)
- `/portfolio-builder/:portfolioId/case-study/:projectId` - Case study editor (protected)
- `/portfolio-builder/:portfolioId/about` - Serene template about page editor (protected)
- `/portfolio/:slug` - Published portfolio view (public)
- `/template-preview/echelon` - Echelon template preview
- `/template-preview/serene` - Serene template preview
- `/template-preview/chic` - Chic template preview
- `/template-preview/boldfolio` - BoldFolio template preview
- `/templates` - Template showcase page
- `/login`, `/signup` - Authentication pages
- `/about`, `/contact`, `/events`, `/terms` - Public pages

**Static HTML Routes** (for subdomain hosting):
- `/:subdomain/html` - Serve static HTML for published portfolio
- `/:subdomain/case-study-:projectId.html` - Serve static case study HTML

### State Management

The application uses Zustand for state management with four main stores:

**authStore** (`src/stores/authStore.js`):
- Manages user authentication, JWT tokens, and profile
- Persists to localStorage with key "aurea-auth-storage"
- Auto-checks token expiration every 60 seconds

**portfolioStore** (`src/stores/portfolioStore.js`):
- Manages portfolio CRUD operations
- Tracks current portfolio and statistics
- Handles loading states

**templateStore** (`src/stores/templateStore.js`):
- Fetches and caches templates from backend
- Template and schema caching with Map objects
- Template validation against schemas
- Default template management
- Fallback template logic for error scenarios

**uploadStore** (`src/stores/uploadStore.js`):
- Centralized image upload state management
- Instant local preview via blob URLs (before Cloudinary upload)
- Background upload progress tracking (0-100%)
- Fake fast progress (0-30%) for perceived performance
- Memory management with automatic blob URL cleanup
- Retry logic for failed uploads

### API Integration

All API calls go through the enhanced Axios wrapper in `lib/baseApi.js` which:
- Sets Bearer token from authStore
- Handles request/response interceptors
- Points to backend at: `https://aurea-backend-production-8a87.up.railway.app`

Environment variables (in `.env`):
```
VITE_API_BASE_URL        # Backend API URL
VITE_API_TIMEOUT         # Request timeout (default: 10000ms)
VITE_CLOUDINARY_CLOUD_NAME       # Cloudinary account
VITE_CLOUDINARY_UPLOAD_PRESET    # Upload preset for images
```

### Authentication Flow

1. User logs in via `/login` page
2. JWT token stored in localStorage via authStore
3. Token added to all API requests via Axios interceptor
4. Protected routes check `isAuthenticated` state
5. Token expiration monitored, auto-logout on expiry

### Portfolio Builder

The portfolio builder (`/portfolio-builder/:id`) provides:
- Template selection (currently Echelon template)
- Section editing (hero, gallery, case studies)
- Rich text editing via TipTap
- Image upload to Cloudinary
- PDF export functionality
- Preview mode

### Template System

Templates are located in `src/templates/`. Available templates:

**Echelon** (`src/templates/Echelon/`):
- Swiss-style minimalist design
- Customizable sections
- Case study support
- Animated backgrounds (Aurora, Plasma, Prism, Silk)
- Responsive layout

**Serene** (`src/templates/Serene/`):
- Botanical-style elegant template
- Separate about page editor
- Gallery and bio sections

**Chic** (`src/templates/Chic/`):
- Modern chic design template

**BoldFolio** (`src/templates/BoldFolio/`):
- Bold portfolio template

Templates are synced between frontend definitions (`src/templates/`) and backend database. Use the template migration utilities in `src/utils/templateMigration.js` to sync changes.

## Code Patterns

### Component Structure
Components follow a consistent pattern:
- Functional components with hooks
- Framer Motion for animations
- Tailwind CSS for styling
- Prop destructuring in parameters

### API Call Pattern
```javascript
// Use the API wrapper from lib/
import { portfolioApi } from '@/lib/portfolioApi';

// In component or store
const data = await portfolioApi.getUserPortfolios();
```

### Store Usage Pattern
```javascript
import { useAuthStore } from '@/stores/authStore';

const Component = () => {
  const { user, isAuthenticated, login } = useAuthStore();
  // Use store state and actions
};
```

### Lazy Loading Pattern
All pages except HomePage use lazy loading:
```javascript
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
```

### Upload Pattern (with instant preview)
```javascript
import useUploadStore from '@/stores/uploadStore';

const Component = () => {
  const { startUpload, getPreviewUrl, getFinalUrl } = useUploadStore();

  const handleUpload = async (file) => {
    const uploadId = startUpload(file); // Creates instant preview
    const previewUrl = getPreviewUrl(uploadId); // Use immediately

    // Upload to Cloudinary in background
    await uploadToCloudinary(file, uploadId);

    const finalUrl = getFinalUrl(uploadId); // Get Cloudinary URL
  };
};
```

## Performance Optimizations

- **Code Splitting**: All pages lazy-loaded except HomePage
- **Image Optimization**: Cloudinary for external image storage
- **CSS**: Tailwind with content purging in production
- **Animations**: GSAP with optimized configurations
- **Bundle Size**: Vite tree-shaking enabled
- **Console Removal**: Production builds automatically strip `console.*` and `debugger` statements (configured in `vite.config.js`)
- **Upload UX**: Instant local previews via blob URLs while uploading to Cloudinary in background
- **Template Caching**: Templates and schemas cached in memory with Map objects

## Deployment

The application deploys to Vercel with:
- SPA routing configured in `vercel.json`
- Environment variables set in Vercel dashboard
- Automatic deploys from main branch
- Production build created via `npm run build`

## Debugging Utilities

### Console Functions
The app exposes debugging functions on the window object (available in browser console):

```javascript
// Re-sync all templates from frontend to backend
window.resyncTemplates()

// Re-sync just the Echelon template
window.resyncEchelon()
```

These functions are useful when:
- Template definitions change in `src/templates/`
- Backend template data gets out of sync
- Testing template migration logic

### Important Notes
- Console logs are stripped in production builds
- Use browser DevTools to access window functions
- Template changes require page refresh after sync

## Important Documentation

The project includes extensive documentation in `/docs`:
- `UPDATES.md` - Modern design system and component details
- `BACKEND_INTEGRATION.md` - API specifications and endpoints
- `TEMPLATE_EXPORT_GUIDE.md` - PDF export functionality
- `INTEGRATION_TESTING_GUIDE.md` - Testing procedures
- `TEMPLATE_SYNC_GUIDE.md` - Template synchronization between frontend/backend
- `TEMPLATE_CREATION_GUIDE.md` - Creating new templates
- `FRONTEND_DYNAMIC_TEMPLATE_SYSTEM.md` - Dynamic template architecture
- `BACKEND_DYNAMIC_TEMPLATE_SYSTEM.md` - Backend template system details

## Common Development Workflows

### Adding a New Template
1. Create template directory: `src/templates/YourTemplate/`
2. Create template component with schema definition
3. Add template export to `src/templates/index.js`
4. Run `window.resyncTemplates()` in browser console to sync to backend
5. Add preview route in `src/App.jsx`
6. Test template preview at `/template-preview/yourtemplate`

### Working with Images
1. Images upload through Cloudinary (backend proxy)
2. Use `uploadStore` for instant local previews
3. Final Cloudinary URLs stored in portfolio data
4. Upload progress tracked automatically (0-100%)

### Debugging API Issues
1. Check Network tab in DevTools for request/response
2. Verify JWT token in localStorage: `localStorage.getItem('aurea-auth-storage')`
3. Check `authStore` state: `useAuthStore.getState()`
4. Backend URL is in `VITE_API_BASE_URL` env variable
5. All API calls go through `lib/baseApi.js` interceptor

### Testing Portfolio Publishing
1. Create portfolio in dashboard
2. Edit portfolio content
3. Publish to Vercel or custom subdomain
4. For subdomain: Access at `/{subdomain}/html`
5. Case studies at `/{subdomain}/case-study-{projectId}.html`

## Known Limitations

- No TypeScript - pure JavaScript project
- No testing framework configured
- Authentication uses localStorage (consider httpOnly cookies for production)
- No pre-commit hooks or CI/CD pipeline
- Template auto-migration disabled (use manual console functions)
- Environment variables prefixed with `VITE_` are publicly visible in browser bundle