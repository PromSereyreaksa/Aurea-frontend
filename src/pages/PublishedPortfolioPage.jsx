import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { templateAdapter } from '../lib/templateAdapter';

/**
 * Published Portfolio Page
 * 
 * Public view of a published portfolio accessible via /portfolio/:slug
 * This is what users share with others - no editing capabilities
 */
const PublishedPortfolioPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPublishedPortfolio();
  }, [slug]);

  const fetchPublishedPortfolio = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/portfolios/public/${slug}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          setError('Portfolio not found');
        } else {
          setError('Failed to load portfolio');
        }
        return;
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        setPortfolio(data.data);
      } else {
        setError('Portfolio not found');
      }
    } catch (err) {
      console.error('Error fetching portfolio:', err);
      setError('Failed to load portfolio');
    } finally {
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
  if (error || !portfolio) {
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
            <p className="text-gray-600 mb-6">
              {error || "The portfolio you're looking for doesn't exist or has been unpublished."}
            </p>
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

  // Check if portfolio is published
  if (!portfolio.isPublished) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Portfolio Unpublished
            </h1>
            <p className="text-gray-600 mb-6">
              This portfolio is not currently published and is not accessible to the public.
            </p>
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

  // State for template loading
  const [template, setTemplate] = useState(null);
  const [templateLoading, setTemplateLoading] = useState(true);

  // Load template when portfolio is available
  useEffect(() => {
    if (portfolio?.templateId || portfolio?.template) {
      loadTemplate();
    }
  }, [portfolio]);

  const loadTemplate = async () => {
    try {
      setTemplateLoading(true);
      const templateId = portfolio.templateId || portfolio.template || 'echelon';
      const loadedTemplate = await templateAdapter.getTemplateWithComponent(templateId);
      setTemplate(loadedTemplate);
    } catch (error) {
      console.error('Failed to load template:', error);
      // Try fallback
      const fallbackTemplate = await templateAdapter.getTemplateWithComponent('echelon');
      setTemplate(fallbackTemplate);
    } finally {
      setTemplateLoading(false);
    }
  };

  // Loading template
  if (templateLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading template...</p>
        </div>
      </div>
    );
  }

  // Template not found
  if (!template || !template.component) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Template Not Available
            </h1>
            <p className="text-gray-600 mb-6">
              Unable to load the template for this portfolio.
            </p>
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

  const TemplateComponent = template.component;

  // Render the portfolio template
  return (
    <div className="min-h-screen bg-white">
      {/* SEO Meta Tags - These would be set in the head */}
      <title>{portfolio.title || 'Portfolio'}</title>
      
      {/* Render Template with merged styling */}
      <TemplateComponent
        content={portfolio.content}
        styling={portfolio.styling || template.styling}
        isEditing={false}
        isPreview={false}
        portfolioId={portfolio._id}
        caseStudies={portfolio.caseStudies || []}
      />

      {/* Powered by Aurea Badge (Optional) */}
      <div className="fixed bottom-4 right-4 z-50">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-all text-sm"
        >
          <span className="text-gray-600">Made with</span>
          <span className="font-bold text-orange-600">AUREA</span>
        </a>
      </div>
    </div>
  );
};

export default PublishedPortfolioPage;
