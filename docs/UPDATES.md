# AUREA Frontend Updates Documentation

## Overview

This document outlines all the major updates and improvements made to the AUREA frontend application, focusing on the modern redesign and enhanced user experience.

---

## Table of Contents

1. [Design System Updates](#design-system-updates)
2. [Navigation System](#navigation-system)
3. [Page Redesigns](#page-redesigns)
4. [Component Architecture](#component-architecture)
5. [Feature Implementations](#feature-implementations)
6. [Technical Improvements](#technical-improvements)

---

## Design System Updates

### Brand Colors

- **Primary Orange**: `#fb8500` - Main brand color used for CTAs, accents, and interactive elements
- **Secondary Orange**: `#ff9500` - Lighter variant for hover states
- **Near Black**: `#1a1a1a` - Primary text and dark backgrounds
- **Neutral Light**: `#f8f9fa` - Light backgrounds and dividers

### Typography

- **Font Family**: Monda (Google Fonts) with weights 400 and 700
- **Font Scoping**: Applied via `.app-page` class for consistent styling across all pages

### Design Patterns

- **Eyebrow Tags**: Orange rounded pills with uppercase text and icons for section headers
- **Floating Gradients**: Subtle animated gradient backgrounds for visual interest
- **Card Hover Effects**: Border color changes to orange with smooth transitions (no scale pop-out)
- **Rounded Corners**: Consistent use of `rounded-xl` and `rounded-2xl` for modern look
- **Subtle Borders**: `border border-gray-100` or `border-gray-200` for clean separation

---

## Navigation System

### ModernNavbar Component

**Location**: `src/components/LandingPage/ModernNavbar.jsx`

#### Key Features

- **Smart Context-Aware Navigation**: Automatically adapts menu items based on current route
- **Smooth Scroll-to-Section**: Animated scrolling to page sections
- **Framer Motion Animations**: Slide-down entrance, hover effects, and underline animations
- **User Authentication Support**: Shows user dropdown when authenticated, login/signup when not
- **Responsive Design**: Mobile-friendly with proper breakpoints

#### Navigation Items by Page

| Page                 | Navigation Items                                   |
| -------------------- | -------------------------------------------------- |
| HomePage (`/`)       | Home, Features, How It Works, Testimonials, About  |
| AboutPage (`/about`) | Home, Our Story, Our Values, Our Team, Our Mission |
| Other pages          | Home, About, Dashboard                             |

#### Technical Specifications

- **Fixed Position**: `fixed top-0` with backdrop blur effect
- **Z-Index**: `z-50` to stay above all content
- **Background**: `bg-white/95` with `backdrop-blur-sm`
- **Height**: `py-3 sm:py-4` for consistent spacing
- **User Dropdown Features**:
  - Profile link
  - Dashboard link
  - Logout functionality
  - User initials avatar with gradient background

---

## Page Redesigns

### 1. HomePage

**Location**: `src/pages/HomePage.jsx`

#### Structure

```
ModernNavbar
  ↓
ModernHero
  ↓
TrustBanner
  ↓
FeaturesGrid
  ↓
HowItWorks
  ↓
StatsSection
  ↓
TestimonialsSection
  ↓
FinalCTA
  ↓
ModernFooter
```

#### Key Components

**ModernHero**

- Eyebrow tag: "Where Creativity Meets Simplicity"
- Large headline with orange accent text
- Dual CTA buttons (Get Started Free, See Examples)
- Mock portfolio preview with floating badges
- Floating gradient backgrounds

**TrustBanner**

- Company logos: Adobe, Figma, Sketch, InVision, Dribbble, Behance
- Light gray background for separation

**FeaturesGrid** (ID: `features`)

- 6 features in 3-column responsive grid
- Icon boxes with hover color changes
- Features: Lightning Fast, Design Freedom, Mobile Perfect, One-Click Deploy, Zero Code, Unlimited Projects

**HowItWorks** (ID: `how-it-works`)

- 3-step process with numbered cards
- Connection line between steps
- Icons: Upload, Wand2, Share2
- Steps: Upload Your Work → Customize → Publish & Share

**StatsSection**

- Dark background with orange accents
- 4 key metrics: 10min setup, 5000+ designers, 99.9% uptime, 24/7 support

**TestimonialsSection** (ID: `testimonials`)

- 3 testimonial cards in grid layout
- Quote icons and gradient backgrounds
- Featured designers from Figma, Adobe, Dribbble

**FinalCTA**

- Dark gradient background
- Floating decorative elements
- Dual CTAs: "Get Started Free" and "Talk to Sales"

**ModernFooter**

- 4-column layout: Brand, Product, Resources, Company, Legal
- Social media icons (Twitter, GitHub, LinkedIn, Instagram)
- Dark background with proper contrast

---

### 2. AboutPage

**Location**: `src/pages/AboutPage.jsx`

#### Structure

```
ModernNavbar
  ↓
Hero Section
  ↓
Story Section (ID: story)
  ↓
Values Section (ID: values)
  ↓
Team Section (ID: team)
  ↓
Mission Section (ID: mission)
  ↓
ModernFooter
```

#### Sections Details

**Hero Section**

- Floating gradient backgrounds with animation
- Eyebrow tag: "About AUREA"
- Large headline: "Empowering designers to showcase brilliance"
- Mission statement subtext

**Story Section**

- Two-column layout (text + visual)
- Eyebrow tag: "Our Story"
- Gradient box with "AUREA" text as visual element
- Company narrative and vision

**Values Section**

- 2-column grid of value cards
- Values:
  1. Prioritize designer growth (TrendingUp icon)
  2. Support fair pricing for designers (DollarSign icon)
- Each card has icon, title, and description

**Team Section**

- Simple 3-column grid (1→2→3 responsive)
- 6 team members displayed in order:
  1. Kao Sodavann - Founder
  2. Prom Sereyreaksa - Co-Founder
  3. Chea Ilong - Backend Developer
  4. Kosal Sophanith - Frontend Developer
  5. Huy Visa - Business Analyst
  6. Chheang Sovanpanha - Business Analyst
- Square profile images with rounded borders
- Contact icons: Email, Telegram, LinkedIn
- Hover effects on cards (border → orange)

**Mission Section**

- Dark gradient background
- White text with orange accents
- Eyebrow tag: "Our Mission"
- Call-to-action button

---

### 3. ProfilePage (NEW DESIGN)

**Location**: `src/pages/ProfilePage.jsx`

#### Overview

Complete redesign with focus on simplicity and functionality. **No navbar** for a clean, focused experience.

#### Structure

```
Back Button
  ↓
Profile Picture Section
  ↓
Account Information Section
  ↓
Account Details Section
  ↓
Delete Account Section
```

#### Sections Details

**Profile Picture Section**

- Large circular avatar (24×24 on desktop)
- Initials fallback when no image
- Single "Choose File" upload button
- File format guidance: "JPG, PNG or GIF. Max size 2MB"
- Real-time preview on file selection

**Account Information Section**

- Inline editing with Edit/Save/Cancel buttons
- Fields:
  - **First Name**: Text input, editable
  - **Last Name**: Text input, editable
  - **Username**: Text input, editable
  - **Email**: Email input, editable
- View mode shows current values
- Edit mode shows form inputs with orange focus rings
- Connected to backend via `updateProfile` API

**Account Details Section**

- Read-only statistics with colored icon boxes
- Stats displayed:
  1. **Account created** (Blue, Calendar icon) - Formatted date
  2. **Total number of exports** (Green, FileText icon) - Count
  3. **Non-showcased projects** (Purple, EyeOff icon) - Unpublished portfolio count
  4. **Showcased projects** (Orange, Eye icon) - Published portfolio count
  5. **Storage used** (Gray, HardDrive icon) - MB format

**Delete Account Section**

- Red warning box with alert icon
- Clear warning message
- "Contact Support" email link button
- Emphasizes permanent data deletion

#### Technical Implementation

```javascript
// Data Sources
- User data: useAuthStore()
- Portfolio data: usePortfolioStore()

// State Management
- isEditing: Toggle edit mode
- isSaving: Track save progress
- formData: Form field values
- avatarFile: Selected avatar file
- avatarPreview: Preview URL

// Key Functions
- handleSave(): Async save to backend
- handleCancel(): Reset form to original values
- handleAvatarChange(): Handle file selection
- fetchUserPortfolios(): Load portfolio data

// Auto-sync
- useEffect: Fetches portfolios on mount
- useEffect: Updates form when user data changes
```

---

## Component Architecture

### Reusable Components Created

#### 1. ModernNavbar

- **Purpose**: Universal navigation bar for all pages
- **Reusability**: Single component adapts to any page
- **Props**: None (uses `useLocation` internally)

#### 2. ModernHero

- **Purpose**: Landing page hero section
- **Features**: Eyebrow tag, headline, CTAs, preview
- **Animations**: Framer Motion entrance animations

#### 3. FeaturesGrid

- **Purpose**: 6-feature showcase
- **Layout**: Responsive grid (1→2→3 columns)
- **Interactions**: Icon color change on hover

#### 4. HowItWorks

- **Purpose**: 3-step process explanation
- **Features**: Numbered cards, connection line
- **Icons**: Lucide React icons

#### 5. StatsSection

- **Purpose**: Key metrics display
- **Styling**: Dark background, orange numbers
- **Layout**: 4-column responsive grid

#### 6. TestimonialsSection

- **Purpose**: Customer testimonials
- **Layout**: 3-column card grid
- **Styling**: Quote icons, gradient backgrounds

#### 7. FinalCTA

- **Purpose**: Bottom call-to-action
- **Features**: Decorative floating elements
- **Styling**: Dark gradient background

#### 8. ModernFooter

- **Purpose**: Site footer with links and social
- **Layout**: Multi-column responsive
- **Features**: Logo, link groups, social icons

---

## Feature Implementations

### 1. Scroll-to-Section Navigation

**Implementation**:

```javascript
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};
```

**Section IDs**:

- `features` - FeaturesGrid section
- `how-it-works` - HowItWorks section
- `testimonials` - TestimonialsSection
- `story` - About page story section
- `values` - About page values section
- `team` - About page team section
- `mission` - About page mission section

### 2. User Profile Management

**Features**:

- ✅ Avatar upload with preview
- ✅ Inline form editing
- ✅ Save to backend with loading state
- ✅ Auto-sync with auth store
- ✅ Form validation ready

**API Integration**:

```javascript
await updateProfile({
  firstName: formData.firstName,
  lastName: formData.lastName,
  username: formData.username,
  email: formData.email,
});
```

### 3. Portfolio Statistics

**Real-time Calculations**:

```javascript
const totalProjects = portfolios?.length || 0;
const publishedProjects = portfolios?.filter((p) => p.published)?.length || 0;
const unpublishedProjects = totalProjects - publishedProjects;
```

**Data Source**: `usePortfolioStore()` with auto-fetch on page load

### 4. Authentication UI

**User Dropdown**:

- User initials avatar with gradient
- Profile link
- Dashboard link
- Logout button with confirmation

**Public Navigation**:

- Login button (desktop only)
- Sign Up button with animated background
- Responsive visibility

---

## Technical Improvements

### 1. Code Organization

**Before**:

- Components scattered in multiple directories
- Redundant navbar components for each page

**After**:

- Components organized by page: `LandingPage/`, `AboutPage/`, `Shared/`
- Single unified `ModernNavbar` component
- Clear separation of concerns

### 2. State Management

**Auth Store Integration**:

- `user` data
- `isAuthenticated` status
- `updateProfile` function
- `logout` function

**Portfolio Store Integration**:

- `portfolios` array
- `fetchUserPortfolios` function
- Auto-fetch on component mount

### 3. Animation System

**Framer Motion Usage**:

- Page entrance animations
- Hover effects with `whileHover`
- Tap effects with `whileTap`
- Stagger animations for lists
- Floating gradient animations

**Example**:

```javascript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
  {/* Content */}
</motion.div>
```

### 4. Responsive Design

**Breakpoints**:

- **Mobile**: Base styles
- **sm** (640px): 2-column layouts, adjusted spacing
- **md** (768px): Medium screens
- **lg** (1024px): 3-column layouts, show desktop nav

**Patterns**:

- Mobile-first approach
- Grid columns: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Spacing: `gap-4 sm:gap-6 lg:gap-8`
- Text sizes: `text-base sm:text-lg lg:text-xl`

### 5. Performance Optimizations

- **Lazy Loading**: Components load on demand
- **Image Optimization**: Avatar preview before upload
- **Auto-fetch**: Portfolio data fetched once on mount
- **Memoization**: Using `useEffect` dependencies correctly

---

## File Structure

### New Components

```
src/
├── components/
│   ├── LandingPage/
│   │   ├── ModernNavbar.jsx          ← Unified navbar
│   │   ├── ModernHero.jsx            ← Hero section
│   │   ├── TrustBanner.jsx           ← Company logos
│   │   ├── FeaturesGrid.jsx          ← 6 features
│   │   ├── HowItWorks.jsx            ← 3-step process
│   │   ├── StatsSection.jsx          ← Key metrics
│   │   ├── TestimonialsSection.jsx   ← Customer quotes
│   │   ├── FinalCTA.jsx              ← Bottom CTA
│   │   └── ModernFooter.jsx          ← Site footer
│   └── Shared/
│       └── Navbar.jsx                 ← Legacy (StaggeredMenu)
└── pages/
    ├── HomePage.jsx                   ← Updated with new components
    ├── AboutPage.jsx                  ← Modern redesign
    └── ProfilePage.jsx                ← Complete rebuild
```

### Deleted Components

- ❌ `ModernAboutNavbar.jsx` - Redundant, replaced by unified ModernNavbar

---

## Breaking Changes

### None

All updates are backwards compatible. Old components remain available but unused.

---

## Migration Guide

### For New Pages

To use the modern design system on a new page:

1. **Add the navbar**:

```jsx
import ModernNavbar from "../components/LandingPage/ModernNavbar";

<ModernNavbar />;
```

2. **Add the app-page class**:

```jsx
<div className="app-page min-h-screen">{/* Content */}</div>
```

3. **Use section IDs for navigation**:

```jsx
<section id="your-section-id">{/* Content */}</section>
```

4. **Follow design patterns**:

- Use eyebrow tags for section headers
- Use orange (`#fb8500`) for accents
- Use `rounded-xl` or `rounded-2xl` for cards
- Use `border border-gray-100` for subtle borders

---

## Color Reference

### Primary Palette

```css
/* Orange */
--aurea-orange: #fb8500;
--aurea-orange-light: #ff9500;
--aurea-orange-bg: rgba(251, 133, 0, 0.1);

/* Dark */
--aurea-dark: #1a1a1a;
--aurea-dark-secondary: #2a2a2a;

/* Neutrals */
--aurea-gray-50: #f8f9fa;
--aurea-gray-100: #f1f3f5;
--aurea-gray-200: #e9ecef;
```

### Section Colors (Account Details)

```css
/* Blue - Account Created */
bg-blue-50, text-blue-600

/* Green - Exports */
bg-green-50, text-green-600

/* Purple - Non-showcased */
bg-purple-50, text-purple-600

/* Orange - Showcased */
bg-orange-50, text-orange-600

/* Gray - Storage */
bg-gray-50, text-gray-600
```

---

## Future Enhancements

### Planned Features

- [ ] Avatar upload to backend implementation
- [ ] Profile image cropping/editing
- [ ] Password change functionality
- [ ] Email verification flow
- [ ] Storage quota visualization (progress bar)
- [ ] Export history with details
- [ ] Dark mode support
- [ ] Accessibility improvements (ARIA labels)
- [ ] Loading skeletons for better UX
- [ ] Error boundary components

---

## Testing Notes

### Pages to Test

1. **HomePage** - Check all sections scroll correctly
2. **AboutPage** - Verify team section displays all members
3. **ProfilePage** - Test edit/save functionality

### User Flows to Verify

1. **Navigation**: Click all nav items on each page
2. **Profile Edit**: Edit and save user information
3. **Avatar Upload**: Select and preview image
4. **Responsive**: Test on mobile, tablet, desktop
5. **Authentication**: Test logged-in vs logged-out states

---

## Version History

### v1.01 (Current)

- Complete modern redesign
- Unified navigation system
- ProfilePage rebuild
- Real backend integration

### Previous

- Original design with basic components

---

## Credits

**Design Inspiration**: eraser.io minimal aesthetic
**Icon Library**: Lucide React
**Animation Library**: Framer Motion
**Font**: Monda (Google Fonts)
**Framework**: React + Vite + Tailwind CSS

---

## Support

For questions or issues regarding these updates:

- Contact the development team
- Review component source code
- Check design-spec.json for design specifications

---

**Last Updated**: October 16, 2025
**Document Version**: 1.0
