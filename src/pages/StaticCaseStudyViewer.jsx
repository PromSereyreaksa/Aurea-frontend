import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

/**
 * StaticCaseStudyViewer - Displays static case study HTML files from backend
 *
 * This component fetches case study HTML from the backend and displays it as a standalone page.
 */
const StaticCaseStudyViewer = () => {
  const { subdomain, projectId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAndDisplayHTML = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

      // First, try to get the portfolio site data
      const response = await fetch(`${apiBase}/api/sites/${subdomain}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError('Portfolio not found');
        } else {
          setError('Failed to load case study');
        }
        setLoading(false);
        return;
      }

      const data = await response.json();

      // Check if the portfolio has static case study HTML
      if (data.success && data.data && data.data.caseStudies) {
        const caseStudy = data.data.caseStudies.find(cs => cs.id === projectId || cs._id === projectId);

        if (caseStudy && caseStudy.staticHtml) {
          // Replace the entire document with the HTML content
          document.open();
          document.write(caseStudy.staticHtml);
          document.close();
        } else {
          // Fallback to the portfolio page with case study
          navigate(`/portfolio/${subdomain}/project/${projectId}`);
        }
      } else {
        setError('Case study not found');
        setLoading(false);
      }

    } catch (err) {
      console.error('Error fetching case study HTML:', err);
      setError('Failed to load case study');
      setLoading(false);
    }
  }, [subdomain, projectId, navigate]);

  useEffect(() => {
    fetchAndDisplayHTML();
  }, [fetchAndDisplayHTML]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading case study...</p>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Case Study Not Found
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={() => navigate(`/${subdomain}/html`)}
                className="w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
              >
                Back to Portfolio
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // This won't actually be shown because document.write replaces everything
  return null;
};

export default StaticCaseStudyViewer;
