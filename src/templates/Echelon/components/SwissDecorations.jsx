import React from 'react';

// Swiss-inspired decorative elements
export const SwissSpiral = ({ 
  size = 120, 
  position = 'top-right',
  color = '#FF0000',
  opacity = 0.1 
}) => {
  const positionStyles = {
    'top-right': { top: '60px', right: '80px' },
    'top-left': { top: '60px', left: '80px' },
    'bottom-right': { bottom: '60px', right: '80px' },
    'bottom-left': { bottom: '60px', left: '80px' },
    'center-right': { top: '50%', right: '80px', transform: 'translateY(-50%)' },
    'center-left': { top: '50%', left: '80px', transform: 'translateY(-50%)' }
  };

  return (
    <div
      style={{
        position: 'absolute',
        ...positionStyles[position],
        width: `${size}px`,
        height: `${size}px`,
        pointerEvents: 'none',
        zIndex: 1
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={`M${size/2} ${size/2}m-${size/2 - 10} 0a${size/2 - 10} ${size/2 - 10} 0 1 1 ${size - 20} 0a${size/2 - 20} ${size/2 - 20} 0 1 1 -${size - 40} 0a${size/2 - 30} ${size/2 - 30} 0 1 1 ${size - 60} 0`}
          stroke={color}
          strokeWidth="2"
          opacity={opacity}
          fill="none"
        />
      </svg>
    </div>
  );
};

export const SwissCircles = ({ 
  count = 3,
  position = 'top-right',
  color = '#000000',
  opacity = 0.05 
}) => {
  const positionStyles = {
    'top-right': { top: '40px', right: '40px' },
    'top-left': { top: '40px', left: '40px' },
    'bottom-right': { bottom: '40px', right: '40px' },
    'bottom-left': { bottom: '40px', left: '40px' }
  };

  return (
    <div
      style={{
        position: 'absolute',
        ...positionStyles[position],
        display: 'flex',
        gap: '20px',
        pointerEvents: 'none',
        zIndex: 1
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            width: `${60 + i * 20}px`,
            height: `${60 + i * 20}px`,
            border: `2px solid ${color}`,
            borderRadius: '50%',
            opacity: opacity - (i * 0.01)
          }}
        />
      ))}
    </div>
  );
};

export const SwissLines = ({ 
  orientation = 'vertical',
  position = 'left',
  count = 5,
  color = '#FF0000',
  opacity = 0.1 
}) => {
  const isVertical = orientation === 'vertical';
  const positionStyles = {
    left: { left: '40px', top: 0, bottom: 0 },
    right: { right: '40px', top: 0, bottom: 0 },
    top: { top: '40px', left: 0, right: 0 },
    bottom: { bottom: '40px', left: 0, right: 0 }
  };

  return (
    <div
      style={{
        position: 'absolute',
        ...positionStyles[position],
        display: 'flex',
        flexDirection: isVertical ? 'row' : 'column',
        gap: '24px',
        pointerEvents: 'none',
        zIndex: 1
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            width: isVertical ? '1px' : '100%',
            height: isVertical ? '100%' : '1px',
            backgroundColor: color,
            opacity: opacity
          }}
        />
      ))}
    </div>
  );
};

export const SwissGrid = ({ 
  columns = 4,
  rows = 4,
  position = 'center',
  size = 200,
  color = '#000000',
  opacity = 0.03 
}) => {
  const positionStyles = {
    center: { 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)' 
    },
    'top-center': { 
      top: '100px', 
      left: '50%', 
      transform: 'translateX(-50%)' 
    },
    'bottom-center': { 
      bottom: '100px', 
      left: '50%', 
      transform: 'translateX(-50%)' 
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        ...positionStyles[position],
        width: `${size}px`,
        height: `${size}px`,
        pointerEvents: 'none',
        zIndex: 1
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Vertical lines */}
        {Array.from({ length: columns + 1 }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={(size / columns) * i}
            y1={0}
            x2={(size / columns) * i}
            y2={size}
            stroke={color}
            strokeWidth="1"
            opacity={opacity}
          />
        ))}
        {/* Horizontal lines */}
        {Array.from({ length: rows + 1 }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1={0}
            y1={(size / rows) * i}
            x2={size}
            y2={(size / rows) * i}
            stroke={color}
            strokeWidth="1"
            opacity={opacity}
          />
        ))}
      </svg>
    </div>
  );
};