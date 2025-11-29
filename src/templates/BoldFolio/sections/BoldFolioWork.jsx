import { useState, useEffect } from 'react';
import { useImageUpload } from '../../../hooks/useImageUpload';
import { useBreakpoints } from '../../../hooks/useMediaQuery';

const BoldFolioWork = ({ content = {}, isEditing = false, isPreview = false, onContentChange, onViewDetails = null }) => {
  const [visibleSections, setVisibleSections] = useState([]);
  const [uploadingIndexes, setUploadingIndexes] = useState(new Map());
  const { uploadImage } = useImageUpload();
  const { isMobile, isTablet, isDesktop } = useBreakpoints();
  const projects = content.projects || [];

  useEffect(() => {
    const timer1 = setTimeout(() => setVisibleSections((prev) => [...prev, 1]), 100);
    const timer2 = setTimeout(() => setVisibleSections((prev) => [...prev, 2]), 300);
    const timer3 = setTimeout(() => setVisibleSections((prev) => [...prev, 3]), 500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleFieldChange = (field, value) => {
    if (onContentChange) {
      onContentChange('work', field, value);
    }
  };

  const styles = {
    container: {
      position: 'relative',
      minHeight: '100vh',
      background: 'none',
      padding: 'clamp(1.25rem, 4vw, 3.75rem) clamp(1rem, 3vw, 2.5rem)',
      fontFamily: 'Graphik, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Fira Sans", Roboto, "Avenir Next", "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: '500',
      fontStyle: 'normal',
    },
    projectSection: {
      maxWidth: '1400px',
      margin: isMobile ? '0 auto 60px auto' : '0 auto 120px auto',
      animation: 'fadeIn 0.8s ease-in forwards',
    },
    projectTitle: {
      color: '#ff0080',
      fontSize: 'clamp(1.75rem, 6vw, 3.25rem)',
      fontWeight: '500',
      lineHeight: '1.2',
      margin: '0 0 20px 0',
      letterSpacing: '-0.02em',
    },
    projectDescription: {
      color: '#000000',
      fontSize: 'clamp(1.75rem, 6vw, 3.25rem)',
      fontWeight: '500',
      lineHeight: '1.2',
      margin: '0 0 30px 0',
      letterSpacing: '-0.02em',
    },
    exploreLink: {
      color: '#000000',
      fontSize: 'clamp(1.75rem, 6vw, 3.25rem)',
      fontWeight: '400',
      lineHeight: '1.3',
      margin: '0 0 40px 0',
      textDecoration: 'underline',
      display: 'inline-block',
      cursor: 'pointer',
      letterSpacing: '-0.02em',
    },
    imagesContainer: {
      display: 'flex',
      gap: 'clamp(1rem, 3vw, 1.875rem)',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
    },
    imageBox: {
      borderRadius: 'clamp(0.75rem, 2vw, 1.25rem)',
      overflow: 'hidden',
      backgroundColor: '#e0e0e0',
    },
    logoText: {
      fontSize: 'clamp(3rem, 10vw, 7.5rem)',
      fontWeight: '300',
      letterSpacing: 'clamp(2px, 0.8vw, 8px)',
      color: '#a855f7',
      display: 'flex',
      flexDirection: 'column',
      lineHeight: '0.8',
      margin: 'clamp(1.25rem, 4vw, 2.5rem) 0',
    },
    scrollTop: {
      color: '#000000',
      fontSize: 'clamp(1.75rem, 6vw, 3.25rem)',
      fontWeight: '400',
      lineHeight: '1.3',
      margin: 'clamp(3rem, 8vw, 5rem) 0 0 0',
      textDecoration: 'underline',
      display: 'inline-block',
      cursor: 'pointer',
      letterSpacing: '-0.02em',
      background: 'none',
      border: 'none',
      padding: 0,
    },
  };

  const keyframes = `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = keyframes;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle image upload
  // Stable helper to update project image (avoids stale closure)
  const updateProjectImage = (projectIndex, imageIndex, imageUrl) => {
    const updatedProjects = [...projects];
    const updatedImages = [...(updatedProjects[projectIndex].images || [])];
    updatedImages[imageIndex] = {
      ...updatedImages[imageIndex],
      src: imageUrl
    };
    updatedProjects[projectIndex] = {
      ...updatedProjects[projectIndex],
      images: updatedImages
    };

    if (onContentChange) {
      onContentChange('work', 'projects', updatedProjects);
    }
  };

  // Handle image upload with compression and progress tracking
  const handleImageUpload = async (file, projectIndex, imageIndex) => {
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

    console.log(`📤 Starting optimized upload for BoldFolio project ${projectIndex} image ${imageIndex}...`);

    // 1. INSTANT PREVIEW - Show blob URL immediately
    const localPreview = URL.createObjectURL(file);
    updateProjectImage(projectIndex, imageIndex, localPreview);

    // 2. Mark as uploading (use unique key for project+image combination)
    const uploadKey = `${projectIndex}-${imageIndex}`;
    setUploadingIndexes(prev => new Map(prev).set(uploadKey, { progress: 0 }));

    try {
      // 3. Upload with all optimizations (compression, fake progress, direct upload)
      const cloudinaryUrl = await uploadImage(file, {
        compress: true,
        direct: true,
      });

      console.log(`✅ Upload complete for BoldFolio project ${projectIndex} image ${imageIndex}:`, cloudinaryUrl);

      // 4. Replace blob URL with final Cloudinary URL
      updateProjectImage(projectIndex, imageIndex, cloudinaryUrl);

      // Clean up blob URL
      URL.revokeObjectURL(localPreview);

    } catch (error) {
      console.error('❌ Upload error:', error);
      alert(`Failed to upload image: ${error.message}`);
    } finally {
      // 5. Clear uploading state
      setUploadingIndexes(prev => {
        const newMap = new Map(prev);
        newMap.delete(uploadKey);
        return newMap;
      });
    }
  };

  // Handle file input change
  const handleFileChange = (e, projectIndex, imageIndex) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, projectIndex, imageIndex);
    }
  };

  return (
    <div id="work" style={styles.container}>
      {projects.map((project, idx) => (
        <div
          key={idx}
          style={{
            ...styles.projectSection,
            opacity: visibleSections.includes(idx + 1) ? 1 : 0,
          }}
        >
          <h2
            style={styles.projectTitle}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (isEditing && onContentChange) {
                const newProjects = [...projects];
                newProjects[idx] = { ...newProjects[idx], title: e.target.textContent };
                handleFieldChange('projects', newProjects);
              }
            }}
          >
            {project.title}
          </h2>
          <div
            style={styles.projectDescription}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (isEditing && onContentChange) {
                const newProjects = [...projects];
                newProjects[idx] = { ...newProjects[idx], description: e.target.innerHTML };
                handleFieldChange('projects', newProjects);
              }
            }}
            dangerouslySetInnerHTML={{ __html: project.description }}
          />
          {project.link && (
            <a href={project.link} style={styles.exploreLink}>
              Explore
            </a>
          )}

          <div style={styles.imagesContainer}>
            {(project.images || []).map((img, imgIdx) => {
              const imageKey = `${idx}-${imgIdx}`;
              const isUploading = uploadingIndexes.has(imageKey);

              // Scale image dimensions based on viewport
              const baseWidth = parseInt(img.width) || 300;
              const baseHeight = parseInt(img.height) || 200;
              const scaleFactor = isMobile ? 0.65 : isTablet ? 0.8 : 1;
              const scaledWidth = `${Math.round(baseWidth * scaleFactor)}px`;
              const scaledHeight = `${Math.round(baseHeight * scaleFactor)}px`;

              return (
                <div
                  key={imgIdx}
                  style={{
                    ...styles.imageBox,
                    width: scaledWidth,
                    height: scaledHeight,
                    backgroundImage: img.src ? `url(${img.src})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: isEditing ? 'pointer' : 'default',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onClick={() => {
                    if (isEditing) {
                      document.getElementById(`file-input-boldfolio-${imageKey}`).click();
                    } else if (isPreview && onViewDetails && project.detailedDescription) {
                      onViewDetails(project);
                    }
                  }}
                >
                  {/* Hover Overlay - Only in preview mode */}
                  {isPreview && onViewDetails && project.detailedDescription && img.src && (
                    <div
                      className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center"
                      style={{
                        opacity: 0,
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                    >
                      <div style={{
                        fontFamily: '"Inter", sans-serif',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#ffffff',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        transform: 'translateY(10px)',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(10px)'}
                      >
                        View Details →
                      </div>
                    </div>
                  )}

                  {/* Hidden file input */}
                  {isEditing && (
                    <input
                      id={`file-input-boldfolio-${imageKey}`}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileChange(e, idx, imgIdx)}
                    />
                  )}

                  {/* Upload placeholder */}
                  {isEditing && !img.src && !isUploading && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#9ca3af',
                      }}
                    >
                      <svg
                        style={{ width: '48px', height: '48px', marginBottom: '8px' }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p style={{ fontSize: '14px', margin: 0 }}>
                        Click to upload
                      </p>
                    </div>
                  )}

                  {/* Uploading state */}
                  {isUploading && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        zIndex: 10,
                      }}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            border: '4px solid #f3f4f6',
                            borderTop: '4px solid #ff0080',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 8px',
                          }}
                        />
                        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                          Uploading...
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Edit overlay */}
                  {isEditing && img.src && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background-color 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0)';
                      }}
                    >
                      <p
                        style={{
                          fontSize: '14px',
                          color: '#ffffff',
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          margin: 0,
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.opacity = 1;
                        }}
                      >
                        Click to change
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {project.logo && (
            <div
              style={styles.logoText}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => {
                if (isEditing && onContentChange) {
                  const newProjects = [...projects];
                  newProjects[idx] = { ...newProjects[idx], logo: e.target.innerHTML };
                  handleFieldChange('projects', newProjects);
                }
              }}
              dangerouslySetInnerHTML={{ __html: project.logo }}
            />
          )}
        </div>
      ))}

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <button onClick={scrollToTop} style={styles.scrollTop}>
          Scroll to top
        </button>
      </div>
    </div>
  );
};

export default BoldFolioWork;