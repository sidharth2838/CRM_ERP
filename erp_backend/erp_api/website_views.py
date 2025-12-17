"""
Website views for customer inquiries and lead generation
"""
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.conf import settings
from erp_api.models import Lead, Product, CMSContent, CMSPage, CMSPageSection
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, BasePermission, AllowAny
import json
from decimal import Decimal
import re
import uuid

class IsStaffUser(BasePermission):
    """Allow access only to staff/admin users"""
    def has_permission(self, request, view):
        return request.user and (request.user.is_staff or request.user.is_superuser)

def website_home(request):
    """Main website homepage with dynamic content from admin"""
    try:
        # Import models here to avoid circular imports
        from erp_api.models import (
            HomepageHeroSection, HomepageFeature, HomepageSection, 
            HomepageNavigation, HomepageFooterSection, HomepageSocialLink, HomepageSEO
        )
        
        # Get hero section
        hero_section = HomepageHeroSection.objects.filter(is_active=True).first()
        
        # Get features
        features = HomepageFeature.objects.filter(is_active=True).order_by('order')
        
        # Get products
        products = Product.objects.filter(is_active=True)[:12]
        
        # Get sections
        why_us_section = HomepageSection.objects.filter(section_type='why_us', is_active=True).first()
        details_section = HomepageSection.objects.filter(section_type='details', is_active=True).first()
        stories_section = HomepageSection.objects.filter(section_type='stories', is_active=True).first()
        instagram_section = HomepageSection.objects.filter(section_type='instagram', is_active=True).first()
        testimonials_section = HomepageSection.objects.filter(section_type='testimonials', is_active=True).first()
        
        # Get navigation items
        navigation_items = HomepageNavigation.objects.filter(is_active=True).order_by('order')
        
        # Get footer sections
        footer_sections = HomepageFooterSection.objects.filter(is_active=True).order_by('order')
        
        # Get social links
        social_links = HomepageSocialLink.objects.filter(is_active=True).order_by('order')
        
        # Get SEO data
        seo = HomepageSEO.objects.first()
        
        context = {
            'hero_section': hero_section,
            'features': features,
            'products': products,
            'why_us_section': why_us_section,
            'details_section': details_section,
            'stories_section': stories_section,
            'instagram_section': instagram_section,
            'testimonials_section': testimonials_section,
            'navigation_items': navigation_items,
            'footer_sections': footer_sections,
            'social_links': social_links,
            'seo': seo,
        }
        
        return render(request, 'website/index_dynamic.html', context)
    
    except Exception as e:
        # Fallback to static homepage if error occurs
        print(f"Error rendering dynamic homepage: {str(e)}")
        products = Product.objects.filter(stock_quantity__gt=0)[:6]
        context = {
            'products': products,
            'total_products': Product.objects.count(),
        }
        return render(request, 'website/index.html', context)

def website_products(request):
    """Product listing page"""
    products = Product.objects.all()
    categories = Product.objects.values_list('category', flat=True).distinct()
    
    # Filter by category if provided
    category = request.GET.get('category')
    if category:
        products = products.filter(category=category)
    
    # Filter by price range if provided
    min_price = request.GET.get('min_price')
    max_price = request.GET.get('max_price')
    if min_price:
        products = products.filter(price__gte=Decimal(min_price))
    if max_price:
        products = products.filter(price__lte=Decimal(max_price))
    
    # Search
    search = request.GET.get('search')
    if search:
        products = products.filter(name__icontains=search) | products.filter(description__icontains=search)
    
    context = {
        'products': products,
        'categories': categories,
        'selected_category': category,
        'min_price': min_price,
        'max_price': max_price,
        'search': search,
    }
    return render(request, 'website/products.html', context)

def website_product_detail(request, product_id):
    """Individual product detail page"""
    try:
        product = Product.objects.get(id=product_id)
        related_products = Product.objects.exclude(id=product_id)[:4]
        context = {
            'product': product,
            'related_products': related_products,
        }
        return render(request, 'website/product_detail.html', context)
    except Product.DoesNotExist:
        return render(request, 'website/404.html', {'message': 'Product not found'}, status=404)

def website_product_buy(request, product_id):
    """Product buy page with checkout form"""
    if not request.user.is_authenticated:
        return redirect('login')
    
    try:
        product = Product.objects.get(id=product_id)
        context = {
            'product': product,
            'stripe_public_key': settings.STRIPE_PUBLIC_KEY,
        }
        return render(request, 'website/product_buy.html', context)
    except Product.DoesNotExist:
        return render(request, 'website/404.html', {'message': 'Product not found'}, status=404)

def website_contact(request):
    """Contact/inquiry page"""
    return render(request, 'website/contact.html')

@require_http_methods(["POST"])
@csrf_exempt
def submit_inquiry(request):
    """
    Handle customer inquiry submission
    Converts inquiry to lead in CRM
    """
    try:
        # Parse form data
        if request.content_type == 'application/json':
            data = json.loads(request.body)
        else:
            data = request.POST.dict()
        
        # Validate required fields
        required_fields = ['company_name', 'contact_person', 'email', 'phone', 'message']
        for field in required_fields:
            if not data.get(field):
                return JsonResponse({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }, status=400)
        
        # Validate email format
        email = data.get('email', '').strip()
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, email):
            return JsonResponse({
                'success': False,
                'error': 'Invalid email format'
            }, status=400)
        
        # Validate phone format (basic check)
        phone = data.get('phone', '').strip()
        if len(phone) < 5:
            return JsonResponse({
                'success': False,
                'error': 'Phone number too short'
            }, status=400)
        
        # Get or create admin user for lead assignment
        admin_user = User.objects.filter(is_staff=True, is_superuser=True).first()
        if not admin_user:
            # Create default admin if none exists
            admin_user, _ = User.objects.get_or_create(
                username='admin',
                defaults={'email': 'admin@crm.local', 'is_staff': True, 'is_superuser': True}
            )
        
        # Create lead from inquiry
        company_name = data.get('company_name', 'N/A').strip()
        contact_person = data.get('contact_person', 'N/A').strip()
        product_interest = data.get('product_of_interest', data.get('product_interest', 'General Inquiry')).strip()
        message = data.get('message', '').strip()
        
        # Generate unique lead number
        lead_count = Lead.objects.count() + 1
        lead_number = f"WEB-{lead_count:06d}"
        
        # Combine message and product interest in notes
        notes = f"Product Interest: {product_interest}\n\nInquiry Message:\n{message}"
        if data.get('budget'):
            notes += f"\n\nBudget: {data.get('budget')}"
        
        # Create the lead
        lead = Lead.objects.create(
            lead_number=lead_number,
            company_name=company_name,
            contact_person=contact_person,
            email=email,
            phone=phone,
            source='website',
            status='new',
            assigned_to=admin_user,
            created_by=admin_user,
            notes=notes,
            estimated_value=Decimal('0.00') if not data.get('budget') else Decimal(data.get('budget', 0))
        )
        
        return JsonResponse({
            'success': True,
            'message': 'Thank you! Your inquiry has been received. We will contact you soon.',
            'lead_number': lead_number,
            'lead_id': lead.id
        }, status=201)
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'error': 'Invalid JSON format'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

