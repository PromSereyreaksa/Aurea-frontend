# Static HTML Generation Guide: View Details Feature

## Overview

This guide covers static HTML generation for the **View Details** functionality in **Serene**, **Chic**, and **BoldFolio** templates. When users click on a project in a published portfolio, they should be taken to a detailed project page.

> **Note:** Echelon template is excluded from this guide as it uses a different case study system.

---

## URL Structure

### Main Portfolio
```
/{subdomain}/html
```

### Project Detail Pages
```
/{subdomain}/project-{projectId}.html
```

### Examples
- Main: `/john-doe/html`
- Project: `/john-doe/project-serene-first-0.html`
- Project: `/john-doe/project-chic-1.html`
- Project: `/john-doe/project-boldfolio-2.html`

---

## Project ID Patterns by Template

| Template   | ID Pattern                                        | Examples                                           |
|------------|---------------------------------------------------|---------------------------------------------------|
| Serene     | `serene-{row}-{index}`                           | `serene-first-0`, `serene-second-1`, `serene-third-2` |
| Chic       | `chic-{index}` or custom ID                      | `chic-0`, `chic-1`, `project-1748159436109`        |
| BoldFolio  | `boldfolio-{index}` or custom ID                 | `boldfolio-0`, `boldfolio-1`, `project-xyz`        |

---

## Template 1: SERENE

### Data Structure
```javascript
content: {
  gallery: {
    heroText1: "Introduction paragraph 1...",
    heroText2: "Introduction paragraph 2...",
    firstRow: [
      {
        id: "serene-first-0",
        image: "https://cloudinary.com/...",
        title: "Project Title",
        description: "Short description",
        detailedDescription: "Full project description for detail page...",
        span: 2  // Grid span (1, 2, or 3)
      },
      // ... more items (typically 3 items)
    ],
    secondRow: [
      // ... 4 items
    ],
    thirdRow: [
      // ... 3 items
    ]
  }
}
```

### Serene Default Styling
```css
--primary: #4a5568;
--secondary: #718096;
--background: #ffffff;
--surface: #f7fafc;
--text: #2d3748;
--textSecondary: #718096;
--border: #e2e8f0;
--accent: #f0fff4;
--font-family: "Inter", sans-serif;
```

