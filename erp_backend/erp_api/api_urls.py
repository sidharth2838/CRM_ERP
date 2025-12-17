from django.urls import path
from . import views
from . import website_views
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from datetime import datetime

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    """API Root - List all available endpoints"""
    return Response({
        'status': 'ok',
        'message': 'FC/CRM API v1.0',
        'timestamp': datetime.now().isoformat(),
        'endpoints': {
            'health': '/api/health/',
            'auth': {
                'register': '/api/register/',
                'login': '/api/login/',
            },
            'dashboard': '/api/dashboard/',
            'customers': '/api/customers/',
            'products': '/api/products/',
            'orders': '/api/orders/',
            'leads': '/api/leads/',
            'invoices': '/api/invoices/',
            'payments': '/api/payments/',
            'homepage': '/api/homepage/',
        }
    })

urlpatterns = [
    # API Root
    path('', api_root, name='api_root'),
    
    # Health check
    path('health/', views.health_check, name='health_check'),
    
    # REST API Views
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('dashboard/', views.DashboardView.as_view(), name='api_dashboard'),
    path('reports/', views.ReportsView.as_view(), name='reports'),
    
    # Staff & Finance User Management
    path('users/create-staff/', views.create_staff_user, name='create_staff_user'),
    path('users/create-finance/', views.create_finance_user, name='create_finance_user'),
    path('users/staff-finance/', views.get_staff_finance_users, name='get_staff_finance_users'),
    path('users/<int:user_id>/delete/', views.delete_user, name='delete_user'),
    
    # AJAX API Endpoints
    path('dashboard/data/', views.api_dashboard_data, name='api_dashboard_data'),
    path('customers/add/', views.api_add_customer, name='api_add_customer'),
    path('products/add/', views.api_add_product, name='api_add_product'),
    path('orders/create/', views.api_create_order, name='api_create_order'),
    path('leads/add/', views.api_add_lead, name='api_add_lead'),
    
    # Data retrieval - Legacy endpoints
    path('customers-legacy/', views.api_get_customers, name='api_get_customers'),
    path('products/', views.api_get_products, name='api_get_products'),
    path('orders/', views.api_get_orders, name='api_get_orders'),
    path('leads/', views.api_get_leads, name='api_get_leads'),
    
    # New API Endpoints with Classes
    path('customers/', views.CustomersAPIView.as_view(), name='api_customers_list'),
    path('customers/<int:customer_id>/', views.CustomerDetailAPIView.as_view(), name='api_customer_detail'),
    path('customers/export/', views.CustomerExportAPIView.as_view(), name='api_customer_export'),
    
    # Companies endpoints
    path('companies/', views.CompaniesAPIView.as_view(), name='api_companies_list'),
    path('companies/<int:company_id>/', views.CompanyDetailAPIView.as_view(), name='api_company_detail'),
    
    # Leads endpoints
    path('leads/', views.LeadsAPIView.as_view(), name='api_leads_list'),
    path('leads/<int:lead_id>/', views.LeadDetailAPIView.as_view(), name='api_lead_detail'),
    path('leads/export/', views.LeadsExportAPIView.as_view(), name='api_leads_export'),
    path('leads/import/', views.LeadsImportAPIView.as_view(), name='api_leads_import'),
    
    # Legacy customer operations
    path('customers-legacy/<int:customer_id>/', views.api_customer_detail_legacy, name='api_customer_detail_legacy'),
    path('customers-legacy/<int:customer_id>/delete/', views.api_delete_customer_legacy, name='api_delete_customer_legacy'),
    path('customers-legacy-list/', views.api_customers_list_legacy, name='api_customers_list_legacy'),
    
    # Update operations
    path('orders/<int:order_id>/status/', views.api_update_order_status, name='api_update_order_status'),
    
    # Search
    path('search/', views.api_search, name='api_search'),
    
    # ============= CMS & WEBSITE MANAGEMENT APIs =============
    # Hero Headers
    path('hero-headers/', views.hero_headers_list, name='api_hero_headers_list'),
    path('hero-headers/<int:header_id>/', views.hero_header_detail, name='api_hero_header_detail'),
    
    # Website Conducts
    path('conducts/', views.conducts_list, name='api_conducts_list'),
    path('conducts/<int:conduct_id>/', views.conduct_detail, name='api_conduct_detail'),
    
    # Website Product Displays
    path('product-displays/', views.product_displays_list, name='api_product_displays_list'),
    path('product-displays/<int:display_id>/', views.product_display_detail, name='api_product_display_detail'),
    
    # Website Enquiries
    path('website-enquiries/', views.website_enquiries_create, name='api_website_enquiries'),
    path('website-enquiry/<int:enquiry_id>/', views.website_enquiry_detail, name='api_website_enquiry_detail'),
    path('website-enquiry/<int:enquiry_id>/convert-to-lead/', views.convert_enquiry_to_lead, name='api_convert_enquiry_to_lead'),
    
    # ============= HOMEPAGE CMS API ENDPOINTS =============
    # Hero Section
    path('homepage/hero/', views.HomepageHeroAPIView.as_view(), name='api_homepage_hero'),
    
    # Features
    path('homepage/features/', views.HomepageFeaturesAPIView.as_view(), name='api_homepage_features'),
    
    # Sections (Why Us, Details, Stories, Instagram, Testimonials)
    # TODO: Implement missing view classes: HomepageWhyUsAPIView, HomepageDetailsAPIView, etc.
    # path('homepage/why-us/', views.HomepageWhyUsAPIView.as_view(), name='api_homepage_why_us'),
    # path('homepage/details/', views.HomepageDetailsAPIView.as_view(), name='api_homepage_details'),
    # path('homepage/stories/', views.HomepageStoriesAPIView.as_view(), name='api_homepage_stories'),
    # path('homepage/instagram/', views.HomepageInstagramAPIView.as_view(), name='api_homepage_instagram'),
    path('homepage/testimonials/', views.HomepageTestimonialsAPIView.as_view(), name='api_homepage_testimonials'),
    
    # Navigation & Footer
    path('homepage/navigation/', views.HomepageNavigationAPIView.as_view(), name='api_homepage_navigation'),
    path('homepage/footer/', views.HomepageFooterAPIView.as_view(), name='api_homepage_footer'),
    path('homepage/social/', views.HomepageSocialAPIView.as_view(), name='api_homepage_social'),
    path('homepage/seo/', views.HomepageSEOAPIView.as_view(), name='api_homepage_seo'),
    
    # Site Info
    path('siteinfo/', views.SiteInfoView.as_view(), name='siteinfo'),
    
    # ============= HOMEPAGE SHORTCUTS (without /homepage/ prefix) =============
    path('homepagefeatures/', views.HomepageFeaturesAPIView.as_view(), name='api_homepagefeatures_shortcut'),
    path('homepagetestimonials/', views.HomepageTestimonialsAPIView.as_view(), name='api_homepagetestimonials_shortcut'),
    path('homepagenavigation/', views.HomepageNavigationAPIView.as_view(), name='api_homepagenavigation_shortcut'),
    path('homepagefootersection/', views.HomepageFooterAPIView.as_view(), name='api_homepagefootersection_shortcut'),
    path('homepagesociallink/', views.HomepageSocialAPIView.as_view(), name='api_homepagesociallink_shortcut'),
    path('homepageseo/', views.HomepageSEOAPIView.as_view(), name='api_homepageseo_shortcut'),
    
    # User Profile endpoint
    path('userprofile/', views.UserProfileAPIView.as_view(), name='api_userprofile'),
    
    # ============= WEBSITE CONTENT MANAGEMENT APIs =============
    # Stories
    path('website/stories/', views.WebsiteStoryListCreateView.as_view(), name='api_website_stories'),
    path('website/stories/<int:pk>/', views.WebsiteStoryDetailView.as_view(), name='api_website_story_detail'),
    
    # Testimonials
    path('website/testimonials/', views.WebsiteTestimonialListCreateView.as_view(), name='api_website_testimonials'),
    path('website/testimonials/<int:pk>/', views.WebsiteTestimonialDetailView.as_view(), name='api_website_testimonial_detail'),
    
    # Gallery
    path('website/gallery/', views.WebsiteGalleryListCreateView.as_view(), name='api_website_gallery'),
    path('website/gallery/<int:pk>/', views.WebsiteGalleryDetailView.as_view(), name='api_website_gallery_detail'),
    
    # FAQ
    path('website/faq/', views.WebsiteFAQListCreateView.as_view(), name='api_website_faq'),
    path('website/faq/<int:pk>/', views.WebsiteFAQDetailView.as_view(), name='api_website_faq_detail'),
    
    # Partners
    path('website/partners/', views.WebsitePartnerListCreateView.as_view(), name='api_website_partners'),
    path('website/partners/<int:pk>/', views.WebsitePartnerDetailView.as_view(), name='api_website_partner_detail'),
    
    # Hero Section
    path('website/hero/', views.WebsiteHeroSectionView.as_view(), name='api_website_hero'),
    
    # Collections Section
    path('website/collections/', views.WebsiteCollectionsSectionView.as_view(), name='api_website_collections'),
    
    # Quality Section
    path('website/quality/', views.WebsiteQualitySectionView.as_view(), name='api_website_quality'),
    
    # Furniture Details Section
    path('website/furniture-details/', views.WebsiteFurnitureDetailsSectionView.as_view(), name='api_website_furniture_details'),
    
    # Testimonials Section Settings
    path('website/testimonials-section/', views.WebsiteTestimonialsSectionSettingsView.as_view(), name='api_website_testimonials_section'),
    
    # Stories Section Settings
    path('website/stories-section/', views.WebsiteStoriesSectionSettingsView.as_view(), name='api_website_stories_section'),
    
    # Newsletter
    path('website/newsletter/', views.WebsiteNewsletterView.as_view(), name='api_website_newsletter'),
    
    # Image Upload
    path('website/upload-image/', views.ImageUploadView.as_view(), name='api_upload_image'),
    
    # Bulk save all website data
    path('website/save-all/', views.WebsiteDataBulkSaveView.as_view(), name='api_website_save_all'),
    
    # Navbar & Footer Management (Website Controller)
    path('website/navbar/get/', website_views.api_get_navbar_config, name='api_get_navbar'),
    path('website/navbar/save/', website_views.api_save_navbar_item, name='api_save_navbar'),
    path('website/navbar/delete/', website_views.api_delete_navbar_item, name='api_delete_navbar'),
    
    path('website/footer/get/', website_views.api_get_footer_config, name='api_get_footer'),
    path('website/footer/section/save/', website_views.api_save_footer_section, name='api_save_footer_section'),
    path('website/footer/section/delete/', website_views.api_delete_footer_section, name='api_delete_footer_section'),
    path('website/footer/link/save/', website_views.api_save_footer_link, name='api_save_footer_link'),
    path('website/footer/link/delete/', website_views.api_delete_footer_link, name='api_delete_footer_link'),
    path('website/footer/social/save/', website_views.api_save_social_link, name='api_save_social_link'),
    path('website/footer/social/delete/', website_views.api_delete_social_link, name='api_delete_social_link'),
    
    # Catalog/Products (Public)
    path('products/catalog/', website_views.api_catalog_products, name='api_catalog_products'),
    path('products/categories/', website_views.api_product_categories, name='api_product_categories'),
]