# Website Controller - How to Use Guide

## Quick Start

### Access Website Controller
```
URL: http://localhost:3000/admin/website-controller
(or navigate through Dashboard → Website Manager)
```

---

## Tabs Available

### 1. **Site Info**
Manage general website information
- **Heading**: Main site heading
- **Subheading**: Secondary heading
- **Description**: Site description
- **Hero Image**: Upload banner image

**Click "Save Site Info"** to save changes to database

---

### 2. **Hero Section**
Manage the main hero/banner on homepage
- **Title**: Big heading text
- **Subtitle**: Secondary text under title
- **CTA Button Text**: Button label (e.g., "Explore Products")
- **Hero Image**: Upload background image

**Click "Save Hero Section"** to save

---

### 3. **Features**
Add/edit/delete feature items (shown in grid)
- **Title**: Feature name (e.g., "Eco-Friendly")
- **Description**: Feature description
- **Icon**: Select from emoji options (✨, 🌿, 🎨, 💪, etc)

**Steps to add**:
1. Fill in Title, Description, select Icon
2. Click **"Add Feature"** button
3. Feature appears below and saves to database
4. To delete, click **"Delete"** button next to feature

---

### 4. **Stories**
Add/edit/delete blog stories/articles
- **Title**: Story headline
- **Excerpt**: Short summary
- **Author**: Writer name
- **Image**: Upload story image

**Steps to add**:
1. Fill all fields
2. Upload image (preview appears)
3. Click **"Add Story"**
4. Story appears in list below
5. To delete, click **"Delete"** button

---

### 5. **Testimonials**
Add/edit/delete customer testimonials
- **Name**: Customer name
- **Role**: Job title / company role
- **Comment**: What they said about your products
- **Rating**: Select 3-5 stars (displayed as ⭐)
- **Image**: Upload profile picture

**Steps to add**:
1. Enter customer name and role
2. Type their testimonial message
3. Select star rating (1-5 stars)
4. Upload profile image (optional)
5. Click **"Add Testimonial"**
6. Appears with star rating on homepage

---

### 6. **Gallery**
Add/edit/delete gallery/inspiration images
- **Title**: Item name (e.g., "Modern Living Room")
- **Category**: Select room type:
  - Living Rooms
  - Bedrooms
  - Kitchens
  - Outdoor
- **Image**: Upload photo

**Steps to add**:
1. Enter title
2. Select category
3. Upload image
4. Click **"Add Item"**
5. Image appears in 4-column grid on homepage

---

### 7. **FAQ**
Add/edit/delete frequently asked questions
- **Question**: The FAQ question
- **Answer**: Detailed answer text
- **Category**: Select topic:
  - Shipping
  - Returns
  - Payment
  - Products

**Steps to add**:
1. Type question
2. Type answer
3. Select category
4. Click **"Add FAQ"**
5. FAQ appears as expandable item on homepage
6. Click question to expand/collapse answer

---

### 8. **Partners**
Add/edit/delete partner brands
- **Brand Name**: Partner company name
- **Logo**: Upload company logo
- **Website**: Optional link to their website

**Steps to add**:
1. Enter brand name
2. Upload logo (appears in preview)
3. Enter website URL (optional)
4. Click **"Add Partner"**
5. Logo appears in partner grid on homepage

---

### 9. **Newsletter**
Configure newsletter section settings
- **Section Title**: Heading above email form
- **Description**: Text above form
- **Email Placeholder**: Text in email input field

**Click "Save Newsletter Settings"** to update

---

## How Data is Saved

### Two-Step Save Process:

1. **Instant Save to Browser** (localStorage)
   - Data saved immediately when you click Add/Delete
   - Homepage updates in real-time
   - Fast and responsive

2. **Database Save** (within 1-2 seconds)
   - Data sent to Django backend
   - Stored permanently in database
   - Green success message appears: "Data saved to database successfully!"
   - Shows red error if database save fails

### What Happens Behind the Scenes:
```
You click "Add Feature"
    ↓
Feature added to list (instant)
Homepage shows new feature (real-time)
    ↓
Browser sends data to database API
    ↓
Database stores the data
    ↓
Success message appears
```

---

## Status Indicators

### Success Message (Green)
```
✓ Feature added!
✓ Data saved to database successfully!
```
→ Your changes are saved everywhere

### Error Message (Red)
```
✗ Fill all fields
✗ Data saved to localStorage but not database. Check connection.
```
→ Check your connection and try again

---

## Important Notes