### Serene Main Portfolio HTML
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

    /* Hero Section */
    .serene-hero {
      padding: 80px 40px;
      max-width: 1800px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: minmax(300px, 400px) 1fr;
      gap: 80px;
    }

    .serene-hero-text {
      font-size: clamp(16px, 2vw, 20px);
      font-weight: 600;
      line-height: 1.7;
      color: #2d3748;
      margin-bottom: 32px;
    }

    /* Gallery Grid */
    .serene-gallery {
      padding: 0 40px 80px;
      max-width: 1800px;
      margin: 0 auto;
    }

    .serene-gallery-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 32px;
      margin-bottom: 80px;
    }

    .serene-gallery-grid-4 {
      grid-template-columns: repeat(4, 1fr);
    }

    /* Gallery Item */
    .serene-gallery-item {
      position: relative;
      overflow: hidden;
      border-radius: 4px;
      cursor: pointer;
      text-decoration: none;
      display: block;
    }

    /* Span classes for masonry effect */
    .span-1 { grid-row: span 1; height: 280px; }
    .span-2 { grid-row: span 2; height: 560px; }
    .span-3 { grid-row: span 3; height: 840px; }

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
    .serene-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .serene-gallery-item:hover .serene-overlay {
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
      border-radius: 2px;
    }

    /* Project Info */
    .serene-project-info {
      margin-top: 16px;
    }

    .serene-project-title {
      font-size: clamp(16px, 2vw, 20px);
      color: #4a5568;
      font-weight: 600;
      line-height: 1.3;
      margin-bottom: 8px;
    }

    .serene-project-desc {
      font-size: clamp(14px, 1.5vw, 16px);
      color: #6b7280;
      font-weight: 500;
      line-height: 1.5;
    }

    @media (max-width: 1024px) {
      .serene-hero { grid-template-columns: 1fr; gap: 40px; }
      .serene-gallery-grid { grid-template-columns: repeat(2, 1fr); }
      .serene-gallery-grid-4 { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 640px) {
      .serene-hero { padding: 40px 20px; }
      .serene-gallery { padding: 0 20px 40px; }
      .serene-gallery-grid, .serene-gallery-grid-4 { grid-template-columns: 1fr; }
      .span-1, .span-2, .span-3 { height: 300px; grid-row: span 1; }
    }
  </style>
</head>
<body>
  <!-- Hero Section with Text -->
  <section class="serene-hero">
    <div>
      <p class="serene-hero-text">{content.gallery.heroText1}</p>
      <p class="serene-hero-text">{content.gallery.heroText2}</p>
    </div>

    <!-- First Row Gallery (3 items) -->
    <div class="serene-gallery-grid">
      <!-- LOOP: For each project in content.gallery.firstRow -->
      <a href="/{subdomain}/project-{project.id}.html" class="serene-gallery-item span-{project.span || 2}">
        <img src="{project.image}" alt="{project.title}">
        <div class="serene-overlay">
          <span class="serene-view-details">View Details</span>
        </div>
      </a>
      <!-- END LOOP -->
    </div>
  </section>

  <!-- Second Row Gallery (4 items) -->
  <section class="serene-gallery">
    <div class="serene-gallery-grid serene-gallery-grid-4">
      <!-- LOOP: For each project in content.gallery.secondRow -->
      <a href="/{subdomain}/project-{project.id}.html" class="serene-gallery-item span-{project.span || 2}">
        <img src="{project.image}" alt="{project.title}">
        <div class="serene-overlay">
          <span class="serene-view-details">View Details</span>
        </div>
      </a>
      <!-- END LOOP -->
    </div>
  </section>

  <!-- Third Row Gallery (3 items) -->
  <section class="serene-gallery">
    <div class="serene-gallery-grid">
      <!-- LOOP: For each project in content.gallery.thirdRow -->
      <a href="/{subdomain}/project-{project.id}.html" class="serene-gallery-item span-{project.span || 2}">
        <img src="{project.image}" alt="{project.title}">
        <div class="serene-overlay">
          <span class="serene-view-details">View Details</span>
        </div>
      </a>
      <!-- END LOOP -->
    </div>
  </section>
</body>
</html>
```

### Serene Project Detail HTML
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{project.title} - {portfolio.title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: "Inter", sans-serif;
      background: #ffffff;
      color: #2d3748;
    }

    /* Fixed Header */
    .serene-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: rgba(255, 255, 255, 0.98);
      border-bottom: 1px solid #e2e8f0;
      z-index: 100;
      backdrop-filter: blur(10px);
    }

    .serene-header-inner {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .serene-back-btn {
      font-size: 14px;
      color: #4a5568;
      background: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 500;
      text-decoration: none;
      transition: opacity 0.3s ease;
    }

    .serene-back-btn:hover {
      opacity: 0.7;
    }

    .serene-header-label {
      font-size: 12px;
      color: #718096;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    /* Main Content */
    .serene-main {
      padding-top: 80px;
      max-width: 1200px;
      margin: 0 auto;
      padding: 80px 24px 80px;
    }

    /* Title Section */
    .serene-title-section {
      margin-bottom: 48px;
      text-align: center;
    }

    .serene-title {
      font-size: clamp(32px, 5vw, 56px);
      color: #4a5568;
      font-weight: 400;
      line-height: 1.2;
      margin-bottom: 16px;
    }

    .serene-subtitle {
      font-size: clamp(16px, 2vw, 20px);
      color: #718096;
      font-weight: 500;
      line-height: 1.6;
    }

    /* Project Image */
    .serene-image-container {
      width: 100%;
      margin-bottom: 64px;
      border-radius: 4px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    }

    .serene-image {
      width: 100%;
      height: auto;
      max-height: 70vh;
      object-fit: cover;
      display: block;
    }

    .serene-no-image {
      width: 100%;
      height: 60vh;
      background: #f0fff4;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #718096;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    /* Description */
    .serene-description {
      max-width: 800px;
      margin: 0 auto 80px;
      font-size: clamp(16px, 2vw, 18px);
      color: #2d3748;
      line-height: 1.8;
      font-weight: 500;
    }

    /* Footer */
    .serene-footer {
      background: #f7fafc;
      border-top: 1px solid #e2e8f0;
      padding: 40px 24px;
      text-align: center;
    }

    .serene-footer-btn {
      font-size: 14px;
      padding: 14px 32px;
      background: #4a5568;
      color: #ffffff;
      border: none;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 500;
      text-decoration: none;
      display: inline-block;
      transition: all 0.3s ease;
    }

    .serene-footer-btn:hover {
      background: #2d3748;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    @media (max-width: 768px) {
      .serene-header-inner { padding: 16px 20px; }
      .serene-main { padding: 80px 20px 60px; }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <header class="serene-header">
    <div class="serene-header-inner">
      <a href="/{subdomain}/html" class="serene-back-btn">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 10H5M5 10L10 5M5 10L10 15" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Back to Gallery
      </a>
      <span class="serene-header-label">Project Detail</span>
    </div>
  </header>

  <!-- Main Content -->
  <main class="serene-main">
    <!-- Title -->
    <div class="serene-title-section">
      <h1 class="serene-title">{project.title}</h1>
      <p class="serene-subtitle">{project.description}</p>
    </div>

    <!-- Image -->
    <div class="serene-image-container">
      <!-- IF project.image exists -->
      <img src="{project.image}" alt="{project.title}" class="serene-image">
      <!-- ELSE -->
      <div class="serene-no-image">No Image</div>
      <!-- END IF -->
    </div>

    <!-- Detailed Description -->
    <!-- IF project.detailedDescription exists -->
    <div class="serene-description">
      {project.detailedDescription}
      <!-- Note: Replace \n with <br> tags -->
    </div>
    <!-- END IF -->
  </main>

  <!-- Footer -->
  <footer class="serene-footer">
    <a href="/{subdomain}/html" class="serene-footer-btn">View All Projects</a>
  </footer>
</body>
</html>
```

---

## Template 2: CHIC

### Data Structure
```javascript
content: {
  hero: {
    name: "DESIGNER NAME",
    tagline: "Creative tagline text"
  },
  work: {
    projects: [
      {
        id: "chic-0",
        title: "PROJECT TITLE",
        subtitle: "Creative Direction",
        description: "Short project description",
        detailedDescription: "Full case study content...",
        image: "https://cloudinary.com/...",
        category: "Brand Identity",
        year: "2024",
        awards: "Awwwards SOTD",
        link: "https://external-link.com"  // Optional external link
      },
      // ... more projects
    ]
  }
}
```

### Chic Default Styling
```css
--primary: #000000;
--secondary: #999999;
--background: #ffffff;
--border: #e5e5e5;
--font-heading: "Helvetica Neue", sans-serif;
--font-mono: "SF Mono", monospace;
```

### Chic Main Portfolio HTML
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
      font-family: "Helvetica Neue", -apple-system, BlinkMacSystemFont, sans-serif;
      background: #ffffff;
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
      margin-bottom: 20px;
    }

    .chic-hero-tagline {
      font-size: 14px;
      color: #999999;
      letter-spacing: 0.1em;
    }

    /* Work Grid */
    .chic-work {
      padding: 60px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 40px;
    }

    /* Project Card */
    .chic-project {
      text-decoration: none;
      color: inherit;
      display: block;
    }

    .chic-project-title {
      font-family: "Inter", sans-serif;
      font-size: 15px;
      font-weight: 500;
      line-height: 16px;
      letter-spacing: -0.6px;
      text-transform: uppercase;
      color: #000000;
      margin-bottom: 12px;
    }

    .chic-project-image-container {
      position: relative;
      width: 100%;
      aspect-ratio: 4 / 3;
      overflow: hidden;
      background: #f3f4f6;
    }

    .chic-project-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .chic-project:hover .chic-project-image {
      transform: scale(1.01);
    }

    /* Hover Overlay */
    .chic-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .chic-project:hover .chic-overlay {
      opacity: 1;
    }

    .chic-view-details {
      font-family: "Helvetica Neue", sans-serif;
      font-size: 12px;
      padding: 14px 32px;
      background: #ffffff;
      color: #000000;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
    }

    /* Go Up Link */
    .chic-go-up {
      position: fixed;
      bottom: 40px;
      left: 40px;
      font-family: "Inter", sans-serif;
      font-size: 15px;
      font-weight: 500;
      text-transform: uppercase;
      color: #000000;
      text-decoration: underline;
      letter-spacing: -0.6px;
      z-index: 30;
    }

    .chic-go-up:hover {
      color: #E86223;
      text-decoration: none;
    }

    @media (max-width: 1024px) {
      .chic-work { padding: 40px; gap: 24px; }
    }

    @media (max-width: 768px) {
      .chic-hero { padding: 60px 20px; }
      .chic-work { grid-template-columns: 1fr; padding: 20px; }
    }
  </style>
