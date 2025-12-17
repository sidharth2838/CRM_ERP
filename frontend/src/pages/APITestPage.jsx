import React, { useState } from 'react';
import axios from '../api/axiosConfig';

const APITestPage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testGetStories = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      console.log('Testing GET /api/website/stories/');
      const response = await axios.get('/api/website/stories/');
      console.log('Response:', response);
      setResult({
        status: response.status,
        data: response.data,
        url: response.config.url,
      });
    } catch (err) {
      console.error('Error:', err);
      setError({
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        url: err.config?.url,
      });
    }
    setLoading(false);
  };

  const testBulkSave = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = {
        stories: [],
        testimonials: [],
        gallery: [],
        faqs: [],
        partners: [],
        heroSection: {},
        newsletter: {},
      };
      console.log('Testing POST /api/website/save-all/', data);
      const response = await axios.post('/api/website/save-all/', data);
      console.log('Response:', response);
      setResult({
        status: response.status,
        data: response.data,
        url: response.config.url,
      });
    } catch (err) {
      console.error('Error:', err);
      setError({
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        url: err.config?.url,
      });
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>API Connection Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Server Status</h2>
        <p>Django API URL: http://localhost:8000</p>
        <p>Frontend URL: http://localhost:3000</p>
        <p>Proxy Target: http://localhost:8000/api</p>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button 
          onClick={testGetStories}
          disabled={loading}
          style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white' }}
        >
          {loading ? 'Testing...' : 'Test GET /api/website/stories/'}
        </button>
        <button 
          onClick={testBulkSave}
          disabled={loading}
          style={{ padding: '10px 20px', backgroundColor: '#2196F3', color: 'white' }}
        >
          {loading ? 'Testing...' : 'Test POST /api/website/save-all/'}
        </button>
      </div>

      {result && (
        <div style={{ backgroundColor: '#e8f5e9', padding: '10px', marginBottom: '20px', border: '1px solid #4CAF50' }}>
          <h3 style={{ color: '#4CAF50' }}>✅ Success</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: '#ffebee', padding: '10px', marginBottom: '20px', border: '1px solid #f44336' }}>
          <h3 style={{ color: '#f44336' }}>❌ Error</h3>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
        <h3>Debug Info</h3>
        <p>Check browser console (F12) for detailed [AXIOS] logs</p>
        <p>API Base URL: {process.env.REACT_APP_API_URL || 'http://localhost:8000'}</p>
      </div>
    </div>
  );
};

export default APITestPage;
