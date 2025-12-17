import axios from 'axios';

// Helper function to get CSRF token from cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Create axios instance with baseURL pointing to Vite proxy
// The proxy will forward /api requests to http://localhost:8000
const instance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add CSRF token to all requests
instance.interceptors.request.use(
  (config) => {
    const csrftoken = getCookie('csrftoken');
    if (csrftoken) {
      config.headers['X-CSRFToken'] = csrftoken;
    }
    console.log(`[AXIOS] ${config.method?.toUpperCase()} ${config.url}`);
    console.log(`[AXIOS] Full request to: ${window.location.origin}${config.baseURL}${config.url}`);
    console.log(`[AXIOS] CSRF Token: ${csrftoken ? 'Found' : 'Not found'}`);
    return config;
  },
  (error) => {
    console.error('[AXIOS] Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
instance.interceptors.response.use(
  (response) => {
    console.log(`[AXIOS] Response ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('[AXIOS] Response error:', error);
    if (error.response) {
      console.error(`[AXIOS] Status: ${error.response.status}`);
      console.error(`[AXIOS] Data:`, error.response.data);
    } else if (error.request) {
      console.error('[AXIOS] No response received:', error.request);
    }
    return Promise.reject(error);
  }
);

export default instance;
