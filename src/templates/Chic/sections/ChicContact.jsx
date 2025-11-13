import React from 'react';

/**
 * ChicContact - Sidebar Contact Section
 * Bottom section of sidebar with contact links
 */
const ChicContact = ({ content = {}, styling = {}, isEditing = false, onContentChange }) => {
  const fonts = styling.fonts || {};

  const handleFieldChange = (field, value) => {
    if (onContentChange) {
      onContentChange('contact', field, value);
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
        {(content.email || isEditing) && (
          <a
            href={content.email ? `mailto:${content.email}` : 'mailto:hello@email.com'}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => isEditing && handleFieldChange('email', e.target.textContent)}
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
              cursor: 'pointer',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 200ms ease-out'
            }}
            onMouseEnter={(e) => e.target.style.color = '#E86223'}
            onMouseLeave={(e) => e.target.style.color = '#000000'}
          >
            {isEditing && !content.email ? 'EMAIL' : 'EMAIL'}
          </a>
        )}

        {(content.telegram || isEditing) && (
          <a
            href={content.telegram || '#'}
            target="_blank"
            rel="noopener noreferrer"
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => isEditing && handleFieldChange('telegram', e.target.textContent)}
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
              cursor: 'pointer',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 200ms ease-out'
            }}
            onMouseEnter={(e) => e.target.style.color = '#E86223'}
            onMouseLeave={(e) => e.target.style.color = '#000000'}
          >
            {isEditing && !content.telegram ? 'TELEGRAM' : 'TELEGRAM'}
          </a>
        )}
      </div>
    </div>
  );
};

export default ChicContact;
