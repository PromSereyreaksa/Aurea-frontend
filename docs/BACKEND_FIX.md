# Backend Publishing System Fix

## Executive Summary

The current publishing system **stores published portfolios incorrectly**, making them **un-retrievable** via `/api/sites/:subdomain`. This document outlines the complete backend fix needed to:

1. ✅ Store published sites properly in a dedicated `sites` collection
2. ✅ Create proper indexes for fast subdomain lookups
3. ✅ Denormalize data for fast serving (snapshot on publish)
4. ✅ Handle subdomain changes and republishing
5. ✅ Support unpublishing and site management

---

## Current Problem

### Issue 1: Sites Not Stored Properly

```javascript
// ❌ CURRENT: Frontend calls POST /api/sites/sub-publish
const result = await portfolioApi.publish(portfolioId, subdomain);

// Backend SHOULD create a Site document, but...
// The frontend gets 500 error when trying to retrieve
GET /api/sites/:subdomain → 404 "Site not found"
```

**Root Cause**: The `sites` collection either:
- Doesn't exist
- Has wrong schema
- Publishing endpoint doesn't create documents correctly
- Retrieval endpoint has wrong query logic

### Issue 2: Data Not Denormalized

When a user publishes, the backend should store a **complete snapshot** of:
- Portfolio content (all sections)
- Template schema (for rendering)
- User styling overrides
- Template component mapping

**Current Problem**: Backend likely just stores a reference to the portfolio, requiring joins at render time.

### Issue 3: No Subdomain Indexing

Fast lookup requires:
```javascript
// Need unique index on subdomain
db.sites.createIndex({ subdomain: 1 }, { unique: true })

// Need index on userId for management
db.sites.createIndex({ userId: 1 })
```

Without proper indexes, queries are slow and can't enforce uniqueness.

---

## Solution Architecture

### High-Level Flow

```
┌─────────────────────────────────────────────────────────────┐
│                         USER PUBLISHES                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Frontend: POST /api/sites/sub-publish                     │
│  {                                                           │
│    portfolioId: "abc123",                                   │
│    subdomain: "john-portfolio"                              │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Backend: Publishing Endpoint                               │
│                                                             │
│  1. Validate subdomain                                     │
│     - Check uniqueness                                      │
│     - Check allowed characters                              │
│                                                             │
│  2. Fetch Portfolio + Template                             │
│     - Get full portfolio document                           │
│     - Get template schema from templates collection         │
│                                                             │
│  3. Create Site Snapshot                                   │
│     - Denormalize all data into one document               │
│     - Store complete content                                │
│     - Store template schema                                 │
│     - Store styling                                         │
│                                                             │
│  4. Save to sites collection                               │
│     - Create or update Site document                        │
│     - Set isActive: true                                    │
│     - Set publishedAt timestamp                             │
│                                                             │
│  5. Update Portfolio                                       │
│     - Mark portfolio as published                           │
│     - Store subdomain reference                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  USER VISITS: https://aurea.tools/portfolio/john-portfolio │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Frontend: GET /api/sites/john-portfolio                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Backend: Retrieval Endpoint                                │
│                                                             │
│  1. Query sites collection                                 │
│     db.sites.findOne({ subdomain, isActive: true })       │
│                                                             │
│  2. Return complete snapshot                               │
│     {                                                      │
│       success: true,                                       │
│       data: {                                              │
│         subdomain,                                         │
│         content: { hero: {...}, gallery: {...} },        │
│         template: { schema, styling },                    │
│         metadata: { publishedAt, userId }                 │
│       }                                                    │
│     }                                                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Frontend: Renders Portfolio                                │
│  - Uses template schema to render                          │
│  - Uses content data to populate                           │
│  - No additional API calls needed                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Schema

### Sites Collection

```javascript
// MongoDB Schema: models/Site.js
const mongoose = require('mongoose');

