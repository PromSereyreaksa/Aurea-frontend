/**
 * Chic Project Detail Page - Individual project view
 * Editorial/Magazine-style project detail with clean typography
 */

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const ChicProjectPage = ({ content, styling, baseUrl = '/template-preview/chic' }) => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { colors, fonts } = styling;

  // Find the project from content.work
  const findProject = () => {
    if (!content?.work?.projects) return null;
    return content.work.projects.find(p => p.id === projectId);
  };

  const project = findProject();

  // If project not found, show error state
  if (!project) {
    return (
      <div style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          fontFamily: fonts.headingFont || '"Helvetica Neue", sans-serif',
          color: '#000000'
        }}>
          <h2 style={{
            fontSize: '24px',
            marginBottom: '16px',
            fontWeight: 600
          }}>
            Project not found
          </h2>
          <button
            onClick={() => navigate(baseUrl)}
            style={{
              fontFamily: fonts.headingFont || '"Helvetica Neue", sans-serif',
              fontSize: '12px',
              padding: '12px 24px',
              backgroundColor: '#000000',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 600
            }}
          >
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  // Format description text (convert \n to <br />)
  const formatDescription = (text) => {
    if (!text) return '';
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#FFFFFF'
    }}>
      {/* Back Navigation */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderBottom: '1px solid #E5E5E5',
        zIndex: 100,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '20px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={() => navigate(baseUrl)}
            style={{
              fontFamily: fonts.headingFont || '"Helvetica Neue", sans-serif',
              fontSize: '11px',
              color: '#000000',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 600,
              transition: 'opacity 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.6'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 10H5M5 10L10 5M5 10L10 15" strokeLinecap="square" strokeLinejoin="miter"/>
            </svg>
            BACK
          </button>

          <div style={{
            fontFamily: fonts.monoFont || '"SF Mono", monospace',
            fontSize: '10px',
            color: '#666666',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            Project Detail
          </div>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          paddingTop: '80px',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '80px 32px 80px'
        }}
      >
        {/* Project Meta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            marginBottom: '48px',
            borderBottom: '1px solid #E5E5E5',
            paddingBottom: '32px'
          }}
        >
          <h1 style={{
            fontFamily: fonts.headingFont || '"Helvetica Neue", sans-serif',
            fontSize: 'clamp(32px, 5vw, 56px)',
            color: '#000000',
            fontWeight: 600,
            lineHeight: '1.1',
            marginBottom: '16px',
            letterSpacing: '-0.02em'
          }}>
            {project.title || 'Project Title'}
          </h1>

          {project.subtitle && (
            <p style={{
              fontFamily: fonts.headingFont || '"Helvetica Neue", sans-serif',
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: '#666666',
              fontWeight: 500,
              lineHeight: '1.4',
              marginBottom: '24px'
            }}>
              {project.subtitle}
            </p>
          )}

          {/* Meta Information Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '24px',
            marginTop: '24px'
          }}>
            {project.category && (
              <div>
                <div style={{
                  fontFamily: fonts.monoFont || '"SF Mono", monospace',
                  fontSize: '10px',
                  color: '#999999',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '8px',
                  fontWeight: 600
                }}>
                  Category
                </div>
                <div style={{
                  fontFamily: fonts.headingFont || '"Helvetica Neue", sans-serif',
                  fontSize: '14px',
                  color: '#000000',
                  fontWeight: 500
                }}>
                  {project.category}
                </div>
              </div>
            )}

            {project.year && (
              <div>
                <div style={{
                  fontFamily: fonts.monoFont || '"SF Mono", monospace',
                  fontSize: '10px',
                  color: '#999999',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '8px',
                  fontWeight: 600
                }}>
                  Year
                </div>
                <div style={{
                  fontFamily: fonts.headingFont || '"Helvetica Neue", sans-serif',
                  fontSize: '14px',
                  color: '#000000',
                  fontWeight: 500
                }}>
                  {project.year}
                </div>
              </div>
            )}

            {project.awards && (
              <div>
                <div style={{
                  fontFamily: fonts.monoFont || '"SF Mono", monospace',
                  fontSize: '10px',
                  color: '#999999',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '8px',
                  fontWeight: 600
                }}>
                  Awards
                </div>
                <div style={{
                  fontFamily: fonts.headingFont || '"Helvetica Neue", sans-serif',
                  fontSize: '14px',
                  color: '#000000',
                  fontWeight: 500
                }}>
                  {project.awards}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Project Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            width: '100%',
            marginBottom: '64px',
            overflow: 'hidden'
          }}
        >
          {project.image ? (
            <img
              src={project.image}
              alt={project.title || 'Project'}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '70vh',
                objectFit: 'contain',
                display: 'block',
                backgroundColor: '#F5F5F5'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '60vh',
              backgroundColor: '#F5F5F5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{
                fontFamily: fonts.monoFont || '"SF Mono", monospace',
                fontSize: '11px',
                color: '#CCCCCC',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                No Image
              </span>
            </div>
          )}
        </motion.div>

        {/* Project Description */}
        {project.detailedDescription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{
              maxWidth: '700px',
              margin: '0 auto',
              marginBottom: '80px'
            }}
          >
            <div style={{
              fontFamily: fonts.headingFont || '"Helvetica Neue", sans-serif',
              fontSize: 'clamp(15px, 2vw, 17px)',
              color: '#333333',
              lineHeight: '1.7',
              fontWeight: 400
            }}>
              {formatDescription(project.detailedDescription)}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Footer Navigation */}
      <div style={{
        backgroundColor: '#FAFAFA',
        borderTop: '1px solid #E5E5E5',
        padding: '40px 32px',
        textAlign: 'center'
      }}>
        <button
          onClick={() => navigate(baseUrl)}
          style={{
            fontFamily: fonts.headingFont || '"Helvetica Neue", sans-serif',
            fontSize: '11px',
            padding: '14px 32px',
            backgroundColor: '#000000',
            color: '#FFFFFF',
            border: 'none',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 600,
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#333333';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#000000';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          View All Projects
        </button>
      </div>
    </div>
  );
};

export default ChicProjectPage;
