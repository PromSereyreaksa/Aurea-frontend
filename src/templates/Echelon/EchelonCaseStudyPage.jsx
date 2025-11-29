import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import usePortfolioStore from '../../stores/portfolioStore';

const CaseStudyPage = () => {
  const navigate = useNavigate();
  const { portfolioId, projectId } = useParams();
  const { portfolios } = usePortfolioStore();
  const [caseStudy, setCaseStudy] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  // Check if user is viewing from portfolio builder (owner) or public view
  const isOwnerView = window.location.pathname.includes('/portfolio-builder/');

  // Load case study data if portfolioId and projectId are provided
  useEffect(() => {
    if (portfolioId && projectId) {
      const portfolio = portfolios.find(p => p.id === portfolioId);
      if (portfolio?.caseStudies?.[projectId]) {
        setCaseStudy(portfolio.caseStudies[projectId]);
      }
      setIsLoading(false);
    } else {
      // For static demo page (no portfolioId/projectId), show demo content
      setIsLoading(false);
    }
  }, [portfolioId, projectId, portfolios]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // If we have portfolioId/projectId but no case study data
  if (!isLoading && portfolioId && projectId && !caseStudy) {
    return (
      <div style={{
        fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
        backgroundColor: '#FFFFFF',
        color: '#000000',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '600px' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 900,
            marginBottom: '24px',
            textTransform: 'uppercase'
          }}>
            Case Study Not Available
          </h1>
          <p style={{
            fontSize: '18px',
            marginBottom: '40px',
            color: '#666666'
          }}>
            This case study hasn't been created yet.
          </p>
          <button
            onClick={() => navigate(-1)}
            style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '14px',
              color: '#000000',
              backgroundColor: 'transparent',
              border: '2px solid #000000',
              padding: '16px 32px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 700
            }}
          >
            ← BACK
          </button>
        </div>
      </div>
    );
  }

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
          .cs-header-edit {
            width: 100%;
            padding: 12px 24px !important;
          }
          .cs-main {
            padding-top: 180px !important;
            padding-bottom: 60px !important;
          }
          .cs-section {
            padding: 0 20px !important;
            margin-bottom: 80px !important;
          }
          .cs-section-lg {
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
          .cs-steps-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 20px !important;
          }
          .cs-step-box {
            padding: 30px !important;
          }
          .cs-step-num {
            font-size: 36px !important;
          }
          .cs-step-title {
            font-size: 20px !important;
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
          .cs-3col-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .cs-2fr-1fr-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .cs-content-box {
            padding: 40px 30px !important;
          }
          .cs-subsection-title {
            font-size: 24px !important;
          }
          .cs-text-lg {
            font-size: 16px !important;
          }
          .cs-text-md {
            font-size: 15px !important;
          }
          .cs-conclusion {
            padding: 40px 30px !important;
          }
          .cs-conclusion-title {
            font-size: 32px !important;
            margin-bottom: 24px !important;
          }
          .cs-conclusion-text {
            font-size: 16px !important;
          }
          .cs-footer {
            padding: 30px 20px !important;
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
          onClick={() => navigate(-1)}
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
          VIEW CASE STUDY
        </div>

        {portfolioId && projectId && isOwnerView && (
          <button
            className="cs-header-edit"
            onClick={() => navigate(`/portfolio-builder/${portfolioId}/case-study/${projectId}`)}
            style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '13px',
              color: '#000000',
              backgroundColor: '#FFFFFF',
              border: '2px solid #FFFFFF',
              padding: '12px 32px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 700,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#FFFFFF';
              e.target.style.color = '#000000';
            }}
          >
            EDIT CASE STUDY →
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="cs-main" style={{ paddingTop: '120px', paddingBottom: '120px' }}>
        {/* Hero Section */}
        <section className="cs-section cs-section-lg" style={{
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
            BRANDING / IDENTITY — 2025
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
            LOGO DESIGN<br />PROCESS
          </h1>

          {/* Intro Text */}
          <div className="cs-hero-intro" style={{
            maxWidth: '900px',
            fontSize: '24px',
            lineHeight: 1.6,
            marginBottom: '80px'
          }}>
            In this article I will share my logo design process from start to finish,
            that I have built in 8 years as a graphic designer.
          </div>

          {/* Hero Image */}
          <div style={{
            width: '100%',
            aspectRatio: '16/9',
            backgroundColor: '#F5F5F5',
            marginBottom: '40px',
            overflow: 'hidden'
          }}>
            <img 
              src="/case-study/mihai/pic1.jpg" 
              alt="Design Process Overview"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>

          <div style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '14px',
            color: '#666666',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            Figure 01 — Design Process Framework
          </div>
        </section>

        {/* Introduction */}
        <section className="cs-section cs-section-lg" style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '0 60px',
          marginBottom: '160px'
        }}>
          <p className="cs-text-lg" style={{
            fontSize: '20px',
            lineHeight: 1.8,
            marginBottom: '30px'
          }}>
            The reasons why I am doing this is mostly because I get asked a lot by clients
            and other designers — how do I go around my process of creating logos, and of course
            because I want to share some of my knowledge.
          </p>

          <p className="cs-text-lg" style={{
            fontSize: '20px',
            lineHeight: 1.8,
            marginBottom: '30px'
          }}>
            There are 4 major steps I take when designing a logo:
          </p>

          {/* Steps List */}
          <div className="cs-steps-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '30px',
            marginTop: '60px'
          }}>
            {[
              { num: '01', title: 'RESEARCH', desc: 'Understanding the brand and market' },
              { num: '02', title: 'SKETCH', desc: 'Exploring concepts on paper' },
              { num: '03', title: 'DIGITAL', desc: 'Refining and digitizing' },
              { num: '04', title: 'SOURCE FILES', desc: 'Delivering final assets' }
            ].map((step, i) => (
              <div key={i} className="cs-step-box" style={{
                border: '2px solid #000000',
                padding: '40px',
                backgroundColor: i === 0 ? '#FF0000' : 'transparent',
                color: i === 0 ? '#FFFFFF' : '#000000'
              }}>
                <div className="cs-step-num" style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '48px',
                  fontWeight: 900,
                  marginBottom: '20px'
                }}>
                  {step.num}
                </div>
                <div className="cs-step-title" style={{
                  fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                  fontSize: '24px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  marginBottom: '12px'
                }}>
                  {step.title}
                </div>
                <div style={{
                  fontSize: '16px',
                  opacity: 0.8
                }}>
                  {step.desc}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 01: Research */}
        <section className="cs-section cs-section-lg" style={{
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
              01
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
                RESEARCH
              </h2>
            </div>
          </div>

          {/* Research Content */}
          <div className="cs-2col-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
            marginBottom: '80px'
          }}>
            <div>
              <h3 className="cs-subsection-title" style={{
                fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: '32px',
                fontWeight: 900,
                textTransform: 'uppercase',
                marginBottom: '30px'
              }}>
                01.1 QUESTIONNAIRE
              </h3>
              <p className="cs-text-md" style={{
                fontSize: '18px',
                lineHeight: 1.8,
                marginBottom: '20px'
              }}>
                After receiving an email and discussing terms and price with the client, getting paid
                with 50% payment I send them a Google Form Questionnaire that gets completed with the
                relevant info about their brand, vision and needs.
              </p>
              <p className="cs-text-md" style={{
                fontSize: '18px',
                lineHeight: 1.8
              }}>
                This is a crucial part of the research process because it eliminates a lot of guesses
                and it helps you better understand, what is it that the client wants and what should you do about it.
              </p>
            </div>
            
            <div>
              <div style={{
                aspectRatio: '4/3',
                backgroundColor: '#F5F5F5',
                overflow: 'hidden'
              }}>
                <img 
                  src="/case-study/mihai/pic2.jpg" 
                  alt="Research Process"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
              <div style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '12px',
                color: '#666666',
                marginTop: '16px',
                textTransform: 'uppercase'
              }}>
                Figure 02 — Keyword Analysis
              </div>
            </div>
          </div>

          <div className="cs-content-box" style={{
            backgroundColor: '#F5F5F5',
            padding: '60px',
            marginTop: '60px'
          }}>
            <h3 className="cs-subsection-title" style={{
              fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: '32px',
              fontWeight: 900,
              textTransform: 'uppercase',
              marginBottom: '30px'
            }}>
              01.2 DIG DEEP
            </h3>
            <p className="cs-text-md" style={{
              fontSize: '18px',
              lineHeight: 1.8
            }}>
              With the form printed I start to read it and mark keywords that would help in narrowing
              down possible ideas / concepts for the logo. I also do competitor analysis and try to
              gather as much info about the brand as I can.
            </p>
          </div>
        </section>

        {/* Section 02: Sketch */}
        <section className="cs-section cs-section-lg" style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 60px',
          marginBottom: '160px'
        }}>
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
              02
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
                SKETCH
              </h2>
            </div>
          </div>

          <div className="cs-2fr-1fr-grid" style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '60px',
            marginBottom: '80px'
          }}>
            <div>
              <div style={{
                aspectRatio: '16/11',
                backgroundColor: '#F5F5F5',
                marginBottom: '24px',
                overflow: 'hidden'
              }}>
                <img
                  src="/case-study/mihai/pic3.jpg"
                  alt="Sketch Process"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
              <div style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '12px',
                color: '#666666',
                textTransform: 'uppercase'
              }}>
                Figure 03 — Initial Sketches
              </div>
            </div>

            <div>
              <h3 className="cs-subsection-title" style={{
                fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: '28px',
                fontWeight: 900,
                textTransform: 'uppercase',
                marginBottom: '24px'
              }}>
                02.1 SKETCHING IDEAS
              </h3>
              <p className="cs-text-md" style={{
                fontSize: '16px',
                lineHeight: 1.7,
                marginBottom: '30px'
              }}>
                This is by far my favourite part of the whole process because it is where my creativity
                goes wild and I am free to experiment with various ideas I had in mind.
              </p>
              <p className="cs-text-md" style={{
                fontSize: '16px',
                lineHeight: 1.7
              }}>
                It usually starts by having the form in front of me and by associating keywords with
                very simple graphical forms. I try to roughly sketch them without being too detailed.
              </p>
            </div>
          </div>

          <div className="cs-content-box" style={{
            backgroundColor: '#000000',
            color: '#FFFFFF',
            padding: '60px',
            marginTop: '60px'
          }}>
            <h3 className="cs-subsection-title" style={{
              fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: '32px',
              fontWeight: 900,
              textTransform: 'uppercase',
              marginBottom: '30px',
              color: '#FF0000'
            }}>
              02.2 NARROWING DOWN
            </h3>
            <p className="cs-text-md" style={{
              fontSize: '18px',
              lineHeight: 1.8,
              marginBottom: '30px'
            }}>
              After having a couple of pages of sketches I can already see which of them are good
              enough to make it to the client as concepts because while sketching simultaneously I
              test the ideas digitally to ensure they work and are not busy or irrelevant.
            </p>
            <div className="cs-2col-grid" style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '40px',
              marginTop: '60px'
            }}>
              <img
                src="/case-study/mihai/pic4.png"
                alt="Narrowed Directions"
                style={{
                  width: '100%',
                  border: '2px solid #FF0000'
                }}
              />
              <div>
                <p className="cs-text-md" style={{
                  fontSize: '16px',
                  lineHeight: 1.7,
                  marginBottom: '20px'
                }}>
                  My number one tip when sketching is to go fast and don't strive to make perfect
                  sketches as that tends to break the flow of whole process.
                </p>
                <p className="cs-text-md" style={{
                  fontSize: '16px',
                  lineHeight: 1.7
                }}>
                  Sketch rough and fast, and always work with copies. Lay down a shape and then
                  try to improve it by drawing the same one but with an update.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 03: Digital */}
        <section className="cs-section cs-section-lg" style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 60px',
          marginBottom: '160px'
        }}>
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
              03
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
                DIGITAL
              </h2>
            </div>
          </div>

          <div className="cs-2col-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '60px',
            marginBottom: '60px'
          }}>
            <div>
              <h3 className="cs-subsection-title" style={{
                fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: '28px',
                fontWeight: 900,
                textTransform: 'uppercase',
                marginBottom: '24px'
              }}>
                03.1 DIGITIZING DIRECTIONS
              </h3>
              <p className="cs-text-md" style={{
                fontSize: '16px',
                lineHeight: 1.7
              }}>
                Once we have approved the scanned directions I take them and start on the digital process.
                I use them only as a guidance, because my best ideas usually come when working in front
                of the computer.
              </p>
            </div>
            <div>
              <img 
                src="/case-study/mihai/pic5.jpg" 
                alt="Digital Process"
                style={{
                  width: '100%',
                  border: '3px solid #000000'
                }}
              />
            </div>
          </div>

          <div className="cs-content-box" style={{
            border: '3px solid #FF0000',
            padding: '60px',
            marginTop: '80px'
          }}>
            <h3 className="cs-subsection-title" style={{
              fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: '32px',
              fontWeight: 900,
              textTransform: 'uppercase',
              marginBottom: '30px'
            }}>
              03.2 PRESENTATIONS & MOCKUPS
            </h3>
            <p className="cs-text-md" style={{
              fontSize: '18px',
              lineHeight: 1.8,
              marginBottom: '40px'
            }}>
              After a lot of experimenting and trying to make things look good I take 3 of my best
              directions and craft 3 presentations in which I present the logo in various scenarios:
            </p>

            <div className="cs-3col-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '30px'
            }}>
              <div style={{
                border: '2px solid #000000',
                padding: '30px',
                backgroundColor: '#F5F5F5'
              }}>
                <div style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '14px',
                  fontWeight: 700,
                  marginBottom: '12px'
                }}>
                  01
                </div>
                <div style={{ fontSize: '16px' }}>
                  Main Logo + Wordmark in Color Version
                </div>
              </div>
              <div style={{
                border: '2px solid #000000',
                padding: '30px',
                backgroundColor: '#F5F5F5'
              }}>
                <div style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '14px',
                  fontWeight: 700,
                  marginBottom: '12px'
                }}>
                  02
                </div>
                <div style={{ fontSize: '16px' }}>
                  Main Logo + Wordmark in Dark / Light Version
                </div>
              </div>
              <div style={{
                border: '2px solid #000000',
                padding: '30px',
                backgroundColor: '#F5F5F5'
              }}>
                <div style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '14px',
                  fontWeight: 700,
                  marginBottom: '12px'
                }}>
                  03
                </div>
                <div style={{ fontSize: '16px' }}>
                  Simple Mockups (T-shirt, Cup, Office Wall)
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 04: Source Files */}
        <section className="cs-section cs-section-lg" style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 60px',
          marginBottom: '160px'
        }}>
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
              04
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
                SOURCE FILES
              </h2>
            </div>
          </div>

          <div className="cs-content-box" style={{
            backgroundColor: '#F5F5F5',
            padding: '80px 60px'
          }}>
            <h3 className="cs-subsection-title" style={{
              fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: '32px',
              fontWeight: 900,
              textTransform: 'uppercase',
              marginBottom: '40px'
            }}>
              04.1 PREPARING SOURCE FILES
            </h3>

            <p className="cs-text-md" style={{
              fontSize: '18px',
              lineHeight: 1.8,
              marginBottom: '40px'
            }}>
              Now that the final logo has been approved and there are no more changes I proceed
              to creating the source files.
            </p>

            <div className="cs-2col-grid" style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '40px',
              marginTop: '60px'
            }}>
              <img 
                src="/case-study/mihai/pic6.png" 
                alt="Source Files Structure"
                style={{
                  width: '100%',
                  border: '3px solid #000000'
                }}
              />
              <div>
                <p style={{
                  fontSize: '16px',
                  lineHeight: 1.7,
                  marginBottom: '30px'
                }}>
                  I save everything in different folders:
                </p>
                <ul style={{
                  fontSize: '18px',
                  lineHeight: 2,
                  listStyle: 'none',
                  padding: 0
                }}>
                  <li style={{
                    padding: '16px',
                    backgroundColor: '#FFFFFF',
                    marginBottom: '12px',
                    border: '2px solid #000000',
                    fontWeight: 700
                  }}>
                    → Vector (.AI / .EPS / .PDF)
                  </li>
                  <li style={{
                    padding: '16px',
                    backgroundColor: '#FFFFFF',
                    marginBottom: '12px',
                    border: '2px solid #000000',
                    fontWeight: 700
                  }}>
                    → PNG (Transparent / White BG)
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="cs-content-box" style={{
            marginTop: '80px',
            border: '3px solid #000000',
            padding: '60px'
          }}>
            <h3 className="cs-subsection-title" style={{
              fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: '32px',
              fontWeight: 900,
              textTransform: 'uppercase',
              marginBottom: '40px'
            }}>
              04.2 LOGO AND/OR BRAND GUIDELINES
            </h3>

            <p className="cs-text-md" style={{
              fontSize: '18px',
              lineHeight: 1.8,
              marginBottom: '40px'
            }}>
              Along with the source files I offer a PDF guideline where I demonstrate logo usage
              to ensure that everything is used accordingly to the rules I have set.
            </p>

            <div className="cs-2col-grid" style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '30px',
              marginTop: '60px'
            }}>
              <img 
                src="/case-study/mihai/pic7.png" 
                alt="Brand Guidelines Example 1"
                style={{
                  width: '100%',
                  border: '2px solid #CCCCCC'
                }}
              />
              <img 
                src="/case-study/mihai/pic8.png" 
                alt="Brand Guidelines Example 2"
                style={{
                  width: '100%',
                  border: '2px solid #CCCCCC'
                }}
              />
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section className="cs-section" style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '0 60px',
          marginBottom: '80px'
        }}>
          <div className="cs-conclusion" style={{
            backgroundColor: '#FF0000',
            color: '#FFFFFF',
            padding: '80px 60px',
            textAlign: 'center'
          }}>
            <h2 className="cs-conclusion-title" style={{
              fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: '48px',
              fontWeight: 900,
              textTransform: 'uppercase',
              marginBottom: '40px',
              lineHeight: 1.1
            }}>
              BOTTOM LINE
            </h2>
            <p className="cs-conclusion-text" style={{
              fontSize: '20px',
              lineHeight: 1.8
            }}>
              Having a process and sticking to it, will definitely give you and your work a sense
              of ownership. You will position yourself as an expert and people will be most likely
              to trust you and hand over their projects and ideas so you can convert them into
              useful graphical solutions.
            </p>
          </div>
        </section>

        {/* Author */}
        <section className="cs-section" style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '0 60px',
          textAlign: 'center'
        }}>
          <div style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '14px',
            color: '#666666',
            textTransform: 'uppercase',
            marginBottom: '16px'
          }}>
            Thank you for reading
          </div>
          <div style={{
            fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: '36px',
            fontWeight: 900
          }}>
            MIHAI
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="cs-footer" style={{
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
          Case Study — Logo Design Process © 2025
        </div>
      </footer>
    </div>
    </>
  );
};

export default CaseStudyPage;
