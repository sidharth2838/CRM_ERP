"""
Middleware to exempt /api/ endpoints from CSRF protection
"""
from django.views.decorators.csrf import csrf_exempt


class CSRFExemptAPIMiddleware:
    """
    Exempts all /api/ endpoints from CSRF protection.
    This is safe for APIs that use token-based authentication or are public.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path.startswith('/api/'):
            request._dont_enforce_csrf_checks = True
        
        response = self.get_response(request)
        return response
