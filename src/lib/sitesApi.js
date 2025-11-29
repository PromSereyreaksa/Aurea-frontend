import api, { apiRequest } from './baseApi';

// Sites API functions for public portfolio discovery
export const sitesApi = {
  // Get all published sites with pagination
  getAllPublished: async (options = {}) => {
    const {
      page = 1,
      limit = 12,
      sortBy = 'lastDeployedAt',
      order = 'desc'
    } = options;

    return apiRequest(
      async () => {
        const cacheKey = `aurea_public_sites_${page}_${limit}_${sortBy}_${order}`;
        const cacheTime = 2 * 60 * 1000; // 2 minutes cache

        // Check cache first
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < cacheTime) {
            return data;
          }
        }

        const response = await api.get('/api/sites/public/all', {
          params: { page, limit, sortBy, order }
        });

        // Cache the result
        localStorage.setItem(cacheKey, JSON.stringify({
          data: response.data,
          timestamp: Date.now()
        }));

        return response.data;
      },
      'Failed to fetch published sites'
    );
  },

  // Clear all sites caches
  clearCache: () => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('aurea_public_sites')) {
        localStorage.removeItem(key);
      }
    });
  }
};

export default sitesApi;
