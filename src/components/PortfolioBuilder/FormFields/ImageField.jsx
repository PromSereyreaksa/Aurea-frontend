import React, { useState } from 'react';
import { cn } from '../../../utils/cn';

const ImageField = ({ id, label, value, onChange, error, helpText, required, allowedFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif'] }) => {
  const [preview, setPreview] = useState(value);

  const handleChange = (e) => {
    const url = e.target.value;
    onChange(url);
    setPreview(url);
  };

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>}
      <input type="url" value={value} onChange={handleChange} placeholder="Enter image URL" className={cn('w-full px-4 py-3 border-2 rounded-lg', error ? 'border-red-500' : 'border-gray-300 focus:border-orange-500')} />
      {preview && <div className="mt-3"><img src={preview} alt="Preview" className="max-h-64 rounded border-2 border-gray-200" onError={() => setPreview('')} /></div>}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {helpText && !error && <p className="mt-2 text-sm text-gray-600">{helpText}</p>}
      {allowedFormats && <p className="mt-1 text-xs text-gray-500">Allowed: {allowedFormats.join(', ')}</p>}
    </div>
  );
};

export default ImageField;
