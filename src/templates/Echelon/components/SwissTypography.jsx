import React from 'react';

// Swiss Typography System
// Implements precise typography following International Typographic Style

const SWISS_FONTS = {
  heading: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
  body: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif', 
  mono: '"IBM Plex Mono", "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
};

const SWISS_SCALE = {
  h1: '72px',
  h2: '48px', 
  h3: '32px',
  h4: '24px',
  body: '18px',
  small: '16px',
  meta: '14px'
};

// Swiss Heading Component
export const SwissHeading = ({ 
  level = 1, 
  children, 
  className = '',
  uppercase = true,
  weight = 'bold',
  color = '#000000',
  lineHeight = 1.1,
  marginBottom = '40px'
}) => {
  const Tag = `h${level}`;
  const fontSize = SWISS_SCALE[`h${level}`] || SWISS_SCALE.h1;
  
  return (
    <Tag
      className={`swiss-heading ${className}`}
      style={{
        fontFamily: SWISS_FONTS.heading,
        fontSize,
        fontWeight: weight === 'bold' ? 700 : 400,
        lineHeight,
        color,
        textTransform: uppercase ? 'uppercase' : 'none',
        letterSpacing: uppercase ? '0.02em' : 'normal',
        marginBottom,
        marginTop: 0
      }}
    >
      {children}
    </Tag>
  );
};

// Swiss Body Text Component  
export const SwissBody = ({
  children,
  size = 'body',
  className = '',
  color = '#000000',
  lineHeight = 1.4,
  marginBottom = '24px'
}) => {
  const fontSize = SWISS_SCALE[size] || SWISS_SCALE.body;
  
  return (
    <p
      className={`swiss-body ${className}`}
      style={{
        fontFamily: SWISS_FONTS.body,
        fontSize,
        fontWeight: 400,
        lineHeight,
        color,
        marginBottom,
        marginTop: 0
      }}
    >
      {children}
    </p>
  );
};

// Swiss Mono Text Component (for metadata, captions)
export const SwissMono = ({
  children,
  size = 'meta', 
  className = '',
  color = '#666666',
  uppercase = false,
  lineHeight = 1.4,
  marginBottom = '16px'
}) => {
  const fontSize = SWISS_SCALE[size] || SWISS_SCALE.meta;
  
  return (
    <span
      className={`swiss-mono ${className}`}
      style={{
        fontFamily: SWISS_FONTS.mono,
        fontSize,
        fontWeight: 400,
        lineHeight,
        color,
        textTransform: uppercase ? 'uppercase' : 'none',
        letterSpacing: '0.01em',
        marginBottom,
        marginTop: 0,
        display: 'block'
      }}
    >
      {children}
    </span>
  );
};

// Swiss Link Component
export const SwissLink = ({
  children,
  href = '#',
  className = '',
  color = '#000000',
  hoverColor = '#B80000',
  underline = true,
  onClick
}) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`swiss-link ${className}`}
      style={{
        fontFamily: SWISS_FONTS.body,
        color,
        textDecoration: underline ? 'underline' : 'none',
        textDecorationColor: color,
        transition: 'color 0.2s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.target.style.color = hoverColor;
        if (underline) {
          e.target.style.textDecorationColor = hoverColor;
        }
      }}
      onMouseLeave={(e) => {
        e.target.style.color = color;
        if (underline) {
          e.target.style.textDecorationColor = color;
        }
      }}
    >
      {children}
    </a>
  );
};

export { SWISS_FONTS, SWISS_SCALE };