const SiteSchema = new mongoose.Schema({
  // ============================================
  // IDENTIFICATION
  // ============================================
  subdomain: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
    validate: {
      validator: function(v) {
        // Only lowercase letters, numbers, hyphens
        return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v);
      },
      message: 'Subdomain can only contain lowercase letters, numbers, and hyphens'
    },
    minlength: 3,
    maxlength: 50
  },

  // ============================================
  // OWNERSHIP
  // ============================================
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  portfolioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Portfolio',
    required: true,
    index: true
  },

  // ============================================
  // SNAPSHOT DATA (Denormalized)
  // ============================================

  // Portfolio Metadata
  metadata: {
    title: { type: String, required: true },
    description: String,
    ownerName: String,
    ownerEmail: String
  },

  // Complete Template Schema
  template: {
    templateId: { type: String, required: true },
    name: String,
    version: String,

    // Full template schema at time of publish
    schema: {
      sections: [{
        id: String,
        type: String,
        variant: String,
        order: Number,
        fields: [mongoose.Schema.Types.Mixed]
      }],

      styling: {
        theme: mongoose.Schema.Types.Mixed,
        typography: mongoose.Schema.Types.Mixed,
        spacing: String,
        borderRadius: String
      }
    }
  },

  // Complete Portfolio Content
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    // Structure: { hero: {...}, about: {...}, gallery: {...}, etc. }
  },

  // User Styling Overrides
  styling: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
    // User's custom colors, fonts, spacing overrides
  },

  // Case Studies (if any)
  caseStudies: [{
    type: mongoose.Schema.Types.Mixed
  }],

  // ============================================
  // STATUS & METADATA
  // ============================================
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },

  publishedAt: {
    type: Date,
    default: Date.now,
    index: true
  },

  lastUpdated: {
    type: Date,
    default: Date.now
  },

  // Tracking
  viewCount: {
    type: Number,
    default: 0
  },

  // SEO
  seo: {
    title: String,
    description: String,
    image: String, // OG image
    keywords: [String]
  }

}, {
  timestamps: true
});

// ============================================
// INDEXES
// ============================================

// Primary lookup index
SiteSchema.index({ subdomain: 1, isActive: 1 });

// User's sites
SiteSchema.index({ userId: 1, isActive: 1 });

// Portfolio reference
SiteSchema.index({ portfolioId: 1 });

// ============================================
// METHODS
// ============================================

SiteSchema.methods.incrementViews = function() {
  this.viewCount += 1;
  return this.save();
};

SiteSchema.methods.deactivate = function() {
  this.isActive = false;
  return this.save();
};

// ============================================
// STATICS
// ============================================

SiteSchema.statics.findBySubdomain = function(subdomain) {
  return this.findOne({ subdomain, isActive: true });
};

SiteSchema.statics.findUserSites = function(userId) {
  return this.find({ userId, isActive: true }).sort({ publishedAt: -1 });
};

SiteSchema.statics.isSubdomainAvailable = async function(subdomain, excludeSiteId = null) {
  const query = { subdomain };
  if (excludeSiteId) {
    query._id = { $ne: excludeSiteId };
  }
  const existing = await this.findOne(query);
  return !existing;
};

module.exports = mongoose.model('Site', SiteSchema);
```

---

## API Endpoints

### 1. Publish Endpoint

```javascript
// POST /api/sites/sub-publish
// Creates or updates a published site

const Site = require('../models/Site');
const Portfolio = require('../models/Portfolio');
const Template = require('../models/Template');

