import React from 'react';

// Swiss Grid System Component
// Implements a 12-column grid with precise spacing and baseline alignment
// Fully responsive with mobile-first approach

export const SwissGrid = ({ 
  children, 
  className = '', 
  maxWidth = '1200px',
  margin = '80px',
  gutter = '24px'
}) => {
  return (
    <div 
      className={`swiss-grid ${className}`}
      style={{
        maxWidth,
        margin: '0 auto',
        padding: `0 clamp(16px, 5vw, ${margin})`, // Mobile: 16px, Desktop: margin value
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: `clamp(8px, 2vw, ${gutter})`, // Mobile: 8px, Desktop: gutter value
        alignItems: 'start'
      }}
    >
      {children}
    </div>
  );
};

// Grid Column Component
export const GridCol = ({ 
  span = 1, 
  spanMd = null, 
  spanLg = null,
  offset = 0,
  children,
  className = ''
}) => {
  const getGridColumn = (spanValue, offsetValue = 0) => {
    const start = offsetValue + 1;
    const end = start + spanValue;
    return `${start} / ${end}`;
  };

  return (
    <div
      className={`grid-col ${className}`}
      style={{
        gridColumn: getGridColumn(span, offset),
        // Responsive behavior can be added with CSS-in-JS or styled-components
        '@media (min-width: 768px)': spanMd ? {
          gridColumn: getGridColumn(spanMd, offset)
        } : {},
        '@media (min-width: 1024px)': spanLg ? {
          gridColumn: getGridColumn(spanLg, offset)  
        } : {}
      }}
    >
      {children}
    </div>
  );
};

// Baseline Text Component - ensures text aligns to baseline grid
export const BaselineText = ({ 
  children, 
  size = '18px', 
  lineHeight = 1.4,
  baseline = '8px',
  className = '',
  as = 'p'
}) => {
  const Component = as;
  
  const baselineHeight = parseFloat(size) * lineHeight;
  const baselineUnits = Math.ceil(baselineHeight / parseFloat(baseline));
  const adjustedLineHeight = (baselineUnits * parseFloat(baseline)) / parseFloat(size);

  return (
    <Component
      className={`baseline-text ${className}`}
      style={{
        fontSize: size,
        lineHeight: adjustedLineHeight,
        marginBottom: `${baselineUnits * parseFloat(baseline)}px`
      }}
    >
      {children}
    </Component>
  );
};

export default SwissGrid;