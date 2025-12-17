# Generated migration for CMS models

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('erp_api', '0002_customer_customer_type'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='CMSContent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slug', models.SlugField(max_length=255, unique=True)),
                ('title', models.CharField(max_length=255)),
                ('content_type', models.CharField(choices=[('banner', 'Banner'), ('section', 'Section'), ('page', 'Page'), ('testimonial', 'Testimonial'), ('feature', 'Feature'), ('announcement', 'Announcement')], default='section', max_length=50)),
                ('description', models.TextField()),
                ('image', models.ImageField(blank=True, null=True, upload_to='cms_content/')),
                ('order', models.IntegerField(default=0)),
                ('is_active', models.BooleanField(default=True)),
                ('is_featured', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('published_at', models.DateTimeField(blank=True, null=True)),
                ('author', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='cms_content', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'cms_content',
                'ordering': ['order', '-created_at'],
            },
        ),
        migrations.CreateModel(
            name='CMSPage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slug', models.SlugField(max_length=255, unique=True)),
                ('title', models.CharField(max_length=255)),
                ('template_type', models.CharField(choices=[('home', 'Homepage'), ('about', 'About Us'), ('services', 'Services'), ('products', 'Products'), ('contact', 'Contact'), ('custom', 'Custom')], default='custom', max_length=50)),
                ('page_title', models.CharField(blank=True, max_length=255)),
                ('page_description', models.TextField(blank=True)),
                ('meta_keywords', models.CharField(blank=True, max_length=255)),
                ('hero_image', models.ImageField(blank=True, null=True, upload_to='cms_pages/')),
                ('is_published', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('published_at', models.DateTimeField(blank=True, null=True)),
                ('author', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='cms_pages', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'cms_pages',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='CMSPageSection',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.IntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('content', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='erp_api.cmscontent')),
                ('page', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sections', to='erp_api.cmspage')),
            ],
            options={
                'db_table': 'cms_page_sections',
                'ordering': ['order'],
            },
        ),
    ]
