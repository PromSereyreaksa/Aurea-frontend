const BoldFolioAbout = ({ content = {}, isEditing = false, onContentChange }) => {
  const handleFieldChange = (field, value) => {
    if (onContentChange) {
      onContentChange('about', field, value);
    }
  };

  const styles = {
    container: {
      padding: '60px 40px',
      minWidth: '1024px',
      fontFamily: 'Graphik, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Fira Sans", Roboto, "Avenir Next", "Helvetica Neue", Helvetica, Arial, sans-serif',
    },
    content: {
      maxWidth: '1400px',
      margin: '0 auto',
    },
    heading: {
      color: '#ff0080',
      fontSize: '52px',
      fontWeight: '500',
      lineHeight: '1.2',
      margin: '0 0 40px 0',
      letterSpacing: '-0.02em',
    },
    text: {
      color: '#000000',
      fontSize: '52px',
      fontWeight: '500',
      lineHeight: '1.2',
      margin: '0 0 20px 0',
      letterSpacing: '-0.02em',
    },
    subtext: {
      color: '#000000',
      fontSize: '24px',
      fontWeight: '400',
      lineHeight: '1.5',
      margin: '0 0 20px 0',
      maxWidth: '800px',
    },
  };

  return (
    <div id="about" style={styles.container}>
      <div style={styles.content}>
        <h2
          style={styles.heading}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={(e) => isEditing && handleFieldChange('heading', e.target.textContent)}
        >
          {content.heading || 'About'}
        </h2>
        <h3
          style={styles.text}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={(e) => isEditing && handleFieldChange('name', e.target.textContent)}
        >
          {content.name || 'Your Name'}
        </h3>
        <p
          style={styles.subtext}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={(e) => isEditing && handleFieldChange('role', e.target.textContent)}
        >
          {content.role || 'Designer & Art Director'}
        </p>
        <p
          style={styles.subtext}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={(e) => isEditing && handleFieldChange('bio', e.target.textContent)}
        >
          {content.bio || 'Add your bio here...'}
        </p>
        {content.location && (
          <p
            style={{...styles.subtext, fontSize: '18px'}}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => isEditing && handleFieldChange('location', e.target.textContent)}
          >
            📍 {content.location}
          </p>
        )}
        {content.email && (
          <p style={{...styles.subtext, fontSize: '18px'}}>
            <a
              href={`mailto:${content.email}`}
              style={{ color: '#ff0080', textDecoration: 'underline' }}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => isEditing && handleFieldChange('email', e.target.textContent)}
            >
              {content.email}
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default BoldFolioAbout;
