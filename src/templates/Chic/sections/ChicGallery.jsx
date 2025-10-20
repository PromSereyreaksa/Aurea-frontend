import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ChicGallery = ({ content = {}, styling = {}, isEditing = false, onContentChange }) => {
  const colors = styling.colors || {};
  const fonts = styling.fonts || {};
  const images = content.images || [];
  const [lightboxImage, setLightboxImage] = useState(null);

  const handleFieldChange = (field, value) => {
    if (onContentChange) {
      onContentChange('gallery', field, value);
    }
  };

  return (
    <>
      <section
        id="gallery"
        className="py-20 md:py-32"
        style={{
          backgroundColor: colors.surface || '#FFFFFF',
          color: colors.text || '#1B1B1B',
          paddingLeft: 'clamp(1rem, 5vw, 3rem)',
          paddingRight: 'clamp(1rem, 5vw, 3rem)'
        }}
      >
        <div className="mx-auto" style={{ maxWidth: '1200px' }}>
          {/* Section Heading */}
          {(content.heading || isEditing) && (
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => isEditing && handleFieldChange('heading', e.target.textContent)}
              style={{
                fontFamily: fonts.heading,
                fontWeight: 700,
                letterSpacing: '-0.02em'
              }}
            >
              {content.heading || 'Visual Work'}
            </motion.h2>
          )}

          {/* Masonry Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {images.map((image, index) => (
              <motion.div
                key={index}
                className="group relative overflow-hidden rounded-lg cursor-pointer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => !isEditing && setLightboxImage(image)}
                style={{
                  aspectRatio: index % 3 === 0 ? '4/5' : index % 3 === 1 ? '1/1' : '3/4'
                }}
              >
                {/* Image */}
                {image.src ? (
                  <div className="w-full h-full relative">
                    <img
                      src={image.src}
                      alt={image.title || image.caption || `Gallery image ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500"
                      style={{
                        transform: 'scale(1)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                      }}
                    />

                    {/* Overlay */}
                    <div
                      className="absolute inset-0 opacity-0 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: '#FFFFFF'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '0';
                      }}
                    >
                      {/* Meta Number */}
                      {image.meta && (
                        <div
                          className="text-xs mb-2 opacity-60"
                          style={{
                            fontFamily: fonts.mono,
                            letterSpacing: '0.1em'
                          }}
                        >
                          {image.meta}
                        </div>
                      )}

                      {/* Title */}
                      {image.title && (
                        <h3
                          className="text-lg font-bold mb-1"
                          style={{ fontFamily: fonts.heading }}
                        >
                          {image.title}
                        </h3>
                      )}

                      {/* Caption */}
                      {image.caption && (
                        <p
                          className="text-sm opacity-80"
                          style={{ fontFamily: fonts.body }}
                        >
                          {image.caption}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      backgroundColor: colors.border || '#E5E5E5',
                      border: isEditing ? `2px dashed ${colors.borderDark || '#CCCCCC'}` : 'none'
                    }}
                  >
                    {isEditing ? (
                      <p
                        style={{
                          fontFamily: fonts.body,
                          color: colors.textSecondary || '#A8A8A8',
                          fontSize: '0.875rem'
                        }}
                      >
                        Image {index + 1}
                      </p>
                    ) : (
                      <svg
                        className="w-12 h-12 opacity-20"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                  </div>
                )}
              </motion.div>
            ))}

            {/* Empty State */}
            {isEditing && images.length === 0 && (
              <div
                className="col-span-2 md:col-span-3 py-20 text-center rounded-2xl"
                style={{
                  backgroundColor: colors.border || '#E5E5E5',
                  border: `2px dashed ${colors.borderDark || '#CCCCCC'}`
                }}
              >
                <p
                  style={{
                    fontFamily: fonts.body,
                    color: colors.textSecondary || '#A8A8A8',
                    fontSize: '1.125rem'
                  }}
                >
                  No images yet. Add images to showcase your visual work.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              cursor: 'zoom-out'
            }}
          >
            <motion.div
              className="relative max-w-5xl max-h-[90vh]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={lightboxImage.src}
                alt={lightboxImage.title || lightboxImage.caption || 'Lightbox image'}
                className="max-w-full max-h-[90vh] object-contain"
              />

              {/* Close Button */}
              <button
                className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxImage(null);
                }}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Image Info */}
              {(lightboxImage.title || lightboxImage.caption) && (
                <div
                  className="absolute bottom-0 left-0 right-0 p-6 text-center"
                  style={{
                    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)',
                    color: '#FFFFFF'
                  }}
                >
                  {lightboxImage.title && (
                    <h3
                      className="text-xl font-bold mb-1"
                      style={{ fontFamily: fonts.heading }}
                    >
                      {lightboxImage.title}
                    </h3>
                  )}
                  {lightboxImage.caption && (
                    <p
                      className="text-sm opacity-80"
                      style={{ fontFamily: fonts.body }}
                    >
                      {lightboxImage.caption}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChicGallery;
