import { useState, useEffect } from 'react';

const BoldFolioWork = ({ content = {}, isEditing = false, onContentChange }) => {
  const [visibleSections, setVisibleSections] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(null);
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
      minWidth: '1024px',
      background: 'none',
      padding: '60px 40px',
      fontFamily: 'Graphik, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Fira Sans", Roboto, "Avenir Next", "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: '500',
      fontStyle: 'normal',
    },
    projectSection: {
      maxWidth: '1400px',
      margin: '0 auto 120px auto',
      animation: 'fadeIn 0.8s ease-in forwards',
    },
    projectTitle: {
      color: '#ff0080',
      fontSize: '52px',
      fontWeight: '500',
      lineHeight: '1.2',
      margin: '0 0 20px 0',
      letterSpacing: '-0.02em',
    },
    projectDescription: {
      color: '#000000',
      fontSize: '52px',
      fontWeight: '500',
      lineHeight: '1.2',
      margin: '0 0 30px 0',
      letterSpacing: '-0.02em',
    },
    exploreLink: {
      color: '#000000',
      fontSize: '52px',
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
      gap: '30px',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
    },
    imageBox: {
      borderRadius: '20px',
      overflow: 'hidden',
      backgroundColor: '#e0e0e0',
    },
    logoText: {
      fontSize: '120px',
      fontWeight: '300',
      letterSpacing: '8px',
      color: '#a855f7',
      display: 'flex',
      flexDirection: 'column',
      lineHeight: '0.8',
      margin: '40px 0',
    },
    scrollTop: {
      color: '#000000',
      fontSize: '52px',
      fontWeight: '400',
      lineHeight: '1.3',
      margin: '80px 0 0 0',
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

    // 1. INSTANT PREVIEW - Show image immediately using blob URL
    const localPreview = URL.createObjectURL(file);
    const updatedProjects = [...projects];
    const updatedImages = [...(updatedProjects[projectIndex].images || [])];
    updatedImages[imageIndex] = {
      ...updatedImages[imageIndex],
      src: localPreview
    };
    updatedProjects[projectIndex] = {
      ...updatedProjects[projectIndex],
      images: updatedImages
    };

    if (onContentChange) {
      onContentChange('work', 'projects', updatedProjects);
    }
    console.log(`✨ Showing instant preview for BoldFolio project ${projectIndex} image ${imageIndex}:`, localPreview);

    // 2. Start upload in background
    setUploadingImage(`${projectIndex}-${imageIndex}`);

    try {
      const formData = new FormData();
      formData.append('image', file);

      console.log(`📤 Uploading BoldFolio project ${projectIndex} image ${imageIndex} to Cloudinary in background...`);

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
        // 3. Replace blob URL with Cloudinary URL
        const finalProjects = [...projects];
        const finalImages = [...(finalProjects[projectIndex].images || [])];
        finalImages[imageIndex] = {
          ...finalImages[imageIndex],
          src: result.data.url
        };
        finalProjects[projectIndex] = {
          ...finalProjects[projectIndex],
          images: finalImages
        };

        if (onContentChange) {
          onContentChange('work', 'projects', finalProjects);
        }

        console.log(`✅ Cloudinary upload complete for BoldFolio project ${projectIndex} image ${imageIndex}:`, result.data.url);

        // Clean up blob URL to free memory
        URL.revokeObjectURL(localPreview);
      } else {
        throw new Error(result.message || 'Upload failed - no URL returned');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Failed to upload image: ${error.message}`);
    } finally {
      setUploadingImage(null);
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
              const isUploading = uploadingImage === imageKey;

              return (
                <div
                  key={imgIdx}
                  style={{
                    ...styles.imageBox,
                    width: img.width || '300px',
                    height: img.height || '200px',
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
                    }
                  }}
                >
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
