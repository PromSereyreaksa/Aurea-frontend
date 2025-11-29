import React, { useState } from 'react';

/**
 * ChicHero - Sidebar Info Section
 * Exact clone of reference design
 */
const ChicHero = ({ content = {}, styling = {}, isEditing = false, onContentChange }) => {
  const colors = styling.colors || {};
  const fonts = styling.fonts || {};
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

  return (
    <div>
      {/* INFO Label */}
      <div
        style={{
          fontFamily: fonts.inter,
          fontSize: 'clamp(0.75rem, 1.5vw, 0.813rem)',
          fontWeight: 400,
          lineHeight: '1.2',
          color: '#000000',
          marginBottom: 'clamp(1rem, 3vw, 1.875rem)'
        }}
      >
        INFO  [P.P.*]
      </div>

      {/* Name */}
      {(content.name || isEditing) && (
        <h1
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={(e) => isEditing && handleFieldChange('name', e.target.textContent)}
          style={{
            fontFamily: fonts.inter,
            fontSize: 'clamp(1rem, 2vw, 1.125rem)',
            fontWeight: 400,
            lineHeight: '1.3',
            color: '#000000',
            marginBottom: 'clamp(0.75rem, 2vw, 1.25rem)',
            margin: 0,
            padding: 0
          }}
        >
          {content.name || 'Varvara Godovikova'}
        </h1>
      )}

      {/* Bio */}
      {(content.bio || isEditing) && (
        <div
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={(e) => isEditing && handleFieldChange('bio', e.target.textContent)}
          style={{
            fontFamily: fonts.inter,
            fontSize: 'clamp(1rem, 2vw, 1.125rem)',
            fontWeight: 400,
            lineHeight: '1.3',
            color: '#000000',
            marginTop: '0',
            marginBottom: 'clamp(1rem, 3vw, 1.875rem)',
            whiteSpace: 'pre-line'
          }}
        >
          {content.bio || 'is a graphic designer\nand illustrator based in\nBarcelona. She works\nin Editorial Design, Web,\nand Brand Identity.'}
        </div>
      )}

      {/* Social Links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0px, 1vw, 0.5rem)', marginBottom: 'clamp(1rem, 3vw, 1.875rem)' }}>
        {/* Instagram */}
        {(content.instagram || isEditing) && (
          <a
            href={!isEditing ? (content.instagram || '#') : undefined}
            target={!isEditing ? "_blank" : undefined}
            rel={!isEditing ? "noopener noreferrer" : undefined}
            onClick={(e) => {
              if (isEditing) {
                e.preventDefault();
                openLinkModal('instagram', content.instagram);
              }
            }}
            style={{
              fontFamily: fonts.inter,
              fontSize: 'clamp(0.75rem, 1.5vw, 0.813rem)',
              fontWeight: 400,
              lineHeight: '1.8',
              textTransform: 'uppercase',
              color: '#000000',
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
              textDecorationThickness: '1px',
              transition: 'color 200ms ease-out',
              cursor: 'pointer',
              position: 'relative'
            }}
            onMouseEnter={(e) => e.target.style.color = '#E86223'}
            onMouseLeave={(e) => e.target.style.color = '#000000'}
          >
            INSTAGRAM
            {isEditing && (
              <span style={{
                fontSize: '10px',
                marginLeft: '6px',
                color: '#999',
                fontStyle: 'italic',
                textTransform: 'none'
              }}>
                (click to edit URL)
              </span>
            )}
          </a>
        )}

        {/* LinkedIn */}
        {(content.linkedin || isEditing) && (
          <a
            href={!isEditing ? (content.linkedin || '#') : undefined}
            target={!isEditing ? "_blank" : undefined}
            rel={!isEditing ? "noopener noreferrer" : undefined}
            onClick={(e) => {
              if (isEditing) {
                e.preventDefault();
                openLinkModal('linkedin', content.linkedin);
              }
            }}
            style={{
              fontFamily: fonts.inter,
              fontSize: 'clamp(0.75rem, 1.5vw, 0.813rem)',
              fontWeight: 400,
              lineHeight: '1.8',
              textTransform: 'uppercase',
              color: '#000000',
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
              textDecorationThickness: '1px',
              transition: 'color 200ms ease-out',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.target.style.color = '#E86223'}
            onMouseLeave={(e) => e.target.style.color = '#000000'}
          >
            LINKEDIN
            {isEditing && (
              <span style={{
                fontSize: '10px',
                marginLeft: '6px',
                color: '#999',
                fontStyle: 'italic',
                textTransform: 'none'
              }}>
                (click to edit URL)
              </span>
            )}
          </a>
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
              borderRadius: '4px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{
              margin: '0 0 20px 0',
              fontFamily: fonts.inter,
              fontSize: '18px',
              fontWeight: 600,
              textTransform: 'uppercase'
            }}>
              Edit {editingLink} Link
            </h3>
            <input
              type="text"
              value={linkValue}
              onChange={(e) => setLinkValue(e.target.value)}
              placeholder={`Enter ${editingLink} URL`}
              autoFocus
              style={{
                width: '100%',
                padding: '12px',
                fontFamily: fonts.inter,
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
                  fontFamily: fonts.inter,
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
                  fontFamily: fonts.inter,
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  backgroundColor: '#000',
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

export default ChicHero;
