from django.conf import settings
from django.shortcuts import redirect


class RequireLoginMiddleware:
    """
    Redirect unauthenticated users to the login page for all requests
    except authentication endpoints, admin, and static/media.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        login_url = settings.LOGIN_URL or '/accounts/login/'

        # Allowed prefixes that should not be redirected
        allowed_paths = (
            login_url,
            '/accounts/logout/',
            '/accounts/password_reset/',
            '/login/',
            '/api/',  # Allow all API endpoints
            '/favicon.ico',
            '/admin/',
            settings.STATIC_URL,
            settings.MEDIA_URL,
        )

        path = request.path

        # If hitting root and already authenticated, go to dashboard
        if request.path == '/' and request.user.is_authenticated:
            return redirect('/dashboard/')

        # If user is not authenticated and requesting a non-allowed path,
        # redirect to login.
        if not request.user.is_authenticated:
            is_allowed = any(path.startswith(p) for p in allowed_paths if p)
            if not is_allowed:
                return redirect(f"{login_url}?next={path}")

        response = self.get_response(request)
        return response
