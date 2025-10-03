import React from 'react';

/**
 * SwissDarkVeil - A minimalist dark overlay for Swiss/International Typographic Style
 * Provides subtle depth while maintaining grid clarity and typographic hierarchy
 */
const SwissDarkVeil = ({ 
  opacity = 0.35,
  className = '',
  style = {},
  gridAlign = true
}) => {
  return (
    <div 
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        background: `
          linear-gradient(180deg, 
            rgba(10, 10, 10, ${opacity * 0.8}) 0%, 
            rgba(15, 15, 15, ${opacity * 0.6}) 25%,
            rgba(20, 20, 20, ${opacity * 0.4}) 50%,
            rgba(25, 25, 25, ${opacity * 0.6}) 75%,
            rgba(28, 28, 28, ${opacity * 0.8}) 100%
          )
        `,
        zIndex: 1,
        ...style
      }}
    >
      {/* Swiss grid-aligned vertical elements for subtle texture */}
      {gridAlign && (
        <div 
          className="absolute inset-0"
          style={{
            background: `
              repeating-linear-gradient(
                90deg,
                transparent 0px,
                transparent 80px,
                rgba(255, 255, 255, 0.01) 80px,
                rgba(255, 255, 255, 0.01) 82px,
                transparent 82px,
                transparent 100px
              )
            `
          }}
        />
      )}
      
      {/* Minimal noise for print-like texture */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 25% 25%, transparent 0%, rgba(0, 0, 0, ${opacity * 0.1}) 100%),
            radial-gradient(circle at 75% 75%, transparent 0%, rgba(0, 0, 0, ${opacity * 0.1}) 100%)
          `,
          opacity: 0.3
        }}
      />
    </div>
  );
};

export default SwissDarkVeil;