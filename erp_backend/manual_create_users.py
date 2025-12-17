#!/usr/bin/env python
"""
Manually create staff and finance users
Run from: cd erp_backend && python manual_create_users.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'erp_backend.settings')
django.setup()

from django.contrib.auth.models import User
from erp_api.models import UserProfile

print("=" * 70)
print("CREATING STAFF & FINANCE USERS MANUALLY")
print("=" * 70)

# Staff Users to create
staff_data = [
    {
        'first_name': 'John',
        'last_name': 'Smith',
        'username': 'jsmith',
        'email': 'jsmith@company.com',
        'password': 'StaffPass@123',
        'dept': 'Sales',
        'phone': '555-0001'
    },
    {
        'first_name': 'Sarah',
        'last_name': 'Johnson',
        'username': 'sjohnson',
        'email': 'sjohnson@company.com',
        'password': 'StaffPass@123',
        'dept': 'Operations',
        'phone': '555-0002'
    },
    {
        'first_name': 'Michael',
        'last_name': 'Davis',
        'username': 'mdavis',
        'email': 'mdavis@company.com',
        'password': 'StaffPass@123',
        'dept': 'Marketing',
        'phone': '555-0003'
    },
]

print("\n📝 CREATING STAFF USERS:\n")
staff_created = 0
for staff in staff_data:
    try:
        # Check if user already exists
        if User.objects.filter(username=staff['username']).exists():
            print(f"⚠ {staff['username']} already exists, skipping...")
            continue
            
        user = User.objects.create_user(
            username=staff['username'],
            email=staff['email'],
            password=staff['password'],
            first_name=staff['first_name'],
            last_name=staff['last_name']
        )
        
        profile, created = UserProfile.objects.get_or_create(
            user=user,
            defaults={
                'unique_id': f"STAFF{user.id:04d}",
                'role': 'staff',
                'department': staff['dept'],
                'phone': staff['phone']
            }
        )
        
        print(f"✓ {staff['first_name']} {staff['last_name']}")
        print(f"  Username: {user.username}")
        print(f"  Email: {user.email}")
        print(f"  Password: {staff['password']}")
        print(f"  Unique ID: {profile.unique_id}")
        print(f"  Department: {profile.department}")
        print(f"  Phone: {profile.phone}")
        print()
        staff_created += 1
    except Exception as e:
        print(f"✗ Error creating {staff['username']}: {str(e)}\n")

# Finance Users to create
finance_data = [
    {
        'first_name': 'Emily',
        'last_name': 'Wilson',
        'username': 'ewilson',
        'email': 'ewilson@company.com',
        'password': 'FinancePass@123',
        'dept': 'Finance',
        'phone': '555-0101'
    },
    {
        'first_name': 'David',
        'last_name': 'Martinez',
        'username': 'dmartinez',
        'email': 'dmartinez@company.com',
        'password': 'FinancePass@123',
        'dept': 'Accounting',
        'phone': '555-0102'
    },
    {
        'first_name': 'Lisa',
        'last_name': 'Anderson',
        'username': 'landerson',
        'email': 'landerson@company.com',
        'password': 'FinancePass@123',
        'dept': 'Payroll',
        'phone': '555-0103'
    },
]

print("\n💰 CREATING FINANCE USERS:\n")
finance_created = 0
for finance in finance_data:
    try:
        # Check if user already exists
        if User.objects.filter(username=finance['username']).exists():
            print(f"⚠ {finance['username']} already exists, skipping...")
            continue
            
        user = User.objects.create_user(
            username=finance['username'],
            email=finance['email'],
            password=finance['password'],
            first_name=finance['first_name'],
            last_name=finance['last_name']
        )
        
        profile, created = UserProfile.objects.get_or_create(
            user=user,
            defaults={
                'unique_id': f"FIN{user.id:03d}",
                'role': 'finance',
                'department': finance['dept'],
                'phone': finance['phone']
            }
        )
        
        print(f"✓ {finance['first_name']} {finance['last_name']}")
        print(f"  Username: {user.username}")
        print(f"  Email: {user.email}")
        print(f"  Password: {finance['password']}")
        print(f"  Unique ID: {profile.unique_id}")
        print(f"  Department: {profile.department}")
        print(f"  Phone: {profile.phone}")
        print()
        finance_created += 1
    except Exception as e:
        print(f"✗ Error creating {finance['username']}: {str(e)}\n")

print("\n" + "=" * 70)
print("VERIFICATION - ALL USERS IN SYSTEM")
print("=" * 70)

staff_users = UserProfile.objects.filter(role='staff')
finance_users = UserProfile.objects.filter(role='finance')

print(f"\n📊 STAFF USERS ({staff_users.count()} total):")
print("-" * 70)
for user in staff_users.order_by('user__date_joined'):
    print(f"  {user.unique_id}: {user.user.first_name} {user.user.last_name}")
    print(f"             Email: {user.user.email} | Dept: {user.department}")

print(f"\n💰 FINANCE USERS ({finance_users.count()} total):")
print("-" * 70)
for user in finance_users.order_by('user__date_joined'):
    print(f"  {user.unique_id}: {user.user.first_name} {user.user.last_name}")
    print(f"             Email: {user.user.email} | Dept: {user.department}")

print("\n" + "=" * 70)
print("✅ OPERATION COMPLETE!")
print("=" * 70)
print(f"\n📈 Summary:")
print(f"   Staff Users Created: {staff_created}")
print(f"   Finance Users Created: {finance_created}")
print(f"   Total Staff Users: {staff_users.count()}")
print(f"   Total Finance Users: {finance_users.count()}")

print(f"\n🔑 Now you can login with any of these accounts:")
print(f"   Example Staff: jsmith / StaffPass@123")
print(f"   Example Finance: ewilson / FinancePass@123")

print("\n📍 Go to: http://127.0.0.1:8000/settings/")
print("   And refresh to see the new users in the list!")
print("=" * 70)
