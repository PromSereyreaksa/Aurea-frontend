/**
 * BoldFolio Project Detail Page - Individual project view
 * Bold, creative design with vibrant magenta accents
 */

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const BoldFolioProjectPage = ({ content, styling, baseUrl = '/template-preview/boldfolio' }) => {
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
        backgroundColor: colors.background || '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          fontFamily: fonts.heading || 'Graphik, sans-serif',
          color: colors.text || '#000000'
        }}>
          <h2 style={{
            fontSize: '36px',
            marginBottom: '20px',
            fontWeight: 700,
            color: colors.primary || '#ff0080'
          }}>
            Project not found
          </h2>
          <button
            onClick={() => navigate(baseUrl)}
            style={{
              fontFamily: fonts.heading || 'Graphik, sans-serif',
              fontSize: '14px',
              padding: '16px 32px',
              backgroundColor: colors.primary || '#ff0080',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 700,
              borderRadius: '4px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#e60073';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(255, 0, 128, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = colors.primary || '#ff0080';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
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
      backgroundColor: colors.background || '#FFFFFF'
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
          padding: '24px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={() => navigate(baseUrl)}
            style={{
              fontFamily: fonts.heading || 'Graphik, sans-serif',
              fontSize: '14px',
              color: colors.primary || '#ff0080',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 700,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.opacity = '0.7';
              e.target.style.transform = 'translateX(-4px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = '1';
              e.target.style.transform = 'translateX(0)';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 10H5M5 10L10 5M5 10L10 15" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            BACK TO WORK
          </button>

          <div style={{
            fontFamily: fonts.body || 'Graphik, sans-serif',
            fontSize: '12px',
            color: colors.textSecondary || '#666666',
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
          paddingTop: '100px',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '100px 40px 100px'
        }}
      >
        {/* Project Title & Meta */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            marginBottom: '60px',
            textAlign: 'center'
          }}
        >
          <h1 style={{
            fontFamily: fonts.heading || 'Graphik, sans-serif',
            fontSize: 'clamp(36px, 6vw, 72px)',
            color: colors.text || '#000000',
            fontWeight: 700,
            lineHeight: '1.1',
            marginBottom: '20px',
            letterSpacing: '-0.01em'
          }}>
            {project.title || 'Project Title'}
          </h1>

          {/* Project Description with HTML support */}
          {project.description && (
            <div
              style={{
                fontFamily: fonts.body || 'Graphik, sans-serif',
                fontSize: 'clamp(18px, 2.5vw, 24px)',
                color: colors.textSecondary || '#666666',
                fontWeight: 400,
                lineHeight: '1.6',
                maxWidth: '800px',
                margin: '0 auto',
                marginBottom: '30px'
              }}
              dangerouslySetInnerHTML={{ __html: project.description }}
            />
          )}

          {/* Project Logo if exists */}
          {project.logo && (
            <div
              style={{
                marginTop: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: fonts.heading || 'Graphik, sans-serif',
                color: colors.primary || '#ff0080'
              }}
              dangerouslySetInnerHTML={{ __html: project.logo }}
            />
          )}
        </motion.div>

        {/* Project Images */}
        {project.images && project.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '30px',
              justifyContent: 'center',
              marginBottom: '80px'
            }}
          >
            {project.images.map((img, index) => (
              img.src && (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + (index * 0.1) }}
                  style={{
                    overflow: 'hidden',
                    borderRadius: '4px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <img
                    src={img.src}
                    alt={`${project.title} - Image ${index + 1}`}
                    style={{
                      width: img.width || 'auto',
                      height: img.height || 'auto',
                      maxWidth: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                </motion.div>
              )
            ))}
          </motion.div>
        )}

        {/* Detailed Description */}
        {project.detailedDescription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            style={{
              maxWidth: '800px',
              margin: '0 auto',
              marginBottom: '100px'
            }}
          >
            <div style={{
              fontFamily: fonts.body || 'Graphik, sans-serif',
              fontSize: 'clamp(16px, 2vw, 18px)',
              color: colors.text || '#000000',
              lineHeight: '1.8',
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
        padding: '60px 40px',
        textAlign: 'center'
      }}>
        <button
          onClick={() => navigate(baseUrl)}
          style={{
            fontFamily: fonts.heading || 'Graphik, sans-serif',
            fontSize: '14px',
            padding: '18px 40px',
            backgroundColor: colors.primary || '#ff0080',
            color: '#FFFFFF',
            border: 'none',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 700,
            borderRadius: '4px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#e60073';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(255, 0, 128, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = colors.primary || '#ff0080';
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

export default BoldFolioProjectPage;
