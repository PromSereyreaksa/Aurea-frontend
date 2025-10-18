/**
 * Serene Gallery Section - Blossom-style masonry grid with CSS Grid
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SereneGallery = ({ content, styling, isEditing, onChange }) => {
  const { colors, fonts } = styling;
  const [uploadingIndex, setUploadingIndex] = useState(null);

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

  // Always use the same data whether editing or previewing
  // If user has content, use it. Otherwise use defaults as placeholder
  const displayFirstRow = content.firstRow || defaultFirstRow;
  const displaySecondRow = content.secondRow || defaultSecondRow;
  const displayThirdRow = content.thirdRow || defaultThirdRow;

  // Handle image upload
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

    setUploadingIndex(`${rowType}-${index}`);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/upload/single`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('aurea_token') || ''}`
        }
      });

      if (!response.ok) {
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
    }
  };

  const ProductCard = ({ product, index, rowType }) => {
    // Calculate height based on span (280px base * span) - adjusted for better proportions
    const height = `${(product.span || 2) * 280}px`;
    const isUploading = uploadingIndex === `${rowType}-${index}`;

    return (
      <div
        key={index}
        className="group"
        style={{ gridRow: `span ${product.span || 2}` }}
      >
        <div
          className="relative overflow-hidden w-full transition-all duration-300 hover:shadow-lg rounded-md"
          style={{
            backgroundColor: '#fafafa',
            height: height,
            border: `1px solid ${colors.border || '#e0e0e0'}`,
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
                  handleImageUpload(rowType, index, file);
                }
              }}
            />
          )}

          {isUploading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-[#9e9b95] text-sm">Uploading...</p>
              </div>
            </div>
          ) : product.image ? (
            <div className="w-full h-full flex items-center justify-center p-4">
              <img
                src={product.image}
                alt={product.title}
                className="max-w-full max-h-full object-contain"
                loading="eager"
                style={{
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }}
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                {isEditing && (
                  <p className="text-[#9e9b95] text-sm">Click to upload image</p>
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
            style={{
              color: colors.text,
              fontFamily: fonts.bodyFont,
              fontWeight: 500,
              fontSize: '17px',
              paddingTop: '4px',
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
            className="mt-2"
            style={{
              color: colors.text,
              fontFamily: fonts.bodyFont,
              fontWeight: 500,
              fontSize: '15px',
              paddingTop: '4px',
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
    <section
      id="gallery"
      className="py-16"
      style={{ backgroundColor: colors.background }}
    >
      <div className="px-8">
        {/* First Row: Hero Text on Left + 3 Images on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-16 mb-20">
          {/* Hero Text - Left Column, no extra margin */}
          <div className="space-y-10">
            <div
              className="leading-[1.7]"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => isEditing && onChange('heroText1', e.target.textContent)}
              style={{
                color: colors.text,
                fontFamily: fonts.bodyFont,
                fontWeight: 500,
                fontSize: '18px',
                paddingTop: '4px'
              }}
            >
              {content.heroText1 || 'Craft your compelling story here. Share what makes your work unique and captivating.'}
            </div>
            <div
              className="leading-[1.7]"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => isEditing && onChange('heroText2', e.target.textContent)}
              style={{
                color: colors.text,
                fontFamily: fonts.bodyFont,
                fontWeight: 500,
                fontSize: '18px',
                paddingTop: '4px'
              }}
            >
              {content.heroText2 || 'Tell your audience about your creative process, expertise, or what drives your passion for design.'}
            </div>
          </div>

          {/* First Row - 3 Images (Masonry) */}
          <div className="grid grid-cols-3 gap-8 auto-rows-[280px]">
            {displayFirstRow.map((product, index) => (
              <ProductCard key={index} product={product} index={index} rowType="firstRow" />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div
          className="border-t mb-20"
          style={{ borderColor: colors.border }}
        />

        {/* Second Row - 4 Images (Masonry) */}
        <div className="grid grid-cols-4 gap-8 auto-rows-[280px] mb-20">
          {displaySecondRow.map((product, index) => (
            <ProductCard key={index} product={product} index={index} rowType="secondRow" />
          ))}
        </div>

        {/* Divider */}
        <div
          className="border-t mb-20"
          style={{ borderColor: colors.border }}
        />

        {/* Third Row - 3 Images (Masonry) */}
        <div className="grid grid-cols-3 gap-8 auto-rows-[280px]">
          {displayThirdRow.map((product, index) => (
            <ProductCard key={index} product={product} index={index} rowType="thirdRow" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SereneGallery;