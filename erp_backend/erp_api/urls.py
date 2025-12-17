from django.urls import path, re_path
from . import views

urlpatterns = [
    # Dashboard template view (empty path = dashboard/)
    path('', views.dashboard_view, name='dashboard'),
    path('crm/', views.crm_dashboard_view, name='crm_dashboard'),
    
    # Dashboard page routes
    path('customers/', views.customers_page, name='customers'),
    path('products/', views.products_page, name='products'),
    path('orders/', views.orders_page, name='orders'),
    path('inventory/', views.inventory_page, name='inventory'),
    path('leads/', views.leads_page, name='leads'),
    path('payments/', views.payments_page, name='payments'),
    path('invoices/', views.invoices_page, name='invoices'),
    path('reports/', views.reports_page, name='reports'),
    path('settings/', views.settings_page, name='settings'),
    path('help/', views.help_page, name='help'),
    path('activity-logs/', views.activity_logs_page, name='activity_logs'),
    path('companies/', views.companies_page, name='companies'),
    path('expenses/', views.expenses_page, name='expenses'),
    path('permissions/', views.permissions_page, name='permissions'),
    path('product-categories/', views.product_categories_page, name='product_categories'),
    path('product-tracking/', views.product_tracking_page, name='product_tracking'),
    path('test-api/', views.test_api_page, name='test_api'),
    
    # Handle .html requests by redirecting to proper URL (including nested paths)
    re_path(r'^(?P<path>[\w/\-]+\.html)$', views.html_redirect, name='html_redirect'),
    
    # API endpoints for customers
    path('api/add-customer/', views.api_add_customer, name='api_add_customer'),
    path('api/get-customers/', views.api_get_customers, name='api_get_customers'),
    path('api/customers/', views.CustomersAPIView.as_view(), name='api_customers_list'),
    path('api/customers/<int:customer_id>/', views.CustomerDetailAPIView.as_view(), name='api_customer_detail'),
    path('api/customers/export/', views.CustomerExportAPIView.as_view(), name='api_customer_export'),
    
    # API endpoints for products
    path('api/products/', views.ProductsAPIView.as_view(), name='api_products_list'),
    path('api/products/<int:product_id>/', views.ProductDetailAPIView.as_view(), name='api_product_detail'),
    
    # API endpoints for categories
    path('api/categories/', views.CategoriesAPIView.as_view(), name='api_categories'),
    path('dashboard/api/categories/', views.CategoriesAPIView.as_view(), name='api_categories_dashboard'),
    
    # Dashboard API endpoints for products and customers
    path('dashboard/api/products/', views.ProductsAPIView.as_view(), name='api_products_list_dashboard'),
    path('dashboard/api/products/<int:product_id>/', views.ProductDetailAPIView.as_view(), name='api_product_detail_dashboard'),
    path('dashboard/api/customers/', views.CustomersAPIView.as_view(), name='api_customers_list_dashboard'),
    path('dashboard/api/customers/<int:customer_id>/', views.CustomerDetailAPIView.as_view(), name='api_customer_detail_dashboard'),
    
    # API endpoints for orders
    path('api/orders/', views.OrdersAPIView.as_view(), name='api_orders_list'),
    path('api/orders/<int:order_id>/', views.OrderDetailAPIView.as_view(), name='api_order_detail'),
    path('dashboard/api/orders/', views.OrdersAPIView.as_view(), name='api_orders_list_dashboard'),
    path('dashboard/api/orders/<int:order_id>/', views.OrderDetailAPIView.as_view(), name='api_order_detail_dashboard'),
    
    # API endpoints for invoices
    path('api/invoices/', views.InvoicesAPIView.as_view(), name='api_invoices_list'),
    path('api/invoices/<int:invoice_id>/', views.InvoiceDetailAPIView.as_view(), name='api_invoice_detail'),
    path('dashboard/api/invoices/', views.InvoicesAPIView.as_view(), name='api_invoices_list_dashboard'),
    path('dashboard/api/invoices/<int:invoice_id>/', views.InvoiceDetailAPIView.as_view(), name='api_invoice_detail_dashboard'),
    
    # API endpoints for leads
    path('api/leads/', views.LeadsAPIView.as_view(), name='api_leads_list'),
    path('api/leads/<int:lead_id>/', views.LeadDetailAPIView.as_view(), name='api_lead_detail'),
    path('dashboard/api/leads/', views.LeadsAPIView.as_view(), name='api_leads_list_dashboard'),
    path('dashboard/api/leads/<int:lead_id>/', views.LeadDetailAPIView.as_view(), name='api_lead_detail_dashboard'),
    path('dashboard/api/leads/export/', views.LeadsExportAPIView.as_view(), name='api_leads_export_dashboard'),
    path('dashboard/api/leads/import/', views.LeadsImportAPIView.as_view(), name='api_leads_import_dashboard'),
    
    # API endpoints for payments
    path('api/payments/', views.PaymentsAPIView.as_view(), name='api_payments_list'),
    path('api/payments/<int:payment_id>/', views.PaymentDetailAPIView.as_view(), name='api_payment_detail'),
    path('dashboard/api/payments/', views.PaymentsAPIView.as_view(), name='api_payments_list_dashboard'),
    path('dashboard/api/payments/<int:payment_id>/', views.PaymentDetailAPIView.as_view(), name='api_payment_detail_dashboard'),
    
    # User management API endpoints
    path('api/users/staff-finance/', views.get_staff_finance_users, name='api_get_staff_finance_users'),
    path('api/users/create-staff/', views.create_staff_user, name='api_create_staff'),
    path('api/users/create-finance/', views.create_finance_user, name='api_create_finance'),
    path('api/users/<int:user_id>/delete/', views.delete_user, name='api_delete_user'),
    
    # CMS Management Routes (in CRM)
    path('cms/', views.cms_dashboard, name='cms_dashboard'),
    path('cms/content/', views.cms_content_list, name='cms_content_list'),
    path('cms/content/add/', views.cms_add_content, name='cms_add_content'),
    path('cms/content/<int:content_id>/', views.cms_view_content, name='cms_view_content'),
    path('cms/content/<int:content_id>/delete/', views.cms_delete_content, name='cms_delete_content'),
    path('cms/pages/', views.cms_pages_list, name='cms_pages_list'),
    path('cms/pages/add/', views.cms_add_page, name='cms_add_page'),
    path('cms/pages/<int:page_id>/', views.cms_view_page, name='cms_view_page'),
    path('cms/pages/<int:page_id>/delete/', views.cms_delete_page, name='cms_delete_page'),
    path('cms/pages/<int:page_id>/add-section/', views.cms_add_section, name='cms_add_section'),
    path('cms/sections/<int:section_id>/delete/', views.cms_delete_section, name='cms_delete_section'),
    
    # Website CMS Management Pages (Dashboard)
    path('dashboard/cms/hero-headers/', views.cms_hero_headers_page, name='cms_hero_headers_page'),
    path('dashboard/cms/conducts/', views.cms_conducts_page, name='cms_conducts_page'),
    path('dashboard/cms/featured-products/', views.cms_products_page, name='cms_products_page'),
    path('dashboard/cms/enquiries/', views.cms_enquiries_page, name='cms_enquiries_page'),
]