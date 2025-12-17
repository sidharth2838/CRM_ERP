# Catalog/Public Products API
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
