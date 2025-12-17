# NAVBAR & FOOTER CONTROLLER - QUICK START

## ✅ What Was Added

### 1. **Two New Tabs in Website Controller**
   - **Navbar Tab** - Manage website navigation menu
   - **Footer Tab** - Manage footer sections, links, and social media

### 2. **Navbar Management Features**
   ```
   ✓ Add menu items with labels and URLs
   ✓ Add icon classes (FontAwesome icons)
   ✓ Create dropdown menus with submenus
   ✓ Set menu item ordering
   ✓ Delete menu items
   ✓ View all current menu items
   ```

### 3. **Footer Management Features**
   ```
   ✓ Create footer sections (About, Menu, Account, Info, Contact)
   ✓ Add links under footer sections
   ✓ Add social media links (6 platforms supported)
   ✓ Manage link ordering
   ✓ Delete sections, links, and social media
   ✓ View complete footer structure
   ```

---

## 🚀 How to Access

### Step 1: Open Website Controller
Navigate to: `http://localhost:3000/admin/website-controller`

### Step 2: Find New Tabs
Look for two new tabs:
- **Navbar** (between Partners and Newsletter)
- **Footer** (between Navbar and Newsletter)

---

## 📋 Tab Locations

```
[siteinfo] [hero] [collections] [quality] [furniture-details] 
[stories-section] [features] [stories] [testimonials-section] 
[testimonials] [gallery] [faq] [partners] [Navbar] [Footer] [newsletter]
```

---

## 🛠️ Backend API Endpoints

All endpoints are protected - Admin/Staff login required.

### Navbar
- `GET /api/website/navbar/get/` - Get all navbar items
- `POST /api/website/navbar/save/` - Add/Update navbar item
- `POST /api/website/navbar/delete/` - Delete navbar item

### Footer Sections
- `GET /api/website/footer/get/` - Get all footer config
- `POST /api/website/footer/section/save/` - Add/Update section
- `POST /api/website/footer/section/delete/` - Delete section

### Footer Links
- `POST /api/website/footer/link/save/` - Add/Update link
- `POST /api/website/footer/link/delete/` - Delete link

### Social Links
- `POST /api/website/footer/social/save/` - Add/Update social link
- `POST /api/website/footer/social/delete/` - Delete social link

---

## 📝 Using Navbar Tab

### To Add a Menu Item:
1. Click **"Navbar"** tab
2. Fill in **Menu Label** (e.g., "Products")
3. Fill in **URL** (e.g., "/products")
4. (Optional) Add **Icon Class** (e.g., "fas fa-shopping-bag")
5. (Optional) Check "Is Dropdown" for dropdown menus
6. Set **Order** (lower numbers appear first)
7. Click **"Add Menu Item"**

### To Delete a Menu Item:
1. Scroll down to "Current Menu Items"
2. Find the item you want to delete
3. Click **"Delete"** button

---

## 📝 Using Footer Tab

### To Add a Footer Section:
1. Click **"Footer"** tab
2. Enter **Section Title** (e.g., "Quick Links")
3. Select **Section Type**:
   - **About** - For company information
   - **Menu** - For navigation links
   - **Account** - For user account links
   - **Info** - For informational links
   - **Contact** - For contact information
4. (Optional) Add **Content** (for about/contact types)
5. Set **Order**
6. Click **"Add Section"**

### To Add Footer Links:
1. Select **Section** from dropdown (only menu/account/info types)
2. Enter **Link Text** (e.g., "About Us")
3. Enter **Link URL** (e.g., "/about")
4. Set **Order**
5. Click **"Add Link"**

### To Add Social Media Links:
1. Select **Platform** (Facebook, Instagram, Twitter, etc.)
2. Enter **Social Media URL** (full URL to profile)
3. (Optional) Add **Icon Class** (e.g., "fab fa-facebook")
4. Set **Order**
5. Click **"Add Social Link"**

---

## 📊 Available Platforms for Social Links

```
✓ Facebook
✓ Instagram
✓ Twitter
✓ Pinterest
✓ LinkedIn
✓ YouTube
```

---

## 💾 Data Storage

All navbar and footer data is saved in the Django database:

### Tables Used:
```
homepage_navigation     - Navigation menu items
homepage_footer_sections   - Footer sections
homepage_footer_links   - Links within sections
homepage_social_links   - Social media links
```

---

## 🔄 Auto-Load on Tab Switch

When you click the Navbar or Footer tab:
- ✅ Data automatically loads from database
- ✅ All current items display
- ✅ Ready to edit or add new items

---

## ⚠️ Important Notes

1. **Admin Required**: Only staff/admin users can manage navbar and footer
2. **Orders**: Lower order numbers appear first (0, 1, 2...)
3. **URLs**: Use paths like "/products", not full URLs
4. **Icons**: FontAwesome classes (e.g., "fas fa-home", "fab fa-facebook")
5. **Section Types**: Choose correct type - affects how footer displays

---

## 🧪 Testing

After adding navbar/footer items:

1. **Check the data**: Look for your items in "Current Menu Items" or "Footer Sections"
2. **Verify persistence**: Refresh page - items should still be there
3. **Check homepage**: Items will appear on website once template is updated
4. **Test delete**: Remove an item and verify it's gone

---

## 🆘 Troubleshooting

### Tabs not visible?
- Clear browser cache (Ctrl+F5)
- Log out and log back in
- Restart dev server

### Can't save items?
- Check browser console (F12) for errors
- Verify you're logged in as admin
- Check Django console for error messages

### Data not loading?
- Refresh page
- Check network tab in DevTools
- Verify API endpoints are accessible

### 403 Forbidden error?
- Must be logged in as staff/admin user
- Non-admin users cannot access these features

---

## 📚 Files Modified

```
Backend:
  ✓ erp_backend/erp_api/website_views.py      - 10 new API functions
  ✓ erp_backend/erp_api/website_urls.py       - 10 new URL routes

Frontend:
  ✓ frontend/src/pages/FrontPageEditor.jsx    - UI tabs + management
```

---

**Status**: ✅ READY TO USE

Visit the Website Controller now and look for the new **Navbar** and **Footer** tabs!
