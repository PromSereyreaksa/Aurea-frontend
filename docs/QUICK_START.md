# AUREA Frontend - Quick Start Guide

**Get the frontend running in under 10 minutes.**

This guide gets you from zero to a running development environment as quickly as possible. For comprehensive onboarding, see [DEVELOPER_ONBOARDING.md](docs/DEVELOPER_ONBOARDING.md).

---

## 📋 Quick Start Checklist (5 Minutes)

- [ ] Node.js 18+ installed
- [ ] Backend running at `http://localhost:5000`
- [ ] Clone repository
- [ ] Install dependencies (`npm install`)
- [ ] Configure environment (`.env` file)
- [ ] Start dev server (`npm run dev`)
- [ ] Access at `http://localhost:5173`

---

## 🚀 5-Minute Setup

### 1. Prerequisites

**Required:**
- **Node.js 18+** (check: `node --version`)
- **npm 9+** (check: `npm --version`)
- **Backend running** at `http://localhost:5000` (see [Backend Quick Start](../AUREA---Backend/README.md))

**Recommended:**
- Git configured
- VS Code with ESLint extension
- React Developer Tools (browser extension)

### 2. Install Dependencies

```bash
cd /path/to/Aurea-frontend
npm install
```

**What this installs:**
- React 19.1.1 - UI framework
- Vite 7.1.2 - Build tool
- Zustand - State management
- Axios - HTTP client
- Tailwind CSS 4.1.13 - Styling
- TipTap 3.4.2 - Rich text editor
- Framer Motion & GSAP - Animations
- Plus 40+ other dependencies

**Installation time:** ~2-3 minutes

### 3. Environment Configuration

Create `.env` file in the frontend root:

```bash
# Required
VITE_API_BASE_URL=http://localhost:5000

# Optional
VITE_API_TIMEOUT=10000
```

