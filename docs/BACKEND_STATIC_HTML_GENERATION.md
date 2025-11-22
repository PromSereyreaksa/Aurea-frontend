# Backend Static HTML Generation Guide

## Overview

When a user publishes their portfolio, the backend needs to generate static HTML files that can be served without React. This document provides all the information needed to generate HTML for all 4 templates.

---

## API Endpoints Required

### 1. Main Portfolio HTML
```
GET /api/sites/{subdomain}/raw-html
Response: { success: true, html: "<!DOCTYPE html>..." }
```

### 2. Project/Case Study HTML
```
GET /api/sites/{subdomain}/case-study/{projectId}/raw-html
Response: { success: true, html: "<!DOCTYPE html>..." }
```

### 3. Project Data (for React app - already discussed)
```
GET /api/sites/{portfolioId}/project/{projectId}
Response: { success: true, data: { portfolio: {...}, project: {...} } }
```

---

## Template Data Structures

### Portfolio Schema
```javascript
{
  _id: ObjectId,
  title: String,
  subdomain: String,           // URL slug (e.g., "john-doe")
  template: String,            // "echelon" | "serene" | "chic" | "boldfolio"
  isPublished: Boolean,
  content: {                   // Template-specific content
    // See template sections below
  },
  styling: {
    colors: {
      primary: String,         // e.g., "#FF0000"
      secondary: String,
      background: String,
      text: String,
      accent: String,
      border: String
    },
    fonts: {
      headingFont: String,     // e.g., "Neue Haas Grotesk"
      bodyFont: String
    }
  },
  caseStudies: {
    // projectId -> case study content
  }
}
```

---

## Template 1: ECHELON

### Content Structure
```javascript
content: {
  hero: {
    name: "DESIGNER NAME",
    title: "CREATIVE DIRECTOR",
    tagline: "Creating meaningful design experiences"
  },
  about: {
    bio: "About text...",
    skills: ["Branding", "UI/UX", "Typography"]
  },
  work: {
    projects: [
      {
        id: "project-1",           // IMPORTANT: Used for case study links
        title: "Project Title",
        description: "Short description",
        image: "https://cloudinary.com/...",
        meta: "2024 — BRANDING",
        category: "Branding"
      }
    ]
  },
  contact: {
    email: "hello@example.com"
  }
}
```

### Echelon Color Scheme (Default)
```css
--primary: #000000;
--secondary: #666666;
--accent: #FF0000;
--background: #FFFFFF;
--border: #E5E5E5;
```

### Echelon Fonts
```css
font-family: "Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif;
/* For mono elements */
font-family: "IBM Plex Mono", monospace;
```

### Echelon HTML Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{portfolio.title}</title>
  <style>
    /* Reset */
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: "Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif;
      background: #FFFFFF;
      color: #000000;
      line-height: 1.4;
    }

    /* Hero Section */
    .echelon-hero {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 60px;
    }

    .echelon-hero-name {
      font-size: clamp(48px, 12vw, 180px);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: -0.03em;
      line-height: 0.85;
    }

    .echelon-hero-title {
      font-family: "IBM Plex Mono", monospace;
      font-size: 14px;
      color: #FF0000;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      margin-top: 40px;
    }

    /* Work Section */
    .echelon-work {
      padding: 120px 60px;
    }

    .echelon-section-label {
      font-family: "IBM Plex Mono", monospace;
      font-size: 12px;
      color: #FF0000;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      margin-bottom: 60px;
    }

    .echelon-project {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      margin-bottom: 120px;
      align-items: center;
    }

    .echelon-project-image {
      width: 100%;
      aspect-ratio: 4/3;
      object-fit: cover;
      background: #F5F5F5;
    }

    .echelon-project-meta {
      font-family: "IBM Plex Mono", monospace;
      font-size: 12px;
      color: #666666;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 20px;
    }

    .echelon-project-title {
      font-size: clamp(32px, 5vw, 64px);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: -0.02em;
      margin-bottom: 24px;
    }

    .echelon-project-desc {
      font-size: 18px;
      line-height: 1.6;
      color: #333333;
      margin-bottom: 32px;
    }

    /* IMPORTANT: View Case Study Button */
    .echelon-case-study-btn {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      font-family: "IBM Plex Mono", monospace;
      font-size: 14px;
      font-weight: 700;
      color: #FFFFFF;
      background: #FF0000;
      border: 2px solid #FF0000;
      padding: 14px 28px;
      text-decoration: none;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      transition: all 0.3s ease;
    }

    .echelon-case-study-btn:hover {
      background: #CC0000;
      border-color: #CC0000;
    }

    /* Contact Section */
    .echelon-contact {
      padding: 120px 60px;
      text-align: center;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .echelon-hero { padding: 40px 20px; }
      .echelon-work { padding: 60px 20px; }
      .echelon-project { grid-template-columns: 1fr; gap: 30px; }
      .echelon-contact { padding: 60px 20px; }
    }
  </style>
