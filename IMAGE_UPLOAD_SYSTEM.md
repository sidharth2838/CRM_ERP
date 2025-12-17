# Image Upload System - Easy Upload & URL Management

## ✅ What's New

### 1. **Easy Image Upload Component** 
   - **Drag & Drop**: Click or drag images directly into the upload area
   - **File Upload**: Select images from your computer (JPG, PNG, GIF, WebP)
   - **URL Input**: Paste image URLs from the web
   - **Live Preview**: See uploaded images before saving
   - **One-Click Clear**: Remove images with the X button

### 2. **Backend Image Upload Endpoint**
   - Endpoint: `/api/website/upload-image/`
   - Accepts: File uploads (multipart/form-data)
   - Returns: Image URL for database storage
   - Storage: Images saved to `/media/` folder with unique filenames
   - Validation: Only accepts JPG, PNG, GIF, WebP formats

### 3. **Where It Works**
   - ✅ Stories section - Add/Edit story images
   - ✅ Testimonials section - Add/Edit testimonial images
   - ✅ Hero Section - Add/Edit hero banner images
   - ✅ Site Info - Upload main hero image

## 🎯 How to Use

### Option 1: Upload Image Files (Easiest!)
1. Go to Website Controller
2. Click in the image upload area (shows "📤 Click or drag image here")
3. Either drag an image or click to select from your computer
4. Image uploads automatically and appears in preview
5. Click "Add Story" or "Update" to save

### Option 2: Paste Image URL
1. Click "🔗 Add Image URL" button
2. Paste any valid image URL (e.g., https://example.com/image.jpg)
3. Click "Add" button
4. URL appears in preview
5. Click "Add Story" or "Update" to save

### Example URLs You Can Use:
- **Random Images**: `https://picsum.photos/400/300`
- **Avatar Images**: `https://i.pravatar.cc/150?u=username`
- **Your Own**: Any image URL from web hosting, AWS S3, Cloudinary, etc.

## 🔧 Technical Details

### Files Modified:
1. **erp_backend/erp_api/views.py** - Added `ImageUploadView` class
2. **erp_backend/erp_api/api_urls.py** - Added `/website/upload-image/` endpoint
3. **frontend/src/components/ImageInput.jsx** - Created new reusable component
4. **frontend/src/pages/FrontPageEditor.jsx** - Updated to use ImageInput component

### Image Storage:
- **Location**: `erp_backend/media/` folder
- **Naming**: `{slug}-{uuid}.{ext}` (e.g., `my-image-a1b2c3d4.jpg`)
- **URL Pattern**: `/media/{filename}`
- **Access**: Available at `http://localhost:8000/media/{filename}`

### Supported Formats:
- JPG/JPEG
- PNG
- GIF
- WebP

## 🎨 UI Features

### Upload Section Shows:
- 📤 Upload icon and instruction text
- File type and size information
- Drag & drop support
- Loading state while uploading

### URL Input Section Shows:
- 🔗 Toggle button to show/hide
- Text input for pasting URLs
- Add button to confirm
- Error messages if URL is invalid

### Preview Shows:
- Thumbnail of uploaded/selected image
- ✕ Button to clear/remove image
- Example URLs for reference

## ✨ Benefits

1. **Easier than before**: No more Base64 conversion issues
2. **File uploads work**: Users can upload images directly
3. **URL support**: Still accepts external image URLs
4. **Better UX**: Visual feedback with previews
5. **Error handling**: Clear error messages if upload fails
6. **Responsive**: Works on desktop and mobile

## 🚀 What Happens Behind the Scenes

1. User selects/uploads image → Component sends to backend
2. Backend validates file type → Stores in media folder
3. Backend returns URL → Component displays preview
4. User clicks "Save" → URL saved to database
5. Public website fetches URL → Images display perfectly

## 📝 Next Steps (Optional Future Enhancements)

- Image cropping/resizing
- Drag to reorder gallery images
- Bulk upload multiple images
- Image optimization/compression
- CDN integration (Cloudinary, AWS S3)