router.post('/sub-publish', auth, async (req, res) => {
  try {
    const { portfolioId, subdomain } = req.body;
    const userId = req.user._id;

    // ============================================
    // 1. VALIDATE SUBDOMAIN
    // ============================================

    if (!subdomain || subdomain.length < 3 || subdomain.length > 50) {
      return res.status(400).json({
        success: false,
        message: 'Subdomain must be between 3 and 50 characters'
      });
    }

    const subdomainRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!subdomainRegex.test(subdomain)) {
      return res.status(400).json({
        success: false,
        message: 'Subdomain can only contain lowercase letters, numbers, and hyphens'
      });
    }

    // Check if subdomain is available
    const existingSite = await Site.findOne({ subdomain });
    if (existingSite && existingSite.portfolioId.toString() !== portfolioId) {
      return res.status(409).json({
        success: false,
        message: 'This subdomain is already taken'
      });
    }

    // ============================================
    // 2. FETCH PORTFOLIO
    // ============================================

    const portfolio = await Portfolio.findOne({
      _id: portfolioId,
      userId: userId
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found or access denied'
      });
    }

    // ============================================
    // 3. FETCH TEMPLATE SCHEMA
    // ============================================

    const template = await Template.findOne({
      templateId: portfolio.template
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    // ============================================
    // 4. CREATE SITE SNAPSHOT
    // ============================================

    const siteData = {
      subdomain: subdomain.toLowerCase(),
      userId: userId,
      portfolioId: portfolioId,

      // Metadata
      metadata: {
        title: portfolio.title || 'Portfolio',
        description: portfolio.description || '',
        ownerName: req.user.name || '',
        ownerEmail: req.user.email || ''
      },

      // Template Snapshot
      template: {
        templateId: template.templateId,
        name: template.name,
        version: template.version,
        schema: template.schema // Full schema
      },

      // Portfolio Content Snapshot
      content: portfolio.content || {},

      // Styling
      styling: portfolio.styling || {},

      // Case Studies
      caseStudies: portfolio.caseStudies || [],

      // SEO
      seo: {
        title: portfolio.title || 'Portfolio',
        description: portfolio.description || '',
        image: portfolio.content?.hero?.backgroundImage || '',
        keywords: []
      },

      // Status
      isActive: true,
      publishedAt: new Date(),
      lastUpdated: new Date()
    };

    // ============================================
    // 5. CREATE OR UPDATE SITE
    // ============================================

    let site;
    if (existingSite && existingSite.portfolioId.toString() === portfolioId) {
      // Updating existing site
      site = await Site.findByIdAndUpdate(
        existingSite._id,
        siteData,
        { new: true, runValidators: true }
      );
    } else {
      // Creating new site
      site = new Site(siteData);
      await site.save();
    }

    // ============================================
    // 6. UPDATE PORTFOLIO
    // ============================================

    portfolio.isPublished = true;
    portfolio.subdomain = subdomain;
    portfolio.publishedAt = new Date();
    await portfolio.save();

    // ============================================
    // 7. RETURN SUCCESS
    // ============================================

    return res.status(200).json({
      success: true,
      message: 'Portfolio published successfully',
      data: {
        siteId: site._id,
        subdomain: site.subdomain,
        url: `https://aurea.tools/portfolio/${subdomain}`,
        publishedAt: site.publishedAt
      }
    });

  } catch (error) {
    console.error('Publish error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to publish portfolio',
      error: error.message
    });
  }
});
```

### 2. Retrieval Endpoint

```javascript
// GET /api/sites/:subdomain
// Retrieves a published site by subdomain

router.get('/:subdomain', async (req, res) => {
  try {
    const { subdomain } = req.params;

    // ============================================
    // 1. QUERY SITE
    // ============================================

    const site = await Site.findBySubdomain(subdomain);

    if (!site) {
      return res.status(404).json({
        success: false,
        message: 'Site not found'
      });
    }

    // ============================================
    // 2. INCREMENT VIEW COUNT (async, don't wait)
    // ============================================

    site.incrementViews().catch(err => {
      console.error('Failed to increment views:', err);
    });

    // ============================================
    // 3. RETURN COMPLETE DATA
    // ============================================

    return res.status(200).json({
      success: true,
      message: 'Site retrieved successfully',
      data: {
        subdomain: site.subdomain,
        metadata: site.metadata,
        template: site.template,
        content: site.content,
        styling: site.styling,
        caseStudies: site.caseStudies,
        seo: site.seo,
        publishedAt: site.publishedAt,
        viewCount: site.viewCount
      }
    });

  } catch (error) {
    console.error('Retrieval error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve site',
      error: error.message
    });
  }
});
```

### 3. Check Subdomain Availability

```javascript
// GET /api/sites/check/:subdomain
// Checks if a subdomain is available

