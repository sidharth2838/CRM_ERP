from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Create a test user for login'

    def add_arguments(self, parser):
        parser.add_argument('--username', type=str, default='admin', help='Username for the test user')
        parser.add_argument('--password', type=str, default='admin123', help='Password for the test user')
        parser.add_argument('--email', type=str, default='admin@example.com', help='Email for the test user')
        parser.add_argument('--role', type=str, default='admin', help='Role for the user profile')

    def handle(self, *args, **options):
        username = options['username']
        password = options['password']
        email = options['email']
        role = options['role']

        # Check if user already exists
        if User.objects.filter(username=username).exists():
            self.stdout.write(self.style.WARNING(f'User "{username}" already exists'))
            return

        # Create user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name='Test',
            last_name='User',
            is_staff=True,
            is_superuser=(role == 'admin')
        )

        # Update user profile
        if hasattr(user, 'userprofile'):
            user.userprofile.role = role
            user.userprofile.save()

        self.stdout.write(self.style.SUCCESS(f'Successfully created user "{username}"'))
        self.stdout.write(f'Username: {username}')
        self.stdout.write(f'Password: {password}')
        self.stdout.write(f'Email: {email}')
        self.stdout.write(f'Role: {role}')
