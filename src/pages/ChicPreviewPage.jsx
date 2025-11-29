import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ChicTemplate from '../templates/Chic/ChicTemplate';
import useAuthStore from '../stores/authStore';
import usePortfolioStore from '../stores/portfolioStore';
import { portfolioApi } from '../lib/portfolioApi';
import { getTemplate } from '../templates';

const ChicPreviewPage = () => {
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
      navigate('/signup?return=/template-preview/chic');
      return;
    }

    setIsCreating(true);
    try {
      const template = getTemplate('chic');
      if (!template) {
        throw new Error('Chic template not found');
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
          id: 'project-1',
          title: 'PROJECT ONE',
          subtitle: 'Creative Direction',
          description: 'A comprehensive brand identity project showcasing strategic visual design.',
          detailedDescription: 'A comprehensive brand identity project that demonstrates the power of strategic visual design and thoughtful creative direction. This project explores the intersection of modern aesthetics and timeless design principles.\n\nThe work encompasses brand strategy, visual identity development, and complete design system implementation. Each element was carefully crafted to create a cohesive and impactful brand presence.',
          image: '/portfolios/1.png',
          category: 'Brand Identity',
          year: '2024',
          awards: '',
          link: ''
        },
        {
          id: 'project-2',
          title: 'PROJECT TWO',
          subtitle: 'Visual Design',
          description: 'An exploration of contemporary visual language in editorial design.',
          detailedDescription: 'An exploration of contemporary visual language that pushes the boundaries of editorial design. This project investigates new approaches to typography, layout, and visual storytelling.\n\nThrough careful attention to detail and innovative composition techniques, the work creates engaging visual narratives that captivate audiences and enhance the reading experience.',
          image: '/portfolios/2.png',
          category: 'Editorial',
          year: '2024',
          awards: '',
          link: ''
        },
        {
          id: 'project-3',
          title: 'PROJECT THREE',
          subtitle: 'Art Direction',
          description: 'Bold art direction combining photography and graphic design elements.',
          detailedDescription: 'Bold art direction that seamlessly combines photography, illustration, and graphic design elements into a unified visual language. The project demonstrates mastery of composition, color theory, and visual hierarchy.\n\nEach design decision was made with intention, creating a powerful and memorable aesthetic that resonates with audiences and communicates complex ideas through visual means.',
          image: '/portfolios/3.png',
          category: 'Digital',
          year: '2024',
          awards: '',
          link: ''
        },
        {
          id: 'project-4',
          title: 'PROJECT FOUR',
          subtitle: 'Brand Strategy',
          description: 'Strategic branding work focused on market positioning and visual identity.',
          detailedDescription: 'Strategic branding work that focuses on precise market positioning and distinctive visual identity development. This project showcases the integration of research, strategy, and creative execution.\n\nThe comprehensive approach includes competitive analysis, brand positioning, messaging strategy, and complete visual identity system designed to create lasting brand equity.',
          image: '/portfolios/4.png',
          category: 'Branding',
          year: '2023',
          awards: '',
          link: ''
        },
        {
          id: 'project-5',
          title: 'PROJECT FIVE',
          subtitle: 'Design System',
          description: 'Comprehensive design system for digital product development.',
          detailedDescription: 'A comprehensive design system built to scale across multiple digital products and platforms. The system establishes clear design principles, reusable components, and consistent patterns.\n\nThis work streamlines the design and development process while ensuring visual consistency and exceptional user experience across all touchpoints.',
          image: '/portfolios/5.jpg',
          category: 'UX/UI',
          year: '2024',
          awards: '',
          link: ''
        },
        {
          id: 'project-6',
          title: 'PROJECT SIX',
          subtitle: 'Print Design',
          description: 'Elegant print design exploring tactile materials and production techniques.',
          detailedDescription: 'Elegant print design work that explores the intersection of tactile materials, specialized production techniques, and refined aesthetics. The project celebrates the craft of print design.\n\nThrough careful material selection, attention to typography, and innovative finishing techniques, the work creates memorable physical experiences that engage multiple senses.',
          image: '/portfolios/6.jpg',
          category: 'Print',
          year: '2023',
          awards: '',
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
        <div className="px-4 py-3 md:px-8 md:py-5" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: chicColors.surface,
          color: chicColors.text,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 1000,
          borderBottom: `1px solid ${chicColors.border}`,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
        <div className="flex items-center gap-2 md:gap-5">
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(12px, 3vw, 13px)',
            fontWeight: 500,
            color: chicColors.text,
            textTransform: 'uppercase',
            letterSpacing: '-0.6px'
          }}>
            CHIC
          </div>
          <div className="hidden sm:block" style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(9px, 2vw, 11px)',
            color: chicColors.textMuted,
            textTransform: 'uppercase',
            letterSpacing: '0.3px'
          }}>
            Template Preview
          </div>
        </div>

        <div className="flex gap-2 md:gap-4 items-center">
          <button
            onClick={() => navigate('/templates')}
            className="px-3 py-2 md:px-5 md:py-2.5 text-xs md:text-sm"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: chicColors.text,
              backgroundColor: 'transparent',
              border: `1px solid ${chicColors.border}`,
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
            <span className="hidden sm:inline">← </span>BACK
          </button>

          <button
            onClick={handleUseTemplate}
            className="px-4 py-2 md:px-6 md:py-2.5 text-xs md:text-sm whitespace-nowrap"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              color: chicColors.surface,
              backgroundColor: chicColors.text,
              border: `1px solid ${chicColors.text}`,
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
            <span className="hidden md:inline">USE THIS </span>TEMPLATE
          </button>
        </div>
        </div>
      )}

      {/* Template Content with margin for fixed header (no margin in PDF mode) */}
      <div className={pdfMode ? '' : 'mt-14 md:mt-20'}>
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
              borderRadius: '8px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              animation: 'slideUp 0.3s ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '30px 40px',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>
                <div>
                  <h2 style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '28px',
                    fontWeight: 600,
                    color: '#1a1a1a',
                    margin: 0,
                    marginBottom: '10px'
                  }}>
                    {selectedProject.title}
                  </h2>
                  <p style={{
                    fontFamily: "'Inter', sans-serif",
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
                    color: '#999999',
                    cursor: 'pointer',
                    padding: '0',
                    lineHeight: '1'
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
              {selectedProject.image && (
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    marginBottom: '30px'
                  }}
                />
              )}
              <div style={{
                fontFamily: "'Inter', sans-serif",
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
              borderTop: '1px solid #e5e7eb',
              textAlign: 'right'
            }}>
              <button
                onClick={handleCloseModal}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '14px',
                  padding: '12px 24px',
                  backgroundColor: '#1a1a1a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
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
