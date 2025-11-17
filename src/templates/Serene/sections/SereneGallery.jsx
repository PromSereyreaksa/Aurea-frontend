/**
 * Serene Gallery Section - Blossom-style masonry grid with CSS Grid
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useImageUpload } from '../../../hooks/useImageUpload';

const SereneGallery = ({ content, styling, isEditing, onChange, portfolioId, baseUrl = '/template-preview/serene' }) => {
  const { colors, fonts } = styling;
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const { uploadImage } = useImageUpload();
  const navigate = useNavigate();

  // First row - 3 items (masonry: medium-tall, short, medium) - NO IMAGES, just placeholders
  const defaultFirstRow = [
    { image: '', title: 'Project Title', description: 'Project description', span: 2 },
    { image: '', title: 'Project Title', description: 'Project description', span: 1 },
    { image: '', title: 'Project Title', description: 'Project description', span: 2 },
  ];

  // Second row - 4 items (masonry: medium, tall, medium, medium) - NO IMAGES, just placeholders
  const defaultSecondRow = [
    { image: '', title: 'Project Title', description: 'Project description', span: 2 },
    { image: '', title: 'Project Title', description: 'Project description', span: 3 },
    { image: '', title: 'Project Title', description: 'Project description', span: 2 },
    { image: '', title: 'Project Title', description: 'Project description', span: 2 },
  ];

  // Third row - 3 items (masonry: medium, medium, short) - NO IMAGES, just placeholders
  const defaultThirdRow = [
    { image: '', title: 'Project Title', description: 'Project description', span: 2 },
    { image: '', title: 'Project Title', description: 'Project description', span: 2 },
    { image: '', title: 'Project Title', description: 'Project description', span: 1 },
  ];

  // ALWAYS show all placeholder slots by merging saved data with defaults
  // This ensures we always show 3+4+3=10 slots even if user only uploaded 1 image
  const mergeWithDefaults = (savedRow, defaultRow) => {
    if (!savedRow || savedRow.length === 0) {
      // No saved data - use all defaults
      return defaultRow;
    }

    // Ensure we have at least as many items as defaults
    const result = [...defaultRow];

    // Overlay saved items at their indices
    savedRow.forEach((savedItem, index) => {
      if (index < result.length) {
        result[index] = {
          ...result[index],
          ...savedItem
        };
      } else {
        // Saved data has more items than default - append them
        result.push(savedItem);
      }
    });

    return result;
  };

  const displayFirstRow = mergeWithDefaults(content.firstRow, defaultFirstRow);
  const displaySecondRow = mergeWithDefaults(content.secondRow, defaultSecondRow);
  const displayThirdRow = mergeWithDefaults(content.thirdRow, defaultThirdRow);

  // Stable helper function to update row data (avoids stale closure)
  const updateRowImage = (rowType, index, imageUrl) => {
    // Always read fresh data from props via mergeWithDefaults
    const currentFirstRow = mergeWithDefaults(content.firstRow, defaultFirstRow);
    const currentSecondRow = mergeWithDefaults(content.secondRow, defaultSecondRow);
    const currentThirdRow = mergeWithDefaults(content.thirdRow, defaultThirdRow);

    const rowData = rowType === 'firstRow' ? currentFirstRow :
                    rowType === 'secondRow' ? currentSecondRow : currentThirdRow;

    const updatedRow = [...rowData];
    updatedRow[index] = {
      ...updatedRow[index],
      image: imageUrl
    };

    onChange(rowType, updatedRow);
  };

  // Handle image upload with instant preview (Echelon-style)
  const handleImageUpload = async (rowType, index, file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 25MB)
    if (file.size > 25 * 1024 * 1024) {
      alert('File size must be less than 25MB');
      return;
    }

    console.log(`📤 Starting optimized upload for ${rowType} image ${index}...`);

    // 1. INSTANT PREVIEW - Show blob URL immediately
    const localPreview = URL.createObjectURL(file);
    updateRowImage(rowType, index, localPreview);  // ✅ Uses stable callback

    // 2. Mark as uploading
    setUploadingIndex(`${rowType}-${index}`);

    try {
      // 3. Upload with all optimizations (compression, progress, direct upload)
      const cloudinaryUrl = await uploadImage(file, {
        compress: true,
        direct: true,
      });

      console.log(`✅ Upload complete for ${rowType} image ${index}:`, cloudinaryUrl);

      // 4. Replace blob URL with final Cloudinary URL
      updateRowImage(rowType, index, cloudinaryUrl);  // ✅ Uses stable callback

      // Clean up blob URL
      URL.revokeObjectURL(localPreview);

    } catch (error) {
      console.error('❌ Upload error:', error);
      alert(`Failed to upload image: ${error.message}`);
    } finally {
      // 5. Clear uploading state
      setUploadingIndex(null);
    }
  };

  const ProductCard = ({ product, index, rowType }) => {
    // Calculate height based on span (280px base * span) - full screen layout
    const height = `${(product.span || 2) * 280}px`;
    const isUploading = uploadingIndex === `${rowType}-${index}`;

    return (
      <div
        key={index}
        className="group"
        style={{ gridRow: `span ${product.span || 2}` }}
      >
        <div
          className="relative overflow-hidden w-full transition-all duration-200 rounded-sm h-full"
          style={{
            backgroundColor: '#f3f4f6',
            cursor: 'pointer'
          }}
          onClick={() => {
            if (isEditing) {
              document.getElementById(`file-input-${rowType}-${index}`).click();
            } else if (product.id) {
              // Navigate to project detail page
              const projectUrl = portfolioId
                ? `/portfolio-builder/${portfolioId}/project/${product.id}`
                : `${baseUrl}/project/${product.id}`;
              navigate(projectUrl);
            }
          }}
        >
          {/* Hidden file input */}
          {isEditing && (
            <input
              id={`file-input-${rowType}-${index}`}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  handleImageUpload(rowType, index, file);
                }
                // Reset input so same file can be selected again
                e.target.value = '';
              }}
            />
          )}

          {/* Echelon-style upload progress badge */}
          {isUploading && (
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: colors.primary || '#4a5568',
              color: '#FFFFFF',
              padding: '8px 14px',
              borderRadius: '4px',
              fontFamily: fonts.bodyFont,
              fontSize: '10px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              zIndex: 10,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderTop: '2px solid #FFFFFF',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }}></div>
              <span>Optimizing...</span>
            </div>
          )}

          {/* Show image (either blob preview or final URL) */}
          {product.image && product.image.trim() !== '' ? (
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {isEditing && (
                  <p className="text-gray-400 text-xs mt-2">Click to upload</p>
                )}
              </div>
            </div>
          )}

          {/* Hover overlay with "View Details" button (only in preview mode) */}
          {!isEditing && product.image && product.id && (
            <div
              className="group-hover:opacity-100 opacity-0 transition-opacity duration-300"
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none'
              }}
            >
              <div style={{
                fontFamily: fonts.bodyFont,
                fontSize: '14px',
                padding: '12px 24px',
                backgroundColor: colors.background,
                color: colors.primary,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 600,
                borderRadius: '2px'
              }}>
                View Details
              </div>
            </div>
          )}
        </div>
        <div className="mt-3 md:mt-4 lg:mt-5 space-y-1 md:space-y-2">
          <h3
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (isEditing) {
                const rowData = rowType === 'firstRow' ? displayFirstRow :
                                rowType === 'secondRow' ? displaySecondRow : displayThirdRow;
                const updatedRow = [...rowData];
                updatedRow[index] = {
                  ...updatedRow[index],
                  title: e.target.textContent
                };
                onChange(rowType, updatedRow);
              }
            }}
            className="text-base md:text-lg lg:text-xl break-words"
            style={{
              color: '#4a5568',
              fontFamily: fonts.bodyFont,
              fontWeight: 600,
              lineHeight: '1.3',
              outline: isEditing ? '1px dashed transparent' : 'none',
              cursor: isEditing ? 'text' : 'default',
              wordBreak: 'break-word',
              overflowWrap: 'break-word'
            }}
            onFocus={(e) => {
              if (isEditing) {
                e.target.style.outline = '1px dashed #999';
              }
            }}
            onBlurCapture={(e) => {
              e.target.style.outline = '1px dashed transparent';
            }}
          >
            {product.title}
          </h3>
          <p
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (isEditing) {
                const rowData = rowType === 'firstRow' ? displayFirstRow :
                                rowType === 'secondRow' ? displaySecondRow : displayThirdRow;
                const updatedRow = [...rowData];
                updatedRow[index] = {
                  ...updatedRow[index],
                  description: e.target.textContent
                };
                onChange(rowType, updatedRow);
              }
            }}
            className="text-sm md:text-base break-words"
            style={{
              color: '#6b7280',
              fontFamily: fonts.bodyFont,
              fontWeight: 500,
              lineHeight: '1.5',
              outline: isEditing ? '1px dashed transparent' : 'none',
              cursor: isEditing ? 'text' : 'default',
              wordBreak: 'break-word',
              overflowWrap: 'break-word'
            }}
            onFocus={(e) => {
              if (isEditing) {
                e.target.style.outline = '1px dashed #999';
              }
            }}
            onBlurCapture={(e) => {
              e.target.style.outline = '1px dashed transparent';
            }}
          >
            {product.description}
          </p>
        </div>
      </div>
    );
  };

  return (
    <section
        id="gallery"
        className="py-12 md:py-16 lg:py-20"
        style={{ backgroundColor: colors.background }}
      >
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 max-w-[1800px] mx-auto">
        {/* First Row: Hero Text on Left + 3 Images on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,400px)_1fr] gap-8 md:gap-12 lg:gap-16 xl:gap-20 mb-12 md:mb-16 lg:mb-20">
          {/* Hero Text - Left Column */}
          <div className="space-y-6 md:space-y-8 lg:space-y-10 lg:sticky lg:top-24 self-start">
            <div
              className="leading-[1.7] text-base md:text-lg lg:text-xl break-words"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => isEditing && onChange('heroText1', e.target.textContent)}
              style={{
                color: colors.text,
                fontFamily: fonts.bodyFont,
                fontWeight: 600,
                paddingTop: '4px',
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
            >
              {content.heroText1 || (isEditing ? 'Click to edit: Add your compelling introduction here. Share what makes your work unique and captivating.' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.')}
            </div>
            <div
              className="leading-[1.7] text-base md:text-lg lg:text-xl break-words"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => isEditing && onChange('heroText2', e.target.textContent)}
              style={{
                color: colors.text,
                fontFamily: fonts.bodyFont,
                fontWeight: 600,
                paddingTop: '4px',
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
            >
              {content.heroText2 || (isEditing ? 'Click to edit: Tell your audience about your creative process, expertise, or what drives your passion.' : 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')}
            </div>
          </div>

          {/* First Row - 3 Images (Masonry) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 auto-rows-[200px] sm:auto-rows-[240px] lg:auto-rows-[280px]">
            {displayFirstRow.map((product, index) => (
              <ProductCard key={index} product={product} index={index} rowType="firstRow" />
            ))}
          </div>
        </div>

        {/* Second Row - 4 Images (Masonry) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 auto-rows-[200px] sm:auto-rows-[240px] lg:auto-rows-[280px] mb-12 md:mb-16 lg:mb-20">
          {displaySecondRow.map((product, index) => (
            <ProductCard key={index} product={product} index={index} rowType="secondRow" />
          ))}
        </div>

        {/* Third Row - 3 Images (Masonry) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 auto-rows-[200px] sm:auto-rows-[240px] lg:auto-rows-[280px]">
          {displayThirdRow.map((product, index) => (
            <ProductCard key={index} product={product} index={index} rowType="thirdRow" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SereneGallery;