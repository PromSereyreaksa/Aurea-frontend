# Backend Integration Documentation

## Overview

This document outlines all frontend changes requiring backend integration for the AUREA platform modern redesign. It provides API specifications, data structures, and implementation requirements for backend developers.

**Last Updated:** October 16, 2025  
**Frontend Branch:** landing-v1.01  
**Related Documentation:** See `UPDATES.md` for complete frontend changes

---

## Table of Contents

1. [Authentication & User Management](#authentication--user-management)
2. [Portfolio Management](#portfolio-management)
3. [Avatar Upload](#avatar-upload)
4. [API Endpoints Required](#api-endpoints-required)
5. [Data Models](#data-models)
6. [State Management Integration](#state-management-integration)
7. [Error Handling](#error-handling)
8. [Security Considerations](#security-considerations)
9. [Testing Requirements](#testing-requirements)

---

## Authentication & User Management

### Current Implementation

The frontend uses Zustand store (`useAuthStore`) for authentication state management.

**Store Location:** `src/stores/authStore.js` (or similar)

**Current User Object Structure:**

```javascript
{
  id: string,
  username: string,
  firstName: string,
  lastName: string,
  email: string,
  avatar: string | null,
  createdAt: string (ISO date),
  // Additional fields as needed
}
```

### Profile Update Requirements

**Frontend Implementation:**

- **Component:** `ProfilePage.jsx`
- **Function:** `updateProfile()` from `useAuthStore`
- **User Action:** Edit and save profile information

**Expected Behavior:**

```javascript
// Frontend call
const { updateProfile } = useAuthStore();
await updateProfile({
  firstName: "John",
  lastName: "Doe",
  username: "johndoe",
  email: "john@example.com",
});
```

**Backend Requirements:**

#### Endpoint: Update User Profile

```
PATCH /api/users/profile
or
PUT /api/users/{userId}
```

**Request Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "firstName": "string",
  "lastName": "string",
  "username": "string",
  "email": "string"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "avatar": "https://cdn.example.com/avatars/user-123.jpg",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "Profile updated successfully"
}
```

**Error Responses:**

```json
// 400 Bad Request - Validation error
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "email": "Email already in use",
    "username": "Username must be at least 3 characters"
  }
}

// 401 Unauthorized
{
  "success": false,
  "error": "Authentication required"
}

// 409 Conflict - Duplicate username/email
{
  "success": false,
  "error": "Username or email already exists"
}
```

**Validation Rules:**

- `firstName`: Required, 1-50 characters, alphanumeric + spaces
- `lastName`: Required, 1-50 characters, alphanumeric + spaces
- `username`: Required, 3-30 characters, alphanumeric + underscores, unique
- `email`: Required, valid email format, unique

---

## Portfolio Management

### Current Implementation

The frontend uses `usePortfolioStore` to manage portfolio data.

**Store Location:** `src/stores/portfolioStore.js` (or similar)

**Portfolio Object Structure:**

```javascript
{
  id: string,
  title: string,
  description: string,
  published: boolean,
  createdAt: string,
  updatedAt: string,
  // Additional fields
}
```

### Portfolio Statistics

**Frontend Implementation:**

- **Component:** `ProfilePage.jsx`
- **Function:** `fetchUserPortfolios()` from `usePortfolioStore`
- **Display:** Shows count of published vs unpublished projects

**Frontend Calculation:**

```javascript
const { portfolios, fetchUserPortfolios } = usePortfolioStore();

useEffect(() => {
  fetchUserPortfolios();
}, []);

const publishedCount = portfolios.filter((p) => p.published).length;
const unpublishedCount = portfolios.filter((p) => !p.published).length;
```

**Backend Requirements:**

#### Endpoint: Get User Portfolios

```
GET /api/portfolios
or
GET /api/users/{userId}/portfolios
```

**Request Headers:**

```
Authorization: Bearer {token}
```

**Query Parameters (Optional):**

```
?published=true    // Filter by published status
?limit=50         // Pagination
?offset=0         // Pagination
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "portfolio-123",
      "title": "My Portfolio",
      "description": "Portfolio description",
      "published": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-02-20T14:45:00Z",
      "exportCount": 15,
      "showcased": true
    }
  ],
  "meta": {
    "total": 10,
    "published": 7,
    "unpublished": 3,
    "limit": 50,
    "offset": 0
  }
}
```

**Alternative: Statistics Endpoint**
If the list endpoint becomes too heavy, consider adding a statistics-only endpoint:

```
GET /api/portfolios/stats
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "totalPortfolios": 10,
    "publishedPortfolios": 7,
    "unpublishedPortfolios": 3,
    "totalExports": 45,
    "storageUsed": "2.5 GB",
    "storageLimit": "10 GB"
  }
}
```

---

## Avatar Upload

### Current Implementation

**Component:** `ProfilePage.jsx`  
**Status:** UI ready, backend integration pending (TODO in code)

**Frontend Code (Line ~40 in ProfilePage.jsx):**

```javascript
const handleAvatarChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (e.g., 5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));

    // TODO: Upload to backend
    // handleAvatarUpload(file);
  }
};
```

**Backend Requirements:**

#### Endpoint: Upload Avatar

```
POST /api/users/avatar
or
POST /api/users/{userId}/avatar
```

**Request Headers:**

```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body:**

