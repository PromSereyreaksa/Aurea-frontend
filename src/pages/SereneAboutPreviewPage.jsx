import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SereneAboutPage from '../templates/Serene/SereneAboutPage';
import useAuthStore from '../stores/authStore';
import { portfolioApi } from '../lib/portfolioApi';

const SereneAboutPreviewPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [searchParams] = useSearchParams();

  // Check for PDF mode and portfolio ID from query params
  const portfolioId = searchParams.get('portfolioId');
  const pdfMode = searchParams.get('pdfMode') === 'true';

  // State for loading real portfolio data
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load portfolio data if portfolioId is provided OR if data was injected
  useEffect(() => {
    const loadPortfolioData = async () => {
      // Check if data was already injected by Puppeteer
      if (window.__PORTFOLIO_DATA__) {
        console.log('✓ Using injected portfolio data');
        setPortfolioData(window.__PORTFOLIO_DATA__);
        setLoading(false);
        return;
      }

      // Otherwise, load from API if portfolioId is provided
      if (portfolioId) {
        setLoading(true);
        try {
          const portfolio = await portfolioApi.getById(portfolioId);
          if (portfolio) {
            setPortfolioData(portfolio);
            // Make data available globally for templateEngine
            window.__PORTFOLIO_DATA__ = portfolio;
          }
        } catch (error) {
          console.error('Failed to load portfolio data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadPortfolioData();
  }, [portfolioId]);

  const handleUseTemplate = () => {
    if (isAuthenticated) {
      // If logged in, go directly to portfolio builder with template pre-selected
      navigate('/portfolio-builder/new?template=serene');
    } else {
      // If not logged in, redirect to signup with return URL
      navigate('/signup?return=/portfolio-builder/new&template=serene');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div style={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff'
      }}>
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '14px',
          color: '#999999',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          Loading portfolio...
        </div>
      </div>
    );
  }

  // Mock data for the Serene About page preview
  const mockData = {
    navigation: {
      logo: 'Preview',
      menuItems: [
        { label: 'About', link: '/template-preview/serene/about' }
      ]
    },
    about: {
      bio1: 'Specializing in minimalist logo design and comprehensive brand identity systems that bring clarity and recognition to modern businesses.',
      tagline: '',
      bio2: 'With over 8 years of experience, I create distinctive logos that capture the essence of brands through clean, memorable design solutions.',
      bio3: 'Award-winning logo designer specializing in creating distinctive brand identities for global companies across various industries.'
    }
  };

  // Serene template styling - Clean Blossom palette
  const sereneColors = {
    primary: '#4a5568',
    secondary: '#9ca3af',
    accent: '#e5e7eb',
    background: '#ffffff',
    surface: '#ffffff',
    text: '#6b7280',
    textSecondary: '#9ca3af',
    border: '#e5e7eb'
  };

  // Determine which data to use - portfolioData content or mockData fallback
  // Handle both formats: portfolio.content or direct portfolio data
  const displayData = portfolioData
    ? (portfolioData.content || portfolioData)
    : mockData;

  // Debug logging
  console.log('Serene About Preview - Data Status:', {
    hasPortfolioData: !!portfolioData,
    hasContent: !!portfolioData?.content,
    usingMockData: !portfolioData,
    pdfMode
  });

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: sereneColors.background
    }}>
      {/* Preview Header - Hidden in PDF mode */}
      {!pdfMode && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: sereneColors.surface,
          color: sereneColors.text,
          padding: '20px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 1000,
          borderBottom: `1px solid ${sereneColors.border}`,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '24px',
            fontWeight: 600,
            color: sereneColors.primary
          }}>
            SERENE - ABOUT
          </div>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '12px',
            color: sereneColors.secondary,
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            Template Preview
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '15px',
          alignItems: 'center'
        }}>
          <button
            onClick={() => window.history.back()}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '13px',
              color: sereneColors.text,
              backgroundColor: 'transparent',
              border: `1px solid ${sereneColors.border}`,
              padding: '10px 20px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              borderRadius: '2px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = sereneColors.text;
              e.target.style.color = sereneColors.surface;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = sereneColors.text;
            }}
          >
            ← BACK
          </button>

          <button
            onClick={handleUseTemplate}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '13px',
              fontWeight: 500,
              color: sereneColors.surface,
              backgroundColor: sereneColors.primary,
              border: `1px solid ${sereneColors.primary}`,
              padding: '10px 30px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              borderRadius: '2px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = sereneColors.text;
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(61, 61, 61, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = sereneColors.primary;
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            USE THIS TEMPLATE
          </button>
        </div>
        </div>
      )}

      {/* Template Content with margin for fixed header (no margin in PDF mode) */}
      <div style={{ marginTop: pdfMode ? '0' : '80px' }}>
        <SereneAboutPage
          content={displayData}
          styling={{
            colors: sereneColors,
            fonts: {
              headingFont: "'Inter', sans-serif",
              bodyFont: "'Inter', sans-serif",
              monoFont: "'Inter', sans-serif"
            }
          }}
          isEditing={false}
          onContentChange={() => {}}
        />
      </div>

      {/* Preview Footer - Hidden in PDF mode */}
      {!pdfMode && (
        <div style={{
        backgroundColor: sereneColors.surface,
        color: sereneColors.text,
        padding: '40px',
        textAlign: 'center',
        borderTop: `1px solid ${sereneColors.border}`
      }}>
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '16px',
          marginBottom: '15px',
          fontWeight: 600,
          color: sereneColors.primary
        }}>
          This is a preview of the SERENE template - About Page
        </div>
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '12px',
          color: sereneColors.secondary,
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          Portfolio About Page
        </div>
        </div>
      )}
    </div>
  );
};

export default SereneAboutPreviewPage;
