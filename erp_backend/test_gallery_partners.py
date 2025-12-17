#!/usr/bin/env python
"""Test Gallery and Partners API endpoints using curl"""
import subprocess
import json
import sys

print("\n" + "="*60)
print("TESTING GALLERY AND PARTNERS API ENDPOINTS")
print("="*60)

BASE_URL = "http://localhost:8000"

# Test 1: GET Gallery items
print("\n[TEST 1] GET /api/website/gallery/")
try:
    result = subprocess.run(
        ['curl', '-s', f'{BASE_URL}/api/website/gallery/'],
        capture_output=True,
        text=True,
        encoding='utf-8', errors='ignore'
    )
    if result.returncode == 0:
        try:
            data = json.loads(result.stdout)
            if isinstance(data, list):
                print("[PASS] Status: 200 OK")
                print(f"[PASS] Gallery items count: {len(data)}")
                if data:
                    item = data[0]
                    print(f"       Sample: ID={item.get('id')}, Title={item.get('title')}")
                    print(f"       Has image_url: {bool(item.get('image_url'))}")
                    print(f"       Has image: {bool(item.get('image'))}")
            else:
                print(f"[FAIL] Error: {result.stdout[:200]}")
        except json.JSONDecodeError:
            print(f"[FAIL] Invalid JSON: {result.stdout[:200]}")
    else:
        print(f"[FAIL] Connection failed: {result.stderr}")
except Exception as e:
    print(f"[FAIL] Exception: {e}")

# Test 2: GET Partners
print("\n[TEST 2] GET /api/website/partners/")
try:
    result = subprocess.run(
        ['curl', '-s', f'{BASE_URL}/api/website/partners/'],
        capture_output=True,
        text=True,
        encoding='utf-8', errors='ignore'
    )
    if result.returncode == 0:
        try:
            data = json.loads(result.stdout)
            if isinstance(data, list):
                print("[PASS] Status: 200 OK")
                print(f"[PASS] Partners count: {len(data)}")
                if data:
                    item = data[0]
                    print(f"       Sample: ID={item.get('id')}, Name={item.get('name')}")
                    print(f"       Has logo_url: {bool(item.get('logo_url'))}")
                    print(f"       Has logo: {bool(item.get('logo'))}")
            else:
                print(f"[FAIL] Error: {result.stdout[:200]}")
        except json.JSONDecodeError:
            print(f"[FAIL] Invalid JSON: {result.stdout[:200]}")
    else:
        print(f"[FAIL] Connection failed: {result.stderr}")
except Exception as e:
    print(f"[FAIL] Exception: {e}")

# Test 3: POST Gallery with image_url
print("\n[TEST 3] POST /api/website/gallery/ (image_url only)")
try:
    gallery_data = json.dumps({
        "title": "Test Living Room",
        "image_url": "https://via.placeholder.com/400x300",
        "category": "rooms"
    })
    result = subprocess.run(
        ['curl', '-s', '-X', 'POST', f'{BASE_URL}/api/website/gallery/',
         '-H', 'Content-Type: application/json',
         '-d', gallery_data],
        capture_output=True,
        text=True,
        encoding='utf-8', errors='ignore'
    )
    if result.returncode == 0:
        try:
            item = json.loads(result.stdout)
            if 'id' in item:
                print("[PASS] Status: 201 CREATED")
                print(f"[PASS] Gallery item created: ID={item.get('id')}, Title={item.get('title')}")
                print(f"       image_url: {item.get('image_url')}")
                print(f"       image: {item.get('image')}")
            else:
                print(f"[FAIL] Error: {result.stdout[:200]}")
        except json.JSONDecodeError:
            print(f"[FAIL] Invalid JSON: {result.stdout[:200]}")
    else:
        print(f"[FAIL] Connection failed: {result.stderr}")
except Exception as e:
    print(f"[FAIL] Exception: {e}")

# Test 4: POST Partner with logo_url
print("\n[TEST 4] POST /api/website/partners/ (logo_url only)")
try:
    partner_data = json.dumps({
        "name": "Test Brand",
        "logo_url": "https://via.placeholder.com/150x150",
        "link": "https://example.com"
    })
    result = subprocess.run(
        ['curl', '-s', '-X', 'POST', f'{BASE_URL}/api/website/partners/',
         '-H', 'Content-Type: application/json',
         '-d', partner_data],
        capture_output=True,
        text=True,
        encoding='utf-8', errors='ignore'
    )
    if result.returncode == 0:
        try:
            item = json.loads(result.stdout)
            if 'id' in item:
                print("[PASS] Status: 201 CREATED")
                print(f"[PASS] Partner created: ID={item.get('id')}, Name={item.get('name')}")
                print(f"       logo_url: {item.get('logo_url')}")
                print(f"       logo: {item.get('logo')}")
            else:
                print(f"[FAIL] Error: {result.stdout[:200]}")
        except json.JSONDecodeError:
            print(f"[FAIL] Invalid JSON: {result.stdout[:200]}")
    else:
        print(f"[FAIL] Connection failed: {result.stderr}")
except Exception as e:
    print(f"[FAIL] Exception: {e}")

print("\n" + "="*60)
print("MODELS STATUS")
print("="*60)

# Check model field configuration
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'erp_backend.settings')
django.setup()

from erp_api.models import WebsiteGallery, WebsitePartner
from django.db import connection

print("\n[Gallery Model]")
gallery_image_field = WebsiteGallery._meta.get_field('image')
print(f"  image field: null={gallery_image_field.null}, blank={gallery_image_field.blank}")
gallery_url_field = WebsiteGallery._meta.get_field('image_url')
print(f"  image_url field: null={gallery_url_field.null}, blank={gallery_url_field.blank}")

print("\n[Partner Model]")
partner_logo_field = WebsitePartner._meta.get_field('logo')
print(f"  logo field: null={partner_logo_field.null}, blank={partner_logo_field.blank}")
partner_url_field = WebsitePartner._meta.get_field('logo_url')
print(f"  logo_url field: null={partner_url_field.null}, blank={partner_url_field.blank}")

print("\n" + "="*60)
print("TEST COMPLETE")
print("="*60 + "\n")
