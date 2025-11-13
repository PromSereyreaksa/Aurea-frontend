import React from 'react';
import TextareaField from './TextareaField';

// Simplified rich text field - can be enhanced with TipTap later
const RichTextField = (props) => {
  return <TextareaField {...props} rows={8} />;
};

export default RichTextField;
