import React from 'react';
import { SwissGrid, GridCol } from '../components/SwissGrid';
import { SwissSpiral, SwissCircles, SwissLines } from '../components/SwissDecorations';
import { SwissHeading, SwissMono } from '../components/SwissTypography';
import { SwissDivider } from '../components/SwissComponents';

const EchelonHero = ({ 
  content,
  isEditing = false,
  onContentChange 
}) => {
  const { title = 'DESIGNING WITH PRECISION', subtitle = 'Case studies in clarity and form' } = content;

  const handleTitleChange = (newTitle) => {
    if (onContentChange) {
      onContentChange('hero', 'title', newTitle);
    }
  };

  const handleSubtitleChange = (newSubtitle) => {
    if (onContentChange) {
      onContentChange('hero', 'subtitle', newSubtitle);
    }
  };

  // Keyboard shortcuts handler
  const handleKeyDown = (e, field, value) => {
    // ESC - cancel editing without saving
    if (e.key === 'Escape') {
      e.preventDefault();
      e.target.blur();
      return;
    }

    // For textarea: Shift+Enter = new line, Enter alone = save and exit
    // For input: Enter = save and exit
    if (e.key === 'Enter') {
      const isTextarea = e.target.tagName.toLowerCase() === 'textarea';
      
      if (!isTextarea || !e.shiftKey) {
        // Save and exit editing
        e.preventDefault();
        if (field === 'title') {
          handleTitleChange(value);
        } else if (field === 'subtitle') {
          handleSubtitleChange(value);
        }
        e.target.blur();
      }
      // If Shift+Enter in textarea, allow default (new line)
    }

    // Ctrl+S / Cmd+S - save without exiting
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      if (field === 'title') {
        handleTitleChange(value);
      } else if (field === 'subtitle') {
        handleSubtitleChange(value);
      }
    }
  };

  return (
    <section 
      id="hero"
      style={{
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        color: '#000000',
        paddingTop: '0',
        paddingBottom: '0',
        position: 'relative',
        overflow: 'clip',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {/* Aesthetic Spirals in Corners - Hidden on mobile */}
      <div className="hidden md:block">
        <SwissSpiral position="top-left" color="#000000" opacity={0.03} size={180} />
        <SwissSpiral position="bottom-right" color="#FF0000" opacity={0.04} size={200} rotation={180} />
      </div>
      
      {/* Diagonal Accent Line - Hidden on mobile */}
      <div className="hidden lg:block" style={{
        position: 'absolute',
        top: '30%',
        right: '10%',
        width: '500px',
        height: '3px',
        backgroundColor: '#FF0000',
        transform: 'rotate(-45deg)',
        opacity: 0.12,
        zIndex: 1,
        pointerEvents: 'none'
      }} />
      
      {/* Large Intentional Grid - Top Right - Hidden on mobile */}
      <div className="hidden lg:block" style={{
        position: 'absolute',
        top: '8%',
        right: '5%',
        width: '400px',
        height: '400px',
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        gridTemplateRows: 'repeat(8, 1fr)',
        gap: '0',
        opacity: 0.12,
        zIndex: 1,
        pointerEvents: 'none'
      }}>
        {[...Array(64)].map((_, i) => (
          <div key={i} style={{ 
            border: '1px solid #FF0000',
            backgroundColor: i % 7 === 0 ? 'rgba(255, 0, 0, 0.05)' : 'transparent'
          }} />
        ))}
      </div>

      {/* Vertical Red Lines - Left Side - Hidden on mobile */}
      <div className="hidden md:flex" style={{
        position: 'absolute',
        left: '80px',
        top: '20%',
        bottom: '20%',
        gap: '60px',
        opacity: 0.15,
        zIndex: 1,
        pointerEvents: 'none'
      }}>
        {[...Array(3)].map((_, i) => (
          <div key={i} style={{ width: '3px', height: '100%', backgroundColor: '#FF0000' }} />
        ))}
      </div>

      {/* Circle Elements - Bottom - Hidden on mobile */}
      <div className="hidden md:flex" style={{
        position: 'absolute',
        bottom: '100px',
        left: '15%',
        gap: '30px',
        opacity: 0.08,
        zIndex: 1,
        pointerEvents: 'none'
      }}>
        {[80, 120, 160].map((size, i) => (
          <div key={i} style={{ 
            width: `${size}px`, 
            height: `${size}px`, 
            border: '4px solid #000000',
            borderRadius: '50%'
          }} />
        ))}
      </div>

      <SwissGrid>
        {/* Massive Typography Display */}
        <GridCol span={12}>
          <div style={{ position: 'relative', paddingTop: '20vh', paddingBottom: '15vh', zIndex: 2 }}>
            {/* Huge Background "01" Number */}
            <div className="hidden md:block" style={{
              position: 'absolute',
              top: '10%',
              right: '-5%',
              fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: 'clamp(80px, 30vw, 400px)',
              fontWeight: 900,
              color: 'rgba(0, 0, 0, 0.02)',
              lineHeight: 1,
              zIndex: 0,
              pointerEvents: 'none',
              WebkitTextStroke: '2px rgba(255, 0, 0, 0.05)'
            }}>
              01
            </div>

            {/* Main Title - MASSIVE Display Typography */}
            {isEditing ? (
              <textarea
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'title', e.target.value)}
                onBlur={(e) => handleTitleChange(e.target.value)}
                style={{
                  fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                  fontSize: 'clamp(60px, 12vw, 160px)',
                  fontWeight: 900,
                  lineHeight: 1.05,
                  color: '#000000',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.03em',
                  backgroundColor: 'transparent',
                  border: '2px dashed #FF0000',
                  outline: 'none',
                  width: '100%',
                  minHeight: '300px',
                  padding: '30px',
                  resize: 'none',
                  marginBottom: '60px'
                }}
                rows={2}
              />
            ) : (
              <div style={{ position: 'relative', overflow: 'hidden', width: '100%' }}>
                <h1 style={{
                  fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                  fontSize: 'clamp(60px, 12vw, 160px)',
                  fontWeight: 900,
                  lineHeight: 1.05,
                  color: '#000000',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.03em',
                  margin: 0,
                  marginBottom: '60px',
                  position: 'relative',
                  zIndex: 2,
                  maxWidth: '100%',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  hyphens: 'auto'
                }}>
                  {title}
                  {/* Grid frame overlay around text */}
                  <div style={{
                    position: 'absolute',
                    top: '-40px',
                    right: '5%',
                    width: '300px',
                    height: '200px',
                    border: '3px solid #FF0000',
                    opacity: 0.15,
                    pointerEvents: 'none',
                    zIndex: -1
                  }} />
                </h1>
              </div>
            )}
          </div>
        </GridCol>

        {/* Asymmetrical Layout - Subtitle positioned on grid */}
        <GridCol span={12} offset={0} className="md:col-span-5 md:col-start-8">
          <div style={{
            borderLeft: '4px solid #FF0000',
            paddingLeft: '40px',
            marginTop: '-60px',
            position: 'relative'
          }}>
            {/* Swiss Number Indicator */}
            <div style={{
              position: 'absolute',
              left: '-60px',
              top: '-20px',
              fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: 'clamp(40px, 10vw, 120px)',
              fontWeight: 900,
              color: 'rgba(0, 0, 0, 0.03)',
              lineHeight: 1,
              zIndex: 0
            }}>
              01
            </div>

            {/* Year/Date */}
            <div style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: 'clamp(10px, 1.2vw, 14px)',
              fontWeight: 600,
              color: '#FF0000',
              marginBottom: '24px',
              textTransform: 'uppercase',
              letterSpacing: '0.15em'
            }}>
              EST. 2025 — DESIGN PORTFOLIO
            </div>

            {/* Subtitle */}
            {isEditing ? (
              <textarea
                value={subtitle}
                onChange={(e) => handleSubtitleChange(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'subtitle', e.target.value)}
                onBlur={(e) => handleSubtitleChange(e.target.value)}
                style={{
                  fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                  fontSize: 'clamp(18px, 2.5vw, 28px)',
                  fontWeight: 400,
                  lineHeight: 1.5,
                  color: '#000000',
                  backgroundColor: 'transparent',
                  border: '2px dashed #FF0000',
                  outline: 'none',
                  width: '100%',
                  minHeight: '120px',
                  padding: '20px',
                  resize: 'vertical'
                }}
                rows={3}
              />
            ) : (
              <p style={{
                fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: 'clamp(18px, 2.5vw, 28px)',
                fontWeight: 400,
                lineHeight: 1.5,
                color: '#000000',
                margin: 0,
                maxWidth: '500px',
                wordWrap: 'break-word',
                overflowWrap: 'break-word'
              }}>
                {subtitle}
              </p>
            )}

            {/* Small Grid Element */}
            <div style={{
              marginTop: '40px',
              display: 'inline-grid',
              gridTemplateColumns: 'repeat(4, 30px)',
              gridTemplateRows: 'repeat(2, 30px)',
              gap: '2px',
              opacity: 0.3
            }}>
              {[...Array(8)].map((_, i) => (
                <div key={i} style={{ border: '1px solid #000000' }} />
              ))}
            </div>
          </div>
        </GridCol>

        {/* Large Design Statement */}
        <GridCol span={12}>
          <div style={{
            marginTop: '100px',
            paddingTop: '60px',
            borderTop: '1px solid #000000',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: 'clamp(10px, 1vw, 12px)',
              color: '#666666',
              textTransform: 'uppercase',
              letterSpacing: '0.2em'
            }}>
              SCROLL TO EXPLORE
            </div>
            <div style={{
              fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: 'clamp(12px, 1.5vw, 16px)',
              fontWeight: 700,
              color: '#000000',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              PORTFOLIO 2025
            </div>
          </div>
        </GridCol>

        {/* Swiss Grid Overlay for Visual Reference (only in editing mode) */}
        {isEditing && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: '80px',
            right: '80px',
            bottom: 0,
            pointerEvents: 'none',
            opacity: 0.1,
            zIndex: -1
          }}>
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${(i / 12) * 100}%`,
                  top: 0,
                  bottom: 0,
                  width: '1px',
                  backgroundColor: '#FF0000'
                }}
              />
            ))}
          </div>
        )}
      </SwissGrid>
    </section>
  );
};

export default EchelonHero;