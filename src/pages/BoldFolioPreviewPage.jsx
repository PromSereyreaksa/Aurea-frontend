import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import BoldFolioTemplate from '../templates/BoldFolio/BoldFolioTemplate';
import useAuthStore from '../stores/authStore';
import usePortfolioStore from '../stores/portfolioStore';
import { portfolioApi } from '../lib/portfolioApi';
import { getTemplate } from '../templates';

const BoldFolioPreviewPage = () => {
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

  // State for View Details modal
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

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
      navigate('/signup?return=/template-preview/boldfolio');
      return;
    }

    setIsCreating(true);
    try {
      const template = getTemplate('boldfolio');
      if (!template) {
        throw new Error('BoldFolio template not found');
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
          id: 'project-1',
          title: 'Alpine Vision',
          description: 'Lorem ipsum dolor sit amet<br />consectetur adipiscing elit<br />sed do eiusmod tempor<br />incididunt ut labore.',
          detailedDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          images: [
            {
              width: '580px',
              height: '380px',
              src: '/portfolios/1.png'
            },
            {
              width: '450px',
              height: '280px',
              src: '/portfolios/2.png'
            }
          ],
          logo: '<span style="font-size: 60px; letter-spacing: 8px; font-weight: 700;">ALPINE</span>',
          link: ''
        },
        {
          id: 'project-2',
          title: 'Creative Studio',
          description: 'Sed ut perspiciatis unde<br />omnis iste natus error sit<br />voluptatem accusantium<br />doloremque laudantium.',
          detailedDescription: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.\n\nNemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt neque porro quisquam est.',
          images: [
            {
              width: '250px',
              height: '280px',
              src: '/portfolios/3.png'
            },
            {
              width: '580px',
              height: '380px',
              src: '/portfolios/4.png'
            }
          ],
          logo: '',
          link: ''
        },
        {
          id: 'project-3',
          title: 'Modern Elegance',
          description: 'Neque porro quisquam est<br />qui dolorem ipsum quia<br />dolor sit amet consectetur<br />adipisci velit.',
          detailedDescription: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.\n\nUt enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.',
          images: [
            {
              width: '250px',
              height: '280px',
              src: '/portfolios/5.jpg'
            },
            {
              width: '500px',
              height: '500px',
              src: '/portfolios/6.jpg'
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
        <div className="px-4 py-3 md:px-8 md:py-5" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: boldFolioColors.background,
          color: boldFolioColors.text,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 1000,
          borderBottom: '1px solid #E5E5E5',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
        <div className="flex items-center gap-2 md:gap-5">
          <div style={{
            fontFamily: 'Graphik, sans-serif',
            fontSize: 'clamp(14px, 4vw, 20px)',
            fontWeight: 700,
            color: boldFolioColors.primary
          }}>
            BOLDFOLIO
          </div>
          <div className="hidden sm:block" style={{
            fontFamily: 'Graphik, sans-serif',
            fontSize: 'clamp(10px, 2vw, 12px)',
            color: boldFolioColors.textSecondary,
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            Template Preview
          </div>
        </div>

        <div className="flex gap-2 md:gap-4 items-center">
          <button
            onClick={() => navigate('/templates')}
            className="px-3 py-2 md:px-5 md:py-2.5 text-xs md:text-sm"
            style={{
              fontFamily: 'Graphik, sans-serif',
              color: boldFolioColors.text,
              backgroundColor: 'transparent',
              border: '1px solid #E5E5E5',
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
            <span className="hidden sm:inline">← </span>BACK
          </button>

          <button
            onClick={handleUseTemplate}
            className="px-4 py-2 md:px-6 md:py-2.5 text-xs md:text-sm whitespace-nowrap"
            style={{
              fontFamily: 'Graphik, sans-serif',
              fontWeight: 700,
              color: boldFolioColors.background,
              backgroundColor: boldFolioColors.primary,
              border: `1px solid ${boldFolioColors.primary}`,
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
            <span className="hidden md:inline">USE THIS </span>TEMPLATE
          </button>
        </div>
        </div>
      )}

      {/* Template Content with margin for fixed header (no margin in PDF mode) */}
      <div className={pdfMode ? '' : 'mt-14 md:mt-20'}>
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
          isPreview={true}
          onContentChange={() => {}}
          onViewDetails={handleViewDetails}
        />
      </div>

      {/* View Details Modal */}
      {showModal && selectedProject && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            animation: 'fadeIn 0.3s ease'
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              borderRadius: '0',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              animation: 'slideUp 0.3s ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '30px 40px',
              borderBottom: '2px solid #000000'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>
                <div>
                  <h2 style={{
                    fontFamily: 'Graphik, sans-serif',
                    fontSize: '32px',
                    fontWeight: 700,
                    color: '#000000',
                    margin: 0,
                    marginBottom: '10px',
                    textTransform: 'uppercase'
                  }}>
                    {selectedProject.title}
                  </h2>
                  <p style={{
                    fontFamily: 'Graphik, sans-serif',
                    fontSize: '14px',
                    color: '#666666',
                    margin: 0
                  }}>
                    {selectedProject.description}
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '32px',
                    color: '#000000',
                    cursor: 'pointer',
                    padding: '0',
                    lineHeight: '1',
                    fontWeight: 300
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div style={{
              padding: '40px'
            }}>
              {selectedProject.images?.[0]?.src && (
                <img
                  src={selectedProject.images[0].src}
                  alt={selectedProject.title}
                  style={{
                    width: '100%',
                    height: 'auto',
                    marginBottom: '30px'
                  }}
                />
              )}
              <div style={{
                fontFamily: 'Graphik, sans-serif',
                fontSize: '16px',
                lineHeight: '1.8',
                color: '#333333',
                whiteSpace: 'pre-line'
              }}>
                {selectedProject.detailedDescription}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '20px 40px',
              borderTop: '2px solid #000000',
              textAlign: 'right'
            }}>
              <button
                onClick={handleCloseModal}
                style={{
                  fontFamily: 'Graphik, sans-serif',
                  fontSize: '14px',
                  padding: '14px 28px',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 700
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

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
