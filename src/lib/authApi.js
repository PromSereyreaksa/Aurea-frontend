import api, { apiRequest } from './baseApi';

// Auth API functions with enhanced error handling and optimizations
export const authApi = {
  // Login with improved error handling
  login: async (credentials) => {
    return apiRequest(
      async () => {
        const response = await api.post('/api/auth/login', credentials);
        
        console.log('authApi.login - raw response:', response.data); // Debug log
        
        // Store auth data securely - check the actual response structure
        const responseData = response.data;
        if (responseData.data && responseData.data.token && responseData.data.user) {
          console.log('Storing token and user in localStorage'); // Debug log
          localStorage.setItem('aurea_token', responseData.data.token);
          localStorage.setItem('aurea_user', JSON.stringify(responseData.data.user));
        } else if (responseData.token && responseData.user) {
          // Fallback for different response structure
          console.log('Storing token and user in localStorage (fallback)'); // Debug log
          localStorage.setItem('aurea_token', responseData.token);
          localStorage.setItem('aurea_user', JSON.stringify(responseData.user));
        } else {
          console.warn('Token or user not found in response', responseData);
        }
        
        return response.data;
      },
      'Login failed'
    );
  },

  // Signup with validation
  signup: async (userData) => {
    return apiRequest(
      async () => {
        const response = await api.post('/api/auth/signup', userData);
        
        // Auto-login after successful signup
        if (response.data.token && response.data.user) {
          localStorage.setItem('aurea_token', response.data.token);
          localStorage.setItem('aurea_user', JSON.stringify(response.data.user));
        }
        
        return response.data;
      },
      'Signup failed'
    );
  },

  // Get current user with caching
  getCurrentUser: async () => {
    return apiRequest(
      async () => {
        // Check cache first
        const cachedUser = localStorage.getItem('aurea_user');
        const token = localStorage.getItem('aurea_token');
        
        if (!token) {
          throw new Error('No auth token found');
        }
        
        // If we have cached user data and it's recent, use it
        const cachedData = cachedUser ? JSON.parse(cachedUser) : null;
        if (cachedData && cachedData.lastUpdated && 
            Date.now() - cachedData.lastUpdated < 5 * 60 * 1000) { // 5 minutes cache
          return cachedData;
        }
        
        // Fetch fresh user data
        const response = await api.get('/api/auth/me');
        const userData = {
          ...response.data,
          lastUpdated: Date.now()
        };
        
        localStorage.setItem('aurea_user', JSON.stringify(userData));
        return userData;
      },
      'Failed to get user data'
    );
  },

  // Update user profile
  updateProfile: async (userData) => {
    return apiRequest(
      async () => {
        const response = await api.put('/api/auth/me', userData);
        
        // Update cached user data
        if (response.data) {
          const updatedUser = {
            ...response.data,
            lastUpdated: Date.now()
          };
          localStorage.setItem('aurea_user', JSON.stringify(updatedUser));
        }
        
        return response.data;
      },
      'Failed to update profile'
    );
  },

  // Logout with cleanup
  logout: async () => {
    try {
      // Clear local storage
      localStorage.removeItem('aurea_token');
      localStorage.removeItem('aurea_user');
      
      // Optional: Call logout endpoint to invalidate token on server
      // await api.post('/api/auth/logout');
      
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage even if server call fails
      localStorage.removeItem('aurea_token');
      localStorage.removeItem('aurea_user');
      return true;
    }
  },

  // Check if user is authenticated and token is not expired
  isAuthenticated: () => {
    const token = localStorage.getItem('aurea_token');
    const user = localStorage.getItem('aurea_user');
    
    console.log('isAuthenticated check - token:', !!token, 'user:', !!user); // Debug log
    
    if (!token || !user) {
      console.log('No token or user found'); // Debug log
      return false;
    }
    
    // Check if token is expired (basic JWT parsing)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      console.log('Token payload:', payload, 'current time:', currentTime); // Debug log
      
      if (payload.exp && payload.exp < currentTime) {
        // Token is expired, clear storage
        console.log('Token is expired'); // Debug log
        localStorage.removeItem('aurea_token');
        localStorage.removeItem('aurea_user');
        return false;
      }
    } catch (error) {
      // If we can't parse the token, consider it invalid
      console.warn('Invalid token format:', error);
      localStorage.removeItem('aurea_token');
      localStorage.removeItem('aurea_user');
      return false;
    }
    
    console.log('Token is valid and not expired'); // Debug log
    return true;
  },

  // Get stored user data without API call
  getStoredUser: () => {
    try {
      const userData = localStorage.getItem('aurea_user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  }
};

export default authApi;