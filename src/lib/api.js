import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

/**
 * Build the public URL for a storage asset.
 * Handles: Cloudinary URLs, local /storage/ paths, and relative paths.
 */
export const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;

  // Extract base URL from VITE_API_URL by removing /api
  const apiUrl = import.meta.env.VITE_API_URL || '';
  const baseUrl = apiUrl.replace(/\/api$/, '');

  const cleanPath = path.replace(/^\//, '');
  // If it's already a full storage path, strip it to avoid /storage/storage/
  const finalPath = cleanPath.startsWith('storage/') ? cleanPath.replace('storage/', '') : cleanPath;
  
  return `${baseUrl}/storage/${finalPath}`;
};

// ─── Request interceptor: attach admin key + rewrite admin routes ───
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers['X-ADMIN-KEY'] = token;
  }

  // Rewrite /admin/* → /be3dol/*
  if (config.url && config.url.startsWith('/admin')) {
    config.url = config.url.replace('/admin', '/be3dol');
  }

  if (config.url === '/login') {
    config.url = '/be3dol/login';
  }

  return config;
});

// ─── Response interceptor: unwrap { status, data } envelope ─────────
api.interceptors.response.use(
  (response) => {
    // Unwrap Laravel's { status: 'success', data: ... } envelope
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
