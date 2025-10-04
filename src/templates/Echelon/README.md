# Echelon Template - Case Study Structure

## Overview
This document defines the complete structure for case studies in the Echelon template. Backend teams should use this to compile portfolios to static HTML/CSS/JS and host them.

---

## Directory Structure
```
src/templates/Echelon/
├── CASE_STUDY_STRUCTURE.json    # Data structure (this file's companion)
├── README.md                     # This file
├── Echelon.json                 # Template configuration
├── EchelonTemplate.jsx          # Main template component
├── EchelonCaseStudyPage.jsx     # Static case study display
├── EchelonCaseStudyEditorPage.jsx # Case study editor
├── sections/                     # Template sections
│   ├── EchelonHero.jsx
│   ├── EchelonAbout.jsx
│   ├── EchelonWork.jsx
│   ├── EchelonGallery.jsx
│   └── EchelonContact.jsx
└── components/                   # Reusable components
    └── ... (shared components)
```

---

## Case Study Data Structure

### Storage Location
Case studies are stored within projects:
```javascript
portfolio.content.work.projects[index].caseStudy
```

### Complete Structure
```json
{
  "caseStudy": {
    "title": "LOGO DESIGN PROCESS",
    "category": "BRANDING / IDENTITY",
    "year": "2025",
    "intro": "Project introduction...",
    "heroImage": "https://cdn.example.com/hero.jpg",
    "steps": [
      { "num": "01", "title": "RESEARCH", "desc": "Understanding..." },
      { "num": "02", "title": "SKETCH", "desc": "Exploring..." },
      { "num": "03", "title": "DIGITAL", "desc": "Refining..." },
      { "num": "04", "title": "SOURCE FILES", "desc": "Delivering..." }
    ],
    "sections": [
      {
        "id": 1,
        "number": "01",
        "title": "RESEARCH",
        "subsections": [
          {
            "id": 11,
            "title": "QUESTIONNAIRE",
            "content": "Multi-line content...",
            "image": "https://cdn.example.com/img1.jpg",
            "imageCaption": "Figure 02 — Description"
          }
        ]
      }
    ]
  }
}
```

---

## Backend Compilation Guide

### 1. Technology Stack
- **Frontend Framework**: React or vanilla JS
- **CSS Framework**: Tailwind CSS
- **Build Tool**: Vite or Webpack
- **Output**: Static HTML/CSS/JS files

### 2. Compilation Process

#### Step 1: Fetch Portfolio Data
```javascript
// GET /api/portfolios/:portfolioId
const portfolio = await fetch(`/api/portfolios/${portfolioId}`);
const data = await portfolio.json();
```

#### Step 2: Extract Case Study
```javascript
const project = data.content.work.projects.find(p => p.id === projectId);
const caseStudy = project.caseStudy;
```

#### Step 3: Compile to HTML
```javascript
// Use React Server-Side Rendering (SSR)
import { renderToString } from 'react-dom/server';
import EchelonCaseStudyPage from './EchelonCaseStudyPage';

const html = renderToString(
  <EchelonCaseStudyPage caseStudy={caseStudy} />
);
```

#### Step 4: Generate Static Files
```bash
# Build with Vite
npm run build

# Output structure:
dist/
├── index.html
├── assets/
│   ├── index-[hash].css
│   └── index-[hash].js
└── case-study/
    └── logo-design-process/
        └── index.html
```

### 3. Hosting Structure
```
https://portfolio.aurea.com/
├── portfolios/
│   └── {portfolioId}/
│       ├── index.html              # Main portfolio page
│       ├── case-study/
│       │   └── {slug}/
│       │       └── index.html      # Case study page
│       └── assets/
│           ├── css/
│           ├── js/
│           └── images/
```

---

## Swiss Design System (Echelon Style)

### Typography
```css
/* Primary Font */
font-family: 'Neue Haas Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif;

/* Monospace (for numbers) */
font-family: 'IBM Plex Mono', 'SF Mono', Consolas, monospace;

/* Sizes */
h1: 72px / 4.5rem
h2: 48px / 3rem
h3: 32px / 2rem
h4: 24px / 1.5rem
body: 18px / 1.125rem
small: 16px / 1rem
meta: 14px / 0.875rem

/* Line Heights */
tight: 1.1
normal: 1.4
relaxed: 1.6

/* Weights */
regular: 400
bold: 700
```

