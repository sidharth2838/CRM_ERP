# Quick Start - Website Controller Database Save

## ✅ Setup (One Time)

### 1. Start Django Backend
```bash
cd "d:\CRM ERM\erp_backend"
python manage.py runserver
```
**Expected**: `Starting development server at http://127.0.0.1:8000/`

### 2. Start Frontend (in new terminal)
```bash
cd "d:\CRM ERM\frontend"
npm run dev
```
**Expected**: `➜  Local:   http://localhost:3000/`

### 3. Open Website Controller
- URL: `http://localhost:3000/admin/website-controller`
- Should load with default data

---

## 📝 Using Website Controller

### To Add Content:
1. Click desired tab (Features, Stories, Testimonials, etc)
2. Fill in the fields
3. Click "Add [Item]" button
4. **WATCH FOR SUCCESS MESSAGE** ✅

### Success Indicators:
- ✅ Item appears in list immediately
- ✅ Green message: "Data saved to database successfully!"
- ✅ Homepage updates in real-time

### Error Indicators:
- ❌ Red message: "Data saved to localStorage but not database"
- ❌ Item doesn't appear in list
- ❌ Browser console shows errors

---

## 🔍 If Error Appears

### Step 1: Check Console (F12)
```javascript
// Look for messages like:
[AXIOS] POST /api/website/save-all/
[AXIOS] Response 200 from /api/website/save-all/

// OR errors like:
[AXIOS] Response error: Error connecting to http://localhost:8000
```

### Step 2: Verify Django is Running
```bash
# In separate terminal, test API
curl http://localhost:8000/api/website/stories/ -UseBasicParsing
```
**Expected**: Status 200, returns `[]`

### Step 3: Check Both Servers Running
- Django: http://localhost:8000/api/ (should work)
- Frontend: http://localhost:3000/ (should work)

### Step 4: Restart Everything
```bash
# Stop Django: Ctrl+C in Django terminal
# Stop Frontend: Ctrl+C in Frontend terminal

# Restart Django
python manage.py runserver

# In new terminal, restart Frontend
npm run dev
```

---

## 📊 Data Flow

```
You add Feature
    ↓
Click "Add Feature"
    ↓
Data saves to localStorage (instant)
    ↓
Homepage shows feature immediately
    ↓
Request sent to /api/website/save-all/
    ↓
Django saves to database
    ↓
✅ Success message appears
    ↓
Data now saved in 2 places:
- localStorage (fast, browser)
- Database (permanent, Django)
```

---

## 📋 Checklist Before Starting

- [ ] Django running on port 8000
- [ ] Frontend running on port 3000  
- [ ] Database migration applied (`python manage.py migrate`)
- [ ] No errors in Django console
- [ ] No errors in frontend console (F12)
- [ ] Vite proxy configured (should be automatic)

---

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| "No response from server" | Start Django: `python manage.py runserver` |
| "404 Not Found" | Run migrations: `python manage.py migrate` |
| Data not appearing | Hard refresh (Ctrl+Shift+R) or restart both servers |
| Item added but error shown | Check Django console for actual error message |
| Browser console shows no errors | Check Network tab (F12 → Network) for API calls |

---

## ✨ Success Indicators

When everything is working:

1. ✅ Add a feature → See green success message
2. ✅ Check homepage → Feature appears immediately
3. ✅ Refresh homepage → Feature still there
4. ✅ Close browser → Reopen → Feature still there
5. ✅ Both localStorage and database have data

---

## 📞 Help Needed?

1. **Check API is working**:
   ```bash
   curl http://localhost:8000/api/website/stories/ -UseBasicParsing
   ```

2. **Check console logs** (F12 → Console tab):
   - Look for `[AXIOS]` messages
   - Look for red errors

3. **Check Network tab** (F12 → Network):
   - Look for `save-all` request
   - Check status code (should be 200)
   - Check response (should show success message)

4. **Refer to full guide**:
   - `API_CONNECTION_TROUBLESHOOTING.md` - Complete debugging guide
   - `DATABASE_CONNECTION_FIX_SUMMARY.md` - What was fixed
   - `WEBSITE_CONTROLLER_USER_GUIDE.md` - How to use

---

## 🎯 Quick Commands

```bash
# Start Django
cd "d:\CRM ERM\erp_backend" && python manage.py runserver

# Start Frontend
cd "d:\CRM ERM\frontend" && npm run dev

# Test API
curl http://localhost:8000/api/website/stories/ -UseBasicParsing

# Reset migrations
python manage.py migrate erp_api 0012 --fake
python manage.py migrate

# Clear pycache
Get-ChildItem -Recurse -Filter "__pycache__" -Directory | Remove-Item -Recurse -Force
```

---

## 🎓 Learning More

- **Django REST Framework**: https://www.django-rest-framework.org/
- **Axios**: https://axios-http.com/
- **React**: https://react.dev/
- **Vite**: https://vitejs.dev/

---

**Last Updated**: December 11, 2025  
**Status**: Ready to Use ✅
