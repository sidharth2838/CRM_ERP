import React, { useState } from 'react';
import axios from '../api/axiosConfig';

const APIDebugPage = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message, type = 'info') => {
    setTestResults(prev => [...prev, { message, type, timestamp: new Date().toLocaleTimeString() }]);
  };

  const testAPI = async () => {
    setTestResults([]);
    setLoading(true);

    try {
      // Test 1: Add a test story
      addLog('🧪 Test 1: Creating a test story...', 'info');
      const storyResponse = await axios.post('/website/stories/', {
        title: 'Test Story ' + new Date().getTime(),
        excerpt: 'This is a test story',
        author: 'Tester',
        image_url: '',
      });
      addLog('✅ Story created successfully! ID: ' + storyResponse.data?.id, 'success');

      // Test 2: Fetch all stories
      addLog('🧪 Test 2: Fetching all stories...', 'info');
      const storiesResponse = await axios.get('/website/stories/');
      addLog(`✅ Stories fetched! Total: ${storiesResponse.data?.length || 0}`, 'success');
      if (storiesResponse.data && storiesResponse.data.length > 0) {
        addLog('Latest story: ' + JSON.stringify(storiesResponse.data[0]), 'info');
      }

      // Test 3: Add a test testimonial
      addLog('🧪 Test 3: Creating a test testimonial...', 'info');
      const testimonialResponse = await axios.post('/website/testimonials/', {
        name: 'Test User',
        role: 'Tester',
        comment: 'This is a test testimonial',
        rating: 5,
        image_url: '',
      });
      addLog('✅ Testimonial created! ID: ' + testimonialResponse.data?.id, 'success');

      // Test 4: Bulk save test
      addLog('🧪 Test 4: Testing bulk save endpoint...', 'info');
      const bulkResponse = await axios.post('/website/save-all/', {
        features: [],
        stories: [],
        testimonials: [],
        gallery: [],
        faqs: [],
        partners: [],
        newsletter: { title: 'Test Newsletter', description: '', placeholder: 'test@test.com' },
        siteInfo: { heading: 'Test', subheading: 'Test', description: '', hero_image: '' },
        heroSection: { title: 'Test Hero', subtitle: 'Test Subtitle', image: '', cta_text: 'Test' },
      });
      addLog('✅ Bulk save successful!', 'success');

      addLog('🎉 All tests passed! API is working correctly.', 'success');
    } catch (error) {
      addLog(`❌ Error: ${error.message}`, 'error');
      if (error.response) {
        addLog(`Status: ${error.response.status}`, 'error');
        addLog(`Response: ${JSON.stringify(error.response.data)}`, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">API Debug Tool</h1>

        <button
          onClick={testAPI}
          disabled={loading}
          className="mb-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Run API Tests'}
        </button>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Test Results:</h2>
          
          {testResults.length === 0 && (
            <p className="text-gray-400">Click "Run API Tests" to see results...</p>
          )}

          <div className="space-y-2">
            {testResults.map((result, idx) => (
              <div
                key={idx}
                className={`p-3 rounded font-mono text-sm ${
                  result.type === 'success'
                    ? 'bg-green-900 text-green-100'
                    : result.type === 'error'
                    ? 'bg-red-900 text-red-100'
                    : 'bg-blue-900 text-blue-100'
                }`}
              >
                <span className="text-gray-400">[{result.timestamp}]</span> {result.message}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">What to Check:</h2>
          <ul className="text-gray-300 space-y-2">
            <li>✓ Make sure Django server is running on port 8000</li>
            <li>✓ Check browser console (F12) for any errors</li>
            <li>✓ Verify database connection is working</li>
            <li>✓ If tests pass, but website doesn't update, the LandingPage might have an issue</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default APIDebugPage;