router.get('/check/:subdomain', async (req, res) => {
  try {
    const { subdomain } = req.params;

    const isAvailable = await Site.isSubdomainAvailable(subdomain);

    return res.status(200).json({
      success: true,
      available: isAvailable,
      subdomain: subdomain
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to check subdomain',
      error: error.message
    });
  }
});
```

### 4. Unpublish Endpoint

```javascript
// DELETE /api/sites/unpublish/:portfolioId
// Unpublishes a site

router.delete('/unpublish/:portfolioId', auth, async (req, res) => {
  try {
    const { portfolioId } = req.params;
    const userId = req.user._id;

    // Find site
    const site = await Site.findOne({ portfolioId, userId });

    if (!site) {
      return res.status(404).json({
        success: false,
        message: 'Published site not found'
      });
    }

    // Deactivate site
    await site.deactivate();

    // Update portfolio
    const portfolio = await Portfolio.findById(portfolioId);
    if (portfolio) {
      portfolio.isPublished = false;
      portfolio.subdomain = null;
      await portfolio.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Site unpublished successfully'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to unpublish site',
      error: error.message
    });
  }
});
```

### 5. Get User's Published Sites

```javascript
// GET /api/sites/user/me
// Gets all published sites for the authenticated user

router.get('/user/me', auth, async (req, res) => {
  try {
    const sites = await Site.findUserSites(req.user._id);

    return res.status(200).json({
      success: true,
      message: 'Sites retrieved successfully',
      data: sites.map(site => ({
        siteId: site._id,
        subdomain: site.subdomain,
        title: site.metadata.title,
        url: `https://aurea.tools/portfolio/${site.subdomain}`,
        publishedAt: site.publishedAt,
        viewCount: site.viewCount,
        isActive: site.isActive
      }))
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve sites',
      error: error.message
    });
  }
});
```

---

## Migration Plan

### For Existing Published Portfolios

```javascript
// Migration script: scripts/migrate-published-sites.js

const Portfolio = require('../models/Portfolio');
const Template = require('../models/Template');
const Site = require('../models/Site');

async function migratePublishedPortfolios() {
  console.log('Starting migration of published portfolios...');

  // Find all published portfolios
  const publishedPortfolios = await Portfolio.find({
    isPublished: true,
    subdomain: { $exists: true, $ne: null }
  });

  console.log(`Found ${publishedPortfolios.length} published portfolios`);

  let migrated = 0;
  let failed = 0;

  for (const portfolio of publishedPortfolios) {
    try {
      // Check if site already exists
      const existingSite = await Site.findOne({
        portfolioId: portfolio._id
      });

      if (existingSite) {
        console.log(`Site already exists for portfolio ${portfolio._id}, skipping...`);
        continue;
      }

      // Get template
      const template = await Template.findOne({
        templateId: portfolio.template
      });

      if (!template) {
        console.error(`Template not found for portfolio ${portfolio._id}`);
        failed++;
        continue;
      }

      // Create site
      const site = new Site({
        subdomain: portfolio.subdomain,
        userId: portfolio.userId,
        portfolioId: portfolio._id,
        metadata: {
          title: portfolio.title || 'Portfolio',
          description: portfolio.description || ''
        },
        template: {
          templateId: template.templateId,
          name: template.name,
          version: template.version,
          schema: template.schema
        },
        content: portfolio.content || {},
        styling: portfolio.styling || {},
        caseStudies: portfolio.caseStudies || [],
        isActive: true,
        publishedAt: portfolio.publishedAt || new Date()
      });

      await site.save();
      migrated++;
      console.log(`✅ Migrated portfolio ${portfolio._id} to site ${site._id}`);

    } catch (error) {
      console.error(`❌ Failed to migrate portfolio ${portfolio._id}:`, error.message);
      failed++;
    }
  }

  console.log('\n=== Migration Complete ===');
  console.log(`Total: ${publishedPortfolios.length}`);
  console.log(`Migrated: ${migrated}`);
  console.log(`Failed: ${failed}`);
}

