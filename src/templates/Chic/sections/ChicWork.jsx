import React from 'react';
import { motion } from 'framer-motion';

/**
 * ChicWork - Two-Column Masonry Gallery
 * Exact specifications: 1024px content area, absolute positioning
 * Left column: 467px @ x:40px | Right column: 705px @ x:517px
 */
const ChicWork = ({ content = {}, styling = {}, isEditing = false }) => {
  const fonts = styling.fonts || {};
  const projects = content.projects || [];

  // Exact positioning patterns from reference design
  // Each project gets: { column: 'left'|'right', x, y, width, height, zIndex }
  const getProjectLayout = (index) => {
    const layouts = [
      // Row 1: Both columns start
      { column: 'right', x: 517, y: 39, width: 705, height: 491, zIndex: 346 },
      { column: 'left', x: 40, y: 39, width: 467, height: 312, zIndex: 309 },

      // Row 2: Staggered
      { column: 'left', x: 40, y: 409, width: 467, height: 595, zIndex: 351 },
      { column: 'right', x: 517, y: 578, width: 705, height: 529, zIndex: 308 },

      // Row 3: Continue stagger
      { column: 'left', x: 40, y: 1052, width: 467, height: 701, zIndex: 310 },
      { column: 'right', x: 518, y: 1168, width: 696, height: 398, zIndex: 352 },

      // Row 4: Deep stagger
      { column: 'right', x: 518, y: 1612, width: 696, height: 397, zIndex: 360 },
      { column: 'left', x: 40, y: 1800, width: 467, height: 679, zIndex: 311 },

      // Row 5: Right continues
      { column: 'right', x: 518, y: 2053, width: 696, height: 387, zIndex: 357 },
      { column: 'left', x: 40, y: 2526, width: 467, height: 660, zIndex: 320 },

      // Row 6: Final rows with variations
      { column: 'right', x: 507, y: 2493, width: 725, height: 560, zIndex: 317 },
      { column: 'left', x: 40, y: 3233, width: 467, height: 580, zIndex: 321 },

      // Row 7: Closing
      { column: 'right', x: 518, y: 3100, width: 696, height: 450, zIndex: 318 },
      { column: 'left', x: 40, y: 3860, width: 467, height: 520, zIndex: 322 },

      // Row 8: Final pieces
      { column: 'right', x: 517, y: 3600, width: 705, height: 480, zIndex: 319 },
      { column: 'left', x: 40, y: 4427, width: 467, height: 600, zIndex: 323 }
    ];

    return layouts[index % layouts.length];
  };

  // Calculate total canvas height dynamically
  const calculateCanvasHeight = () => {
    if (projects.length === 0) return 800;
    if (projects.length <= 2) return 1200;
    if (projects.length <= 4) return 2000;
    if (projects.length <= 6) return 2800;
    if (projects.length <= 10) return 4200;
    return 5200;
  };

  const canvasHeight = calculateCanvasHeight();

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: `${canvasHeight}px`,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale'
      }}
    >
      {/* Projects with absolute positioning */}
      {projects.map((project, index) => {
        const layout = getProjectLayout(index);
        const titleY = layout.y - 28; // Title 8-20px above image

        return (
          <React.Fragment key={project.id || index}>
            {/* Project Title */}
            {project.title && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.4 }}
                style={{
                  position: 'absolute',
                  left: `${layout.x}px`,
                  top: `${titleY}px`,
                  maxWidth: '351px',
                  zIndex: layout.zIndex + 1
                }}
              >
                <h2
                  style={{
                    fontFamily: fonts.inter,
                    fontSize: '15px',
                    fontWeight: 500,
                    fontVariationSettings: "'wght' 500",
                    lineHeight: '16px',
                    letterSpacing: '-0.6px',
                    textTransform: 'uppercase',
                    color: '#000000',
                    margin: 0,
                    cursor: project.link ? 'pointer' : 'default',
                    transition: 'color 0.3s ease'
                  }}
                  onClick={() => project.link && window.open(project.link, '_blank')}
                  onMouseEnter={(e) => { if (project.link) e.target.style.color = '#E86223'; }}
                  onMouseLeave={(e) => { e.target.style.color = '#000000'; }}
                >
                  {project.title}
                </h2>

                {/* Metadata */}
                {(project.subtitle || project.year || project.awards) && (
                  <div
                    style={{
                      fontFamily: fonts.inter,
                      fontSize: '14px',
                      fontWeight: 480,
                      fontVariationSettings: "'wght' 480",
                      lineHeight: '14px',
                      letterSpacing: '-0.3px',
                      color: '#818181',
                      marginTop: '14px',
                      maxWidth: '336px'
                    }}
                  >
                    {project.subtitle && <span>{project.subtitle}</span>}
                    {project.subtitle && project.year && <span> —— </span>}
                    {project.year && <span>{project.year}</span>}
                    {project.awards && (
                      <div style={{ marginTop: '4px' }}>
                        {project.awards}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Project Image */}
            {project.image && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
                style={{
                  position: 'absolute',
                  left: `${layout.x}px`,
                  top: `${layout.y}px`,
                  width: `${layout.width}px`,
                  height: `${layout.height}px`,
                  zIndex: layout.zIndex,
                  overflow: 'hidden',
                  cursor: project.link ? 'pointer' : 'default'
                }}
                onClick={() => project.link && window.open(project.link, '_blank')}
              >
                <img
                  src={project.image}
                  alt={project.title || 'Project'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.5s ease-in, opacity 0.3s ease',
                    opacity: 1
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.01)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                />
              </motion.div>
            )}
          </React.Fragment>
        );
      })}

      {/* GO UP link at bottom */}
      {projects.length > 3 && (
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '40px',
            zIndex: 400
          }}
        >
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{
              fontFamily: fonts.inter,
              fontSize: '15px',
              fontWeight: 500,
              textTransform: 'uppercase',
              color: '#000000',
              textDecoration: 'none',
              background: 'linear-gradient(to right, #000000 0%, #000000 100%)',
              backgroundSize: '1px 1px',
              backgroundPosition: '0 93%',
              backgroundRepeat: 'repeat-x',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              letterSpacing: '-0.6px'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#E86223';
              e.target.style.background = 'none';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#000000';
              e.target.style.background = 'linear-gradient(to right, #000000 0%, #000000 100%)';
              e.target.style.backgroundSize = '1px 1px';
              e.target.style.backgroundPosition = '0 93%';
              e.target.style.backgroundRepeat = 'repeat-x';
            }}
          >
            GO UP
          </a>
        </div>
      )}

      {/* Empty State */}
      {isEditing && projects.length === 0 && (
        <div
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            backgroundColor: '#FAFAFA',
            border: '2px dashed #d6d6d6',
            borderRadius: '8px',
            margin: '40px'
          }}
        >
          <p
            style={{
              fontFamily: fonts.inter,
              fontSize: '14px',
              color: '#666666',
              margin: 0
            }}
          >
            No projects yet. Add your first project to showcase your work.
          </p>
        </div>
      )}
    </div>
  );
};

export default ChicWork;
