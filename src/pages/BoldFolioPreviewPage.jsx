import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BoldFolioTemplate from '../templates/BoldFolio/BoldFolioTemplate';
import useAuthStore from '../stores/authStore';
import { portfolioApi } from '../lib/portfolioApi';

const BoldFolioPreviewPage = () => {
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
      navigate('/portfolio-builder/new?template=boldfolio');
    } else {
      // If not logged in, redirect to signup with return URL
      navigate('/signup?return=/portfolio-builder/new&template=boldfolio');
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
          fontFamily: 'Graphik, sans-serif',
          fontSize: '14px',
          color: '#666666',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          Loading portfolio...
        </div>
      </div>
    );
  }

  // Mock data for the BoldFolio template preview
  const mockData = {
    hero: {
      title: 'Driven by passion—and<br />fuelled by curiosity.',
      subtitle: 'Designer and art-director<br />based in Montreal, Quebec.',
      description: 'Think of design as a way<br />to transform problems into<br />empowering opportunities<br />and create appealing visuals<br />that connect with people.',
      cta: 'Open for collaborations!'
    },
    work: {
      projects: [
        {
          title: 'Ice Peak',
          description: 'A flexible design identity that<br />strengthens the overall image of<br />Ice Peak, an adventure company<br />focused on alpinism.',
          images: [
            {
              width: '580px',
              height: '380px',
              src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop'
            },
            {
              width: '450px',
              height: '280px',
              src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&h=600&fit=crop'
            }
          ],
          logo: '<span style="font-size: 60px; letter-spacing: 8px; font-weight: 700;">ICE PEAK</span>',
          link: ''
        },
        {
          title: 'The Recreationist',
          description: 'Brand identity and<br />creative campaign for The<br />Recreationist, an online<br />boutique that sells<br />independent designers and<br />global goods for summer<br />vacations by the sea.',
          images: [
            {
              width: '250px',
              height: '280px',
              src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=700&fit=crop'
            },
            {
              width: '580px',
              height: '380px',
              src: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=1200&h=800&fit=crop'
            }
          ],
          logo: '',
          link: ''
        },
        {
          title: 'Hyperloop',
          description: 'Identity and store for a brand<br />selling minimalistic jewelry.',
          images: [
            {
              width: '250px',
              height: '280px',
              src: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=700&fit=crop'
            },
            {
              width: '500px',
              height: '500px',
              src: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1000&h=1000&fit=crop'
            }
          ],
          logo: '',
          link: ''
        }
      ]
    },
    about: {
      heading: 'About',
      name: 'Alex Rivera',
      role: 'Designer & Art Director',
      bio: 'I believe in design as a transformative force that turns problems into empowering opportunities. My work focuses on creating appealing visuals that connect with people on a deeper level.',
      location: 'Montreal, Quebec',
      email: 'hello@alexrivera.com'
    },
    contact: {
      heading: "Let's Work Together",
      text: 'Have a project in mind? Let\'s create something amazing together.',
      email: 'hello@alexrivera.com',
      social: {
        instagram: 'https://instagram.com/alexrivera',
        linkedin: 'https://linkedin.com/in/alexrivera',
        behance: 'https://behance.net/alexrivera'
      }
    }
  };

  // BoldFolio template styling
  const boldFolioColors = {
    primary: '#ff0080',
    secondary: '#000000',
    accent: '#ff0080',
    background: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666'
  };

  // Determine which data to use - portfolioData content or mockData fallback
  const displayData = portfolioData
    ? (portfolioData.content || portfolioData)
    : mockData;

  // Debug logging
  console.log('BoldFolio Preview - Data Status:', {
    hasPortfolioData: !!portfolioData,
    hasContent: !!portfolioData?.content,
    usingMockData: !portfolioData,
    pdfMode
  });

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: boldFolioColors.background
    }}>
      {/* Preview Header - Hidden in PDF mode */}
      {!pdfMode && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: boldFolioColors.background,
          color: boldFolioColors.text,
          padding: '20px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 1000,
          borderBottom: '1px solid #E5E5E5',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            fontFamily: 'Graphik, sans-serif',
            fontSize: '20px',
            fontWeight: 700,
            color: boldFolioColors.primary
          }}>
            BOLDFOLIO
          </div>
          <div style={{
            fontFamily: 'Graphik, sans-serif',
            fontSize: '12px',
            color: boldFolioColors.textSecondary,
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
              fontFamily: 'Graphik, sans-serif',
              fontSize: '13px',
              color: boldFolioColors.text,
              backgroundColor: 'transparent',
              border: '1px solid #E5E5E5',
              padding: '10px 20px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              borderRadius: '4px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = boldFolioColors.text;
              e.target.style.color = boldFolioColors.background;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = boldFolioColors.text;
            }}
          >
            ← BACK
          </button>

          <button
            onClick={handleUseTemplate}
            style={{
              fontFamily: 'Graphik, sans-serif',
              fontSize: '13px',
              fontWeight: 700,
              color: boldFolioColors.background,
              backgroundColor: boldFolioColors.primary,
              border: `1px solid ${boldFolioColors.primary}`,
              padding: '10px 30px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              borderRadius: '4px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#e60073';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(255, 0, 128, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = boldFolioColors.primary;
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
        <BoldFolioTemplate
          content={displayData}
          styling={{
            colors: boldFolioColors,
            fonts: {
              heading: 'Graphik, sans-serif',
              body: 'Graphik, sans-serif'
            }
          }}
          isEditing={false}
          onContentChange={() => {}}
        />
      </div>

      {/* Preview Footer - Hidden in PDF mode */}
      {!pdfMode && (
        <div style={{
        backgroundColor: boldFolioColors.background,
        color: boldFolioColors.text,
        padding: '40px',
        textAlign: 'center',
        borderTop: '1px solid #E5E5E5'
      }}>
        <div style={{
          fontFamily: 'Graphik, sans-serif',
          fontSize: '18px',
          marginBottom: '10px',
          fontWeight: 700,
          color: boldFolioColors.primary
        }}>
          This is a preview of the BOLDFOLIO template
        </div>
        <div style={{
          fontFamily: 'Graphik, sans-serif',
          fontSize: '12px',
          color: boldFolioColors.textSecondary,
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          Bold Creative Portfolio with Vibrant Accents
        </div>
        </div>
      )}
    </div>
  );
};

export default BoldFolioPreviewPage;
