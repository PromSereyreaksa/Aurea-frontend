import { useState, useEffect } from 'react';

const BoldFolioHero = ({ content = {}, isEditing = false, onContentChange }) => {
  const [visibleSections, setVisibleSections] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => setVisibleSections([0]), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleFieldChange = (field, value) => {
    if (onContentChange) {
      onContentChange('hero', field, value);
    }
  };

  const styles = {
    container: {
      position: 'relative',
      minHeight: '100vh',
      background: 'none',
      padding: 'clamp(1.25rem, 4vw, 3.75rem) clamp(1rem, 3vw, 2.5rem)',
      fontFamily: 'Graphik, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Fira Sans", Roboto, "Avenir Next", "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: '500',
      fontStyle: 'normal',
    },
    mainContent: {
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      gap: 'clamp(1.5rem, 4vw, 2.5rem)',
    },
    leftSection: {
      flex: '1 1 600px',
      minWidth: '300px',
      textAlign: 'left',
    },
    magentaText: {
      color: '#ff0080',
      fontSize: 'clamp(1.75rem, 6vw, 3.25rem)',
      fontWeight: '500',
      lineHeight: '1.2',
      margin: '0 0 20px 0',
      letterSpacing: '-0.02em',
    },
    blackText: {
      color: '#000000',
      fontSize: 'clamp(1.75rem, 6vw, 3.25rem)',
      fontWeight: '500',
      lineHeight: '1.2',
      margin: '0 0 20px 0',
      letterSpacing: '-0.02em',
    },
    fadeIn: {
      opacity: 0,
      animation: 'fadeIn 0.8s ease-in forwards',
    },
  };

  const keyframes = `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = keyframes;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, []);

  return (
    <div id="hero" style={styles.container}>
      <div style={styles.mainContent}>
        <div
          style={{
            ...styles.leftSection,
            ...(visibleSections.includes(0) ? styles.fadeIn : { opacity: 0 }),
          }}
        >
          <h1
            style={styles.magentaText}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => isEditing && handleFieldChange('title', e.target.innerHTML)}
            dangerouslySetInnerHTML={{ __html: content.title || 'Driven by passion—and<br />fuelled by curiosity.' }}
          />
          <h2
            style={styles.blackText}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => isEditing && handleFieldChange('subtitle', e.target.innerHTML)}
            dangerouslySetInnerHTML={{ __html: content.subtitle || 'Designer and art-director<br />based in Montreal, Quebec.' }}
          />
          <p
            style={{
              ...styles.blackText,
              fontSize: 'clamp(1.75rem, 6vw, 3.25rem)',
              margin: '0 0 20px 0',
            }}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => isEditing && handleFieldChange('description', e.target.innerHTML)}
            dangerouslySetInnerHTML={{ __html: content.description || 'Think of design as a way<br />to transform problems into<br />empowering opportunities<br />and create appealing visuals<br />that connect with people.' }}
          />
          <p
            style={{
              ...styles.blackText,
              fontSize: 'clamp(1.75rem, 6vw, 3.25rem)',
              margin: '0',
              textAlign: 'center',
            }}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => isEditing && handleFieldChange('cta', e.target.textContent)}
          >
            {content.cta || 'Open for collaborations!'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BoldFolioHero;
