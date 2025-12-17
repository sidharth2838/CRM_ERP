# API Connection Troubleshooting Guide

## Issue: "Data saved to localStorage but not database. Check connection."

This error occurs when the Website Controller tries to save data to the database but the API call fails.

---

## Quick Diagnosis

### Step 1: Check Django Server Status

**Is Django running?**
```bash
# Terminal 1: Check if Django server is running
curl http://localhost:8000/api/

# Expected response: JSON with API endpoints
```

If Django is NOT running:
```bash
cd d:\CRM ERM\erp_backend
python manage.py runserver
```

### Step 2: Check API Endpoint Status

**Is the Website API endpoint accessible?**
```bash
# Terminal 2: Test the endpoint
curl http://localhost:8000/api/website/stories/

# Expected response: Empty list or data
```

If you get a 404 error, the endpoint might not be registered.

### Step 3: Check Browser Console

**What's the actual error?**
1. Open Website Controller in browser
2. Press **F12** to open Developer Tools
3. Click **Console** tab
4. Try adding a feature
5. Look for error messages starting with `[AXIOS]`

---

## Common Issues & Solutions

### Issue 1: "No response from server. Is Django running?"

**Problem**: Django backend is not running

**Solution**:
```bash
# Terminal: Start Django
cd "d:\CRM ERM\erp_backend"
python manage.py runserver
```

**Verify**:
```bash
curl http://localhost:8000/api/
# Should return JSON with endpoints
```

---

### Issue 2: "404 Not Found"

**Problem**: API endpoint doesn't exist or URL is wrong

**Solutions**:

a) **Check API URLs are registered**:
```bash
# In Django terminal, check URL patterns
python manage.py show_urls | grep website
# Should show:
# /api/website/stories/
# /api/website/save-all/
# etc.
```

b) **Verify views are imported**:
```python
# In erp_api/views.py, check imports:
from .serializers import (
    WebsiteStorySerializer,
    WebsiteTestimonialSerializer,
    # ... all serializers imported
)
```

c) **Clear Python cache**:
```bash
# Delete pycache
cd "d:\CRM ERM\erp_backend"
Get-ChildItem -Recurse -Filter "__pycache__" -Directory | Remove-Item -Recurse -Force
```

d) **Restart Django**:
```bash
# Kill Django and restart
python manage.py runserver
```

---

### Issue 3: "500 Internal Server Error"

**Problem**: Django has an error in the API code

**Solution**:

a) **Check Django console for error messages**
   - Look at the terminal where Django is running
   - Scroll up to see full error traceback

b) **Common causes**:
   - Serializer not imported in views.py
   - Model not migrated to database
   - Invalid field names

c) **Fix the issue**:
   - Check `erp_api/views.py` for import errors
   - Run migrations: `python manage.py migrate`
   - Restart Django

---

### Issue 4: "Connection refused"

**Problem**: Frontend can't reach backend at localhost:8000

**Solutions**:

a) **Check port 8000 is not in use**:
```bash
netstat -ano | findstr :8000
# If something is using it, stop that process
taskkill /PID <PID> /F
```

b) **Check Vite proxy configuration**:
```javascript
// frontend/vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '/api'),
    },
  },
},
```

c) **Restart frontend dev server**:
```bash
cd "d:\CRM ERM\frontend"
npm run dev
# Access on http://localhost:3000
```

---

### Issue 5: "CORS Error"

**Problem**: Cross-Origin Resource Sharing blocked the request

**Solution**:

Verify CORS is enabled in Django:
```python
# erp_backend/settings.py
INSTALLED_APPS = [
    'corsheaders',  # ✓ Should be here
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # ✓ Should be first
]

CORS_ALLOW_ALL_ORIGINS = True  # ✓ Should be True
```

---

## Diagnostic Checklist

Run through these checks in order:

- [ ] **Django Running?** 
  ```bash
  curl http://localhost:8000/api/
  ```

- [ ] **Port 8000 free?**
  ```bash
  netstat -ano | findstr :8000
  ```

- [ ] **Website endpoint exists?**
  ```bash
  curl http://localhost:8000/api/website/stories/
  ```

- [ ] **Frontend running?**
  - Access http://localhost:3000 in browser
  - Check no 404 errors

- [ ] **API serializers imported?**
  ```bash
  grep "WebsiteStorySerializer" "d:\CRM ERM\erp_backend\erp_api\views.py"
  ```

- [ ] **Database migrated?**
  ```bash
  python manage.py migrate
  ```

- [ ] **CORS enabled?**
  ```bash
  grep "CORS_ALLOW_ALL_ORIGINS" "d:\CRM ERM\erp_backend\erp_backend\settings.py"
  ```

---

## Complete Test Sequence

### Terminal 1: Start Django Backend
```bash
cd "d:\CRM ERM\erp_backend"
python manage.py runserver
```

