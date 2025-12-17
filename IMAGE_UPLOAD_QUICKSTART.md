# 🎨 Website Controller - Image Upload Guide

## Quick Start

### How to Add Images to Stories, Testimonials & Hero Section

#### Method 1: Upload Image File (Easiest! ⭐)
1. Go to Website Controller → Choose section (Stories/Testimonials/Hero)
2. Look for the image upload area (shows: 📤 **Click or drag image here**)
3. **Drag** an image from your computer onto this area, OR
4. **Click** the area and select an image from your device
5. The image uploads automatically and shows a preview
6. Click "Add Story" / "Update Testimonial" / "Save Hero Section" to finalize

#### Method 2: Paste Image URL
1. In the same image upload area, click **🔗 Add Image URL** button
2. Paste any valid image URL (must start with `https://` or `http://`)
3. Click the **Add** button
4. The image appears in preview
5. Click "Add Story" / "Update" / "Save" to finalize

---

## 📷 Where Image Upload Works

| Section | What It Does | How to Use |
|---------|------------|-----------|
| **Stories** | Add cover images to stories | Upload or paste URL in "Story Image" field |
| **Testimonials** | Add profile photos to testimonials | Upload or paste URL in "Testimonial Image" field |
| **Hero Section** (Local) | Set site hero banner image | Upload or paste URL in "Hero Image" field |
| **Hero Section** (Database) | Set hero banner in database | Upload or paste URL in "Hero Image" field |

---

## 🔗 Example Image URLs (Ready to Copy & Paste)

### Random Images (changes each time)
```
https://picsum.photos/400/300
https://picsum.photos/400/300?random=1
https://picsum.photos/400/300?random=2
```

### Avatar/Profile Images
```
https://i.pravatar.cc/150?u=sarah
https://i.pravatar.cc/150?u=john
https://i.pravatar.cc/150?u=emma
```

### Placeholder Services
```
https://via.placeholder.com/400x300
https://dummyimage.com/400x300
```

### Your Own Images
- Hosting on web server: `https://your-domain.com/images/photo.jpg`
- Cloud storage (AWS S3, Cloudinary, etc.)
- Direct image links from other websites

---

## ✨ Features Explained

### Upload Area Shows:
- 📤 Upload icon
- Text saying "Click or drag image here"
- File type info: "JPG, PNG, GIF, WebP (max 5MB)"
- Drag & drop support

### While Uploading:
- Shows "Uploading..." message
- Upload button becomes disabled
- Spinner indicates progress

### When Done:
- Image preview appears (32x24 pixels, with X button to clear)
- 🔗 Add Image URL toggle button
- Example URLs shown below

### Error Messages:
- "Upload failed: ..." → File type not supported or size too large
- "Please enter a valid URL starting with http://" → Invalid URL format
- Check console (F12 → Console) for detailed error info

---

## 💾 How It Works Behind the Scenes

1. **You upload image** → 
2. **Browser sends to server** → 
3. **Server validates file type** (JPG, PNG, GIF, WebP only) →
4. **Server saves to `/media/` folder** with unique filename →
5. **Server returns URL** to browser →
6. **You see preview** with the URL →
7. **You click Save** → URL stored in database →
8. **Website displays image** ✅

---

## 📁 Where Images Are Stored

- **Server**: `D:\CRM ERM\erp_backend\media\` folder
- **Web Access**: `http://localhost:8000/media/{filename}`
- **Example**: `http://localhost:8000/media/my-photo-a1b2c3d4.jpg`
- **Filename Format**: `{name-slug}-{random-code}.{ext}`

---

## 🚀 Pro Tips

✅ **DO:**
- Drag & drop images directly (easiest!)
- Use images 400×300 pixels for best quality
- Use URL shortcuts like `https://i.pravatar.cc/150?u=name` for quick avatars
- Click the X button to clear and try a different image

❌ **DON'T:**
- Upload files larger than 5MB (will be rejected)
- Use unsupported formats (only JPG, PNG, GIF, WebP work)
- Paste text URLs without "http://" or "https://" prefix
- Leave image URL field blank if you don't want an image

---

## ❓ Troubleshooting

| Problem | Solution |
|---------|----------|
| "Upload failed" | Check file type (must be JPG/PNG/GIF/WebP) and size (<5MB) |
| Image doesn't appear | Make sure URL starts with `http://` or `https://` |
| Preview shows broken image | URL might be invalid or external site blocked by CORS |
| Can't find upload button | Scroll down in the form, it's below text fields |
| Image not saving to website | Make sure you clicked "Save" or "Add" button |

---

## 📝 Example Workflow

**Add a Story with Image:**
1. Go to Website Controller → Stories tab
2. Fill in: Title, Excerpt, Author
3. In "Story Image" section:
   - Drag an image file from Desktop → uploads automatically
   - OR click "🔗 Add Image URL" → paste `https://picsum.photos/400/300`
4. Image preview appears
5. Click **"Add Story"** button
6. Success! Story saves with image to database
7. Image appears on `/website` homepage instantly

**Edit a Testimonial with Image:**
1. Click the blue "Edit" button on an existing testimonial
2. Form shows existing data above
3. In "Testimonial Image" section:
   - Click area to upload new profile photo
   - OR paste avatar URL like `https://i.pravatar.cc/150?u=sarah`
4. Preview shows the photo
5. Click **"Update Testimonial"** button
6. Website updates instantly

---

## 🎯 What's Next?

The image upload system now:
- ✅ Accepts file uploads (JPG, PNG, GIF, WebP)
- ✅ Stores images on server with unique names
- ✅ Returns URLs for database storage
- ✅ Shows live previews before saving
- ✅ Supports external image URLs
- ✅ Works with drag & drop

**Future enhancements could include:**
- Image cropping/resizing
- Bulk upload multiple images
- Image optimization/compression
- CDN integration (Cloudinary, AWS S3)
