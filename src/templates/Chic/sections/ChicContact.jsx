import React from 'react';

const ChicContact = ({ content = {}, styling = {}, isEditing = false, onContentChange }) => {
  const fonts = styling.fonts || {};

  return (
    <div>
      <div style={{ fontFamily: fonts.inter, fontSize: '13px', fontWeight: 400, lineHeight: '1.2', color: '#000000', marginBottom: '10px' }}>
        CONTACT
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
        <a href="mailto:hello@email.com" style={{ fontFamily: fonts.inter, fontSize: '13px', fontWeight: 400, lineHeight: '1.8', textTransform: 'uppercase', color: '#000000', textDecoration: 'underline', textUnderlineOffset: '2px', textDecorationThickness: '1px', cursor: 'pointer' }}>EMAIL</a>
        <a href="#" style={{ fontFamily: fonts.inter, fontSize: '13px', fontWeight: 400, lineHeight: '1.8', textTransform: 'uppercase', color: '#000000', textDecoration: 'underline', textUnderlineOffset: '2px', textDecorationThickness: '1px', cursor: 'pointer' }}>TELEGRAM</a>
      </div>
    </div>
  );
};

export default ChicContact;
