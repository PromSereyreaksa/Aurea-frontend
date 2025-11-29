import React, { useState, useEffect } from 'react';
import EchelonHero from './sections/EchelonHero';
import EchelonAbout from './sections/EchelonAbout';
import EchelonWork from './sections/EchelonWork';
import EchelonGallery from './sections/EchelonGallery';
import EchelonContact from './sections/EchelonContact';

const EchelonTemplate = ({
  content = {},
  isEditing = false,
  onContentChange,
  className = '',
  portfolioId = null,
  caseStudies = {}
}) => {
  // Navigation scroll effect
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle content changes
  const handleSectionContentChange = (section, field, value) => {
    if (onContentChange) {
      onContentChange({
        ...content,
        [section]: {
          ...content[section],
          [field]: value
        }
      });
    }
  };

  // Navigation items
  const navigationItems = [
    { label: 'HOME', href: '#hero' },
    { label: 'ABOUT', href: '#about' },
    { label: 'WORK', href: '#work' },
    { label: 'GALLERY', href: '#gallery' },
    { label: 'CONTACT', href: '#contact' }
  ];

  return (
    <div 
      className={`${className} template-wrapper`}
      style={{
        fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
        color: '#000000',
        backgroundColor: '#FFFFFF',
        lineHeight: 1.4,
        minHeight: '100vh',
        position: 'relative',
        maxWidth: '100vw',
        width: '100%'
      }}
    >
      {/* Swiss Grid Overlay - Always visible but subtle */}
            {/* Swiss Grid Overlay - Removed constant overlay, will be selective */}

      {/* Swiss Navigation Bar - Always visible */}
            {/* Navigation hidden for now */}
      {false && (
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '20px 0'
      }}>
        <SwissGrid>
          <GridCol span={12}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{
                fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: '24px',
                fontWeight: 900,
                color: '#FFFFFF'
              }}>
                ECHELON
              </div>
              <div style={{
                display: 'flex',
                gap: '40px'
              }}>
                {['About', 'Work', 'Gallery', 'Contact'].map((item, index) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(item.toLowerCase())?.scrollIntoView({
                        behavior: 'smooth'
                      });
                    }}
                    style={{
                      fontFamily: '"IBM Plex Mono", monospace',
                      fontSize: '14px',
                      color: '#CCCCCC',
                      textDecoration: 'none',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      transition: 'color 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#CCCCCC';
                    }}
                  >
                    0{index + 2} {item}
                  </a>
                ))}
              </div>
            </div>
          </GridCol>
        </SwissGrid>
      </nav>
      )}

      {/* Main Content with top padding for fixed nav */}
      <div style={{ paddingTop: '80px' }}>
        {/* Hero Section */}
        <EchelonHero
          content={content.hero || {}}
          isEditing={isEditing}
          onContentChange={handleSectionContentChange}
        />

        {/* About Section */}
        <EchelonAbout
          content={content.about || {}}
          isEditing={isEditing}
          onContentChange={handleSectionContentChange}
        />

        {/* Work Section - Only show if enabled or in editing mode */}
        {(isEditing || content.work?.enabled !== false) && (
          <EchelonWork
            content={content.work || {}}
            isEditing={isEditing}
            onContentChange={handleSectionContentChange}
            portfolioId={portfolioId}
            caseStudies={caseStudies}
          />
        )}

        {/* Gallery Section */}
        <EchelonGallery
          content={content.gallery || {}}
          isEditing={isEditing}
          onContentChange={handleSectionContentChange}
        />

        {/* Contact Section */}
        <EchelonContact
          content={content.contact || {}}
          isEditing={isEditing}
          onContentChange={handleSectionContentChange}
        />
      </div>

      {/* Swiss Typography CSS */}
      <style jsx>{`
        /* Neue Haas Grotesk Font Import */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        /* IBM Plex Mono Font Import */
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&display=swap');
        
        /* Global Swiss Styles */
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Typography Scale */
        .swiss-display {
          font-size: clamp(72px, 12vw, 180px);
          font-weight: 900;
          line-height: 0.85;
          letter-spacing: -0.03em;
        }

        .swiss-h1 {
          font-size: clamp(48px, 8vw, 80px);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: 0.02em;
        }

        .swiss-h2 {
          font-size: clamp(36px, 6vw, 60px);
          font-weight: 600;
          line-height: 1.2;
          letter-spacing: 0.01em;
        }

        .swiss-h3 {
          font-size: clamp(24px, 4vw, 40px);
          font-weight: 600;
          line-height: 1.3;
        }

        .swiss-body-large {
          font-size: clamp(18px, 2.5vw, 24px);
          font-weight: 400;
          line-height: 1.5;
        }

        .swiss-body {
          font-size: clamp(16px, 2vw, 20px);
          font-weight: 400;
          line-height: 1.6;
        }

        .swiss-small {
          font-size: clamp(12px, 1.5vw, 16px);
          font-weight: 400;
          line-height: 1.4;
        }

        .swiss-mono {
          font-family: 'IBM Plex Mono', monospace;
          font-weight: 400;
          letter-spacing: 0.02em;
        }

        /* Responsive Typography & Spacing */
        @media (max-width: 1024px) {
          .swiss-container {
            padding: 0 40px;
          }
        }

        @media (max-width: 768px) {
          .swiss-container {
            padding: 0 20px;
          }
          
          /* Reduce section padding on mobile */
          section {
            padding-top: clamp(40px, 8vh, 80px) !important;
            padding-bottom: clamp(40px, 8vh, 80px) !important;
          }
        }

        @media (max-width: 480px) {
          .swiss-container {
            padding: 0 16px;
          }
          
          /* Even smaller padding on very small screens */
          section {
            padding-top: clamp(30px, 6vh, 60px) !important;
            padding-bottom: clamp(30px, 6vh, 60px) !important;
          }
        }

        /* Swiss Grid Helpers */
        .swiss-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 clamp(16px, 5vw, 80px);
        }

        /* Swiss Animations */
        .swiss-fade-in {
          animation: swissFadeIn 0.8s ease-out forwards;
        }

        @keyframes swissFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Swiss Hover Effects */
        .swiss-hover-underline {
          position: relative;
          text-decoration: none;
        }

        .swiss-hover-underline::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background-color: currentColor;
          transition: width 0.3s ease;
        }

        .swiss-hover-underline:hover::after {
          width: 100%;
        }

        /* High Contrast Mode */
        @media (prefers-contrast: high) {
          .swiss-text-secondary {
            color: #000000 !important;
          }
          
          .swiss-border {
            border-color: #000000 !important;
          }
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          
          html {
            scroll-behavior: auto;
          }
        }

        /* Swiss Grid Overlay Responsive */
        @media (max-width: 768px) {
          .swiss-grid-overlay {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default EchelonTemplate;