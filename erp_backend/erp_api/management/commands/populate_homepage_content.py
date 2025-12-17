"""
Management command to populate default homepage content
Usage: python manage.py populate_homepage_content
"""

from django.core.management.base import BaseCommand
from erp_api.models import (
    HomepageHeroSection, HomepageFeature, HomepageSection, 
    HomepageWhyUsItem, HomepageDetailCard, HomepageStory,
    HomepageInstagramSection, HomepageTestimonial, HomepageNavigation,
    HomepageFooterSection, HomepageFooterLink, HomepageSocialLink, HomepageSEO
)
from django.contrib.auth.models import User
from datetime import date


class Command(BaseCommand):
    help = 'Populate homepage content with default data'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting homepage content population...'))
        
        # Get or create admin user
        admin_user = User.objects.filter(is_superuser=True).first()
        if not admin_user:
            self.stdout.write(self.style.WARNING('No admin user found, skipping user reference'))
            admin_user = None
        
        # 1. Create Hero Section
        hero, created = HomepageHeroSection.objects.get_or_create(
            defaults={
                'heading': 'Where Quality Meets Style',
                'subheading': 'Discover our curated collection of premium furniture and home decor for every room in your home',
                'background_color': '#1a1a1a',
                'text_color': '#ffffff',
                'cta_button_text': 'Shop Now',
                'cta_button_url': '/website/products/',
                'is_active': True,
                'updated_by': admin_user,
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS('✓ Created Hero Section'))
        else:
            self.stdout.write(self.style.WARNING('✓ Hero Section already exists'))
        
        # 2. Create Features
        features_data = [
            {
                'title': 'Artisanal Craftsmanship',
                'description': 'Handcrafted pieces with attention to every detail and premium materials',
                'icon_type': 'hammer',
                'order': 0,
            },
            {
                'title': 'Sustainability At Heart',
                'description': 'Eco-friendly materials and sustainable production methods for the environment',
                'icon_type': 'leaf',
                'order': 1,
            },
            {
                'title': 'Customize For Personal Touch',
                'description': 'Design your perfect space with our customizable options and styles',
                'icon_type': 'palette',
                'order': 2,
            },
            {
                'title': 'Durability & Quality Focus',
                'description': 'Built to last for generations with long-lasting comfort and quality',
                'icon_type': 'shield',
                'order': 3,
            },
        ]
        
        for feature_data in features_data:
            feature, created = HomepageFeature.objects.get_or_create(
                title=feature_data['title'],
                defaults={
                    **feature_data,
                    'background_color': '#f9f8f6',
                    'text_color': '#5a5a5a',
                    'accent_color': '#d4a574',
                    'is_active': True,
                    'updated_by': admin_user,
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Created Feature: {feature_data["title"]}'))
        
        # 3. Create Why Us Section
        why_us_section, created = HomepageSection.objects.get_or_create(
            section_type='why_us',
            defaults={
                'heading': 'Why Our Furniture Is Something More?',
                'description': 'Premium quality materials sourced responsibly with expert craftsmanship',
                'background_color': '#ffffff',
                'text_color': '#2e2e2e',
                'accent_color': '#d4a574',
                'is_active': True,
                'order': 0,
                'updated_by': admin_user,
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS('✓ Created Why Us Section'))
            
            # Add Why Us items
            why_us_items = [
                'Premium quality materials sourced responsibly',
                'Expert craftsmanship in every single piece',
                'Sustainable and eco-friendly production',
                'Customizable designs for your unique style',
                'Lifetime warranty on select items',
                'Fast and free shipping on orders over $100',
            ]
            
            for idx, item_text in enumerate(why_us_items):
                HomepageWhyUsItem.objects.get_or_create(
                    section=why_us_section,
                    text=item_text,
                    defaults={'order': idx, 'is_active': True}
                )
            self.stdout.write(self.style.SUCCESS(f'  ✓ Added {len(why_us_items)} Why Us items'))
        
        # 4. Create Details Section
        details_section, created = HomepageSection.objects.get_or_create(
            section_type='details',
            defaults={
                'heading': 'Details Are Important',
                'description': 'We focus on every detail to ensure you get the best experience',
                'background_color': '#f9f8f6',
                'text_color': '#2e2e2e',
                'accent_color': '#d4a574',
                'is_active': True,
                'order': 1,
                'updated_by': admin_user,
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS('✓ Created Details Section'))
            
            # Add detail cards
            detail_cards = [
                {
                    'title': 'Fast Shipping',
                    'description': 'We offer express shipping on all orders to get your furniture to you quickly and safely worldwide',
                    'icon_type': 'truck',
                },
                {
                    'title': 'Easy Returns',
                    'description': 'Not satisfied? Return within 30 days for a full refund. No questions asked or hassles involved',
                    'icon_type': 'undo',
                },
                {
                    'title': 'Expert Support',
                    'description': 'Our customer service team is available 24/7 to help with any questions or concerns you have',
                    'icon_type': 'headset',
                },
            ]
            
            for idx, card_data in enumerate(detail_cards):
                HomepageDetailCard.objects.get_or_create(
                    section=details_section,
                    title=card_data['title'],
                    defaults={
                        **card_data,
                        'order': idx,
                        'is_active': True,
                    }
                )
            self.stdout.write(self.style.SUCCESS(f'  ✓ Added {len(detail_cards)} detail cards'))
        
        # 5. Create Stories Section
        stories_section, created = HomepageSection.objects.get_or_create(
            section_type='stories',
            defaults={
                'heading': 'Stories About How We Work',
                'description': 'Discover how our furniture can transform your home and lifestyle',
                'background_color': '#ffffff',
                'text_color': '#2e2e2e',
                'accent_color': '#d4a574',
                'is_active': True,
                'order': 2,
                'updated_by': admin_user,
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS('✓ Created Stories Section'))
            
            # Add stories
            stories_data = [
                {
                    'title': 'Create a Modern Bohemian Home Office',
                    'excerpt': 'Be unique and transform your workspace with eco-friendly furniture and natural elements',
                    'story_date': date(2025, 4, 1),
                    'icon_type': 'home',
                },
                {
                    'title': 'Scandinavian Style Ideas with Luxury Touch',
                    'excerpt': 'Discover how to blend minimalism with luxury in your home design and lifestyle',
                    'story_date': date(2025, 4, 1),
                    'icon_type': 'sofa',
                },
                {
                    'title': 'Modular Kitchen Design in Canada',
                    'excerpt': 'Discover sustainable materials and functional beauty combined in modern kitchens',
                    'story_date': date(2025, 4, 1),
                    'icon_type': 'utensils',
                },
            ]
            
            for idx, story_data in enumerate(stories_data):
                # Note: featured_image is required, so we'll skip creating without it
                # In production, admin users will upload images through admin panel
                self.stdout.write(self.style.WARNING(f'  ℹ Story "{story_data["title"]}" needs featured_image - add through admin panel'))
        
        # 6. Create Instagram Section
        instagram_section, created = HomepageSection.objects.get_or_create(
            section_type='instagram',
            defaults={
                'heading': 'Follow Us On Instagram',
                'description': 'See the latest furniture and home decor ideas',
                'background_color': '#f9f8f6',
                'text_color': '#2e2e2e',
                'accent_color': '#d4a574',
                'is_active': True,
                'order': 3,
                'updated_by': admin_user,
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS('✓ Created Instagram Section'))
            
            # Add Instagram config
            HomepageInstagramSection.objects.get_or_create(
                section=instagram_section,
                defaults={
                    'instagram_handle': '@CozyCorner',
                    'instagram_url': 'https://instagram.com/cozycorner',
                    'grid_items_count': 6,
                    'is_active': True,
                }
            )
            self.stdout.write(self.style.SUCCESS('  ✓ Configured Instagram section'))
        
        # 7. Create Testimonials Section
        testimonials_section, created = HomepageSection.objects.get_or_create(
            section_type='testimonials',
            defaults={
                'heading': 'What Our Customers Say',
                'description': 'Real feedback from our satisfied customers',
                'background_color': '#ffffff',
                'text_color': '#2e2e2e',
                'accent_color': '#d4a574',
                'is_active': True,
                'order': 4,
                'updated_by': admin_user,
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS('✓ Created Testimonials Section'))
            
            # Add testimonials
            testimonials_data = [
                {
                    'author_name': 'Sarah Johnson',
                    'author_title': 'Verified Purchase',
                    'rating': 5,
                    'testimonial_text': 'Absolutely love the quality and design! The sofa I purchased is both comfortable and stylish. Exceeded my expectations!',
                },
                {
                    'author_name': 'Mike Chen',
                    'author_title': 'Verified Purchase',
                    'rating': 5,
                    'testimonial_text': 'Best furniture shopping experience ever. Great customer service, beautiful designs, and incredibly fast shipping!',
                },
                {
                    'author_name': 'Emma Williams',
                    'author_title': 'Verified Purchase',
                    'rating': 5,
                    'testimonial_text': 'The customization options allowed me to create my dream living room. Every detail is perfect. Highly recommended!',
                },
            ]
            
            for idx, testimonial_data in enumerate(testimonials_data):
                HomepageTestimonial.objects.get_or_create(
                    section=testimonials_section,
                    author_name=testimonial_data['author_name'],
                    defaults={
                        **testimonial_data,
                        'order': idx,
                        'is_active': True,
                    }
                )
            self.stdout.write(self.style.SUCCESS(f'  ✓ Added {len(testimonials_data)} testimonials'))
        
        # 8. Create Navigation Items
        nav_items = [
            {'label': 'HOME', 'url': '/website/', 'order': 0},
            {'label': 'PRODUCTS', 'url': '/website/products/', 'order': 1},
            {'label': 'ROOMS', 'url': '#', 'order': 2},
            {'label': 'INSPIRATIONS', 'url': '#', 'order': 3},
            {'label': 'OFFERS', 'url': '#', 'order': 4},
            {'label': 'ABOUT', 'url': '/website/about/', 'order': 5},
            {'label': 'BLOG', 'url': '#', 'order': 6},
            {'label': 'CONTACT', 'url': '/website/contact/', 'order': 7},
        ]
        
        nav_count = 0
        for nav_data in nav_items:
            _, created = HomepageNavigation.objects.get_or_create(
                label=nav_data['label'],
                defaults={
                    **nav_data,
                    'is_active': True,
                }
            )
            if created:
                nav_count += 1
        
        self.stdout.write(self.style.SUCCESS(f'✓ Created/Updated {nav_count} navigation items'))
        
        # 9. Create Footer Sections
        footer_sections = [
            {
                'column_title': 'CozyCorner',
                'column_type': 'about',
                'content': 'Premium furniture for modern living. Quality, style, and sustainability combined for your perfect home.',
                'order': 0,
            },
            {
                'column_title': 'Menu',
                'column_type': 'menu',
                'order': 1,
            },
            {
                'column_title': 'Account',
                'column_type': 'account',
                'order': 2,
            },
            {
                'column_title': 'Information',
                'column_type': 'info',
                'order': 3,
            },
        ]
        
        for section_data in footer_sections:
            section, created = HomepageFooterSection.objects.get_or_create(
                column_title=section_data['column_title'],
                defaults={
                    **section_data,
                    'is_active': True,
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Created Footer Section: {section_data["column_title"]}'))
        
        # 10. Create Footer Links for Menu
        menu_section = HomepageFooterSection.objects.filter(column_type='menu').first()
        if menu_section:
            menu_links = [
                {'link_text': 'Home', 'link_url': '/website/', 'order': 0},
                {'link_text': 'Products', 'link_url': '/website/products/', 'order': 1},
                {'link_text': 'Rooms', 'link_url': '#', 'order': 2},
                {'link_text': 'About Us', 'link_url': '/website/about/', 'order': 3},
                {'link_text': 'Blog', 'link_url': '#', 'order': 4},
            ]
            
            for link_data in menu_links:
                HomepageFooterLink.objects.get_or_create(
                    section=menu_section,
                    link_text=link_data['link_text'],
                    defaults={
                        **link_data,
                        'is_active': True,
                    }
                )
            self.stdout.write(self.style.SUCCESS(f'  ✓ Added menu footer links'))
        
        # 11. Create Account Footer Links
        account_section = HomepageFooterSection.objects.filter(column_type='account').first()
        if account_section:
            account_links = [
                {'link_text': 'Cart', 'link_url': '/website/cart/', 'order': 0},
                {'link_text': 'My Account', 'link_url': '/website/account/', 'order': 1},
                {'link_text': 'My Orders', 'link_url': '/website/orders/', 'order': 2},
                {'link_text': 'Wishlist', 'link_url': '#', 'order': 3},
            ]
            
            for link_data in account_links:
                HomepageFooterLink.objects.get_or_create(
                    section=account_section,
                    link_text=link_data['link_text'],
                    defaults={
                        **link_data,
                        'is_active': True,
                    }
                )
            self.stdout.write(self.style.SUCCESS(f'  ✓ Added account footer links'))
        
        # 12. Create Info Footer Links
        info_section = HomepageFooterSection.objects.filter(column_type='info').first()
        if info_section:
            info_links = [
                {'link_text': 'Track Order', 'link_url': '#', 'order': 0},
                {'link_text': 'Returns & Exchanges', 'link_url': '#', 'order': 1},
                {'link_text': 'Contact Us', 'link_url': '/website/contact/', 'order': 2},
                {'link_text': 'Help & Support', 'link_url': '#', 'order': 3},
                {'link_text': 'Shipping Info', 'link_url': '#', 'order': 4},
            ]
            
            for link_data in info_links:
                HomepageFooterLink.objects.get_or_create(
                    section=info_section,
                    link_text=link_data['link_text'],
                    defaults={
                        **link_data,
                        'is_active': True,
                    }
                )
            self.stdout.write(self.style.SUCCESS(f'  ✓ Added info footer links'))
        
        # 13. Create Social Links
        social_platforms = [
            {'platform': 'facebook', 'url': 'https://facebook.com/cozycorner', 'icon_class': 'fab fa-facebook-f', 'order': 0},
            {'platform': 'instagram', 'url': 'https://instagram.com/cozycorner', 'icon_class': 'fab fa-instagram', 'order': 1},
            {'platform': 'twitter', 'url': 'https://twitter.com/cozycorner', 'icon_class': 'fab fa-twitter', 'order': 2},
            {'platform': 'pinterest', 'url': 'https://pinterest.com/cozycorner', 'icon_class': 'fab fa-pinterest-p', 'order': 3},
        ]
        
        for social_data in social_platforms:
            HomepageSocialLink.objects.get_or_create(
                platform=social_data['platform'],
                defaults={
                    **social_data,
                    'is_active': True,
                }
            )
        
        self.stdout.write(self.style.SUCCESS(f'✓ Created social media links'))
        
        # 14. Create SEO
        seo, created = HomepageSEO.objects.get_or_create(
            pk=1,
            defaults={
                'page_title': 'CozyCorner - Premium Furniture & Home Decor',
                'meta_description': 'Discover our curated collection of premium furniture and home decor for every room in your home. Quality, sustainability, and style combined.',
                'meta_keywords': 'furniture, home decor, premium, quality, sustainable, modern',
                'og_title': 'CozyCorner - Premium Furniture & Home Decor',
                'og_description': 'Transform your space with our handcrafted furniture and sustainable home decor solutions',
                'canonical_url': 'https://example.com/website/',
                'updated_by': admin_user,
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS('✓ Created SEO configuration'))
        
        self.stdout.write(self.style.SUCCESS('\n✅ Homepage content population completed!'))
        self.stdout.write(self.style.SUCCESS('Visit http://localhost:8000/admin/ to manage content'))
        self.stdout.write(self.style.SUCCESS('Homepage: http://localhost:8000/website/'))
