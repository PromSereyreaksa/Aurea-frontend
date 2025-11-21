import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PublishModal = ({
  isOpen,
  onClose,
  onPublish,
  currentSlug = '',
  portfolioTitle = 'My Portfolio',
  isPublished = false,
  portfolioId = null
}) => {
  const [slug, setSlug] = useState(currentSlug);
  const [isValidating, setIsValidating] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);
  const [error, setError] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishingProgress, setPublishingProgress] = useState('');

  // Generate initial slug from portfolio title
  useEffect(() => {
    if (isOpen && !currentSlug && portfolioTitle) {
      const generatedSlug = generateSlugFromTitle(portfolioTitle);
      setSlug(generatedSlug);
    }
  }, [isOpen, currentSlug, portfolioTitle]);

  // Validate slug as user types
  useEffect(() => {
    if (slug) {
      validateSlug(slug);
    }
  }, [slug]);

  const generateSlugFromTitle = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()
      .substring(0, 50); // Limit length
  };

  const validateSlug = async (slugValue) => {
    // Reset states
    setError('');
    setIsAvailable(null);

    // Check if slug is empty
    if (!slugValue) {
      setError('Slug is required');
      return;
    }

    // Check format
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(slugValue)) {
      setError('Slug can only contain lowercase letters, numbers, and hyphens');
      return;
    }

    // Check length
    if (slugValue.length < 3) {
      setError('Slug must be at least 3 characters');
      return;
    }

    if (slugValue.length > 50) {
      setError('Slug must be less than 50 characters');
      return;
    }

    // If it's the same as current slug (already published), it's available
    if (slugValue === currentSlug) {
      setIsAvailable(true);
      return;
    }

    // Check availability with backend
    setIsValidating(true);
    try {
      // Include portfolioId as query param to exclude current portfolio from check
      const url = new URL(`${import.meta.env.VITE_API_BASE_URL}/api/portfolios/check-slug/${slugValue}`);
      if (portfolioId) {
        url.searchParams.append('portfolioId', portfolioId);
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        // Backend returns nested structure: { success, data: { available } }
        const available = data.data?.available ?? data.available;
        setIsAvailable(available);
        if (!available) {
          setError('This slug is already taken');
        }
      }
    } catch (err) {
      console.error('Error checking slug:', err);
      // Don't block publishing if validation fails
      setIsAvailable(true);
    } finally {
      setIsValidating(false);
    }
  };

  const handleSlugChange = (e) => {
    let value = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '') // Only allow valid characters
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    
    setSlug(value);
  };

  const handlePublish = async () => {
    if (!slug || error || isValidating || isAvailable === false) {
      return;
    }

    setIsPublishing(true);
    setPublishingProgress('Validating subdomain...');

    try {
      setPublishingProgress('Generating HTML files...');
      await onPublish(slug);
      setPublishingProgress('Publishing complete!');

      // Redirect to published portfolio after short delay
      setTimeout(() => {
        const publishedUrl = `${window.location.origin}/${slug}/html`;
        window.location.href = publishedUrl;
      }, 800);
    } catch (err) {
      setError(err.message || 'Failed to publish portfolio');
      setPublishingProgress('');
      setIsPublishing(false);
    }
  };

  const generateRandomSlug = () => {
    const adjectives = ['creative', 'modern', 'elegant', 'bold', 'minimal', 'unique', 'stunning', 'professional'];
    const nouns = ['portfolio', 'works', 'designs', 'showcase', 'studio', 'gallery', 'collection'];
    const randomNum = Math.floor(Math.random() * 1000);
    
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    
    setSlug(`${adj}-${noun}-${randomNum}`);
  };

  const getReactUrl = () => {
    // React app view (uses your template with React)
    return `${window.location.origin}/portfolio/${slug}`;
  };

  const getStaticUrl = () => {
    // Static HTML file served through frontend domain
    // In production: https://aurea.tools/{subdomain}/html
    // In development: http://localhost:5173/{subdomain}/html
    return `${window.location.origin}/${slug}/html`;
  };

  const copyToClipboard = async (url, buttonId) => {
    try {
      await navigator.clipboard.writeText(url);
      // Show a brief visual feedback
      const button = document.getElementById(buttonId);
      if (button) {
        const originalText = button.innerHTML;
        button.innerHTML = `
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          Copied!
        `;
        setTimeout(() => {
          button.innerHTML = originalText;
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isPublished ? 'Update Published Portfolio' : 'Publish Your Portfolio'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {isPublished
                  ? 'Update your portfolio URL or republish changes'
                  : 'Make your portfolio publicly accessible with a custom URL'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-6">
            {/* Portfolio URL Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Portfolio Slug
              </label>
              <p className="text-sm text-gray-600 mb-4">
                Choose a unique slug for your portfolio. It will be accessible at aurea.tools/portfolio/your-slug
              </p>

              {/* Slug Input */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={slug}
                      onChange={handleSlugChange}
                      placeholder="your-portfolio-name"
                      className={`w-full px-4 pr-12 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all bg-white text-gray-900 font-medium placeholder:text-gray-400 ${
                        error 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                          : isAvailable 
                            ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                            : 'border-gray-300 focus:border-orange-500 focus:ring-orange-200'
                      }`}
                    />
                    {isValidating && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-600"></div>
                      </div>
                    )}
                    {!isValidating && isAvailable && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={generateRandomSlug}
                    className="w-full sm:w-auto px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-gray-700"
                    title="Generate random slug"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Generate Random Slug
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {/* Success Message */}
                {!error && isAvailable && slug && (
                  <div className="flex items-start gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>This URL is available!</span>
                  </div>
                )}
              </div>
            </div>

            {/* URL Preview */}
            {slug && (
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border-2 border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <label className="text-sm font-bold text-orange-900">
                      Your Portfolio URL
                    </label>
                    <p className="text-xs text-orange-700 mt-0.5">Shareable link to your published portfolio</p>
                  </div>
                  <button
                    id="copy-portfolio-url"
                    onClick={() => copyToClipboard(getStaticUrl(), 'copy-portfolio-url')}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Link
                  </button>
                </div>
                <div className="bg-white px-4 py-3 rounded-lg border border-orange-300">
                  <p className="text-sm font-mono text-gray-900 break-all">
                    {getStaticUrl()}
                  </p>
                </div>
                <div className="mt-3 flex items-start gap-2 text-xs text-orange-800 bg-orange-50/50 px-3 py-2 rounded-lg">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>Case study links are included automatically if you have added case studies to your projects</span>
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-gray-700 font-medium hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePublish}
              disabled={!slug || !!error || isValidating || isAvailable === false || isPublishing}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                !slug || error || isValidating || isAvailable === false || isPublishing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {isPublishing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span className="flex flex-col items-start">
                    <span className="text-xs opacity-80">{publishingProgress}</span>
                  </span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {isPublished ? 'Update Portfolio' : 'Publish Portfolio'}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PublishModal;
