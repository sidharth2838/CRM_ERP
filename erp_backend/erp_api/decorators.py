"""
Role-based access control decorators for FC/CRM system
"""
from functools import wraps
from django.http import HttpResponseForbidden
from django.shortcuts import redirect
from .models import UserProfile


def role_required(*roles):
    """
    Decorator to restrict view access to specific user roles.
    Usage: @role_required('finance', 'admin')
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if not request.user.is_authenticated:
                return redirect('/accounts/login/?next=' + request.path)
            
            try:
                user_profile = UserProfile.objects.get(user=request.user)
                if user_profile.role in roles or user_profile.role == 'admin':
                    return view_func(request, *args, **kwargs)
                else:
                    return HttpResponseForbidden(
                        f'Access Denied: This page is only available to {", ".join(roles)} users.'
                    )
            except UserProfile.DoesNotExist:
                return HttpResponseForbidden('User profile not found.')
        
        return wrapper
    return decorator


def admin_required(view_func):
    """
    Decorator to restrict view access to admin users only.
    Usage: @admin_required
    """
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('/accounts/login/?next=' + request.path)
        
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            if user_profile.role == 'admin':
                return view_func(request, *args, **kwargs)
            else:
                return HttpResponseForbidden('Access Denied: Admin access required.')
        except UserProfile.DoesNotExist:
            return HttpResponseForbidden('User profile not found.')
    
    return wrapper


def admin_or_manager_required(view_func):
    """
    Decorator to restrict view access to admin or manager users.
    Usage: @admin_or_manager_required
    """
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('/accounts/login/?next=' + request.path)
        
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            if user_profile.role in ['admin', 'manager']:
                return view_func(request, *args, **kwargs)
            else:
                return HttpResponseForbidden('Access Denied: Admin or Manager access required.')
        except UserProfile.DoesNotExist:
            return HttpResponseForbidden('User profile not found.')
    
    return wrapper


def finance_required(view_func):
    """
    Decorator to restrict view access to finance users, managers, and admins.
    Usage: @finance_required
    """
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('/accounts/login/?next=' + request.path)
        
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            if user_profile.role in ['finance', 'admin', 'manager']:
                return view_func(request, *args, **kwargs)
            else:
                return HttpResponseForbidden('Access Denied: Finance access required.')
        except UserProfile.DoesNotExist:
            return HttpResponseForbidden('User profile not found.')
    
    return wrapper


def staff_required(view_func):
    """
    Decorator to restrict view access to staff users, admins, and managers.
    Usage: @staff_required
    """
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('/accounts/login/?next=' + request.path)
        
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            if user_profile.role in ['staff', 'admin', 'manager']:
                return view_func(request, *args, **kwargs)
            else:
                return HttpResponseForbidden('Access Denied: Staff access required.')
        except UserProfile.DoesNotExist:
            return HttpResponseForbidden('User profile not found.')
    
    return wrapper
