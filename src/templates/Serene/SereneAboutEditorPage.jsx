/**
 * Serene About Editor Page
 *
 * Dedicated editor for the Serene template's About page
 * Allows editing the 3-column bio layout
 * Mobile-friendly with floating action button
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import usePortfolioStore from '../../stores/portfolioStore';
import { portfolioApi } from '../../lib/portfolioApi';
import api from '../../lib/baseApi';
import SereneAboutPage from './SereneAboutPage';

const SereneAboutEditorPage = () => {
  const { portfolioId } = useParams();
  const navigate = useNavigate();
  const { portfolios } = usePortfolioStore();

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // About page content state
  const [aboutContent, setAboutContent] = useState({
    navigation: {
      logo: 'Portfolio',
      menuItems: [
        { label: 'Home', link: '/' },
        { label: 'About', link: '/about' }
      ]
    },
    about: {
      bio1: 'Specializing in minimalist logo design and comprehensive brand identity systems that bring clarity and recognition to modern businesses.',
      tagline: '',
      bio2: 'With over 8 years of experience, I create distinctive logos that capture the essence of brands through clean, memorable design solutions.',
      bio3: 'Award-winning logo designer specializing in creating distinctive brand identities for global companies across various industries.',
      name: 'Portfolio'
    }
  });

  // Serene template styling
  const [styling, setStyling] = useState({
    colors: {
      primary: '#4a5568',
      secondary: '#9ca3af',
      accent: '#e5e7eb',
      background: '#ffffff',
      surface: '#ffffff',
      text: '#6b7280',
      textSecondary: '#9ca3af',
      border: '#e5e7eb'
    },
    fonts: {
      headingFont: "'Inter', sans-serif",
      bodyFont: "'Inter', sans-serif",
      monoFont: "'Inter', sans-serif"
    }
  });

  useEffect(() => {
    // Load existing about page data from portfolio
    const loadAboutData = async () => {
      try {
        setIsLoading(true);

        console.log('\n' + '='.repeat(80));
        console.log('🔍 SERENE ABOUT EDITOR - LOADING DATA');
        console.log('='.repeat(80));
        console.log('📍 Portfolio ID:', portfolioId);

        // Fetch the portfolio
        const portfolioResponse = await api.get(`/api/portfolios/${portfolioId}`);
        const portfolio = portfolioResponse.data.data.portfolio;

        console.log('✅ Portfolio found:', portfolio.title);
        console.log('   Template:', portfolio.templateId);

        // Check if portfolio has about content
        if (portfolio.content?.about) {
          console.log('✅ About content found in portfolio');
          setAboutContent(prev => ({
            ...prev,
            about: {
              ...prev.about,
              ...portfolio.content.about
            }
          }));
        }

        // Load navigation if available
        if (portfolio.content?.navigation) {
          setAboutContent(prev => ({
            ...prev,
            navigation: portfolio.content.navigation
          }));
        }

        // Load styling if available
        if (portfolio.styling) {
          setStyling(prev => ({
            colors: { ...prev.colors, ...portfolio.styling.colors },
            fonts: { ...prev.fonts, ...portfolio.styling.fonts }
          }));
        }

        console.log('✅ About page data loaded');
      } catch (error) {
        console.error('❌ Error loading about data:', error);
        toast.error('Failed to load about page data');
      } finally {
        setIsLoading(false);
      }
    };

    if (portfolioId) {
      loadAboutData();
    }
  }, [portfolioId]);

  // Auto-reset save success state
  useEffect(() => {
    if (showSaveSuccess) {
      const timer = setTimeout(() => {
        setShowSaveSuccess(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showSaveSuccess]);

  // Keyboard shortcut for save (Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [aboutContent]);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      console.log('\n' + '='.repeat(80));
      console.log('💾 SERENE ABOUT PAGE - SAVING');
      console.log('='.repeat(80));
      console.log('📍 Portfolio ID:', portfolioId);

      // First, get the current portfolio to merge with existing content
      const currentPortfolio = await portfolioApi.getById(portfolioId);

      // Merge about and navigation content with existing portfolio content
      const updatedContent = {
        ...currentPortfolio.content,
        about: aboutContent.about,
        navigation: aboutContent.navigation
      };

      // Update the portfolio using portfolioApi
      const response = await portfolioApi.update(portfolioId, {
        content: updatedContent,
        styling: styling
      });

      if (response) {
        setHasUnsavedChanges(false);
        setShowSaveSuccess(true);
        toast.success('About page saved successfully!');
        console.log('✅ About page saved successfully!');
      } else {
        throw new Error('Failed to save about page');
      }
    } catch (error) {
      console.error('❌ Error saving about page:', error);
      toast.error(error.message || 'Failed to save about page');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmLeave) return;
    }
    navigate(`/portfolio-builder/${portfolioId}`);
  };

  const handlePreview = () => {
    setIsPreviewMode(true);
  };

  const handleBackToEdit = () => {
    setIsPreviewMode(false);
  };

  const handleContentChange = (sectionId, fieldId, value) => {
    setAboutContent(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [fieldId]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm uppercase tracking-wider">Loading About Page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      {/* Mobile-first Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
          <button
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-900 transition-colors text-xs md:text-sm uppercase tracking-wider"
          >
            ← Back
          </button>

          <div className="text-xs md:text-sm uppercase tracking-wider text-gray-500">
            {isPreviewMode ? 'Preview' : 'About Editor'}
          </div>

          {/* Desktop buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!isPreviewMode && (
              <button
                onClick={handlePreview}
                className="px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors uppercase tracking-wider"
              >
                Preview
              </button>
            )}

            {isPreviewMode && (
              <button
                onClick={handleBackToEdit}
                className="px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors uppercase tracking-wider"
              >
                Back to Edit
              </button>
            )}

            <button
              onClick={handleSave}
              disabled={isSaving || !hasUnsavedChanges}
              className={`px-6 py-2 text-sm uppercase tracking-wider transition-colors ${
                isSaving || !hasUnsavedChanges
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              {isSaving ? 'Saving...' : showSaveSuccess ? '✓ Saved!' : 'Save'}
            </button>
          </div>
          
          {/* Mobile spacer */}
          <div className="md:hidden w-8"></div>
        </div>
      </header>

      {/* Mobile Floating Action Button */}
      {!isPreviewMode && (
        <>
          {/* Overlay */}
          {isMobileMenuOpen && (
            <div 
              className="md:hidden bg-black bg-opacity-50"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ 
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 999998
              }}
            />
          )}

          {/* FAB Container */}
          <div 
            className="md:hidden"
            style={{
              position: 'fixed',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 999999
            }}
          >
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`w-14 h-14 ${isMobileMenuOpen ? 'bg-gray-700' : 'bg-gray-800'} hover:bg-gray-700 text-white rounded-full shadow-lg transition-all duration-200 flex items-center justify-center`}
            >
              <svg 
                className={`w-6 h-6 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-45' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-2xl p-3 space-y-2 min-w-[200px]">
                <button
                  onClick={() => {
                    handlePreview();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="text-sm font-medium">Preview</span>
                </button>

                <button
                  onClick={() => {
                    if (!isSaving && hasUnsavedChanges) {
                      handleSave();
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  disabled={isSaving || !hasUnsavedChanges}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isSaving || !hasUnsavedChanges
                      ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  <span className="text-sm font-medium">
                    {isSaving ? 'Saving...' : showSaveSuccess ? '✓ Saved!' : hasUnsavedChanges ? 'Save' : 'No Changes'}
                  </span>
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Preview Mode: Back Button */}
      {isPreviewMode && (
        <div 
          className="md:hidden"
          style={{
            position: 'fixed',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 999999
          }}
        >
          <button
            onClick={handleBackToEdit}
            className="w-14 h-14 bg-gray-800 hover:bg-gray-700 text-white rounded-full shadow-lg transition-all duration-200 flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
            </svg>
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="pt-20">
        <SereneAboutPage
          content={aboutContent}
          styling={styling}
          isEditing={!isPreviewMode}
          onContentChange={handleContentChange}
        />
      </div>

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && !isPreviewMode && (
        <div className="fixed bottom-6 right-6 bg-yellow-50 border border-yellow-200 px-4 py-3 rounded-lg shadow-lg">
          <p className="text-sm text-yellow-800">
            <strong>Unsaved changes</strong> - <span className="hidden md:inline">Press Ctrl+S to save</span><span className="md:hidden">Tap save button</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default SereneAboutEditorPage;
