#!/usr/bin/env python
"""
Quick user creation script - just run this to create test users
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'erp_backend.settings')
django.setup()

from django.contrib.auth.models import User
from erp_api.models import UserProfile

print("="*70)
print("CREATING TEST USERS")
print("="*70)

# Test users to create
test_users = [
    {
        'type': 'staff',
        'first_name': 'Test',
        'last_name': 'Staff',
        'username': 'teststaff',
        'email': 'teststaff@test.com',
        'password': 'TestStaff@123',
        'department': 'Sales',
        'phone': '555-0001'
    },
    {
        'type': 'finance',
        'first_name': 'Test',
        'last_name': 'Finance',
        'username': 'testfinance',
        'email': 'testfinance@test.com',
        'password': 'TestFinance@123',
        'department': 'Accounting',
        'phone': '555-0002'
    }
]

for user_data in test_users:
    user_type = user_data.pop('type')
    department = user_data.pop('department', '')
    phone = user_data.pop('phone', '')
    
    # Check if username exists
    if User.objects.filter(username=user_data['username']).exists():
        print(f"\n⚠️  Username '{user_data['username']}' already exists, skipping...")
        continue
    
    try:
        print(f"\n[*] Creating {user_type} user: {user_data['username']}")
        
        # Create user
        user = User.objects.create_user(**user_data)
        print(f"    ✅ User created (ID: {user.id})")
        
        # Create profile
        role = user_type
        if role == 'staff':
            unique_id = f'STAFF{user.id:04d}'
        else:
            unique_id = f'FIN{user.id:03d}'
        
        profile = UserProfile.objects.create(
            user=user,
            unique_id=unique_id,
            role=role,
            department=department,
            phone=phone
        )
        print(f"    ✅ Profile created")
        print(f"    📌 Unique ID: {unique_id}")
        print(f"    🔐 Password: {user_data['password']}")
        
    except Exception as e:
        print(f"    ❌ Error: {str(e)}")

print(f"\n{'='*70}")
print("VERIFICATION")
print("="*70)

staff = UserProfile.objects.filter(role='staff')
finance = UserProfile.objects.filter(role='finance')

print(f"\n✅ STAFF USERS ({staff.count()}):")
for p in staff:
    print(f"   {p.unique_id}: {p.user.username}")

print(f"\n✅ FINANCE USERS ({finance.count()}):")
for p in finance:
    print(f"   {p.unique_id}: {p.user.username}")

print(f"\n{'='*70}\n")
