import React, { useState } from 'react';
import { SwissGrid, GridCol } from '../components/SwissGrid';

const EchelonGallery = ({ 
  content,
  isEditing = false,
  onContentChange 
}) => {
  const { 
    heading = 'GALLERY',
    images = []
  } = content;

  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  const handleHeadingChange = (newHeading) => {
    if (onContentChange) {
      onContentChange('gallery', 'heading', newHeading);
    }
  };

  const handleImageChange = (index, field, value) => {
    if (onContentChange) {
      const updatedImages = [...images];
      updatedImages[index] = {
        ...updatedImages[index],
        [field]: value
      };
      onContentChange('gallery', 'images', updatedImages);
    }
  };

  const handleImageUpload = async (index, file) => {
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

    setUploadingIndex(index);

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
        handleImageChange(index, 'src', result.data.url);
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

  const addNewImage = () => {
    if (onContentChange) {
      const newImage = {
        id: Date.now(),
        src: '',
        caption: 'IMAGE CAPTION',
        meta: '2025'
      };
      onContentChange('gallery', 'images', [...images, newImage]);
    }
  };

  const openLightbox = (image) => {
    if (!isEditing) {
      setSelectedImage(image);
    }
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <section
        id="gallery"
        style={{
          backgroundColor: '#000000',
          color: '#FFFFFF',
          paddingTop: '200px',
          paddingBottom: '200px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Large Grid Decoration - Top Left */}
        <div style={{
          position: 'absolute',
          top: '8%',
          left: '3%',
          width: '320px',
          height: '320px',
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gridTemplateRows: 'repeat(6, 1fr)',
          gap: '0',
          opacity: 0.04,
          zIndex: 1,
          pointerEvents: 'none'
        }}>
          {[...Array(36)].map((_, i) => (
            <div key={i} style={{ 
              border: '1px solid #FFFFFF',
              backgroundColor: i % 6 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
            }} />
          ))}
        </div>

        <SwissGrid>
          {/* Massive Section Title */}
          <GridCol span={12}>
            <div style={{ marginBottom: '120px', position: 'relative' }}>
              {/* Background text */}
              <div style={{
                fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: 'clamp(180px, 22vw, 320px)',
                fontWeight: 900,
                lineHeight: 0.8,
                color: 'rgba(255, 255, 255, 0.05)',
                textTransform: 'uppercase',
                letterSpacing: '-0.05em',
                position: 'absolute',
                top: '-80px',
                left: '-20px',
                zIndex: 0,
                WebkitTextStroke: '1px rgba(255, 0, 0, 0.08)'
              }}>
                GALLERY
              </div>

              {isEditing ? (
                <input
                  type="text"
                  value={heading}
                  onChange={(e) => handleHeadingChange(e.target.value)}
                  style={{
                    fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                    fontSize: 'clamp(48px, 8vw, 80px)',
                    fontWeight: 900,
                    lineHeight: 0.9,
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.02em',
                    backgroundColor: 'transparent',
                    border: '2px dashed #FF0000',
                    outline: 'none',
                    padding: '20px',
                    width: '100%',
                    position: 'relative',
                    zIndex: 2,
                    marginTop: '40px'
                  }}
                />
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '40px',
                  position: 'relative',
                  zIndex: 2,
                  paddingTop: '40px'
                }}>
                  {/* Red accent badge */}
                  <div style={{
                    width: '60px',
                    height: '60px',
                    border: '4px solid #FF0000',
                    transform: 'rotate(45deg)'
                  }} />

                  <h2 style={{
                    fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                    fontSize: 'clamp(48px, 8vw, 80px)',
                    fontWeight: 900,
                    lineHeight: 0.9,
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.02em',
                    margin: 0
                  }}>
                    {heading}
                  </h2>
                </div>
              )}
            </div>
          </GridCol>

          {/* Gallery Grid - LARGER IMAGES */}
          <GridCol span={12}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '40px',
              marginBottom: '60px'
            }}>
              {images.map((image, index) => (
                <div 
                  key={image.id || index}
                  style={{
                    position: 'relative',
                    aspectRatio: index % 3 === 0 ? '4/5' : '16/11',
                    cursor: isEditing ? 'default' : 'pointer',
                    overflow: 'hidden',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)'
                  }}
                  onClick={() => !isEditing && openLightbox(image)}
                >
                  {image.src ? (
                    <img
                      src={image.src}
                      alt={image.caption}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.6s ease'
                      }}
                      onMouseEnter={(e) => !isEditing && (e.target.style.transform = 'scale(1.05)')}
                      onMouseLeave={(e) => !isEditing && (e.target.style.transform = 'scale(1)')}
                    />
                  ) : (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      fontFamily: '"IBM Plex Mono", monospace',
                      fontSize: 'clamp(12px, 1.2vw, 14px)',
                      color: 'rgba(255, 255, 255, 0.3)',
                      textTransform: 'uppercase'
                    }}>
                      {isEditing ? 'ADD IMAGE' : 'IMAGE'}
                    </div>
                  )}

                  {/* Image number badge */}
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    width: '60px',
                    height: '60px',
                    backgroundColor: '#FF0000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: 'clamp(16px, 2vw, 20px)',
                    fontWeight: 900,
                    color: '#000000',
                    zIndex: 2,
                    transform: 'rotate(-8deg)',
                    boxShadow: '0 4px 12px rgba(255, 0, 0, 0.3)'
                  }}>
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  {isEditing && (
                    <>
                      <input
                        type="file"
                        id={`gallery-image-${index}`}
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => handleImageUpload(index, e.target.files[0])}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          document.getElementById(`gallery-image-${index}`).click();
                        }}
                        style={{
                          position: 'absolute',
                          bottom: '20px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          backgroundColor: '#FF0000',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '12px 24px',
                          cursor: 'pointer',
                          fontSize: 'clamp(10px, 1vw, 12px)',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          zIndex: 3
                        }}
                      >
                        UPLOAD IMAGE
                      </button>
                    </>
                  )}

                  {/* Upload indicator */}
                  {uploadingIndex === index && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.75)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 10
                    }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          border: '3px solid rgba(255, 255, 255, 0.3)',
                          borderTop: '3px solid #FF0000',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite',
                          margin: '0 auto 16px'
                        }}></div>
                        <div style={{
                          fontFamily: '"IBM Plex Mono", monospace',
                          fontSize: 'clamp(12px, 1.2vw, 14px)',
                          color: '#FFFFFF',
                          textTransform: 'uppercase',
                          letterSpacing: '0.15em'
                        }}>
                          Uploading...
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </GridCol>

          {/* Add New Image Button */}
          {isEditing && (
            <GridCol span={12}>
              <button
                onClick={addNewImage}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  border: '3px solid #FFFFFF',
                  padding: '16px 40px',
                  cursor: 'pointer',
                  fontSize: 'clamp(12px, 1.2vw, 14px)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                  letterSpacing: '0.1em',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#FFFFFF';
                  e.target.style.color = '#000000';
                }}
              >
                + ADD NEW IMAGE
              </button>
            </GridCol>
          )}
        </SwissGrid>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '40px',
            cursor: 'pointer'
          }}
          onClick={closeLightbox}
        >
          <img
            src={selectedImage.src}
            alt={selectedImage.caption}
            style={{
              maxWidth: '90%',
              maxHeight: '90vh',
              objectFit: 'contain'
            }}
          />
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute',
              top: '30px',
              right: '30px',
              backgroundColor: '#FFFFFF',
              color: '#000000',
              border: 'none',
              padding: '16px',
              cursor: 'pointer',
              fontSize: 'clamp(16px, 1.8vw, 18px)',
              fontWeight: 700,
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
};

export default EchelonGallery;
