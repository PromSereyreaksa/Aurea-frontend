import React, { useState } from 'react';

/**
 * ChicContact - Sidebar Contact Section
 * Bottom section of sidebar with contact links
 */
const ChicContact = ({ content = {}, styling = {}, isEditing = false, onContentChange }) => {
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
      {/* CONTACT Label */}
      <div
        style={{
          fontFamily: fonts.inter,
          fontSize: 'clamp(0.75rem, 1.5vw, 0.813rem)',
          fontWeight: 400,
          lineHeight: '1.2',
          color: '#000000',
          marginBottom: 'clamp(0.5rem, 1vw, 0.625rem)'
        }}
      >
        CONTACT
      </div>

      {/* Contact Links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0px, 1vw, 0.5rem)' }}>
        {/* Email */}
        {(content.email || isEditing) && (
          <a
            href={!isEditing ? (content.email ? `mailto:${content.email}` : 'mailto:hello@email.com') : undefined}
            onClick={(e) => {
              if (isEditing) {
                e.preventDefault();
                openLinkModal('email', content.email);
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
            {content.email || 'hello@email.com'}
            {isEditing && (
              <span style={{
                fontSize: '10px',
                marginLeft: '6px',
                color: '#999',
                fontStyle: 'italic',
                textTransform: 'none'
              }}>
                (click to edit)
              </span>
            )}
          </a>
        )}

        {/* Telegram */}
        {(content.telegram || isEditing) && (
          <a
            href={!isEditing ? (content.telegram || '#') : undefined}
            target={!isEditing ? "_blank" : undefined}
            rel={!isEditing ? "noopener noreferrer" : undefined}
            onClick={(e) => {
              if (isEditing) {
                e.preventDefault();
                openLinkModal('telegram', content.telegram);
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
            {content.telegram || 't.me/username'}
            {isEditing && (
              <span style={{
                fontSize: '10px',
                marginLeft: '6px',
                color: '#999',
                fontStyle: 'italic',
                textTransform: 'none'
              }}>
                (click to edit)
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

export default ChicContact;
