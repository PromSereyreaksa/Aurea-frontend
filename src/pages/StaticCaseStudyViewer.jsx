import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

/**
 * StaticCaseStudyViewer - Displays static case study HTML from backend
 *
 * This component fetches case study HTML from the backend and displays it as a standalone page.
 * It follows the same pattern as StaticHTMLViewer, replacing the entire React app with the static HTML content.
 */
const StaticCaseStudyViewer = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract subdomain and projectId from params
  const subdomain = params.subdomain;

  // Extract project ID from the URL path since React Router has issues with .html extension
  let projectId = params.projectId || '';

  // If no projectId in params, extract from URL
  if (!projectId && window.location.pathname.includes('case-study-')) {
    const match = window.location.pathname.match(/case-study-(\d+)\.html/);
    if (match) {
      projectId = match[1];
    }
  }

  // Clean up projectId
  projectId = projectId.replace('.html', '').replace('case-study-', '');

  console.log('[StaticCaseStudyViewer] Component mounted with:', {
    subdomain,
    projectId,
    fullParams: params,
    url: window.location.href
  });

  useEffect(() => {
    console.log('useEffect triggered:', { subdomain, projectId });
    if (subdomain && projectId) {
      fetchAndDisplayCaseStudy();
    }
  }, [subdomain, projectId]);

  const fetchAndDisplayCaseStudy = async () => {
    console.log('[StaticCaseStudyViewer] Starting fetch:', {
      subdomain,
      projectId,
      currentURL: window.location.href,
      pathname: window.location.pathname
    });

    try {
      setLoading(true);
      setError(null);

      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const url = `${apiBase}/api/sites/${subdomain}/case-study/${projectId}/raw-html`;
      console.log('[StaticCaseStudyViewer] API URL:', url);

      const response = await fetch(url);
      console.log('[StaticCaseStudyViewer] Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[StaticCaseStudyViewer] Error response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });

        if (response.status === 404) {
          setError(`Case study not found (subdomain: ${subdomain}, project: ${projectId})`);
        } else {
          setError(`Failed to load case study (status: ${response.status})`);
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log('[StaticCaseStudyViewer] Response data:', {
        success: data.success,
        hasHtml: !!data.html,
        htmlLength: data.html ? data.html.length : 0
      });

      if (data.success && data.html) {
        console.log('[StaticCaseStudyViewer] Replacing document with HTML content');

        // Add a marker to the HTML to track if it was loaded properly
        const enhancedHtml = data.html.replace(
          '</head>',
          '<script>window.__caseStudyLoaded = true; console.log("[Case Study] HTML loaded for project ' + projectId + '");</script></head>'
        );

        // Replace the entire document with the HTML content
        document.open();
        document.write(enhancedHtml);
        document.close();

        console.log('[StaticCaseStudyViewer] Document replaced successfully');
      } else {
        console.error('[StaticCaseStudyViewer] Invalid response data:', data);
        setError('Invalid case study content - no HTML received');
        setLoading(false);
      }

    } catch (err) {
      console.error('[StaticCaseStudyViewer] Fetch error:', {
        error: err,
        message: err.message,
        stack: err.stack
      });
      setError(`Failed to load case study: ${err.message}`);
      setLoading(false);
    }
  };

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Case Study Not Found
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors mr-3"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
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

export default StaticCaseStudyViewer;
