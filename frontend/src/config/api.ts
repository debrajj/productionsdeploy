// API Configuration
const isDevelopment = import.meta.env.DEV;

if (!isDevelopment && !import.meta.env.VITE_API_ENDPOINT) {
  throw new Error('VITE_API_ENDPOINT is required in production');
}

if (!isDevelopment && !import.meta.env.VITE_SERVER_BASE) {
  throw new Error('VITE_SERVER_BASE is required in production');
}

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_ENDPOINT,
  IMAGE_BASE_URL: import.meta.env.VITE_SERVER_BASE,
};

export const getApiUrl = (endpoint: string) => `${API_CONFIG.BASE_URL}${endpoint}`;
export const getImageUrl = (path: string) => path.startsWith('/') ? `${API_CONFIG.IMAGE_BASE_URL}${path}` : path;