### 1. **Predefined Data**
The system comes with default data (4 features, 3 stories, 2 testimonials, etc). You can:
- Keep them and add more
- Delete them and create your own
- Edit them to customize

### 2. **Images**
- You can upload images for stories, testimonials, gallery, and partners
- Images appear as preview before saving
- Images are converted to base64 (works without file server)
- Max size: ~16MB per image

### 3. **Real-Time Updates**
When you add/delete items:
- Homepage updates immediately
- No page refresh needed
- Works if both tabs open in same browser
- Uses localStorage for instant sync

### 4. **Data Persistence**
Your data is saved in TWO places:
- **Browser localStorage** - for instant access
- **Database** - for permanent storage

If you:
- ✅ Clear browser cache → Data still in database
- ✅ Open on different browser → Data loads from database  
- ✅ Close and reopen → Data loads from database
- ✅ Restart server → All data still there

### 5. **Emoji Selection for Features**
Available icons: ✨ 🌿 🎨 💪 ⭐ 🏆

Choose icons that match your features:
- ✨ = Quality/Premium
- 🌿 = Eco-Friendly
- 🎨 = Customizable
- 💪 = Strong/Durable
- ⭐ = Special
- 🏆 = Best/Award

---

## Common Tasks

### Task 1: Add a New Product Feature
1. Click **Features** tab
2. Title: "Premium Materials"
3. Description: "High-quality fabrics and materials"
4. Icon: 🏆
5. Click **Add Feature**
6. ✅ Feature appears on homepage

### Task 2: Add Customer Testimonial
1. Click **Testimonials** tab
2. Name: "Sarah Johnson"
3. Role: "Interior Designer"
4. Comment: "Best furniture I've used!"
5. Rating: ⭐⭐⭐⭐⭐ (5 stars)
6. Upload profile photo
7. Click **Add Testimonial**
8. ✅ Shows on homepage with 5-star rating

### Task 3: Add FAQ
1. Click **FAQ** tab
2. Question: "Do you ship internationally?"
3. Answer: "Yes, we ship to 50+ countries. Shipping takes 7-14 days."
4. Category: "Shipping"
5. Click **Add FAQ**
6. ✅ Shows on homepage as expandable item

### Task 4: Update Hero Banner
1. Click **Hero** tab
2. Change Title to: "Welcome to Our Store"
3. Change Subtitle to: "Premium Furniture for Your Home"
4. Upload new banner image
5. Click **Save Hero Section**
6. ✅ Homepage hero section updates

### Task 5: Delete an Item
1. Find the item in the list
2. Click **Delete** button next to it
3. Item removed from list
4. ✅ Disappears from homepage immediately

---

## Troubleshooting

### Problem: Added item but doesn't show on homepage
**Solution**: 
- Refresh the homepage page
- Check browser DevTools Console for errors
- Verify both Website Controller and Homepage are open in same browser
- Check that error message didn't appear

### Problem: Error "Data saved to localStorage but not database"
**Solution**:
- Backend server might be down
- Check Django is running: `python erp_backend/manage.py runserver`
- Wait 10 seconds and try again
- Check your internet connection

### Problem: Image doesn't upload
**Solution**:
- Image file might be too large (max 16MB)
- Try a smaller image
- Try PNG or JPG format
- Ensure file has proper extension

### Problem: Changes not showing on homepage
**Solution**:
- Hard refresh homepage (Ctrl+Shift+R or Cmd+Shift+R)
- Close and reopen homepage tab
- Check browser console for JavaScript errors
- Ensure both tabs are in same browser

### Problem: Lost all my data
**Solution**:
- Data is in database, can be recovered
- Refresh the Website Controller page
- Click on each tab to reload data
- Data should reappear

---

## Performance Tips

1. **Keep images under 1MB** for faster uploads
2. **Use clear, concise descriptions** for better SEO
3. **Upload images before writing text** to avoid losing text
4. **Save regularly** don't wait until you add 10 items
5. **Test on homepage** after each major addition

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Tab navigation | Arrow keys |
| Submit form | Enter key |
| Refresh page | F5 |
| Hard refresh | Ctrl+Shift+R |
| Open DevTools | F12 |
| Clear Console | Ctrl+L |

---

## Support

If you encounter issues:
1. **Check the error message** - it usually tells you what's wrong
2. **Check browser console** - F12 → Console tab
3. **Refresh the page** - often fixes sync issues
4. **Restart Django** - terminal command shown in guide
5. **Check internet connection** - API needs connectivity

---

**Version**: 1.0  
**Last Updated**: December 11, 2025  
**Status**: Production Ready ✅
