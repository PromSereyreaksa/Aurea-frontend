import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import useAuthStore from '../stores/authStore';
import authApi from '../lib/authApi';

const GoogleCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { checkAuth } = useAuthStore();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      // Get token from URL params
      const token = searchParams.get('token');
      const errorParam = searchParams.get('error');

      // Check for errors from backend
      if (errorParam) {
        setError(errorParam);
        setStatus('error');
        return;
      }

      if (!token) {
        setError('No authentication token received');
        setStatus('error');
        return;
      }

      try {
        // Handle Google callback
        await authApi.handleGoogleCallback(token);

        // Update auth state
        await checkAuth();

        setStatus('success');

        // Redirect to dashboard after 1 second
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1000);
      } catch (err) {
        console.error('Google callback error:', err);
        setError(err.response?.data?.message || 'Failed to complete Google sign-in');
        setStatus('error');
      }
    };

    handleCallback();
  }, [searchParams, checkAuth, navigate]);

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Completing Sign In...
          </h2>
          <p className="text-gray-600">Please wait while we sign you in with Google</p>
        </div>
      </div>
    );
  }

  // Success state
  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6"
          >
            <FaCheckCircle className="text-4xl text-green-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Sign In Successful!
          </h2>
          <p className="text-gray-600 mb-4">
            You have successfully signed in with Google.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
              <FaTimesCircle className="text-4xl text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Sign In Failed
            </h2>
            <p className="text-gray-600 mb-8">
              {error || 'An error occurred while signing in with Google. Please try again.'}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/login', { replace: true })}
                className="block w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all text-center"
              >
                Back to Login
              </button>
              <button
                onClick={() => navigate('/signup', { replace: true })}
                className="block w-full py-3 px-6 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors text-center"
              >
                Create New Account
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
};

export default GoogleCallbackPage;
