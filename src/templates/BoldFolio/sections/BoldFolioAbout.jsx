import { useState } from 'react';

const BoldFolioAbout = ({ content = {}, isEditing = false, onContentChange }) => {
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
      handleFieldChange(editingLink, linkValue);
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
      fontSize: 'clamp(2rem, 5vw, 3.25rem)',
      fontWeight: '500',
      lineHeight: '1.2',
      margin: '0 0 20px 0',
      letterSpacing: '-0.02em',
    },
    subtext: {
      color: '#000000',
      fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
      fontWeight: '400',
      lineHeight: '1.5',
      margin: '0 0 20px 0',
      maxWidth: 'clamp(600px, 80vw, 800px)',
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
            style={{...styles.subtext, fontSize: 'clamp(0.938rem, 2vw, 1.125rem)'}}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => isEditing && handleFieldChange('location', e.target.textContent)}
          >
            📍 {content.location}
          </p>
        )}
        {content.email && (
          <p style={{...styles.subtext, fontSize: 'clamp(0.938rem, 2vw, 1.125rem)'}}>
            <a
              href={!isEditing ? `mailto:${content.email}` : undefined}
              onClick={(e) => {
                if (isEditing) {
                  e.preventDefault();
                  openLinkModal('email', content.email);
                }
              }}
              style={{
                color: '#ff0080',
                textDecoration: 'underline',
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
          </p>
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
              Edit Email Address
            </h3>
            <input
              type="text"
              value={linkValue}
              onChange={(e) => setLinkValue(e.target.value)}
              placeholder="Enter email address"
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

export default BoldFolioAbout;
