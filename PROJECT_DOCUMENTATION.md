# CRM/ERP System - Complete Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Architecture](#project-architecture)
4. [Installation & Setup](#installation--setup)
5. [Running the Project](#running-the-project)
6. [Project Structure](#project-structure)
7. [Database Schema](#database-schema)
8. [API Endpoints](#api-endpoints)
9. [Frontend Features](#frontend-features)
10. [User Roles & Permissions](#user-roles--permissions)
11. [Configuration](#configuration)
12. [Features Overview](#features-overview)
13. [Troubleshooting](#troubleshooting)

---

## Project Overview

**CRM/ERP System** is a comprehensive business management solution combining:
- **CRM (Customer Relationship Management)**: Manage customers, leads, companies, and interactions
- **ERP (Enterprise Resource Planning)**: Handle products, orders, invoices, payments, and expenses
- **Website Builder**: Manage website content, product catalogs, and customer-facing pages

### Key Highlights:
- ✅ Full-stack application (React frontend + Django backend)
- ✅ JWT-based authentication with role-based access control
- ✅ MySQL database integration
- ✅ RESTful API architecture
- ✅ Modern UI with Tailwind CSS
- ✅ Content management system for website
- ✅ Multi-role user system (Admin, Staff, Finance, Customer)

---

## Technology Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Python** | 3.x | Programming language |
| **Django** | 4.2.7 | Web framework |
| **Django REST Framework** | Latest | API development |
| **Django JWT** | simplejwt | Authentication & authorization |
| **MySQL** | 5.7+ | Database |
| **Stripe** | API | Payment processing |

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.3.1 | UI library |
| **Vite** | 5.4.0 | Build tool & dev server |
| **React Router** | 6.28.0 | Client-side routing |
| **Axios** | 1.7.2 | HTTP client |
| **Tailwind CSS** | 3.4.3 | Styling framework |
| **React Icons** | 5.5.0 | Icon library |

### Additional Tools
- **CORS** for cross-origin requests
- **Pillow** for image processing
- **openpyxl** for Excel export/import
- **SQLAlchemy** for advanced queries

---

## Project Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React/Vite)                    │
│                    http://localhost:3000                     │
├─────────────────────────────────────────────────────────────┤
│  • HomePage          • CustomersPage    • ProductsPage       │
│  • LoginPage         • PeoplesPage      • OrderPage          │
│  • WebsitePage       • CompaniesPage    • InvoicesPage       │
│  • ReportPage        • LeadsPage        • PaymentsPage       │
│  • SettingsPage      • QuotesPage       • ExpensesPage       │
│  • WebsiteController • OffersForLeads   • APIDebugPage       │
└─────────────────────────────────────────────────────────────┘
                            ↕ (Axios HTTP)
┌─────────────────────────────────────────────────────────────┐
│                  API LAYER (Django REST)                    │
│                    http://localhost:8000                     │
├─────────────────────────────────────────────────────────────┤
│  Authentication    │ CRM Module      │ ERP Module            │
│  ├─ Login          │ ├─ Customers    │ ├─ Products           │
│  ├─ Register       │ ├─ Companies    │ ├─ Orders             │
│  ├─ JWT Tokens     │ ├─ Leads        │ ├─ Invoices           │
│  └─ User Mgmt      │ ├─ Quotes       │ ├─ Payments           │
│                    │ └─ Offers       │ ├─ Expenses           │
│                    │                 │ └─ Reports            │
│                    │ Website Module  │                       │
│                    │ ├─ Hero Section │                       │
│                    │ ├─ Gallery      │                       │
│                    │ ├─ FAQ          │                       │
│                    │ ├─ Testimonials │                       │
│                    │ └─ Stories      │                       │
└─────────────────────────────────────────────────────────────┘
                            ↕ (Django ORM)
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE (MySQL)                          │
│                    localhost:3306                            │
│                   Database: crm_erp_system                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Installation & Setup

### Prerequisites
- Python 3.8 or higher
- Node.js 16+ and npm
- MySQL Server 5.7+
- Git

### Step 1: Clone Repository
```bash
git clone https://github.com/sidharth2838/CRM_ERP.git
cd "CRM ERP"
```

### Step 2: Backend Setup

#### Create Virtual Environment
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

#### Install Dependencies
```bash
cd erp_backend
pip install -r requirements.txt
```

#### Configure Database
Edit `erp_backend/settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'crm_erp_system',        # Your database name
        'USER': 'root',                  # MySQL username
        'PASSWORD': 'sidmysql',          # MySQL password
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

#### Create Database & Run Migrations
```bash
python manage.py migrate
```

#### Create Superuser (Admin Account)
```bash
python manage.py createsuperuser
# Follow prompts to create admin account
```

#### Load Demo Data (Optional)
```bash
python manage.py shell
# Then execute data creation scripts from erp_backend/
```

### Step 3: Frontend Setup

```bash
cd frontend
npm install
```

#### Configure API URLs (if needed)
Edit `frontend/src/api/` files to set backend URL:
```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

---

## Running the Project

### Option 1: Using VS Code Tasks
1. Open terminal in VS Code
2. Run task: **"Run Django dev server"**
3. In new terminal: `cd frontend && npm run dev`

### Option 2: Manual Execution

#### Terminal 1 - Backend
```bash
cd erp_backend
python manage.py runserver
# Server running at http://127.0.0.1:8000/
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
# Server running at http://localhost:3000/
```

### Access the Application
- **Frontend**: http://localhost:3000/
- **Django Admin**: http://localhost:8000/admin/
- **API Root**: http://localhost:8000/api/

---

## Project Structure

### Backend Structure
```
erp_backend/
├── erp_backend/              # Main Django project settings
│   ├── settings.py          # Configuration (DB, REST, JWT, CORS)
│   ├── urls.py              # Main URL routing
│   ├── wsgi.py              # Production WSGI config
│   └── middleware/          # Custom middleware
│       └── csrf_exempt_api.py
│
├── erp_api/                 # Main application
│   ├── models.py            # Database models (1200+ lines)
│   │   ├── UserProfile      # User role management
│   │   ├── Customer         # Customer data
│   │   ├── Company          # Company information
│   │   ├── Product          # Product catalog
│   │   ├── Order            # Orders & order items
│   │   ├── Invoice          # Invoicing
│   │   ├── Payment          # Payment tracking
│   │   ├── Lead             # Sales leads
│   │   ├── Quote            # Quotations
│   │   ├── Expense          # Expense tracking
│   │   ├── Website*         # Website content models
│   │   └── CMS*             # Content management models
│   │
│   ├── views.py             # API views (5400+ lines)
│   │   ├── RegisterView     # User registration
│   │   ├── LoginView        # Authentication
│   │   ├── DashboardView    # Analytics & metrics
│   │   ├── CustomerAPIView  # Customer CRUD
│   │   ├── ProductAPIView   # Product management
│   │   ├── OrderAPIView     # Order management
│   │   ├── InvoiceAPIView   # Invoice generation
│   │   └── ... (40+ view classes)
│   │
│   ├── serializers.py       # Data serialization
│   ├── api_urls.py          # API routing
│   ├── website_urls.py      # Website routing
│   ├── website_views.py     # Website-specific views
│   ├── decorators.py        # Custom decorators
│   ├── migrations/          # Database migrations (21 files)
│   ├── admin.py             # Django admin configuration
│   └── tests.py             # Unit tests
│
├── templates/               # HTML templates
├── static/                  # Static files (JS, CSS)
├── media/                   # User uploads
│   ├── products/            # Product images
│   └── conducts/            # Document files
│
├── manage.py               # Django management command
├── requirements.txt        # Python dependencies
└── README_HOMEPAGE_CMS.md  # CMS Documentation
```

### Frontend Structure
```
frontend/
├── src/
│   ├── pages/               # Page components
│   │   ├── HomePage.jsx         # Main dashboard
│   │   ├── LoginPage.jsx        # Authentication
│   │   ├── CustomersPage.jsx    # Customer management
│   │   ├── ProductsPage.jsx     # Product management
│   │   ├── OrderPage.jsx        # Order management
│   │   ├── InvoicesPage.jsx     # Invoice management
│   │   ├── PaymentsPage.jsx     # Payment tracking
│   │   ├── LeadsPage.jsx        # Lead management
│   │   ├── QuotesPage.jsx       # Quote management
│   │   ├── ExpensesPage.jsx     # Expense tracking
│   │   ├── ReportPage.jsx       # Analytics & reports
│   │   ├── SettingsPage.jsx     # Configuration
│   │   ├── WebsitePage.jsx      # Website viewer
│   │   ├── CatalogPage.jsx      # Product catalog
│   │   ├── FrontPageEditor.jsx  # Website editor
│   │   ├── UserManagementPage.jsx # User admin
│   │   └── APIDebugPage.jsx     # API testing
│   │
│   ├── components/          # Reusable components
│   │   ├── Topbar.jsx           # Header navigation
│   │   ├── Sidebar.jsx          # Left navigation
│   │   ├── DataTable.jsx        # Data table component
│   │   └── ... (other components)
│   │
│   ├── api/                 # API integration
│   │   ├── axios.js             # Axios configuration
│   │   └── endpoints.js         # API endpoints
│   │
│   ├── services/            # Business logic
│   │   └── authService.js       # Authentication service
│   │
│   ├── styles/              # CSS files
│   │   └── index.css            # Global styles
│   │
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
│
├── public/                  # Static assets
├── index.html              # HTML template
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
└── jsconfig.json           # JavaScript config
```

---

## Database Schema

### Core Tables

#### Users & Authentication
```sql
-- Django User (built-in)
auth_user (
  id, username, password, email, first_name, last_name, 
  is_staff, is_active, last_login, date_joined
)

-- User Profiles
user_profiles (
  id, user_id, unique_id, role, phone, department
)
```

#### CRM Tables
```sql
customers (
  id, user_id, company_id, customer_code, customer_type,
  billing_address, shipping_address, credit_limit, balance,
  tax_number, created_at
)

companies (
  id, name, address, phone, email, contact_person,
  created_at, created_by_id
)

leads (
  id, name, email, phone, company_name, status,
  source, probability, value, expected_close_date,
  assigned_to_id, created_at, updated_at
)

quotes (
  id, quote_number, customer_id, total, status,
  valid_until, created_at, created_by_id
)
```

#### ERP Tables
```sql
products (
  id, product_code, name, description, category_id,
  price, cost, quantity, image, created_at
)

orders (
  id, order_number, customer_id, total_amount,
  status, payment_status, created_at, updated_at
)

order_items (
  id, order_id, product_id, quantity, unit_price,
  total_price
)

invoices (
  id, invoice_number, customer_id, order_id,
  total_amount, due_date, status, created_at
)

payments (
  id, invoice_id, amount, payment_method,
  transaction_id, status, created_at
)

expenses (
  id, category_id, amount, description,
  date, user_id, created_at
)
```

#### Website/CMS Tables
```sql
website_hero_section (
  id, title, subtitle, image, cta_text, cta_link
)

website_gallery (
  id, title, description, image, category, created_at
)

website_testimonial (
  id, author_name, role, content, rating, image
)

website_faq (
  id, question, answer, category, order
)

website_partner (
  id, name, logo, website_url
)
```

---

## API Endpoints

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/register/` | Register new user | No |
| POST | `/api/login/` | User login | No |
| POST | `/api/logout/` | User logout | Yes |
| GET | `/api/user-profile/` | Get current user | Yes |

### Dashboard & Reports
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/dashboard/` | Dashboard metrics | Yes |
| GET | `/api/reports/` | Sales reports | Yes |
| GET | `/api/reports/sales-summary/` | Sales summary | Yes |

### Customers
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/customers/` | List customers | Yes |
| POST | `/api/customers/` | Create customer | Yes |
| GET | `/api/customers/{id}/` | Get customer details | Yes |
| PUT | `/api/customers/{id}/` | Update customer | Yes |
| DELETE | `/api/customers/{id}/` | Delete customer | Yes |

### Products
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products/` | List products | No |
| POST | `/api/products/` | Create product | Yes |
| GET | `/api/products/{id}/` | Get product details | No |
| PUT | `/api/products/{id}/` | Update product | Yes |
| DELETE | `/api/products/{id}/` | Delete product | Yes |

### Orders
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/orders/` | List orders | Yes |
| POST | `/api/orders/` | Create order | Yes |
| GET | `/api/orders/{id}/` | Get order details | Yes |
| PUT | `/api/orders/{id}/` | Update order | Yes |
| PATCH | `/api/orders/{id}/status/` | Update order status | Yes |

### Invoices
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/invoices/` | List invoices | Yes |
| POST | `/api/invoices/` | Create invoice | Yes |
| GET | `/api/invoices/{id}/` | Get invoice PDF | Yes |

### Payments
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/payments/` | List payments | Yes |
| POST | `/api/payments/` | Record payment | Yes |
| POST | `/api/payments/stripe/` | Process Stripe payment | Yes |

### Leads
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/leads/` | List leads | Yes |
| POST | `/api/leads/` | Create lead | Yes |
| PUT | `/api/leads/{id}/` | Update lead | Yes |
| POST | `/api/leads/export/` | Export to Excel | Yes |
| POST | `/api/leads/import/` | Import from Excel | Yes |

### Expenses
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/expenses/` | List expenses | Yes |
| POST | `/api/expenses/` | Create expense | Yes |
| DELETE | `/api/expenses/{id}/` | Delete expense | Yes |

### Website Content
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/website/hero/` | Get hero section | No |
| GET | `/api/website/gallery/` | Get gallery | No |
| GET | `/api/website/testimonials/` | Get testimonials | No |
| GET | `/api/website/faq/` | Get FAQ | No |
| GET | `/api/website/partners/` | Get partners | No |
| POST | `/api/website/hero/` | Update hero (Admin) | Yes |

### System
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/health/` | Health check | No |
| GET | `/api/` | API root | No |

---

## Frontend Features

### Dashboard (HomePage)
- **Analytics Overview**: Key metrics, sales summary, lead statistics
- **Recent Orders**: Last 10 orders with status
- **Top Products**: Best-selling products
- **Revenue Chart**: Sales trend visualization
- **Lead Pipeline**: Lead status distribution
- **Quick Actions**: Create order, invoice, lead buttons

### Customer Management
- **Customer List**: View all customers with filters
- **Customer Details**: Full customer information, orders, contacts
- **Create/Edit**: Add or modify customer records
- **Contact Management**: Multiple contact persons per customer
- **Address Management**: Billing & shipping addresses
- **Credit Limit Tracking**: Monitor credit usage

### Products
- **Product Catalog**: Browse all products
- **Search & Filter**: Find products by name, category, price
- **Stock Management**: Track inventory levels
- **Product Details**: Images, descriptions, pricing
- **Categories**: Organize products by type
- **Bulk Import**: Upload products via Excel

### Orders
- **Order Management**: Create, view, edit orders
- **Order Status**: Track order progress
- **Order Items**: Add/remove products from order
- **Shipping Info**: Track delivery details
- **Order History**: View past orders

### Invoices & Payments
- **Invoice Generation**: Auto-generate from orders
- **Invoice Tracking**: Monitor payment status
- **Payment Recording**: Record customer payments
- **Stripe Integration**: Process credit card payments
- **Payment History**: View all transactions
- **Aging Reports**: Overdue invoice tracking

### Sales & Leads
- **Lead Management**: Track sales opportunities
- **Lead Status**: Qualify, follow-up, closed
- **Quote Management**: Create and track quotes
- **Offer Tracking**: Monitor customer offers
- **Lead Pipeline**: Visual sales funnel
- **Lead Export/Import**: Excel integration

### Financial Management
- **Expense Tracking**: Record and categorize expenses
- **Expense Reports**: Analyze spending by category
- **Budget Monitoring**: Track vs. budget
- **Financial Reports**: Revenue, expenses, profit

### Website Management
- **Content Editor**: Edit homepage content
- **Gallery Manager**: Upload and organize gallery images
- **Testimonial Management**: Add customer reviews
- **FAQ Management**: Maintain knowledge base
- **Partner Management**: Display business partners
- **Hero Section**: Customize banner and call-to-action

### Reporting
- **Sales Reports**: Revenue by period, product, customer
- **Customer Reports**: New customers, top customers
- **Product Reports**: Sales by product, inventory levels
- **Financial Reports**: Expense summary, profit analysis
- **Export**: Download reports as PDF/Excel

### Settings
- **User Management**: Create/edit users by role
- **Role Assignment**: Admin, Staff, Finance, Customer
- **Company Settings**: Contact info, address, logo
- **API Configuration**: Manage API keys
- **Email Settings**: Configure notifications

---

## User Roles & Permissions

### 1. Administrator (Admin)
- **Access**: Full system access
- **Permissions**:
  - User management (create, edit, delete)
  - All CRM operations
  - All ERP operations
  - Website management
  - System settings
  - Report viewing
  - Financial data access

### 2. Staff
- **Access**: CRM and basic ERP functions
- **Permissions**:
  - Customer management
  - Order creation (limited)
  - Lead management
  - Quote creation
  - View own reports
  - Cannot access: Finance, user management

### 3. Finance
- **Access**: Financial operations
- **Permissions**:
  - Invoice management
  - Payment processing
  - Expense tracking
  - Financial reports
  - Customer credit limits
  - Cannot access: Product edit, order creation

### 4. Customer
- **Access**: Limited self-service
- **Permissions**:
  - View own orders
  - View own invoices
  - Download quotes
  - Contact support
  - Cannot access: Create orders, view other customers

---

## Configuration

### Django Settings (`erp_backend/settings.py`)

#### Database Configuration
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'crm_erp_system',
        'USER': 'root',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

#### JWT Settings
```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}
```

#### CORS Settings
```python
CORS_ALLOW_ALL_ORIGINS = True  # Change for production
CORS_TRUSTED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:8000',
]
```

#### REST Framework
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
}
```

#### Stripe Configuration
```python
STRIPE_PUBLIC_KEY = os.getenv('STRIPE_PUBLIC_KEY', 'pk_test_...')
STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY', 'sk_test_...')
```

### Frontend Configuration (`frontend/vite.config.js`)
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})
```

---

## Features Overview

### 🎯 Core Features
- ✅ Complete user authentication with JWT
- ✅ Role-based access control (RBAC)
- ✅ Customer relationship management
- ✅ Enterprise resource planning
- ✅ Product & inventory management
- ✅ Order and invoice management
- ✅ Payment processing with Stripe
- ✅ Lead and quote management
- ✅ Expense tracking
- ✅ Financial reporting

### 📊 Analytics & Reporting
- ✅ Dashboard with KPIs
- ✅ Sales analytics
- ✅ Customer reports
- ✅ Product performance
- ✅ Financial summaries
- ✅ Export to Excel/PDF

### 🌐 Website Management
- ✅ Homepage content editor
- ✅ Product gallery
- ✅ Customer testimonials
- ✅ FAQ management
- ✅ Partner showcase
- ✅ SEO optimization

### 📱 User Experience
- ✅ Responsive design (mobile-friendly)
- ✅ Intuitive navigation
- ✅ Dark mode support
- ✅ Search and filtering
- ✅ Real-time updates
- ✅ Data export functionality

---

## Troubleshooting

### Common Issues & Solutions

#### 1. Database Connection Error
**Error**: `(1045, "Access denied for user 'root'@'localhost'")`

**Solution**:
```bash
# Check MySQL is running
mysql -u root -p

# Update settings.py with correct credentials
# Restart Django server
```

#### 2. CORS Error
**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
```python
# In settings.py
CORS_ALLOW_ALL_ORIGINS = True  # For development

# For production, specify origins:
CORS_ALLOWED_ORIGINS = [
    "https://yourdomain.com",
    "https://www.yourdomain.com",
]
```

#### 3. Static Files Not Loading
**Error**: 404 on CSS/JS files

**Solution**:
```bash
python manage.py collectstatic
# Or disable in development:
# Comment out STATIC_ROOT in settings.py
```

#### 4. JWT Token Expired
**Error**: `Token is blacklisted` or `Token is invalid`

**Solution**:
```javascript
// Clear localStorage and re-login
localStorage.removeItem('crm_jwt');
localStorage.removeItem('crm_role');
// Redirect to login
window.location.href = '/login';
```

#### 5. Image Upload Fails
**Error**: `Media directory not found`

**Solution**:
```bash
# Create media directories
mkdir -p erp_backend/media/products
mkdir -p erp_backend/media/conducts
# Update permissions
chmod -R 755 erp_backend/media
```

#### 6. Vite Dev Server Won't Start
**Error**: `Port 3000 already in use`

**Solution**:
```bash
# Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# macOS/Linux
lsof -i :3000
kill -9 [PID]

# Or run on different port
npm run dev -- --port 3001
```

#### 7. Missing Python Packages
**Error**: `ModuleNotFoundError: No module named 'xyz'`

**Solution**:
```bash
# Reinstall dependencies
pip install -r requirements.txt
# Or install specific package
pip install package_name
```

#### 8. MySQL Migration Error
**Error**: `Table already exists` or `Column already exists`

**Solution**:
```bash
# Check migration status
python manage.py showmigrations

# Rollback to specific migration
python manage.py migrate app_name 0001

# Reapply migrations
python manage.py migrate
```

### Debug Mode

#### Enable Debug Logging
```python
# In settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'DEBUG',
    },
}
```

#### Check API in Browser
```
http://localhost:8000/api/health/
http://localhost:8000/api/
```

---

## Performance Optimization

### Backend Optimization
- Database indexing on frequently queried fields
- Pagination for large datasets (default: 50 items)
- Query optimization with `select_related()` and `prefetch_related()`
- Caching for frequently accessed data
- Gzip compression for responses

### Frontend Optimization
- Code splitting with React lazy loading
- Vite bundle optimization
- Image lazy loading
- Tailwind CSS minification
- Production build: `npm run build`

---

## Security Considerations

### IMPORTANT: Production Checklist
- [ ] Change `SECRET_KEY` in settings.py
- [ ] Set `DEBUG = False` in production
- [ ] Use environment variables for sensitive data
- [ ] Configure HTTPS/SSL certificates
- [ ] Enable CSRF protection properly
- [ ] Restrict CORS to specific domains
- [ ] Use strong database passwords
- [ ] Implement rate limiting
- [ ] Enable request logging
- [ ] Regular security updates

### Password Security
- Minimum 8 characters
- Mix of uppercase, lowercase, numbers, special chars
- Passwords hashed with Django's PBKDF2

### API Security
- JWT tokens expire after 1 day
- Refresh tokens valid for 7 days
- Tokens stored in httpOnly cookies (recommended)
- Rate limiting on login attempts

---

## Deployment Guide

### Deploying to Production

#### Using Gunicorn + Nginx
```bash
# Install Gunicorn
pip install gunicorn

# Run Gunicorn
gunicorn erp_backend.wsgi:application --bind 0.0.0.0:8000

# Build frontend
npm run build
# Serve dist folder with Nginx
```

#### Environment Variables
Create `.env` file:
```
DEBUG=False
SECRET_KEY=your-secret-key-here
DATABASE_URL=mysql://user:pass@host:port/dbname
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
```

---

## Support & Resources

### Documentation Files
- [Homepage CMS Docs](./erp_backend/README_HOMEPAGE_CMS.md)
- [Quick Start Website Controller](./QUICK_START_WEBSITE_CONTROLLER.md)
- [Website Database Setup](./WEBSITE_DATABASE_SETUP_SUMMARY.md)

### External Resources
- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite Guide](https://vitejs.dev/)

### Contact & Support
- GitHub: [sidharth2838/CRM_ERP](https://github.com/sidharth2838/CRM_ERP)
- Issues: Report bugs via GitHub Issues
- Email: [your-email@example.com]

---

## License

This project is licensed under the MIT License - see LICENSE file for details.

---

## Changelog

### Latest Updates (v1.0.0)
- ✅ Complete CRM/ERP system implementation
- ✅ Website management system
- ✅ Stripe payment integration
- ✅ Excel import/export functionality
- ✅ Role-based access control
- ✅ Comprehensive documentation

---

**Last Updated**: December 19, 2025  
**Project Status**: ✅ Active Development  
**Current Version**: 1.0.0