def inquiry_confirmation(request, lead_id):
    """Show confirmation page after inquiry submission"""
    try:
        lead = Lead.objects.get(id=lead_id)
        context = {
            'lead': lead,
            'lead_number': lead.lead_number,
        }
        return render(request, 'website/inquiry_confirmation.html', context)
    except Lead.DoesNotExist:
        return render(request, 'website/404.html', {'message': 'Inquiry not found'}, status=404)

def website_about(request):
    """About page"""
    return render(request, 'website/about.html')

def website_services(request):
    """Services page"""
    return render(request, 'website/services.html')

def website_faq(request):
    """FAQ page"""
    return render(request, 'website/faq.html')

@csrf_exempt
def api_quick_inquiry(request):
    """
    Quick API endpoint for inquiry submission
    Can be used by external forms or AJAX
    """
    if request.method == 'POST':
        return submit_inquiry(request)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

# ============================================
# CMS (Content Management System) Functions
# ============================================

def cms_get_page(request, page_slug):
    """
    Retrieve a CMS page with all its sections and content
    This displays pages created/managed from the CRM admin
    """
    try:
        page = CMSPage.objects.get(slug=page_slug, is_published=True)
        sections = page.sections.all()
        
        context = {
            'page': page,
            'page_title': page.page_title or page.title,
            'page_description': page.page_description,
            'meta_keywords': page.meta_keywords,
            'sections': sections,
        }
        return render(request, 'website/cms_page.html', context)
    except CMSPage.DoesNotExist:
        return render(request, 'website/404.html', {'message': 'Page not found'}, status=404)

def cms_get_content(request, content_slug):
    """
    Get a specific CMS content item
    Useful for displaying announcements, testimonials, etc.
    """
    try:
        content = CMSContent.objects.get(slug=content_slug, is_active=True)
        related_content = CMSContent.objects.filter(
            content_type=content.content_type,
            is_active=True
        ).exclude(id=content.id)[:3]
        
        context = {
            'content': content,
            'related_content': related_content,
        }
        return render(request, 'website/cms_content.html', context)
    except CMSContent.DoesNotExist:
        return render(request, 'website/404.html', {'message': 'Content not found'}, status=404)

def cms_list_content_by_type(request, content_type):
    """
    List all active CMS content of a specific type
    """
    valid_types = ['banner', 'section', 'page', 'testimonial', 'feature', 'announcement']
    
    if content_type not in valid_types:
        return JsonResponse({'error': 'Invalid content type'}, status=400)
    
    content_items = CMSContent.objects.filter(
        content_type=content_type,
        is_active=True
    ).order_by('order', '-created_at')
    
    context = {
        'content_type': content_type,
        'content_items': content_items,
        'total': content_items.count(),
    }
    return render(request, 'website/cms_content_list.html', context)

def cms_featured_content(request):
    """
    Display all featured CMS content on a showcase page
    """
    featured = CMSContent.objects.filter(is_featured=True, is_active=True).order_by('order')
    
    context = {
        'featured_content': featured,
        'total': featured.count(),
    }
    return render(request, 'website/cms_featured.html', context)

def cms_announcements(request):
    """
    Display all active announcements
    """
    announcements = CMSContent.objects.filter(
        content_type='announcement',
        is_active=True
    ).order_by('-published_at', '-created_at')
    
    context = {
        'announcements': announcements,
        'total': announcements.count(),
    }
    return render(request, 'website/cms_announcements.html', context)

def cms_testimonials(request):
    """
    Display all active testimonials
    """
    testimonials = CMSContent.objects.filter(
        content_type='testimonial',
        is_active=True
    ).order_by('-created_at')
    
    context = {
        'testimonials': testimonials,
        'total': testimonials.count(),
    }
    return render(request, 'website/cms_testimonials.html', context)

@csrf_exempt
def api_cms_page(request, page_slug):
    """
    API endpoint to get CMS page data as JSON
    """
    try:
        page = CMSPage.objects.get(slug=page_slug, is_published=True)
        sections_data = []
        
        for section in page.sections.all():
            sections_data.append({
                'title': section.content.title,
                'description': section.content.description,
                'type': section.content.content_type,
                'image': section.content.image.url if section.content.image else None,
                'order': section.order,
            })
        
        return JsonResponse({
            'success': True,
            'page': {
                'title': page.title,
                'slug': page.slug,
                'description': page.page_description,
                'template_type': page.template_type,
                'sections': sections_data,
            }
        })
    except CMSPage.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Page not found'}, status=404)

@csrf_exempt
def api_cms_content(request, content_slug):
    """
    API endpoint to get CMS content data as JSON
    """
    try:
        content = CMSContent.objects.get(slug=content_slug, is_active=True)
        return JsonResponse({
            'success': True,
            'content': {
                'title': content.title,
                'slug': content.slug,
                'description': content.description,
                'type': content.content_type,
                'image': content.image.url if content.image else None,
                'is_featured': content.is_featured,
                'created_at': content.created_at.isoformat(),
            }
        })
    except CMSContent.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Content not found'}, status=404)

@csrf_exempt
def api_cms_list(request, content_type=None):
    """
    API endpoint to list CMS content items
    Query params: type (banner/section/page/testimonial/feature/announcement)
    """
    try:
        items = CMSContent.objects.filter(is_active=True)
        
        if content_type:
            items = items.filter(content_type=content_type)
        
        items = items.order_by('order', '-created_at')
        
        content_list = []
        for item in items:
            content_list.append({
                'id': item.id,
                'title': item.title,
                'slug': item.slug,
                'type': item.content_type,
                'image': item.image.url if item.image else None,
                'is_featured': item.is_featured,
            })
        
        return JsonResponse({
            'success': True,
            'count': len(content_list),
            'content': content_list
        })
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)

# ============================================
# AUTHENTICATION VIEWS
# ============================================

