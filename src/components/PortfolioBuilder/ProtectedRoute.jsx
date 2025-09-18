import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, checkAuth, isLoading } = useAuthStore();
  const [authChecked, setAuthChecked] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        // Error handled in store
      } finally {
        setAuthChecked(true);
      }
    };
    
    // Only check auth if not already loading
    if (!isLoading) {
      verifyAuth();
    } else {
      setAuthChecked(true);
    }
  }, [checkAuth, isLoading]);

  // Show loading while checking auth status
  if (!authChecked || isLoading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>;
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;