</head>
<body>
  <!-- Hero -->
  <section class="chic-hero">
    <h1 class="chic-hero-name">{content.hero.name}</h1>
    <p class="chic-hero-tagline">{content.hero.tagline}</p>
  </section>

  <!-- Work Grid -->
  <section class="chic-work">
    <!-- LOOP: For each project in content.work.projects -->
    <a href="/{subdomain}/project-{project.id}.html" class="chic-project">
      <h2 class="chic-project-title">{project.title}</h2>
      <div class="chic-project-image-container">
        <img src="{project.image}" alt="{project.title}" class="chic-project-image">
        <div class="chic-overlay">
          <span class="chic-view-details">View Details</span>
        </div>
      </div>
    </a>
    <!-- END LOOP -->
  </section>

  <!-- Go Up Link -->
  <a href="#" class="chic-go-up" onclick="window.scrollTo({top:0,behavior:'smooth'});return false;">
    Go Up
  </a>
</body>
</html>
```

### Chic Project Detail HTML
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
      font-family: "Helvetica Neue", -apple-system, BlinkMacSystemFont, sans-serif;
      background: #ffffff;
      color: #000000;
    }

    /* Fixed Header */
    .chic-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: rgba(255, 255, 255, 0.98);
      border-bottom: 1px solid #e5e5e5;
      z-index: 100;
      backdrop-filter: blur(10px);
    }

    .chic-header-inner {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .chic-back-btn {
      font-size: 11px;
      color: #000000;
      background: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
      text-decoration: none;
      transition: opacity 0.3s ease;
    }

    .chic-back-btn:hover {
      opacity: 0.6;
    }

    .chic-header-label {
      font-family: "SF Mono", "Monaco", monospace;
      font-size: 10px;
      color: #666666;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    /* Main Content */
    .chic-main {
      padding-top: 80px;
      max-width: 1200px;
      margin: 0 auto;
      padding: 80px 32px 80px;
    }

    /* Meta Section */
    .chic-meta-section {
      margin-bottom: 48px;
      border-bottom: 1px solid #e5e5e5;
      padding-bottom: 32px;
    }

    .chic-title {
      font-size: clamp(32px, 5vw, 56px);
      color: #000000;
      font-weight: 600;
      line-height: 1.1;
      margin-bottom: 16px;
      letter-spacing: -0.02em;
    }

    .chic-subtitle {
      font-size: clamp(16px, 2vw, 20px);
      color: #666666;
      font-weight: 500;
      line-height: 1.4;
      margin-bottom: 24px;
    }

    /* Meta Grid */
    .chic-meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 24px;
      margin-top: 24px;
    }

    .chic-meta-item-label {
      font-family: "SF Mono", "Monaco", monospace;
      font-size: 10px;
      color: #999999;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 8px;
      font-weight: 600;
    }

    .chic-meta-item-value {
      font-size: 14px;
      color: #000000;
      font-weight: 500;
    }

    /* Project Image */
    .chic-image-container {
      width: 100%;
      margin-bottom: 64px;
      overflow: hidden;
    }

    .chic-image {
      width: 100%;
      height: auto;
      max-height: 70vh;
      object-fit: contain;
      display: block;
      background: #f5f5f5;
    }

    .chic-no-image {
      width: 100%;
      height: 60vh;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: "SF Mono", "Monaco", monospace;
      font-size: 11px;
      color: #cccccc;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    /* Description */
    .chic-description {
      max-width: 700px;
      margin: 0 auto 80px;
      font-size: clamp(15px, 2vw, 17px);
      color: #333333;
      line-height: 1.7;
      font-weight: 400;
    }

    /* Footer */
    .chic-footer {
      background: #fafafa;
      border-top: 1px solid #e5e5e5;
      padding: 40px 32px;
      text-align: center;
    }

    .chic-footer-btn {
      font-size: 11px;
      padding: 14px 32px;
      background: #000000;
      color: #ffffff;
      border: none;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
      text-decoration: none;
      display: inline-block;
      transition: all 0.3s ease;
    }

    .chic-footer-btn:hover {
      background: #333333;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    @media (max-width: 768px) {
      .chic-header-inner { padding: 16px 20px; }
      .chic-main { padding: 80px 20px 60px; }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <header class="chic-header">
    <div class="chic-header-inner">
      <a href="/{subdomain}/html" class="chic-back-btn">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M15 10H5M5 10L10 5M5 10L10 15" stroke-linecap="square" stroke-linejoin="miter"/>
        </svg>
        BACK
      </a>
      <span class="chic-header-label">Project Detail</span>
    </div>
  </header>

  <!-- Main Content -->
  <main class="chic-main">
    <!-- Meta Section -->
    <div class="chic-meta-section">
      <h1 class="chic-title">{project.title}</h1>

      <!-- IF project.subtitle exists -->
      <p class="chic-subtitle">{project.subtitle}</p>
      <!-- END IF -->

      <!-- Meta Grid -->
      <div class="chic-meta-grid">
        <!-- IF project.category exists -->
        <div>
          <div class="chic-meta-item-label">Category</div>
          <div class="chic-meta-item-value">{project.category}</div>
        </div>
        <!-- END IF -->

        <!-- IF project.year exists -->
        <div>
          <div class="chic-meta-item-label">Year</div>
          <div class="chic-meta-item-value">{project.year}</div>
        </div>
        <!-- END IF -->

        <!-- IF project.awards exists -->
        <div>
          <div class="chic-meta-item-label">Awards</div>
          <div class="chic-meta-item-value">{project.awards}</div>
        </div>
        <!-- END IF -->
      </div>
    </div>

    <!-- Image -->
    <div class="chic-image-container">
      <!-- IF project.image exists -->
      <img src="{project.image}" alt="{project.title}" class="chic-image">
      <!-- ELSE -->
      <div class="chic-no-image">No Image</div>
      <!-- END IF -->
    </div>

    <!-- Detailed Description -->
    <!-- IF project.detailedDescription exists -->
    <div class="chic-description">
      {project.detailedDescription}
      <!-- Note: Replace \n with <br> tags -->
    </div>
    <!-- END IF -->
  </main>

  <!-- Footer -->
  <footer class="chic-footer">
    <a href="/{subdomain}/html" class="chic-footer-btn">View All Projects</a>
  </footer>
</body>
</html>
```

