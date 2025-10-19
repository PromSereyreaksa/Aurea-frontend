/**
 * Dynamic Gallery Section Component
 *
 * Renders image gallery section dynamically based on template schema
 * Supports grid, masonry, and carousel layouts
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../utils/cn';

const DynamicGallerySection = ({
  id,
  config,
  content = {},
  styling = {},
  isEditing = false,
  onChange,
  portfolioId,
}) => {
  const [editingField, setEditingField] = useState(null);
  const [editingImage, setEditingImage] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  // Get variant/layout from config
  const variant = config.variant || config.layout || 'grid';

  // Get section styling
  const sectionStyling = config.styling || {};
  const backgroundColor = sectionStyling.backgroundColor || styling.colors?.background || '#FFFFFF';
  const textColor = styling.colors?.text || '#000000';
  const padding = sectionStyling.padding || 'default';

  // Get fields from schema
  const fields = config.fields || [];

  // Get field value
  const getFieldValue = (fieldId) => {
    return content[fieldId] || '';
  };

  // Handle field change
  const handleFieldChange = (fieldId, value) => {
    if (onChange) {
      onChange(fieldId, value);
    }
  };

  // Handle image change
  const handleImageChange = (index, field, value) => {
    const images = getFieldValue('images') || [];
    const updated = [...images];
    if (!updated[index]) {
      updated[index] = {};
    }
    updated[index][field] = value;
    handleFieldChange('images', updated);
  };

  // Add new image
  const handleAddImage = () => {
    const images = getFieldValue('images') || [];
    const newImage = {
      src: '',
      caption: `Image ${images.length + 1}`,
      meta: String(images.length + 1).padStart(2, '0')
    };
    handleFieldChange('images', [...images, newImage]);
  };

  // Remove image
  const handleRemoveImage = (index) => {
    const images = getFieldValue('images') || [];
    const updated = images.filter((_, i) => i !== index);
    handleFieldChange('images', updated);
  };

  // Render heading
  const renderHeading = () => {
    const headingField = fields.find(f => f.id === 'heading');
    if (!headingField) return null;

    const value = getFieldValue(headingField.id);

    return (
      <div className="mb-12">
        {isEditing ? (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(headingField.id, e.target.value)}
            onFocus={() => setEditingField(headingField.id)}
            onBlur={() => setEditingField(null)}
            placeholder={headingField.placeholder || 'Gallery Heading'}
            className={cn(
              'text-5xl font-bold w-full bg-transparent border-b-2 transition-all',
              editingField === headingField.id ? 'border-orange-500' : 'border-gray-300',
              'focus:outline-none focus:border-orange-500 px-2 py-1'
            )}
            style={{ color: textColor, fontFamily: styling.fonts?.heading }}
          />
        ) : (
          <h2
            className="text-5xl font-bold"
            style={{ color: textColor, fontFamily: styling.fonts?.heading }}
          >
            {value || config.name || 'Gallery'}
          </h2>
        )}
      </div>
    );
  };

  // Render single image
  const renderImage = (image, index) => {
    const isActive = editingImage === index;

    return (
      <motion.div
        key={index}
        className={cn(
          'relative group overflow-hidden',
          isEditing && 'border-2 border-dashed',
          isActive ? 'border-orange-500' : 'border-transparent'
        )}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
        onClick={() => {
          if (isEditing) {
            setEditingImage(index);
          } else if (image.src) {
            setLightboxImage(image);
          }
        }}
      >
        {/* Image */}
        <div className="relative aspect-square bg-gray-100 rounded overflow-hidden">
          {isEditing && (
            <div className="absolute inset-0 z-10 flex items-center justify-center p-4 bg-black/20">
              <input
                type="url"
                value={image.src || ''}
                onChange={(e) => handleImageChange(index, 'src', e.target.value)}
                placeholder="Image URL"
                className="w-full text-center bg-white border-2 border-gray-300 rounded px-4 py-2 focus:border-orange-500 focus:outline-none"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          {image.src ? (
            <img
              src={image.src}
              alt={image.caption || `Gallery image ${index + 1}`}
              className={cn(
                'w-full h-full object-cover',
                !isEditing && 'transition-transform duration-300 group-hover:scale-110 cursor-pointer'
              )}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600?text=Invalid+Image';
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <span className="text-gray-400">No image</span>
            </div>
          )}

          {/* Meta overlay */}
          {image.meta && !isEditing && (
            <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-3 py-1 rounded-full font-mono">
              {image.meta}
            </div>
          )}

          {/* Hover overlay */}
          {!isEditing && image.src && (
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Caption */}
        <div className="mt-3">
          {isEditing ? (
            <>
              <input
                type="text"
                value={image.caption || ''}
                onChange={(e) => handleImageChange(index, 'caption', e.target.value)}
                placeholder="Caption"
                className="w-full border-b-2 border-gray-300 focus:border-orange-500 focus:outline-none px-2 py-1 mb-2"
                onClick={(e) => e.stopPropagation()}
              />
              <input
                type="text"
                value={image.meta || ''}
                onChange={(e) => handleImageChange(index, 'meta', e.target.value)}
                placeholder="Meta (e.g., 01)"
                className="w-full text-sm border-b-2 border-gray-300 focus:border-orange-500 focus:outline-none px-2 py-1"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage(index);
                }}
                className="mt-2 text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Remove
              </button>
            </>
          ) : (
            image.caption && (
              <p
                className="text-sm"
                style={{ color: styling.colors?.textSecondary || '#666' }}
              >
                {image.caption}
              </p>
            )
          )}
        </div>
      </motion.div>
    );
  };

  // Padding classes
  const paddingClasses = {
    tight: 'py-12 px-6',
    default: 'py-20 px-8',
    relaxed: 'py-32 px-12',
  }[padding] || 'py-20 px-8';

  // Get images
  const images = getFieldValue('images') || [];

  // Render based on variant
  const renderVariant = () => {
    switch (variant) {
      case 'image_grid_swiss':
      case 'grid':
        return (
          <div className="max-w-7xl mx-auto">
            {renderHeading()}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((image, index) => renderImage(image, index))}
              {isEditing && (
                <button
                  onClick={handleAddImage}
                  className="aspect-square border-2 border-dashed border-gray-300 hover:border-orange-500 rounded flex flex-col items-center justify-center transition-colors group"
                >
                  <svg
                    className="w-12 h-12 text-gray-400 group-hover:text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-gray-500 group-hover:text-orange-500 text-sm mt-2">
                    Add Image
                  </span>
                </button>
              )}
            </div>
          </div>
        );

      case 'asymmetric_grid':
      case 'masonry':
        return (
          <div className="max-w-7xl mx-auto">
            {renderHeading()}
            <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
              {images.map((image, index) => renderImage(image, index))}
              {isEditing && (
                <button
                  onClick={handleAddImage}
                  className="w-full aspect-square border-2 border-dashed border-gray-300 hover:border-orange-500 rounded flex flex-col items-center justify-center transition-colors group break-inside-avoid"
                >
                  <svg
                    className="w-12 h-12 text-gray-400 group-hover:text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-gray-500 group-hover:text-orange-500 text-sm mt-2">
                    Add Image
                  </span>
                </button>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="max-w-6xl mx-auto">
            {renderHeading()}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {images.map((image, index) => renderImage(image, index))}
              {isEditing && (
                <button
                  onClick={handleAddImage}
                  className="aspect-video border-2 border-dashed border-gray-300 hover:border-orange-500 rounded flex flex-col items-center justify-center transition-colors group"
                >
                  <span className="text-6xl text-gray-400 group-hover:text-orange-500">+</span>
                  <span className="text-gray-500 group-hover:text-orange-500 mt-2">Add Image</span>
                </button>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <motion.section
        id={id}
        className={cn('relative', paddingClasses)}
        style={{
          backgroundColor,
          backgroundImage: sectionStyling.background === 'gradient'
            ? 'linear-gradient(135deg, rgba(0,0,0,0.02) 0%, transparent 100%)'
            : undefined
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {renderVariant()}

        {/* Edit mode indicator */}
        {isEditing && (
          <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs px-2 py-1 rounded">
            Editing Gallery ({images.length} images)
          </div>
        )}
      </motion.section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              onClick={() => setLightboxImage(null)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <motion.div
              className="max-w-5xl max-h-full"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <img
                src={lightboxImage.src}
                alt={lightboxImage.caption}
                className="max-w-full max-h-[80vh] object-contain"
              />
              {lightboxImage.caption && (
                <p className="text-white text-center mt-4 text-lg">
                  {lightboxImage.caption}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DynamicGallerySection;
