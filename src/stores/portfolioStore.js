import { create } from 'zustand';
import api from '../lib/api';
import toast from 'react-hot-toast';

const usePortfolioStore = create((set, get) => ({
  // State
  portfolios: [],
  currentPortfolio: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,

  // Actions
  createPortfolio: async (portfolioData) => {
    try {
      set({ isCreating: true });
      
      const response = await api.post('/api/portfolios', portfolioData);
      const newPortfolio = response.data.data.portfolio;
      
      set((state) => ({
        portfolios: [newPortfolio, ...state.portfolios],
        currentPortfolio: newPortfolio,
        isCreating: false,
      }));

      toast.success('Portfolio created successfully!');
      return { success: true, portfolio: newPortfolio };
      
    } catch (error) {
      set({ isCreating: false });
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to create portfolio' 
      };
    }
  },

  fetchUserPortfolios: async () => {
    try {
      set({ isLoading: true });
      
      const response = await api.get('/api/portfolios/me');
      const portfolios = response.data.data.portfolios;
      
      set({
        portfolios,
        isLoading: false,
      });

      return { success: true };
      
    } catch (error) {
      set({ isLoading: false });
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch portfolios' 
      };
    }
  },

  fetchPortfolioById: async (id) => {
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
      
      const response = await api.put(`/api/portfolios/${id}`, updates);
      const updatedPortfolio = response.data.data.portfolio;
      
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

  publishPortfolio: async (id) => {
    try {
      const response = await api.put(`/api/portfolios/${id}`, { published: true });
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