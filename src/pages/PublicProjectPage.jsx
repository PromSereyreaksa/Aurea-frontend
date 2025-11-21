/**
 * Public Project Page
 *
 * Displays project/case study details for published portfolios
 * Fetches data from the public API endpoint - no authentication required
 * Works for all templates: Echelon, Serene, Chic, BoldFolio
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PublicProjectPage = () => {
  const { portfolioId, projectId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [project, setProject] = useState(null);
  const [caseStudy, setCaseStudy] = useState(null);

  useEffect(() => {
    fetchProjectData();
  }, [portfolioId, projectId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://aurea-backend-production-8a87.up.railway.app';
      const response = await fetch(
        `${apiBase}/api/sites/${portfolioId}/project/${projectId}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          setError('Project not found or portfolio is not published');
        } else {
          setError('Failed to load project');
        }
        return;
      }

      const data = await response.json();

      if (data.success && data.data) {
        setPortfolio(data.data.portfolio);
        setProject(data.data.project);
        setCaseStudy(data.data.caseStudy || null);
      } else {
        setError('Project not found');
      }
    } catch (err) {
      console.error('Error fetching project:', err);
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  // Get template-specific styles
  const getTemplateStyles = () => {
    const template = portfolio?.template || 'echelon';

    switch (template) {
      case 'serene':
        return {
          fontFamily: '"Inter", sans-serif',
          accentColor: '#4a5568',
          backgroundColor: '#ffffff',
          headerBg: '#4a5568'
        };
      case 'chic':
        return {
          fontFamily: '"Helvetica Neue", sans-serif',
          accentColor: '#000000',
          backgroundColor: '#ffffff',
          headerBg: '#000000'
        };
      case 'boldfolio':
        return {
          fontFamily: 'Graphik, sans-serif',
          accentColor: '#ec4899',
          backgroundColor: '#ffffff',
          headerBg: '#ec4899'
        };
      case 'echelon':
      default:
        return {
          fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
          accentColor: '#FF0000',
          backgroundColor: '#ffffff',
          headerBg: '#000000'
        };
    }
  };

  // Loading state
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff'
      }}>
        <div style={{
          textAlign: 'center'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e5e5e5',
            borderTopColor: '#000000',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '12px',
            color: '#666666',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            Loading project...
          </p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Error state
  if (error || !project) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '400px',
          textAlign: 'center',
          backgroundColor: '#ffffff',
          padding: '48px',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#f5f5f5',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <h1 style={{
            fontFamily: '"Helvetica Neue", sans-serif',
            fontSize: '24px',
            fontWeight: 700,
            marginBottom: '12px',
            color: '#000000'
          }}>
            Project Not Found
          </h1>
          <p style={{
            fontFamily: '"Helvetica Neue", sans-serif',
            fontSize: '14px',
            color: '#666666',
            marginBottom: '24px'
          }}>
            {error || "The project you're looking for doesn't exist or the portfolio is not published."}
          </p>
          <button
            onClick={() => navigate(-1)}
            style={{
              fontFamily: '"Helvetica Neue", sans-serif',
              fontSize: '14px',
              padding: '12px 32px',
              backgroundColor: '#000000',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 600
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const styles = getTemplateStyles();

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .project-header {
            padding: 16px 20px !important;
          }
          .project-main {
            padding: 100px 20px 60px !important;
          }
          .project-title {
            font-size: clamp(32px, 8vw, 48px) !important;
          }
          .project-image {
            margin-bottom: 32px !important;
          }
          .project-content {
            font-size: 16px !important;
          }
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        backgroundColor: styles.backgroundColor,
        fontFamily: styles.fontFamily
      }}>
        {/* Header */}
        <header
          className="project-header"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: styles.headerBg,
            padding: '20px 40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '13px',
              color: '#FFFFFF',
              backgroundColor: 'transparent',
              border: '2px solid #FFFFFF',
              padding: '10px 20px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#FFFFFF';
              e.target.style.color = styles.headerBg;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#FFFFFF';
            }}
          >
            ← Back
          </button>

          <div style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '12px',
            color: styles.accentColor === '#000000' ? '#FFFFFF' : styles.accentColor,
            textTransform: 'uppercase',
            letterSpacing: '0.15em'
          }}>
            {portfolio?.title || 'Portfolio'}
          </div>

          <div style={{ width: '100px' }} /> {/* Spacer for centering */}
        </header>

        {/* Main Content */}
        <main
          className="project-main"
          style={{
            paddingTop: '120px',
            paddingBottom: '80px',
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '120px 40px 80px'
          }}
        >
          {/* Category/Meta */}
          {(project.meta || project.category) && (
            <div style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '12px',
              color: styles.accentColor,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              marginBottom: '24px'
            }}>
              {project.meta || project.category}
              {project.year && !project.meta?.includes(project.year) && ` — ${project.year}`}
            </div>
          )}

          {/* Title */}
          <h1
            className="project-title"
            style={{
              fontSize: 'clamp(40px, 8vw, 72px)',
              fontWeight: 900,
              lineHeight: 1,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              margin: 0,
              marginBottom: '32px',
              color: '#000000'
            }}
          >
            {project.title}
          </h1>

          {/* Subtitle (Chic template) */}
          {project.subtitle && (
            <div style={{
              fontSize: '18px',
              color: '#666666',
              marginBottom: '32px',
              fontWeight: 500
            }}>
              {project.subtitle}
            </div>
          )}

          {/* Short Description */}
          {project.description && (
            <p style={{
              fontSize: '20px',
              lineHeight: 1.6,
              color: '#333333',
              marginBottom: '48px',
              maxWidth: '800px'
            }}>
              {project.description}
            </p>
          )}

          {/* Main Image */}
          {project.image && (
            <div
              className="project-image"
              style={{
                width: '100%',
                marginBottom: '48px',
                overflow: 'hidden',
                backgroundColor: '#f5f5f5'
              }}
            >
              <img
                src={project.image}
                alt={project.title}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
              />
            </div>
          )}

          {/* Multiple Images (BoldFolio) */}
          {project.images && project.images.length > 0 && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '24px',
              marginBottom: '48px'
            }}>
              {project.images.map((img, index) => (
                <div
                  key={index}
                  style={{
                    flex: '1 1 300px',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    backgroundColor: '#f5f5f5'
                  }}
                >
                  <img
                    src={img.src || img}
                    alt={`${project.title} - Image ${index + 1}`}
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block'
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Detailed Description */}
          {project.detailedDescription && (
            <div
              className="project-content"
              style={{
                fontSize: '18px',
                lineHeight: 1.8,
                color: '#333333',
                marginBottom: '48px'
              }}
              dangerouslySetInnerHTML={{
                __html: project.detailedDescription.replace(/\n/g, '<br/>')
              }}
            />
          )}

          {/* Case Study Content */}
          {caseStudy && (
            <div style={{ marginTop: '64px' }}>
              {caseStudy.sections?.map((section, index) => (
                <div key={index} style={{ marginBottom: '48px' }}>
                  {section.title && (
                    <h2 style={{
                      fontSize: '28px',
                      fontWeight: 700,
                      marginBottom: '16px',
                      color: '#000000'
                    }}>
                      {section.title}
                    </h2>
                  )}
                  {section.content && (
                    <div
                      style={{
                        fontSize: '18px',
                        lineHeight: 1.8,
                        color: '#333333'
                      }}
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  )}
                  {section.image && (
                    <img
                      src={section.image}
                      alt={section.title || `Section ${index + 1}`}
                      style={{
                        width: '100%',
                        height: 'auto',
                        marginTop: '24px'
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Awards (Chic template) */}
          {project.awards && (
            <div style={{
              marginTop: '48px',
              padding: '24px',
              backgroundColor: '#f5f5f5',
              borderLeft: `4px solid ${styles.accentColor}`
            }}>
              <div style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '11px',
                color: '#666666',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '8px'
              }}>
                Awards
              </div>
              <div style={{
                fontSize: '16px',
                color: '#000000'
              }}>
                {project.awards}
              </div>
            </div>
          )}

          {/* External Link */}
          {project.link && (
            <div style={{ marginTop: '48px' }}>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '14px',
                  color: '#FFFFFF',
                  backgroundColor: styles.accentColor,
                  padding: '14px 28px',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 600,
                  transition: 'opacity 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                View Project
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </a>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer style={{
          padding: '40px',
          borderTop: '1px solid #e5e5e5',
          textAlign: 'center'
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '13px',
              color: '#000000',
              backgroundColor: 'transparent',
              border: '2px solid #000000',
              padding: '14px 32px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              transition: 'all 0.3s ease'
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
            ← Back to Portfolio
          </button>
        </footer>
      </div>
    </>
  );
};

export default PublicProjectPage;
