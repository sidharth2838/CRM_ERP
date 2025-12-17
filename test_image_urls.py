import sys
import os

# Add the erp_backend directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'erp_backend'))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'erp_backend.settings')

import django
django.setup()

from erp_api.models import WebsiteStory, WebsiteTestimonial

# Add stories with image URLs
stories = [
    WebsiteStory(title="Modern Living Room", excerpt="Discover the elegance of modern design", author="Admin", image_url="https://picsum.photos/400/300?random=1"),
    WebsiteStory(title="Cozy Bedroom Retreat", excerpt="Create your perfect sleeping sanctuary", author="Admin", image_url="https://picsum.photos/400/300?random=2"),
    WebsiteStory(title="Kitchen Transformation", excerpt="Beautiful kitchens for modern families", author="Admin", image_url="https://picsum.photos/400/300?random=3"),
]
WebsiteStory.objects.bulk_create(stories)

# Add testimonials with image URLs
testimonials = [
    WebsiteTestimonial(name="Sarah Johnson", role="Homeowner", comment="Absolutely transformed our living space!", rating=5, image_url="https://i.pravatar.cc/150?u=sarah"),
    WebsiteTestimonial(name="Mike Chen", role="Designer", comment="Best furniture investment ever made", rating=5, image_url="https://i.pravatar.cc/150?u=mike"),
    WebsiteTestimonial(name="Emma Davis", role="Interior Designer", comment="Quality and style combined perfectly", rating=5, image_url="https://i.pravatar.cc/150?u=emma"),
]
WebsiteTestimonial.objects.bulk_create(testimonials)

print("✅ Added 3 stories and 3 testimonials with image URLs")