// Run migration
migratePublishedPortfolios()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
```

---

## Testing

### Test Cases

```javascript
// tests/sites.test.js

describe('Sites API', () => {

  describe('POST /api/sites/sub-publish', () => {
    it('should publish a portfolio with valid subdomain', async () => {
      const res = await request(app)
        .post('/api/sites/sub-publish')
        .set('Authorization', `Bearer ${token}`)
        .send({
          portfolioId: testPortfolio._id,
          subdomain: 'test-portfolio'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.subdomain).toBe('test-portfolio');
    });

    it('should reject invalid subdomain', async () => {
      const res = await request(app)
        .post('/api/sites/sub-publish')
        .set('Authorization', `Bearer ${token}`)
        .send({
          portfolioId: testPortfolio._id,
          subdomain: 'Test_Portfolio!'
        });

      expect(res.status).toBe(400);
    });

    it('should reject duplicate subdomain', async () => {
      // Publish first time
      await request(app)
        .post('/api/sites/sub-publish')
        .set('Authorization', `Bearer ${token}`)
        .send({
          portfolioId: testPortfolio._id,
          subdomain: 'duplicate-test'
        });

      // Try to publish with same subdomain (different portfolio)
      const res = await request(app)
        .post('/api/sites/sub-publish')
        .set('Authorization', `Bearer ${token2}`)
        .send({
          portfolioId: testPortfolio2._id,
          subdomain: 'duplicate-test'
        });

      expect(res.status).toBe(409);
    });

    it('should allow republishing with same subdomain', async () => {
      // Publish
      await request(app)
        .post('/api/sites/sub-publish')
        .set('Authorization', `Bearer ${token}`)
        .send({
          portfolioId: testPortfolio._id,
          subdomain: 'my-portfolio'
        });

      // Update and republish
      const res = await request(app)
        .post('/api/sites/sub-publish')
        .set('Authorization', `Bearer ${token}`)
        .send({
          portfolioId: testPortfolio._id,
          subdomain: 'my-portfolio'
        });

      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/sites/:subdomain', () => {
    beforeEach(async () => {
      // Publish a site
      await request(app)
        .post('/api/sites/sub-publish')
        .set('Authorization', `Bearer ${token}`)
        .send({
          portfolioId: testPortfolio._id,
          subdomain: 'test-site'
        });
    });

    it('should retrieve published site', async () => {
      const res = await request(app)
        .get('/api/sites/test-site');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.subdomain).toBe('test-site');
      expect(res.body.data.content).toBeDefined();
      expect(res.body.data.template).toBeDefined();
    });

    it('should return 404 for non-existent site', async () => {
      const res = await request(app)
        .get('/api/sites/non-existent');

      expect(res.status).toBe(404);
    });

    it('should increment view count', async () => {
      await request(app).get('/api/sites/test-site');
      await request(app).get('/api/sites/test-site');

      const site = await Site.findBySubdomain('test-site');
      expect(site.viewCount).toBeGreaterThanOrEqual(2);
    });
  });

  describe('DELETE /api/sites/unpublish/:portfolioId', () => {
    it('should unpublish a site', async () => {
      // Publish
      await request(app)
        .post('/api/sites/sub-publish')
        .set('Authorization', `Bearer ${token}`)
        .send({
          portfolioId: testPortfolio._id,
          subdomain: 'to-unpublish'
        });

      // Unpublish
      const res = await request(app)
        .delete(`/api/sites/unpublish/${testPortfolio._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);

      // Verify site is deactivated
      const site = await Site.findOne({ portfolioId: testPortfolio._id });
      expect(site.isActive).toBe(false);
    });
  });
});
```

---

## Performance Considerations

### 1. Caching

```javascript
// Add Redis caching for frequently accessed sites
const redis = require('redis');
const client = redis.createClient();

router.get('/:subdomain', async (req, res) => {
  const { subdomain } = req.params;
  const cacheKey = `site:${subdomain}`;

  // Check cache first
  const cached = await client.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }

  // Fetch from DB
  const site = await Site.findBySubdomain(subdomain);

  // Cache for 5 minutes
  await client.setex(cacheKey, 300, JSON.stringify(site));

  return res.json(site);
});
```

### 2. CDN for Static Assets

```javascript
// Store images in CDN
// Reference CDN URLs in content
content: {
  hero: {
    backgroundImage: "https://cdn.aurea.tools/images/abc123.jpg"
  }
}
```

### 3. Database Indexing

```sql
-- Ensure indexes are created
db.sites.createIndex({ subdomain: 1, isActive: 1 })
db.sites.createIndex({ userId: 1, isActive: 1 })
db.sites.createIndex({ portfolioId: 1 })
db.sites.createIndex({ publishedAt: -1 })
```

---

## Monitoring & Analytics

### Track Site Performance

```javascript
// Add to Site schema
SiteSchema.add({
  analytics: {
    viewCount: { type: Number, default: 0 },
    uniqueVisitors: { type: Number, default: 0 },
    lastViewed: Date,
    referrers: [{
      source: String,
      count: Number
    }],
    popularSections: [{
      sectionId: String,
      viewCount: Number
    }]
  }
});
```

### Logging

```javascript
// Log all publishing events
const logger = require('../utils/logger');

router.post('/sub-publish', auth, async (req, res) => {
  logger.info('Publishing site', {
    userId: req.user._id,
    portfolioId: req.body.portfolioId,
    subdomain: req.body.subdomain
  });

  // ... publish logic
});
```

---

## Security Considerations

### 1. Subdomain Validation

```javascript
// Prevent reserved subdomains
const RESERVED_SUBDOMAINS = [
  'www', 'api', 'admin', 'dashboard', 'app',
  'blog', 'mail', 'ftp', 'help', 'support',
  'about', 'terms', 'privacy', 'contact'
];

function validateSubdomain(subdomain) {
  if (RESERVED_SUBDOMAINS.includes(subdomain)) {
    throw new Error('This subdomain is reserved');
  }
  // ... other validation
}
```

### 2. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const publishLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 publishes per 15 minutes
  message: 'Too many publish requests, please try again later'
});

router.post('/sub-publish', publishLimiter, auth, async (req, res) => {
  // ... publish logic
});
```

### 3. Content Sanitization

```javascript
const sanitizeHtml = require('sanitize-html');

// Sanitize user content before storing
function sanitizeContent(content) {
  const sanitized = {};

  for (const [key, value] of Object.entries(content)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeHtml(value);
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeContent(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
```

---

## Deployment Checklist

- [ ] Create Site model with proper schema
- [ ] Add indexes to sites collection
- [ ] Implement publish endpoint (POST /api/sites/sub-publish)
- [ ] Implement retrieval endpoint (GET /api/sites/:subdomain)
- [ ] Implement check endpoint (GET /api/sites/check/:subdomain)
- [ ] Implement unpublish endpoint (DELETE /api/sites/unpublish/:portfolioId)
- [ ] Add validation for subdomains
- [ ] Add error handling
- [ ] Write tests for all endpoints
- [ ] Run migration script for existing portfolios
- [ ] Set up caching (Redis)
- [ ] Add monitoring/logging
- [ ] Configure rate limiting
- [ ] Update frontend to use new endpoints
- [ ] Test end-to-end flow
- [ ] Deploy to production

---

## Summary

This backend fix ensures:

✅ **Proper storage** - Sites collection with complete snapshots
✅ **Fast retrieval** - Denormalized data, no joins needed
✅ **Uniqueness** - Subdomain validation and unique indexes
✅ **Performance** - Caching, indexing, CDN
✅ **Security** - Validation, sanitization, rate limiting
✅ **Analytics** - View tracking, referrers
✅ **Scalability** - Schema supports millions of sites

Once implemented, published portfolios will be **immediately accessible** at `https://aurea.tools/portfolio/:subdomain` with **zero latency** and **complete data**.
