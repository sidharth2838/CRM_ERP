"""
Website URL routing for customer inquiries and public pages
"""
from django.urls import path
from . import website_views

app_name = 'website'

urlpatterns = [
    # Public website pages
    path('website/', website_views.website_home, name='home'),
    path('website/products/', website_views.website_products, name='products'),
    path('website/product/<int:product_id>/', website_views.website_product_detail, name='product_detail'),
    path('website/product/<int:product_id>/buy/', website_views.website_product_buy, name='product_buy'),
    path('website/contact/', website_views.website_contact, name='contact'),
    path('website/about/', website_views.website_about, name='about'),
    path('website/services/', website_views.website_services, name='services'),
    path('website/faq/', website_views.website_faq, name='faq'),
    
    # Inquiry submission
    path('website/submit-inquiry/', website_views.submit_inquiry, name='submit_inquiry'),
    path('website/inquiry-confirmation/<int:lead_id>/', website_views.inquiry_confirmation, name='inquiry_confirmation'),
    
    # CMS Pages & Content
    path('website/page/<slug:page_slug>/', website_views.cms_get_page, name='cms_page'),
    path('website/content/<slug:content_slug>/', website_views.cms_get_content, name='cms_content'),
    path('website/featured/', website_views.cms_featured_content, name='cms_featured'),
    path('website/announcements/', website_views.cms_announcements, name='cms_announcements'),
    path('website/testimonials/', website_views.cms_testimonials, name='cms_testimonials'),
    path('website/<str:content_type>/', website_views.cms_list_content_by_type, name='cms_list'),
    
    # API endpoints - Website
    path('api/website/inquiry/', website_views.api_quick_inquiry, name='api_inquiry'),
    
    # Authentication - Website
    path('website/signup/', website_views.website_signup, name='signup'),
    path('website/login/', website_views.website_login, name='login'),
    path('website/logout/', website_views.website_logout, name='logout'),
    path('website/account/', website_views.website_account, name='account'),
    
    # Shopping Cart & Checkout
    path('website/cart/', website_views.website_cart, name='cart'),
    path('website/checkout/', website_views.website_checkout, name='checkout'),
    path('website/order-confirmation/<int:order_id>/', website_views.order_confirmation, name='order_confirmation'),
    path('website/orders/', website_views.website_orders, name='orders'),
    
    # API - Shopping
    path('api/website/cart/add/', website_views.api_add_to_cart, name='api_add_cart'),
    path('api/website/cart/remove/', website_views.api_remove_from_cart, name='api_remove_cart'),
    path('api/website/cart/get/', website_views.api_get_cart, name='api_get_cart'),
    path('api/website/checkout/', website_views.api_checkout, name='api_checkout'),
    
    # API - Product Details
    path('api/website/product/<int:product_id>/', website_views.api_product_detail, name='api_product_detail'),
    
    # API - Payment Processing
    path('api/website/payment/create-intent/', website_views.api_create_payment_intent, name='api_create_payment_intent'),
    path('api/website/payment/confirm/', website_views.api_confirm_payment, name='api_confirm_payment'),
    
    # API - Buy Now (Direct Purchase)
    path('api/website/buy-now/', website_views.api_buy_now, name='api_buy_now'),
    path('api/website/order/update-address/', website_views.api_update_order_address, name='api_update_order_address'),
    path('api/website/process-buy-cod/', website_views.api_process_buy_cod, name='api_process_buy_cod'),
    path('api/website/process-buy-card/', website_views.api_process_buy_card, name='api_process_buy_card'),
    path('website/order-checkout/<int:order_id>/', website_views.order_checkout_page, name='order_checkout'),
    
    # API endpoints - CMS
    path('api/cms/page/<slug:page_slug>/', website_views.api_cms_page, name='api_cms_page'),
    path('api/cms/content/<slug:content_slug>/', website_views.api_cms_content, name='api_cms_content'),
    path('api/cms/list/', website_views.api_cms_list, name='api_cms_list'),
    path('api/cms/list/<str:content_type>/', website_views.api_cms_list, name='api_cms_list_type'),
    
    # API endpoints - Navbar & Footer Management (Website Controller)
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
]
