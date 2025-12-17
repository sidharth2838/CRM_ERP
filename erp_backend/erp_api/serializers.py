from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *
from rest_framework_simplejwt.tokens import RefreshToken

class UserProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = ['id', 'unique_id', 'role', 'phone', 'department', 'full_name', 'email']
    
    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username
    
    def get_email(self, obj):
        return obj.user.email

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(source='userprofile', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']
        read_only_fields = ['id']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    unique_id = serializers.CharField(required=True)
    role = serializers.CharField(required=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    department = serializers.CharField(required=False, allow_blank=True)
    token = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 
                  'unique_id', 'role', 'phone', 'department', 'token']
    
    def get_token(self, obj):
        refresh = RefreshToken.for_user(obj)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
    
    def create(self, validated_data):
        # Extract profile data
        unique_id = validated_data.pop('unique_id')
        role = validated_data.pop('role')
        phone = validated_data.pop('phone', '')
        department = validated_data.pop('department', '')
        
        # Create user
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        
        # Create profile
        UserProfile.objects.create(
            user=user,
            unique_id=unique_id,
            role=role,
            phone=phone,
            department=department
        )
        
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    tokens = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)
    
    def get_tokens(self, obj):
        refresh = RefreshToken.for_user(obj['user'])
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
    
    def get_user(self, obj):
        user_data = UserSerializer(obj['user']).data
        return user_data
    
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")
        
        if not user.check_password(password):
            raise serializers.ValidationError("Invalid password")
        
        if not user.is_active:
            raise serializers.ValidationError("User account is disabled")
        
        data['user'] = user
        return data

class CompanySerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = Company
        fields = '__all__'

class CustomerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    company_name = serializers.CharField(source='company.name', read_only=True)
    
    class Meta:
        model = Customer
        fields = '__all__'

class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = Product
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_sku = serializers.CharField(source='product.sku', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.user.username', read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = Order
        fields = '__all__'

class InvoiceSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.user.username', read_only=True)
    order_number = serializers.CharField(source='order.order_number', read_only=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = Invoice
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.user.username', read_only=True)
    invoice_number = serializers.CharField(source='invoice.invoice_number', read_only=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = Payment
        fields = '__all__'

class QuoteSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.user.username', read_only=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = Quote
        fields = '__all__'

class LeadSerializer(serializers.ModelSerializer):
    assigned_to_name = serializers.CharField(source='assigned_to.username', read_only=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = Lead
        fields = '__all__'

class ExpenseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseCategory
        fields = '__all__'

class ExpenseSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.username', read_only=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = Expense
        fields = '__all__'

class ProductTrackingSerializer(serializers.ModelSerializer):
    order_number = serializers.CharField(source='order.order_number', read_only=True)
    customer_name = serializers.CharField(source='order.customer.user.username', read_only=True)
    
    class Meta:
        model = ProductTracking
        fields = '__all__'

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = '__all__'

class ActivityLogSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = ActivityLog
        fields = '__all__'

class DashboardSerializer(serializers.Serializer):
    total_customers = serializers.IntegerField()
    total_orders = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=15, decimal_places=2)
    pending_orders = serializers.IntegerField()
    total_products = serializers.IntegerField()
    low_stock_count = serializers.IntegerField()
    recent_orders = OrderSerializer(many=True)
    low_stock_products = ProductSerializer(many=True)

# ============= CMS SERIALIZERS =============

class WebsiteHeroHeaderSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = WebsiteHeroHeader
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class WebsiteConductSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = WebsiteConduct
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class WebsiteProductDisplaySerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_sku = serializers.CharField(source='product.sku', read_only=True)
    product_price = serializers.DecimalField(source='product.price', read_only=True, max_digits=15, decimal_places=2)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = WebsiteProductDisplay
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'product']

class WebsiteEnquirySerializer(serializers.ModelSerializer):
    lead_number = serializers.CharField(source='lead.lead_number', read_only=True, allow_null=True)
    product_name = serializers.CharField(source='interested_product.name', read_only=True, allow_null=True)
    assigned_to_name = serializers.CharField(source='assigned_to.get_full_name', read_only=True, allow_null=True)
    converted_by_name = serializers.CharField(source='converted_by.get_full_name', read_only=True, allow_null=True)
    
    class Meta:
        model = WebsiteEnquiry
        fields = '__all__'
        read_only_fields = ['enquiry_number', 'created_at', 'updated_at', 'converted_at']

class CMSContentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    
    class Meta:
        model = CMSContent
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class CMSPageSectionSerializer(serializers.ModelSerializer):
    content_title = serializers.CharField(source='content.title', read_only=True)
    content_type = serializers.CharField(source='content.content_type', read_only=True)
    
    class Meta:
        model = CMSPageSection
        fields = '__all__'
        read_only_fields = ['created_at']

class CMSPageSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    sections = CMSPageSectionSerializer(many=True, read_only=True)
    
    class Meta:
        model = CMSPage
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class SiteInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteInfo
        fields = '__all__'


# Website Content Serializers

class WebsiteStorySerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsiteStory
        fields = ['id', 'title', 'excerpt', 'author', 'image', 'image_url', 'order', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class WebsiteTestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsiteTestimonial
        fields = ['id', 'name', 'role', 'comment', 'rating', 'image', 'image_url', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class WebsiteGallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsiteGallery
        fields = ['id', 'title', 'image', 'image_url', 'category', 'order', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class WebsiteFAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsiteFAQ
        fields = ['id', 'question', 'answer', 'category', 'order', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class WebsitePartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsitePartner
        fields = ['id', 'name', 'logo', 'logo_url', 'link', 'order', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class WebsiteHeroSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsiteHeroSection
        fields = ['id', 'title', 'subtitle', 'cta_text', 'image', 'image_url', 'background_color', 'hero_box_title', 'hero_box_text', 'updated_at']
        read_only_fields = ['id', 'updated_at']


class WebsiteCollectionsSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsiteCollectionsSection
        fields = ['id', 'title', 'description', 'updated_at']
        read_only_fields = ['id', 'updated_at']


class WebsiteQualitySectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsiteQualitySection
        fields = ['id', 'heading', 'description', 'image_url', 'cta_text', 'updated_at']
        read_only_fields = ['id', 'updated_at']


class WebsiteNewsletterSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsiteNewsletter
        fields = ['id', 'title', 'description', 'placeholder', 'updated_at']
        read_only_fields = ['id', 'updated_at']


class WebsiteFurnitureDetailsSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsiteFurnitureDetailsSection
        fields = ['id', 'heading', 'subheading', 'image_url', 'details', 'updated_at']
        read_only_fields = ['id', 'updated_at']


class WebsiteTestimonialsSectionSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsiteTestimonialsSectionSettings
        fields = ['id', 'heading', 'description', 'updated_at']
        read_only_fields = ['id', 'updated_at']


class WebsiteStoriesSectionSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsiteStoriesSectionSettings
        fields = ['id', 'heading', 'description', 'updated_at']
        read_only_fields = ['id', 'updated_at']