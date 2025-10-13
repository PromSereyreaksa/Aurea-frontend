import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with optimized configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 15000, // Increased timeout for better UX
  headers: {
    'Content-Type': 'application/json',
  },
  // Add retry configuration
  retry: 3,
  retryDelay: 1000,
});

// Request interceptor to add auth token and handle loading
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('aurea_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request timestamp for performance monitoring
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with enhanced error handling and retry logic
api.interceptors.response.use(
  (response) => {
    // Log performance metrics in development
    if (import.meta.env.DEV && response.config.metadata) {
      const endTime = new Date();
      const duration = endTime.getTime() - response.config.metadata.startTime.getTime();
      console.log(`API ${response.config.method?.toUpperCase()} ${response.config.url}: ${duration}ms`);
    }
    
    return response;
  },
  async (error) => {
    const config = error.config;
    
    // Retry logic for network errors
    if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED') {
      if (config && !config.__isRetryRequest && config.retry > 0) {
        config.__isRetryRequest = true;
        config.retry--;
        
        // Exponential backoff
        const delay = config.retryDelay * Math.pow(2, 3 - config.retry);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return api(config);
      }
    }
    
    const message = error.response?.data?.message || 'An error occurred';
    const status = error.response?.status;
    
    // Handle different error types with specific actions
    switch (status) {
      case 401:
        // Clear localStorage immediately
        localStorage.removeItem('aurea_token');
        localStorage.removeItem('aurea_user');
        
        // Force reload to reset app state and avoid redirect loops
        if (!window.location.pathname.includes('/login')) {
          toast.error('Session expired. Please login again.');
          window.location.href = '/login';
        }
        break;
        break;
        
      case 403:
        toast.error('Access denied');
        break;
        
      case 404:
        // Removed toast to prevent false warnings during case study editing
        break;
        
      case 429:
        toast.error('Too many requests. Please wait a moment.');
        break;
        
      case 500:
      case 502:
      case 503:
      case 504:
        toast.error('Server error. Please try again later.');
        break;
        
      default:
        if (status >= 400) {
          toast.error(message);
        }
    }
    
    return Promise.reject(error);
  }
);

// Helper function for handling API requests with consistent error handling
export const apiRequest = async (requestFn, errorMessage = 'Request failed') => {
  try {
    return await requestFn();
  } catch (error) {
    console.error(errorMessage, error);
    throw error;
  }
};

// Helper function for optimistic updates
export const optimisticUpdate = (updateFn, rollbackFn) => {
  return async (apiCall) => {
    // Apply optimistic update
    updateFn();
    
    try {
      // Execute API call
      const result = await apiCall();
      return result;
    } catch (error) {
      // Rollback on error
      rollbackFn();
      throw error;
    }
  };
};

export default api;