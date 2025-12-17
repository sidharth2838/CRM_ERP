
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Administrator'),
        ('staff', 'Staff'),
        ('finance', 'Finance'),
        ('customer', 'Customer'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    unique_id = models.CharField(max_length=50, unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    phone = models.CharField(max_length=20, blank=True, null=True)
    department = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = 'user_profiles'

    def __str__(self):
        return f"{self.user.username} - {self.role}"

class SiteInfo(models.Model):
    heading = models.CharField(max_length=255, default="Welcome to CozyCorner")
    subheading = models.TextField(blank=True, null=True)
    hero_image = models.ImageField(upload_to='siteinfo/', blank=True, null=True)
    about_text = models.TextField(blank=True, null=True)
    contact_email = models.EmailField(blank=True, null=True)
    contact_phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'site_info'

    def __str__(self):
        return self.heading

class Company(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    contact_person = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    class Meta:
        db_table = 'companies'

    def __str__(self):
        return self.name

# All model definitions should follow here, with no duplicate imports or stray code

class HomepageFeature(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    icon_type = models.CharField(max_length=50, blank=True)  # e.g., 'svg', 'image', 'fontawesome'
    icon_image = models.URLField(blank=True)
    background_color = models.CharField(max_length=20, blank=True)
    text_color = models.CharField(max_length=20, blank=True)
    accent_color = models.CharField(max_length=20, blank=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'homepage_features'
        ordering = ['order']

    def __str__(self):
        return self.title

class Customer(models.Model):
    CUSTOMER_TYPES = [
        ('regular', 'Regular'),
        ('premium', 'Premium'),
        ('minimum', 'Minimum'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True)
    customer_code = models.CharField(max_length=50, unique=True)
    customer_type = models.CharField(max_length=20, choices=CUSTOMER_TYPES, default='regular')
    billing_address = models.TextField()
    shipping_address = models.TextField()
    credit_limit = models.DecimalField(max_digits=15, decimal_places=2)
    balance = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    tax_number = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'customers'
    
    def __str__(self):
        return f"{self.user.username} ({self.customer_code})"

class ProductCategory(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'product_categories'
    
    def __str__(self):
        return self.name

class Product(models.Model):
    sku = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    category = models.ForeignKey(ProductCategory, on_delete=models.SET_NULL, null=True)
    price = models.DecimalField(max_digits=15, decimal_places=2)
    cost = models.DecimalField(max_digits=15, decimal_places=2, null=True)
    stock_quantity = models.IntegerField(default=0)
    min_stock_level = models.IntegerField(default=10)
    image = models.ImageField(upload_to='products/%Y/%m/%d/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    class Meta:
        db_table = 'products'
    
    def __str__(self):
        return self.name

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('partial', 'Partial'),
        ('paid', 'Paid'),
    ]
    
    order_number = models.CharField(max_length=100, unique=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    order_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_amount = models.DecimalField(max_digits=15, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    discount_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    grand_total = models.DecimalField(max_digits=15, decimal_places=2)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    shipping_address = models.TextField()
    notes = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    class Meta:
        db_table = 'orders'
    
    def __str__(self):
        return self.order_number

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=15, decimal_places=2)
    total_price = models.DecimalField(max_digits=15, decimal_places=2)
    
    class Meta:
        db_table = 'order_items'
    
    def __str__(self):
        return f"{self.product.name} x{self.quantity}"

class Invoice(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('sent', 'Sent'),
        ('paid', 'Paid'),
        ('overdue', 'Overdue'),
        ('cancelled', 'Cancelled'),
    ]
    
    invoice_number = models.CharField(max_length=100, unique=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    invoice_date = models.DateField()
    due_date = models.DateField()
    total_amount = models.DecimalField(max_digits=15, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    paid_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    balance_amount = models.DecimalField(max_digits=15, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    class Meta:
        db_table = 'invoices'
    
    def __str__(self):
        return self.invoice_number

class Payment(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('cash', 'Cash'),
        ('credit_card', 'Credit Card'),
        ('bank_transfer', 'Bank Transfer'),
        ('cheque', 'Cheque'),
        ('online', 'Online'),
    ]
    
    payment_number = models.CharField(max_length=100, unique=True)
    invoice = models.ForeignKey(Invoice, on_delete=models.SET_NULL, null=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    payment_date = models.DateField()
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    reference_number = models.CharField(max_length=100, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    class Meta:
        db_table = 'payments'
    
    def __str__(self):
        return self.payment_number

class Quote(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('sent', 'Sent'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('expired', 'Expired'),
    ]
    
    quote_number = models.CharField(max_length=100, unique=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    quote_date = models.DateField()
    expiry_date = models.DateField()
    total_amount = models.DecimalField(max_digits=15, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    class Meta:
        db_table = 'quotes'
    
    def __str__(self):
        return self.quote_number

class Lead(models.Model):
    SOURCE_CHOICES = [
        ('website', 'Website'),
        ('referral', 'Referral'),
        ('social_media', 'Social Media'),
        ('campaign', 'Campaign'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('new', 'New'),
        ('contacted', 'Contacted'),
        ('qualified', 'Qualified'),
        ('proposal_sent', 'Proposal Sent'),
        ('negotiation', 'Negotiation'),
        ('won', 'Won'),
        ('lost', 'Lost'),
    ]
    
    lead_number = models.CharField(max_length=100, unique=True)
    company_name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    estimated_value = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='assigned_leads')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_leads')
    
    class Meta:
        db_table = 'leads'
    
    def __str__(self):
        return f"{self.lead_number} - {self.company_name}"

class ExpenseCategory(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'expense_categories'
    
    def __str__(self):
        return self.name

class Expense(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('cash', 'Cash'),
        ('credit_card', 'Credit Card'),
        ('bank_transfer', 'Bank Transfer'),
        ('cheque', 'Cheque'),
    ]
    
    expense_number = models.CharField(max_length=100, unique=True)
    category = models.ForeignKey(ExpenseCategory, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    expense_date = models.DateField()
    description = models.TextField()
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    reference_number = models.CharField(max_length=100, blank=True, null=True)
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='approved_expenses')
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    
    class Meta:
        db_table = 'expenses'
    
    def __str__(self):
        return self.expense_number

class ProductTracking(models.Model):
    STATUS_CHOICES = [
        ('order_placed', 'Order Placed'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('in_transit', 'In Transit'),
        ('out_for_delivery', 'Out for Delivery'),
        ('delivered', 'Delivered'),
    ]
    
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    tracking_number = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='order_placed')
    location = models.CharField(max_length=255)
    estimated_delivery = models.DateField(null=True, blank=True)
    actual_delivery = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'product_tracking'
    
    def __str__(self):
        return self.tracking_number

class Permission(models.Model):
    role = models.CharField(max_length=50)
    module = models.CharField(max_length=100)
    can_view = models.BooleanField(default=False)
    can_create = models.BooleanField(default=False)
    can_edit = models.BooleanField(default=False)
    can_delete = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'permissions'
        unique_together = ['role', 'module']
    
    def __str__(self):
        return f"{self.role} - {self.module}"

class ActivityLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=100)
    table_name = models.CharField(max_length=100, null=True, blank=True)
    record_id = models.IntegerField(null=True, blank=True)
    old_values = models.JSONField(null=True, blank=True)
    new_values = models.JSONField(null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'activity_log'
    
    def __str__(self):
        return f"{self.user} - {self.action}"

class CMSContent(models.Model):
    """Content Management System - Store website content created from CRM"""
    CONTENT_TYPES = [
        ('banner', 'Banner'),
        ('section', 'Section'),
        ('page', 'Page'),
        ('testimonial', 'Testimonial'),
        ('feature', 'Feature'),
        ('announcement', 'Announcement'),
    ]
    
    slug = models.SlugField(unique=True, max_length=255)
    title = models.CharField(max_length=255)
    content_type = models.CharField(max_length=50, choices=CONTENT_TYPES, default='section')
    description = models.TextField()
    image = models.ImageField(upload_to='cms_content/', blank=True, null=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='cms_content')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'cms_content'
        ordering = ['order', '-created_at']
    
    def __str__(self):
        return f"{self.title} ({self.content_type})"

class CMSPage(models.Model):
    """Website pages managed from CRM"""
    TEMPLATE_CHOICES = [
        ('home', 'Homepage'),
        ('about', 'About Us'),
        ('services', 'Services'),
        ('products', 'Products'),
        ('contact', 'Contact'),
        ('custom', 'Custom'),
    ]
    
    slug = models.SlugField(unique=True, max_length=255)
    title = models.CharField(max_length=255)
    template_type = models.CharField(max_length=50, choices=TEMPLATE_CHOICES, default='custom')
    page_title = models.CharField(max_length=255, blank=True)
    page_description = models.TextField(blank=True)
    meta_keywords = models.CharField(max_length=255, blank=True)
    hero_image = models.ImageField(upload_to='cms_pages/', blank=True, null=True)
    is_published = models.BooleanField(default=False)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='cms_pages')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'cms_pages'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title

class CMSPageSection(models.Model):
    """Sections within CMS pages"""
    page = models.ForeignKey(CMSPage, on_delete=models.CASCADE, related_name='sections')
    content = models.ForeignKey(CMSContent, on_delete=models.CASCADE)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'cms_page_sections'
        ordering = ['order']
    
    def __str__(self):
        return f"{self.page.title} - {self.content.title}"

class WebsiteHeroHeader(models.Model):
    """Hero headers for website pages"""
    POSITION_CHOICES = [
        ('home', 'Homepage'),
        ('products', 'Products Page'),
        ('services', 'Services Page'),
        ('about', 'About Page'),
        ('contact', 'Contact Page'),
        ('custom', 'Custom Page'),
    ]
    
    page_position = models.CharField(max_length=50, choices=POSITION_CHOICES, unique=True)
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=500, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    hero_image = models.ImageField(upload_to='hero_headers/')
    cta_button_text = models.CharField(max_length=100, blank=True, null=True)
    cta_button_url = models.CharField(max_length=500, blank=True, null=True)
    background_color = models.CharField(max_length=7, default='#ffffff')
    text_color = models.CharField(max_length=7, default='#000000')
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='hero_headers')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'website_hero_headers'
        ordering = ['order']
    
    def __str__(self):
        return f"{self.page_position} - {self.title}"

class WebsiteConduct(models.Model):
    """Business conducts/values displayed on website"""
    ICON_CHOICES = [
        ('quality', 'Quality'),
        ('speed', 'Speed'),
        ('trust', 'Trust'),
        ('support', 'Support'),
        ('innovation', 'Innovation'),
        ('value', 'Value'),
        ('other', 'Other'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    icon_type = models.CharField(max_length=50, choices=ICON_CHOICES, default='other')
    icon_image = models.ImageField(upload_to='conducts/', blank=True, null=True)
    icon_css_class = models.CharField(max_length=100, blank=True, null=True, help_text="e.g., fas fa-check")
    highlight_color = models.CharField(max_length=7, default='#007bff')
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='website_conducts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'website_conducts'
        ordering = ['order']
    
    def __str__(self):
        return self.title

class WebsiteProductDisplay(models.Model):
    """Products from CRM displayed on website"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='website_displays')
    title = models.CharField(max_length=255)
    website_description = models.TextField()
    website_image = models.ImageField(upload_to='website_products/', blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    is_displayed = models.BooleanField(default=True)
    display_order = models.IntegerField(default=0)
    show_price = models.BooleanField(default=True)
    custom_price = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    call_to_action = models.CharField(max_length=100, default='Get a Quote')
    page_sections = models.CharField(
        max_length=255, 
        blank=True, 
        null=True,
        help_text="Comma-separated page sections where this product should appear (e.g., homepage, products_page)"
    )
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='website_product_displays')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'website_product_displays'
        ordering = ['-is_featured', 'display_order']
    
    def __str__(self):
        return f"{self.product.name} - Website Display"

class WebsiteEnquiry(models.Model):
    """Enquiries from website converted to CRM leads"""
    ENQUIRY_STATUS = [
        ('new', 'New'),
        ('contacted', 'Contacted'),
        ('qualified', 'Qualified'),
        ('converted', 'Converted to Lead'),
        ('rejected', 'Rejected'),
    ]
    
    ENQUIRY_TYPE = [
        ('product', 'Product Inquiry'),
        ('service', 'Service Inquiry'),
        ('partnership', 'Partnership'),
        ('support', 'Support'),
        ('other', 'Other'),
    ]
    
    enquiry_number = models.CharField(max_length=100, unique=True)
    enquiry_type = models.CharField(max_length=50, choices=ENQUIRY_TYPE, default='other')
    company_name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    subject = models.CharField(max_length=255)
    message = models.TextField()
    interested_product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=20, choices=ENQUIRY_STATUS, default='new')
    lead = models.ForeignKey(Lead, on_delete=models.SET_NULL, null=True, blank=True, related_name='website_enquiries')
    notes = models.TextField(blank=True, null=True)
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_enquiries')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    converted_at = models.DateTimeField(null=True, blank=True)
    converted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='converted_enquiries')
    
    class Meta:
        db_table = 'website_enquiries'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.enquiry_number} - {self.company_name}"

class WebsiteOrder(models.Model):
    """Orders placed through the website by customers"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('partial', 'Partial'),
        ('paid', 'Paid'),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('card', 'Credit/Debit Card'),
        ('cod', 'Cash on Delivery'),
    ]
    
    order_number = models.CharField(max_length=100, unique=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='website_orders')
    order_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Customer Details
    customer_name = models.CharField(max_length=255, blank=True, null=True)
    customer_email = models.EmailField(blank=True, null=True)
    customer_phone = models.CharField(max_length=20, blank=True, null=True)
    
    total_amount = models.DecimalField(max_digits=15, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    discount_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    grand_total = models.DecimalField(max_digits=15, decimal_places=2)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='cod')
    shipping_address = models.TextField()
    billing_address = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True, null=True)
    stripe_payment_intent_id = models.CharField(max_length=255, blank=True, null=True)
    stripe_charge_id = models.CharField(max_length=255, blank=True, null=True)
    transaction_id = models.CharField(max_length=255, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'website_orders'
        ordering = ['-order_date']
    
    def __str__(self):
        return f"{self.order_number} - {self.customer.user.username}"

class WebsiteOrderItem(models.Model):
    """Individual items in a website order"""
    order = models.ForeignKey(WebsiteOrder, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=15, decimal_places=2)
    total_price = models.DecimalField(max_digits=15, decimal_places=2)
    
    class Meta:
        db_table = 'website_order_items'
    
    def __str__(self):
        return f"{self.product.name} x{self.quantity} - {self.order.order_number}"


# ===== HOMEPAGE CONTENT MANAGEMENT MODELS =====

class HomepageHeroSection(models.Model):
    """Hero section content for homepage"""
    heading = models.CharField(max_length=255, default="Where Quality Meets Style")
    subheading = models.TextField(default="Discover our curated collection of premium furniture and home decor for every room in your home")
    background_image = models.ImageField(upload_to='homepage/hero/', blank=True, null=True)
    background_color = models.CharField(max_length=7, default='#1a1a1a', help_text="Hex color code (e.g., #1a1a1a)")
    cta_button_text = models.CharField(max_length=100, default="Shop Now")
    cta_button_url = models.CharField(max_length=500, default="/products/")
    text_color = models.CharField(max_length=7, default='#ffffff')
    is_active = models.BooleanField(default=True)
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='hero_section_updates')
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'homepage_hero_section'
        verbose_name = "Hero Section"
        verbose_name_plural = "Hero Section"
    
    def __str__(self):
        return "Homepage Hero Section"


class HomepageFeature(models.Model):
    """Feature cards displayed on homepage"""
    ICON_CHOICES = [
        ('hammer', 'Artisanal Craftsmanship'),
        ('leaf', 'Sustainability'),
        ('palette', 'Customization'),
        ('shield', 'Durability'),
        ('truck', 'Fast Shipping'),
        ('heart', 'Quality'),
        ('star', 'Excellence'),
        ('check', 'Verified'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    icon_type = models.CharField(max_length=50, choices=ICON_CHOICES, default='check')
    icon_image = models.ImageField(upload_to='homepage/features/', blank=True, null=True)
    background_color = models.CharField(max_length=7, default='#f9f8f6')
    text_color = models.CharField(max_length=7, default='#5a5a5a')
    accent_color = models.CharField(max_length=7, default='#d4a574')
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='feature_updates')
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'homepage_features'
        ordering = ['order']
        verbose_name_plural = "Features"
    
    def __str__(self):
        return self.title


class HomepageSection(models.Model):
    """Generic content sections for homepage (Why Choose Us, Details, etc.)"""
    SECTION_TYPE_CHOICES = [
        ('why_us', 'Why Choose Us'),
        ('details', 'Details Are Important'),
        ('stories', 'Stories & Blog'),
        ('instagram', 'Instagram Follow'),
        ('testimonials', 'Testimonials'),
        ('cta', 'Call to Action'),
        ('custom', 'Custom Section'),
    ]
    
    section_type = models.CharField(max_length=50, choices=SECTION_TYPE_CHOICES, unique=True)
    heading = models.CharField(max_length=255)
    subheading = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    background_image = models.ImageField(upload_to='homepage/sections/', blank=True, null=True)
    background_color = models.CharField(max_length=7, default='#ffffff')
    text_color = models.CharField(max_length=7, default='#2e2e2e')
    accent_color = models.CharField(max_length=7, default='#d4a574')
    button_text = models.CharField(max_length=100, blank=True, null=True)
    button_url = models.CharField(max_length=500, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='section_updates')
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'homepage_sections'
        ordering = ['order']
        verbose_name_plural = "Sections"
    
    def __str__(self):
        return f"{self.get_section_type_display()} - {self.heading}"


class HomepageWhyUsItem(models.Model):
    """Checklist items for Why Choose Us section"""
    section = models.ForeignKey(HomepageSection, on_delete=models.CASCADE, related_name='why_us_items', limit_choices_to={'section_type': 'why_us'})
    text = models.CharField(max_length=255)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'homepage_why_us_items'
        ordering = ['order']
        verbose_name = "Why Us Item"
        verbose_name_plural = "Why Us Items"
    
    def __str__(self):
        return self.text


class HomepageDetailCard(models.Model):
    """Detail cards for Details section (Fast Shipping, Easy Returns, etc.)"""
    section = models.ForeignKey(HomepageSection, on_delete=models.CASCADE, related_name='detail_cards', limit_choices_to={'section_type': 'details'})
    title = models.CharField(max_length=255)
    description = models.TextField()
    icon_type = models.CharField(max_length=50, choices=[
        ('truck', 'Fast Shipping'),
        ('undo', 'Easy Returns'),
        ('headset', 'Expert Support'),
        ('check', 'Quality'),
        ('heart', 'Care'),
        ('star', 'Premium'),
    ], default='check')
    icon_image = models.ImageField(upload_to='homepage/details/', blank=True, null=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'homepage_detail_cards'
        ordering = ['order']
        verbose_name_plural = "Detail Cards"
    
    def __str__(self):
        return self.title


class HomepageStory(models.Model):
    """Story/Blog cards for Stories section"""
    section = models.ForeignKey(HomepageSection, on_delete=models.CASCADE, related_name='stories', limit_choices_to={'section_type': 'stories'})
    title = models.CharField(max_length=255)
    excerpt = models.TextField()
    featured_image = models.ImageField(upload_to='homepage/stories/')
    story_date = models.DateField()
    icon_type = models.CharField(max_length=50, default='home', help_text="FontAwesome icon name (e.g., 'home', 'sofa', 'utensils')")
    read_more_url = models.CharField(max_length=500, default="#")
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'homepage_stories'
        ordering = ['order']
        verbose_name_plural = "Stories"
    
    def __str__(self):
        return self.title


class HomepageInstagramSection(models.Model):
    """Instagram section configuration"""
    section = models.ForeignKey(HomepageSection, on_delete=models.CASCADE, related_name='instagram_config', limit_choices_to={'section_type': 'instagram'})
    instagram_handle = models.CharField(max_length=100, default="@CozyCorner")
    instagram_url = models.URLField(default="https://instagram.com/")
    grid_items_count = models.IntegerField(default=6)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'homepage_instagram_section'
        verbose_name = "Instagram Section"
        verbose_name_plural = "Instagram Section"
    
    def __str__(self):
        return f"Instagram Section - {self.instagram_handle}"


class HomepageTestimonial(models.Model):
    """Customer testimonials"""
    section = models.ForeignKey(HomepageSection, on_delete=models.CASCADE, related_name='testimonials', limit_choices_to={'section_type': 'testimonials'})
    author_name = models.CharField(max_length=255)
    author_title = models.CharField(max_length=255, default="Verified Purchase")
    rating = models.IntegerField(default=5, choices=[(i, f"{i} Stars") for i in range(1, 6)])
    testimonial_text = models.TextField()
    author_image = models.ImageField(upload_to='homepage/testimonials/', blank=True, null=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'homepage_testimonials'
        ordering = ['order']
        verbose_name_plural = "Testimonials"
    
    def __str__(self):
        return f"{self.author_name} - {self.rating}★"


class HomepageNavigation(models.Model):
    """Navigation menu items for header"""
    label = models.CharField(max_length=100)
    url = models.CharField(max_length=500)
    icon_class = models.CharField(max_length=100, blank=True, null=True, help_text="FontAwesome icon class (e.g., 'fas fa-home')")
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    is_dropdown = models.BooleanField(default=False)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='submenu')
    
    class Meta:
        db_table = 'homepage_navigation'
        ordering = ['order']
        verbose_name_plural = "Navigation Items"
    
    def __str__(self):
        return self.label


class HomepageFooterSection(models.Model):
    """Footer section configuration (columns and content)"""
    column_title = models.CharField(max_length=255)
    column_type = models.CharField(max_length=50, choices=[
        ('about', 'About Us'),
        ('menu', 'Menu Links'),
        ('account', 'Account Links'),
        ('info', 'Information Links'),
        ('contact', 'Contact Info'),
    ])
    content = models.TextField(blank=True, null=True, help_text="For contact, use JSON format")
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'homepage_footer_sections'
        ordering = ['order']
        verbose_name_plural = "Footer Sections"
    
    def __str__(self):
        return self.column_title


class HomepageFooterLink(models.Model):
    """Footer links for different columns"""
    section = models.ForeignKey(HomepageFooterSection, on_delete=models.CASCADE, related_name='links', limit_choices_to={'column_type__in': ['menu', 'account', 'info']})
    link_text = models.CharField(max_length=255)
    link_url = models.CharField(max_length=500)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'homepage_footer_links'
        ordering = ['order']
    
    def __str__(self):
        return self.link_text


class HomepageSocialLink(models.Model):
    """Social media links in footer"""
    platform = models.CharField(max_length=50, choices=[
        ('facebook', 'Facebook'),
        ('instagram', 'Instagram'),
        ('twitter', 'Twitter'),
        ('pinterest', 'Pinterest'),
        ('linkedin', 'LinkedIn'),
        ('youtube', 'YouTube'),
    ])
    url = models.URLField()
    icon_class = models.CharField(max_length=100, help_text="FontAwesome icon class")
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'homepage_social_links'
        ordering = ['order']
        unique_together = ['platform']
        verbose_name_plural = "Social Links"
    
    def __str__(self):
        return f"{self.get_platform_display()} - {self.url}"


class HomepageSEO(models.Model):
    """SEO and metadata for homepage"""
    page_title = models.CharField(max_length=255, default="CozyCorner - Premium Furniture & Home Decor")
    meta_description = models.TextField(max_length=160, default="Discover our curated collection of premium furniture and home decor")
    meta_keywords = models.CharField(max_length=255, blank=True, null=True)
    og_image = models.ImageField(upload_to='homepage/seo/', blank=True, null=True)
    og_title = models.CharField(max_length=255, blank=True, null=True)
    og_description = models.TextField(blank=True, null=True)
    canonical_url = models.URLField(blank=True, null=True)
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='seo_updates')
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'homepage_seo'
        verbose_name = "Homepage SEO"
        verbose_name_plural = "Homepage SEO"
    
    def __str__(self):
        return "Homepage SEO Configuration"


# Website Content Models (for Website Controller)

class WebsiteStory(models.Model):
    """Stories section on homepage"""
    title = models.CharField(max_length=255)
    excerpt = models.TextField()
    author = models.CharField(max_length=100)
    image = models.ImageField(upload_to='website/stories/', blank=True, null=True)
    image_url = models.URLField(blank=True, null=True, help_text="Base64 or URL for image")
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'website_stories'
        ordering = ['order']
    
    def __str__(self):
        return self.title


class WebsiteTestimonial(models.Model):
    """Testimonials section on homepage"""
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=255, blank=True)
    comment = models.TextField()
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)], default=5)
    image = models.ImageField(upload_to='website/testimonials/', blank=True, null=True)
    image_url = models.URLField(blank=True, null=True, help_text="Base64 or URL for image")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'website_testimonials'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.rating}⭐"


class WebsiteGallery(models.Model):
    """Gallery items on homepage"""
    CATEGORY_CHOICES = [
        ('rooms', 'Living Rooms'),
        ('bedrooms', 'Bedrooms'),
        ('kitchens', 'Kitchens'),
        ('outdoor', 'Outdoor'),
    ]
    
    title = models.CharField(max_length=255)
    image = models.ImageField(upload_to='website/gallery/', blank=True, null=True)
    image_url = models.URLField(blank=True, null=True, help_text="Base64 or URL for image")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='rooms')
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'website_gallery'
        ordering = ['order']
    
    def __str__(self):
        return self.title


class WebsiteFAQ(models.Model):
    """FAQ section on homepage"""
    CATEGORY_CHOICES = [
        ('shipping', 'Shipping'),
        ('returns', 'Returns'),
        ('payment', 'Payment'),
        ('products', 'Products'),
    ]
    
    question = models.CharField(max_length=500)
    answer = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='shipping')
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'website_faq'
        ordering = ['order']
    
    def __str__(self):
        return self.question


class WebsitePartner(models.Model):
    """Partners/Brands section on homepage"""
    name = models.CharField(max_length=255)
    logo = models.ImageField(upload_to='website/partners/', blank=True, null=True)
    logo_url = models.URLField(blank=True, null=True, help_text="Base64 or URL for logo")
    link = models.URLField(blank=True, null=True, help_text="Partner website link")
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'website_partners'
        ordering = ['order']
    
    def __str__(self):
        return self.name


class WebsiteHeroSection(models.Model):
    """Hero section content"""
    title = models.CharField(max_length=255, blank=True)
    subtitle = models.TextField(blank=True)
    cta_text = models.CharField(max_length=100, blank=True, default="Explore Products")
    image = models.ImageField(upload_to='website/hero/', blank=True, null=True)
    image_url = models.URLField(blank=True, null=True, help_text="Base64 or URL for image")
    background_color = models.CharField(max_length=20, blank=True)
    hero_box_title = models.CharField(max_length=255, blank=True, help_text="Title for the left side box")
    hero_box_text = models.TextField(blank=True, help_text="Text for the left side white box")
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'website_hero'
    
    def __str__(self):
        return f"Hero Section - {self.title or 'Default'}"


class WebsiteCollectionsSection(models.Model):
    """Collections section content"""
    title = models.CharField(max_length=255, blank=True, default="OUR LATEST COLLECTIONS")
    description = models.TextField(blank=True, default="Discover our curated selection of premium furniture pieces")
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'website_collections'
    
    def __str__(self):
        return f"Collections Section - {self.title or 'Default'}"


class WebsiteQualitySection(models.Model):
    """Quality/About section content - Where Quality Meets Style"""
    heading = models.CharField(max_length=255, blank=True, default="Where Quality Meets Style")
    description = models.TextField(blank=True, default="Every piece in our collection is carefully selected to ensure it meets our high standards for quality, design, and functionality.")
    image_url = models.URLField(blank=True, null=True, help_text="Section image URL")
    cta_text = models.CharField(max_length=100, blank=True, default="Explore More")
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'website_quality'
    
    def __str__(self):
        return f"Quality Section - {self.heading or 'Default'}"


class WebsiteNewsletter(models.Model):
    """Newsletter section settings"""
    title = models.CharField(max_length=255, default="Subscribe to Our Newsletter")
    description = models.TextField(blank=True)
    placeholder = models.CharField(max_length=255, default="Enter your email")
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'website_newsletter'
    
    def __str__(self):
        return "Newsletter Settings"


class WebsiteFurnitureDetailsSection(models.Model):
    """Furniture Details section - 'Why Our Furniture Is Something More?'"""
    heading = models.CharField(max_length=255, blank=True, default="Why Our Furniture Is Something More?")
    subheading = models.CharField(max_length=255, blank=True, default="Details Are Important")
    image_url = models.URLField(blank=True, null=True)
    details = models.JSONField(default=list, blank=True, help_text="List of detail items with checkmarks")
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'website_furniture_details'
    
    def save(self, *args, **kwargs):
        # Set default details if empty
        if not self.details:
            self.details = [
                'Premium materials sourced from trusted suppliers',
                'Expert craftsmanship in every detail',
                'Sustainable and eco-friendly production',
                'Timeless designs that never go out of style',
            ]
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Furniture Details Section - {self.heading or 'Default'}"


class WebsiteTestimonialsSectionSettings(models.Model):
    """Settings for the testimonials section heading and description"""
    heading = models.CharField(max_length=255, blank=True, default="What Our Customers Say")
    description = models.TextField(blank=True, default="Hear from our satisfied customers about their experiences")
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'website_testimonials_section'
    
    def __str__(self):
        return f"Testimonials Section - {self.heading or 'Default'}"


class WebsiteStoriesSectionSettings(models.Model):
    """Settings for the stories section heading and description"""
    heading = models.CharField(max_length=255, blank=True, default="Our Latest Collections")
    description = models.TextField(blank=True, default="Discover our curated selection of premium furniture pieces")
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'website_stories_section'
    
    def __str__(self):
        return f"Stories Section - {self.heading or 'Default'}"