**Expected output**:
```
Starting development server at http://127.0.0.1:8000/
```

### Terminal 2: Test API Endpoint
```bash
curl -X POST http://localhost:8000/api/website/save-all/ ^
  -H "Content-Type: application/json" ^
  -d "{\"stories\": [], \"testimonials\": []}"
```

**Expected response**:
```json
{
  "message": "All website data saved successfully to database"
}
```

### Terminal 3: Start Frontend
```bash
cd "d:\CRM ERM\frontend"
npm run dev
```

**Expected output**:
```
  ➜  Local:   http://localhost:3000/
```

### Browser: Test Website Controller
1. Navigate to http://localhost:3000/admin/website-controller
2. Open Developer Tools (F12)
3. Click Console tab
4. Add a feature
5. Check console for `[AXIOS]` messages

**Expected console messages**:
```
[AXIOS] POST /api/website/save-all/
[AXIOS] Response 200 from /api/website/save-all/
✅ Data saved to database successfully!
```

---

## Browser DevTools Debugging

### Step 1: Open Network Tab
1. Press **F12**
2. Click **Network** tab
3. Reload page
4. Add a feature in Website Controller

### Step 2: Look for API Request
- Find request named: `save-all/`
- Check **Status**: Should be 200
- Check **Response**: Should show success message
- Check **Headers**: Should have `Content-Type: application/json`

### Step 3: Check Request Payload
- Click **Payload** tab
- Should show your website data being sent

### Step 4: Check Response
- Click **Response** tab
- Should show: `{"message": "All website data saved successfully to database"}`

---

## Complete Server Status Check

### Check Everything is Running

```powershell
# Terminal 1: Check Django
curl http://localhost:8000/api/ -UseBasicParsing | Select-Object StatusCode

# Terminal 2: Check Frontend
curl http://localhost:3000/ -UseBasicParsing | Select-Object StatusCode

# Terminal 3: Check API Endpoint
curl http://localhost:8000/api/website/stories/ -UseBasicParsing | Select-Object StatusCode
```

All should return **200** status code.

---

## If Still Having Issues

### Enable Verbose Logging

**In FrontPageEditor.jsx**, the updated saveToLocalStorage function now logs:
- Request being sent
- Full error object
- Response status and data
- Specific error reasons

**Check console for messages like**:
```
[AXIOS] POST /api/website/save-all/
[AXIOS] Response 200 from /api/website/save-all/
Saved to database: {message: "..."}
```

### Check API Response Format

The endpoint should return:
```json
{
  "message": "All website data saved successfully to database"
}
```

If it returns something different, the API endpoint implementation might be wrong.

---

## Quick Fix Summary

| Error | Quick Fix |
|-------|-----------|
| No response | Start Django: `python manage.py runserver` |
| 404 Not Found | Migrate database: `python manage.py migrate` |
| 500 Error | Check Django console, fix syntax errors |
| CORS Error | Verify `CORS_ALLOW_ALL_ORIGINS = True` in settings |
| Connection refused | Check port 8000 is free, restart Django |
| Empty response | Check API returns correct JSON format |

---

## Testing the API Directly

### Test 1: Stories Endpoint
```bash
curl http://localhost:8000/api/website/stories/ -UseBasicParsing
```

### Test 2: Bulk Save Endpoint
```powershell
$body = @{
    stories = @()
    testimonials = @()
    gallery = @()
    faqs = @()
    partners = @()
    heroSection = @{}
    newsletter = @{}
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8000/api/website/save-all/" `
  -Method POST `
  -Body $body `
  -Headers @{"Content-Type"="application/json"} `
  -UseBasicParsing
```

### Test 3: Full Data Save
```powershell
$body = @{
    stories = @(@{
        id = 1
        title = "Test Story"
        excerpt = "Test excerpt"
        author = "Test Author"
        image = ""
    })
    testimonials = @()
    gallery = @()
    faqs = @()
    partners = @()
    heroSection = @{
        title = "Welcome"
        subtitle = "Test"
        image = ""
        cta_text = "Explore"
    }
    newsletter = @{
        title = "Subscribe"
        description = ""
        placeholder = "Email"
    }
} | ConvertTo-Json -Depth 10

Invoke-WebRequest -Uri "http://localhost:8000/api/website/save-all/" `
  -Method POST `
  -Body $body `
  -Headers @{"Content-Type"="application/json"} `
  -UseBasicParsing
```

---

## Still Not Working?

If you've checked everything above and it still doesn't work:

1. **Post the exact error message** from browser console
2. **Provide Django console output** (where runserver is running)
3. **Check Network tab** in browser DevTools
4. **Verify all services are running**:
   - Django backend on port 8000
   - Frontend dev server on port 3000
   - Database connection is working

---

**Version**: 1.0  
**Last Updated**: December 11, 2025
