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
└── hooks/              # Custom React hooks
```

### Routing Structure

All routes are defined in `src/App.jsx`. Protected routes require authentication via the `ProtectedRoute` component.

Key routes:
- `/` - HomePage (eager loaded)
- `/dashboard` - User dashboard (protected)
- `/portfolio-builder/:id` - Portfolio editor (protected)
- `/portfolio/:slug` - Published portfolio view
- `/login`, `/signup` - Authentication pages

### State Management

The application uses Zustand for state management with two main stores:

**authStore** (`src/stores/authStore.js`):
- Manages user authentication, JWT tokens, and profile
- Persists to localStorage with key "aurea-auth-storage"
- Auto-checks token expiration every 60 seconds

**portfolioStore** (`src/stores/portfolioStore.js`):
- Manages portfolio CRUD operations
- Tracks current portfolio and statistics
- Handles loading states

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

Templates are located in `src/templates/`. The Echelon template provides:
- Swiss-style minimalist design
- Customizable sections
- Case study support
- Animated backgrounds (Aurora, Plasma, Prism, Silk)
- Responsive layout

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

## Performance Optimizations

- **Code Splitting**: All pages lazy-loaded except HomePage
- **Image Optimization**: Cloudinary for external image storage
- **CSS**: Tailwind with content purging in production
- **Animations**: GSAP with optimized configurations
- **Bundle Size**: Vite tree-shaking enabled

## Deployment

The application deploys to Vercel with:
- SPA routing configured in `vercel.json`
- Environment variables set in Vercel dashboard
- Automatic deploys from main branch
- Production build created via `npm run build`

## Important Documentation

The project includes extensive documentation:
- `UPDATES.md` - Modern design system and component details
- `BACKEND_INTEGRATION.md` - API specifications and endpoints
- `TEMPLATE_EXPORT_GUIDE.md` - PDF export functionality
- `INTEGRATION_TESTING_GUIDE.md` - Testing procedures

## Known Limitations

- No TypeScript - pure JavaScript project
- No testing framework configured
- Authentication uses localStorage (consider httpOnly cookies for production)
- No pre-commit hooks or CI/CD pipeline