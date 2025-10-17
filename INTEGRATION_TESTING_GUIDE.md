# 🧪 Integration Testing Guide

**Date:** October 17, 2025  
**Purpose:** Step-by-step guide to test backend integration

---

## Prerequisites

### 1. Environment Setup

Make sure your `.env` file has the correct backend URL:

```env
VITE_API_BASE_URL=http://localhost:5000
# Or for production/staging:
# VITE_API_BASE_URL=https://your-backend-api.com
```

### 2. Backend Server Running

Ensure your backend server is running and accessible:

```bash
# Test backend connection
curl http://localhost:5000/api/health
# or
curl https://your-backend-api.com/api/health
```

### 3. Start Frontend Dev Server

```bash
npm run dev
```

---

## Test Scenarios

### ✅ Test 1: Profile Update

**Steps:**
1. Login to your account
2. Navigate to Profile page
3. Click "Edit" button
4. Update your information:
   - First Name: "John"
   - Last Name: "Doe"
   - Username: "johndoe123"
   - Email: "john.doe@example.com"
5. Click "Save" button

**Expected Results:**
- ✅ "Profile updated successfully!" toast appears
- ✅ Form exits edit mode
- ✅ Updated information is displayed
- ✅ Page doesn't reload

**Network Check (DevTools):**
- Request: `PATCH /api/users/profile`
- Headers: `Authorization: Bearer {token}`
- Body: JSON with firstName, lastName, username, email
- Response: `200 OK` with user data

---

### ✅ Test 2: Avatar Upload - Valid Image

**Steps:**
1. Go to Profile page (logged in)
2. Click "Choose File" button
3. Select a valid image:
   - Format: JPEG, PNG, GIF, or WebP
   - Size: < 5MB
4. Confirm file selection
5. Click "Save" button

**Expected Results:**
- ✅ Preview shows immediately after file selection
- ✅ "Avatar updated successfully!" toast appears
- ✅ Avatar displays Cloudinary URL
- ✅ Avatar persists after page refresh

**Network Check:**
- Request: `POST /api/users/avatar`
- Content-Type: `multipart/form-data`
- Response: `200 OK` with avatar URL

---

### ✅ Test 3: Avatar Upload - Invalid File Type

**Steps:**
1. Go to Profile page
2. Click "Choose File"
3. Try to select a PDF or other non-image file

**Expected Results:**
- ✅ Error toast: "Please select an image file"
- ✅ File is not uploaded
- ✅ No network request sent

---

### ✅ Test 4: Avatar Upload - File Too Large

**Steps:**
1. Go to Profile page
2. Click "Choose File"
3. Select an image larger than 5MB

**Expected Results:**
- ✅ Error toast: "File size must be less than 5MB"
- ✅ File is not uploaded
- ✅ No network request sent

---

### ✅ Test 5: Profile Update - Validation Errors

**Steps:**
1. Go to Profile page
2. Click "Edit"
3. Try to set username to an existing username
4. Or set email to an existing email
5. Click "Save"

**Expected Results:**
- ✅ Error toast displays field-specific error
- ✅ Input field shows red border
- ✅ Error message appears below field
- ✅ Form stays in edit mode

**Example Error Response:**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "username": "Username already in use"
  }
}
```

---

### ✅ Test 6: Portfolio Statistics

**Steps:**
1. Login to account
2. Navigate to Profile page
3. Check portfolio statistics section

**Current Behavior:**
- Counts calculated from full portfolio list
- Published vs unpublished projects shown

**Optional Enhancement (to implement):**
```jsx
// Add to ProfilePage.jsx useEffect:
const { fetchPortfolioStats, portfolioStats } = usePortfolioStore();

useEffect(() => {
  fetchPortfolioStats();
}, []);

