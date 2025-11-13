const BoldFolioContact = ({ content = {}, isEditing = false, onContentChange }) => {
  const handleFieldChange = (field, value) => {
    if (onContentChange) {
      onContentChange('contact', field, value);
    }
  };

  const styles = {
    container: {
      padding: 'clamp(1.25rem, 4vw, 3.75rem) clamp(1rem, 3vw, 2.5rem)',
      fontFamily: 'Graphik, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Fira Sans", Roboto, "Avenir Next", "Helvetica Neue", Helvetica, Arial, sans-serif',
    },
    content: {
      maxWidth: '1400px',
      margin: '0 auto',
      textAlign: 'center',
    },
    heading: {
      color: '#ff0080',
      fontSize: 'clamp(2rem, 5vw, 3.25rem)',
      fontWeight: '500',
      lineHeight: '1.2',
      margin: '0 0 40px 0',
      letterSpacing: '-0.02em',
    },
    text: {
      color: '#000000',
      fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
      fontWeight: '400',
      lineHeight: '1.5',
      margin: '0 0 40px 0',
      maxWidth: '800px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    email: {
      color: '#ff0080',
      fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
      fontWeight: '500',
      textDecoration: 'underline',
      margin: 'clamp(0.75rem, 2vw, 1.25rem) 0',
      display: 'inline-block',
    },
    social: {
      display: 'flex',
      gap: 'clamp(1rem, 2vw, 1.25rem)',
      justifyContent: 'center',
      marginTop: 'clamp(1.25rem, 4vw, 2.5rem)',
      flexWrap: 'wrap',
    },
    socialLink: {
      color: '#000000',
      fontSize: 'clamp(0.875rem, 2vw, 1.125rem)',
      textDecoration: 'underline',
      cursor: 'pointer',
      minHeight: '44px',
      display: 'flex',
      alignItems: 'center',
    },
  };

  const social = content.social || {};

  return (
    <div id="contact" style={styles.container}>
      <div style={styles.content}>
        <h2
          style={styles.heading}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={(e) => isEditing && handleFieldChange('heading', e.target.textContent)}
        >
          {content.heading || "Let's Work Together"}
        </h2>
        <p
          style={styles.text}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={(e) => isEditing && handleFieldChange('text', e.target.textContent)}
        >
          {content.text || 'Have a project in mind? Let\'s create something amazing together.'}
        </p>
        {content.email && (
          <a
            href={`mailto:${content.email}`}
            style={styles.email}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => isEditing && handleFieldChange('email', e.target.textContent)}
          >
            {content.email}
          </a>
        )}
        {(social.twitter || social.linkedin || social.instagram || social.behance || social.dribbble) && (
          <div style={styles.social}>
            {social.twitter && (
              <a href={social.twitter} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                Twitter
              </a>
            )}
            {social.linkedin && (
              <a href={social.linkedin} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                LinkedIn
              </a>
            )}
            {social.instagram && (
              <a href={social.instagram} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                Instagram
              </a>
            )}
            {social.behance && (
              <a href={social.behance} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                Behance
              </a>
            )}
            {social.dribbble && (
              <a href={social.dribbble} target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
                Dribbble
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BoldFolioContact;
