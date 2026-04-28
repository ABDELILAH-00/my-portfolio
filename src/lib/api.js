import axios from 'axios';

const api = axios.create({
  // FORCED RELATIVE PATH: This forces the Netlify Proxy to handle the connection and bypass CORS
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  
  // Strip leading /storage if already present to avoid /storage/storage duplication
  const cleanPath = path.replace(/^\/storage/, '');
  
  // Use relative /storage path. Netlify proxy will handle the redirection to the backend.
  const baseUrl = '/storage';
  
  return `${baseUrl}${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
};

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers['X-ADMIN-KEY'] = token;

    // Advanced Payload Signing (Anti-Replay)
    if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
      try {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        config.headers['X-TIMESTAMP'] = timestamp;

        // Reconstruct payload string identically to backend expectation
        const payloadStr = config.data ? JSON.stringify(config.data) : '';
        const message = timestamp + payloadStr;

        // Native Web Crypto API HMAC Generation
        const encoder = new TextEncoder();
        const keyData = encoder.encode(token);
        const cryptoKey = await crypto.subtle.importKey(
          'raw',
          keyData,
          { name: 'HMAC', hash: 'SHA-256' },
          false,
          ['sign']
        );
        
        const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(message));
        const signatureArray = Array.from(new Uint8Array(signatureBuffer));
        const signatureHex = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        config.headers['X-SIGNATURE'] = signatureHex;
      } catch (err) {
        console.error('Cryptographic signature failed:', err);
      }
    }
  }
  
  if (config.url && config.url.startsWith('/admin')) {
    config.url = config.url.replace('/admin', '/be3dol');
  }

  if (config.url === '/login') {
    config.url = '/be3dol/login';
  }

  return config;
});

// Response interceptor to catch token expirations seamlessly
api.interceptors.response.use(
  (response) => {
    // Seamlessly unwrap the new standardized backend responses dynamically
    // so frontend component logic (.map, etc) doesn't break.
    if (response.data && response.data.status === 'success' && 'data' in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    // If Sanctum rejects our token (e.g. 24h expiration)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('admin_token');
      // Only redirect if we are inside the admin panel
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/be3dol/admin';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
