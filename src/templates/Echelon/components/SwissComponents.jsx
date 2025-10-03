import React from 'react';

// Swiss UI Components
// Minimal, functional components following Swiss design principles

// Swiss Divider - Simple hairline rule
export const SwissDivider = ({
  className = '',
  color = '#000000', 
  thickness = '1px',
  margin = '40px 0'
}) => {
  return (
    <hr
      className={`swiss-divider ${className}`}
      style={{
        border: 'none',
        borderTop: `${thickness} solid ${color}`,
        margin,
        width: '100%'
      }}
    />
  );
};

// Swiss Navigation Component
export const SwissNavigation = ({ 
  items = [],
  isScrolled = false,
  isEditing = false
}) => {
  const scrollToSection = (href) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  if (!isEditing) {
    return null; // Only show in editing mode
  }

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: isScrolled ? '1px solid rgba(0, 0, 0, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
        zIndex: 1000,
        transition: 'all 0.3s ease',
        padding: '16px 0'
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Logo/Title */}
        <div
          style={{
            fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: '18px',
            fontWeight: 700,
            color: '#000000',
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            opacity: 0.7
          }}
        >
          EDITOR MODE
        </div>

        {/* Navigation Items */}
        <div style={{ display: 'flex', gap: '40px' }}>
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => scrollToSection(item.href)}
              style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '14px',
                fontWeight: 400,
                color: '#000000',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                opacity: 0.6,
                transition: 'opacity 0.3s ease',
                padding: '8px 0',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.target.style.opacity = 1;
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = 0.6;
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

// Swiss Project Card Component
export const SwissProjectCard = ({
  title,
  description,
  meta,
  image,
  className = '',
  onClick
}) => {
  return (
    <article
      className={`swiss-project-card ${className}`}
      onClick={onClick}
      style={{
        marginBottom: '80px',
        borderBottom: '1px solid #000000',
        paddingBottom: '40px',
        cursor: onClick ? 'pointer' : 'default'
      }}
    >
      {/* Project Image */}
      {image && (
        <div
          style={{
            marginBottom: '24px',
            overflow: 'hidden'
          }}
        >
          <img
            src={image}
            alt={title}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block'
            }}
          />
        </div>
      )}

      {/* Project Meta */}
      {meta && (
        <div
          style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '14px',
            color: '#666666',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.01em'
          }}
        >
          {meta}
        </div>
      )}

      {/* Project Title */}
      <h3
        style={{
          fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
          fontSize: '32px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
          color: '#000000',
          marginBottom: '16px',
          marginTop: 0,
          lineHeight: 1.1
        }}
      >
        {title}
      </h3>

      {/* Project Description */}
      {description && (
        <p
          style={{
            fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: '18px',
            fontWeight: 400,
            lineHeight: 1.4,
            color: '#000000',
            marginTop: 0,
            marginBottom: 0
          }}
        >
          {description}
        </p>
      )}
    </article>
  );
};

// Swiss Button Component
export const SwissButton = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  disabled = false
}) => {
  const styles = {
    primary: {
      backgroundColor: 'transparent',
      color: '#000000',
      border: '2px solid #000000'
    },
    secondary: {
      backgroundColor: '#000000',
      color: '#FFFFFF',
      border: '2px solid #000000'
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`swiss-button ${className}`}
      style={{
        ...styles[variant],
        fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: '16px',
        fontWeight: 400,
        textTransform: 'uppercase',
        letterSpacing: '0.02em',
        padding: '16px 32px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        borderRadius: 0,
        opacity: disabled ? 0.5 : 1
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          if (variant === 'primary') {
            e.target.style.backgroundColor = '#000000';
            e.target.style.color = '#FFFFFF';
          } else {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#000000';
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.target.style.backgroundColor = styles[variant].backgroundColor;
          e.target.style.color = styles[variant].color;
        }
      }}
    >
      {children}
    </button>
  );
};

export default {
  SwissDivider,
  SwissNavigation, 
  SwissProjectCard,
  SwissButton
};