# Backend API Implementation Guide - Portfolio, Templates & Case Studies

## Table of Contents
1. [Overview](#overview)
2. [Database Schema](#database-schema)
3. [API Endpoints](#api-endpoints)
4. [Data Structures](#data-structures)
5. [Implementation Examples](#implementation-examples)
6. [Error Handling](#error-handling)
7. [Testing Checklist](#testing-checklist)

---

## Overview

This document provides detailed specifications for implementing the backend API to support:
- Portfolio creation and management with dynamic template system
- Case study creation and editing
- Portfolio publishing with custom slugs
- Template data structure and content management
- Image uploads and management

### Technology Stack (Frontend)
- React 18
- React Router v6
- Framer Motion for animations
- React Hot Toast for notifications
- Zustand for state management

### Frontend Base URL
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// Example: https://api.aurea.com or http://localhost:5000
```

---

## Database Schema

### 1. Portfolio Model

```javascript
const portfolioSchema = new mongoose.Schema({
  // Basic Info
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  
  // Template Info
  templateId: {
    type: String,
    required: true,
    enum: ['echelon'], // Add more template IDs as they're created
    index: true
  },
  
  // Portfolio Content (Dynamic based on template)
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    // Structure varies by template, example for Echelon:
    // {
    //   hero: { title: String, subtitle: String },
    //   about: { name: String, image: String, bio: String },
    //   work: { heading: String, projects: Array },
    //   gallery: { heading: String, images: Array },
    //   contact: { heading: String, text: String, button: String, email: String }
    // }
  },
  
  // Styling Configuration
  styling: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    // Structure:
    // {
    //   colors: { primary, secondary, accent, background, text, etc. },
    //   fonts: { heading, body, mono },
    //   typography: { scale, lineHeight, fontWeight },
    //   spacing: { section, element, tight, baseline },
    //   grid: { columns, gutter, margin },
    //   borderRadius: { none, sm, md, lg }
    // }
  },
  
  // Publishing
  slug: {
    type: String,
    unique: true,
    sparse: true, // Allows null, but unique when set
    lowercase: true,
    trim: true,
    match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    minlength: 3,
    maxlength: 50,
    index: true
  },
  
  isPublished: {
    type: Boolean,
    default: false,
    index: true
  },
  
  publishedAt: {
    type: Date,
    default: null
  },
  
  unpublishedAt: {
    type: Date,
    default: null
  },
  
  // Analytics
  viewCount: {
    type: Number,
    default: 0
  },
  
  lastViewedAt: {
    type: Date,
    default: null
  },
  
  // Case Studies (References)
  caseStudies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CaseStudy'
  }],
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Automatically manages createdAt and updatedAt
});

// Indexes
portfolioSchema.index({ userId: 1, createdAt: -1 });
portfolioSchema.index({ slug: 1 }, { unique: true, sparse: true });
portfolioSchema.index({ isPublished: 1, publishedAt: -1 });
portfolioSchema.index({ userId: 1, isPublished: 1 });

// Virtual for public URL
portfolioSchema.virtual('publicUrl').get(function() {
  return this.slug ? `${process.env.FRONTEND_URL}/portfolio/${this.slug}` : null;
});

// Ensure virtuals are included in JSON
portfolioSchema.set('toJSON', { virtuals: true });
portfolioSchema.set('toObject', { virtuals: true });
```

### 2. CaseStudy Model

```javascript
const caseStudySchema = new mongoose.Schema({
  // Ownership
  portfolioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Portfolio',
    required: true,
    index: true
  },
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Project Info (from work.projects)
  projectId: {
    type: String, // Matches the project ID in portfolio content
    required: true
  },
  
  // Case Study Content
  content: {
    // Hero Section
    hero: {
      title: { type: String, required: true },
      subtitle: String,
      coverImage: String,
      client: String,
      year: String,
      role: String,
      duration: String
    },
    
    // Overview Section
    overview: {
      heading: { type: String, default: 'Project Overview' },
      description: String,
      challenge: String,
      solution: String,
      results: String
    },
    
    // Process/Details Sections (Flexible)
    sections: [{
      id: String,
      type: { type: String, enum: ['text', 'image', 'image-text', 'gallery'] },
      heading: String,
      content: String,
      image: String,
      images: [String],
      layout: { type: String, enum: ['left', 'right', 'center'] }
    }],
    
    // Additional Context
    additionalContext: {
      heading: { type: String, default: 'Additional Context' },
      content: String
    },
    
    // Next Project Link
    nextProject: {
      id: String,
      title: String,
      image: String
    }
  },
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
caseStudySchema.index({ portfolioId: 1, projectId: 1 }, { unique: true });
caseStudySchema.index({ userId: 1, createdAt: -1 });
```

---

## API Endpoints

### Portfolio Endpoints

#### 1. Create New Portfolio
**POST** `/api/portfolios`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "My Portfolio",
  "description": "A showcase of my work",
  "templateId": "echelon",
  "content": {
    "hero": {
      "title": "DESIGNING WITH PRECISION",
      "subtitle": "Case studies in clarity and form"
    },
    "about": {
      "name": "DESIGNER NAME",
      "image": "",
      "bio": "I am a designer..."
    },
    "work": {
      "heading": "SELECTED WORK",
      "projects": [
        {
          "id": 1,
          "title": "PROJECT TITLE",
          "description": "Brief description...",
          "image": "",
          "meta": "2025 — Category",
          "category": "design"
        }
      ]
    },
    "gallery": {
      "heading": "VISUAL STUDIES",
      "images": [
        { "src": "", "caption": "Visual exploration 01", "meta": "01" }
      ]
    },
    "contact": {
      "heading": "GET IN TOUCH",
      "text": "Available for projects",
      "button": "CONTACT",
      "email": "hello@designer.com"
    }
  },
  "styling": {
    "colors": {
      "primary": "#000000",
      "secondary": "#666666",
      "accent": "#B80000",
      "background": "#FFFFFF",
      "text": "#000000"
    },
    "fonts": {
      "heading": "\"Neue Haas Grotesk\", sans-serif",
      "body": "\"Neue Haas Grotesk\", sans-serif"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Portfolio created successfully",
  "data": {
    "portfolio": {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "507f1f77bcf86cd799439012",
      "title": "My Portfolio",
      "description": "A showcase of my work",
      "templateId": "echelon",
      "content": { /* ... */ },
      "styling": { /* ... */ },
      "slug": null,
      "isPublished": false,
      "caseStudies": [],
      "createdAt": "2025-10-04T12:00:00.000Z",
      "updatedAt": "2025-10-04T12:00:00.000Z"
    }
  }
}
```

**Error Cases:**
- 400: Invalid template ID or missing required fields
- 401: Unauthorized (no token or invalid token)
- 500: Server error

---

#### 2. Get Portfolio by ID
**GET** `/api/portfolios/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "portfolio": {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "507f1f77bcf86cd799439012",
      "title": "My Portfolio",
      "description": "A showcase of my work",
      "templateId": "echelon",
      "content": { /* ... */ },
      "styling": { /* ... */ },
      "slug": "my-portfolio",
      "isPublished": true,
      "publishedAt": "2025-10-04T12:00:00.000Z",
      "viewCount": 42,
      "caseStudies": [
        {
          "_id": "507f1f77bcf86cd799439013",
          "projectId": "1",
          "content": { /* ... */ }
        }
      ],
      "createdAt": "2025-10-04T12:00:00.000Z",
      "updatedAt": "2025-10-04T12:30:00.000Z",
      "publicUrl": "https://aurea.com/portfolio/my-portfolio"
    }
  }
}
```

**Error Cases:**
- 401: Unauthorized
- 403: User doesn't own this portfolio
- 404: Portfolio not found

**Implementation Notes:**
- Populate `caseStudies` field with full case study data
- Only allow owner to view unpublished portfolios
- Include virtual `publicUrl` field

---

#### 3. Update Portfolio
**PUT** `/api/portfolios/:id`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "content": {
    "hero": {
      "title": "NEW TITLE",
      "subtitle": "New subtitle"
    }
    // ... other sections
  },
  "styling": {
    "colors": {
      "primary": "#FF0000"
      // ... other colors
    }
    // ... other styling
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Portfolio updated successfully",
  "data": {
    "portfolio": { /* updated portfolio object */ }
  }
}
```

**Error Cases:**
- 401: Unauthorized
- 403: User doesn't own this portfolio
- 404: Portfolio not found
- 400: Invalid data

**Implementation Notes:**
- Only update provided fields (partial update)
- Validate content structure matches template requirements
- Update `updatedAt` timestamp
- If published, consider marking as "needs republishing" or auto-republish

---

#### 4. Delete Portfolio
**DELETE** `/api/portfolios/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Portfolio deleted successfully"
}
```

**Error Cases:**
- 401: Unauthorized
- 403: User doesn't own this portfolio
- 404: Portfolio not found

**Implementation Notes:**
- Also delete all associated case studies
- Remove all uploaded images (if using cloud storage)
- Cannot be undone - consider soft delete instead

---

#### 5. Get User's Portfolios
**GET** `/api/portfolios/user/me`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `published` (optional): `true` | `false` | `all` (default: `all`)
- `sort` (optional): `createdAt` | `updatedAt` | `title` (default: `createdAt`)
- `order` (optional): `asc` | `desc` (default: `desc`)

**Response:**
```json
{
  "success": true,
  "data": {
    "portfolios": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "title": "My Portfolio",
        "description": "A showcase of my work",
        "templateId": "echelon",
        "slug": "my-portfolio",
        "isPublished": true,
        "publishedAt": "2025-10-04T12:00:00.000Z",
        "viewCount": 42,
        "caseStudiesCount": 3,
        "createdAt": "2025-10-04T12:00:00.000Z",
        "updatedAt": "2025-10-04T12:30:00.000Z",
        "publicUrl": "https://aurea.com/portfolio/my-portfolio"
      }
      // ... more portfolios
    ],
    "total": 5,
    "published": 2,
    "unpublished": 3
  }
}
```

**Implementation Notes:**
- Don't return full `content` and `styling` (too large)
- Add virtual field `caseStudiesCount`
- Apply filters and sorting

---

### Publishing Endpoints

#### 6. Check Slug Availability
**GET** `/api/portfolios/check-slug/:slug`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "available": true,
  "message": "Slug is available"
}
```

**Error Response (Taken):**
```json
{
  "success": true,
  "available": false,
  "message": "This slug is already taken",
  "suggestions": [
    "my-portfolio-2025",
    "my-portfolio-designer",
    "my-creative-portfolio"
  ]
}
```

**Error Cases:**
- 400: Invalid slug format
- 401: Unauthorized

**Implementation Notes:**
- Check against regex: `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`
- Min length: 3, Max length: 50
- Reserved slugs to block:
  ```javascript
  const RESERVED_SLUGS = [
    'admin', 'api', 'dashboard', 'login', 'signup', 
    'about', 'contact', 'terms', 'privacy', 'help', 
    'support', 'blog', 'docs', 'new', 'create',
    'templates', 'events', 'profile', 'settings'
  ];
  ```
- If slug is taken, generate 3 available suggestions
- If checking for update, allow if it's the user's current slug

---

#### 7. Publish Portfolio
**PUT** `/api/portfolios/:id/publish`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "slug": "my-portfolio",
  "isPublished": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Portfolio published successfully",
  "data": {
    "portfolio": {
      "_id": "507f1f77bcf86cd799439011",
      "slug": "my-portfolio",
      "isPublished": true,
      "publishedAt": "2025-10-04T12:00:00.000Z",
      "publicUrl": "https://aurea.com/portfolio/my-portfolio"
    }
  }
}
```

**Error Cases:**
- 400: Invalid slug or slug already taken
- 401: Unauthorized
- 403: User doesn't own portfolio
- 404: Portfolio not found

**Implementation Notes:**
- Validate slug availability (unless it's current slug)
- Set `publishedAt` if first time publishing
- Update `updatedAt`
- Return full portfolio object or minimal object

---

#### 8. Unpublish Portfolio
**PUT** `/api/portfolios/:id/unpublish`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Portfolio unpublished successfully",
  "data": {
    "portfolio": {
      "_id": "507f1f77bcf86cd799439011",
      "isPublished": false,
      "unpublishedAt": "2025-10-04T13:00:00.000Z"
    }
  }
}
```

