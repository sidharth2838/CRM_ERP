from .models import HomepageFeature, HomepageTestimonial, HomepageNavigation, HomepageFooterSection, HomepageSocialLink, HomepageSEO, UserProfile
from django.contrib import admin
@admin.register(HomepageFeature)
class HomepageFeatureAdmin(admin.ModelAdmin):
    list_display = ('title', 'order', 'is_active')
    search_fields = ('title',)
    list_filter = ('is_active',)

@admin.register(HomepageTestimonial)
class HomepageTestimonialAdmin(admin.ModelAdmin):
    list_display = ('author_name', 'rating', 'order', 'is_active')
    search_fields = ('author_name',)
    list_filter = ('is_active',)

@admin.register(HomepageNavigation)
class HomepageNavigationAdmin(admin.ModelAdmin):
    list_display = ('label', 'url', 'order', 'is_active')
    search_fields = ('label', 'url')
    list_filter = ('is_active',)

@admin.register(HomepageFooterSection)
class HomepageFooterSectionAdmin(admin.ModelAdmin):
    list_display = ('column_title', 'order', 'is_active')
    search_fields = ('column_title',)
    list_filter = ('is_active',)

@admin.register(HomepageSocialLink)
class HomepageSocialLinkAdmin(admin.ModelAdmin):
    list_display = ('platform', 'url', 'order', 'is_active')
    search_fields = ('platform', 'url')
    list_filter = ('is_active',)

@admin.register(HomepageSEO)
class HomepageSEOAdmin(admin.ModelAdmin):
    list_display = ('page_title',)
    search_fields = ('page_title', 'meta_description', 'meta_keywords')
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from .models import *

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'

class CustomUserAdmin(UserAdmin):
    inlines = (UserProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'get_role', 'is_active')
    list_filter = ('userprofile__role', 'is_active')
    
    def get_role(self, obj):
        try:
            return obj.userprofile.role
        except UserProfile.DoesNotExist:
            return 'No Role'
    get_role.short_description = 'Role'

admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'contact_person')
    search_fields = ('name', 'email')

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('customer_code', 'user', 'company', 'balance')
    search_fields = ('customer_code', 'user__username')

@admin.register(ProductCategory)
class ProductCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'sku', 'category', 'price', 'stock_quantity', 'is_active')
    list_filter = ('category', 'is_active')
    search_fields = ('name', 'sku')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'customer', 'status', 'payment_status', 'grand_total', 'order_date')
    list_filter = ('status', 'payment_status')
    search_fields = ('order_number', 'customer__user__username')

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('invoice_number', 'customer', 'status', 'total_amount', 'invoice_date', 'due_date')
    list_filter = ('status',)
    search_fields = ('invoice_number', 'customer__user__username')

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('payment_number', 'customer', 'amount', 'payment_method', 'payment_date')
    list_filter = ('payment_method',)
    search_fields = ('payment_number', 'customer__user__username')

@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ('lead_number', 'company_name', 'contact_person', 'status', 'source')
    list_filter = ('status', 'source')
    search_fields = ('company_name', 'contact_person')

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('expense_number', 'category', 'amount', 'expense_date', 'payment_method')
    list_filter = ('category', 'payment_method')
    search_fields = ('expense_number', 'description')

@admin.register(ProductTracking)
class ProductTrackingAdmin(admin.ModelAdmin):
    list_display = ('tracking_number', 'order', 'status', 'location', 'updated_at')
    list_filter = ('status',)
    search_fields = ('tracking_number', 'order__order_number')

@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display = ('role', 'module', 'can_view', 'can_create', 'can_edit', 'can_delete')
    list_filter = ('role',)

@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'action', 'table_name', 'created_at')
    list_filter = ('action', 'table_name')
    search_fields = ('user__username', 'action')


# ===== HOMEPAGE CONTENT MANAGEMENT ADMIN =====



@admin.register(SiteInfo)
class SiteInfoAdmin(admin.ModelAdmin):
    list_display = ('heading', 'subheading', 'updated_at')
    search_fields = ('heading', 'subheading')