```
FormData:
  avatar: File (image file)
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "avatar": "https://cdn.example.com/avatars/user-123-1634567890.jpg",
    "thumbnailUrl": "https://cdn.example.com/avatars/user-123-1634567890-thumb.jpg"
  },
  "message": "Avatar uploaded successfully"
}
```

**File Constraints:**

- **Accepted Formats:** JPEG, PNG, GIF
- **Max File Size:** 5MB
- **Recommended Dimensions:** 400x400px
- **Processing:** Server should resize/crop to square, generate thumbnail

**Storage Recommendations:**

- Use cloud storage (AWS S3, Azure Blob, etc.)
- Generate unique filenames (user-id + timestamp)
- Keep previous avatars for rollback (optional)
- Implement CDN for fast delivery

**Frontend Integration Code:**

```javascript
const handleAvatarUpload = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  try {
    const response = await fetch("/api/users/avatar", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      // Update user avatar in store
      useAuthStore.setState({
        user: { ...user, avatar: result.data.avatar },
      });
    }
  } catch (error) {
    console.error("Avatar upload failed:", error);
  }
};
```

---

## API Endpoints Required

### Summary Table

| Endpoint                | Method | Purpose                  | Priority | Status       |
| ----------------------- | ------ | ------------------------ | -------- | ------------ |
| `/api/users/profile`    | PATCH  | Update user profile      | High     | **Required** |
| `/api/users/avatar`     | POST   | Upload avatar image      | High     | **Required** |
| `/api/portfolios`       | GET    | Get user portfolios      | High     | **Required** |
| `/api/portfolios/stats` | GET    | Get portfolio statistics | Medium   | Optional     |
| `/api/users/account`    | DELETE | Delete user account      | Medium   | Future       |
| `/api/users/password`   | PUT    | Change password          | Medium   | Future       |

### Detailed Specifications

#### 1. Update Profile

```
PATCH /api/users/profile
```