**Implementation Notes:**
- Set `isPublished` to `false`
- Set `unpublishedAt` timestamp
- Keep `slug` so user can republish easily

---

#### 9. Get Published Portfolio (Public - No Auth)
**GET** `/api/portfolios/public/:slug`

**Headers:** None required

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "My Portfolio",
    "description": "A showcase of my work",
    "templateId": "echelon",
    "content": { /* full content */ },
    "styling": { /* full styling */ },
    "slug": "my-portfolio",
    "isPublished": true,
    "publishedAt": "2025-10-04T12:00:00.000Z",
    "viewCount": 43,
    "caseStudies": [
      { /* full case study data */ }
    ],
    "userId": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "John Doe",
      "profileImage": "https://..."
    }
  }
}
```

**Error Cases:**
- 404: Portfolio not found or not published

**Implementation Notes:**
- No authentication required
- Only return if `isPublished: true`
- Increment `viewCount` atomically:
  ```javascript
  await Portfolio.findOneAndUpdate(
    { slug, isPublished: true },
    { 
      $inc: { viewCount: 1 },
      $set: { lastViewedAt: new Date() }
    }
  );
  ```
- Populate user info (name, profileImage only - NOT email)
- Populate all case studies
- Cache response (5-10 minutes) for performance

---

### Case Study Endpoints

#### 10. Create Case Study
**POST** `/api/case-studies`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "portfolioId": "507f1f77bcf86cd799439011",
  "projectId": "1",
  "content": {
    "hero": {
      "title": "Logo Design Process",
      "subtitle": "A comprehensive case study",
      "coverImage": "https://...",
      "client": "Acme Corp",
      "year": "2025",
      "role": "Lead Designer",
      "duration": "3 months"
    },
    "overview": {
      "heading": "Project Overview",
      "description": "This project...",
      "challenge": "The main challenge...",
      "solution": "Our solution...",
      "results": "We achieved..."
    },
    "sections": [
      {
        "id": "section-1",
        "type": "text",
        "heading": "Research Phase",
        "content": "We began by..."
      },
      {
        "id": "section-2",
        "type": "image",
        "heading": "Initial Concepts",
        "image": "https://..."
      },
      {
        "id": "section-3",
        "type": "image-text",
        "heading": "Final Design",
        "content": "The final design...",
        "image": "https://...",
        "layout": "left"
      },
      {
        "id": "section-4",
        "type": "gallery",
        "heading": "Iterations",
        "images": ["https://...", "https://..."]
      }
    ],
    "additionalContext": {
      "heading": "Additional Context",
      "content": "More details..."
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Case study created successfully",
  "data": {
    "caseStudy": {
      "_id": "507f1f77bcf86cd799439013",
      "portfolioId": "507f1f77bcf86cd799439011",
      "userId": "507f1f77bcf86cd799439012",
      "projectId": "1",
      "content": { /* ... */ },
      "createdAt": "2025-10-04T12:00:00.000Z",
      "updatedAt": "2025-10-04T12:00:00.000Z"
    }
  }
}
```

