import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import EchelonTemplate from '../templates/Echelon/EchelonTemplate';
import useAuthStore from '../stores/authStore';
import usePortfolioStore from '../stores/portfolioStore';
import { portfolioApi } from '../lib/portfolioApi';
import { getTemplate } from '../templates';

const EchelonPreviewPage = () => {
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
      // If not logged in, redirect to signup with return URL to preview page
      navigate('/signup?return=/template-preview/echelon');
      return;
    }

    // If logged in, create the portfolio directly
    setIsCreating(true);
    try {
      // Get the Echelon template
      const template = getTemplate('echolon');

      if (!template) {
        throw new Error('Echelon template not found');
      }

      const initialPortfolioData = {
        title: `${template.name} Portfolio`,
        description: `Portfolio created with ${template.name} template`,
        template: template.id,
        sections: [],
        styling: template.styling || {},
        published: false,
      };

      console.log('Creating portfolio with template:', template.id);
      const result = await createPortfolio(initialPortfolioData);

      if (result && result.success && result.portfolio?._id) {
        toast.success('Template selected! Redirecting to setup...', {
          duration: 2000,
          id: 'template-selected'
        });

        // Navigate directly to the portfolio builder with the setup step
        navigate(`/portfolio-builder/${result.portfolio._id}?setup=true`, { replace: true });
      } else {
        const errorMsg = result?.error || 'Failed to create portfolio';
        throw new Error(errorMsg);
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
        backgroundColor: '#FFFFFF'
      }}>
        <div style={{
          fontFamily: '"IBM Plex Mono", monospace',
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

  // Mock data for the Echelon template preview
  const mockData = {
    hero: {
      title: 'DESIGNING WITH PRECISION',
      subtitle: 'Crafting experiences through minimalism, clarity, and Swiss design principles'
    },
    about: {
      name: 'ALEXANDER MÜLLER',
      role: 'CREATIVE DIRECTOR / DESIGNER',
      image: '/mockDataImage/bai.webp',
      bio: 'I am a designer focused on minimalism, clarity, and modernist design systems. My work emphasizes grid-based layouts, precise typography, and functional design solutions that prioritize clarity and usability above all else. With over 10 years of experience, I bring Swiss precision to every project.'
    },
    work: {
      heading: 'SELECTED WORK',
      projects: [
        {
          id: 1,
          title: 'LOGO DESIGN PROCESS',
          description: 'A comprehensive case study exploring my logo design process from research to delivery. Showcasing 8 years of experience in graphic design.',
          image: '/case-study/mihai/pic1.jpg',
          meta: '2025 — BRANDING / IDENTITY',
          category: 'branding',
          caseStudyUrl: '/case-study/logo-design-process'
        }
      ]
    },
    gallery: {
      heading: 'VISUAL GALLERY',
      images: [
        { id: 1, src: '/mockDataImage/10.jpg', caption: 'Minimalist composition', meta: '01' },
        { id: 2, src: '/mockDataImage/11.jpg', caption: 'Grid-based layout', meta: '02' },
        { id: 3, src: '/mockDataImage/12.jpg', caption: 'Typography study', meta: '03' },
        { id: 4, src: '/mockDataImage/13.jpg', caption: 'Color exploration', meta: '04' },
        { id: 5, src: '/mockDataImage/14.jpg', caption: 'Swiss precision', meta: '05' },
        { id: 6, src: '/mockDataImage/2.jpg', caption: 'Brand identity', meta: '06' }
      ]
    },
    contact: {
      heading: "LET'S WORK TOGETHER",
      subheading: 'Ready to create something extraordinary?',
      email: 'hello@alexandermuller.com',
      phone: '+41 (0) 79 123 4567',
      address: 'Zürich, Switzerland',
      availability: 'Available for new projects',
      social: {
        linkedin: 'https://linkedin.com/in/alexandermuller',
        twitter: 'https://twitter.com/alexmuller',
        instagram: 'https://instagram.com/alexmuller',
        behance: 'https://behance.net/alexandermuller',
        dribbble: 'https://dribbble.com/alexandermuller'
      }
    }
  };

  // Determine which data to use - portfolioData content or mockData fallback
  // Handle both formats: portfolio.content or direct portfolio data
  const displayData = portfolioData
    ? (portfolioData.content || portfolioData)
    : mockData;

  // Debug logging
  console.log('Echelon Preview - Data Status:', {
    hasPortfolioData: !!portfolioData,
    hasContent: !!portfolioData?.content,
    usingMockData: !portfolioData,
    pdfMode
  });

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#FFFFFF'
    }}>
      {/* Preview Header - Hidden in PDF mode */}
      {!pdfMode && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: '#FFFFFF',
          color: '#000000',
          padding: '20px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 1000,
          borderBottom: '2px solid #FF6B35',
          boxShadow: '0 2px 12px rgba(255, 107, 53, 0.15)'
        }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: '20px',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            color: '#000000'
          }}>
            ECHELON
          </div>
          <div style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '12px',
            color: '#FF6B35',
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
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '13px',
              color: '#000000',
              backgroundColor: 'transparent',
              border: '2px solid #000000',
              padding: '10px 20px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              borderRadius: '4px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#000000';
              e.target.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#000000';
            }}
          >
            ← BACK
          </button>
          
          <button
            onClick={handleUseTemplate}
            disabled={isCreating}
            style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '13px',
              fontWeight: 700,
              color: '#FFFFFF',
              backgroundColor: isCreating ? '#999999' : '#FF6B35',
              border: `2px solid ${isCreating ? '#999999' : '#FF6B35'}`,
              padding: '10px 30px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: isCreating ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              borderRadius: '4px',
              opacity: isCreating ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!isCreating) {
                e.target.style.backgroundColor = '#E55A2B';
                e.target.style.borderColor = '#E55A2B';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isCreating) {
                e.target.style.backgroundColor = '#FF6B35';
                e.target.style.borderColor = '#FF6B35';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            {isCreating ? 'CREATING...' : 'USE THIS TEMPLATE'}
          </button>
        </div>
        </div>
      )}

      {/* Template Content with margin for fixed header (no margin in PDF mode) */}
      <div style={{ marginTop: pdfMode ? '0' : '80px' }}>
        <EchelonTemplate
          content={displayData}
          isEditing={false}
          onContentChange={() => {}}
        />
      </div>

      {/* Preview Footer - Hidden in PDF mode */}
      {!pdfMode && (
        <div style={{
        backgroundColor: '#F8F8F8',
        color: '#000000',
        padding: '40px',
        textAlign: 'center',
        borderTop: '2px solid #FF6B35'
      }}>
        <div style={{
          fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
          fontSize: '16px',
          marginBottom: '15px',
          fontWeight: 600
        }}>
          This is a preview of the ECHELON template
        </div>
        <div style={{
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: '12px',
          color: '#999999',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          Swiss Design / International Typographic Style
        </div>
        </div>
      )}
    </div>
  );
};

export default EchelonPreviewPage;
