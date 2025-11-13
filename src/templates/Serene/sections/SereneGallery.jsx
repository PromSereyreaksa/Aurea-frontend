/**
 * Serene Gallery Section - Blossom-style masonry grid with CSS Grid
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ImageCropModal from '../../../components/Shared/ImageCropModal';

const SereneGallery = ({ content, styling, isEditing, onChange }) => {
  const { colors, fonts } = styling;
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [cropModalState, setCropModalState] = useState(null); // { imageUrl, rowType, index }

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

  // Handle image selection and show crop modal
  const handleImageSelect = (rowType, index, file) => {
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

    // Create preview URL and show crop modal
    const imageUrl = URL.createObjectURL(file);
    setCropModalState({ imageUrl, rowType, index, originalFile: file });
  };

  // Handle cropped image upload
  const handleCroppedImageUpload = async (croppedBlob) => {
    if (!cropModalState) return;

    const { rowType, index } = cropModalState;
    setUploadingIndex(`${rowType}-${index}`);

    try {
      // Convert blob to File object with proper metadata
      const croppedFile = new File(
        [croppedBlob],
        'cropped-image.jpg',
        { type: 'image/jpeg', lastModified: Date.now() }
      );

      const formData = new FormData();
      formData.append('image', croppedFile);

      console.log('Uploading cropped image:', {
        size: croppedFile.size,
        type: croppedFile.type,
        name: croppedFile.name
      });

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/upload/single`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('aurea_token') || ''}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload error response:', errorText);
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success && result.data?.url) {
        // Update the specific row's image
        const rowData = rowType === 'firstRow' ? displayFirstRow :
                        rowType === 'secondRow' ? displaySecondRow : displayThirdRow;
        const updatedRow = [...rowData];
        updatedRow[index] = {
          ...updatedRow[index],
          image: result.data.url
        };
        onChange(rowType, updatedRow);
        console.log('Image uploaded successfully:', result.data.url);
      } else {
        throw new Error(result.message || 'Upload failed - no URL returned');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Failed to upload image: ${error.message}`);
    } finally {
      setUploadingIndex(null);
      setCropModalState(null);
      // Clean up the preview URL
      if (cropModalState?.imageUrl) {
        URL.revokeObjectURL(cropModalState.imageUrl);
      }
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
          className="relative overflow-hidden w-full transition-all duration-200 rounded-sm"
          style={{
            backgroundColor: '#f3f4f6',
            height: height,
            cursor: isEditing ? 'pointer' : 'default'
          }}
          onClick={() => {
            if (isEditing) {
              document.getElementById(`file-input-${rowType}-${index}`).click();
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
                  handleImageSelect(rowType, index, file);
                }
                // Reset input so same file can be selected again
                e.target.value = '';
              }}
            />
          )}

          {isUploading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-gray-500 text-xs">Uploading...</p>
              </div>
            </div>
          ) : product.image && product.image !== '__EMPTY__' ? (
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
        </div>
        <div className="mt-5">
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
            className="mb-2"
            style={{
              color: '#4a5568',
              fontFamily: fonts.bodyFont,
              fontWeight: 500,
              fontSize: '24px',
              lineHeight: '1.4',
              outline: isEditing ? '1px dashed transparent' : 'none',
              cursor: isEditing ? 'text' : 'default'
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
            style={{
              color: '#6b7280',
              fontFamily: fonts.bodyFont,
              fontWeight: 500,
              fontSize: '18px',
              outline: isEditing ? '1px dashed transparent' : 'none',
              cursor: isEditing ? 'text' : 'default'
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
    <>
      {/* Image Crop Modal */}
      {cropModalState && (
        <ImageCropModal
          imageUrl={cropModalState.imageUrl}
          onCropComplete={handleCroppedImageUpload}
          onClose={() => {
            if (cropModalState?.imageUrl) {
              URL.revokeObjectURL(cropModalState.imageUrl);
            }
            setCropModalState(null);
          }}
        />
      )}

      <section
        id="gallery"
        className="py-16"
        style={{ backgroundColor: colors.background }}
      >
      <div className="px-8">
        {/* First Row: Hero Text on Left + 3 Images on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-16 mb-20">
          {/* Hero Text - Left Column */}
          <div className="space-y-10">
            <div
              className="leading-[1.7]"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => isEditing && onChange('heroText1', e.target.textContent)}
              style={{
                color: colors.text,
                fontFamily: fonts.bodyFont,
                fontWeight: 600,
                fontSize: '21px',
                paddingTop: '4px'
              }}
            >
              {content.heroText1 || (isEditing ? 'Click to edit: Add your compelling introduction here. Share what makes your work unique and captivating.' : 'Melbourne-based tattoo artist Rachel Garcia creates tattoos inspired by nature with a soft watercolor technique.')}
            </div>
            <div
              className="leading-[1.7]"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => isEditing && onChange('heroText2', e.target.textContent)}
              style={{
                color: colors.text,
                fontFamily: fonts.bodyFont,
                fontWeight: 600,
                fontSize: '21px',
                paddingTop: '4px'
              }}
            >
              {content.heroText2 || (isEditing ? 'Click to edit: Tell your audience about your creative process, expertise, or what drives your passion.' : 'Her delicate, nostalgic flowers, plants and birds are inked with the precision of scientific illustrations (grandma would approve).')}
            </div>
          </div>

          {/* First Row - 3 Images (Masonry) */}
          <div className="grid grid-cols-3 gap-8 auto-rows-[280px]">
            {displayFirstRow.map((product, index) => (
              <ProductCard key={index} product={product} index={index} rowType="firstRow" />
            ))}
          </div>
        </div>

        {/* Second Row - 4 Images (Masonry) */}
        <div className="grid grid-cols-4 gap-8 auto-rows-[280px] mb-20">
          {displaySecondRow.map((product, index) => (
            <ProductCard key={index} product={product} index={index} rowType="secondRow" />
          ))}
        </div>

        {/* Third Row - 3 Images (Masonry) */}
        <div className="grid grid-cols-3 gap-8 auto-rows-[280px]">
          {displayThirdRow.map((product, index) => (
            <ProductCard key={index} product={product} index={index} rowType="thirdRow" />
          ))}
        </div>
      </div>
    </section>
    </>
  );
};

export default SereneGallery;