**Error Cases:**
- 400: Invalid data or missing required fields
- 401: Unauthorized
- 403: User doesn't own the portfolio
- 404: Portfolio not found
- 409: Case study already exists for this project

**Implementation Notes:**
- Verify user owns the portfolio
- Verify projectId exists in portfolio.content.work.projects
- Add case study ID to portfolio.caseStudies array
- Each project can only have one case study

---

#### 11. Get Case Study
**GET** `/api/case-studies/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "caseStudy": {
      "_id": "507f1f77bcf86cd799439013",
      "portfolioId": {
        "_id": "507f1f77bcf86cd799439011",
        "title": "My Portfolio",
        "slug": "my-portfolio"
      },
      "projectId": "1",
      "content": { /* ... */ },
      "createdAt": "2025-10-04T12:00:00.000Z",
      "updatedAt": "2025-10-04T12:00:00.000Z"
    }
  }
}
```

**Implementation Notes:**
- Populate portfolioId with basic info
- Only allow owner to view

---

#### 12. Get Case Study by Portfolio and Project
**GET** `/api/case-studies/portfolio/:portfolioId/project/:projectId`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:** Same as Get Case Study

**Implementation Notes:**
- Used by frontend when navigating from project to case study editor
- Query: `{ portfolioId, projectId }`

