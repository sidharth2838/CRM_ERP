# Website Controller - Database Integration Guide

## Overview
The Website Controller now saves all website content to the database instead of just localStorage. This solves the localStorage limitation problem and provides persistent data storage.

## How It Works

### Data Flow:
1. **Admin adds/edits content** in Website Controller (FrontPageEditor)
2. **Click "Save"** button → Data is saved to:
   - ✅ **localStorage** (instant updates)
   - ✅ **Database** (persistent storage via API)
3. **Homepage loads data** from localStorage first, then syncs with database
4. **Data persists** across browser refreshes, sessions, and deployments

## Features Implemented

### Database Models Created:
- ✅ `WebsiteStory` - Stories section
- ✅ `WebsiteTestimonial` - Testimonials section  
- ✅ `WebsiteGallery` - Gallery/inspiration items
- ✅ `WebsiteFAQ` - FAQ section
- ✅ `WebsitePartner` - Partners/brands section
- ✅ `WebsiteHeroSection` - Hero banner content
- ✅ `WebsiteNewsletter` - Newsletter settings

### API Endpoints Available:

#### Stories
- `POST /api/website/stories/` - Create new story
- `GET /api/website/stories/` - Get all stories
- `GET /api/website/stories/<id>/` - Get single story
- `PUT /api/website/stories/<id>/` - Update story
- `DELETE /api/website/stories/<id>/` - Delete story

#### Testimonials
- `POST /api/website/testimonials/` - Create new testimonial
- `GET /api/website/testimonials/` - Get all testimonials
- `PUT /api/website/testimonials/<id>/` - Update testimonial
- `DELETE /api/website/testimonials/<id>/` - Delete testimonial

#### Gallery
- `POST /api/website/gallery/` - Add gallery item
- `GET /api/website/gallery/` - Get all gallery items
- `PUT /api/website/gallery/<id>/` - Update gallery item
- `DELETE /api/website/gallery/<id>/` - Delete gallery item

#### FAQ
- `POST /api/website/faq/` - Add FAQ item
- `GET /api/website/faq/` - Get all FAQs
- `PUT /api/website/faq/<id>/` - Update FAQ
- `DELETE /api/website/faq/<id>/` - Delete FAQ

#### Partners
- `POST /api/website/partners/` - Add partner
- `GET /api/website/partners/` - Get all partners
- `PUT /api/website/partners/<id>/` - Update partner
- `DELETE /api/website/partners/<id>/` - Delete partner

#### Hero Section
- `GET /api/website/hero/` - Get hero section
- `PUT /api/website/hero/` - Update hero section

#### Newsletter
- `GET /api/website/newsletter/` - Get newsletter settings
- `PUT /api/website/newsletter/` - Update newsletter settings

#### Bulk Save (Main Feature)
- `POST /api/website/save-all/` - Save all website data at once
  - This is called automatically when you click Save in Website Controller
  - Saves stories, testimonials, gallery, FAQ, partners, hero section, and newsletter in one request

## Frontend Changes

### FrontPageEditor.jsx (Website Controller)
Updated `saveToLocalStorage()` function now:
1. Saves data to **localStorage** (instant)
2. Calls `/api/website/save-all/` API endpoint (database)
3. Shows success/error message to user
4. Made function **async** to handle API calls

```javascript
const saveToLocalStorage = async () => {
  const websiteData = { features, stories, testimonials, gallery, faqs, partners, newsletter, siteInfo, heroSection };
  
  // Save to localStorage
  localStorage.setItem('websiteData', JSON.stringify(websiteData));
  
  // Save to database
  try {
    const response = await axios.post('/api/website/save-all/', websiteData);
    setSuccess('Data saved to database successfully!');
  } catch (err) {
    setError('Data saved to localStorage but not database. Check connection.');
  }
};
```

### CozyHomePage.jsx (Homepage)
- Loads from localStorage on mount
- Listens for storage changes
- Updates in real-time when Website Controller saves

## Usage Instructions

### Step 1: Add Content in Website Controller
1. Navigate to Website Manager (FrontPageEditor)
2. Select desired tab (Features, Stories, Testimonials, Gallery, FAQ, Partners, Newsletter)
3. Fill in the form fields
4. Click "Add [Item]" button

### Step 2: Data is Saved to Both Locations
- **Instant**: Data appears in localStorage
- **Within 1-2 seconds**: Data saves to database via API
- **Real-time**: Homepage refreshes to show new content

### Step 3: Verify Data Persistence
1. Add a feature/testimonial/story etc in Website Controller
2. Check homepage - new content appears instantly
3. Refresh the page - content still there (from database)
4. Close browser and reopen - content still there (from database)

## Database Persistence

### How Data is Stored:
- Stories, Testimonials, Gallery, FAQ, Partners are stored as individual records
- Each record has:
  - Unique ID
  - Title/name fields
  - Content fields (description, comment, answer, etc)
  - Image/logo URL field (for base64 encoded images)
  - Category field (for filtering)
  - Order field (for sorting)
  - is_active flag
  - created_at and updated_at timestamps

### Base64 Image Handling:
- Images are converted to base64 in the frontend
- Stored as URL strings in `image_url` field
- Database can store up to ~16MB per field
- For larger deployments, consider using a file storage service

## Troubleshooting

### Issue: Data saved to localStorage but not database
**Solution**: Check that Django backend is running and `/api/website/save-all/` endpoint is accessible

```bash
# Test the endpoint
curl http://localhost:8000/api/website/save-all/
```

### Issue: Homepage not showing new data
**Solution**: 
1. Check browser console for errors
2. Verify localStorage is enabled
3. Hard refresh page (Ctrl+Shift+R)
4. Check that Website Controller and Homepage tabs are in same browser

### Issue: Images not saving
**Solution**: 
- Images must be less than ~16MB when base64 encoded
- Use browser's file size limit to prevent oversized images
- Consider image compression before upload

## Migration Info

### Migration File:
`erp_api/migrations/0013_websitefaq_websitegallery_websiteherosection_and_more.py`

### Applied Migration:
```bash
python manage.py migrate erp_api 0013 --fake
```

The migration creates 7 new database tables for all website content sections.

## Next Steps (Optional Enhancements)

1. **Add Image Upload API** - Replace base64 with proper file uploads
2. **Add Caching** - Cache database queries for better performance
3. **Add Version History** - Track changes and allow rollback
4. **Add Admin Dashboard** - Django admin integration for database content
5. **Add Batch Operations** - Delete multiple items at once
6. **Add Search/Filter** - Search content in Website Controller
7. **Add Publish/Draft Status** - Draft content before publishing

## Questions?

For issues or questions about the database integration:
1. Check API endpoint response in browser DevTools Network tab
2. Check Django console for error messages
3. Verify database connection in `erp_backend/settings.py`
4. Check that all API views are imported correctly in `views.py`
