import React, { useState } from 'react';
import { SwissGrid, GridCol } from '../components/SwissGrid';
import { SwissGrid as SwissGridDecoration } from '../components/SwissDecorations';
import { SwissHeading, SwissBody } from '../components/SwissTypography';
import { useImageUpload } from '../../../hooks/useImageUpload';

const EchelonAbout = ({
  content,
  isEditing = false,
  onContentChange
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const { uploadImage } = useImageUpload();
  
  const { 
    name = 'DESIGNER NAME',
    role = 'CREATIVE DIRECTOR / DESIGNER',
    image = '',
    bio = 'I am a designer focused on minimalism, clarity, and modernist design systems. My work emphasizes grid-based layouts, precise typography, and functional design solutions that prioritize clarity and usability above all else.'
  } = content;

  const handleNameChange = (newName) => {
    if (onContentChange) {
      onContentChange('about', 'name', newName);
    }
  };

  const handleRoleChange = (newRole) => {
    if (onContentChange) {
      onContentChange('about', 'role', newRole);
    }
  };

  const handleBioChange = (newBio) => {
    if (onContentChange) {
      onContentChange('about', 'bio', newBio);
    }
  };

  const handleImageChange = (newImage) => {
    if (onContentChange) {
      onContentChange('about', 'image', newImage);
    }
  };

  // Upload image with all optimizations
  const handleImageUpload = async (file) => {
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

    console.log('📤 Starting optimized upload for about image...');

    // 1. INSTANT PREVIEW - Show blob URL immediately
    const localPreview = URL.createObjectURL(file);
    handleImageChange(localPreview);

    // 2. Mark as uploading
    setIsUploading(true);

    try {
      // 3. Upload with all optimizations (compression, fake progress, direct upload)
      const cloudinaryUrl = await uploadImage(file, {
        compress: true,
        direct: true,
      });

      console.log('✅ Upload complete for about image:', cloudinaryUrl);

      // 4. Replace blob URL with final Cloudinary URL
      handleImageChange(cloudinaryUrl);

      // Clean up blob URL
      URL.revokeObjectURL(localPreview);

    } catch (error) {
      console.error('❌ Upload error:', error);
      alert(`Failed to upload image: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Keyboard shortcuts handler
  const handleKeyDown = (e, field, value) => {
    // ESC - cancel editing without saving
    if (e.key === 'Escape') {
      e.preventDefault();
      e.target.blur();
      return;
    }

    // For textarea: Shift+Enter = new line, Enter alone = save and exit
    // For input: Enter = save and exit
    if (e.key === 'Enter') {
      const isTextarea = e.target.tagName.toLowerCase() === 'textarea';
      
      if (!isTextarea || !e.shiftKey) {
        // Save and exit editing
        e.preventDefault();
        if (field === 'name') {
          handleNameChange(value);
        } else if (field === 'role') {
          handleRoleChange(value);
        } else if (field === 'bio') {
          handleBioChange(value);
        }
        e.target.blur();
      }
      // If Shift+Enter in textarea, allow default (new line)
    }

    // Ctrl+S / Cmd+S - save without exiting
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      if (field === 'name') {
        handleNameChange(value);
      } else if (field === 'role') {
        handleRoleChange(value);
      } else if (field === 'bio') {
        handleBioChange(value);
      }
    }
  };

  return (
    <section
      id="about"
      className="py-20 md:py-32 lg:py-48"
      style={{
        backgroundColor: '#000000',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'clip'
      }}
    >
      {/* Large Grid Overlay - Top Left */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '8%',
        width: '350px',
        height: '350px',
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gridTemplateRows: 'repeat(7, 1fr)',
        gap: '0',
        opacity: 0.08,
        zIndex: 1,
        pointerEvents: 'none'
      }}>
        {[...Array(49)].map((_, i) => (
          <div key={i} style={{ 
            border: '1px solid #FF0000',
            backgroundColor: i % 8 === 0 ? 'rgba(255, 0, 0, 0.03)' : 'transparent'
          }} />
        ))}
      </div>

      {/* Decorative Lines */}
      <div style={{
        position: 'absolute',
        right: '80px',
        top: '30%',
        bottom: '30%',
        display: 'flex',
        gap: '40px',
        opacity: 0.1,
        zIndex: 1,
        pointerEvents: 'none'
      }}>
        {[...Array(2)].map((_, i) => (
          <div key={i} style={{ width: '2px', height: '100%', backgroundColor: '#FFFFFF' }} />
        ))}
      </div>

      {/* Bold Horizontal Accent */}
      <div style={{
        position: 'absolute',
        bottom: '25%',
        left: '0',
        right: '40%',
        height: '8px',
        backgroundColor: '#FF0000',
        opacity: 0.15,
        zIndex: 1,
        pointerEvents: 'none'
      }} />
      
      <SwissGrid>
        {/* Massive Section Number */}
        <GridCol span={12}>
          <div style={{
            fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: 'clamp(60px, 20vw, 280px)',
            fontWeight: 900,
            lineHeight: 0.8,
            color: 'rgba(255, 255, 255, 0.08)',
            marginTop: '-60px',
            marginBottom: '60px',
            letterSpacing: '-0.05em',
            WebkitTextStroke: '1px rgba(255, 0, 0, 0.1)'
          }}>
            ABOUT
          </div>
        </GridCol>

        {/* Large Portrait Image - More screen space */}
        <GridCol span={12} className="md:col-span-5">
          <div style={{ position: 'relative' }}>
            {/* Image Container - BIGGER */}
            <div
              style={{
                aspectRatio: '3/4',
                backgroundColor: image ? 'transparent' : 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '30px',
                position: 'relative',
                zIndex: 2,
                overflow: 'hidden',
                cursor: isEditing ? 'pointer' : 'default'
              }}
              onClick={() => isEditing && document.getElementById('about-image-input').click()}
            >
              {image ? (
                <img
                  src={image}
                  alt={name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: 'clamp(14px, 1.5vw, 16px)',
                  color: 'rgba(255, 255, 255, 0.3)',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em'
                }}>
                  {isEditing ? 'ADD PORTRAIT' : 'PORTRAIT'}
                </div>
              )}
            </div>

            {/* Caption under image with grid */}
            <div style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: 'clamp(12px, 1.2vw, 14px)',
              color: '#FFFFFF',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '2px solid #FF0000',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>PORTRAIT</span>
              <span style={{ color: '#FF0000' }}>2025</span>
            </div>

            {isEditing && (
              <input
                id="about-image-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    handleImageUpload(file);
                  }
                }}
              />
            )}

            {/* Upload indicator - Small corner badge (non-blocking) */}
            {isUploading && (
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: '#FF0000',
                color: '#FFFFFF',
                padding: '8px 16px',
                borderRadius: '4px',
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                zIndex: 10,
                boxShadow: '0 2px 8px rgba(255, 0, 0, 0.3)',
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
                Uploading
              </div>
            )}
          </div>
        </GridCol>

        {/* Bio Content - Swiss asymmetrical layout */}
        <GridCol span={12} className="md:col-span-7">
          <div className="mt-8 md:mt-0 md:ml-16" style={{ position: 'relative', zIndex: 2, maxWidth: '100%', overflow: 'hidden' }}>
            {/* Section Label with Grid */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '30px',
              marginBottom: '60px'
            }}>
              <div style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: 'clamp(14px, 1.5vw, 16px)',
                fontWeight: 600,
                color: '#FF0000',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                borderLeft: '4px solid #FF0000',
                paddingLeft: '24px'
              }}>
                01 — ABOUT
              </div>

              {/* Small decorative grid */}
              <div style={{
                display: 'inline-grid',
                gridTemplateColumns: 'repeat(3, 20px)',
                gridTemplateRows: 'repeat(2, 20px)',
                gap: '2px',
                opacity: 0.3
              }}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} style={{ border: '1px solid #FFFFFF' }} />
                ))}
              </div>
            </div>

            {/* Name - HUGE Typography with Grid Frame */}
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'name', e.target.value)}
                onBlur={(e) => handleNameChange(e.target.value)}
                style={{
                  fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                  fontSize: 'clamp(48px, 8vw, 80px)',
                  fontWeight: 900,
                  lineHeight: 0.95,
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.02em',
                  backgroundColor: 'transparent',
                  border: '2px dashed #FF0000',
                  outline: 'none',
                  width: '100%',
                  padding: '24px',
                  marginBottom: '80px'
                }}
              />
            ) : (
              <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
                <h3 style={{
                  fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                  fontSize: 'clamp(42px, 7vw, 72px)',
                  fontWeight: 900,
                  lineHeight: 1.1,
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.02em',
                  margin: 0,
                  marginBottom: '30px',
                  position: 'relative',
                  zIndex: 2,
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  maxWidth: '100%'
                }}>
                  {name}

                  {/* Grid lines around name */}
                  <div style={{
                    position: 'absolute',
                    top: '-30px',
                    left: '-30px',
                    right: '20%',
                    height: '3px',
                    backgroundColor: '#FF0000',
                    opacity: 0.4,
                    zIndex: -1
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: '-30px',
                    left: '20%',
                    right: '-30px',
                    height: '3px',
                    backgroundColor: '#FF0000',
                    opacity: 0.4,
                    zIndex: -1
                  }} />
                </h3>
              </div>
            )}

            {/* Professional Role/Title */}
            {isEditing ? (
              <input
                type="text"
                value={role}
                onChange={(e) => handleRoleChange(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'role', e.target.value)}
                onBlur={(e) => handleRoleChange(e.target.value)}
                placeholder="PROFESSIONAL TITLE"
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: 'clamp(16px, 1.8vw, 18px)',
                  fontWeight: 600,
                  color: '#FF0000',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  backgroundColor: 'transparent',
                  border: '1px dashed #FF0000',
                  outline: 'none',
                  width: '100%',
                  padding: '12px',
                  marginBottom: '60px'
                }}
              />
            ) : (
              <div style={{
                display: 'inline-block',
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: 'clamp(11px, 1.1vw, 13px)',
                fontWeight: 700,
                color: '#000000',
                backgroundColor: '#FF0000',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                padding: '12px 24px',
                marginBottom: '60px',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                maxWidth: '100%',
                lineHeight: 1.4,
                transform: 'skew(-3deg)'
              }}>
                {role}
              </div>
            )}

            {/* Bio Text - Larger and more readable */}
            {isEditing ? (
              <textarea
                value={bio}
                onChange={(e) => handleBioChange(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'bio', e.target.value)}
                onBlur={(e) => handleBioChange(e.target.value)}
                rows={6}
                style={{
                  fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                  fontSize: 'clamp(18px, 2.5vw, 24px)',
                  fontWeight: 400,
                  lineHeight: 1.6,
                  color: '#FFFFFF',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '2px dashed #FF0000',
                  outline: 'none',
                  width: '100%',
                  padding: '30px',
                  resize: 'vertical'
                }}
              />
            ) : (
              <p style={{
                fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: 'clamp(18px, 2.5vw, 24px)',
                fontWeight: 400,
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.85)',
                margin: 0,
                maxWidth: '700px',
                wordWrap: 'break-word',
                overflowWrap: 'break-word'
              }}>
                {bio}
              </p>
            )}

            {/* Swiss divider with grid element */}
            <div style={{
              marginTop: '80px',
              display: 'flex',
              alignItems: 'center',
              gap: '40px'
            }}>
              <div style={{
                width: '150px',
                height: '3px',
                backgroundColor: '#FF0000',
                opacity: 0.6
              }} />
              
              {/* Small grid badge */}
              <div style={{
                display: 'inline-grid',
                gridTemplateColumns: 'repeat(4, 15px)',
                gridTemplateRows: 'repeat(2, 15px)',
                gap: '2px',
                opacity: 0.4
              }}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} style={{ border: '1px solid #FFFFFF' }} />
                ))}
              </div>
            </div>
          </div>
        </GridCol>
      </SwissGrid>
    </section>
  );
};

export default EchelonAbout;