---

#### 13. Update Case Study
**PUT** `/api/case-studies/:id`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": {
    "hero": {
      "title": "Updated Title"
      // ... updated fields
    }
    // ... other sections
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Case study updated successfully",
  "data": {
    "caseStudy": { /* updated case study */ }
  }
}
```

**Implementation Notes:**
- Partial update (only update provided fields)
- Merge new content with existing
- Update `updatedAt` timestamp

---

#### 14. Delete Case Study
**DELETE** `/api/case-studies/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Case study deleted successfully"
}
```

**Implementation Notes:**
- Remove case study ID from portfolio.caseStudies array
- Delete all associated images if stored
- Only allow owner to delete

---

#### 15. Get Public Case Study
**GET** `/api/case-studies/public/:portfolioSlug/:projectId`

**Headers:** None required

**Response:**
```json
{
  "success": true,
  "data": {
    "caseStudy": { /* full case study data */ },
    "portfolio": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "My Portfolio",
      "slug": "my-portfolio"
    }
  }
}
```

**Implementation Notes:**
- Public endpoint, no auth required
- Find portfolio by slug, verify it's published
- Find case study by portfolioId and projectId
- Return 404 if portfolio not published or case study not found

---

### Image Upload Endpoint

#### 16. Upload Single Image
**POST** `/api/upload/single`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
image: File (max 25MB)
```

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://cloudinary.com/...",
    "publicId": "aurea/user-123/portfolio-456/image-789",
    "width": 1920,
    "height": 1080,
    "format": "jpg",
    "size": 245678
  }
}
```

**Error Cases:**
- 400: Invalid file type or size too large
- 401: Unauthorized
- 413: File too large
- 500: Upload failed

**Implementation Notes:**
- Accept: `image/jpeg`, `image/png`, `image/gif`, `image/webp`
- Max size: 25MB
- Use Cloudinary or similar service
- Organize by user/portfolio: `/aurea/{userId}/{portfolioId}/{timestamp}`
- Generate thumbnail versions (optional)
- Return full URL for immediate use

---

#### 17. Upload Multiple Images
**POST** `/api/upload/multiple`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
images: File[] (max 6 files, 25MB each)
```

