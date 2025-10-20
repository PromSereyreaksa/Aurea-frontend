import React from 'react';

/**
 * ChicHero - Sidebar Info Section
 * Exact clone of reference design
 */
const ChicHero = ({ content = {}, styling = {}, isEditing = false, onContentChange }) => {
  const colors = styling.colors || {};
  const fonts = styling.fonts || {};

  const handleFieldChange = (field, value) => {
    if (onContentChange) {
      onContentChange('hero', field, value);
    }
  };

  return (
    <div>
      {/* INFO Label */}
      <div
        style={{
          fontFamily: fonts.inter,
          fontSize: '13px',
          fontWeight: 400,
          lineHeight: '1.2',
          color: '#000000',
          marginBottom: '30px'
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
            fontSize: '18px',
            fontWeight: 400,
            lineHeight: '1.3',
            color: '#000000',
            marginBottom: '20px',
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
            fontSize: '18px',
            fontWeight: 400,
            lineHeight: '1.3',
            color: '#000000',
            marginTop: '0',
            marginBottom: '30px',
            whiteSpace: 'pre-line'
          }}
        >
          {content.bio || 'is a graphic designer\nand illustrator based in\nBarcelona. She works\nin Editorial Design, Web,\nand Brand Identity.'}
        </div>
      )}

      {/* Social Links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', marginBottom: '30px' }}>
        {(content.instagram || isEditing) && (
          <a
            href={content.instagram || '#'}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: fonts.inter,
              fontSize: '13px',
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
            INSTAGRAM
          </a>
        )}

        {(content.linkedin || isEditing) && (
          <a
            href={content.linkedin || '#'}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: fonts.inter,
              fontSize: '13px',
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
          </a>
        )}
      </div>
    </div>
  );
};

export default ChicHero;