def website_signup(request):
    """Customer sign-up page"""
    if request.user.is_authenticated:
        return redirect('website:account')
    
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        email = request.POST.get('email', '').strip()
        password = request.POST.get('password', '').strip()
        confirm_password = request.POST.get('confirm_password', '').strip()
        phone = request.POST.get('phone', '').strip()
        
        # Validation
        errors = []
        if not username:
            errors.append('Username is required')
        if not email:
            errors.append('Email is required')
        if not password:
            errors.append('Password is required')
        if password != confirm_password:
            errors.append('Passwords do not match')
        if len(password) < 6:
            errors.append('Password must be at least 6 characters')
        
        if User.objects.filter(username=username).exists():
            errors.append('Username already exists')
        if User.objects.filter(email=email).exists():
            errors.append('Email already exists')
        
        if errors:
            return render(request, 'website/signup.html', {'errors': errors})
        
        # Create user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        
        # Create customer record
        from erp_api.models import Customer, Company
        
        company, _ = Company.objects.get_or_create(
            name="Website Customers",
            defaults={'address': 'Online', 'phone': '', 'email': email, 'contact_person': username}
        )
        
        customer_code = f"WEB-{user.id:04d}"
        Customer.objects.create(
            user=user,
            company=company,
            customer_code=customer_code,
            billing_address='',
            shipping_address='',
            credit_limit=10000,
            tax_number=''
        )
        
        # Auto-login
        from django.contrib.auth import authenticate, login
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('website:account')
        
        return redirect('website:login')
    
    return render(request, 'website/signup.html')

def website_login(request):
    """Customer login page"""
    if request.user.is_authenticated:
        return redirect('website:account')
    
    if request.method == 'POST':
        from django.contrib.auth import authenticate, login
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            next_url = request.GET.get('next', 'website:account')
            return redirect(next_url)
        else:
            return render(request, 'website/login.html', {'error': 'Invalid username or password'})
    
    return render(request, 'website/login.html')

def website_logout(request):
    """Logout customer"""
    from django.contrib.auth import logout
    logout(request)
    return redirect('website:home')

def website_account(request):
    """Customer account page"""
    if not request.user.is_authenticated:
        return redirect('website:login')
    
    from erp_api.models import Customer
    try:
        customer = Customer.objects.get(user=request.user)
    except Customer.DoesNotExist:
        return redirect('website:home')
    
    orders = customer.website_orders.all()
    context = {
        'customer': customer,
        'orders': orders
    }
    return render(request, 'website/account.html', context)

# ============================================
# SHOPPING CART & CHECKOUT VIEWS
# ============================================

def website_cart(request):
    """Shopping cart page"""
    cart_data = request.session.get('cart', {})
    
    from erp_api.models import Product
    products = []
    total = 0
    
    for product_id, quantity in cart_data.items():
        try:
            product = Product.objects.get(id=int(product_id))
            item_total = float(product.price) * quantity
            total += item_total
            products.append({
                'product': product,
                'quantity': quantity,
                'item_total': item_total
            })
        except Product.DoesNotExist:
            pass
    
    context = {
        'cart_items': products,
        'total': total
    }
    return render(request, 'website/cart.html', context)

def website_checkout(request):
    """Checkout page"""
    if not request.user.is_authenticated:
        from django.urls import reverse
        return redirect(f'{reverse("website:login")}?next={request.path}')
    
    from erp_api.models import Customer, Product
    from django.conf import settings
    
    try:
        customer = Customer.objects.get(user=request.user)
    except Customer.DoesNotExist:
        return redirect('website:home')
    
    cart_data = request.session.get('cart', {})
    
    if not cart_data:
        return redirect('website:cart')
    
    products = []
    total = 0
    
    for product_id, quantity in cart_data.items():
        try:
            product = Product.objects.get(id=int(product_id))
            item_total = float(product.price) * quantity
            total += item_total
            products.append({
                'product': product,
                'quantity': quantity,
                'item_total': item_total
            })
        except Product.DoesNotExist:
            pass
    
    context = {
        'customer': customer,
        'cart_items': products,
        'total': total,
        'STRIPE_PUBLIC_KEY': settings.STRIPE_PUBLIC_KEY
    }
    return render(request, 'website/checkout.html', context)

def order_confirmation(request, order_id):
    """Order confirmation page"""
    from erp_api.models import WebsiteOrder
    
    try:
        order = WebsiteOrder.objects.get(id=order_id)
        if order.customer.user != request.user:
            return redirect('website:home')
    except WebsiteOrder.DoesNotExist:
        return redirect('website:home')
    
    context = {'order': order}
    return render(request, 'website/order_confirmation.html', context)

def website_orders(request):
    """Customer's order history"""
    if not request.user.is_authenticated:
        return redirect('website:login')
    
    from erp_api.models import Customer
    
    try:
        customer = Customer.objects.get(user=request.user)
        orders = customer.website_orders.all()
    except Customer.DoesNotExist:
        orders = []
    
    context = {'orders': orders}
    return render(request, 'website/orders.html', context)

# ============================================
# SHOPPING CART API ENDPOINTS
# ============================================

@require_http_methods(['POST'])
@csrf_exempt
def api_add_to_cart(request):
    """Add product to cart (session-based)"""
    try:
        data = json.loads(request.body)
        product_id = str(data.get('product_id'))
        quantity = int(data.get('quantity', 1))
        
        if quantity < 1:
            return JsonResponse({'success': False, 'error': 'Invalid quantity'})
        
        cart = request.session.get('cart', {})
        
        if product_id in cart:
            cart[product_id] += quantity
        else:
            cart[product_id] = quantity
        
        request.session['cart'] = cart
        request.session.modified = True
        
        total_items = sum(cart.values())
        
        return JsonResponse({
            'success': True,
            'message': 'Product added to cart',
            'cart_count': total_items
        })
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)

@require_http_methods(['POST'])
@csrf_exempt
def api_remove_from_cart(request):
    """Remove product from cart"""
    try:
        data = json.loads(request.body)
        product_id = str(data.get('product_id'))
        
        cart = request.session.get('cart', {})
        if product_id in cart:
            del cart[product_id]
        
        request.session['cart'] = cart
        request.session.modified = True
        
        total_items = sum(cart.values())
        
        return JsonResponse({
            'success': True,
            'message': 'Product removed from cart',
            'cart_count': total_items
        })
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)

@require_http_methods(['GET'])
def api_get_cart(request):
    """Get current cart"""
    from erp_api.models import Product
    
    cart_data = request.session.get('cart', {})
    products = []
    total = 0
    
    for product_id, quantity in cart_data.items():
        try:
            product = Product.objects.get(id=int(product_id))
            item_total = float(product.price) * quantity
            total += item_total
            products.append({
                'id': product.id,
                'name': product.name,
                'price': float(product.price),
                'quantity': quantity,
                'item_total': item_total
            })
        except Product.DoesNotExist:
            pass
    
    return JsonResponse({
        'success': True,
        'items': products,
        'total': total,
        'item_count': len(products)
    })