**Response:**
```json
{
  "success": true,
  "message": "6 images uploaded successfully",
  "data": {
    "images": [
      {
        "url": "https://cloudinary.com/...",
        "publicId": "...",
        "width": 1920,
        "height": 1080
      }
      // ... more images
    ],
    "failed": []
  }
}
```

**Implementation Notes:**
- Process in parallel for speed
- Return partial success if some fail
- Include failed uploads with error messages

---

## Data Structures

### Frontend State Management (Zustand)

```javascript
// stores/portfolioStore.js
const usePortfolioStore = create((set) => ({
  portfolios: [],
  currentPortfolio: null,
  
  setPortfolios: (portfolios) => set({ portfolios }),
  
  setCurrentPortfolio: (portfolio) => set({ currentPortfolio: portfolio }),
  
  updatePortfolio: (id, updates) => set((state) => ({
    portfolios: state.portfolios.map(p => 
      p._id === id ? { ...p, ...updates } : p
    ),
    currentPortfolio: state.currentPortfolio?._id === id 
      ? { ...state.currentPortfolio, ...updates }
      : state.currentPortfolio
  })),
  
  deletePortfolio: (id) => set((state) => ({
    portfolios: state.portfolios.filter(p => p._id !== id),
    currentPortfolio: state.currentPortfolio?._id === id 
      ? null 
      : state.currentPortfolio
  }))
}));
```

