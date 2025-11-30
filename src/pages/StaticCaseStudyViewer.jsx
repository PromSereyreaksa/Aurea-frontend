import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

/**
 * StaticCaseStudyViewer - Displays case study pages at /:subdomain/case-study/:projectId
 *
 * This component:
 * 1. If static HTML exists: displays it (replaces entire document)
 * 2. If no static HTML: renders case study using React dynamically
 */
const StaticCaseStudyViewer = () => {
  const { subdomain, projectId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [project, setProject] = useState(null);
  const [caseStudy, setCaseStudy] = useState(null);
  const [useReactFallback, setUseReactFallback] = useState(false);

  const fetchAndDisplayHTML = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

      // First, try to get the portfolio site data
      const response = await fetch(`${apiBase}/api/sites/${subdomain}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError('Portfolio not found');
        } else {
          setError('Failed to load case study');
        }
        setLoading(false);
        return;
      }

      const data = await response.json();

      // Check if the portfolio has static case study HTML
      if (data.success && data.data) {
        const portfolioData = data.data;
        setPortfolio(portfolioData);

        // Find the case study in caseStudies array
        const caseStudyData = portfolioData.caseStudies?.find(
          cs => String(cs.projectId) === String(projectId) ||
                String(cs.id) === String(projectId) ||
                String(cs._id) === String(projectId)
        );

        // Find the project in content.work.projects
        const projectData = portfolioData.content?.work?.projects?.find(
          p => String(p.id) === String(projectId)
        );

        if (caseStudyData?.staticHtml) {
          // Replace the entire document with the HTML content
          document.open();
          document.write(caseStudyData.staticHtml);
          document.close();
        } else if (caseStudyData || projectData) {
          // Use React fallback to render dynamically
          setProject(projectData);
          setCaseStudy(caseStudyData);
          setUseReactFallback(true);
          setLoading(false);
        } else {
          setError('Case study not found');
          setLoading(false);
        }
      } else {
        setError('Portfolio not found');
        setLoading(false);
      }

    } catch (err) {
      console.error('Error fetching case study HTML:', err);
      setError('Failed to load case study');
      setLoading(false);
    }
  }, [subdomain, projectId]);

  useEffect(() => {
    fetchAndDisplayHTML();
  }, [fetchAndDisplayHTML]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading case study...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Case Study Not Found
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={() => navigate(`/${subdomain}/html`)}
                className="w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
              >
                Back to Portfolio
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // React fallback rendering (when no static HTML)
  if (useReactFallback && (caseStudy || project)) {
    // Get case study content with fallbacks
    const title = caseStudy?.content?.hero?.title || project?.title || 'Case Study';
    const subtitle = caseStudy?.content?.hero?.subtitle || project?.meta || '';
    const year = caseStudy?.content?.hero?.year || new Date().getFullYear().toString();
    const coverImage = caseStudy?.content?.hero?.coverImage || project?.image || '';
    const overview = caseStudy?.content?.overview?.description || project?.description || '';
    const sections = caseStudy?.content?.sections || [];

    return (
      <>
        <style>{`
          @media (max-width: 640px) {
            .cs-header {
              padding: 16px 20px !important;
              flex-direction: column !important;
              gap: 16px !important;
            }
            .cs-header-back {
              width: 100%;
              text-align: center;
            }
            .cs-header-title {
              font-size: 10px !important;
            }
            .cs-main {
              padding-top: 180px !important;
              padding-bottom: 60px !important;
            }
            .cs-section {
              padding: 0 20px !important;
              margin-bottom: 80px !important;
            }
            .cs-hero-category {
              font-size: 11px !important;
              margin-bottom: 24px !important;
            }
            .cs-hero-title {
              font-size: clamp(36px, 12vw, 60px) !important;
              margin-bottom: 32px !important;
            }
            .cs-hero-intro {
              font-size: 18px !important;
              margin-bottom: 40px !important;
            }
            .cs-section-header {
              flex-direction: column !important;
              gap: 20px !important;
              margin-bottom: 40px !important;
              align-items: flex-start !important;
            }
            .cs-section-num {
              font-size: 60px !important;
            }
            .cs-section-title {
              font-size: 42px !important;
            }
            .cs-2col-grid {
              grid-template-columns: 1fr !important;
              gap: 40px !important;
            }
            .cs-content-box {
              padding: 40px 30px !important;
            }
            .cs-text-lg {
              font-size: 16px !important;
            }
          }
        `}</style>
        <div style={{
          fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
          backgroundColor: '#FFFFFF',
          color: '#000000',
          minHeight: '100vh'
        }}>
          {/* Fixed Header */}
          <header className="cs-header" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: '#000000',
            color: '#FFFFFF',
            padding: '24px 60px',
            zIndex: 1000,
            borderBottom: '3px solid #FF0000',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <button
              className="cs-header-back"
              onClick={() => navigate(`/${subdomain}/html`)}
              style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '13px',
                color: '#FFFFFF',
                backgroundColor: 'transparent',
                border: '2px solid #FFFFFF',
                padding: '12px 24px',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#FFFFFF';
                e.target.style.color = '#000000';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#FFFFFF';
              }}
            >
              ← BACK
            </button>

            <div className="cs-header-title" style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '12px',
              color: '#FF0000',
              textTransform: 'uppercase',
              letterSpacing: '0.15em'
            }}>
              CASE STUDY
            </div>

            <div style={{ width: '100px' }} />
          </header>

          {/* Main Content */}
          <main className="cs-main" style={{ paddingTop: '120px', paddingBottom: '120px' }}>
            {/* Hero Section */}
            <section className="cs-section" style={{
              maxWidth: '1400px',
              margin: '0 auto',
              padding: '0 60px',
              marginBottom: '180px'
            }}>
              {/* Category */}
              <div className="cs-hero-category" style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '14px',
                color: '#FF0000',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                marginBottom: '40px'
              }}>
                {subtitle} {year && `— ${year}`}
              </div>

              {/* Main Title */}
              <h1 className="cs-hero-title" style={{
                fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: 'clamp(60px, 10vw, 140px)',
                fontWeight: 900,
                lineHeight: 0.9,
                textTransform: 'uppercase',
                letterSpacing: '-0.03em',
                margin: 0,
                marginBottom: '60px'
              }}>
                {title}
              </h1>

              {/* Intro Text */}
              {overview && (
                <div className="cs-hero-intro" style={{
                  maxWidth: '900px',
                  fontSize: '24px',
                  lineHeight: 1.6,
                  marginBottom: '80px'
                }}>
                  {overview}
                </div>
              )}

              {/* Hero Image */}
              {coverImage && (
                <div style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  backgroundColor: '#F5F5F5',
                  marginBottom: '40px',
                  overflow: 'hidden'
                }}>
                  <img
                    src={coverImage}
                    alt={title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              )}
            </section>

            {/* Sections */}
            {sections.map((section, index) => (
              <section key={section.id || index} className="cs-section" style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '0 60px',
                marginBottom: '160px'
              }}>
                {/* Section Header */}
                <div className="cs-section-header" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '40px',
                  marginBottom: '80px'
                }}>
                  <div className="cs-section-num" style={{
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: '100px',
                    fontWeight: 900,
                    color: '#FF0000',
                    lineHeight: 1
                  }}>
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h2 className="cs-section-title" style={{
                      fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                      fontSize: '72px',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      margin: 0,
                      lineHeight: 0.9
                    }}>
                      {section.heading}
                    </h2>
                  </div>
                </div>

                {/* Section Content */}
                <div className="cs-2col-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: section.image ? '1fr 1fr' : '1fr',
                  gap: '80px',
                  marginBottom: '80px'
                }}>
                  <div>
                    {section.content && (
                      <div className="cs-text-lg" style={{
                        fontSize: '18px',
                        lineHeight: 1.8,
                        whiteSpace: 'pre-wrap'
                      }}>
                        {section.content}
                      </div>
                    )}
                  </div>

                  {section.image && (
                    <div>
                      <div style={{
                        aspectRatio: '4/3',
                        backgroundColor: '#F5F5F5',
                        overflow: 'hidden'
                      }}>
                        <img
                          src={section.image}
                          alt={section.heading}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Images */}
                {section.images && section.images.length > 0 && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '24px',
                    marginTop: '40px'
                  }}>
                    {section.images.map((img, imgIndex) => (
                      <div key={imgIndex} style={{
                        aspectRatio: '16/9',
                        backgroundColor: '#F5F5F5',
                        overflow: 'hidden'
                      }}>
                        <img
                          src={img}
                          alt={`${section.heading} - Image ${imgIndex + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}

            {/* Back Button */}
            <section className="cs-section" style={{
              maxWidth: '900px',
              margin: '0 auto',
              padding: '0 60px',
              textAlign: 'center'
            }}>
              <button
                onClick={() => navigate(`/${subdomain}/html`)}
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '14px',
                  color: '#000000',
                  backgroundColor: 'transparent',
                  border: '2px solid #000000',
                  padding: '16px 40px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 700,
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
                ← BACK TO PORTFOLIO
              </button>
            </section>
          </main>

          {/* Footer */}
          <footer style={{
            backgroundColor: '#000000',
            color: '#FFFFFF',
            padding: '40px 60px',
            textAlign: 'center',
            borderTop: '3px solid #FF0000'
          }}>
            <div style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.15em'
            }}>
              {portfolio?.title || 'Portfolio'} — Case Study
            </div>
          </footer>

          {/* Powered by Aurea Badge */}
          <div className="fixed bottom-4 right-4 z-50">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-all text-sm"
            >
              <span className="text-gray-600">Made with</span>
              <span className="font-bold text-orange-600">AUREA</span>
            </a>
          </div>
        </div>
      </>
    );
  }

  // This won't actually be shown because document.write replaces everything
  return null;
};

export default StaticCaseStudyViewer;