---

## Template 3: BOLDFOLIO

### Data Structure
```javascript
content: {
  hero: {
    name: "Designer Name",
    tagline: "Creative professional tagline"
  },
  work: {
    projects: [
      {
        id: "boldfolio-0",
        title: "Project Title",
        description: "Project description with <br /> HTML support",
        detailedDescription: "Full detailed description...",
        images: [
          { src: "https://cloudinary.com/...", width: "580px", height: "380px" },
          { src: "https://cloudinary.com/...", width: "300px", height: "200px" }
        ],
        logo: "<span style='font-weight:900;'>LOGO</span>",  // HTML string
        link: "https://external-link.com"  // Optional
      },
      // ... more projects
    ]
  }
}
```

### BoldFolio Default Styling
```css
--primary: #ff0080;      /* Magenta accent */
--secondary: #a855f7;    /* Purple for logos */
--background: #ffffff;
--text: #000000;
--text-secondary: #666666;
--font-family: "Graphik", -apple-system, system-ui, sans-serif;
```

### BoldFolio Main Portfolio HTML
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
      font-family: "Graphik", -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #ffffff;
      color: #000000;
      font-weight: 500;
    }

    /* Hero */
    .boldfolio-hero {
      padding: clamp(40px, 6vw, 80px) clamp(20px, 4vw, 60px);
    }

    .boldfolio-hero-name {
      font-size: clamp(32px, 6vw, 64px);
      font-weight: 700;
      margin-bottom: 16px;
    }

    .boldfolio-hero-tagline {
      font-size: clamp(18px, 3vw, 28px);
      color: #666666;
      font-weight: 400;
    }

    /* Work Section */
    .boldfolio-work {
      padding: clamp(20px, 4vw, 60px) clamp(16px, 3vw, 40px);
    }

    /* Project Section */
    .boldfolio-project {
      max-width: 1400px;
      margin: 0 auto 120px auto;
    }

    .boldfolio-project-title {
      color: #ff0080;
      font-size: clamp(28px, 6vw, 52px);
      font-weight: 500;
      line-height: 1.2;
      margin-bottom: 20px;
      letter-spacing: -0.02em;
    }

    .boldfolio-project-description {
      color: #000000;
      font-size: clamp(28px, 6vw, 52px);
      font-weight: 500;
      line-height: 1.2;
      margin-bottom: 30px;
      letter-spacing: -0.02em;
    }

    .boldfolio-explore-link {
      color: #000000;
      font-size: clamp(28px, 6vw, 52px);
      font-weight: 400;
      line-height: 1.3;
      margin-bottom: 40px;
      text-decoration: underline;
      display: inline-block;
      cursor: pointer;
      letter-spacing: -0.02em;
    }

    .boldfolio-explore-link:hover {
      color: #ff0080;
    }

    /* Images Container */
    .boldfolio-images {
      display: flex;
      gap: clamp(16px, 3vw, 30px);
      flex-wrap: wrap;
      align-items: flex-start;
      margin-bottom: 40px;
    }

    .boldfolio-image-box {
      border-radius: clamp(12px, 2vw, 20px);
      overflow: hidden;
      background: #e0e0e0;
      cursor: pointer;
      position: relative;
      transition: transform 0.3s ease;
    }

    .boldfolio-image-box:hover {
      transform: scale(1.02);
    }

    .boldfolio-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    /* Hover Overlay */
    .boldfolio-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .boldfolio-image-box:hover .boldfolio-overlay {
      opacity: 1;
    }

    .boldfolio-view-details {
      font-size: 12px;
      padding: 12px 24px;
      background: #ff0080;
      color: #ffffff;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
      border-radius: 4px;
    }

    /* Logo */
    .boldfolio-logo {
      font-size: clamp(48px, 10vw, 120px);
      font-weight: 300;
      letter-spacing: clamp(2px, 0.8vw, 8px);
      color: #a855f7;
      display: flex;
      flex-direction: column;
      line-height: 0.8;
      margin: clamp(20px, 4vw, 40px) 0;
    }

    /* Scroll to Top */
    .boldfolio-scroll-top {
      max-width: 1400px;
      margin: 0 auto;
      padding: clamp(48px, 8vw, 80px) 0 0 0;
    }

    .boldfolio-scroll-top-btn {
      color: #000000;
      font-size: clamp(28px, 6vw, 52px);
      font-weight: 400;
      line-height: 1.3;
      text-decoration: underline;
      cursor: pointer;
      letter-spacing: -0.02em;
      background: none;
      border: none;
      padding: 0;
    }

    .boldfolio-scroll-top-btn:hover {
      color: #ff0080;
    }

    @media (max-width: 768px) {
      .boldfolio-project { margin-bottom: 60px; }
      .boldfolio-images { gap: 16px; }
    }
  </style>