### Echelon Template Content Structure

```javascript
// Complete structure for Echelon template
const echelonContent = {
  hero: {
    title: String,        // Main headline
    subtitle: String      // Subheading
  },
  
  about: {
    name: String,         // Designer name
    image: String,        // Profile image URL
    bio: String          // Biography text
  },
  
  work: {
    heading: String,      // Section heading
    projects: [
      {
        id: Number | String,
        title: String,
        description: String,
        image: String,    // Project thumbnail
        meta: String,     // "2025 — Category"
        category: String, // "design", "development", etc.
        caseStudyUrl: String (optional) // Link to case study
      }
    ]
  },
  
  gallery: {
    heading: String,
    images: [
      {
        src: String,      // Image URL
        caption: String,  // Image caption
        meta: String      // Image number or date
      }
    ]
  },
  
  contact: {
    heading: String,
    text: String,        // Contact description
    button: String,      // Button text
    email: String        // Contact email
  }
};
```

### Case Study Content Structure

```javascript
const caseStudyContent = {
  hero: {
    title: String,
    subtitle: String,
    coverImage: String,
    client: String,
    year: String,
    role: String,
    duration: String
  },
  
  overview: {
    heading: String,
    description: String,
    challenge: String,
    solution: String,
    results: String
  },
  
  sections: [
    {
      id: String,          // Unique section ID
      type: 'text' | 'image' | 'image-text' | 'gallery',
      heading: String,
      content: String,     // For text sections
      image: String,       // For image/image-text sections
      images: [String],    // For gallery sections
      layout: 'left' | 'right' | 'center' // For image-text
    }
  ],
  
  additionalContext: {
    heading: String,
    content: String
  },
  
  nextProject: {          // Optional
    id: String,
    title: String,
    image: String
  }
};
```

---

## Implementation Examples

### Portfolio Creation Flow

```javascript
// Frontend: Create portfolio
async function createPortfolio(templateId) {
  const template = getTemplate(templateId);
  const portfolioData = createPortfolioFromTemplate(
    templateId,
    template.defaultContent
  );
  
  const response = await fetch(`${API_BASE_URL}/api/portfolios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: `${template.name} Portfolio`,
      description: `Portfolio created with ${template.name} template`,
      templateId: template.id,
      content: portfolioData.content,
      styling: portfolioData.styling
    })
  });
  
  const data = await response.json();
  return data;
}

