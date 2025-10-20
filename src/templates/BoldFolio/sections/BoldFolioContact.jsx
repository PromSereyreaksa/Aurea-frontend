const BoldFolioContact = ({ content = {}, isEditing = false, onContentChange }) => {
  const handleFieldChange = (field, value) => {
    if (onContentChange) {
      onContentChange('contact', field, value);
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
      textAlign: 'center',
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
      fontSize: '24px',
      fontWeight: '400',
      lineHeight: '1.5',
      margin: '0 0 40px 0',
      maxWidth: '800px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    email: {
      color: '#ff0080',
      fontSize: '36px',
      fontWeight: '500',
      textDecoration: 'underline',
      margin: '20px 0',
      display: 'inline-block',
    },
    social: {
      display: 'flex',
      gap: '20px',
      justifyContent: 'center',
      marginTop: '40px',
    },
    socialLink: {
      color: '#000000',
      fontSize: '18px',
      textDecoration: 'underline',
      cursor: 'pointer',
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
