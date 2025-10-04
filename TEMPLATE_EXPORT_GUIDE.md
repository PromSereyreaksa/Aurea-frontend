# Portfolio Template HTML Export Guide

## Table of Contents
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Export Architecture](#export-architecture)
4. [Implementation Guide](#implementation-guide)
5. [Template Structure](#template-structure)
6. [Styling System](#styling-system)
7. [Content Injection](#content-injection)
8. [Example Implementation](#example-implementation)
9. [Testing & Validation](#testing--validation)

---

## Overview

This document explains how to convert our React-based portfolio templates into static HTML/CSS/JS files that can be:
- Exported as standalone websites
- Downloaded as ZIP files
- Deployed to static hosting (Netlify, Vercel, GitHub Pages)
- Compiled for server-side rendering

### Why Export to HTML?

1. **Portability**: Users can host anywhere, no React runtime needed
2. **Performance**: Static HTML loads faster
3. **SEO**: Better for search engines
4. **Ownership**: Users get complete control of their files
5. **Offline**: Works without internet connection

---

## Technology Stack

### Frontend Libraries Used

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "framer-motion": "^10.16.0",
  "react-hot-toast": "^2.4.1"
}
```

### Recommended Export Libraries

#### Option 1: React to HTML (Server-Side Rendering)
```bash
npm install react-dom/server
```

#### Option 2: Static Site Generation
```bash
npm install react-snap
# or
npm install react-static
```

#### Option 3: Puppeteer (Screenshot/HTML capture)
```bash
npm install puppeteer
```

#### Option 4: Custom Build System (Recommended)
```bash
npm install:
- @babel/core
- @babel/preset-react
- inline-css
- html-minifier
- jsdom
```

---

## Export Architecture

### High-Level Flow

```
┌─────────────────┐
│ Portfolio Data  │
│ (from database) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Template        │
│ Component       │
│ (React)         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Server-Side     │
│ Rendering       │
│ (ReactDOMServer)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ HTML String     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ CSS Extraction  │
│ & Inline        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ JavaScript      │
│ Bundling        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Asset           │
│ Processing      │
│ (Images, Fonts) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Final HTML      │
│ + CSS + JS      │
│ + Assets        │
└─────────────────┘
```

---

## Implementation Guide

### Backend Endpoint: Export Portfolio

**POST** `/api/portfolios/:id/export`

**Request:**
```json
{
  "format": "html",  // "html" | "zip" | "json"
  "options": {
    "minify": true,
    "inlineCSS": false,
    "includeAssets": true,
    "includeAnimations": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "exportUrl": "https://exports.aurea.com/portfolios/abc123/export.zip",
    "expiresAt": "2025-10-05T12:00:00.000Z",
    "files": [
      "index.html",
      "styles.css",
      "script.js",
      "assets/images/..."
    ]
  }
}
```

### Step-by-Step Implementation

#### Step 1: Fetch Portfolio Data

```javascript
// backend/services/exportService.js
const { Portfolio, CaseStudy } = require('../models');
const { getTemplate } = require('./templateService');

async function getPortfolioForExport(portfolioId) {
  const portfolio = await Portfolio.findById(portfolioId)
    .populate('userId', 'name email profileImage')
    .populate('caseStudies')
    .lean();
  
  if (!portfolio) {
    throw new Error('Portfolio not found');
  }
  
  const template = getTemplate(portfolio.templateId);
  
  return {
    portfolio,
    template,
    caseStudies: portfolio.caseStudies || []
  };
}
```

#### Step 2: Render React to HTML String

```javascript
// backend/services/renderService.js
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { ServerStyleSheet } = require('styled-components'); // if using styled-components

async function renderTemplateToHTML(template, portfolio) {
  // Import the template component
  const TemplateComponent = require(`../../templates/${template.id}/TemplateComponent`);
  
  // Create style sheet for CSS extraction
  const sheet = new ServerStyleSheet();
  
  try {
    // Render component to HTML string
    const html = ReactDOMServer.renderToString(
      sheet.collectStyles(
        React.createElement(TemplateComponent, {
          content: portfolio.content,
          styling: portfolio.styling,
          isEditing: false,
          isPreview: false,
          portfolioId: portfolio._id,
          caseStudies: portfolio.caseStudies || []
        })
      )
    );
    
    // Extract CSS
    const styleTags = sheet.getStyleTags();
    
    return {
      html,
      css: styleTags
    };
  } finally {
    sheet.seal();
  }
}
```

#### Step 3: Build Complete HTML Document

```javascript
// backend/services/htmlBuilder.js
function buildHTMLDocument(options) {
  const {
    html,
    css,
    portfolio,
    includeAnimations = false,
    inlineCSS = false
  } = options;
  
  const document = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHtml(portfolio.description)}">
  <title>${escapeHtml(portfolio.title)}</title>
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  ${generateFontLinks(portfolio.styling.fonts)}
  
  ${inlineCSS ? `<style>${css}</style>` : '<link rel="stylesheet" href="styles.css">'}
  
  <!-- Custom Styling -->
  <style>
    :root {
      ${generateCSSVariables(portfolio.styling)}
    }
    
    ${generateCustomCSS(portfolio.styling)}
  </style>
  
  ${includeAnimations ? '<script src="https://cdn.jsdelivr.net/npm/framer-motion@10/dist/framer-motion.js"></script>' : ''}
</head>
<body>
  <div id="root">
    ${html}
  </div>
  
  ${includeAnimations ? '<script src="script.js"></script>' : ''}
</body>
</html>`;
  
  return document;
}

function generateCSSVariables(styling) {
  const { colors } = styling;
  return Object.entries(colors)
    .map(([key, value]) => `--color-${key}: ${value};`)
    .join('\n      ');
}

function generateCustomCSS(styling) {
  const { colors, fonts, typography, spacing } = styling;
  
  return `
    body {
      margin: 0;
      padding: 0;
      font-family: ${fonts.body};
      color: ${colors.text};
      background-color: ${colors.background};
      font-size: ${typography.scale.body};
      line-height: ${typography.lineHeight.normal};
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-family: ${fonts.heading};
      font-weight: ${typography.fontWeight.bold};
    }
    
    h1 { font-size: ${typography.scale.h1}; line-height: ${typography.lineHeight.tight}; }
    h2 { font-size: ${typography.scale.h2}; line-height: ${typography.lineHeight.tight}; }
    h3 { font-size: ${typography.scale.h3}; line-height: ${typography.lineHeight.tight}; }
    h4 { font-size: ${typography.scale.h4}; line-height: ${typography.lineHeight.normal}; }
    
    * {
      box-sizing: border-box;
    }
  `;
}

function generateFontLinks(fonts) {
  // Extract font families and generate Google Fonts links
  const fontFamilies = new Set();
  
  Object.values(fonts).forEach(fontStr => {
    const match = fontStr.match(/^["']?([^"',]+)/);
    if (match) {
      fontFamilies.add(match[1].trim());
    }
  });
  
  if (fontFamilies.has('Neue Haas Grotesk') || fontFamilies.has('Helvetica Neue')) {
    return `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">`;
  }
  
  return '';
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text?.replace(/[&<>"']/g, m => map[m]) || '';
}
```

#### Step 4: Extract and Process CSS

```javascript
// backend/services/cssProcessor.js
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

async function processCSSEchelon(css, options = {}) {
  const { minify = false } = options;
  
  const plugins = [
    autoprefixer(),
  ];
  
  if (minify) {
    plugins.push(cssnano());
  }
  
  const result = await postcss(plugins).process(css, {
    from: undefined
  });
  
  return result.css;
}

// Generate Echelon-specific CSS
function generateEchelonCSS(styling) {
  const { colors, grid, spacing, borderRadius } = styling;
  
  return `
/* Echelon Template Styles */
.echelon-container {
  max-width: ${grid.columns * 100}px;
  margin: 0 auto;
  padding: 0 ${grid.margin};
}

.echelon-section {
  padding: ${spacing.section} 0;
}

.echelon-grid {
  display: grid;
  grid-template-columns: repeat(${grid.columns}, 1fr);
  gap: ${grid.gutter};
}

.echelon-hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: ${colors.background};
  color: ${colors.text};
  border-bottom: 2px solid ${colors.border};
}

.echelon-hero h1 {
  font-size: clamp(2rem, 5vw, 4rem);
  letter-spacing: -0.02em;
  margin: 0;
}

.echelon-about {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing.element};
  align-items: center;
}

.echelon-about-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: ${borderRadius.none};
}

.echelon-work-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${spacing.element};
}

.echelon-project {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.echelon-project:hover {
  transform: translateY(-4px);
}

.echelon-project-image {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  display: block;
}

.echelon-project-info {
  padding: ${spacing.tight};
  border: 1px solid ${colors.border};
  border-top: none;
}

.echelon-gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${spacing.tight};
}

.echelon-gallery-item {
  position: relative;
  overflow: hidden;
}

.echelon-gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.echelon-gallery-item:hover .echelon-gallery-image {
  transform: scale(1.05);
}

.echelon-contact {
  text-align: center;
  padding: ${spacing.section} 0;
  border-top: 2px solid ${colors.border};
}

.echelon-button {
  display: inline-block;
  padding: 1rem 2rem;
  background: ${colors.primary};
  color: ${colors.background};
  text-decoration: none;
  border: 2px solid ${colors.primary};
  font-weight: ${styling.typography.fontWeight.bold};
  transition: all 0.3s ease;
  border-radius: ${borderRadius.none};
}

.echelon-button:hover {
  background: transparent;
  color: ${colors.primary};
}

/* Responsive */
@media (max-width: 768px) {
  .echelon-container {
    padding: 0 ${spacing.element};
  }
  
  .echelon-about {
    grid-template-columns: 1fr;
  }
  
  .echelon-work-grid {
    grid-template-columns: 1fr;
  }
}
`;
}
```

#### Step 5: Handle Static Assets (Images)

```javascript
// backend/services/assetProcessor.js
const axios = require('axios');
const sharp = require('sharp'); // For image optimization
const path = require('path');
const fs = require('fs').promises;

async function downloadAndProcessAssets(portfolio, exportDir) {
  const assets = [];
  
  // Extract all image URLs from content
  const imageUrls = extractImageUrls(portfolio.content);
  
  // Process each image
  for (const url of imageUrls) {
    if (!url || url.startsWith('data:')) continue; // Skip empty or data URLs
    
    try {
      const asset = await downloadAndOptimizeImage(url, exportDir);
      assets.push(asset);
    } catch (error) {
      console.error(`Failed to process asset: ${url}`, error);
    }
  }
  
  return assets;
}

function extractImageUrls(content) {
  const urls = [];
  
  // Hero
  if (content.hero?.image) urls.push(content.hero.image);
  
  // About
  if (content.about?.image) urls.push(content.about.image);
  
  // Work projects
  if (content.work?.projects) {
    content.work.projects.forEach(project => {
      if (project.image) urls.push(project.image);
    });
  }
  
  // Gallery
  if (content.gallery?.images) {
    content.gallery.images.forEach(img => {
      if (img.src) urls.push(img.src);
    });
  }
  
  return urls;
}

async function downloadAndOptimizeImage(url, exportDir) {
  // Download image
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const buffer = Buffer.from(response.data);
  
  // Generate filename
  const ext = path.extname(url).split('?')[0] || '.jpg';
  const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${ext}`;
  const localPath = path.join(exportDir, 'assets', 'images', filename);
  
  // Ensure directory exists
  await fs.mkdir(path.dirname(localPath), { recursive: true });
  
  // Optimize image
  await sharp(buffer)
    .resize(2000, 2000, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .jpeg({ quality: 85 })
    .toFile(localPath);
  
  return {
    originalUrl: url,
    localPath: `assets/images/${filename}`,
    size: (await fs.stat(localPath)).size
  };
}

function replaceImageUrlsInHTML(html, assetMap) {
  let updatedHtml = html;
  
  assetMap.forEach(asset => {
    updatedHtml = updatedHtml.replace(
      new RegExp(escapeRegex(asset.originalUrl), 'g'),
      asset.localPath
    );
  });
  
  return updatedHtml;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
```

#### Step 6: Generate Minimal JavaScript (Optional)

```javascript
// backend/services/jsGenerator.js
function generateMinimalJS(options = {}) {
  const { includeSmooth Scroll = true, includeImageLightbox = false } = options;
  
  let script = `
// Minimal JavaScript for exported portfolio
(function() {
  'use strict';
  
  // Wait for DOM to load
  document.addEventListener('DOMContentLoaded', function() {
`;

  if (includeSmoothScroll) {
    script += `
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
`;
  }

  if (includeImageLightbox) {
    script += `
    // Simple image lightbox
    const images = document.querySelectorAll('.echelon-gallery-image');
    images.forEach(img => {
      img.addEventListener('click', function() {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = \`
          <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img src="\${this.src}" alt="\${this.alt}">
          </div>
        \`;
        document.body.appendChild(lightbox);
        
        lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
          lightbox.remove();
        });
        
        lightbox.addEventListener('click', (e) => {
          if (e.target === lightbox) lightbox.remove();
        });
      });
    });
`;
  }

  script += `
    // Add loaded class for animations
    document.body.classList.add('loaded');
  });
})();
`;

  return script;
}
```

#### Step 7: Create ZIP Export

```javascript
// backend/services/zipService.js
const archiver = require('archiver');
const stream = require('stream');

async function createZipExport(files, outputPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });
    
    output.on('close', () => {
      resolve({
        path: outputPath,
        size: archive.pointer()
      });
    });
    
    archive.on('error', reject);
    archive.pipe(output);
    
    // Add files to archive
    files.forEach(file => {
      if (file.content) {
        archive.append(file.content, { name: file.name });
      } else if (file.path) {
        archive.file(file.path, { name: file.name });
      }
    });
    
    // Add README
    archive.append(generateReadme(), { name: 'README.md' });
    
    archive.finalize();
  });
}

function generateReadme() {
  return `# Exported Portfolio

This portfolio was exported from AUREA Portfolio Builder.

## Files

- \`index.html\` - Main HTML file
- \`styles.css\` - Stylesheet
- \`script.js\` - JavaScript functionality
- \`assets/\` - Images and other assets

## How to Use

1. Open \`index.html\` in a web browser
2. Or upload all files to a web hosting service
3. Customize further by editing HTML/CSS if needed

## Hosting Options

- **Netlify**: Drag and drop this folder to netlify.com/drop
- **Vercel**: Run \`vercel\` in this directory
- **GitHub Pages**: Push to a GitHub repo and enable Pages
- **Any web host**: Upload via FTP

## Support

For questions or issues, visit: https://aurea.com/support

---
Made with AUREA Portfolio Builder
https://aurea.com
`;
}
```

#### Step 8: Main Export Function

```javascript
// backend/services/exportService.js
const path = require('path');
const os = require('os');
const fs = require('fs').promises;

async function exportPortfolio(portfolioId, options = {}) {
  const {
    format = 'zip',
    minify = true,
    inlineCSS = false,
    includeAssets = true,
    includeAnimations = false
  } = options;
  
  // 1. Fetch portfolio data
  const { portfolio, template } = await getPortfolioForExport(portfolioId);
  
  // 2. Create temporary export directory
  const exportId = `${portfolioId}-${Date.now()}`;
  const exportDir = path.join(os.tmpdir(), 'aurea-exports', exportId);
  await fs.mkdir(exportDir, { recursive: true });
  
  try {
    // 3. Render React to HTML
    const { html, css } = await renderTemplateToHTML(template, portfolio);
    
    // 4. Download and process assets
    let processedHtml = html;
    let assetMap = [];
    
    if (includeAssets) {
      assetMap = await downloadAndProcessAssets(portfolio, exportDir);
      processedHtml = replaceImageUrlsInHTML(html, assetMap);
    }
    
    // 5. Build complete HTML document
    const completeHTML = buildHTMLDocument({
      html: processedHtml,
      css,
      portfolio,
      includeAnimations,
      inlineCSS
    });
    
    // 6. Process CSS
    const processedCSS = await processCSS(
      css + '\n\n' + generateEchelonCSS(portfolio.styling),
      { minify }
    );
    
    // 7. Generate JavaScript
    const javascript = generateMinimalJS({
      includeSmoothScroll: true,
      includeImageLightbox: true
    });
    
    // 8. Write files
    const files = [
      {
        name: 'index.html',
        content: minify ? minifyHTML(completeHTML) : completeHTML
      },
      {
        name: 'styles.css',
        content: processedCSS
      },
      {
        name: 'script.js',
        content: javascript
      }
    ];
    
    // Write to disk
    for (const file of files) {
      await fs.writeFile(
        path.join(exportDir, file.name),
        file.content,
        'utf8'
      );
    }
    
    // 9. Create ZIP
    if (format === 'zip') {
      const zipPath = path.join(exportDir, `${portfolio.slug || 'portfolio'}.zip`);
      
      // Get all files including assets
      const allFiles = [
        ...files,
        ...assetMap.map(asset => ({
          path: path.join(exportDir, asset.localPath),
          name: asset.localPath
        }))
      ];
      
      const zipResult = await createZipExport(allFiles, zipPath);
      
      // Move to permanent storage or return URL
      const permanentUrl = await uploadToStorage(zipPath);
      
      return {
        success: true,
        exportUrl: permanentUrl,
        size: zipResult.size,
        files: files.map(f => f.name).concat(assetMap.map(a => a.localPath))
      };
    }
    
    // 10. Return file paths
    return {
      success: true,
      exportDir,
      files
    };
    
  } finally {
    // Cleanup temporary files (after a delay)
    setTimeout(() => {
      fs.rm(exportDir, { recursive: true, force: true })
        .catch(console.error);
    }, 3600000); // 1 hour
  }
}

function minifyHTML(html) {
  const minifier = require('html-minifier');
  return minifier.minify(html, {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true
  });
}

async function uploadToStorage(filePath) {
  // Upload to S3, Google Cloud Storage, or serve from local storage
  // Return public URL
  
  // Example with S3:
  const AWS = require('aws-sdk');
  const s3 = new AWS.S3();
  
  const fileContent = await fs.readFile(filePath);
  const fileName = path.basename(filePath);
  
  const params = {
    Bucket: process.env.AWS_EXPORT_BUCKET,
    Key: `exports/${fileName}`,
    Body: fileContent,
    ContentType: 'application/zip',
    Expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  };
  
  const result = await s3.upload(params).promise();
  return result.Location;
}

module.exports = {
  exportPortfolio
};
```

---

## Template Structure

### Echelon Template Component Structure

```javascript
// Current React structure
const EchelonTemplate = ({ content, styling, isEditing, portfolioId, caseStudies }) => {
  return (
    <div className="echelon-template">
      <EchelonHero content={content.hero} styling={styling} />
      <EchelonAbout content={content.about} styling={styling} isEditing={isEditing} />
      <EchelonWork content={content.work} styling={styling} portfolioId={portfolioId} caseStudies={caseStudies} />
      <EchelonGallery content={content.gallery} styling={styling} />
      <EchelonContact content={content.contact} styling={styling} />
    </div>
  );
};

// Sections to export
const sections = {
  hero: EchelonHero,
  about: EchelonAbout,
  work: EchelonWork,
  gallery: EchelonGallery,
  contact: EchelonContact
};
```

### HTML Output Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Meta, fonts, styles -->
</head>
<body>
  <div id="root">
    <div class="echelon-template">
      <!-- Hero Section -->
      <section class="echelon-hero">
        <div class="echelon-container">
          <h1>DESIGNING WITH PRECISION</h1>
          <p>Case studies in clarity and form</p>
        </div>
      </section>
      
      <!-- About Section -->
      <section class="echelon-about">
        <div class="echelon-container">
          <div class="echelon-grid">
            <div class="echelon-about-content">
              <h2>DESIGNER NAME</h2>
              <p>Bio text...</p>
            </div>
            <div class="echelon-about-image-wrapper">
              <img src="assets/images/profile.jpg" alt="Profile" />
            </div>
          </div>
        </div>
      </section>
      
      <!-- Work Section -->
      <section class="echelon-work">
        <!-- Projects grid -->
      </section>
      
      <!-- Gallery Section -->
      <section class="echelon-gallery">
        <!-- Gallery grid -->
      </section>
      
      <!-- Contact Section -->
      <section class="echelon-contact">
        <!-- Contact info -->
      </section>
    </div>
  </div>
  
  <script src="script.js"></script>
</body>
</html>
```

---

## Styling System

### CSS Variables from Styling Object

```javascript
// Input: portfolio.styling
{
  colors: {
    primary: "#000000",
    secondary: "#666666",
    accent: "#B80000",
    background: "#FFFFFF",
    text: "#000000"
  },
  fonts: {
    heading: '"Neue Haas Grotesk", sans-serif',
    body: '"Neue Haas Grotesk", sans-serif'
  },
  typography: {
    scale: {
      h1: "72px",
      h2: "48px",
      body: "18px"
    },
    lineHeight: {
      tight: 1.1,
      normal: 1.4
    }
  }
}

// Output: CSS
:root {
  --color-primary: #000000;
  --color-secondary: #666666;
  --color-accent: #B80000;
  --color-background: #FFFFFF;
  --color-text: #000000;
  
  --font-heading: "Neue Haas Grotesk", sans-serif;
  --font-body: "Neue Haas Grotesk", sans-serif;
  
  --text-h1: 72px;
  --text-h2: 48px;
  --text-body: 18px;
  
  --line-height-tight: 1.1;
  --line-height-normal: 1.4;
}
```

---

## Content Injection

### Dynamic Content Replacement

```javascript
// Template with placeholders
function generateHeroHTML(content, styling) {
  return `
    <section class="echelon-hero" style="background: ${styling.colors.background}; color: ${styling.colors.text};">
      <div class="echelon-container">
        <h1 style="font-size: ${styling.typography.scale.h1};">
          ${escapeHtml(content.title)}
        </h1>
        ${content.subtitle ? `
        <p style="font-size: ${styling.typography.scale.h2}; color: ${styling.colors.secondary};">
          ${escapeHtml(content.subtitle)}
        </p>
        ` : ''}
      </div>
    </section>
  `;
}

// Projects section
function generateWorkHTML(content, styling, caseStudies) {
  return `
    <section class="echelon-work">
      <div class="echelon-container">
        <h2 class="echelon-section-heading">${escapeHtml(content.heading)}</h2>
        <div class="echelon-work-grid">
          ${content.projects.map(project => {
            const caseStudy = caseStudies.find(cs => cs.projectId === project.id.toString());
            const hasCase Study = !!caseStudy;
            
            return `
              <article class="echelon-project">
                ${project.image ? `
                <img 
                  src="${project.image}" 
                  alt="${escapeHtml(project.title)}"
                  class="echelon-project-image"
                />
                ` : ''}
                <div class="echelon-project-info">
                  <h3>${escapeHtml(project.title)}</h3>
                  <p>${escapeHtml(project.description)}</p>
                  <span class="echelon-project-meta">${escapeHtml(project.meta)}</span>
                  ${hasCaseStudy ? `
                  <a href="#case-study-${project.id}" class="echelon-case-study-link">
                    VIEW CASE STUDY →
                  </a>
                  ` : ''}
                </div>
              </article>
            `;
          }).join('')}
        </div>
      </div>
    </section>
  `;
}
```

---

## Example Implementation

### Complete Export Route

```javascript
// backend/routes/portfolios.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { exportPortfolio } = require('../services/exportService');

router.post('/:id/export', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const options = req.body.options || {};
    
    // Verify ownership
    const portfolio = await Portfolio.findById(id);
    
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio not found'
      });
    }
    
    if (portfolio.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized'
      });
    }
    
    // Export portfolio
    const result = await exportPortfolio(id, {
      format: req.body.format || 'zip',
      ...options
    });
    
    res.json({
      success: true,
      data: {
        exportUrl: result.exportUrl,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        files: result.files,
        size: result.size
      }
    });
    
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export portfolio',
      message: error.message
    });
  }
});

module.exports = router;
```

---

## Testing & Validation

### Test Checklist

- [ ] HTML validates (W3C Validator)
- [ ] CSS is properly extracted and minified
- [ ] All images are downloaded and optimized
- [ ] Local image paths work correctly
- [ ] Fonts load properly
- [ ] Colors match original design
- [ ] Typography scales correctly
- [ ] Layout is responsive (mobile, tablet, desktop)
- [ ] No React artifacts in HTML
- [ ] JavaScript works without errors
- [ ] Smooth scrolling functions
- [ ] Links work correctly
- [ ] Case studies export properly
- [ ] ZIP file extracts correctly
- [ ] Files can be hosted on various platforms
- [ ] File size is reasonable (<10MB ideal)
- [ ] No external dependencies (self-contained)
- [ ] Works offline
- [ ] Browser compatibility (Chrome, Firefox, Safari, Edge)

### Validation Script

```javascript
// backend/services/validator.js
const { JSDOM } = require('jsdom');
const cssValidator = require('w3c-css-validator');

async function validateExport(exportDir) {
  const errors = [];
  const warnings = [];
  
  // Validate HTML
  const htmlPath = path.join(exportDir, 'index.html');
  const html = await fs.readFile(htmlPath, 'utf8');
  
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  // Check for React artifacts
  if (html.includes('data-reactroot') || html.includes('__REACT')) {
    errors.push('React artifacts found in HTML');
  }
  
  // Check for missing images
  const images = document.querySelectorAll('img');
  for (const img of images) {
    const src = img.getAttribute('src');
    if (src && !src.startsWith('http')) {
      const imagePath = path.join(exportDir, src);
      try {
        await fs.access(imagePath);
      } catch {
        errors.push(`Missing image: ${src}`);
      }
    }
  }
  
  // Validate CSS
  const cssPath = path.join(exportDir, 'styles.css');
  const css = await fs.readFile(cssPath, 'utf8');
  
  // Check for broken references
  const urlRegex = /url\(['"]?([^'")\s]+)['"]?\)/g;
  let match;
  while ((match = urlRegex.exec(css)) !== null) {
    const url = match[1];
    if (!url.startsWith('http') && !url.startsWith('data:')) {
      const assetPath = path.join(exportDir, url);
      try {
        await fs.access(assetPath);
      } catch {
        warnings.push(`Missing CSS asset: ${url}`);
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
```

---

## Performance Optimization

### Image Optimization Settings

```javascript
const imageOptimizationConfig = {
  jpeg: {
    quality: 85,
    progressive: true
  },
  png: {
    compressionLevel: 9,
    adaptiveFiltering: true
  },
  webp: {
    quality: 80,
    effort: 6
  },
  maxWidth: 2000,
  maxHeight: 2000
};
```

### HTML/CSS Minification

```javascript
const minificationConfig = {
  html: {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    minifyCSS: true,
    minifyJS: true
  },
  css: {
    level: 2 // Advanced optimizations
  }
};
```

---

## Deployment Instructions (for end users)

Include in README.md:

```markdown
# Deployment Guide

## Quick Deploy Options

### 1. Netlify Drop
1. Go to https://app.netlify.com/drop
2. Drag this entire folder onto the page
3. Your site is live!

### 2. Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in this directory
3. Follow the prompts

### 3. GitHub Pages
1. Create a new GitHub repository
2. Push these files to the repo
3. Go to Settings → Pages
4. Select main branch as source
5. Your site will be live at `username.github.io/repo-name`

### 4. Traditional Web Hosting
1. Connect to your host via FTP
2. Upload all files to public_html or www directory
3. Access via your domain

## Custom Domain
Most hosting providers allow you to connect a custom domain in their settings.
```

---

## Summary

This guide provides a complete implementation for:

1. **Server-Side Rendering**: Converting React components to static HTML
2. **CSS Extraction**: Pulling styles and inlining or exporting as separate files
3. **Asset Processing**: Downloading, optimizing, and bundling images
4. **ZIP Export**: Creating downloadable portfolio packages
5. **Validation**: Ensuring exported files work correctly
6. **Deployment**: Making it easy for users to host their portfolios

The backend team should implement the `/api/portfolios/:id/export` endpoint following this guide, and users will be able to export their portfolios as standalone websites that work anywhere!