</head>
<body>
  <!-- Hero -->
  <section class="echelon-hero">
    <h1 class="echelon-hero-name">{content.hero.name}</h1>
    <p class="echelon-hero-title">{content.hero.title}</p>
  </section>

  <!-- Work -->
  <section class="echelon-work">
    <div class="echelon-section-label">Selected Work</div>

    <!-- LOOP: For each project -->
    <article class="echelon-project">
      <img src="{project.image}" alt="{project.title}" class="echelon-project-image">
      <div>
        <div class="echelon-project-meta">{project.meta}</div>
        <h2 class="echelon-project-title">{project.title}</h2>
        <p class="echelon-project-desc">{project.description}</p>

        <!-- IMPORTANT: Link to case study HTML file -->
        <a href="/{subdomain}/case-study-{project.id}.html" class="echelon-case-study-btn">
          View Case Study →
        </a>
      </div>
    </article>
    <!-- END LOOP -->
  </section>

  <!-- Contact -->
  <section class="echelon-contact">
    <a href="mailto:{content.contact.email}">{content.contact.email}</a>
  </section>
</body>
</html>
```

---

## Template 2: SERENE

### Content Structure
```javascript
content: {
  gallery: {
    heroText: "Portfolio tagline...",
    firstRow: [
      { id: "serene-first-0", image: "...", title: "...", description: "...", span: 2 },
      { id: "serene-first-1", image: "...", title: "...", description: "...", span: 1 },
      { id: "serene-first-2", image: "...", title: "...", description: "...", span: 2 }
    ],
    secondRow: [
      { id: "serene-second-0", ... },
      // ... more items
    ],
    thirdRow: [
      { id: "serene-third-0", ... },
      // ... more items
    ]
  },
  about: {
    name: "Designer Name",
    bio: "Bio text..."
  }
}
```

### Serene Color Scheme (Default)
```css
--primary: #4a5568;
--secondary: #718096;
--background: #ffffff;
--surface: #f7fafc;
--text: #2d3748;
--textSecondary: #718096;
--border: #e2e8f0;
--accent: #f0fff4;
```

### Serene Fonts
```css
font-family: "Inter", sans-serif;
```

### Serene HTML Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{portfolio.title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: "Inter", sans-serif;
      background: #ffffff;
      color: #2d3748;
    }

    /* Hero Text */
    .serene-hero {
      padding: 80px 40px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .serene-hero-text {
      font-size: clamp(24px, 4vw, 48px);
      font-weight: 300;
      line-height: 1.4;
      color: #4a5568;
    }

    /* Masonry Gallery */
    .serene-gallery {
      padding: 0 40px 80px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .serene-gallery-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }

    .serene-gallery-item {
      position: relative;
      overflow: hidden;
      border-radius: 4px;
      cursor: pointer;
    }

    .serene-gallery-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .serene-gallery-item:hover img {
      transform: scale(1.05);
    }

    /* Hover Overlay with View Details */
    .serene-gallery-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .serene-gallery-item:hover .serene-gallery-overlay {
      opacity: 1;
    }

    .serene-view-details {
      font-size: 14px;
      padding: 12px 24px;
      background: #ffffff;
      color: #4a5568;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
      text-decoration: none;
      border-radius: 2px;
    }

    /* Span classes for masonry */
    .span-1 { grid-row: span 1; height: 280px; }
    .span-2 { grid-row: span 2; height: 580px; }
    .span-3 { grid-row: span 3; height: 880px; }

    @media (max-width: 768px) {
      .serene-gallery-grid { grid-template-columns: 1fr; }
      .span-1, .span-2, .span-3 { height: 300px; grid-row: span 1; }
    }
  </style>
</head>
<body>
  <!-- Hero -->
  <section class="serene-hero">
    <p class="serene-hero-text">{content.gallery.heroText}</p>
  </section>

  <!-- Gallery -->
  <section class="serene-gallery">
    <div class="serene-gallery-grid">
      <!-- LOOP: For each project in firstRow, secondRow, thirdRow -->
      <a href="/{subdomain}/case-study-{project.id}.html" class="serene-gallery-item span-{project.span}">
        <img src="{project.image}" alt="{project.title}">
        <div class="serene-gallery-overlay">
          <span class="serene-view-details">View Details</span>
        </div>
      </a>
      <!-- END LOOP -->
    </div>
  </section>
</body>
</html>
```

