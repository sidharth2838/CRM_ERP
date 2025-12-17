import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('crm_jwt');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  // CSRF token for Django if needed
  const csrf = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
  if (csrf) {
    config.headers['X-CSRFToken'] = csrf;
  }
  return config;
});

export const customerService = {
  getAll: (params) => apiClient.get('customers/', { params }),
  getById: (id) => apiClient.get(`customers/${id}/`),
  create: (data) => apiClient.post('customers/', data),
  update: (id, data) => apiClient.put(`customers/${id}/`, data),
  delete: (id) => apiClient.delete(`customers/${id}/`),
};

export const companyService = {
  getAll: (params) => apiClient.get('companies/', { params }),
  getById: (id) => apiClient.get(`companies/${id}/`),
  create: (data) => apiClient.post('companies/', data),
  update: (id, data) => apiClient.put(`companies/${id}/`, data),
  delete: (id) => apiClient.delete(`companies/${id}/`),
};

export const invoiceService = {
  getAll: (params) => apiClient.get('/invoices/', { params }),
  getById: (id) => apiClient.get(`/invoices/${id}/`),
};
export const paymentService = {
  getAll: (params) => apiClient.get('/payments/', { params }),
  getById: (id) => apiClient.get(`/payments/${id}/`),
};

export const homepageService = {
  getHero: () => apiClient.get('/homepage/hero/'),
  getFeatures: () => apiClient.get('/homepage/features/'),
  getProducts: () => apiClient.get('/products/'),
  getWhyUs: () => apiClient.get('/homepage/why-us/'),
  getDetails: () => apiClient.get('/homepage/details/'),
  getStories: () => apiClient.get('/homepage/stories/'),
  getInstagram: () => apiClient.get('/homepage/instagram/'),
  getTestimonials: () => apiClient.get('/homepage/testimonials/'),
  getNavigation: () => apiClient.get('/homepage/navigation/'),
  getFooter: () => apiClient.get('/homepage/footer/'),
  getSocial: () => apiClient.get('/homepage/social/'),
  getSEO: () => apiClient.get('/homepage/seo/'),
};

export const productService = {
  getAll: (params) => apiClient.get('/products/', { params }),
  getById: (id) => apiClient.get(`/products/${id}/`),
  getByCategory: (category) => apiClient.get(`/products/category/${category}/`),
};

export const orderService = {
  create: (data) => apiClient.post('/orders/', data),
  getById: (id) => apiClient.get(`/orders/${id}/`),
};

export default apiClient;
