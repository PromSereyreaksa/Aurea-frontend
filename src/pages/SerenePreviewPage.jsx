import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SereneTemplate from '../templates/Serene/SereneTemplate';
import useAuthStore from '../stores/authStore';
import { portfolioApi } from '../lib/portfolioApi';

const SerenePreviewPage = () => {
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
        backgroundColor: '#F9F7F4'
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

  // Mock data for the Serene template preview
  const mockData = {
    navigation: {
      logo: 'Studio RG',
      menuItems: [
        { label: 'About', link: '#about' },
        { label: 'Portfolio', link: '#gallery' },
        { label: 'Contact', link: '#contact' }
      ]
    },
    hero: {
      title: 'Rachel Garcia is a logo designer & brand identity specialist based in Melbourne',
      description1: 'Specializing in minimalist logo design and comprehensive brand identity systems that bring clarity and recognition to modern businesses.',
      description2: 'With over 8 years of experience, I create distinctive logos that capture the essence of brands through clean, memorable design solutions.'
    },
    gallery: {
      heroText1: 'Award-winning logo designer specializing in creating distinctive brand identities for global companies across various industries.',
      heroText2: 'From international sports organizations to luxury fashion brands, each project showcases a commitment to strategic design thinking and visual excellence.',
      firstRow: [
        {
          image: '/mockDataImage/logo/chanel.jpg',
          title: 'Chanel',
          description: 'Luxury fashion brand identity',
          span: 2
        },
        {
          image: '/mockDataImage/logo/loiusvulton.png',
          title: 'Louis Vuitton',
          description: 'Premium lifestyle brand',
          span: 1
        },
        {
          image: '/mockDataImage/logo/Arsenal-Logo.png',
          title: 'Arsenal FC',
          description: 'Sports team logo design',
          span: 2
        }
      ],
      secondRow: [
        {
          image: '/mockDataImage/logo/lalakers.png',
          title: 'LA Lakers',
          description: 'Professional basketball team',
          span: 2
        },
        {
          image: '/mockDataImage/logo/nba.jpg',
          title: 'NBA',
          description: 'Sports league branding',
          span: 3
        },
        {
          image: '/mockDataImage/logo/Premier-League-Symbol.png',
          title: 'Premier League',
          description: 'Football league identity',
          span: 2
        },
        {
          image: '/mockDataImage/logo/adidas.webp',
          title: 'Adidas',
          description: 'Athletic brand logo',
          span: 2
        }
      ],
      thirdRow: [
        {
          image: '/mockDataImage/logo/84e482f1ccb817ac426324d294eb5f59.jpg',
          title: 'Brand Logo',
          description: 'Corporate identity design',
          span: 2
        },
        {
          image: '/mockDataImage/logo/media_17770be5de64c9b159b23a7da870ae0bd5bc0f400.jpeg',
          title: 'Media Brand',
          description: 'Digital media logo',
          span: 2
        },
        {
          image: '/mockDataImage/logo/pasted-image-0-2-3-1024x950.png',
          title: 'Shell',
          description: 'Energy company logo',
          span: 1
        }
      ]
    },
    about: {
      name: 'Rachel Garcia',
      role: 'Logo Designer & Brand Identity Specialist',
      bio: 'I specialize in creating impactful logo designs and comprehensive brand identity systems for businesses worldwide. My work combines strategic thinking with clean, timeless aesthetics to build memorable brands.',
      image: '',
      location: 'Melbourne, Australia',
      experience: '8+ years'
    }
  };

  // Serene template styling
  const sereneColors = {
    primary: '#3d3d3d',
    secondary: '#9e9b95',
    accent: '#d4cfc8',
    background: '#e8e6e3',
    surface: '#ffffff',
    text: '#3d3d3d',
    textSecondary: '#9e9b95',
    border: '#c4c3c3'
  };

  // Determine which data to use - portfolioData content or mockData fallback
  // Handle both formats: portfolio.content or direct portfolio data
  const displayData = portfolioData
    ? (portfolioData.content || portfolioData)
    : mockData;

  // Debug logging
  console.log('Serene Preview - Data Status:', {
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
            fontFamily: "'Crimson Text', serif",
            fontSize: '24px',
            fontWeight: 600,
            color: sereneColors.primary
          }}>
            SERENE
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
        <SereneTemplate
          content={displayData}
          styling={{
            colors: sereneColors,
            fonts: {
              headingFont: "'Crimson Text', serif",
              bodyFont: "'Inter', sans-serif",
              monoFont: "'Crimson Text', serif"
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
          fontFamily: "'Crimson Text', serif",
          fontSize: '16px',
          marginBottom: '15px',
          fontWeight: 600,
          color: sereneColors.primary
        }}>
          This is a preview of the SERENE template
        </div>
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '12px',
          color: sereneColors.secondary,
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          Logo Design / Brand Identity Portfolio
        </div>
        </div>
      )}
    </div>
  );
};

export default SerenePreviewPage;