// Use portfolioStats instead of calculating:
const totalProjects = portfolioStats?.totalPortfolios || 0;
const publishedProjects = portfolioStats?.publishedPortfolios || 0;
```

---

### ✅ Test 7: Cancel Edit Mode

**Steps:**
1. Go to Profile page
2. Click "Edit"
3. Make changes to form fields
4. Select a new avatar
5. Click "Cancel"

**Expected Results:**
- ✅ Form reverts to original values
- ✅ Avatar preview reverts to original
- ✅ Edit mode exits
- ✅ No API calls made

---

### ✅ Test 8: Session Expiration

**Steps:**
1. Login to account
2. Wait for token to expire (or manually delete token)
3. Try to update profile

**Expected Results:**
- ✅ API returns 401 Unauthorized
- ✅ User redirected to login page
- ✅ Error toast: "Session expired. Please login again."

---

### ✅ Test 9: Network Error Handling

**Steps:**
1. Go to Profile page
2. Disconnect from internet
3. Try to update profile or upload avatar

**Expected Results:**
- ✅ Error toast appears
- ✅ Form stays in edit mode
- ✅ User can retry after reconnecting

---

## Browser DevTools Checklist

### Network Tab

Check these requests are working:

- [ ] `GET /api/users/profile` - Get current user
- [ ] `PATCH /api/users/profile` - Update profile
- [ ] `POST /api/users/avatar` - Upload avatar
- [ ] `GET /api/portfolios/user/me` - Get portfolios
- [ ] `GET /api/portfolios/stats` - Get stats (optional)

### Console Tab

Look for:
- [ ] No JavaScript errors
- [ ] No 401/403/404 errors (unless expected)
- [ ] Proper success messages
- [ ] Debug logs showing correct flow

### Application Tab > Local Storage

Verify:
- [ ] `aurea_token` is stored
- [ ] `aurea_user` is stored and updated
- [ ] User avatar URL updates after upload

---

## API Response Validation

### Profile Update Response

```json
{
  "success": true,
  "data": {
    "id": "...",
    "username": "johndoe123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "avatar": "https://res.cloudinary.com/...",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "message": "Profile updated successfully"
}
```

### Avatar Upload Response

```json
{
  "success": true,
  "data": {
    "avatar": "https://res.cloudinary.com/.../avatar.jpg",
    "thumbnailUrl": "https://res.cloudinary.com/.../thumb.jpg"
  },
  "message": "Avatar uploaded successfully"
}
```

### Portfolio Stats Response

```json
{
  "success": true,
  "data": {
    "totalPortfolios": 10,
    "publishedPortfolios": 7,
    "unpublishedPortfolios": 3,
    "totalExports": 45,
    "storageUsed": 2684354560,
    "storageLimit": 10737418240
  }
}
```

---

## Common Issues & Solutions

### Issue: 401 Unauthorized on all requests

**Cause:** Token missing or expired

**Solution:**
1. Check localStorage for `aurea_token`
2. Try logging out and back in
3. Verify backend JWT_SECRET matches

### Issue: CORS errors

**Cause:** Backend CORS not configured for frontend URL

**Solution:**
1. Add frontend URL to backend CORS whitelist
2. Check `FRONTEND_URL` in backend .env
3. Restart backend server

### Issue: Avatar upload returns 413

**Cause:** File too large or backend limit exceeded

**Solution:**
1. Verify file is < 5MB
2. Check backend MAX_FILE_SIZE setting
3. Compress image before uploading

### Issue: Validation errors not displaying

**Cause:** Response format mismatch

**Solution:**
1. Check backend returns `details` object
2. Verify error structure matches:
   ```json
   {
     "success": false,
     "error": "Validation failed",
     "details": {
       "fieldName": "Error message"
     }
   }
   ```

### Issue: Avatar preview not updating

**Cause:** State not synchronized

**Solution:**
1. Check user state is updated after upload
2. Verify `user.avatar` field is populated
3. Check localStorage is updated

---

## Performance Testing

### Load Testing

Test with multiple users:
- 10 concurrent profile updates
- 5 concurrent avatar uploads
- Check response times stay < 2 seconds

### File Upload Testing

Test various file sizes:
- 100KB - should be instant
- 1MB - should complete in 1-2 seconds
- 5MB - should complete in 3-5 seconds

---

## Security Testing

### Authorization Testing

- [ ] Try to update another user's profile (should fail)
- [ ] Try API without token (should return 401)
- [ ] Try with expired token (should return 401)

### Input Validation

- [ ] Try SQL injection in username
- [ ] Try XSS in firstName/lastName
- [ ] Try invalid email formats
- [ ] Try extremely long strings

### File Upload Security

- [ ] Try uploading executable files
- [ ] Try uploading files with malicious content
- [ ] Try oversized files
- [ ] Verify uploaded files are scanned

---

## Deployment Checklist

Before deploying to production:

- [ ] Update `VITE_API_BASE_URL` to production URL
- [ ] Test all scenarios on staging
- [ ] Verify Cloudinary credentials are correct
- [ ] Check rate limiting is configured
- [ ] Monitor error logs for issues
- [ ] Test with real user accounts
- [ ] Verify SSL certificates are valid

---

## Success Criteria

All tests must pass:

✅ Profile updates work correctly  
✅ Avatar uploads complete successfully  
✅ Validation errors display properly  
✅ Error handling works as expected  
✅ No console errors  
✅ Network requests are optimized  
✅ UI updates reflect backend changes  
✅ Session management works correctly  

---

## Next Steps After Testing

1. ✅ Fix any bugs found during testing
2. ✅ Optimize performance if needed
3. ✅ Update user documentation
4. ✅ Deploy to staging environment
5. ✅ Conduct user acceptance testing
6. ✅ Deploy to production

---

**Happy Testing! 🎉**

For issues or questions, refer to:
- `FRONTEND_INTEGRATION_COMPLETE.md` - Implementation details
- `BACKEND_INTEGRATION.md` - API specifications
- `FRONTEND_INTEGRATION_SUMMARY.md` - Backend guide
