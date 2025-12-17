#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'erp_backend.settings')
django.setup()

from django.contrib.auth.models import User
from erp_api.models import UserProfile

print("=" * 80)
print("VERIFYING NEWLY CREATED USERS IN DATABASE")
print("=" * 80)

# Check staff user
user1 = User.objects.filter(username='webtest_staff_2025').first()
if user1:
    profile1 = user1.userprofile
    print(f"\n✅ STAFF USER VERIFIED:")
    print(f"   Username: {user1.username}")
    print(f"   Email: {user1.email}")
    print(f"   Unique ID: {profile1.unique_id}")
    print(f"   Role: {profile1.role}")
else:
    print("\n❌ Staff user not found")

# Check finance user
user2 = User.objects.filter(username='webtest_finance_2025').first()
if user2:
    profile2 = user2.userprofile
    print(f"\n✅ FINANCE USER VERIFIED:")
    print(f"   Username: {user2.username}")
    print(f"   Email: {user2.email}")
    print(f"   Unique ID: {profile2.unique_id}")
    print(f"   Role: {profile2.role}")
else:
    print("\n❌ Finance user not found")

print("\n" + "=" * 80)
print("DATABASE VERIFICATION COMPLETE")
print("=" * 80)
