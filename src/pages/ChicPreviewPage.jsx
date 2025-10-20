import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ChicTemplate from '../templates/Chic/ChicTemplate';
import useAuthStore from '../stores/authStore';
import { portfolioApi } from '../lib/portfolioApi';

const ChicPreviewPage = () => {
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
      navigate('/portfolio-builder/new?template=chic');
    } else {
      // If not logged in, redirect to signup with return URL
      navigate('/signup?return=/portfolio-builder/new&template=chic');
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
        backgroundColor: '#FFFFFF'
      }}>
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '11px',
          color: '#818181',
          textTransform: 'uppercase',
          letterSpacing: '0.3px'
        }}>
          Loading portfolio...
        </div>
      </div>
    );
  }

  // Mock data for the Chic template preview
  const mockData = {
    hero: {
      name: 'Varvara Godovikova',
      bio: 'is a graphic designer\nand illustrator based in\nBarcelona. She works\nin Editorial Design, Web,\nand Brand Identity.',
      instagram: 'https://instagram.com/varvara',
      linkedin: 'https://linkedin.com/in/varvara'
    },
    work: {
      projects: [
        {
          id: 1,
          title: 'CHAOSK',
          subtitle: 'Brand Identity',
          year: '2023',
          awards: 'ADG Laus Silver 2023',
          image: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?w=1200&h=800&fit=crop',
          link: ''
        },
        {
          id: 2,
          title: 'ANNKI STUDIO',
          subtitle: 'Brand Guardianship',
          year: 'currently',
          image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=800&fit=crop',
          link: ''
        },
        {
          id: 3,
          title: 'UU PHOTOSTUDIO',
          subtitle: 'Advent Calendar',
          year: '2024',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop',
          link: ''
        },
        {
          id: 4,
          title: 'FITTING HISTORY',
          subtitle: 'Visual Identity for an art center in Barcelona',
          year: '2023',
          awards: 'Best Thesis Project Award / Presented at Brut!',
          image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1200&h=800&fit=crop',
          link: ''
        },
        {
          id: 5,
          title: 'GO UPLORBLOCK',
          subtitle: 'Visual Identity & Brand Guardianship',
          year: '2023',
          image: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=1200&h=800&fit=crop',
          link: ''
        },
        {
          id: 6,
          title: 'ART UU',
          subtitle: 'Website Design & Development',
          year: '2024',
          image: 'https://images.unsplash.com/photo-1545239705-1564e58b9e4a?w=1200&h=800&fit=crop',
          link: ''
        },
        {
          id: 7,
          title: 'SSSTUFF SUPERMARKET',
          subtitle: 'Prints, posters, money, stickers & more',
          year: '2021-2023',
          image: 'https://images.unsplash.com/photo-1557180295-76eee20ae8aa?w=1200&h=800&fit=crop',
          link: ''
        },
        {
          id: 8,
          title: 'EMBODIED MAGAZINE',
          subtitle: 'Editorial Design, Art Direction',
          year: '2022',
          image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=1200&h=800&fit=crop',
          link: ''
        }
      ]
    },
    contact: {
      email: 'hello@varvara.com',
      telegram: 'https://t.me/varvara'
    }
  };

  // Chic template styling
  const chicColors = {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    text: '#000000',
    textSecondary: '#141414',
    textBody: '#282828',
    textLight: '#666666',
    textMuted: '#818181',
    accent: '#FF00A1',
    accentSecondary: '#E86223',
    hover: '#E86223',
    border: '#d6d6d6',
    borderDark: '#282828'
  };

  // Determine which data to use - portfolioData content or mockData fallback
  const displayData = portfolioData
    ? (portfolioData.content || portfolioData)
    : mockData;

  // Debug logging
  console.log('Chic Preview - Data Status:', {
    hasPortfolioData: !!portfolioData,
    hasContent: !!portfolioData?.content,
    usingMockData: !portfolioData,
    pdfMode
  });

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: chicColors.background
    }}>
      {/* Preview Header - Hidden in PDF mode */}
      {!pdfMode && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: chicColors.surface,
          color: chicColors.text,
          padding: '20px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 1000,
          borderBottom: `1px solid ${chicColors.border}`,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '13px',
            fontWeight: 500,
            color: chicColors.text,
            textTransform: 'uppercase',
            letterSpacing: '-0.6px'
          }}>
            CHIC
          </div>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '11px',
            color: chicColors.textMuted,
            textTransform: 'uppercase',
            letterSpacing: '0.3px'
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
              fontSize: '11px',
              color: chicColors.text,
              backgroundColor: 'transparent',
              border: `1px solid ${chicColors.border}`,
              padding: '10px 20px',
              textTransform: 'uppercase',
              letterSpacing: '0.3px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = chicColors.text;
              e.target.style.color = chicColors.surface;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = chicColors.text;
            }}
          >
            ← BACK
          </button>

          <button
            onClick={handleUseTemplate}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '11px',
              fontWeight: 500,
              color: chicColors.surface,
              backgroundColor: chicColors.text,
              border: `1px solid ${chicColors.text}`,
              padding: '10px 30px',
              textTransform: 'uppercase',
              letterSpacing: '0.3px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = chicColors.hover;
              e.target.style.borderColor = chicColors.hover;
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = chicColors.text;
              e.target.style.borderColor = chicColors.text;
              e.target.style.transform = 'translateY(0)';
            }}
          >
            USE THIS TEMPLATE
          </button>
        </div>
        </div>
      )}

      {/* Template Content with margin for fixed header (no margin in PDF mode) */}
      <div style={{ marginTop: pdfMode ? '0' : '80px' }}>
        <ChicTemplate
          content={displayData}
          styling={{
            colors: chicColors,
            fonts: {
              inter: '"Inter", -apple-system, system-ui, sans-serif',
              heading: '"Inter", -apple-system, system-ui, sans-serif',
              body: '"Inter", -apple-system, system-ui, sans-serif'
            }
          }}
          isEditing={false}
          onContentChange={() => {}}
        />
      </div>

      {/* Preview Footer - Hidden in PDF mode */}
      {!pdfMode && (
        <div style={{
        backgroundColor: chicColors.surface,
        color: chicColors.text,
        padding: '40px',
        textAlign: 'center',
        borderTop: `1px solid ${chicColors.border}`
      }}>
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '13px',
          marginBottom: '10px',
          fontWeight: 500,
          color: chicColors.text,
          textTransform: 'uppercase',
          letterSpacing: '-0.6px'
        }}>
          This is a preview of the CHIC template
        </div>
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '11px',
          color: chicColors.textMuted,
          textTransform: 'uppercase',
          letterSpacing: '0.3px'
        }}>
          Editorial / Magazine Portfolio Layout
        </div>
        </div>
      )}
    </div>
  );
};

export default ChicPreviewPage;
