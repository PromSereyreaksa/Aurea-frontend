import { useState, useEffect } from 'react';

const BoldFolioWork = ({ content = {}, isEditing = false, onContentChange }) => {
  const [visibleSections, setVisibleSections] = useState([]);
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
            {(project.images || []).map((img, imgIdx) => (
              <div
                key={imgIdx}
                style={{
                  ...styles.imageBox,
                  width: img.width || '300px',
                  height: img.height || '200px',
                  backgroundImage: img.src ? `url(${img.src})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            ))}
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
