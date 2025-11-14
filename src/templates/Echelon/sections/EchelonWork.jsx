import React, { useState } from 'react';
import { SwissGrid, GridCol } from '../components/SwissGrid';
import { SwissSpiral } from '../components/SwissDecorations';
import { useImageUpload } from '../../../hooks/useImageUpload';

const EchelonWork = ({
  content,
  isEditing = false,
  onContentChange,
  portfolioId = null,
  caseStudies = {}
}) => {
  const [uploadingIndexes, setUploadingIndexes] = useState(new Map());
  const { uploadImage } = useImageUpload();
  
  const { 
    heading = 'SELECTED WORK',
    projects = []
  } = content;

  const handleHeadingChange = (newHeading) => {
    if (onContentChange) {
      onContentChange('work', 'heading', newHeading);
    }
  };

  const handleProjectChange = (index, field, value) => {
    if (onContentChange) {
      const updatedProjects = [...projects];
      updatedProjects[index] = {
        ...updatedProjects[index],
        [field]: value
      };
      onContentChange('work', 'projects', updatedProjects);
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

    console.log(`📤 Starting optimized upload for project ${index}...`);

    // 1. INSTANT PREVIEW - Show blob URL immediately
    const localPreview = URL.createObjectURL(file);
    handleProjectChange(index, 'image', localPreview);

    // 2. Mark as uploading (for progress indicator)
    setUploadingIndexes(prev => new Map(prev).set(index, { progress: 0 }));

    try {
      // 3. Upload with all optimizations:
      //    - Automatic compression (60-80% smaller)
      //    - Fake fast progress (instant 0-30%)
      //    - Direct Cloudinary upload (if configured)
      //    - Connection prewarming already active
      const cloudinaryUrl = await uploadImage(file, {
        compress: true,   // Auto compress before upload
        direct: true,     // Use direct upload if available
      });

      console.log(`✅ Upload complete for project ${index}:`, cloudinaryUrl);

      // 4. Replace blob URL with final Cloudinary URL
      handleProjectChange(index, 'image', cloudinaryUrl);

      // Clean up blob URL to free memory
      URL.revokeObjectURL(localPreview);

    } catch (error) {
      console.error('❌ Upload error:', error);
      alert(`Failed to upload image: ${error.message}`);
      // Keep the preview so user can see what they tried to upload
    } finally {
      // 5. Clear uploading state
      setUploadingIndexes(prev => {
        const newMap = new Map(prev);
        newMap.delete(index);
        return newMap;
      });
    }
  };

  const addNewProject = () => {
    if (onContentChange) {
      const newProject = {
        id: Date.now(),
        title: 'NEW PROJECT',
        description: 'Project description',
        image: '',
        meta: '2025 — Category',
        category: 'new'
      };
      onContentChange('work', 'projects', [...projects, newProject]);
    }
  };

  const removeProject = (index) => {
    if (onContentChange) {
      const updatedProjects = projects.filter((_, i) => i !== index);
      onContentChange('work', 'projects', updatedProjects);
    }
  };

  return (
    <>
      <style>{`
        /* Large screen optimizations */
        @media (min-width: 1400px) {
          .work-project-grid {
            max-width: 1600px;
            margin: 0 auto;
          }
        }

        @media (min-width: 1920px) {
          .work-section-title {
            font-size: 120px !important;
          }
          .work-project-title {
            font-size: 72px !important;
          }
        }
      `}</style>

      <section
        id="work"
        className="py-20 md:py-32 lg:py-48"
        style={{
          backgroundColor: '#FFFFFF',
          position: 'relative',
          overflow: 'clip'
        }}
      >
      {/* Aesthetic Spirals in Corners */}
      <SwissSpiral position="top-right" color="#000000" opacity={0.025} size={160} rotation={90} />
      <SwissSpiral position="bottom-left" color="#FF0000" opacity={0.035} size={180} rotation={270} />
      
      {/* Large decorative grid - bottom right */}
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '5%',
        width: '380px',
        height: '380px',
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        gridTemplateRows: 'repeat(8, 1fr)',
        gap: '0',
        opacity: 0.06,
        zIndex: 1,
        pointerEvents: 'none'
      }}>
        {[...Array(64)].map((_, i) => (
          <div key={i} style={{ 
            border: '1px solid #000000',
            backgroundColor: i % 9 === 0 ? 'rgba(0, 0, 0, 0.03)' : 'transparent'
          }} />
        ))}
      </div>

      <SwissGrid maxWidth="1600px">
        {/* Massive Section Title */}
        <GridCol span={12}>
          <div style={{ marginBottom: '140px', position: 'relative' }}>
            {/* Huge Background Text */}
            <div className="hidden md:block" style={{
              fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: 'clamp(80px, 20vw, 300px)',
              fontWeight: 900,
              lineHeight: 0.8,
              color: 'rgba(0, 0, 0, 0.03)',
              textTransform: 'uppercase',
              letterSpacing: '-0.05em',
              position: 'absolute',
              top: '-60px',
              left: '-20px',
              zIndex: 0,
              whiteSpace: 'nowrap',
              WebkitTextStroke: '1px rgba(255, 0, 0, 0.08)'
            }}>
              WORK
            </div>

            {/* Main Title */}
            <div style={{ position: 'relative', zIndex: 2, paddingTop: '60px' }}>
              {isEditing ? (
                <input
                  type="text"
                  value={heading}
                  onChange={(e) => handleHeadingChange(e.target.value)}
                  style={{
                    fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                    fontSize: 'clamp(60px, 10vw, 100px)',
                    fontWeight: 900,
                    lineHeight: 0.9,
                    color: '#000000',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.02em',
                    backgroundColor: 'transparent',
                    border: '2px dashed #FF0000',
                    outline: 'none',
                    width: '100%',
                    padding: '24px'
                  }}
                />
              ) : (
                <div className="flex items-center gap-4 md:gap-10 px-2 md:px-0">
                  {/* Section number badge */}
                  <div className="hidden sm:block" style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#FF0000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: 'clamp(24px, 3.5vw, 32px)',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    transform: 'rotate(-5deg)'
                  }}>
                    02
                  </div>

                  <h2 className="work-section-title" style={{
                    fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                    fontSize: 'clamp(36px, 10vw, 100px)',
                    fontWeight: 900,
                    lineHeight: 0.9,
                    color: '#000000',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.02em',
                    margin: 0
                  }}>
                    {heading}
                  </h2>
                </div>
              )}
            </div>
          </div>
        </GridCol>

        {/* Projects - Swiss Asymmetrical Layout */}
        {projects.map((project, index) => {
          const isEven = index % 2 === 0;
          const hasCaseStudy = !isEditing && project.caseStudyUrl;
          
          const handleProjectClick = () => {
            if (hasCaseStudy) {
              window.location.href = project.caseStudyUrl;
            }
          };
          
          return (
            <GridCol span={12} key={project.id || index}>
              <div 
                onClick={handleProjectClick}
                style={{ 
                  position: 'relative',
                  marginBottom: '200px',
                  cursor: hasCaseStudy ? 'pointer' : 'default',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (hasCaseStudy) {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (hasCaseStudy) {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {/* Project Number - Bigger and bolder */}
                <div style={{
                  position: 'absolute',
                  top: '-60px',
                  left: 0,
                  fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                  fontSize: 'clamp(48px, 12vw, 120px)',
                  fontWeight: 900,
                  color: 'rgba(0, 0, 0, 0.03)',
                  lineHeight: 1,
                  zIndex: 0
                }}>
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* Meta info */}
                <div style={{
                  position: 'absolute',
                  top: '-30px',
                  right: 0,
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: 'clamp(10px, 1vw, 12px)',
                  color: '#FF0000',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  zIndex: 2
                }}>
                  PROJECT {String(index + 1).padStart(2, '0')}
                </div>

                {/* Remove button for editing */}
                {isEditing && (
                  <button
                    onClick={() => removeProject(index)}
                    style={{
                      position: 'absolute',
                      top: '-30px',
                      right: '120px',
                      backgroundColor: '#FF0000',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '10px 20px',
                      cursor: 'pointer',
                      fontSize: 'clamp(10px, 1vw, 12px)',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      zIndex: 3
                    }}
                  >
                    DELETE
                  </button>
                )}

                <div
                  className="work-project-grid grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-16 lg:gap-20 xl:gap-24 items-center"
                  style={{
                    position: 'relative',
                    zIndex: 1
                  }}>
                  {/* Image Section - LARGER */}
                  <div
                    className={isEven ? 'md:col-span-4 md:order-1' : 'md:col-span-8 md:order-2'}
                    style={{
                      position: 'relative'
                    }}
                  >
                    <div
                      style={{
                        aspectRatio: '16/11',
                        backgroundColor: project.image ? 'transparent' : 'rgba(0, 0, 0, 0.03)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: isEditing ? 'pointer' : 'default',
                        overflow: 'hidden',
                        position: 'relative'
                      }}
                      onClick={() => isEditing && document.getElementById(`project-image-${index}`).click()}
                    >
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
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
                          fontFamily: '"IBM Plex Mono", monospace',
                          fontSize: 'clamp(12px, 1.2vw, 14px)',
                          color: '#666666',
                          textAlign: 'center',
                          textTransform: 'uppercase'
                        }}>
                          {isEditing ? 'ADD IMAGE' : 'PROJECT IMAGE'}
                        </div>
                      )}
                    </div>

                    {isEditing && (
                      <input
                        id={`project-image-${index}`}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => handleImageUpload(index, e.target.files[0])}
                      />
                    )}

                    {/* Enhanced Upload Progress Indicator */}
                    {uploadingIndexes.has(index) && (
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: '#FF0000',
                        color: '#FFFFFF',
                        padding: '10px 18px',
                        borderRadius: '6px',
                        fontFamily: '"IBM Plex Mono", monospace',
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        zIndex: 10,
                        boxShadow: '0 4px 12px rgba(255, 0, 0, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}>
                        {/* Animated spinner with glow */}
                        <div style={{
                          position: 'relative',
                          width: '14px',
                          height: '14px'
                        }}>
                          <div style={{
                            width: '14px',
                            height: '14px',
                            border: '2px solid rgba(255, 255, 255, 0.3)',
                            borderTop: '2px solid #FFFFFF',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite'
                          }}></div>
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '14px',
                            height: '14px',
                            border: '2px solid #FFFFFF',
                            borderRadius: '50%',
                            opacity: 0.2,
                            animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite'
                          }}></div>
                        </div>
                        <span>Optimizing...</span>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className={isEven ? 'md:col-span-8 md:order-2 pt-8 md:pt-10' : 'md:col-span-4 md:order-1 pt-8 md:pt-10'}>
                    {/* Meta Info */}
                    {isEditing ? (
                      <input
                        type="text"
                        value={project.meta || ''}
                        onChange={(e) => handleProjectChange(index, 'meta', e.target.value)}
                        placeholder="2025 — Category"
                        style={{
                          fontFamily: '"IBM Plex Mono", monospace',
                          fontSize: 'clamp(12px, 1.2vw, 14px)',
                          color: '#666666',
                          backgroundColor: 'transparent',
                          border: '1px dashed #CCCCCC',
                          padding: '8px',
                          marginBottom: '24px',
                          width: '100%',
                          textTransform: 'uppercase'
                        }}
                      />
                    ) : (
                      <div style={{
                        fontFamily: '"IBM Plex Mono", monospace',
                        fontSize: 'clamp(12px, 1.2vw, 14px)',
                        color: '#666666',
                        marginBottom: '24px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                      }}>
                        {project.meta || '2025 — PROJECT'}
                      </div>
                    )}

                    {/* Project Title - BIGGER */}
                    {isEditing ? (
                      <input
                        type="text"
                        value={project.title || ''}
                        onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                        placeholder="PROJECT TITLE"
                        className="work-project-title"
                        style={{
                          fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                          fontSize: 'clamp(36px, 6vw, 64px)',
                          fontWeight: 900,
                          textTransform: 'uppercase',
                          letterSpacing: '-0.01em',
                          lineHeight: 0.95,
                          color: '#000000',
                          backgroundColor: 'transparent',
                          outline: 'none',
                          padding: '20px',
                          marginBottom: '40px',
                          width: '100%'
                        }}
                      />
                    ) : (
                      <h3 className="work-project-title" style={{
                        fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                        fontSize: 'clamp(36px, 6vw, 64px)',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '-0.01em',
                        lineHeight: 0.95,
                        color: '#000000',
                        margin: 0,
                        marginBottom: '40px',
                        position: 'relative',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        hyphens: 'auto'
                      }}>
                        {project.title}
                        
                        {/* Red underline accent */}
                        <div style={{
                          width: '80px',
                          height: '4px',
                          backgroundColor: '#FF0000',
                          marginTop: '16px'
                        }} />
                      </h3>
                    )}

                    {/* Project Description */}
                    {isEditing ? (
                      <textarea
                        value={project.description || ''}
                        onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                        placeholder="Project description..."
                        rows={4}
                        style={{
                          fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                          fontSize: 'clamp(16px, 1.8vw, 18px)',
                          fontWeight: 400,
                          lineHeight: 1.5,
                          color: '#000000',
                          backgroundColor: 'transparent',
                          border: '1px dashed #CCCCCC',
                          padding: '16px',
                          width: '100%',
                          resize: 'vertical',
                          marginBottom: '20px'
                        }}
                      />
                    ) : (
                      <p style={{
                        fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                        fontSize: 'clamp(16px, 1.8vw, 18px)',
                        fontWeight: 400,
                        lineHeight: 1.5,
                        color: '#000000',
                        margin: 0,
                        marginBottom: '24px',
                        maxWidth: '400px'
                      }}>
                        {project.description}
                      </p>
                    )}
                    
                    {/* Case Study Button - Always show when editing or when there's content to view */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        
                        // Get portfolio ID from URL as fallback
                        const pathParts = window.location.pathname.split('/');
                        const portfolioIdFromUrl = pathParts.includes('portfolio-builder') 
                          ? pathParts[pathParts.indexOf('portfolio-builder') + 1]
                          : portfolioId;
                        
                        if (isEditing) {
                          // Edit mode: Navigate to case study editor
                          window.location.href = `/portfolio-builder/${portfolioIdFromUrl}/case-study/${project.id}`;
                        } else if (portfolioIdFromUrl) {
                          // Preview mode in builder: Navigate to case study view
                          window.location.href = `/portfolio/${portfolioIdFromUrl}/project/${project.id}`;
                        } else if (project.caseStudyUrl) {
                          // Public template preview: Use caseStudyUrl
                          window.location.href = project.caseStudyUrl;
                        } else {
                          console.log('No navigation target found', { portfolioId, portfolioIdFromUrl, project });
                        }
                      }}
                      style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '12px',
                          fontFamily: '"IBM Plex Mono", monospace',
                          fontSize: 'clamp(12px, 1.2vw, 14px)',
                          fontWeight: 700,
                          color: '#FFFFFF',
                          backgroundColor: '#FF0000',
                          border: '2px solid #FF0000',
                          padding: '14px 28px',
                          cursor: 'pointer',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#CC0000';
                          e.currentTarget.style.borderColor = '#CC0000';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#FF0000';
                          e.currentTarget.style.borderColor = '#FF0000';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        {isEditing ? '✎ EDIT CASE STUDY' : 'VIEW CASE STUDY →'}
                      </button>
                  </div>
                </div>
              </div>
            </GridCol>
          );
        })}

        {/* Add New Project Button (Editing Mode) - Hidden for now */}
        {false && isEditing && (
          <GridCol span={12}>
            <div
              style={{
                border: '2px dashed #CCCCCC',
                padding: '60px 40px',
                textAlign: 'center',
                cursor: 'pointer',
                marginTop: '40px'
              }}
              onClick={addNewProject}
            >
              <div
                style={{
                  fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                  fontSize: 'clamp(16px, 1.8vw, 18px)',
                  color: '#666666',
                  textTransform: 'uppercase'
                }}
              >
                + ADD NEW PROJECT
              </div>
            </div>
          </GridCol>
        )}
      </SwissGrid>
    </section>
    </>
  );
};

export default EchelonWork;