---

## Template 3: CHIC

### Content Structure
```javascript
content: {
  hero: {
    name: "DESIGNER NAME",
    tagline: "Creative tagline"
  },
  work: {
    projects: [
      {
        id: "project-1",
        title: "PROJECT TITLE",
        subtitle: "Creative Direction",
        description: "Project description...",
        detailedDescription: "Full case study content...",
        image: "https://...",
        category: "Brand Identity",
        year: "2024",
        awards: "Award name"
      }
    ]
  }
}
```

### Chic Color Scheme (Default)
```css
--primary: #000000;
--secondary: #999999;
--background: #FFFFFF;
--border: #E5E5E5;
```

### Chic Fonts
```css
font-family: "Helvetica Neue", sans-serif;
/* For mono elements */
font-family: "SF Mono", monospace;
```

### Chic HTML Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{portfolio.title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: "Helvetica Neue", sans-serif;
      background: #FFFFFF;
      color: #000000;
    }

    /* Hero */
    .chic-hero {
      padding: 120px 60px;
      text-align: center;
    }

    .chic-hero-name {
      font-size: clamp(36px, 8vw, 96px);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.2em;
    }

    .chic-hero-tagline {
      font-size: 14px;
      color: #999999;
      margin-top: 20px;
      letter-spacing: 0.1em;
    }

    /* Work Grid - Chic uses absolute positioning for creative layouts */
    .chic-work {
      position: relative;
      padding: 60px;
      min-height: 200vh;
    }

    .chic-project {
      position: relative;
      margin-bottom: 40px;
      cursor: pointer;
    }

    .chic-project-image {
      width: 100%;
      max-width: 400px;
      aspect-ratio: 3/4;
      object-fit: cover;
      background: #F5F5F5;
    }

    .chic-project-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .chic-project:hover .chic-project-overlay {
      opacity: 1;
    }

    .chic-view-details {
      font-family: "Helvetica Neue", sans-serif;
      font-size: 12px;
      padding: 12px 24px;
      background: #FFFFFF;
      color: #000000;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
      text-decoration: none;
    }

    .chic-project-info {
      margin-top: 16px;
    }

    .chic-project-title {
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .chic-project-category {
      font-family: "SF Mono", monospace;
      font-size: 10px;
      color: #999999;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-top: 4px;
    }

    @media (max-width: 768px) {
      .chic-hero { padding: 60px 20px; }
      .chic-work { padding: 40px 20px; }
    }
  </style>
</head>
<body>
  <!-- Hero -->
  <section class="chic-hero">
    <h1 class="chic-hero-name">{content.hero.name}</h1>
    <p class="chic-hero-tagline">{content.hero.tagline}</p>
  </section>

  <!-- Work -->
  <section class="chic-work">
    <!-- LOOP: For each project -->
    <a href="/{subdomain}/case-study-{project.id}.html" class="chic-project">
      <img src="{project.image}" alt="{project.title}" class="chic-project-image">
      <div class="chic-project-overlay">
        <span class="chic-view-details">View Details</span>
      </div>
      <div class="chic-project-info">
        <h3 class="chic-project-title">{project.title}</h3>
        <p class="chic-project-category">{project.category}</p>
      </div>
    </a>
    <!-- END LOOP -->
  </section>
</body>
</html>
```

---

## Template 4: BOLDFOLIO

### Content Structure
```javascript
content: {
  hero: {
    name: "Designer Name",
    tagline: "Creative tagline"
  },
  work: {
    projects: [
      {
        id: "project-1",
        title: "Project Title",
        description: "Project description with <br /> HTML support",
        detailedDescription: "Full case study...",
        images: [
          { src: "https://...", width: "580px", height: "380px" },
          { src: "https://...", width: "300px", height: "200px" }
        ],
        logo: "<span style='font-weight:900;'>LOGO</span>",  // HTML string
        link: "https://external-link.com"
      }
    ]
  }
}
```

### BoldFolio Color Scheme (Default)
```css
--primary: #ec4899;    /* Pink accent */
--secondary: #6b7280;
--background: #ffffff;
--text: #000000;
```

### BoldFolio Fonts
```css
font-family: "Graphik", sans-serif;
```

### BoldFolio HTML Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{portfolio.title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: "Graphik", -apple-system, BlinkMacSystemFont, sans-serif;
      background: #FFFFFF;
      color: #000000;
    }

    /* Hero */
    .boldfolio-hero {
      padding: 80px 60px;
    }

    .boldfolio-hero-name {
      font-size: clamp(32px, 6vw, 64px);
      font-weight: 700;
    }

    /* Work Section */
    .boldfolio-work {
      padding: 40px 60px;
    }

    .boldfolio-project {
      display: flex;
      flex-wrap: wrap;
      gap: 40px;
      margin-bottom: 120px;
      padding-bottom: 120px;
      border-bottom: 1px solid #E5E5E5;
    }

    .boldfolio-project-images {
      flex: 1;
      min-width: 300px;
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
    }

    .boldfolio-project-image {
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .boldfolio-project-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .boldfolio-project-image-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .boldfolio-project-image:hover .boldfolio-project-image-overlay {
      opacity: 1;
    }

    .boldfolio-view-details {
      font-size: 12px;
      padding: 10px 20px;
      background: #ec4899;
      color: #FFFFFF;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
      text-decoration: none;
    }

    .boldfolio-project-content {
      flex: 1;
      min-width: 300px;
    }

    .boldfolio-project-logo {
      font-size: 24px;
      margin-bottom: 24px;
    }

    .boldfolio-project-title {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 16px;
    }

    .boldfolio-project-desc {
      font-size: 16px;
      line-height: 1.8;
      color: #333333;
    }

    @media (max-width: 768px) {
      .boldfolio-hero { padding: 40px 20px; }
      .boldfolio-work { padding: 20px; }
      .boldfolio-project { flex-direction: column; }
    }
  </style>
</head>
<body>
  <!-- Hero -->
  <section class="boldfolio-hero">
    <h1 class="boldfolio-hero-name">{content.hero.name}</h1>
  </section>

  <!-- Work -->
  <section class="boldfolio-work">
    <!-- LOOP: For each project -->
    <article class="boldfolio-project">
      <div class="boldfolio-project-images">
        <!-- LOOP: For each image in project.images -->
        <a href="/{subdomain}/case-study-{project.id}.html"
           class="boldfolio-project-image"
           style="width: {image.width}; height: {image.height};">
          <img src="{image.src}" alt="{project.title}">
          <div class="boldfolio-project-image-overlay">
            <span class="boldfolio-view-details">View Details</span>
          </div>
        </a>
        <!-- END LOOP -->
      </div>

      <div class="boldfolio-project-content">
        <div class="boldfolio-project-logo">{project.logo}</div>
        <h2 class="boldfolio-project-title">{project.title}</h2>
        <p class="boldfolio-project-desc">{project.description}</p>
      </div>
    </article>
    <!-- END LOOP -->
  </section>
</body>
</html>
```

---

## Case Study HTML Template (All Templates)

When generating case study pages, use this structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{project.title} - {portfolio.title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: "Helvetica Neue", sans-serif;
      background: #FFFFFF;
      color: #000000;
      line-height: 1.6;
    }

    /* Header */
    .cs-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #000000;
      padding: 20px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 1000;
    }

    .cs-back-btn {
      font-size: 13px;
      color: #FFFFFF;
      background: transparent;
      border: 2px solid #FFFFFF;
      padding: 10px 20px;
      text-decoration: none;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .cs-back-btn:hover {
      background: #FFFFFF;
      color: #000000;
    }

    .cs-title {
      font-size: 12px;
      color: #FF0000;
      text-transform: uppercase;
      letter-spacing: 0.15em;
    }

    /* Main Content */
    .cs-main {
      padding: 120px 40px 80px;
      max-width: 1000px;
      margin: 0 auto;
    }

    .cs-meta {
      font-size: 12px;
      color: #FF0000;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      margin-bottom: 24px;
    }

    .cs-project-title {
      font-size: clamp(40px, 8vw, 72px);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: -0.02em;
      margin-bottom: 32px;
    }

    .cs-description {
      font-size: 20px;
      line-height: 1.6;
      color: #333333;
      margin-bottom: 48px;
    }

    .cs-image {
      width: 100%;
      margin-bottom: 48px;
    }

    .cs-image img {
      width: 100%;
      height: auto;
    }

    .cs-detailed {
      font-size: 18px;
      line-height: 1.8;
      color: #333333;
    }

    /* Footer */
    .cs-footer {
      padding: 40px;
      border-top: 1px solid #E5E5E5;
      text-align: center;
    }

    .cs-footer-btn {
      font-size: 13px;
      color: #000000;
      background: transparent;
      border: 2px solid #000000;
      padding: 14px 32px;
      text-decoration: none;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .cs-footer-btn:hover {
      background: #000000;
      color: #FFFFFF;
    }

    @media (max-width: 768px) {
      .cs-header { padding: 16px 20px; }
      .cs-main { padding: 100px 20px 60px; }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <header class="cs-header">
    <a href="/{subdomain}/html" class="cs-back-btn">← Back</a>
    <span class="cs-title">{portfolio.title}</span>
    <div style="width: 100px;"></div>
  </header>

  <!-- Main -->
  <main class="cs-main">
    <div class="cs-meta">{project.meta || project.category}</div>
    <h1 class="cs-project-title">{project.title}</h1>
    <p class="cs-description">{project.description}</p>

    <!-- Main Image -->
    <div class="cs-image">
      <img src="{project.image}" alt="{project.title}">
    </div>

    <!-- Multiple images for BoldFolio -->
    <!-- LOOP: For each image in project.images -->
    <div class="cs-image">
      <img src="{image.src}" alt="{project.title}">
    </div>
    <!-- END LOOP -->

    <!-- Detailed Description -->
    <div class="cs-detailed">
      {project.detailedDescription}
    </div>
  </main>

  <!-- Footer -->
  <footer class="cs-footer">
    <a href="/{subdomain}/html" class="cs-footer-btn">← Back to Portfolio</a>
  </footer>
</body>
</html>
```

---

## Important Links Pattern

**Main portfolio:** `/{subdomain}/html`
**Case study:** `/{subdomain}/case-study-{projectId}.html`

### Project ID Patterns by Template:
| Template | Project ID Examples |
|----------|---------------------|
| Echelon | `project-1`, `project-2`, `1748159436109` (timestamp) |
| Serene | `serene-first-0`, `serene-second-1`, `serene-third-0` |
| Chic | `project-1`, `project-2`, or `chic-0`, `chic-1` |
| BoldFolio | `project-1`, `project-2`, or `boldfolio-0`, `boldfolio-1` |

---

## Summary

When publishing a portfolio, backend should:

1. **Generate main HTML** at `/{subdomain}/html` with all styles inline
2. **Generate case study HTML** for each project at `/{subdomain}/case-study-{projectId}.html`
3. **Ensure all "View Details" links** in main HTML point to the correct case study URLs
4. **Include all CSS inline** in `<style>` tags (no external stylesheets)
5. **Use the correct fonts** (can use Google Fonts link or inline)

The HTML templates above can be used as a starting point - replace the `{placeholders}` with actual data from the portfolio.