// Backend: Create portfolio endpoint
router.post('/portfolios', authenticate, async (req, res) => {
  try {
    const { title, description, templateId, content, styling } = req.body;
    
    // Validate template ID
    const validTemplates = ['echelon'];
    if (!validTemplates.includes(templateId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid template ID'
      });
    }
    
    // Create portfolio
    const portfolio = new Portfolio({
      userId: req.user._id,
      title,
      description,
      templateId,
      content,
      styling,
      isPublished: false
    });
    
    await portfolio.save();
    
    res.status(201).json({
      success: true,
      message: 'Portfolio created successfully',
      data: { portfolio }
    });
  } catch (error) {
    console.error('Create portfolio error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create portfolio'
    });
  }
});
```

### Portfolio Update Flow

```javascript
// Frontend: Update portfolio
async function updatePortfolio(id, updates) {
  const response = await fetch(`${API_BASE_URL}/api/portfolios/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updates)
  });
  
  return await response.json();
}

// Backend: Update portfolio endpoint
router.put('/portfolios/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Find portfolio
    const portfolio = await Portfolio.findById(id);
    
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio not found'
      });
    }
    
    // Check ownership
    if (portfolio.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this portfolio'
      });
    }
    
    // Update fields
    const allowedFields = ['title', 'description', 'content', 'styling'];
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        portfolio[field] = updates[field];
      }
    });
    
    portfolio.updatedAt = new Date();
    await portfolio.save();
    
    res.json({
      success: true,
      message: 'Portfolio updated successfully',
      data: { portfolio }
    });
  } catch (error) {
    console.error('Update portfolio error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update portfolio'
    });
  }
});
```

### Publishing Flow

```javascript
// Frontend: Publish portfolio
async function publishPortfolio(id, slug) {
  const response = await fetch(`${API_BASE_URL}/api/portfolios/${id}/publish`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      slug,
      isPublished: true
    })
  });
  
  return await response.json();
}

// Backend: Publish portfolio endpoint
router.put('/portfolios/:id/publish', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { slug, isPublished } = req.body;
    
    // Find portfolio
    const portfolio = await Portfolio.findById(id);
    
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio not found'
      });
    }
    
    // Check ownership
    if (portfolio.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized'
      });
    }
    
    // Validate slug
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(slug)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid slug format'
      });
    }
    
    // Check slug availability
    if (slug !== portfolio.slug) {
      const existing = await Portfolio.findOne({ slug });
      if (existing) {
        return res.status(409).json({
          success: false,
          error: 'Slug already taken'
        });
      }
    }
    
    // Update portfolio
    portfolio.slug = slug;
    portfolio.isPublished = isPublished;
    
    if (!portfolio.publishedAt) {
      portfolio.publishedAt = new Date();
    }
    
    await portfolio.save();
    
    res.json({
      success: true,
      message: 'Portfolio published successfully',
      data: {
        portfolio: {
          _id: portfolio._id,
          slug: portfolio.slug,
          isPublished: portfolio.isPublished,
          publishedAt: portfolio.publishedAt,
          publicUrl: `${process.env.FRONTEND_URL}/portfolio/${portfolio.slug}`
        }
      }
    });
  } catch (error) {
    console.error('Publish portfolio error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to publish portfolio'
    });
  }
});
```

### Case Study Creation Flow

```javascript
// Frontend: Create case study
async function createCaseStudy(portfolioId, projectId, content) {
  const response = await fetch(`${API_BASE_URL}/api/case-studies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      portfolioId,
      projectId,
      content
    })
  });
  
  return await response.json();
}

// Backend: Create case study endpoint
router.post('/case-studies', authenticate, async (req, res) => {
  try {
    const { portfolioId, projectId, content } = req.body;
    
    // Find portfolio
    const portfolio = await Portfolio.findById(portfolioId);
    
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: 'Portfolio not found'
      });
    }
    
    // Check ownership
    if (portfolio.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized'
      });
    }
    
    // Check if case study already exists
    const existing = await CaseStudy.findOne({ portfolioId, projectId });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'Case study already exists for this project'
      });
    }
    
    // Create case study
    const caseStudy = new CaseStudy({
      portfolioId,
      userId: req.user._id,
      projectId,
      content
    });
    
    await caseStudy.save();
    
    // Add to portfolio
    portfolio.caseStudies.push(caseStudy._id);
    await portfolio.save();
    
    res.status(201).json({
      success: true,
      message: 'Case study created successfully',
      data: { caseStudy }
    });
  } catch (error) {
    console.error('Create case study error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create case study'
    });
  }
});
```

---

## Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "error": "Error message for user",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional error details"
  }
}
```

