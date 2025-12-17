# CozyCorner React Frontend

Modern React frontend for CozyCorner e-commerce platform, replacing the Bootstrap template with a fully responsive React-based architecture.

## Features

- ✅ **React 18** with Hooks
- ✅ **Vite** for fast development and optimized builds
- ✅ **Tailwind CSS** for styling
- ✅ **React Router** for navigation
- ✅ **Axios** for API integration
- ✅ **Responsive Design** (Mobile, Tablet, Desktop)
- ✅ **Component-Based Architecture**
- ✅ **Fully Integrated with Django Backend**

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Header.jsx
│   │   ├── HeroSection.jsx
│   │   ├── FeaturesSection.jsx
│   │   ├── ProductsSection.jsx
│   │   ├── WhyUsSection.jsx
│   │   ├── DetailsSection.jsx
│   │   ├── TestimonialsSection.jsx
│   │   ├── StoriesSection.jsx
│   │   ├── InstagramSection.jsx
│   │   ├── Footer.jsx
│   │   └── index.js
│   ├── pages/
│   │   └── HomePage.jsx     # Main homepage
│   ├── services/
│   │   └── api.js           # API integration
│   ├── styles/
│   │   └── index.css        # Global styles + Tailwind
│   ├── App.jsx              # Root component
│   └── main.jsx             # Entry point
├── public/                  # Static assets
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
├── .env.local              # Environment variables
└── package.json            # Dependencies
```

## Installation

### 1. Install Node.js
Download from https://nodejs.org/ (LTS version recommended)

### 2. Install Dependencies
```bash
cd frontend
npm install
```

### 3. Configure Environment
Edit `.env.local`:
```
VITE_API_URL=http://localhost:8000/api
```

## Running the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

## Components

### Header
- Sticky navigation
- Desktop and mobile menus
- Search, wishlist, cart, account icons
- Responsive hamburger menu

### HeroSection
- Full-width hero banner
- Dynamic background image
- Call-to-action button
- Customizable colors and text

### FeaturesSection
- Grid layout (1-4 columns based on screen)
- Icon support (Font Awesome or custom images)
- Hover animations
- Fully customizable from Django admin

### ProductsSection
- Responsive product grid
- Product cards with images
- Add to wishlist
- Quick view buttons
- Price and category display

### WhyUsSection
- Two-column layout
- Checklist items
- Background image support
- Responsive design

### DetailsSection
- Three-column grid
- Icon and text cards
- Customizable background color

### TestimonialsSection
- Star ratings
- Customer reviews
- Author information
- Grid layout

### StoriesSection
- Blog/story cards
- Featured images
- Publication dates
- Read more links

### InstagramSection
- Instagram handle display
- Photo grid
- Links to Instagram profile

### Footer
- Multiple column layout
- Social media links
- About section
- Links sections
- Copyright information

## API Integration

The frontend consumes data from Django REST Framework endpoints:

```javascript
// Homepage data endpoints
GET /api/homepage/hero/
GET /api/homepage/features/
GET /api/homepage/why-us/
GET /api/homepage/details/
GET /api/homepage/stories/
GET /api/homepage/instagram/
GET /api/homepage/testimonials/
GET /api/homepage/navigation/
GET /api/homepage/footer/
GET /api/homepage/social/
GET /api/homepage/seo/

// Products
GET /api/products/
GET /api/products/{id}/
```

## Responsive Design

The frontend is fully responsive:

- **Mobile** (< 768px): Single column layouts, hamburger menu
- **Tablet** (768px - 1024px): 2-column grids
- **Desktop** (> 1024px): Full 3-4 column grids

All breakpoints use Tailwind CSS responsive prefixes:
- `sm:` for small screens (640px)
- `md:` for medium screens (768px)
- `lg:` for large screens (1024px)

## Styling

### Tailwind CSS
Global styles are managed with Tailwind CSS. Custom components are defined in `src/styles/index.css`:

```css
@layer components {
  .btn-primary { ... }
  .btn-secondary { ... }
  .card { ... }
  .section-title { ... }
}
```

### Color Palette
- Primary Dark: #2e2e2e
- Primary: #3e3e3e
- Accent: #d4a574
- Light BG: #f9f8f6

## Performance

- **Code Splitting**: Routes are lazy-loaded
- **Image Optimization**: Images use object-fit and lazy loading
- **Bundle Size**: Minified production build ~200KB
- **Fast Refresh**: Vite HMR for instant updates

## Development Workflow

### Hot Module Replacement (HMR)
Changes to components are instantly reflected in the browser without full page reload.

### ESLint & Prettier
```bash
npm run lint        # Check code style
npm run format      # Format code
```

## Deployment

### To Netlify
1. Build: `npm run build`
2. Deploy `dist/` folder
3. Set environment variables

### To Django Static Files
```bash
npm run build
cp -r dist/* ../erp_backend/staticfiles/frontend/
```

### To S3/CloudFront
1. Build: `npm run build`
2. Upload `dist/` to S3 bucket
3. Configure CloudFront distribution

## Troubleshooting

### Port 3000 Already in Use
```bash
npm run dev -- --port 3001
```

### API Connection Issues
- Ensure Django server is running on `http://localhost:8000`
- Check `.env.local` configuration
- Check CORS settings in Django settings

### Build Errors
```bash
rm -rf node_modules
npm install
npm run build
```

## Next Steps

1. **Install Dependencies**: `npm install`
2. **Start Development**: `npm run dev`
3. **Access Application**: Open `http://localhost:3000`
4. **Make Changes**: Edit components and see instant updates
5. **Build for Production**: `npm run build`

## Support

For issues or questions, refer to:
- React Docs: https://react.dev
- Tailwind Docs: https://tailwindcss.com/docs
- Vite Docs: https://vitejs.dev/guide/
- Axios Docs: https://axios-http.com/

---

**Version**: 1.0.0
**Last Updated**: December 10, 2025