@require_http_methods(['POST'])
@csrf_exempt
def api_checkout(request):
    """Process checkout and create order with payment method"""
    if not request.user.is_authenticated:
        return JsonResponse({'success': False, 'error': 'Please login to checkout'}, status=401)
    
    from erp_api.models import Customer, WebsiteOrder, WebsiteOrderItem, Product
    import uuid
    from django.utils import timezone
    
    try:
        customer = Customer.objects.get(user=request.user)
    except Customer.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Customer record not found'}, status=404)
    
    cart_data = request.session.get('cart', {})
    
    if not cart_data:
        return JsonResponse({'success': False, 'error': 'Cart is empty'}, status=400)
    
    try:
        data = json.loads(request.body)
        shipping_address = data.get('shipping_address', '').strip()
        billing_address = data.get('billing_address', shipping_address).strip()
        payment_method = data.get('payment_method', 'cod').strip()
        
        if not shipping_address:
            return JsonResponse({'success': False, 'error': 'Shipping address is required'}, status=400)
        
        if payment_method not in ['card', 'cod']:
            return JsonResponse({'success': False, 'error': 'Invalid payment method'}, status=400)
        
        # Calculate totals
        total_amount = Decimal('0')
        items_data = []
        
        for product_id, quantity in cart_data.items():
            try:
                product = Product.objects.get(id=int(product_id))
                
                # Check stock
                if product.stock_quantity < quantity:
                    return JsonResponse({
                        'success': False,
                        'error': f'Insufficient stock for {product.name}'
                    }, status=400)
                
                item_total = product.price * Decimal(quantity)
                total_amount += item_total
                
                items_data.append({
                    'product': product,
                    'quantity': quantity,
                    'unit_price': product.price,
                    'total_price': item_total
                })
            except Product.DoesNotExist:
                return JsonResponse({'success': False, 'error': f'Product {product_id} not found'}, status=404)
        
        # Create order
        order_number = f"WEB-{uuid.uuid4().hex[:8].upper()}"
        
        # Set initial payment status based on payment method
        if payment_method == 'card':
            initial_payment_status = 'pending'  # Will be updated after Stripe payment
        else:
            initial_payment_status = 'pending'  # COD - payment pending until received
        
        order = WebsiteOrder.objects.create(
            order_number=order_number,
            customer=customer,
            total_amount=total_amount,
            grand_total=total_amount,
            shipping_address=shipping_address,
            billing_address=billing_address or shipping_address,
            payment_method=payment_method,
            payment_status=initial_payment_status,
            ip_address=get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        # Create order items
        for item in items_data:
            WebsiteOrderItem.objects.create(
                order=order,
                product=item['product'],
                quantity=item['quantity'],
                unit_price=item['unit_price'],
                total_price=item['total_price']
            )
            
            # Reduce stock
            item['product'].stock_quantity -= item['quantity']
            item['product'].save()
        
        # For COD, clear cart and redirect to confirmation
        if payment_method == 'cod':
            request.session['cart'] = {}
            request.session.modified = True
            
            return JsonResponse({
                'success': True,
                'message': 'Order created successfully',
                'order_id': order.id,
                'order_number': order.order_number,
                'payment_method': 'cod',
                'redirect_url': f'/website/order-confirmation/{order.id}/'
            })
        else:
            # For card payment, return order details and require Stripe payment
            return JsonResponse({
                'success': True,
                'message': 'Order created - proceed to payment',
                'order_id': order.id,
                'order_number': order.order_number,
                'amount': float(total_amount),
                'payment_method': 'card',
                'requires_payment': True
            })
    
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)

