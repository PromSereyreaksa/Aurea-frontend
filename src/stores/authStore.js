import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';
import toast from 'react-hot-toast';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      login: async (email, password) => {
        try {
          set({ isLoading: true });
          
          const response = await api.post('/api/auth/login', {
            email,
            password,
          });

          const { user, token } = response.data.data;
          
          // Store token and user
          localStorage.setItem('aurea_token', token);
          localStorage.setItem('aurea_user', JSON.stringify(user));
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          toast.success('Login successful!');
          return { success: true };
          
        } catch (error) {
          set({ isLoading: false });
          return { 
            success: false, 
            error: error.response?.data?.message || 'Login failed' 
          };
        }
      },

      signup: async (name, email, password) => {
        try {
          set({ isLoading: true });
          
          const response = await api.post('/api/auth/signup', {
            name,
            email,
            password,
          });

          const { user, token } = response.data.data;
          
          // Store token and user
          localStorage.setItem('aurea_token', token);
          localStorage.setItem('aurea_user', JSON.stringify(user));
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          toast.success('Account created successfully!');
          return { success: true };
          
        } catch (error) {
          set({ isLoading: false });
          return { 
            success: false, 
            error: error.response?.data?.message || 'Signup failed' 
          };
        }
      },

      logout: () => {
        localStorage.removeItem('aurea_token');
        localStorage.removeItem('aurea_user');
        
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });

        toast.success('Logged out successfully');
      },

      checkAuth: async () => {
        try {
          const token = localStorage.getItem('aurea_token');
          const savedUser = localStorage.getItem('aurea_user');
          
          if (!token || !savedUser) {
            return;
          }

          // Verify token with backend
          const response = await api.get('/api/auth/me');
          const user = response.data.data;
          
          set({
            user,
            isAuthenticated: true,
          });
          
        } catch (error) {
          // Token is invalid, clear everything
          get().logout();
        }
      },

      updateProfile: async (userData) => {
        try {
          set({ isLoading: true });
          
          const response = await api.put('/api/auth/me', userData);
          const updatedUser = response.data.data;
          
          localStorage.setItem('aurea_user', JSON.stringify(updatedUser));
          
          set({
            user: updatedUser,
            isLoading: false,
          });

          toast.success('Profile updated successfully!');
          return { success: true };
          
        } catch (error) {
          set({ isLoading: false });
          return { 
            success: false, 
            error: error.response?.data?.message || 'Update failed' 
          };
        }
      },
    }),
    {
      name: 'aurea-auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;