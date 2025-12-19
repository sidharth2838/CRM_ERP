# CRM/ERP System - Complete Project Documentation

[![GitHub](https://img.shields.io/badge/GitHub-sidharth2838%2FCRM__ERP-blue)](https://github.com/sidharth2838/CRM_ERP)
[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-4.2.7-darkgreen)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18.3.1-cyan)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Installation & Setup](#installation--setup)
5. [Running the Project](#running-the-project)
6. [Project Structure](#project-structure)
7. [API Endpoints](#api-endpoints)
8. [User Roles & Permissions](#user-roles--permissions)
9. [Configuration](#configuration)
10. [Troubleshooting](#troubleshooting)
11. [Contributing](#contributing)
12. [License](#license)

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
- ✅ RESTful API architecture (50+ endpoints)
- ✅ Modern UI with Tailwind CSS
- ✅ Content management system for website
- ✅ Multi-role user system (Admin, Staff, Finance, Customer)
- ✅ Stripe payment integration
- ✅ Excel import/export functionality

---

## Features

### 🎯 Core Features
- Complete user authentication with JWT tokens
- Role-based access control (RBAC)
- Customer relationship management
- Enterprise resource planning
- Product & inventory management
- Order and invoice management
- Payment processing with Stripe
- Lead and quote management
- Expense tracking
- Financial reporting

### 📊 Analytics & Reporting
- Dashboard with KPIs and metrics
- Sales analytics and trends
- Customer reports and insights
- Product performance analysis
- Financial summaries
- Export to Excel/PDF

### 🌐 Website Management
- Homepage content editor
- Product gallery management
- Customer testimonials
- FAQ management
- Partner showcase
- SEO optimization

### 📱 User Experience
- Responsive design (mobile-friendly)
- Intuitive navigation
- Search and filtering
- Real-time data updates
- Data export functionality
- Multi-page application

---

## Technology Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Python** | 3.8+ | Programming language |
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
        'PASSWORD': 'your_password',     # MySQL password
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
│
├── erp_api/                 # Main application
│   ├── models.py            # Database models (1200+ lines)
│   ├── views.py             # API views (5400+ lines)
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
├── manage.py               # Django management command
└── requirements.txt        # Python dependencies
```

### Frontend Structure
```
frontend/
├── src/
│   ├── pages/               # Page components
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── CustomersPage.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── OrderPage.jsx
│   │   ├── InvoicesPage.jsx
│   │   └── ... (15+ pages)
│   │
│   ├── components/          # Reusable components
│   │   ├── Topbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── DataTable.jsx
│   │
│   ├── api/                 # API integration
│   ├── services/            # Business logic
│   ├── styles/              # CSS files
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
│
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
└── jsconfig.json           # JavaScript config
```

---

## API Endpoints

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register/` | Register new user |
| POST | `/api/login/` | User login |
| GET | `/api/user-profile/` | Get current user |

### Dashboard & Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/` | Dashboard metrics |
| GET | `/api/reports/` | Sales reports |
| GET | `/api/reports/sales-summary/` | Sales summary |

### Customers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/customers/` | List customers |
| POST | `/api/customers/` | Create customer |
| GET | `/api/customers/{id}/` | Get customer details |
| PUT | `/api/customers/{id}/` | Update customer |
| DELETE | `/api/customers/{id}/` | Delete customer |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products/` | List products |
| POST | `/api/products/` | Create product |
| GET | `/api/products/{id}/` | Get product details |
| PUT | `/api/products/{id}/` | Update product |
| DELETE | `/api/products/{id}/` | Delete product |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders/` | List orders |
| POST | `/api/orders/` | Create order |
| GET | `/api/orders/{id}/` | Get order details |
| PUT | `/api/orders/{id}/` | Update order |

### Invoices
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/invoices/` | List invoices |
| POST | `/api/invoices/` | Create invoice |
| GET | `/api/invoices/{id}/` | Get invoice PDF |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/payments/` | List payments |
| POST | `/api/payments/` | Record payment |
| POST | `/api/payments/stripe/` | Process Stripe payment |

### Leads
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leads/` | List leads |
| POST | `/api/leads/` | Create lead |
| PUT | `/api/leads/{id}/` | Update lead |
| POST | `/api/leads/export/` | Export to Excel |
| POST | `/api/leads/import/` | Import from Excel |

### Expenses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses/` | List expenses |
| POST | `/api/expenses/` | Create expense |
| DELETE | `/api/expenses/{id}/` | Delete expense |

### Website Content
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/website/hero/` | Get hero section |
| GET | `/api/website/gallery/` | Get gallery |
| GET | `/api/website/testimonials/` | Get testimonials |
| GET | `/api/website/faq/` | Get FAQ |
| GET | `/api/website/partners/` | Get partners |

---

## User Roles & Permissions

### 1. Administrator (Admin)
- ✅ Full system access
- ✅ User management
- ✅ All CRM & ERP operations
- ✅ Website management
- ✅ System settings
- ✅ Financial data access

### 2. Staff
- ✅ Customer management
- ✅ Order creation (limited)
- ✅ Lead management
- ✅ Quote creation
- ✅ View own reports
- ❌ Cannot access: Finance, user management

### 3. Finance
- ✅ Invoice management
- ✅ Payment processing
- ✅ Expense tracking
- ✅ Financial reports
- ✅ Customer credit limits
- ❌ Cannot access: Product edit, order creation

### 4. Customer
- ✅ View own orders
- ✅ View own invoices
- ✅ Download quotes
- ✅ Contact support
- ❌ Cannot access: Create orders, view other customers

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

---

## Troubleshooting

### Common Issues & Solutions

#### 1. Database Connection Error
```
Error: (1045, "Access denied for user 'root'@'localhost'")
Solution: Update DATABASE credentials in settings.py
```

#### 2. CORS Error
```
Error: Access to XMLHttpRequest blocked by CORS policy
Solution: Set CORS_ALLOW_ALL_ORIGINS = True in settings.py
```

#### 3. Static Files Not Loading
```
Error: 404 on CSS/JS files
Solution: Run python manage.py collectstatic
```

#### 4. JWT Token Expired
```
Error: Token is invalid
Solution: Clear localStorage and re-login
```

#### 5. Port Already in Use
```
Error: Port 3000 already in use (Vite)
Solution: npm run dev -- --port 3001
```

#### 6. Missing Python Packages
```
Error: ModuleNotFoundError
Solution: pip install -r requirements.txt
```

---

## Performance Optimization

### Backend
- Database indexing on frequently queried fields
- Pagination for large datasets (default: 50 items)
- Query optimization with `select_related()` and `prefetch_related()`
- Caching for frequently accessed data

### Frontend
- Code splitting with React lazy loading
- Vite bundle optimization
- Image lazy loading
- Tailwind CSS minification

**Production build:**
```bash
npm run build
```

---

## Security Considerations

### IMPORTANT: Production Checklist
- [ ] Change `SECRET_KEY` in settings.py
- [ ] Set `DEBUG = False` in production
- [ ] Use environment variables for sensitive data
- [ ] Configure HTTPS/SSL certificates
- [ ] Restrict CORS to specific domains
- [ ] Use strong database passwords
- [ ] Implement rate limiting
- [ ] Enable request logging
- [ ] Regular security updates

### API Security
- JWT tokens expire after 1 day
- Refresh tokens valid for 7 days
- Rate limiting on login attempts
- Password hashed with Django's PBKDF2

---

## Deployment Guide

### Using Gunicorn + Nginx
```bash
# Install Gunicorn
pip install gunicorn

# Run Gunicorn
gunicorn erp_backend.wsgi:application --bind 0.0.0.0:8000

# Build frontend
npm run build
# Serve dist folder with Nginx
```

### Environment Variables (.env)
```
DEBUG=False
SECRET_KEY=your-secret-key-here
DATABASE_URL=mysql://user:pass@host:port/dbname
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Support & Resources

### Documentation Files
- [Complete Documentation](./PROJECT_DOCUMENTATION.md)
- [Homepage CMS Docs](./erp_backend/README_HOMEPAGE_CMS.md)
- [Website Database Setup](./WEBSITE_DATABASE_SETUP_SUMMARY.md)

### External Resources
- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite Guide](https://vitejs.dev/)

### Contact & Support
- GitHub Issues: [Report bugs](https://github.com/sidharth2838/CRM_ERP/issues)
- Author: [sidharth2838](https://github.com/sidharth2838)

---

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## Changelog

### Version 1.0.0 (December 19, 2025)
- ✅ Complete CRM/ERP system implementation
- ✅ Website management system
- ✅ Stripe payment integration
- ✅ Excel import/export functionality
- ✅ Role-based access control
- ✅ Comprehensive documentation
- ✅ 50+ API endpoints
- ✅ 15+ frontend pages

---

## Quick Start

```bash
# 1. Clone and setup
git clone https://github.com/sidharth2838/CRM_ERP.git
cd "CRM ERP"

# 2. Backend
python -m venv venv
venv\Scripts\activate
cd erp_backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# 3. Frontend (in new terminal)
cd frontend
npm install
npm run dev

# 4. Open browser
# Frontend: http://localhost:3000/
# Admin: http://localhost:8000/admin/
```

---

**Last Updated**: December 19, 2025  
**Project Status**: ✅ Active Development  
**Current Version**: 1.0.0

**Made with ❤️ by [sidharth2838](https://github.com/sidharth2838)**