</head>
<body>
  <!-- Hero -->
  <section class="boldfolio-hero">
    <h1 class="boldfolio-hero-name">{content.hero.name}</h1>
    <p class="boldfolio-hero-tagline">{content.hero.tagline}</p>
  </section>

  <!-- Work Section -->
  <section class="boldfolio-work">
    <!-- LOOP: For each project in content.work.projects -->
    <article class="boldfolio-project">
      <h2 class="boldfolio-project-title">{project.title}</h2>
      <div class="boldfolio-project-description">{project.description}</div>

      <!-- IF project.link exists -->
      <a href="{project.link}" class="boldfolio-explore-link" target="_blank">Explore</a>
      <!-- END IF -->

      <!-- Images -->
      <div class="boldfolio-images">
        <!-- LOOP: For each image in project.images -->
        <a
          href="/{subdomain}/project-{project.id}.html"
          class="boldfolio-image-box"
          style="width: {image.width}; height: {image.height};"
        >
          <img src="{image.src}" alt="{project.title}" class="boldfolio-image">
          <div class="boldfolio-overlay">
            <span class="boldfolio-view-details">View Details</span>
          </div>
        </a>
        <!-- END LOOP -->
      </div>

      <!-- Logo (if exists) -->
      <!-- IF project.logo exists -->
      <div class="boldfolio-logo">{project.logo}</div>
      <!-- END IF -->
    </article>
    <!-- END LOOP -->

    <!-- Scroll to Top -->
    <div class="boldfolio-scroll-top">
      <button class="boldfolio-scroll-top-btn" onclick="window.scrollTo({top:0,behavior:'smooth'})">
        Scroll to top
      </button>
    </div>
  </section>
