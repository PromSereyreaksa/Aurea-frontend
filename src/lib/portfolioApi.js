import api, { apiRequest, optimisticUpdate } from './baseApi';

// Portfolio API functions with caching and optimization
export const portfolioApi = {
  // Create portfolio with validation
  create: async (portfolioData) => {
    return apiRequest(
      async () => {
        const response = await api.post('/api/portfolios', portfolioData);
        return response.data;
      },
      'Failed to create portfolio'
    );
  },

  // Get user portfolios with caching
  getUserPortfolios: async () => {
    return apiRequest(
      async () => {
        const cacheKey = 'aurea_user_portfolios';
        const cacheTime = 2 * 60 * 1000; // 2 minutes cache
        
        // Check cache first
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < cacheTime) {
            return data;
          }
        }
        
        const response = await api.get('/api/portfolios/me');
        
        // Cache the result
        localStorage.setItem(cacheKey, JSON.stringify({
          data: response.data,
          timestamp: Date.now()
        }));
        
        return response.data;
      },
      'Failed to fetch portfolios'
    );
  },

  // Get portfolio by ID with caching
  getById: async (id) => {
    return apiRequest(
      async () => {
        const cacheKey = `aurea_portfolio_${id}`;
        const cacheTime = 5 * 60 * 1000; // 5 minutes cache
        
        // Check cache first
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < cacheTime) {
            return data;
          }
        }
        
        const response = await api.get(`/api/portfolios/${id}`);
        
        // Cache the result
        localStorage.setItem(cacheKey, JSON.stringify({
          data: response.data,
          timestamp: Date.now()
        }));
        
        return response.data;
      },
      'Failed to fetch portfolio'
    );
  },

  // Get portfolio by slug with caching
  getBySlug: async (slug) => {
    return apiRequest(
      async () => {
        const cacheKey = `aurea_portfolio_slug_${slug}`;
        const cacheTime = 5 * 60 * 1000; // 5 minutes cache
        
        // Check cache first
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < cacheTime) {
            return data;
          }
        }
        
        const response = await api.get(`/api/portfolios/slug/${slug}`);
        
        // Cache the result
        localStorage.setItem(cacheKey, JSON.stringify({
          data: response.data,
          timestamp: Date.now()
        }));
        
        return response.data;
      },
      'Failed to fetch portfolio'
    );
  },

  // Update portfolio with optimistic updates
  update: async (id, updates) => {
    return apiRequest(
      async () => {
        const response = await api.put(`/api/portfolios/${id}`, updates);
        
        // Invalidate related caches
        localStorage.removeItem(`aurea_portfolio_${id}`);
        localStorage.removeItem('aurea_user_portfolios');
        
        return response.data;
      },
      'Failed to update portfolio'
    );
  },

  // Update portfolio with debounced saves for better UX
  updateDebounced: (() => {
    const timeouts = new Map();
    
    return async (id, updates, delay = 1000) => {
      // Clear existing timeout for this portfolio
      if (timeouts.has(id)) {
        clearTimeout(timeouts.get(id));
      }
      
      // Set new timeout
      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(async () => {
          try {
            const result = await portfolioApi.update(id, updates);
            timeouts.delete(id);
            resolve(result);
          } catch (error) {
            timeouts.delete(id);
            reject(error);
          }
        }, delay);
        
        timeouts.set(id, timeoutId);
      });
    };
  })(),

  // Delete portfolio
  delete: async (id) => {
    return apiRequest(
      async () => {
        await api.delete(`/api/portfolios/${id}`);
        
        // Clear related caches
        localStorage.removeItem(`aurea_portfolio_${id}`);
        localStorage.removeItem('aurea_user_portfolios');
        
        return true;
      },
      'Failed to delete portfolio'
    );
  },

  // Publish portfolio
  publish: async (id) => {
    return apiRequest(
      async () => {
        const response = await api.put(`/api/portfolios/${id}`, { published: true });
        
        // Update cache
        const cacheKey = `aurea_portfolio_${id}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { data } = JSON.parse(cached);
          localStorage.setItem(cacheKey, JSON.stringify({
            data: { ...data, published: true },
            timestamp: Date.now()
          }));
        }
        
        return response.data;
      },
      'Failed to publish portfolio'
    );
  },

  // Unpublish portfolio
  unpublish: async (id) => {
    return apiRequest(
      async () => {
        const response = await api.put(`/api/portfolios/${id}`, { published: false });
        
        // Update cache
        const cacheKey = `aurea_portfolio_${id}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { data } = JSON.parse(cached);
          localStorage.setItem(cacheKey, JSON.stringify({
            data: { ...data, published: false },
            timestamp: Date.now()
          }));
        }
        
        return response.data;
      },
      'Failed to unpublish portfolio'
    );
  },

  // Clear all portfolio caches
  clearCache: () => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('aurea_portfolio') || key === 'aurea_user_portfolios') {
        localStorage.removeItem(key);
      }
    });
  }
};

export default portfolioApi;