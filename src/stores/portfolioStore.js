import { create } from 'zustand';
import { portfolioApi } from '../lib/portfolioApi';
import api from '../lib/baseApi';
import toast from 'react-hot-toast';

const usePortfolioStore = create((set, get) => ({
  // State
  portfolios: [],
  currentPortfolio: null,
  portfolioStats: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  lastFetchTime: null, // Track when portfolios were last fetched

  // Actions
  createPortfolio: async (portfolioData) => {
    try {
      console.log('📤 Creating portfolio with data:', portfolioData);
      set({ isCreating: true });
      
      const response = await portfolioApi.create(portfolioData);
      console.log('📥 Portfolio API response:', response);
      
      // Handle different response structures
      const newPortfolio = response.data?.portfolio || response.portfolio || response;
      console.log('✅ Extracted portfolio:', newPortfolio);
      
      if (!newPortfolio || !newPortfolio._id) {
        throw new Error('Invalid portfolio response - no ID returned');
      }
      
      set((state) => ({
        portfolios: [newPortfolio, ...state.portfolios],
        currentPortfolio: newPortfolio,
        isCreating: false,
      }));

      // Don't show toast here - let the calling component handle it
      // to prevent duplicate toasts (hook also shows toast)
      return { success: true, portfolio: newPortfolio };
      
    } catch (error) {
      console.error('❌ Portfolio creation error:', error);
      console.error('Error details:', error.response?.data || error.message);
      set({ isCreating: false });
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to create portfolio' 
      };
    }
  },

  fetchUserPortfolios: async (published = null, forceRefresh = false) => {
    try {
      const state = get();
      const now = Date.now();
      const CACHE_DURATION = 30000; // 30 seconds cache

      // Skip fetch if data is fresh and not forcing refresh
      if (!forceRefresh &&
          state.portfolios.length > 0 &&
          state.lastFetchTime &&
          (now - state.lastFetchTime) < CACHE_DURATION) {
        console.log('Using cached portfolios data');
        return { success: true, portfolios: state.portfolios, cached: true };
      }

      set({ isLoading: true });

      // Build query parameters
      const params = new URLSearchParams();
      if (published !== null) {
        params.append('published', published);
      }

      const url = `/api/portfolios/user/me${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get(url);

      // Handle response - check for different structures
      const portfolios = response.data?.data || response.data?.data?.portfolios || [];
      const meta = response.data?.meta || {};

      set({
        portfolios,
        isLoading: false,
        lastFetchTime: now,
      });

      return { success: true, portfolios, meta };

    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch portfolios'
      };
    }
  },

  fetchPortfolioStats: async () => {
    try {
      const response = await api.get('/api/portfolios/stats');
      
      const stats = response.data?.data || response.data;
      
      set({
        portfolioStats: stats,
      });

      return { success: true, stats };
      
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch portfolio statistics' 
      };
    }
  },

  fetchPortfolioById: async (id) => {
    // Guard against undefined or invalid ID
    if (!id || id === 'undefined') {
      console.warn('Invalid portfolio ID:', id, '- skipping fetch');
      set({ isLoading: false });
      return {
        success: false,
        error: 'Invalid portfolio ID provided'
      };
    }

    try {
      set({ isLoading: true });

      const response = await api.get(`/api/portfolios/${id}`);
      const portfolio = response.data.data.portfolio;
      
      set({
        currentPortfolio: portfolio,
        isLoading: false,
      });

      return { success: true, portfolio };
      
    } catch (error) {
      set({ isLoading: false });
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch portfolio' 
      };
    }
  },

  fetchPortfolioBySlug: async (slug) => {
    try {
      set({ isLoading: true });
      
      const response = await api.get(`/api/portfolios/slug/${slug}`);
      const portfolio = response.data.data.portfolio;
      
      set({
        currentPortfolio: portfolio,
        isLoading: false,
      });

      return { success: true, portfolio };
      
    } catch (error) {
      set({ isLoading: false });
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch portfolio' 
      };
    }
  },

  updatePortfolio: async (id, updates) => {
    try {
      console.log('=== PORTFOLIO STORE UPDATE START ===');
      console.log('Updating portfolio ID:', id);
      console.log('Updates being sent:', updates);
      
      set({ isUpdating: true });
      
      const updatedPortfolio = await portfolioApi.update(id, updates);
      
      console.log('=== PORTFOLIO STORE UPDATE RESPONSE ===');
      console.log('Updated portfolio from server:', updatedPortfolio);
      
      set((state) => {
        console.log('=== PORTFOLIO STORE STATE UPDATE ===');
        console.log('Current state currentPortfolio:', state.currentPortfolio);
        console.log('Will update currentPortfolio?', state.currentPortfolio?._id === id);
        
        const newState = {
          portfolios: state.portfolios.map(p => 
            p._id === id ? updatedPortfolio : p
          ),
          // Don't update currentPortfolio to prevent reload in PortfolioBuilderPage
          // currentPortfolio: state.currentPortfolio?._id === id 
          //   ? updatedPortfolio 
          //   : state.currentPortfolio,
          currentPortfolio: state.currentPortfolio,
          isUpdating: false,
        };
        
        console.log('New state currentPortfolio:', newState.currentPortfolio);
        return newState;
      });

      return { success: true, portfolio: updatedPortfolio };
      
    } catch (error) {
      set({ isUpdating: false });
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update portfolio' 
      };
    }
  },

  deletePortfolio: async (id) => {
    try {
      await api.delete(`/api/portfolios/${id}`);
      
      set((state) => ({
        portfolios: state.portfolios.filter(p => p._id !== id),
        currentPortfolio: state.currentPortfolio?._id === id 
          ? null 
          : state.currentPortfolio,
      }));

      toast.success('Portfolio deleted successfully!');
      return { success: true };
      
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to delete portfolio' 
      };
    }
  },

  publishPortfolio: async (id, slug = null) => {
    try {
      const payload = { published: true };
      if (slug) {
        payload.slug = slug;
      }
      
      const response = await api.put(`/api/portfolios/${id}`, payload);
      const updatedPortfolio = response.data.data.portfolio;
      
      set((state) => ({
        portfolios: state.portfolios.map(p => 
          p._id === id ? updatedPortfolio : p
        ),
        currentPortfolio: state.currentPortfolio?._id === id 
          ? updatedPortfolio 
          : state.currentPortfolio,
      }));

      toast.success('Portfolio published successfully!');
      return { success: true, portfolio: updatedPortfolio };
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to publish portfolio');
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to publish portfolio' 
      };
    }
  },

  unpublishPortfolio: async (id) => {
    try {
      const response = await api.put(`/api/portfolios/${id}`, { published: false });
      const updatedPortfolio = response.data.data.portfolio;
      
      set((state) => ({
        portfolios: state.portfolios.map(p => 
          p._id === id ? updatedPortfolio : p
        ),
        currentPortfolio: state.currentPortfolio?._id === id 
          ? updatedPortfolio 
          : state.currentPortfolio,
      }));

      toast.success('Portfolio unpublished successfully!');
      return { success: true, portfolio: updatedPortfolio };
      
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to unpublish portfolio' 
      };
    }
  },

  setCurrentPortfolio: (portfolio) => {
    set({ currentPortfolio: portfolio });
  },

  clearCurrentPortfolio: () => {
    set({ currentPortfolio: null });
  },

  // Optimistic update for better UX
  updatePortfolioOptimistic: (id, updates) => {
    set((state) => ({
      portfolios: state.portfolios.map(p => 
        p._id === id ? { ...p, ...updates } : p
      ),
      currentPortfolio: state.currentPortfolio?._id === id 
        ? { ...state.currentPortfolio, ...updates }
        : state.currentPortfolio,
    }));
  },
}));

export default usePortfolioStore;