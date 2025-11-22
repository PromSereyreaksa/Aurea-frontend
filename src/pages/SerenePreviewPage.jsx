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
      title: 'Lorem ipsum dolor sit amet consectetur adipiscing elit',
      description1: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      description2: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },
    gallery: {
      heroText1: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      heroText2: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.',
      firstRow: [
        {
          id: 'project-1',
          image: '/portfolios/10.jpg',
          title: 'Project One',
          description: 'Creative design showcase',
          detailedDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          span: 2
        },
        {
          id: 'project-2',
          image: '/portfolios/12.jpg',
          title: 'Project Two',
          description: 'Innovative visual concept',
          detailedDescription: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.\n\nNemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
          span: 1
        },
        {
          id: 'project-3',
          image: '/portfolios/13.jpg',
          title: 'Project Three',
          description: 'Modern artistic approach',
          detailedDescription: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.\n\nUt enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.',
          span: 2
        }
      ],
      secondRow: [
        {
          id: 'project-4',
          image: '/portfolios/4.png',
          title: 'Project Four',
          description: 'Contemporary design study',
          detailedDescription: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.\n\nSimilique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
          span: 2
        },
        {
          id: 'project-5',
          image: '/portfolios/5.jpg',
          title: 'Project Five',
          description: 'Elegant composition work',
          detailedDescription: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.\n\nTemporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.',
          span: 3
        },
        {
          id: 'project-6',
          image: '/portfolios/6.jpg',
          title: 'Project Six',
          description: 'Minimalist aesthetic vision',
          detailedDescription: 'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Sed ut perspiciatis unde omnis iste natus error.\n\nVoluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
          span: 2
        },
        {
          id: 'project-7',
          image: '/portfolios/7.jpg',
          title: 'Project Seven',
          description: 'Bold creative expression',
          detailedDescription: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt neque porro quisquam est.\n\nQui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
          span: 2
        }
      ],
      thirdRow: [
        {
          id: 'project-8',
          image: '/portfolios/8.jpg',
          title: 'Project Eight',
          description: 'Strategic visual design',
          detailedDescription: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse.\n\nQuam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. At vero eos et accusamus et iusto odio dignissimos ducimus.',
          span: 2
        },
        {
          id: 'project-9',
          image: '/portfolios/9.jpg',
          title: 'Project Nine',
          description: 'Refined artistic detail',
          detailedDescription: 'Qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi.\n\nId est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio.',
          span: 2
        },
        {
          id: 'project-10',
          image: '/portfolios/10.jpg',
          title: 'Project Ten',
          description: 'Sophisticated visual narrative',
          detailedDescription: 'Cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus.\n\nSaepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur.',
          span: 1
        }
      ]
    },
    about: {
      bio1: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      tagline: ' Ut enim ad minim veniam quis nostrud.',
      bio2: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      bio3: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto.'
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