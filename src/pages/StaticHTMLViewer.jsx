import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

/**
 * StaticHTMLViewer - Displays static HTML files from backend
 *
 * This component fetches HTML from the backend and displays it as a standalone page.
 * It replaces the entire React app with the static HTML content.
 */
const StaticHTMLViewer = () => {
  const { subdomain } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAndDisplayHTML();
  }, [subdomain]);

  const fetchAndDisplayHTML = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${apiBase}/api/sites/${subdomain}/raw-html`);

      if (!response.ok) {
        if (response.status === 404) {
          setError('Portfolio not found');
        } else {
          setError('Failed to load portfolio');
        }
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.success && data.html) {
        // Replace the entire document with the HTML content
        // This gives a true static HTML experience
        document.open();
        document.write(data.html);
        document.close();
      } else {
        setError('Invalid HTML content');
        setLoading(false);
      }

    } catch (err) {
      console.error('Error fetching HTML:', err);
      setError('Failed to load portfolio');
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Portfolio Not Found
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  // This won't actually be shown because document.write replaces everything
  return null;
};

export default StaticHTMLViewer;
