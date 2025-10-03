import React from 'react';
import { SwissGrid, GridCol } from '../components/SwissGrid';
import { SwissSpiral } from '../components/SwissDecorations';

const EchelonWork = ({ 
  content,
  isEditing = false,
  onContentChange 
}) => {
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

  const handleImageUpload = (index, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleProjectChange(index, 'image', event.target.result);
      };
      reader.readAsDataURL(file);
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
    <section
      id="work"
      style={{
        backgroundColor: '#FFFFFF',
        paddingTop: '200px',
        paddingBottom: '200px',
        position: 'relative',
        overflow: 'hidden'
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

      <SwissGrid>
        {/* Massive Section Title */}
        <GridCol span={12}>
          <div style={{ marginBottom: '140px', position: 'relative' }}>
            {/* Huge Background Text */}
            <div style={{
              fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: 'clamp(150px, 20vw, 300px)',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                  {/* Section number badge */}
                  <div style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#FF0000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: '32px',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    transform: 'rotate(-5deg)'
                  }}>
                    02
                  </div>

                  <h2 style={{
                    fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                    fontSize: 'clamp(60px, 10vw, 100px)',
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
                  fontSize: '120px',
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
                  fontSize: '12px',
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
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      zIndex: 3
                    }}
                  >
                    DELETE
                  </button>
                )}

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isEven ? '4fr 8fr' : '8fr 4fr',
                  gap: '60px',
                  position: 'relative',
                  zIndex: 1,
                  alignItems: 'center'
                }}>
                  {/* Image Section - LARGER */}
                  <div 
                    style={{ 
                      order: isEven ? 1 : 2,
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
                          fontSize: '14px',
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
                  </div>

                  {/* Content Section */}
                  <div style={{ order: isEven ? 2 : 1, paddingTop: '40px' }}>
                    {/* Meta Info */}
                    {isEditing ? (
                      <input
                        type="text"
                        value={project.meta || ''}
                        onChange={(e) => handleProjectChange(index, 'meta', e.target.value)}
                        placeholder="2025 — Category"
                        style={{
                          fontFamily: '"IBM Plex Mono", monospace',
                          fontSize: '14px',
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
                        fontSize: '14px',
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
                      <h3 style={{
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
                      <>
                        <textarea
                          value={project.description || ''}
                          onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                          placeholder="Project description..."
                          rows={4}
                          style={{
                            fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            fontSize: '18px',
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
                        
                        {/* Edit Case Study Button (Edit Mode) */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Get current portfolio ID from URL
                            const pathParts = window.location.pathname.split('/');
                            const portfolioId = pathParts[pathParts.indexOf('portfolio-builder') + 1];
                            // Navigate to case study editor
                            window.location.href = `/portfolio-builder/${portfolioId}/case-study/${project.id}`;
                          }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontFamily: '"IBM Plex Mono", monospace',
                            fontSize: '14px',
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
                          ✎ EDIT CASE STUDY
                        </button>
                      </>
                    ) : (
                      <p style={{
                        fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                        fontSize: '18px',
                        fontWeight: 400,
                        lineHeight: 1.5,
                        color: '#000000',
                        margin: 0,
                        maxWidth: '400px'
                      }}>
                        {project.description}
                      </p>
                    )}
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
                  fontSize: '18px',
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
  );
};

export default EchelonWork;