</body>
</html>
```

### BoldFolio Project Detail HTML
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
      font-family: "Graphik", -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #ffffff;
      color: #000000;
      font-weight: 500;
    }

    /* Fixed Header */
    .boldfolio-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: rgba(255, 255, 255, 0.98);
      border-bottom: 1px solid #e5e5e5;
      z-index: 100;
      backdrop-filter: blur(10px);
    }

    .boldfolio-header-inner {
      max-width: 1400px;
      margin: 0 auto;
      padding: 24px 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .boldfolio-back-btn {
      font-size: 14px;
      color: #ff0080;
      background: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .boldfolio-back-btn:hover {
      opacity: 0.7;
      transform: translateX(-4px);
    }

    .boldfolio-header-label {
      font-size: 12px;
      color: #666666;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    /* Main Content */
    .boldfolio-main {
      padding-top: 100px;
      max-width: 1200px;
      margin: 0 auto;
      padding: 100px 40px 100px;
    }

    /* Title Section */
    .boldfolio-title-section {
      margin-bottom: 60px;
      text-align: center;
    }

    .boldfolio-title {
      font-size: clamp(36px, 6vw, 72px);
      color: #000000;
      font-weight: 700;
      line-height: 1.1;
      margin-bottom: 20px;
      letter-spacing: -0.01em;
    }

    .boldfolio-description {
      font-size: clamp(18px, 2.5vw, 24px);
      color: #666666;
      font-weight: 400;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto 30px;
    }

    /* Logo */
    .boldfolio-detail-logo {
      margin-top: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ff0080;
    }

    /* Images Gallery */
    .boldfolio-images-gallery {
      display: flex;
      flex-wrap: wrap;
      gap: 30px;
      justify-content: center;
      margin-bottom: 80px;
    }

    .boldfolio-gallery-image {
      overflow: hidden;
      border-radius: 4px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .boldfolio-gallery-image img {
      max-width: 100%;
      height: auto;
      object-fit: cover;
      display: block;
    }

    /* Detailed Description */
    .boldfolio-detailed {
      max-width: 800px;
      margin: 0 auto 100px;
      font-size: clamp(16px, 2vw, 18px);
      color: #000000;
      line-height: 1.8;
      font-weight: 400;
    }

    /* Footer */
    .boldfolio-footer {
      background: #fafafa;
      border-top: 1px solid #e5e5e5;
      padding: 60px 40px;
      text-align: center;
    }

    .boldfolio-footer-btn {
      font-size: 14px;
      padding: 18px 40px;
      background: #ff0080;
      color: #ffffff;
      border: none;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 700;
      border-radius: 4px;
      text-decoration: none;
      display: inline-block;
      transition: all 0.3s ease;
    }

    .boldfolio-footer-btn:hover {
      background: #e60073;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 0, 128, 0.3);
    }

    @media (max-width: 768px) {
      .boldfolio-header-inner { padding: 20px; }
      .boldfolio-main { padding: 100px 20px 80px; }
      .boldfolio-images-gallery { gap: 16px; }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <header class="boldfolio-header">
    <div class="boldfolio-header-inner">
      <a href="/{subdomain}/html" class="boldfolio-back-btn">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M15 10H5M5 10L10 5M5 10L10 15" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        BACK TO WORK
      </a>
      <span class="boldfolio-header-label">Project Detail</span>
    </div>
  </header>

  <!-- Main Content -->
  <main class="boldfolio-main">
    <!-- Title Section -->
    <div class="boldfolio-title-section">
      <h1 class="boldfolio-title">{project.title}</h1>

      <!-- Description (supports HTML) -->
      <!-- IF project.description exists -->
      <div class="boldfolio-description">{project.description}</div>
      <!-- END IF -->

      <!-- Logo (supports HTML) -->
      <!-- IF project.logo exists -->
      <div class="boldfolio-detail-logo">{project.logo}</div>
      <!-- END IF -->
    </div>

    <!-- Images Gallery -->
    <!-- IF project.images exists and has items -->
    <div class="boldfolio-images-gallery">
      <!-- LOOP: For each image in project.images where image.src exists -->
      <div class="boldfolio-gallery-image">
        <img
          src="{image.src}"
          alt="{project.title} - Image {index + 1}"
          style="width: {image.width || 'auto'}; height: {image.height || 'auto'};"
        >
      </div>
      <!-- END LOOP -->
    </div>
    <!-- END IF -->

    <!-- Detailed Description -->
    <!-- IF project.detailedDescription exists -->
    <div class="boldfolio-detailed">
      {project.detailedDescription}
      <!-- Note: Replace \n with <br> tags -->
    </div>
    <!-- END IF -->
  </main>

  <!-- Footer -->
  <footer class="boldfolio-footer">
    <a href="/{subdomain}/html" class="boldfolio-footer-btn">View All Projects</a>
  </footer>
</body>
</html>
```

