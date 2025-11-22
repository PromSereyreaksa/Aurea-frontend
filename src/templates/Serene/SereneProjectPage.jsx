/**
 * Serene Project Detail Page - Individual project view
 * Displays full project with large image and detailed description
 */

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const SereneProjectPage = ({ content, styling, baseUrl = '/template-preview/serene' }) => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { colors, fonts } = styling;

  // Find the project from content.gallery
  const findProject = () => {
    if (!content?.gallery) return null;

    const allProjects = [
      ...(content.gallery.firstRow || []),
      ...(content.gallery.secondRow || []),
      ...(content.gallery.thirdRow || [])
    ];

    return allProjects.find(p => p.id === projectId);
  };

  const project = findProject();

  // If project not found, show error state
  if (!project) {
    return (
      <div style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: colors.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          fontFamily: fonts.bodyFont,
          color: colors.text
        }}>
          <h2 style={{
            fontSize: '24px',
            marginBottom: '16px',
            color: colors.primary
          }}>
            Project not found
          </h2>
          <button
            onClick={() => navigate(baseUrl)}
            style={{
              fontFamily: fonts.bodyFont,
              fontSize: '14px',
              padding: '12px 24px',
              backgroundColor: colors.primary,
              color: colors.background,
              border: 'none',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
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
      backgroundColor: colors.background
    }}>
      {/* Back Navigation */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderBottom: `1px solid ${colors.border}`,
        zIndex: 100,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={() => navigate(baseUrl)}
            style={{
              fontFamily: fonts.bodyFont,
              fontSize: '14px',
              color: colors.primary,
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 500,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.opacity = '0.7';
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = '1';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 10H5M5 10L10 5M5 10L10 15" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Gallery
          </button>

          <div style={{
            fontFamily: fonts.bodyFont,
            fontSize: '12px',
            color: colors.secondary,
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            Project Detail
          </div>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          paddingTop: '80px',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '80px 24px 80px'
        }}
      >
        {/* Project Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            marginBottom: '48px',
            textAlign: 'center'
          }}
        >
          <h1 style={{
            fontFamily: fonts.headingFont,
            fontSize: 'clamp(32px, 5vw, 56px)',
            color: colors.primary,
            fontWeight: 400,
            lineHeight: '1.2',
            marginBottom: '16px'
          }}>
            {project.title || 'Project Title'}
          </h1>

          {project.description && (
            <p style={{
              fontFamily: fonts.bodyFont,
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: colors.secondary,
              fontWeight: 500,
              lineHeight: '1.6'
            }}>
              {project.description}
            </p>
          )}
        </motion.div>

        {/* Project Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            width: '100%',
            marginBottom: '64px',
            borderRadius: '4px',
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
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
                objectFit: 'cover',
                display: 'block'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '60vh',
              backgroundColor: colors.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{
                fontFamily: fonts.bodyFont,
                fontSize: '14px',
                color: colors.secondary,
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
            transition={{ duration: 0.6, delay: 0.6 }}
            style={{
              maxWidth: '800px',
              margin: '0 auto',
              marginBottom: '80px'
            }}
          >
            <div style={{
              fontFamily: fonts.bodyFont,
              fontSize: 'clamp(16px, 2vw, 18px)',
              color: colors.text,
              lineHeight: '1.8',
              fontWeight: 500
            }}>
              {formatDescription(project.detailedDescription)}
            </div>
          </motion.div>
        )}

        {/* Additional Project Info (if available) */}
        {(project.price || project.caption) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            style={{
              maxWidth: '800px',
              margin: '0 auto',
              paddingTop: '40px',
              borderTop: `1px solid ${colors.border}`,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '24px'
            }}
          >
            {project.price && (
              <div>
                <div style={{
                  fontFamily: fonts.bodyFont,
                  fontSize: '12px',
                  color: colors.secondary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '8px'
                }}>
                  Price
                </div>
                <div style={{
                  fontFamily: fonts.bodyFont,
                  fontSize: '16px',
                  color: colors.primary,
                  fontWeight: 600
                }}>
                  {project.price}
                </div>
              </div>
            )}

            {project.caption && (
              <div>
                <div style={{
                  fontFamily: fonts.bodyFont,
                  fontSize: '12px',
                  color: colors.secondary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '8px'
                }}>
                  Caption
                </div>
                <div style={{
                  fontFamily: fonts.bodyFont,
                  fontSize: '16px',
                  color: colors.primary,
                  fontWeight: 500
                }}>
                  {project.caption}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Footer Navigation */}
      <div style={{
        backgroundColor: colors.surface,
        borderTop: `1px solid ${colors.border}`,
        padding: '40px 24px',
        textAlign: 'center'
      }}>
        <button
          onClick={() => navigate(baseUrl)}
          style={{
            fontFamily: fonts.bodyFont,
            fontSize: '14px',
            padding: '14px 32px',
            backgroundColor: colors.primary,
            color: colors.background,
            border: 'none',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 500,
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = colors.text;
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = colors.primary;
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

export default SereneProjectPage;