def get_client_ip(request):
    """Get client IP address"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

# ============================================
# PRODUCT DETAIL API
# ============================================

@require_http_methods(['GET'])
def api_product_detail(request, product_id):
    """Get full product details for modal display"""
    from erp_api.models import Product
    
    try:
        product = Product.objects.get(id=product_id)
        
        product_data = {
            'id': product.id,
            'name': product.name,
            'sku': product.sku,
            'description': product.description or '',
            'price': float(product.price),
            'stock_quantity': product.stock_quantity,
            'category': product.category or '',
            'image_url': product.image.url if product.image else None,
            'in_stock': product.stock_quantity > 0,
            'low_stock': product.stock_quantity < 10 and product.stock_quantity > 0,
        }
        
        return JsonResponse({
            'success': True,
            'product': product_data
        })
    except Product.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Product not found'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)

# ============================================
# PAYMENT PROCESSING
# ============================================

@require_http_methods(['POST'])
@csrf_exempt
def api_create_payment_intent(request):
    """Create Stripe payment intent for payment processing"""
    if not request.user.is_authenticated:
        return JsonResponse({'success': False, 'error': 'Please login'}, status=401)
    
    import stripe
    from django.conf import settings
    
    try:
        stripe.api_key = settings.STRIPE_SECRET_KEY
        
        data = json.loads(request.body)
        amount = int(float(data.get('amount', 0)) * 100)  # Convert to cents
        
        if amount <= 0:
            return JsonResponse({'success': False, 'error': 'Invalid amount'}, status=400)
        
        customer = request.user.customer
        
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency='usd',
            metadata={'order_id': data.get('order_id', '')},
            description=f"Order for {customer.user.username}"
        )
        
        return JsonResponse({
            'success': True,
            'client_secret': intent.client_secret,
            'payment_intent_id': intent.id
        })
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)

@require_http_methods(['POST'])
@csrf_exempt
def api_confirm_payment(request):
    """Confirm payment and update order status"""
    if not request.user.is_authenticated:
        return JsonResponse({'success': False, 'error': 'Please login'}, status=401)
    
    from erp_api.models import WebsiteOrder
    
    try:
        data = json.loads(request.body)
        payment_intent_id = data.get('payment_intent_id', '')
        order_id = data.get('order_id', '')
        
        try:
            order = WebsiteOrder.objects.get(id=order_id, customer__user=request.user)
        except WebsiteOrder.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Order not found'}, status=404)
        
        # Update order with payment details
        order.stripe_payment_intent_id = payment_intent_id
        order.payment_status = 'paid'
        order.status = 'confirmed'
        order.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Payment confirmed',
            'order_id': order.id,
            'redirect_url': f'/website/order-confirmation/{order.id}/'
        })
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)

# ============================================
# DIRECT BUY NOW FEATURE
# ============================================

@require_http_methods(['POST'])
@csrf_exempt
def api_buy_now(request):
    """Direct buy now - convert product to order immediately"""
    if not request.user.is_authenticated:
        return JsonResponse({'success': False, 'error': 'Please login to purchase'}, status=401)
    
    from erp_api.models import Customer, WebsiteOrder, WebsiteOrderItem, Product
    import uuid
    from decimal import Decimal
    
    try:
        # Get customer
        try:
            customer = Customer.objects.get(user=request.user)
        except Customer.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Customer record not found'}, status=404)
        
        # Parse request data
        data = json.loads(request.body)
        product_id = data.get('product_id')
        quantity = int(data.get('quantity', 1))
        
        if not product_id or quantity <= 0:
            return JsonResponse({'success': False, 'error': 'Invalid product or quantity'}, status=400)
        
        # Get product
        try:
            product = Product.objects.get(id=int(product_id))
        except Product.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Product not found'}, status=404)
        
        # Check stock
        if product.stock_quantity < quantity:
            return JsonResponse({
                'success': False,
                'error': f'Insufficient stock. Available: {product.stock_quantity}'
            }, status=400)
        
        # Calculate total
        total_amount = product.price * Decimal(quantity)
        
        # Create order
        order_number = f"BUY-{uuid.uuid4().hex[:8].upper()}"
        order = WebsiteOrder.objects.create(
            order_number=order_number,
            customer=customer,
            total_amount=total_amount,
            grand_total=total_amount,
            shipping_address='',  # To be filled by customer
            billing_address='',
            payment_method='cod',  # Default to COD, can be changed
            payment_status='pending',
            status='pending',
            ip_address=get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        # Create order item
        WebsiteOrderItem.objects.create(
            order=order,
            product=product,
            quantity=quantity,
            unit_price=product.price,
            total_price=total_amount
        )
        
        # Reduce stock
        product.stock_quantity -= quantity
        product.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Order created successfully',
            'order_id': order.id,
            'order_number': order.order_number,
            'redirect_url': f'/website/order-checkout/{order.id}/'
        })
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        return JsonResponse({'success': False, 'error': str(e)}, status=400)

@require_http_methods(['GET'])
def order_checkout_page(request, order_id):
    """Page to complete order with shipping and billing info"""
    if not request.user.is_authenticated:
        return redirect('website:login')
    
    from erp_api.models import WebsiteOrder
    
    try:
        order = WebsiteOrder.objects.get(id=order_id, customer__user=request.user)
    except WebsiteOrder.DoesNotExist:
        return redirect('website:products')
    
    context = {
        'order': order,
        'STRIPE_PUBLIC_KEY': settings.STRIPE_PUBLIC_KEY,
    }
    
    return render(request, 'website/order_checkout.html', context)

@require_http_methods(['POST'])
@csrf_exempt
def api_update_order_address(request):
    """Update order with shipping and billing address and customer details"""
    if not request.user.is_authenticated:
        return JsonResponse({'success': False, 'error': 'Please login'}, status=401)
    
    from erp_api.models import WebsiteOrder
    
    try:
        data = json.loads(request.body)
        order_id = data.get('order_id')
        customer_name = data.get('customer_name', '').strip()
        customer_email = data.get('customer_email', '').strip()
        customer_phone = data.get('customer_phone', '').strip()
        shipping_address = data.get('shipping_address', '').strip()
        billing_address = data.get('billing_address', shipping_address).strip()
        payment_method = data.get('payment_method', 'cod').strip()
        
        # Validate required fields
        if not customer_name or not customer_email or not customer_phone:
            return JsonResponse({'success': False, 'error': 'Customer details required'}, status=400)
        
        if not shipping_address:
            return JsonResponse({'success': False, 'error': 'Shipping address required'}, status=400)
        
        try:
            order = WebsiteOrder.objects.get(id=order_id, customer__user=request.user)
        except WebsiteOrder.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Order not found'}, status=404)
        
        # Update order with customer details and addresses
        order.customer_name = customer_name
        order.customer_email = customer_email
        order.customer_phone = customer_phone
        order.shipping_address = shipping_address
        order.billing_address = billing_address or shipping_address
        order.payment_method = payment_method
        order.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Order updated successfully',
            'order_id': order.id,
            'order_number': order.order_number,
            'amount': float(order.grand_total),
            'payment_method': payment_method
        })
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        return JsonResponse({'success': False, 'error': str(e)}, status=400)


# ============================================
# DIRECT BUY PROCESSING
# ============================================

@require_http_methods(['POST'])
@csrf_exempt
def api_process_buy_cod(request):
    """Process direct product buy with COD payment"""
    if not request.user.is_authenticated:
        return JsonResponse({'success': False, 'error': 'Please login'}, status=401)
    
    try:
        from erp_api.models import Product, Customer, WebsiteOrder, WebsiteOrderItem
        
        data = json.loads(request.body)
        product_id = data.get('product_id')
        quantity = int(data.get('quantity', 1))
        customer_name = data.get('customer_name', '').strip()
        customer_email = data.get('customer_email', '').strip()
        customer_phone = data.get('customer_phone', '').strip()
        shipping_address = data.get('shipping_address', '').strip()
        billing_address = data.get('billing_address', '').strip()
        
        # Validate
        if not all([product_id, quantity, customer_name, customer_email, customer_phone, shipping_address]):
            return JsonResponse({'success': False, 'error': 'Missing required fields'}, status=400)
        
        if quantity < 1:
            return JsonResponse({'success': False, 'error': 'Invalid quantity'}, status=400)
        
        # Get product
        product = Product.objects.get(id=product_id)
        if product.stock_quantity < quantity:
            return JsonResponse({'success': False, 'error': 'Insufficient stock'}, status=400)
        
        # Get or create customer (or use existing)
        try:
            customer = Customer.objects.get(user=request.user)
        except Customer.DoesNotExist:
            # Create a basic customer if doesn't exist
            customer = Customer.objects.create(
                user=request.user,
                customer_code=f"WEB-{request.user.id}-{uuid.uuid4().hex[:6].upper()}",
                billing_address=shipping_address,
                shipping_address=shipping_address,
                credit_limit=Decimal('0'),
                tax_number=''
            )
        
        # Generate order number
        order_number = f"BUY-{uuid.uuid4().hex[:8].upper()}"
        
        # Create order
        order = WebsiteOrder.objects.create(
            order_number=order_number,
            customer=customer,
            customer_name=customer_name,
            customer_email=customer_email,
            customer_phone=customer_phone,
            shipping_address=shipping_address,
            billing_address=billing_address or shipping_address,
            payment_method='cod',
            payment_status='pending',
            status='pending',
            total_amount=product.price * quantity,
            grand_total=product.price * quantity,
            ip_address=request.META.get('REMOTE_ADDR', ''),
            user_agent=request.META.get('HTTP_USER_AGENT', ''),
        )
        
        # Create order item
        WebsiteOrderItem.objects.create(
            order=order,
            product=product,
            quantity=quantity,
            unit_price=product.price,
            total_price=product.price * quantity,
        )
        
        # Reduce stock
        product.stock_quantity -= quantity
        product.save()
        
        return JsonResponse({
            'success': True,
            'order_id': order.id,
            'order_number': order.order_number,
            'message': 'Order placed successfully'
        })
    
    except Product.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Product not found'}, status=404)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return JsonResponse({'success': False, 'error': str(e)}, status=400)


@require_http_methods(['POST'])
@csrf_exempt
def api_process_buy_card(request):
    """Process direct product buy with card payment"""
    if not request.user.is_authenticated:
        return JsonResponse({'success': False, 'error': 'Please login'}, status=401)
    
    try:
        import stripe
        from erp_api.models import Product, Customer, WebsiteOrder, WebsiteOrderItem
        
        stripe.api_key = settings.STRIPE_SECRET_KEY
        
        data = json.loads(request.body)
        product_id = data.get('product_id')
        quantity = int(data.get('quantity', 1))
        customer_name = data.get('customer_name', '').strip()
        customer_email = data.get('customer_email', '').strip()
        customer_phone = data.get('customer_phone', '').strip()
        shipping_address = data.get('shipping_address', '').strip()
        billing_address = data.get('billing_address', '').strip()
        
        # Validate
        if not all([product_id, quantity, customer_name, customer_email, customer_phone, shipping_address]):
            return JsonResponse({'success': False, 'error': 'Missing required fields'}, status=400)
        
        if quantity < 1:
            return JsonResponse({'success': False, 'error': 'Invalid quantity'}, status=400)
        
        # Get product
        product = Product.objects.get(id=product_id)
        if product.stock_quantity < quantity:
            return JsonResponse({'success': False, 'error': 'Insufficient stock'}, status=400)
        
        # Get or create customer (or use existing)
        try:
            customer = Customer.objects.get(user=request.user)
        except Customer.DoesNotExist:
            # Create a basic customer if doesn't exist
            customer = Customer.objects.create(
                user=request.user,
                customer_code=f"WEB-{request.user.id}-{uuid.uuid4().hex[:6].upper()}",
                billing_address=billing_address or shipping_address,
                shipping_address=shipping_address,
                credit_limit=Decimal('0'),
                tax_number=''
            )
        
        # Create order
        amount = int(product.price * quantity * 100)  # Convert to cents
        
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency='usd',
            metadata={
                'customer_email': customer_email,
                'customer_name': customer_name,
            }
        )
        
        # Generate order number
        order_number = f"BUY-{uuid.uuid4().hex[:8].upper()}"
        
        order = WebsiteOrder.objects.create(
            order_number=order_number,
            customer=customer,
            customer_name=customer_name,
            customer_email=customer_email,
            customer_phone=customer_phone,
            shipping_address=shipping_address,
            billing_address=billing_address or shipping_address,
            payment_method='card',
            payment_status='processing',
            status='processing',
            total_amount=product.price * quantity,
            grand_total=product.price * quantity,
            stripe_payment_intent_id=intent.id,
            ip_address=request.META.get('REMOTE_ADDR', ''),
            user_agent=request.META.get('HTTP_USER_AGENT', ''),
        )
        
        # Create order item
        WebsiteOrderItem.objects.create(
            order=order,
            product=product,
            quantity=quantity,
            unit_price=product.price,
            total_price=product.price * quantity,
        )
        
        return JsonResponse({
            'success': True,
            'order_id': order.id,
            'client_secret': intent.client_secret,
            'payment_intent_id': intent.id,
        })
    
    except Product.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Product not found'}, status=404)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return JsonResponse({'success': False, 'error': str(e)}, status=400)


# ============================================
# NAVBAR & FOOTER MANAGEMENT THROUGH WEBSITE CONTROLLER
# ============================================

@api_view(['GET'])
@permission_classes([IsStaffUser])
def api_get_navbar_config(request):
    """
    Get current navbar configuration with all navigation items and structure.
    Used by website controller admin panel.
    """
    try:
        from erp_api.models import HomepageNavigation
        
        # Get all navigation items organized by parent
        nav_items = HomepageNavigation.objects.filter(is_active=True).order_by('order')
        
        # Separate parent and child items
        parent_items = []
        for item in nav_items.filter(parent__isnull=True):
            item_data = {
                'id': item.id,
                'label': item.label,
                'url': item.url,
                'icon_class': item.icon_class or '',
                'order': item.order,
                'is_active': item.is_active,
                'is_dropdown': item.is_dropdown,
                'submenu': []
            }
            
            # Add submenu items if dropdown
            if item.is_dropdown:
                submenu_items = item.submenu.filter(is_active=True).order_by('order')
                for sub_item in submenu_items:
                    item_data['submenu'].append({
                        'id': sub_item.id,
                        'label': sub_item.label,
                        'url': sub_item.url,
                        'icon_class': sub_item.icon_class or '',
                        'order': sub_item.order,
                        'is_active': sub_item.is_active,
                    })
            
            parent_items.append(item_data)
        
        return JsonResponse({
            'success': True,
            'navbar_items': parent_items,
            'total_items': len(parent_items)
        })
    
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@api_view(['POST'])
@permission_classes([IsStaffUser])
def api_save_navbar_item(request):
    """
    Add or update a navbar item through website controller.
    POST data: {
        'id': (optional, for update),
        'label': 'Menu Label',
        'url': '/menu-url',
        'icon_class': 'fas fa-icon',
        'order': 1,
        'is_active': True,
        'is_dropdown': False,
        'parent_id': (optional, for submenu)
    }
    """
    if not request.user.is_staff and not request.user.is_superuser:
        return JsonResponse({
            'success': False,
            'error': 'Unauthorized: Admin access required'
        }, status=403)
    
    try:
        from erp_api.models import HomepageNavigation
        
        data = json.loads(request.body)
        
        # Validate required fields
        required_fields = ['label', 'url']
        for field in required_fields:
            if not data.get(field):
                return JsonResponse({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }, status=400)
        
        item_id = data.get('id')
        
        if item_id:
            # Update existing
            try:
                nav_item = HomepageNavigation.objects.get(id=item_id)
            except HomepageNavigation.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'error': 'Navbar item not found'
                }, status=404)
        else:
            # Create new
            nav_item = HomepageNavigation()
        
        # Update fields
        nav_item.label = data.get('label', '').strip()
        nav_item.url = data.get('url', '').strip()
        nav_item.icon_class = data.get('icon_class', '').strip()
        nav_item.order = int(data.get('order', 0))
        nav_item.is_active = data.get('is_active', True)
        nav_item.is_dropdown = data.get('is_dropdown', False)
        
        # Handle parent/submenu
        parent_id = data.get('parent_id')
        if parent_id:
            try:
                parent = HomepageNavigation.objects.get(id=parent_id)
                nav_item.parent = parent
            except HomepageNavigation.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'error': 'Parent menu item not found'
                }, status=404)
        else:
            nav_item.parent = None
        
        nav_item.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Navbar item saved successfully',
            'navbar_item': {
                'id': nav_item.id,
                'label': nav_item.label,
                'url': nav_item.url,
                'is_dropdown': nav_item.is_dropdown,
            }
        })
    
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'error': 'Invalid JSON format'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@api_view(['POST'])
@permission_classes([IsStaffUser])
def api_delete_navbar_item(request):
    """
    Delete a navbar item and its submenu items.
    POST data: {'id': item_id}
    """
    try:
        from erp_api.models import HomepageNavigation
        
        data = json.loads(request.body)
        item_id = data.get('id')
        
        if not item_id:
            return JsonResponse({
                'success': False,
                'error': 'Missing item ID'
            }, status=400)
        
        try:
            nav_item = HomepageNavigation.objects.get(id=item_id)
            label = nav_item.label
            nav_item.delete()
            
            return JsonResponse({
                'success': True,
                'message': f'Navbar item "{label}" deleted successfully'
            })
        except HomepageNavigation.DoesNotExist:
            return JsonResponse({
                'success': False,
                'error': 'Navbar item not found'
            }, status=404)
    
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@api_view(['GET'])
@permission_classes([IsStaffUser])
def api_get_footer_config(request):
    """
    Get current footer configuration with all sections, links, and social media.
    Used by website controller admin panel.
    """
    try:
        from erp_api.models import HomepageFooterSection, HomepageFooterLink, HomepageSocialLink
        
        # Get all footer sections
        footer_sections = HomepageFooterSection.objects.filter(is_active=True).order_by('order')
        
        sections_data = []
        for section in footer_sections:
            section_data = {
                'id': section.id,
                'column_title': section.column_title,
                'column_type': section.column_type,
                'content': section.content or '',
                'order': section.order,
                'is_active': section.is_active,
                'links': []
            }
            
            # Get links for this section (if applicable)
            if section.column_type in ['menu', 'account', 'info']:
                links = HomepageFooterLink.objects.filter(
                    section=section,
                    is_active=True
                ).order_by('order')
                
                for link in links:
                    section_data['links'].append({
                        'id': link.id,
                        'link_text': link.link_text,
                        'link_url': link.link_url,
                        'order': link.order,
                        'is_active': link.is_active,
                    })
            
            sections_data.append(section_data)
        
        # Get social media links
        social_links = HomepageSocialLink.objects.filter(is_active=True).order_by('order')
        
        social_data = []
        for social in social_links:
            social_data.append({
                'id': social.id,
                'platform': social.platform,
                'url': social.url,
                'icon_class': social.icon_class or '',
                'order': social.order,
                'is_active': social.is_active,
            })
        
        return JsonResponse({
            'success': True,
            'footer_sections': sections_data,
            'social_links': social_data,
            'total_sections': len(sections_data),
            'total_social_links': len(social_data)
        })
    
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@api_view(['POST'])
@permission_classes([IsStaffUser])
def api_save_footer_section(request):
    """
    Add or update a footer section through website controller.
    POST data: {
        'id': (optional, for update),
        'column_title': 'Section Title',
        'column_type': 'about|menu|account|info|contact',
        'content': 'Section content (for about/contact)',
        'order': 1,
        'is_active': True
    }
    """
    try:
        from erp_api.models import HomepageFooterSection
        
        data = json.loads(request.body)
        
        # Validate required fields
        required_fields = ['column_title', 'column_type']
        for field in required_fields:
            if not data.get(field):
                return JsonResponse({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }, status=400)
        
        valid_types = ['about', 'menu', 'account', 'info', 'contact']
        if data.get('column_type') not in valid_types:
            return JsonResponse({
                'success': False,
                'error': f'Invalid column type. Must be one of: {", ".join(valid_types)}'
            }, status=400)
        
        section_id = data.get('id')
        
        if section_id:
            # Update existing
            try:
                section = HomepageFooterSection.objects.get(id=section_id)
            except HomepageFooterSection.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'error': 'Footer section not found'
                }, status=404)
        else:
            # Create new
            section = HomepageFooterSection()
        
        # Update fields
        section.column_title = data.get('column_title', '').strip()
        section.column_type = data.get('column_type', '').strip()
        section.content = data.get('content', '').strip()
        section.order = int(data.get('order', 0))
        section.is_active = data.get('is_active', True)
        
        section.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Footer section saved successfully',
            'footer_section': {
                'id': section.id,
                'column_title': section.column_title,
                'column_type': section.column_type,
            }
        })
    
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'error': 'Invalid JSON format'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@api_view(['POST'])
@permission_classes([IsStaffUser])
def api_save_footer_link(request):
    """
    Add or update a footer link under a section.
    POST data: {
        'id': (optional, for update),
        'section_id': section_id,
        'link_text': 'Link Text',
        'link_url': '/link-url',
        'order': 1,
        'is_active': True
    }
    """
    try:
        from erp_api.models import HomepageFooterSection, HomepageFooterLink
        
        data = json.loads(request.body)
        
        # Validate required fields
        required_fields = ['section_id', 'link_text', 'link_url']
        for field in required_fields:
            if not data.get(field):
                return JsonResponse({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }, status=400)
        
        link_id = data.get('id')
        
        if link_id:
            # Update existing
            try:
                link = HomepageFooterLink.objects.get(id=link_id)
            except HomepageFooterLink.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'error': 'Footer link not found'
                }, status=404)
        else:
            # Create new
            link = HomepageFooterLink()
        
        # Get section
        try:
            section = HomepageFooterSection.objects.get(id=data.get('section_id'))
        except HomepageFooterSection.DoesNotExist:
            return JsonResponse({
                'success': False,
                'error': 'Footer section not found'
            }, status=404)
        
        # Update fields
        link.section = section
        link.link_text = data.get('link_text', '').strip()
        link.link_url = data.get('link_url', '').strip()
        link.order = int(data.get('order', 0))
        link.is_active = data.get('is_active', True)
        
        link.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Footer link saved successfully',
            'footer_link': {
                'id': link.id,
                'link_text': link.link_text,
                'link_url': link.link_url,
            }
        })
    
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'error': 'Invalid JSON format'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)

@api_view(['POST'])
@permission_classes([IsStaffUser])
def api_delete_footer_section(request):
    """
    Delete a footer section and all its links.
    POST data: {'id': section_id}
    """
    try:
        from erp_api.models import HomepageFooterSection
        
        data = json.loads(request.body)
        section_id = data.get('id')
        
        if not section_id:
            return JsonResponse({
                'success': False,
                'error': 'Missing section ID'
            }, status=400)
        
        try:
            section = HomepageFooterSection.objects.get(id=section_id)
            title = section.column_title
            section.delete()
            
            return JsonResponse({
                'success': True,
                'message': f'Footer section "{title}" deleted successfully'
            })
        except HomepageFooterSection.DoesNotExist:
            return JsonResponse({
                'success': False,
                'error': 'Footer section not found'
            }, status=404)
    
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@api_view(['POST'])
@permission_classes([IsStaffUser])
def api_delete_footer_link(request):
    """
    Delete a footer link.
    POST data: {'id': link_id}
    """
    try:
        from erp_api.models import HomepageFooterLink
        
        data = json.loads(request.body)
        link_id = data.get('id')
        
        if not link_id:
            return JsonResponse({
                'success': False,
                'error': 'Missing link ID'
            }, status=400)
        
        try:
            link = HomepageFooterLink.objects.get(id=link_id)
            link_text = link.link_text
            link.delete()
            
            return JsonResponse({
                'success': True,
                'message': f'Footer link "{link_text}" deleted successfully'
            })
        except HomepageFooterLink.DoesNotExist:
            return JsonResponse({
                'success': False,
                'error': 'Footer link not found'
            }, status=404)
    
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@api_view(['POST'])
@permission_classes([IsStaffUser])
def api_save_social_link(request):
    """
    Add or update a social media link in footer.
    POST data: {
        'id': (optional, for update),
        'platform': 'facebook|instagram|twitter|pinterest|linkedin|youtube',
        'url': 'https://social-media-url',
        'icon_class': 'fab fa-facebook',
        'order': 1,
        'is_active': True
    }
    """
    try:
        from erp_api.models import HomepageSocialLink
        
        data = json.loads(request.body)
        
        # Validate required fields
        required_fields = ['platform', 'url']
        for field in required_fields:
            if not data.get(field):
                return JsonResponse({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }, status=400)
        
        valid_platforms = ['facebook', 'instagram', 'twitter', 'pinterest', 'linkedin', 'youtube']
        if data.get('platform') not in valid_platforms:
            return JsonResponse({
                'success': False,
                'error': f'Invalid platform. Must be one of: {", ".join(valid_platforms)}'
            }, status=400)
        
        social_id = data.get('id')
        
        if social_id:
            # Update existing
            try:
                social = HomepageSocialLink.objects.get(id=social_id)
            except HomepageSocialLink.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'error': 'Social link not found'
                }, status=404)
        else:
            # Create new
            social = HomepageSocialLink()
        
        # Update fields
        social.platform = data.get('platform', '').strip()
        social.url = data.get('url', '').strip()
        social.icon_class = data.get('icon_class', '').strip()
        social.order = int(data.get('order', 0))
        social.is_active = data.get('is_active', True)
        
        social.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Social link saved successfully',
            'social_link': {
                'id': social.id,
                'platform': social.platform,
                'url': social.url,
            }
        })
    
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'error': 'Invalid JSON format'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@api_view(['POST'])
@permission_classes([IsStaffUser])
def api_delete_social_link(request):
    """
    Delete a social media link.
    POST data: {'id': social_id}
    """
    try:
        from erp_api.models import HomepageSocialLink
        
        data = json.loads(request.body)
        social_id = data.get('id')
        
        if not social_id:
            return JsonResponse({
                'success': False,
                'error': 'Missing social link ID'
            }, status=400)
        
        try:
            social = HomepageSocialLink.objects.get(id=social_id)
            platform = social.platform
            social.delete()
            
            return JsonResponse({
                'success': True,
                'message': f'{platform.title()} link deleted successfully'
            })
        except HomepageSocialLink.DoesNotExist:
            return JsonResponse({
                'success': False,
                'error': 'Social link not found'
            }, status=404)
    
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


# ============================================
# PUBLIC CATALOG API (Products Page)
# ============================================

@api_view(['GET'])
@permission_classes([AllowAny])
def api_catalog_products(request):
    """
    Get products for public catalog page with filtering and sorting.
    Query params:
    - categories: comma-separated category IDs
    - min_price: minimum price (default 0)
    - max_price: maximum price (default 999999)
    - sort: newest|price_low|price_high|name (default newest)
    """
    try:
        from erp_api.models import Product
        
        # Get filter parameters
        category_ids = request.GET.get('categories', '')
        min_price = float(request.GET.get('min_price', 0))
        max_price = float(request.GET.get('max_price', 999999))
        sort_by = request.GET.get('sort', 'newest')
        
        # Base query - only active products
        products = Product.objects.filter(is_active=True).select_related('category')
        
        # Filter by categories if provided
        if category_ids:
            category_list = [int(cid) for cid in category_ids.split(',') if cid.isdigit()]
            if category_list:
                products = products.filter(category_id__in=category_list)
        
        # Filter by price range
        products = products.filter(price__gte=min_price, price__lte=max_price)
        
        # Apply sorting
        if sort_by == 'price_low':
            products = products.order_by('price')
        elif sort_by == 'price_high':
            products = products.order_by('-price')
        elif sort_by == 'name':
            products = products.order_by('name')
        else:  # newest
            products = products.order_by('-created_at')
        
        # Build product list
        product_list = []
        for product in products:
            product_data = {
                'id': product.id,
                'name': product.name,
                'description': product.description or '',
                'price': float(product.price),
                'cost_price': float(product.cost) if product.cost else None,
                'discount_percent': getattr(product, 'discount_percent', 0),
                'image': product.image.url if product.image else None,
                'category': {
                    'id': product.category.id,
                    'name': product.category.name
                } if product.category else None,
                'stock_quantity': product.stock_quantity,
                'sku': product.sku,
            }
            product_list.append(product_data)
        
        return JsonResponse({
            'success': True,
            'results': product_list,
            'count': len(product_list)
        })
    
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@api_view(['GET'])
@permission_classes([AllowAny])
def api_product_categories(request):
    """
    Get all product categories with product count for catalog filters.
    """
    try:
        from erp_api.models import Product, ProductCategory
        
        # Get all categories
        categories = ProductCategory.objects.filter(is_active=True)
        
        category_list = []
        for category in categories:
            # Count products in this category
            product_count = Product.objects.filter(
                category=category,
                is_active=True
            ).count()
            
            category_data = {
                'id': category.id,
                'name': category.name,
                'product_count': product_count
            }
            category_list.append(category_data)
        
        return JsonResponse({
            'success': True,
            'results': category_list,
            'count': len(category_list)
        })
    
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)