### Color System
```css
/* Primary Colors */
--color-black: #000000;
--color-white: #FFFFFF;
--color-red: #FF0000;      /* Accent */
--color-gray: #666666;     /* Secondary text */

/* Borders */
--border-color: #000000;
--border-width: 2px;
```

### Grid System
```css
/* 12-column grid */
--grid-columns: 12;
--grid-gutter: 24px;
--grid-margin: 80px;
--baseline: 8px;

/* Spacing Scale (multiples of 8px) */
--spacing-tight: 16px;
--spacing-element: 40px;
--spacing-section: 120px;
```

### Layout Classes
```css
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 80px;
}

.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
}

/* Responsive breakpoints */
@media (max-width: 1280px) { /* Wide desktop */ }
@media (max-width: 1024px) { /* Desktop */ }
@media (max-width: 768px)  { /* Tablet */ }
@media (max-width: 640px)  { /* Mobile */ }
```

---

## API Endpoints

### 1. Get Portfolio
```
GET /api/portfolios/:portfolioId
```
**Response:**
```json
{
  "success": true,
  "portfolio": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "John Doe Portfolio",
    "template": "echolon",
    "content": {
      "work": {
        "projects": [
          {
            "id": 1,
            "caseStudy": { /* full case study */ }
          }
        ]
      }
    }
  }
}
```

### 2. Save Portfolio
```
PUT /api/portfolios/:portfolioId
```
**Request:**
```json
{
  "template": "echolon",
  "content": {
    "work": {
      "projects": [
        { "id": 1, "caseStudy": { /* case study data */ } }
      ]
    }
  }
}
```

### 3. Update Project
```
PATCH /api/portfolios/:portfolioId/projects/:projectId
```
**Request:**
```json
{
  "title": "Updated Title",
  "caseStudy": { /* updated case study */ }
}
```

---

## Component Mapping

### EchelonCaseStudyPage.jsx
Maps data structure to React components:

```jsx
// Hero Section
<div className="hero">
  <span>{caseStudy.category}</span>
  <span>{caseStudy.year}</span>
  <h1>{caseStudy.title}</h1>
  <p>{caseStudy.intro}</p>
  <img src={caseStudy.heroImage} />
</div>

// Steps Grid (4-column)
<div className="grid-4">
  {caseStudy.steps.map(step => (
    <div key={step.num}>
      <span className="mono">{step.num}</span>
      <h3>{step.title}</h3>
      <p>{step.desc}</p>
    </div>
  ))}
</div>

// Main Sections
{caseStudy.sections.map(section => (
  <section key={section.id}>
    <h2>
      <span className="mono">{section.number}</span>
      {section.title}
    </h2>
    {section.subsections.map(subsection => (
      <div key={subsection.id}>
        <h3>{subsection.title}</h3>
        <p>{subsection.content}</p>
        {subsection.image && (
          <figure>
            <img src={subsection.image} />
            <figcaption>{subsection.imageCaption}</figcaption>
          </figure>
        )}
      </div>
    ))}
  </section>
))}
```

---

## Image Handling

### Required CDN Integration
Backend should integrate with Cloudinary or similar:

```javascript
// Image upload endpoint
POST /api/upload/image
Content-Type: multipart/form-data

// Response
{
  "url": "https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg",
  "publicId": "sample",
  "format": "jpg",
  "width": 1200,
  "height": 800
}
```

### Responsive Images
Generate multiple sizes:
```javascript
const sizes = {
  hero: { width: 1920, height: 1080 },
  section: { width: 1200, height: 800 },
  thumbnail: { width: 400, height: 267 }
};

// Cloudinary transformation URLs
https://res.cloudinary.com/demo/image/upload/w_1920,h_1080,c_fill/sample.jpg
https://res.cloudinary.com/demo/image/upload/w_1200,h_800,c_fill/sample.jpg
https://res.cloudinary.com/demo/image/upload/w_400,h_267,c_fill/sample.jpg
```

---

## Validation Rules

