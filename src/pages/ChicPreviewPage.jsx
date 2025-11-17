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
          description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
          detailedDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          image: '/mockDataImage/1.jpg',
          category: 'Brand Identity',
          year: '2024',
          awards: '',
          link: ''
        },
        {
          id: 'project-2',
          title: 'PROJECT TWO',
          subtitle: 'Visual Design',
          description: 'Sed ut perspiciatis unde omnis iste natus error.',
          detailedDescription: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.\n\nNemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
          image: '/mockDataImage/2.jpg',
          category: 'Editorial',
          year: '2024',
          awards: '',
          link: ''
        },
        {
          id: 'project-3',
          title: 'PROJECT THREE',
          subtitle: 'Art Direction',
          description: 'Neque porro quisquam est qui dolorem ipsum.',
          detailedDescription: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.\n\nUt enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.',
          image: '/mockDataImage/5.jpg',
          category: 'Digital',
          year: '2023',
          awards: '',
          link: ''
        },
        {
          id: 'project-4',
          title: 'PROJECT FOUR',
          subtitle: 'Brand Strategy',
          description: 'At vero eos et accusamus et iusto odio dignissimos.',
          detailedDescription: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.\n\nSimilique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
          image: '/mockDataImage/6.jpg',
          category: 'Branding',
          year: '2023',
          awards: '',
          link: ''
        },
        {
          id: 'project-5',
          title: 'PROJECT FIVE',
          subtitle: 'Design System',
          description: 'Nam libero tempore cum soluta nobis est eligendi.',
          detailedDescription: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.\n\nTemporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.',
          image: '/mockDataImage/7.jpg',
          category: 'UX/UI',
          year: '2024',
          awards: '',
          link: ''
        },
        {
          id: 'project-6',
          title: 'PROJECT SIX',
          subtitle: 'Print Design',
          description: 'Itaque earum rerum hic tenetur a sapiente delectus.',
          detailedDescription: 'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.',
          image: '/mockDataImage/8.jpg',
          category: 'Print',
          year: '2023',
          awards: '',
          link: ''
        },
        {
          id: 'project-7',
          title: 'PROJECT SEVEN',
          subtitle: 'Typography',
          description: 'Nemo enim ipsam voluptatem quia voluptas sit.',
          detailedDescription: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt neque porro quisquam est.\n\nQui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
          image: '/mockDataImage/9.jpg',
          category: 'Typography',
          year: '2024',
          awards: '',
          link: ''
        },
        {
          id: 'project-8',
          title: 'PROJECT EIGHT',
          subtitle: 'Motion Design',
          description: 'Ut enim ad minima veniam quis nostrum exercitationem.',
          detailedDescription: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse.\n\nQuam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. At vero eos et accusamus et iusto odio dignissimos ducimus.',
          image: '/mockDataImage/10.jpg',
          category: 'Motion',
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
            onClick={() => window.history.back()}
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
