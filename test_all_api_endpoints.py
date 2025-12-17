#!/usr/bin/env python
"""
Comprehensive API endpoint testing script
Tests all GET, POST endpoints for the FC/CRM backend
"""
import requests
import json
from datetime import datetime

BASE_URL = 'http://127.0.0.1:8000/api/'

# All API endpoints to test
ENDPOINTS = {
    'GET': [
        'siteinfo/',
        'homepagefeatures/',
        'homepagetestimonials/',
        'homepagenavigation/',
        'homepagefootersection/',
        'homepagesociallink/',
        'homepageseo/',
        'userprofile/',
        'products/',
        'orders/',
        'invoices/',
        'payments/',
        'customers/',
        'categories/',
    ],
    'POST': [
        'siteinfo/',
        'homepagefeatures/',
        'homepagetestimonials/',
        'homepagenavigation/',
        'homepagefootersection/',
        'homepagesociallink/',
        'homepageseo/',
    ]
}

def test_endpoint(method, endpoint):
    """Test a single endpoint"""
    url = BASE_URL + endpoint
    try:
        if method == 'GET':
            response = requests.get(url, timeout=5)
        elif method == 'POST':
            response = requests.post(url, json={}, timeout=5)
        else:
            return None
        
        return {
            'status': response.status_code,
            'ok': response.ok,
            'content_type': response.headers.get('content-type', 'N/A'),
            'response_preview': str(response.json() if response.ok else response.text)[:200]
        }
    except requests.exceptions.ConnectionError as e:
        return {'error': f'Connection Error: {str(e)[:100]}'}
    except requests.exceptions.Timeout:
        return {'error': 'Timeout Error'}
    except Exception as e:
        return {'error': f'Error: {str(e)[:100]}'}

def main():
    print("=" * 80)
    print(f"API ENDPOINT TEST REPORT - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 80)
    print(f"Base URL: {BASE_URL}\n")
    
    results = {
        'GET': {},
        'POST': {}
    }
    
    # Test GET endpoints
    print("\n" + "=" * 80)
    print("GET ENDPOINTS")
    print("=" * 80)
    for endpoint in ENDPOINTS['GET']:
        result = test_endpoint('GET', endpoint)
        results['GET'][endpoint] = result
        status = '[OK]' if result and result.get('ok') else '[FAIL]'
        status_code = result.get('status', 'N/A') if result else 'N/A'
        print(f"{status} | {endpoint:40} | Status: {status_code}")
        if result and 'error' in result:
            print(f"   └─ {result['error']}")
        if result and result.get('ok'):
            print(f"   └─ {result.get('response_preview', 'No preview')}")
    
    # Test POST endpoints
    print("\n" + "=" * 80)
    print("POST ENDPOINTS")
    print("=" * 80)
    for endpoint in ENDPOINTS['POST']:
        result = test_endpoint('POST', endpoint)
        results['POST'][endpoint] = result
        status = '[OK]' if result and result.get('ok') else '[FAIL]'
        status_code = result.get('status', 'N/A') if result else 'N/A'
        print(f"{status} | {endpoint:40} | Status: {status_code}")
        if result and 'error' in result:
            print(f"   └─ {result['error']}")
        if result and result.get('ok'):
            print(f"   └─ {result.get('response_preview', 'No preview')}")
    
    # Summary
    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    
    get_ok = sum(1 for r in results['GET'].values() if r and r.get('ok'))
    get_total = len(results['GET'])
    post_ok = sum(1 for r in results['POST'].values() if r and r.get('ok'))
    post_total = len(results['POST'])
    
    print(f"GET Endpoints:  {get_ok}/{get_total} working")
    print(f"POST Endpoints: {post_ok}/{post_total} working")
    print(f"Total:          {get_ok + post_ok}/{get_total + post_total} working")
    
    # Detailed JSON output
    print("\n" + "=" * 80)
    print("DETAILED RESULTS (JSON)")
    print("=" * 80)
    print(json.dumps(results, indent=2))

if __name__ == '__main__':
    main()
