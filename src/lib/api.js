import axios from 'axios';

const api = axios.create({
  // Use absolute URL for the API
  baseURL: 'https://abdelilah-portfolio.wuaze.com/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Helper for assets: First check local public folder, then fallback to backend
export const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  
  // Clean the path
  const cleanPath = path.replace(/^\/storage/, '').replace(/^\//, '');
  
  // Try to load from the backend directly in HTTPS
  return `https://abdelilah-portfolio.wuaze.com/public/storage/${cleanPath}`;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers['X-ADMIN-KEY'] = token;
  }
  
  if (config.url && config.url.startsWith('/admin')) {
    config.url = config.url.replace('/admin', '/be3dol');
  }

  if (config.url === '/login') {
    config.url = '/be3dol/login';
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.status === 'success' && 'data' in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('admin_token');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/be3dol/admin';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
