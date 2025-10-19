import React from 'react';

const ObjectField = ({ id, label, value = {}, fields = [], onFieldChange, error, helpText, required }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-3">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>}
      <div className="space-y-4 p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
        {fields.map(field => (
          <div key={field.id}>
            <label className="block text-sm text-gray-600 mb-1">{field.label}</label>
            <input type={field.type || 'text'} value={value[field.id] || ''} onChange={(e) => onFieldChange(field.id, e.target.value)} placeholder={field.placeholder} className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 bg-white" />
          </div>
        ))}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {helpText && !error && <p className="mt-2 text-sm text-gray-600">{helpText}</p>}
    </div>
  );
};

export default ObjectField;
