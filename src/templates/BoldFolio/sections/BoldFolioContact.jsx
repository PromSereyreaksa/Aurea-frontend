import { useState } from 'react';

const BoldFolioContact = ({ content = {}, isEditing = false, onContentChange }) => {
  const [editingLink, setEditingLink] = useState(null);
  const [linkValue, setLinkValue] = useState('');

  const handleFieldChange = (field, value) => {
    if (onContentChange) {
      onContentChange(field, value);
    }
  };

  const openLinkModal = (field, currentValue) => {
    if (!isEditing) return;
    setEditingLink(field);
    setLinkValue(currentValue || '');
  };

  const saveLinkValue = () => {
    if (editingLink) {
      // Handle social links separately (they're nested in social object)
      if (['twitter', 'linkedin', 'instagram', 'behance', 'dribbble'].includes(editingLink)) {
        const updatedSocial = { ...(content.social || {}), [editingLink]: linkValue };
        handleFieldChange('social', updatedSocial);
      } else {
        handleFieldChange(editingLink, linkValue);
      }
      setEditingLink(null);
      setLinkValue('');
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
            href={!isEditing ? `mailto:${content.email}` : undefined}
            onClick={(e) => {
              if (isEditing) {
                e.preventDefault();
                openLinkModal('email', content.email);
              }
            }}
            style={{
              ...styles.email,
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            {content.email}
            {isEditing && (
              <span style={{
                fontSize: '10px',
                marginLeft: '6px',
                color: '#999',
                fontStyle: 'italic'
              }}>
                (click to edit)
              </span>
            )}
          </a>
        )}
        {(social.twitter || social.linkedin || social.instagram || social.behance || social.dribbble || isEditing) && (
          <div style={styles.social}>
            {(social.twitter || isEditing) && (
              <a
                href={!isEditing ? social.twitter : undefined}
                target={!isEditing ? "_blank" : undefined}
                rel={!isEditing ? "noopener noreferrer" : undefined}
                onClick={(e) => {
                  if (isEditing) {
                    e.preventDefault();
                    openLinkModal('twitter', social.twitter);
                  }
                }}
                style={{
                  ...styles.socialLink,
                  cursor: 'pointer'
                }}
              >
                Twitter
                {isEditing && (
                  <span style={{
                    fontSize: '10px',
                    marginLeft: '6px',
                    color: '#999',
                    fontStyle: 'italic'
                  }}>
                    (click to edit)
                  </span>
                )}
              </a>
            )}
            {(social.linkedin || isEditing) && (
              <a
                href={!isEditing ? social.linkedin : undefined}
                target={!isEditing ? "_blank" : undefined}
                rel={!isEditing ? "noopener noreferrer" : undefined}
                onClick={(e) => {
                  if (isEditing) {
                    e.preventDefault();
                    openLinkModal('linkedin', social.linkedin);
                  }
                }}
                style={{
                  ...styles.socialLink,
                  cursor: 'pointer'
                }}
              >
                LinkedIn
                {isEditing && (
                  <span style={{
                    fontSize: '10px',
                    marginLeft: '6px',
                    color: '#999',
                    fontStyle: 'italic'
                  }}>
                    (click to edit)
                  </span>
                )}
              </a>
            )}
            {(social.instagram || isEditing) && (
              <a
                href={!isEditing ? social.instagram : undefined}
                target={!isEditing ? "_blank" : undefined}
                rel={!isEditing ? "noopener noreferrer" : undefined}
                onClick={(e) => {
                  if (isEditing) {
                    e.preventDefault();
                    openLinkModal('instagram', social.instagram);
                  }
                }}
                style={{
                  ...styles.socialLink,
                  cursor: 'pointer'
                }}
              >
                Instagram
                {isEditing && (
                  <span style={{
                    fontSize: '10px',
                    marginLeft: '6px',
                    color: '#999',
                    fontStyle: 'italic'
                  }}>
                    (click to edit)
                  </span>
                )}
              </a>
            )}
            {(social.behance || isEditing) && (
              <a
                href={!isEditing ? social.behance : undefined}
                target={!isEditing ? "_blank" : undefined}
                rel={!isEditing ? "noopener noreferrer" : undefined}
                onClick={(e) => {
                  if (isEditing) {
                    e.preventDefault();
                    openLinkModal('behance', social.behance);
                  }
                }}
                style={{
                  ...styles.socialLink,
                  cursor: 'pointer'
                }}
              >
                Behance
                {isEditing && (
                  <span style={{
                    fontSize: '10px',
                    marginLeft: '6px',
                    color: '#999',
                    fontStyle: 'italic'
                  }}>
                    (click to edit)
                  </span>
                )}
              </a>
            )}
            {(social.dribbble || isEditing) && (
              <a
                href={!isEditing ? social.dribbble : undefined}
                target={!isEditing ? "_blank" : undefined}
                rel={!isEditing ? "noopener noreferrer" : undefined}
                onClick={(e) => {
                  if (isEditing) {
                    e.preventDefault();
                    openLinkModal('dribbble', social.dribbble);
                  }
                }}
                style={{
                  ...styles.socialLink,
                  cursor: 'pointer'
                }}
              >
                Dribbble
                {isEditing && (
                  <span style={{
                    fontSize: '10px',
                    marginLeft: '6px',
                    color: '#999',
                    fontStyle: 'italic'
                  }}>
                    (click to edit)
                  </span>
                )}
              </a>
            )}
          </div>
        )}
      </div>

      {/* Link Edit Modal */}
      {editingLink && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setEditingLink(null)}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '30px',
              borderRadius: '8px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{
              margin: '0 0 20px 0',
              fontFamily: 'Graphik, sans-serif',
              fontSize: '18px',
              fontWeight: 600,
              textTransform: 'uppercase'
            }}>
              Edit {editingLink} {editingLink === 'email' ? 'Address' : 'Link'}
            </h3>
            <input
              type="text"
              value={linkValue}
              onChange={(e) => setLinkValue(e.target.value)}
              placeholder={editingLink === 'email' ? 'Enter email address' : `Enter ${editingLink} URL`}
              autoFocus
              style={{
                width: '100%',
                padding: '12px',
                fontFamily: 'Graphik, sans-serif',
                fontSize: '14px',
                border: '2px solid #e5e7eb',
                borderRadius: '4px',
                marginBottom: '20px',
                outline: 'none'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  saveLinkValue();
                } else if (e.key === 'Escape') {
                  setEditingLink(null);
                }
              }}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setEditingLink(null)}
                style={{
                  padding: '10px 20px',
                  fontFamily: 'Graphik, sans-serif',
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  backgroundColor: '#f3f4f6',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Cancel
              </button>
              <button
                onClick={saveLinkValue}
                style={{
                  padding: '10px 20px',
                  fontFamily: 'Graphik, sans-serif',
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  backgroundColor: '#ff0080',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoldFolioContact;