### Backend Validation
```javascript
const caseStudySchema = {
  title: { type: 'string', required: true, maxLength: 100 },
  category: { type: 'string', required: true, maxLength: 50 },
  year: { type: 'string', required: true, pattern: /^\d{4}$/ },
  intro: { type: 'string', required: true, maxLength: 500 },
  heroImage: { type: 'string', required: false, pattern: /^https?:\/\/.+/ },
  steps: {
    type: 'array',
    required: true,
    minItems: 3,
    maxItems: 6,
    items: {
      num: { type: 'string', required: true },
      title: { type: 'string', required: true },
      desc: { type: 'string', required: true }
    }
  },
  sections: {
    type: 'array',
    required: true,
    minItems: 1,
    maxItems: 10,
    items: {
      id: { type: 'number', required: true },
      number: { type: 'string', required: true },
      title: { type: 'string', required: true },
      subsections: {
        type: 'array',
        required: true,
        minItems: 1,
        items: {
          id: { type: 'number', required: true },
          title: { type: 'string', required: true },
          content: { type: 'string', required: true },
          image: { type: 'string', required: false },
          imageCaption: { type: 'string', required: false }
        }
      }
    }
  }
};
```

---

## Performance Optimization

### 1. Image Optimization
- Compress images: Use WebP format
- Lazy loading: Load images on scroll
- Responsive images: Use srcset

```html
<img
  src="image-800.jpg"
  srcset="image-400.jpg 400w, image-800.jpg 800w, image-1200.jpg 1200w"
  sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
  loading="lazy"
  alt="Description"
/>
```

### 2. CSS Optimization
- Purge unused Tailwind classes
- Minify CSS
- Critical CSS inline in HTML

### 3. JS Optimization
- Code splitting
- Tree shaking
- Minification

---

## Deployment Checklist

### Pre-Deploy
- [ ] Validate all case study data against schema
- [ ] Compress and optimize images
- [ ] Test responsive layouts (mobile, tablet, desktop)
- [ ] Verify all internal links work
- [ ] Check font loading
- [ ] Test print styles

### Build Process
```bash
# 1. Install dependencies
npm install

# 2. Build for production
npm run build

# 3. Preview build
npm run preview

# 4. Deploy to hosting
# (Vercel, Netlify, AWS S3, etc.)
```

### Post-Deploy
- [ ] Verify live URL works
- [ ] Test all case study pages
- [ ] Check image loading
- [ ] Verify responsive design
- [ ] Test browser compatibility
- [ ] Run Lighthouse audit (aim for 90+ score)

---

## Example Build Scripts

### package.json
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "build:portfolio": "node scripts/build-portfolio.js"
  }
}
```

### scripts/build-portfolio.js
```javascript
const fs = require('fs');
const { renderToString } = require('react-dom/server');

async function buildPortfolio(portfolioId) {
  // 1. Fetch portfolio data
  const portfolio = await fetchPortfolio(portfolioId);
  
  // 2. Render to HTML
  const html = renderToString(<Portfolio data={portfolio} />);
  
  // 3. Write to dist folder
  fs.writeFileSync(`dist/${portfolioId}/index.html`, html);
  
  // 4. Build case studies
  portfolio.content.work.projects.forEach(project => {
    if (project.caseStudy) {
      const caseStudyHtml = renderToString(
        <CaseStudy data={project.caseStudy} />
      );
      const slug = project.caseStudyUrl.split('/').pop();
      fs.writeFileSync(
        `dist/${portfolioId}/case-study/${slug}/index.html`,
        caseStudyHtml
      );
    }
  });
}
```

---

## TypeScript Definitions

```typescript
// types/echelon.ts
export interface CaseStudy {
  title: string;
  category: string;
  year: string;
  intro: string;
  heroImage: string;
  steps: Step[];
  sections: Section[];
}

export interface Step {
  num: string;
  title: string;
  desc: string;
}

export interface Section {
  id: number;
  number: string;
  title: string;
  subsections: Subsection[];
}

export interface Subsection {
  id: number;
  title: string;
  content: string;
  image?: string;
  imageCaption?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  meta: string;
  category: string;
  caseStudyUrl?: string;
  caseStudy?: CaseStudy;
}

export interface EchelonTemplate {
  id: string;
  name: string;
  content: {
    hero: any;
    about: any;
    work: {
      heading: string;
      projects: Project[];
    };
    gallery: any;
    contact: any;
  };
}
```

---

## Support & Contact

For questions or issues:
- **Frontend Team**: Check EchelonCaseStudyPage.jsx for rendering logic
- **Backend Team**: Refer to CASE_STUDY_STRUCTURE.json for data format
- **Design**: Follow Swiss typography guidelines in this README

Last Updated: October 4, 2025