See [Profile Update Requirements](#profile-update-requirements)

#### 2. Upload Avatar

```
POST /api/users/avatar
```

See [Avatar Upload](#avatar-upload)

#### 3. Get Portfolios

```
GET /api/portfolios
```

See [Portfolio Management](#portfolio-management)

#### 4. Portfolio Statistics (Optional)

```
GET /api/portfolios/stats
```

**Purpose:** Optimize performance by returning only statistics without full portfolio list

**Response:**

```json
{
  "success": true,
  "data": {
    "totalPortfolios": 10,
    "publishedPortfolios": 7,
    "unpublishedPortfolios": 3,
    "totalExports": 45,
    "storageUsed": 2684354560, // bytes
    "storageLimit": 10737418240 // bytes (10GB)
  }
}
```

#### 5. Delete Account (Future Enhancement)

```
DELETE /api/users/account
```

**Purpose:** Allow users to delete their account

**Request Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "password": "string", // Confirm with password
  "confirmation": "DELETE MY ACCOUNT"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Account deletion scheduled. You will receive a confirmation email."
}
```

#### 6. Change Password (Future Enhancement)

```
PUT /api/users/password
```

**Purpose:** Allow users to change their password

**Request Body:**

```json
{
  "currentPassword": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

---

## Data Models

### User Model

```typescript
interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  createdAt: string; // ISO 8601 date
  updatedAt: string; // ISO 8601 date
  emailVerified: boolean;
  role: "user" | "admin";
  subscription?: {
    plan: "free" | "pro" | "enterprise";
    expiresAt: string;
  };
  storage?: {
    used: number; // bytes
    limit: number; // bytes
  };
}
```

### Portfolio Model

```typescript
interface Portfolio {
  id: string;
  userId: string;
  title: string;
  description: string;
  published: boolean;
  showcased: boolean; // Featured on profile
  createdAt: string;
  updatedAt: string;
  exportCount: number;
  viewCount: number;
  templateId?: string;
  customDomain?: string;
  metadata?: {
    theme: string;
    colors: object;
    layout: string;
  };
}
```

### API Response Wrapper

```typescript
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: Record<string, string>; // Validation errors
  message?: string;
  meta?: {
    timestamp: string;
    requestId: string;
    [key: string]: any;
  };
}
```

---

## State Management Integration

### Frontend Store Structure

#### authStore.js

```javascript
import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: async (credentials) => {
    // Login implementation
  },

  logout: () => {
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateProfile: async (data) => {
    try {
      const token = get().token;
      const response = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        set({ user: result.data });
        return { success: true };
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      return { success: false, error: error.message };
    }
  },
}));
```

#### portfolioStore.js

```javascript
import { create } from "zustand";

export const usePortfolioStore = create((set, get) => ({
  portfolios: [],
  loading: false,
  error: null,

  fetchUserPortfolios: async () => {
    set({ loading: true, error: null });

    try {
      const token = useAuthStore.getState().token;
      const response = await fetch("/api/portfolios", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        set({ portfolios: result.data, loading: false });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
```

---

## Error Handling

### HTTP Status Codes

Backend should use standard HTTP status codes:

- **200 OK** - Successful request
- **201 Created** - Resource created successfully
- **400 Bad Request** - Validation error or malformed request
- **401 Unauthorized** - Missing or invalid authentication
- **403 Forbidden** - Authenticated but not authorized
- **404 Not Found** - Resource not found
- **409 Conflict** - Duplicate resource (username/email)
- **413 Payload Too Large** - File size exceeds limit
- **422 Unprocessable Entity** - Semantic error in request
- **429 Too Many Requests** - Rate limit exceeded
- **500 Internal Server Error** - Server error

### Error Response Format

All errors should follow this structure:

```json
{
  "success": false,
  "error": "Human-readable error message",
  "code": "ERROR_CODE_CONSTANT",
  "details": {
    "field1": "Specific validation error",
    "field2": "Another validation error"
  },
  "timestamp": "2024-10-16T10:30:00Z",
  "requestId": "req-123-456"
}
```

### Frontend Error Handling

```javascript
try {
  const response = await updateProfile(formData);

  if (response.success) {
    // Show success message
    showToast("Profile updated successfully", "success");
  } else {
    // Handle validation errors
    if (response.details) {
      Object.entries(response.details).forEach(([field, message]) => {
        setFieldError(field, message);
      });
    } else {
      showToast(response.error || "Update failed", "error");
    }
  }
} catch (error) {
  // Network or unexpected errors
  showToast("Connection error. Please try again.", "error");
  console.error(error);
}
```

---

## Security Considerations

### Authentication

- All endpoints require Bearer token authentication
- Tokens should be JWT with expiration
- Implement token refresh mechanism
- Store tokens securely (httpOnly cookies recommended)

### Authorization

- Users can only modify their own profile
- Validate userId from token matches requested resource
- Implement role-based access control (RBAC) if needed

### Input Validation

- **Server-side validation required** for all inputs
- Sanitize inputs to prevent XSS attacks
- Use parameterized queries to prevent SQL injection
- Validate file types and sizes on server

### File Upload Security

- Verify file MIME types on server (don't trust client)
- Scan uploaded files for malware
- Store files outside web root or use cloud storage
- Generate unique filenames (prevent overwriting)
- Implement file size limits
- Use signed URLs for temporary access

### Rate Limiting

Implement rate limits to prevent abuse:

- **Profile Updates:** 10 requests per minute per user
- **Avatar Upload:** 5 requests per hour per user
- **Portfolio Fetch:** 100 requests per minute per user

### Data Privacy

- Hash passwords with bcrypt (salt rounds ≥ 10)
- Don't expose sensitive data in API responses
- Implement GDPR compliance for data deletion
- Log access to sensitive data

### CORS Configuration

```javascript
// Allow frontend domain
Access-Control-Allow-Origin: https://aurea.example.com
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Allow-Credentials: true
```

---

## Testing Requirements

### Unit Tests

Backend should include tests for:

1. **Profile Update**

   - Valid data updates successfully
   - Invalid email format rejected
   - Duplicate username/email rejected
   - Required fields validated
   - Unauthorized requests rejected

2. **Avatar Upload**

   - Valid image uploads successfully
   - Invalid file types rejected
   - Oversized files rejected
   - Authenticated upload only

3. **Portfolio Fetch**
   - Returns user's portfolios only
   - Filters by published status work
   - Pagination works correctly
   - Empty results handled

### Integration Tests

- End-to-end profile update flow
- Avatar upload and retrieval flow
- Portfolio statistics calculation
- Authentication and authorization

### Performance Tests

- Profile update: < 200ms response time
- Avatar upload: < 2s for 5MB file
- Portfolio fetch: < 300ms for 100 portfolios
- Concurrent users: Support 1000+ simultaneous requests

### Security Tests

- SQL injection prevention
- XSS attack prevention
- CSRF protection
- File upload exploits
- Unauthorized access attempts

---

## API Testing Examples

### Using cURL

#### Update Profile

```bash
curl -X PATCH https://api.aurea.example.com/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "email": "john@example.com"
  }'
```

#### Upload Avatar

```bash
curl -X POST https://api.aurea.example.com/api/users/avatar \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "avatar=@/path/to/image.jpg"
```

#### Get Portfolios

```bash
curl -X GET https://api.aurea.example.com/api/portfolios \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

Import this collection:

```json
{
  "info": {
    "name": "AUREA API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Update Profile",
      "request": {
        "method": "PATCH",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"firstName\": \"John\",\n  \"lastName\": \"Doe\",\n  \"username\": \"johndoe\",\n  \"email\": \"john@example.com\"\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "{{baseUrl}}/api/users/profile",
          "host": ["{{baseUrl}}"],
          "path": ["api", "users", "profile"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "https://api.aurea.example.com"
    },
    {
      "key": "token",
      "value": "YOUR_TOKEN_HERE"
    }
  ]
}
```

---

## Migration Checklist

### Backend Implementation Steps

- [ ] **Phase 1: Profile Management** (High Priority)

  - [ ] Create/update User model with required fields
  - [ ] Implement PATCH `/api/users/profile` endpoint
  - [ ] Add validation for firstName, lastName, username, email
  - [ ] Implement duplicate username/email checking
  - [ ] Add unit tests for profile updates
  - [ ] Deploy to staging environment

- [ ] **Phase 2: Avatar Upload** (High Priority)

  - [ ] Set up cloud storage (S3/Azure Blob)
  - [ ] Implement POST `/api/users/avatar` endpoint
  - [ ] Add image validation and processing
  - [ ] Generate thumbnails
  - [ ] Implement CDN delivery
  - [ ] Add file upload tests
  - [ ] Deploy to staging environment

- [ ] **Phase 3: Portfolio Statistics** (High Priority)

  - [ ] Create/update Portfolio model
  - [ ] Implement GET `/api/portfolios` endpoint
  - [ ] Add published status filtering
  - [ ] Implement pagination
  - [ ] Consider adding `/api/portfolios/stats` for optimization
  - [ ] Add portfolio tests
  - [ ] Deploy to staging environment

- [ ] **Phase 4: Security & Performance** (Medium Priority)

  - [ ] Implement rate limiting
  - [ ] Add request logging
  - [ ] Set up monitoring and alerts
  - [ ] Optimize database queries
  - [ ] Add caching for frequently accessed data
  - [ ] Security audit

- [ ] **Phase 5: Future Enhancements** (Low Priority)
  - [ ] Implement DELETE `/api/users/account`
  - [ ] Implement PUT `/api/users/password`
  - [ ] Add email verification flow
  - [ ] Implement 2FA (two-factor authentication)

### Frontend Integration Steps

- [x] Create modern ProfilePage UI
- [x] Add form state management
- [x] Implement avatar preview
- [x] Connect portfolio statistics
- [ ] **Complete avatar upload integration** (TODO in code)
- [ ] Add error handling and user feedback
- [ ] Implement loading states
- [ ] Add form validation
- [ ] Test with staging backend
- [ ] Deploy to production

---

## Environment Variables

### Backend Required

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/aurea

# JWT Authentication
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=24h
JWT_REFRESH_EXPIRATION=7d

# Cloud Storage (AWS S3 example)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=aurea-avatars

# Or Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=your-connection-string
AZURE_STORAGE_CONTAINER=avatars

# Application
API_URL=https://api.aurea.example.com
CDN_URL=https://cdn.aurea.example.com
FRONTEND_URL=https://aurea.example.com

# Rate Limiting
RATE_LIMIT_WINDOW=60000  # 1 minute in ms
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=5242880  # 5MB in bytes
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/gif
```

### Frontend Required

```env
VITE_API_URL=https://api.aurea.example.com
VITE_CDN_URL=https://cdn.aurea.example.com
```

---

## Support & Contact

### Documentation

- **Frontend Changes:** See `UPDATES.md`
- **API Specs:** This document
- **Deployment:** Contact DevOps team

### Team Contacts

- **Frontend Lead:** [Contact Info]
- **Backend Lead:** [Contact Info]
- **DevOps:** [Contact Info]

### Issue Reporting

- Create tickets in project management system
- Tag with `backend-integration` label
- Include frontend component name and expected behavior

---

## Appendix

### Common Issues & Solutions

**Issue:** Profile update returns 409 Conflict  
**Solution:** Username or email already exists. Frontend should display specific field error.

**Issue:** Avatar upload returns 413 Payload Too Large  
**Solution:** File exceeds 5MB. Frontend validates before upload but backend must also enforce.

**Issue:** Portfolio statistics don't match  
**Solution:** Ensure frontend filters `published` field correctly. Backend should return accurate counts.

**Issue:** Unauthorized errors  
**Solution:** Check token expiration. Implement automatic token refresh on frontend.

### Database Schema Examples

#### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(30) UNIQUE NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  role VARCHAR(20) DEFAULT 'user',
  storage_used BIGINT DEFAULT 0,
  storage_limit BIGINT DEFAULT 10737418240,  -- 10GB
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
```

#### Portfolios Table

```sql
CREATE TABLE portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  published BOOLEAN DEFAULT FALSE,
  showcased BOOLEAN DEFAULT FALSE,
  export_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  template_id UUID,
  custom_domain VARCHAR(255),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX idx_portfolios_published ON portfolios(published);
```

---

**End of Document**

For questions or clarifications, please contact the frontend development team.
