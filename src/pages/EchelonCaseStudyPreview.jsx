import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Shared/Breadcrumb';
import { portfolioApi } from '../lib/portfolioApi';
import { caseStudyApi } from '../lib/caseStudyApi';

/**
 * EchelonCaseStudyPreview - Case study preview page for templateEngine to capture
 *
 * This component renders case studies with proper navigation for both:
 * - PDF generation (pdfMode=true)
 * - Regular web viewing (pdfMode=false)
 */
const EchelonCaseStudyPreview = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get params from query string
  const portfolioId = searchParams.get('portfolioId');
  const projectId = searchParams.get('projectId');
  const pdfMode = searchParams.get('pdfMode') === 'true';

  // State
  const [portfolioData, setPortfolioData] = useState(null);
  const [caseStudy, setCaseStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load portfolio and case study data
  useEffect(() => {
    const loadData = async () => {
      // Check if data was injected by Puppeteer (for PDF generation)
      if (window.__PORTFOLIO_DATA__) {
        console.log('✓ Using injected portfolio data');
        setPortfolioData(window.__PORTFOLIO_DATA__);

        // Extract case study from portfolio data
        if (window.__PORTFOLIO_DATA__.caseStudies && window.__PORTFOLIO_DATA__.caseStudies[projectId]) {
          setCaseStudy(window.__PORTFOLIO_DATA__.caseStudies[projectId]);
        }

        setLoading(false);
        return;
      }

      // Otherwise, fetch from API
      if (portfolioId && projectId) {
        setLoading(true);
        try {
          // Fetch portfolio data
          const portfolio = await portfolioApi.getById(portfolioId);
          if (portfolio) {
            setPortfolioData(portfolio);

            // Find the case study in the portfolio
            if (portfolio.caseStudies && portfolio.caseStudies[projectId]) {
              setCaseStudy(portfolio.caseStudies[projectId]);
            } else {
              // Try fetching case study separately
              try {
                const cs = await caseStudyApi.getCaseStudy(projectId);
                if (cs) setCaseStudy(cs);
              } catch (csError) {
                console.error('Failed to fetch case study:', csError);
              }
            }
          }
        } catch (error) {
          console.error('Failed to load data:', error);
          setError('Failed to load case study data');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError('Missing portfolio or project ID');
      }
    };

    loadData();
  }, [portfolioId, projectId]);

  // Handle back navigation
  const handleBack = () => {
    if (pdfMode) {
      // In PDF mode, this won't be interactive, but the href will work in static HTML
      window.location.href = './';
    } else {
      navigate(-1);
    }
  };

  // Loading state
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
          Loading case study...
        </div>
      </div>
    );
  }

  // Error state
  if (error || !caseStudy) {
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
          textAlign: 'center',
          fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px', color: '#000' }}>
            Case Study Not Found
          </h2>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '32px' }}>
            {error || 'The requested case study could not be loaded.'}
          </p>
          <button
            onClick={handleBack}
            style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '13px',
              color: '#000',
              backgroundColor: 'transparent',
              border: '2px solid #000',
              padding: '12px 24px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              transition: 'all 0.3s ease'
            }}
          >
            ← BACK TO PORTFOLIO
          </button>
        </div>
      </div>
    );
  }

  // Extract project title from portfolio data
  const project = portfolioData?.content?.work?.projects?.find(p => p.id === parseInt(projectId)) || {};
  const portfolioTitle = portfolioData?.title || portfolioData?.content?.hero?.title || 'Portfolio';

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'HOME', href: pdfMode ? '/' : '/' },
    { label: portfolioTitle.toUpperCase(), href: pdfMode ? './' : `/portfolio/${portfolioId}` },
    { label: (project.title || caseStudy.title || 'CASE STUDY').toUpperCase(), current: true }
  ];

  return (
    <div style={{
      fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
      backgroundColor: '#FFFFFF',
      color: '#000000',
      minHeight: '100vh'
    }}>
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={breadcrumbItems}
        pdfMode={pdfMode}
        style={{
          backgroundColor: '#f8f8f8',
          borderBottom: '1px solid #e5e5e5'
        }}
      />

      {/* Fixed Header */}
      <header style={{
        position: 'fixed',
        top: '49px', // Below breadcrumb
        left: 0,
        right: 0,
        backgroundColor: '#000000',
        color: '#FFFFFF',
        padding: '24px 60px',
        zIndex: 999,
        borderBottom: '3px solid #FF0000',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {pdfMode ? (
          <a
            href="./"
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
              transition: 'all 0.3s ease',
              textDecoration: 'none',
              display: 'inline-block'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#FFFFFF';
              e.target.style.color = '#000000';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#FFFFFF';
            }}
          >
            ← BACK
          </a>
        ) : (
          <button
            onClick={handleBack}
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
        )}

        <div style={{
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: '12px',
          color: '#FF0000',
          textTransform: 'uppercase',
          letterSpacing: '0.15em'
        }}>
          VIEW CASE STUDY
        </div>
      </header>

      {/* Main Content - with padding for fixed header and breadcrumb */}
      <main style={{ paddingTop: '200px', paddingBottom: '120px' }}>
        {/* Hero Section */}
        <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 60px', marginBottom: '180px' }}>
          {/* Category */}
          <div style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '14px',
            color: '#FF0000',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            marginBottom: '40px'
          }}>
            {caseStudy.category || project.category || 'BRANDING / IDENTITY'} — {new Date().getFullYear()}
          </div>

          {/* Main Title */}
          <h1 style={{
            fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: 'clamp(60px, 10vw, 140px)',
            fontWeight: 900,
            lineHeight: 0.9,
            textTransform: 'uppercase',
            letterSpacing: '-0.03em',
            margin: 0,
            marginBottom: '60px'
          }}>
            {caseStudy.title || project.title || 'CASE STUDY'}
          </h1>

          {/* Intro Text */}
          <div style={{
            maxWidth: '900px',
            fontSize: '24px',
            lineHeight: 1.6,
            marginBottom: '80px'
          }}>
            {caseStudy.description || project.description ||
             'This case study explores the design process and implementation details.'}
          </div>

          {/* Hero Image */}
          {caseStudy.heroImage && (
            <div style={{
              width: '100%',
              maxWidth: '1400px',
              margin: '0 auto',
              marginBottom: '120px'
            }}>
              <img
                src={caseStudy.heroImage}
                alt={caseStudy.title || 'Case study hero'}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
              />
            </div>
          )}
        </section>

        {/* Case Study Content */}
        <section style={{ maxWidth: '900px', margin: '0 auto', padding: '0 60px' }}>
          {/* Introduction */}
          {caseStudy.introduction && (
            <div style={{ marginBottom: '120px' }}>
              <h2 style={{
                fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: '36px',
                fontWeight: 900,
                textTransform: 'uppercase',
                marginBottom: '40px'
              }}>
                INTRODUCTION
              </h2>
              <p style={{
                fontSize: '20px',
                lineHeight: 1.8,
                marginBottom: '30px'
              }}>
                {caseStudy.introduction}
              </p>
            </div>
          )}

          {/* Process Sections */}
          {caseStudy.sections && caseStudy.sections.map((section, index) => (
            <div key={index} style={{ marginBottom: '120px' }}>
              <h2 style={{
                fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: '36px',
                fontWeight: 900,
                textTransform: 'uppercase',
                marginBottom: '40px'
              }}>
                {section.title}
              </h2>
              <p style={{
                fontSize: '20px',
                lineHeight: 1.8,
                marginBottom: '30px'
              }}>
                {section.content}
              </p>
              {section.image && (
                <img
                  src={section.image}
                  alt={section.title}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    marginTop: '40px'
                  }}
                />
              )}
            </div>
          ))}

          {/* Conclusion */}
          {caseStudy.conclusion && (
            <div style={{ marginBottom: '120px' }}>
              <h2 style={{
                fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: '36px',
                fontWeight: 900,
                textTransform: 'uppercase',
                marginBottom: '40px'
              }}>
                CONCLUSION
              </h2>
              <p style={{
                fontSize: '20px',
                lineHeight: 1.8,
                marginBottom: '30px'
              }}>
                {caseStudy.conclusion}
              </p>
            </div>
          )}
        </section>

        {/* Footer Navigation */}
        <section style={{
          borderTop: '3px solid #000000',
          paddingTop: '60px',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '60px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            {pdfMode ? (
              <a
                href="./"
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '14px',
                  color: '#000',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }}
              >
                ← BACK TO PORTFOLIO
              </a>
            ) : (
              <button
                onClick={handleBack}
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '14px',
                  color: '#000',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }}
              >
                ← BACK TO PORTFOLIO
              </button>
            )}

            <div style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '12px',
              color: '#999',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              ECHELON TEMPLATE
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default EchelonCaseStudyPreview;