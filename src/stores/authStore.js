import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "../lib/authApi";
import toast from "react-hot-toast";

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      _tokenCheckInterval: null,

      // Periodic token expiration check
      startTokenExpirationCheck: () => {
        const currentInterval = get()._tokenCheckInterval;
        if (currentInterval) {
          clearInterval(currentInterval);
        }

        const interval = setInterval(() => {
          if (!authApi.isAuthenticated() && get().isAuthenticated) {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });

            if (!window.location.pathname.includes("/login")) {
              toast.error("Session expired. Please login again.");
              window.location.href = "/login";
            }
          }
        }, 60000);

        set({ _tokenCheckInterval: interval });
      },

      stopTokenExpirationCheck: () => {
        const interval = get()._tokenCheckInterval;
        if (interval) {
          clearInterval(interval);
          set({ _tokenCheckInterval: null });
        }
      },

      // Actions
      login: async (email, password) => {
        try {
          set({ isLoading: true });

          const result = await authApi.login({ email, password });
          console.log("Login result:", result); // Debug log

          if (!result || !result.data || !result.data.user) {
            throw new Error("Invalid login response structure");
          }

          const { user, token } = result.data; // The user and token are in result.data

          console.log("User:", user, "Token:", token); // Debug log

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          // Check what was actually stored in localStorage
          console.log(
            "After login - localStorage token:",
            localStorage.getItem("aurea_token")
          );
          console.log(
            "After login - localStorage user:",
            localStorage.getItem("aurea_user")
          );

          // Start token expiration monitoring
          get().startTokenExpirationCheck();

          // Show success toast with shorter duration
          toast.success("Login successful!", { duration: 2000 });
          return { success: true };
        } catch (error) {
          console.error("Login error:", error); // Debug log
          set({ isLoading: false });
          return {
            success: false,
            error:
              error.response?.data?.message || error.message || "Login failed",
          };
        }
      },

      signup: async (name, email, password) => {
        try {
          set({ isLoading: true });

          const result = await authApi.signup({ name, email, password });
          const { user, token } = result.data; // The user and token are in result.data

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          // Start token expiration monitoring
          get().startTokenExpirationCheck();

          toast.success("Account created successfully!", { duration: 2000 });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return {
            success: false,
            error: error.response?.data?.message || "Signup failed",
          };
        }
      },

      logout: async () => {
        // Stop token monitoring
        get().stopTokenExpirationCheck();

        await authApi.logout();

        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });

        toast.success("Logged out successfully", { duration: 2000 });
      },

      // Clear auth state without API calls (for 401 error handling)
      clearAuth: () => {
        // Stop token monitoring
        get().stopTokenExpirationCheck();

        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      checkAuth: async () => {
        console.log("checkAuth called"); // Debug log
        try {
          // First check if we have a valid, non-expired token
          if (!authApi.isAuthenticated()) {
            console.log("authApi.isAuthenticated() returned false"); // Debug log
            // Token is missing or expired, clear state
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
            return;
          }

          console.log("Token is valid, fetching user data"); // Debug log

          // Get fresh user data to verify the token works
          const user = await authApi.getCurrentUser();

          console.log("checkAuth - user data retrieved:", user); // Debug log

          set({
            user,
            isAuthenticated: true,
          });

          // Start token expiration monitoring if user is authenticated
          get().startTokenExpirationCheck();
        } catch (error) {
          console.error("checkAuth error:", error); // Debug log
          // API call failed, clear invalid auth state
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });

          // Clear localStorage as well
          localStorage.removeItem("aurea_token");
          localStorage.removeItem("aurea_user");
        }
      },

      updateProfile: async (userData) => {
        try {
          set({ isLoading: true });

          const updatedUser = await authApi.updateProfile(userData);

          set({
            user: updatedUser,
            isLoading: false,
          });

          toast.success("Profile updated successfully!");
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return {
            success: false,
            error: error.response?.data?.message || "Update failed",
          };
        }
      },
    }),
    {
      name: "aurea-auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
