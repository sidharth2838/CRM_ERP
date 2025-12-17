from django.contrib.auth.models import User

# Update manager password to match admin
try:
    manager = User.objects.get(username='manager')
    manager.set_password('sidharth')
    manager.save()
    print(f"✓ Manager password updated to: sidharth")
    print(f"  Username: manager")
    print(f"  Password: sidharth")
except User.DoesNotExist:
    print("Manager user not found. Creating manager user...")
    manager = User.objects.create_user(
        username='manager',
        email='manager@company.com',
        password='sidharth',
        first_name='Manager',
        last_name='User'
    )
    print(f"✓ Manager user created successfully")
    print(f"  Username: manager")
    print(f"  Password: sidharth")

# Verify both users exist
admin = User.objects.get(username='sidharth')
print(f"\n✓ Verified credentials:")
print(f"  Admin: sidharth / sidharth")
print(f"  Manager: manager / sidharth")