---

## Backend Implementation Checklist

### API Endpoints Required

```
GET /api/sites/{subdomain}/raw-html
Response: { success: true, html: "<!DOCTYPE html>..." }

GET /api/sites/{subdomain}/project/{projectId}/raw-html
Response: { success: true, html: "<!DOCTYPE html>..." }
```

### Generation Steps

1. **Fetch portfolio data** including template type and content
2. **Determine template** (`serene`, `chic`, or `boldfolio`)
3. **Generate main portfolio HTML** using the appropriate template
4. **Generate project detail HTML** for each project:
   - For **Serene**: Loop through `firstRow`, `secondRow`, `thirdRow`
   - For **Chic/BoldFolio**: Loop through `work.projects`
5. **Store/serve HTML files** at the correct URLs

### Important Notes

1. **All CSS must be inline** in `<style>` tags (no external stylesheets except Google Fonts)
2. **Replace placeholders** with actual data from portfolio
3. **Handle missing data** gracefully (show fallback content or hide sections)
4. **Escape HTML** in user-provided text fields (except fields that support HTML like `logo`, `description` in BoldFolio)
5. **Convert newlines** (`\n`) to `<br>` tags in `detailedDescription` fields
6. **Use correct project IDs** in URLs to ensure navigation works

### Link Pattern Summary

| Location | Link Format |
|----------|-------------|
| Main Portfolio | `/{subdomain}/html` |
| Project Detail | `/{subdomain}/project-{projectId}.html` |
| Back to Portfolio | `/{subdomain}/html` |

---

## Testing Checklist

- [ ] Main portfolio page loads with all projects visible
- [ ] Hover overlay with "View Details" appears on each project
- [ ] Clicking a project navigates to the correct detail page
- [ ] Back button on detail page returns to main portfolio
- [ ] All images load correctly
- [ ] Responsive layout works on mobile/tablet/desktop
- [ ] Custom styling (colors, fonts) is applied correctly
- [ ] Missing data is handled gracefully (no broken layouts)