**Important:**
- ✅ Environment variables MUST start with `VITE_` to be exposed to the app
- ✅ Never put sensitive credentials in `.env` (they'll be bundled into the client)
- ✅ Backend handles all sensitive operations (Cloudinary, JWT, etc.)

### 4. Start Development Server

```bash
npm run dev
```

**Expected output:**
```
VITE v7.1.2  ready in 842 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

**Access the app:** Open `http://localhost:5173` in your browser

### 5. Verify Everything Works

**Test checklist:**
1. Homepage loads without errors
2. Open browser console - no red errors
3. Try to sign up (create test account)
4. Login works
5. Dashboard accessible after login

**If anything fails:** See [Troubleshooting](#-common-first-run-issues) below

---

## 📁 Directory Structure Overview

**Quick orientation** - where to find things:

```
Aurea-frontend/
├── src/
│   ├── pages/              # 22+ page components (lazy-loaded)
│   │   ├── HomePage.jsx    # Landing page
│   │   ├── Dashboard.jsx   # User dashboard
│   │   └── PortfolioBuilder.jsx  # Main builder
│   │
│   ├── components/         # 75 reusable components
│   │   ├── PortfolioBuilder/  # Builder-specific components
│   │   ├── Shared/            # Common UI components
│   │   └── ...
│   │
│   ├── templates/          # 4 portfolio templates
│   │   ├── Echelon/        # Template: Echelon
│   │   ├── Serene/         # Template: Serene
│   │   ├── Chic/           # Template: Chic
│   │   └── BoldFolio/      # Template: BoldFolio
│   │
│   ├── stores/             # Zustand state management
│   │   ├── authStore.js    # Authentication (247 lines)
│   │   ├── portfolioStore.js   # Portfolio CRUD (320 lines)
│   │   ├── templateStore.js    # Templates (348 lines)
│   │   └── uploadStore.js      # File uploads (281 lines)
│   │
│   ├── lib/                # API integration layer
│   │   ├── axios.js        # Axios instance with interceptors
│   │   ├── authApi.js      # Authentication endpoints
│   │   ├── portfolioApi.js # Portfolio endpoints
│   │   ├── templateApi.js  # Template endpoints
│   │   └── ... (9 API modules total)
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.js      # Authentication hook
│   │   ├── usePortfolio.js # Portfolio operations
│   │   └── ... (5 hooks total)
│   │
│   ├── utils/              # Helper utilities
│   │   ├── validators.js   # Form validation
│   │   ├── formatters.js   # Data formatting
│   │   └── ... (6 utilities total)
│   │
│   ├── App.jsx             # Root component with routing
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles (Tailwind)
│
├── public/                 # Static assets
├── docs/                   # Documentation (20+ files)
├── .env                    # Environment variables (YOU CREATE THIS)
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
└── tailwind.config.js      # Tailwind configuration
```

**Key locations for development:**
- **Add new pages:** `src/pages/` + update `src/App.jsx` routes
- **Add components:** `src/components/`
- **API calls:** `src/lib/` (use existing patterns)
- **State management:** `src/stores/` (Zustand stores)
- **Styling:** Tailwind classes in components

---

## 🔧 Common First-Run Issues

### Issue: "Cannot connect to backend"

**Symptoms:**
- Login fails with network error
- Console shows `ERR_CONNECTION_REFUSED`
- API calls fail with `Network Error`

**Solution:**
1. Verify backend is running: `curl http://localhost:5000/health`
2. Check `.env` has correct `VITE_API_BASE_URL=http://localhost:5000`
3. Restart dev server after changing `.env`
4. Check CORS settings in backend (should allow localhost:5173)

**Backend health check should return:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-14T...",
  "uptime": 123.456,
  "environment": "development"
}
```

### Issue: "Module not found" or dependency errors

**Symptoms:**
- Build fails with missing module errors
- `npm run dev` crashes

**Solution:**
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install

# If still failing, clear npm cache
npm cache clean --force
npm install
```

### Issue: Blank white screen in browser

**Symptoms:**
- Page loads but shows nothing
- No console errors

**Solution:**
1. Open React DevTools - check if components are rendering
2. Check browser console for warnings
3. Verify `src/main.jsx` is rendering `<App />`
4. Check for JavaScript errors in console

### Issue: Environment variables not working

**Symptoms:**
- `import.meta.env.VITE_API_BASE_URL` is `undefined`
- API calls go to wrong URL

**Solution:**
1. Ensure variables start with `VITE_` prefix
2. Restart dev server (`.env` changes require restart)
3. Check `.env` is in project root (same level as `package.json`)
4. Verify no typos in variable names

### Issue: Styles not loading / Tailwind not working

**Symptoms:**
- Page has no styling
- Tailwind classes don't apply

**Solution:**
1. Check `src/index.css` imports Tailwind:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
2. Verify `src/main.jsx` imports `index.css`
3. Restart dev server
4. Check `tailwind.config.js` content paths include your files

### Issue: Port 5173 already in use

**Symptoms:**
- `Error: Port 5173 is already in use`

**Solution:**
```bash
# Find and kill process using port 5173
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

### Issue: "401 Unauthorized" on API calls

**Symptoms:**
- Login works but other API calls fail
- Console shows 401 errors

**Solution:**
1. Check localStorage for token: `localStorage.getItem('aurea-auth-storage')`
2. Token might be expired (30-day expiry)
3. Clear storage and login again: `localStorage.clear()`
4. Check token is being sent in Authorization header (check Network tab)

---

## 📚 Available NPM Scripts

```bash
# Development
npm run dev              # Start dev server (http://localhost:5173)

# Building
npm run build            # Production build to dist/
npm run preview          # Preview production build locally

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Auto-fix ESLint issues

# Other
npm run clean            # Remove node_modules and reinstall
```

---

## 🎯 Your First Development Task

**Build confidence by completing this simple task:**

### Task: Add a new page

1. **Create new page component** in `src/pages/TestPage.jsx`:
```jsx
export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-gray-900">
        Test Page Works! 🎉
      </h1>
      <p className="mt-4 text-gray-600">
        You successfully created a new page.
      </p>
    </div>
  );
}
```

2. **Add route** in `src/App.jsx`:
```jsx
import TestPage from './pages/TestPage';

// Inside <Routes>
<Route path="/test" element={<TestPage />} />
```

3. **Access it:** Navigate to `http://localhost:5173/test`

**Expected result:** You should see your test page with the heading and message.

**What you learned:**
- ✅ How to create a page component
- ✅ How to add routes
- ✅ Tailwind CSS basics
- ✅ Hot module replacement (changes appear instantly)

---

## 🧭 Next Steps

Now that you're up and running:

1. **Read the architecture:** [SYSTEM_ARCHITECTURE.md](docs/SYSTEM_ARCHITECTURE.md)
   - Understand state management (Zustand)
   - Learn component organization
   - Study API integration patterns