### Common Error Codes

- `INVALID_INPUT`: Validation error
- `NOT_FOUND`: Resource not found
- `UNAUTHORIZED`: No token or invalid token
- `FORBIDDEN`: User doesn't have permission
- `CONFLICT`: Resource already exists (duplicate)
- `SERVER_ERROR`: Internal server error
- `SLUG_TAKEN`: Slug already in use
- `INVALID_SLUG`: Slug doesn't match format
- `FILE_TOO_LARGE`: Upload file exceeds limit
- `INVALID_FILE_TYPE`: File type not supported

---

## Testing Checklist

### Portfolio Endpoints
- [ ] Create portfolio with valid data
- [ ] Create portfolio with invalid template ID
- [ ] Get portfolio by ID (owner)
- [ ] Get portfolio by ID (non-owner) - should fail
- [ ] Update portfolio content
- [ ] Update portfolio styling
- [ ] Delete portfolio
- [ ] List user's portfolios
- [ ] Filter portfolios by published status

### Publishing
- [ ] Check slug availability (available)
- [ ] Check slug availability (taken)
- [ ] Publish portfolio with valid slug
- [ ] Publish with taken slug - should fail
- [ ] Publish with invalid slug format - should fail
- [ ] Unpublish portfolio
- [ ] Republish with same slug
- [ ] Get public portfolio by slug
- [ ] Get unpublished portfolio by slug - should fail
- [ ] View count increments correctly

### Case Studies
- [ ] Create case study for project
- [ ] Create duplicate case study - should fail
- [ ] Get case study by ID
- [ ] Update case study content
- [ ] Delete case study
- [ ] Get public case study
- [ ] Case study removed from portfolio on delete

### Image Upload
- [ ] Upload valid image
- [ ] Upload file too large - should fail
- [ ] Upload invalid file type - should fail
- [ ] Upload multiple images
- [ ] Uploaded images accessible via URL

### Security
- [ ] All authenticated endpoints require valid token
- [ ] Users can only access their own portfolios
- [ ] Public endpoints work without token
- [ ] Rate limiting works correctly
- [ ] Reserved slugs are blocked

---

## Rate Limiting Recommendations

```javascript
// Rate limit configuration
const rateLimits = {
  // Slug check: 10 per minute per IP
  checkSlug: {
    windowMs: 60 * 1000,
    max: 10
  },
  
  // Publish: 5 per minute per user
  publish: {
    windowMs: 60 * 1000,
    max: 5
  },
  
  // Portfolio CRUD: 30 per minute per user
  portfolioCrud: {
    windowMs: 60 * 1000,
    max: 30
  },
  
  // Image upload: 20 per minute per user
  imageUpload: {
    windowMs: 60 * 1000,
    max: 20
  },
  
  // Public view: 100 per minute per IP
  publicView: {
    windowMs: 60 * 1000,
    max: 100
  }
};
```

---

## Environment Variables Required

```env
# Backend
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aurea
JWT_SECRET=your-secret-key

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Cloudinary (or other image service)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Optional
REDIS_URL=redis://localhost:6379
```

---

## Notes for Backend Team

1. **Mongoose Middleware**: Add pre-save middleware to validate template-specific content structure

2. **Caching**: Implement caching for public portfolios (Redis recommended)

3. **Image Storage**: Use Cloudinary or AWS S3 for image storage with proper organization

4. **Validation**: Use express-validator or Joi for request validation

5. **Logging**: Implement proper logging (Winston or similar)

6. **Analytics**: Consider tracking view analytics in separate collection

7. **Backup**: Regular backups of portfolio data (content and images)

8. **Testing**: Write comprehensive unit and integration tests

9. **Documentation**: Generate API docs with Swagger/OpenAPI

10. **Monitoring**: Set up monitoring for API health and performance

---

This documentation should provide everything needed to implement the backend. Let me know if you need clarification on any endpoints or data structures!
