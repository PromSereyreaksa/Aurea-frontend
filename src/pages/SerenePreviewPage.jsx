import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import SereneTemplate from '../templates/Serene/SereneTemplate';
import useAuthStore from '../stores/authStore';
import usePortfolioStore from '../stores/portfolioStore';
import { portfolioApi } from '../lib/portfolioApi';
import { getTemplate } from '../templates';

const SerenePreviewPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { createPortfolio } = usePortfolioStore();
  const [searchParams] = useSearchParams();

  // Check for PDF mode and portfolio ID from query params
  const portfolioId = searchParams.get('portfolioId');
  const pdfMode = searchParams.get('pdfMode') === 'true';

  // State for loading real portfolio data
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

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

  const handleUseTemplate = async () => {
    if (!isAuthenticated) {
      navigate('/signup?return=/template-preview/serene');
      return;
    }

    setIsCreating(true);
    try {
      const template = getTemplate('serene');
      if (!template) {
        throw new Error('Serene template not found');
      }

      const initialPortfolioData = {
        title: `${template.name} Portfolio`,
        description: `Portfolio created with ${template.name} template`,
        template: template.id,
        sections: [],
        styling: template.styling || {},
        published: false,
      };

      const result = await createPortfolio(initialPortfolioData);

      if (result && result.success && result.portfolio?._id) {
        toast.success('Template selected! Redirecting to setup...', {
          duration: 2000,
          id: 'template-selected'
        });
        navigate(`/portfolio-builder/${result.portfolio._id}?setup=true`, { replace: true });
      } else {
        throw new Error(result?.error || 'Failed to create portfolio');
      }
    } catch (error) {
      console.error('Failed to create portfolio:', error);
      toast.error(`Failed to create portfolio: ${error.message || 'Please try again.'}`);
    } finally {
      setIsCreating(false);
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
      logo: 'Preview',
      menuItems: [
        { label: 'About', link: '/template-preview/serene/about' }
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
      bio1: 'Rachel Garcia began tattooing fresh out of art school, and her botanical work has a painterly quality that reflects her training:',
      tagline: ' with delicate highlights and shadows.',
      bio2: 'After graduating with a Bachelor of Fine Arts from Greenkrug College of Arts & Design (Auckland, New Zealand) in 2013, her work has been an ever-evolving platform for self-expression.',
      bio3: 'Rachel often travels to visit museums for inspiration. Recent projects were inspired by a visit to the Sotheby\'s Institute of Art, London.'
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
        <div className="px-4 py-3 md:px-8 md:py-5" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: sereneColors.surface,
          color: sereneColors.text,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 1000,
          borderBottom: `1px solid ${sereneColors.border}`,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
        <div className="flex items-center gap-2 md:gap-5">
          <div style={{
            fontFamily: "'Crimson Text', serif",
            fontSize: 'clamp(16px, 4vw, 24px)',
            fontWeight: 600,
            color: sereneColors.primary
          }}>
            SERENE
          </div>
          <div className="hidden sm:block" style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(10px, 2vw, 12px)',
            color: sereneColors.secondary,
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            Template Preview
          </div>
        </div>

        <div className="flex gap-2 md:gap-4 items-center">
          <button
            onClick={() => window.history.back()}
            className="px-3 py-2 md:px-5 md:py-2.5 text-xs md:text-sm"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: sereneColors.text,
              backgroundColor: 'transparent',
              border: `1px solid ${sereneColors.border}`,
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
            <span className="hidden sm:inline">← </span>BACK
          </button>

          <button
            onClick={handleUseTemplate}
            disabled={isCreating}
            className="px-4 py-2 md:px-6 md:py-2.5 text-xs md:text-sm whitespace-nowrap"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              color: sereneColors.surface,
              backgroundColor: isCreating ? '#999999' : sereneColors.primary,
              border: `1px solid ${isCreating ? '#999999' : sereneColors.primary}`,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              cursor: isCreating ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              borderRadius: '2px',
              opacity: isCreating ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!isCreating) {
                e.target.style.backgroundColor = sereneColors.text;
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(61, 61, 61, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isCreating) {
                e.target.style.backgroundColor = sereneColors.primary;
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            {isCreating ? 'CREATING...' : <><span className="hidden md:inline">USE THIS </span>TEMPLATE</>}
          </button>
        </div>
        </div>
      )}

      {/* Template Content with margin for fixed header (no margin in PDF mode) */}
      <div className={pdfMode ? '' : 'mt-14 md:mt-20'}>
        <SereneTemplate
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