2. **Complete onboarding:** [DEVELOPER_ONBOARDING.md](docs/DEVELOPER_ONBOARDING.md)
   - Deep dive into common development tasks
   - Learn template system
   - Understand authentication flow

3. **Explore the codebase:**
   - Browse `src/components/` to see shared components
   - Check `src/stores/` to understand state management
   - Look at `src/lib/` for API patterns
   - Explore templates in `src/templates/`

4. **Try real development tasks:**
   - Create a portfolio (login → dashboard → create)
   - Upload an image
   - Edit portfolio content
   - Preview a template

5. **Read other guides:**
   - [TROUBLESHOOTING_GUIDE.md](../TROUBLESHOOTING_GUIDE.md) - Common issues
   - [FULL_STACK_DEVELOPMENT_GUIDE.md](../FULL_STACK_DEVELOPMENT_GUIDE.md) - Frontend ↔ Backend
   - [TESTING_GUIDE.md](../TESTING_GUIDE.md) - Testing strategies

---

## 📖 Deep Dive: Configuration Options

### Environment Variables Reference

**All available environment variables:**

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:5000    # Backend URL (required)
VITE_API_TIMEOUT=10000                     # Request timeout in ms (default: 10000)

# Feature Flags (optional)
VITE_ENABLE_ANALYTICS=false                # Enable analytics tracking
VITE_ENABLE_DEBUG_MODE=true                # Show debug information

# Development (optional)
VITE_MOCK_API=false                        # Use mock API instead of real backend
```

**Production environment variables:**
```bash
VITE_API_BASE_URL=https://your-backend.com
VITE_API_TIMEOUT=30000
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG_MODE=false
```

### Vite Configuration Deep Dive

**File:** `vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,           // Dev server port
    host: true,           // Expose to network
    open: false,          // Don't auto-open browser
  },

  build: {
    outDir: 'dist',       // Output directory
    sourcemap: true,      // Generate sourcemaps
    rollupOptions: {
      output: {
        manualChunks: {   // Code splitting
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'editor': ['@tiptap/react', '@tiptap/starter-kit'],
          'animation': ['framer-motion', 'gsap'],
        }
      }
    }
  },

  optimizeDeps: {
    include: ['react', 'react-dom'],  // Pre-bundle dependencies
  }
})
```

**What you can customize:**
- **Port:** Change `server.port` to use different port
- **Auto-open:** Set `server.open: true` to open browser automatically
- **Build output:** Change `build.outDir` for different output directory
- **Sourcemaps:** Disable with `build.sourcemap: false` for production
- **Code splitting:** Modify `manualChunks` to optimize bundle size

### Tailwind Configuration Deep Dive

**File:** `tailwind.config.js`

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // Scan these files for classes
  ],

  theme: {
    extend: {
      colors: {
        // Custom brand colors
        primary: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          900: '#0c4a6e',
        },
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },

      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },

  plugins: [
    require('@tailwindcss/forms'),      // Better form styles
    require('@tailwindcss/typography'), // Prose classes for rich text
  ],
}
```

**Customization tips:**
- **Add brand colors:** Extend `theme.colors`
- **Custom fonts:** Add to `theme.fontFamily`
- **Animations:** Define in `theme.extend.animation` and `keyframes`
- **Plugins:** Add Tailwind plugins for additional utilities

### Package.json Scripts Explained

```json
{
  "scripts": {
    // Development
    "dev": "vite",                          // Starts dev server with HMR

    // Building
    "build": "vite build",                  // Production build
    "preview": "vite preview",              // Preview production build

    // Code Quality
    "lint": "eslint . --ext js,jsx",       // Check for linting errors
    "lint:fix": "eslint . --ext js,jsx --fix",  // Auto-fix errors

    // Utility
    "clean": "rm -rf node_modules && npm install"  // Clean reinstall
  }
}
```

**Create custom scripts:**
```json
{
  "scripts": {
    "dev:host": "vite --host",                    // Expose to network
    "dev:port": "vite --port 3000",               // Custom port
    "build:analyze": "vite build --mode analyze", // Analyze bundle
    "test": "vitest",                             // Run tests (if configured)
  }
}
```

---

## 🔍 Understanding the Tech Stack

### React 19.1.1

**What's new in React 19:**
- Improved concurrent rendering
- Automatic batching of state updates
- Better TypeScript support
- Enhanced error boundaries

**Key concepts used in this project:**
- **Hooks:** useState, useEffect, useCallback, useMemo
- **Context:** Not used (Zustand handles global state)
- **Lazy loading:** All pages except HomePage are lazy-loaded
- **Error boundaries:** Graceful error handling

