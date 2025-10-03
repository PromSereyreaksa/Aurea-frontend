import React, { useState, useRef } from 'react';
import { COLORS, GRID, TYPOGRAPHY, MOTION } from '../../Echolon/constants';

/**
 * MyDomeGallery - Swiss-style photography gallery
 * Optimized for dark background with proper contrast and visibility
 * Maintains grid precision while creating asymmetric visual rhythm
 */
const MyDomeGallery = ({ 
  images = [],
  title = "Photography",
  className = "",
  isPreviewMode = false
}) => {
  const [activeImage, setActiveImage] = useState(null);
  const [imageLoadStates, setImageLoadStates] = useState({});
  
  // Default grey placeholders - no external images
  const defaultImages = [
    {
      url: null, // Grey placeholder
      title: 'Project Alpha',
      meta: '2024 / Design Study'
    },
    {
      url: null, // Grey placeholder
      title: 'System Beta',
      meta: '2024 / Visual Identity'
    },
    {
      url: null, // Grey placeholder
      title: 'Interface Gamma',
      meta: '2024 / Digital Product'
    },
    {
      url: null, // Grey placeholder
      title: 'Brand Delta',
      meta: '2024 / Corporate Identity'
    },
    {
      url: null, // Grey placeholder
      title: 'Publication Epsilon',
      meta: '2024 / Editorial Design'
    },
    {
      url: null, // Grey placeholder
      title: 'Exhibition Zeta',
      meta: '2024 / Spatial Design'
    }
  ];
  
  // Use provided images or fallback to defaults
  const galleryImages = images.length > 0 ? images : defaultImages;
  
  const handleImageLoad = (imageId) => {
    setImageLoadStates(prev => ({
      ...prev,
      [imageId]: true
    }));
  };

  // Swiss grid-based asymmetric layout patterns
  const getImageSpan = (index) => {
    const patterns = [
      { cols: 8, rows: 6 }, // Large feature
      { cols: 4, rows: 4 }, // Square medium
      { cols: 6, rows: 3 }, // Wide landscape
      { cols: 3, rows: 6 }, // Tall portrait
      { cols: 4, rows: 3 }, // Medium landscape
      { cols: 5, rows: 4 }, // Slightly wide
      { cols: 7, rows: 5 }, // Large landscape
      { cols: 3, rows: 4 }  // Small portrait
    ];
    return patterns[index % patterns.length];
  };

  const renderImage = (image, index) => {
    const { cols, rows } = getImageSpan(index);
    const imageId = `gallery-${index}`;
    const isLoaded = imageLoadStates[imageId];
    
    return (
      <div
        key={imageId}
        className={`relative overflow-hidden cursor-pointer group ${
          isPreviewMode ? 'transition-transform duration-300 hover:scale-105' : ''
        }`}
        style={{
          gridColumn: `span ${cols}`,
          aspectRatio: `${cols}/${rows}`,
          minHeight: `${rows * (GRID.BASELINE * 3)}px`
        }}
        onClick={() => setActiveImage(image)}
      >
        {/* Grey Placeholder Box */}
        <div 
          className="w-full h-full flex items-center justify-center"
          style={{ 
            backgroundColor: '#333333',
            border: `1px solid ${COLORS.SILVER_GREY}40`
          }}
        >
          <div 
            className="w-12 h-1"
            style={{ backgroundColor: COLORS.SILVER_GREY }}
          />
        </div>
        
        {/* Swiss-style overlay info */}
        <div 
          className={`absolute bottom-0 left-0 right-0 p-4 ${
            isPreviewMode ? 'transform translate-y-full group-hover:translate-y-0 transition-transform duration-300' : ''
          }`}
          style={{
            background: `linear-gradient(transparent, ${COLORS.CARBON_BLACK}DD)`
          }}
        >
          {image.title && (
            <h4 
              className="mb-1 uppercase tracking-tight"
              style={{
                fontFamily: TYPOGRAPHY.HEADING.FAMILY,
                fontWeight: TYPOGRAPHY.HEADING.WEIGHT,
                fontSize: '14px',
                color: COLORS.WHITE,
                letterSpacing: TYPOGRAPHY.HEADING.LETTER_SPACING
              }}
            >
              {image.title}
            </h4>
          )}
          
          {image.meta && (
            <p 
              className="text-xs"
              style={{
                fontFamily: TYPOGRAPHY.MONO.FAMILY,
                color: COLORS.SILVER_GREY,
                letterSpacing: TYPOGRAPHY.MONO.LETTER_SPACING
              }}
            >
              {image.meta}
            </p>
          )}
        </div>
        
        {/* Swiss precision border */}
        <div 
          className="absolute inset-0 border pointer-events-none"
          style={{ borderColor: `${COLORS.SILVER_GREY}33` }}
        />
      </div>
    );
  };

  const showHeader = Boolean(title);

  return (
    <div className={`w-full ${className}`}>
      {/* Section title with Swiss typography */}
      {showHeader && (
        <div 
          className="mb-8"
          style={{ marginBottom: `${GRID.BASELINE * 4}px` }}
        >
          <h3 
            className="uppercase tracking-tight"
            style={{
              fontFamily: TYPOGRAPHY.HEADING.FAMILY,
              fontWeight: TYPOGRAPHY.HEADING.WEIGHT,
              fontSize: '24px',
              color: COLORS.WHITE,
              letterSpacing: TYPOGRAPHY.HEADING.LETTER_SPACING,
              marginBottom: `${GRID.BASELINE}px`
            }}
          >
            {title}
          </h3>
          
          {/* Swiss hairline divider */}
          <div 
            className="w-full h-px"
            style={{ backgroundColor: COLORS.SILVER_GREY }}
          />
        </div>
      )}
      
      {/* Asymmetric grid gallery */}
      <div 
        className="grid gap-5 w-full"
        style={{
          gridTemplateColumns: `repeat(12, 1fr)`,
          gap: `${GRID.GUTTER}px`
        }}
      >
        {galleryImages.map((image, index) => renderImage(image, index))}
      </div>
      
      {/* Lightbox modal */}
      {activeImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-8"
          style={{ backgroundColor: `${COLORS.CARBON_BLACK}E6` }}
          onClick={() => setActiveImage(null)}
        >
          <div className="relative max-w-5xl max-h-full">
            <img
              src={activeImage.url}
              alt={activeImage.title}
              className="max-w-full max-h-full object-contain"
              style={{ filter: 'contrast(110%)' }}
            />
            
            {/* Close button */}
            <button
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center"
              style={{ 
                backgroundColor: COLORS.WHITE,
                color: COLORS.CARBON_BLACK
              }}
              onClick={(e) => {
                e.stopPropagation();
                setActiveImage(null);
              }}
            >
              ×
            </button>
            
            {/* Image info */}
            {(activeImage.title || activeImage.meta) && (
              <div 
                className="absolute bottom-4 left-4 right-4 p-4"
                style={{ backgroundColor: `${COLORS.CARBON_BLACK}DD` }}
              >
                {activeImage.title && (
                  <h4 
                    className="mb-1 uppercase tracking-tight"
                    style={{
                      fontFamily: TYPOGRAPHY.HEADING.FAMILY,
                      fontWeight: TYPOGRAPHY.HEADING.WEIGHT,
                      fontSize: '16px',
                      color: COLORS.WHITE,
                      letterSpacing: TYPOGRAPHY.HEADING.LETTER_SPACING
                    }}
                  >
                    {activeImage.title}
                  </h4>
                )}
                
                {activeImage.meta && (
                  <p 
                    style={{
                      fontFamily: TYPOGRAPHY.MONO.FAMILY,
                      fontSize: '12px',
                      color: COLORS.SILVER_GREY,
                      letterSpacing: TYPOGRAPHY.MONO.LETTER_SPACING
                    }}
                  >
                    {activeImage.meta}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDomeGallery;