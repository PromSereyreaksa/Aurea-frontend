/**
 * Serene Gallery Section - Asymmetric grid layout
 */

import React from 'react';
import { motion } from 'framer-motion';

const SereneGallery = ({ content, styling, isEditing, onChange }) => {
  const { colors, fonts } = styling;

  const images = content.images || [];

  return (
    <section
      id="gallery"
      className="py-20 px-6"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl font-serif"
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => isEditing && onChange('heading', e.target.textContent)}
            style={{
              fontFamily: fonts.headingFont,
              color: colors.primary
            }}
          >
            {content.heading || 'My Work'}
          </h2>
        </motion.div>

        {/* Gallery Grid - Asymmetric Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {images.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative group ${
                index % 4 === 0 ? 'md:col-span-2 md:row-span-2' :
                index % 5 === 0 ? 'md:col-span-2' :
                'md:col-span-1'
              }`}
            >
              {/* Image */}
              <div className="relative overflow-hidden rounded-lg aspect-square">
                {item.image ? (
                  <>
                    <img
                      src={item.image}
                      alt={item.title || `Gallery image ${index + 1}`}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Overlay with info */}
                    {!isEditing && (item.title || item.description || item.price) && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        {item.title && (
                          <h3
                            className="text-white text-xl font-serif mb-2"
                            style={{ fontFamily: fonts.headingFont }}
                          >
                            {item.title}
                          </h3>
                        )}
                        {item.description && (
                          <p
                            className="text-white/90 text-sm mb-2"
                            style={{ fontFamily: fonts.bodyFont }}
                          >
                            {item.description}
                          </p>
                        )}
                        {item.price && (
                          <p
                            className="text-white font-semibold"
                            style={{ fontFamily: fonts.bodyFont }}
                          >
                            {item.price}
                          </p>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  isEditing && (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <p className="text-gray-400">Click to add image</p>
                    </div>
                  )
                )}
              </div>

              {/* Caption */}
              {!isEditing && item.caption && (
                <p
                  className="mt-3 text-sm opacity-70 text-center"
                  style={{
                    fontFamily: fonts.bodyFont,
                    color: colors.textSecondary
                  }}
                >
                  {item.caption}
                </p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {!isEditing && images.length === 0 && (
          <div
            className="text-center py-20"
            style={{ color: colors.textSecondary }}
          >
            <p style={{ fontFamily: fonts.bodyFont }}>
              No gallery images yet
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SereneGallery;