### Vite 7.1.2

**Why Vite over Create React App:**
- ⚡️ **Instant HMR** - changes appear in < 50ms
- 📦 **Fast builds** - uses esbuild and Rollup
- 🎯 **Modern** - ES modules, no bundling in dev
- 🔧 **Flexible** - easy configuration

**Development advantages:**
- Pre-bundled dependencies (faster startup)
- Optimized hot module replacement
- Native ES modules in browser
- Fast production builds

### Zustand (State Management)

**Why Zustand over Redux:**
- 🎯 **Simpler** - no boilerplate, no actions/reducers
- 📦 **Smaller** - ~1KB vs 11KB (Redux + React-Redux)
- ⚡️ **Faster** - direct subscription to state slices
- 💾 **Persistence** - built-in localStorage sync

**Our stores:**
- `authStore` - JWT token, user data (persisted)
- `portfolioStore` - Portfolio CRUD, 30s cache
- `templateStore` - Template management
- `uploadStore` - File upload progress

**Basic usage:**
```jsx
import { useAuthStore } from './stores/authStore';

function Component() {
  const { user, login } = useAuthStore();

  return <div>Welcome {user?.name}</div>;
}
```

### Tailwind CSS 4.1.13

**Why Tailwind:**
- 🎨 **Utility-first** - rapid UI development
- 📦 **Tree-shaking** - only used classes in production
- 🎯 **Consistent** - design system built-in
- 📱 **Responsive** - mobile-first utilities

**Common patterns in this project:**
```jsx
// Responsive layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Button component
<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">

// Card component
<div className="bg-white shadow rounded-lg p-6">
```

### Axios 1.12.1

**Why Axios over fetch:**
- 🔄 **Interceptors** - automatic token injection
- ⚠️ **Better errors** - automatic error handling
- 🔁 **Retries** - built-in retry logic
- 📊 **Progress** - upload/download progress tracking

**Our setup:**
- Base URL from environment variable
- Automatic JWT token in Authorization header
- 401 interceptor redirects to login
- Request/response logging in development

---

## 💡 Pro Tips

1. **Use React DevTools**
   - Install browser extension
   - Inspect component tree
   - Check props and state
   - Profile performance

2. **Check Network Tab**
   - Verify API calls
   - Check request/response
   - Inspect headers (Authorization token)
   - Debug CORS issues

3. **Use Browser Console**
   - Check for errors and warnings
   - Test stores: `useAuthStore.getState()`
   - Clear localStorage: `localStorage.clear()`
   - Check environment: `import.meta.env`

4. **Hot Module Replacement**
   - Changes appear instantly
   - State is preserved
   - No full page reload needed
   - Makes development super fast

5. **VSCode Extensions**
   - ESLint - code quality
   - Prettier - code formatting
   - Tailwind CSS IntelliSense - class suggestions
   - ES7+ React snippets - code snippets

6. **Keyboard Shortcuts (Vite dev server)**
   - `r` - force reload
   - `o` - open in browser
   - `c` - clear console
   - `q` - quit server

---

## 🆘 Getting Help

**If you're stuck:**

1. **Check troubleshooting:** [TROUBLESHOOTING_GUIDE.md](../TROUBLESHOOTING_GUIDE.md)
2. **Read architecture docs:** [SYSTEM_ARCHITECTURE.md](docs/SYSTEM_ARCHITECTURE.md)
3. **Browse code examples:** Look at existing components for patterns
4. **Check browser console:** Most issues show errors there
5. **Verify backend:** Ensure backend is running and healthy
6. **Ask team:** Reach out in team chat with error details

**Include when asking for help:**
- What you're trying to do
- What you expected to happen
- What actually happened (error message)
- Browser console output
- Network tab screenshot (for API issues)
- Your environment (OS, Node version)

---

## ✅ Quick Start Completion Checklist

You've successfully completed quick start when you can:

- [x] Start development server without errors
- [x] Access frontend at http://localhost:5173
- [x] Create a test account
- [x] Login successfully
- [x] See dashboard
- [x] Create a test page (from task above)
- [x] Understand directory structure
- [x] Know where to find documentation

**Congratulations!** You're ready to start developing. 🎉

**Next:** Read [DEVELOPER_ONBOARDING.md](docs/DEVELOPER_ONBOARDING.md) for comprehensive onboarding.
