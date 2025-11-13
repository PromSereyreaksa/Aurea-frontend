import React from 'react';

const ArrayField = ({ id, label, value = [], onItemChange, onAddItem, onRemoveItem, error, helpText, required, maxItems }) => {
  const items = Array.isArray(value) ? value : [];

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>}
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input type="text" value={item} onChange={(e) => onItemChange(index, e.target.value)} className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500" placeholder={`Item ${index + 1}`} />
            <button onClick={() => onRemoveItem(index)} className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Remove</button>
          </div>
        ))}
        {(!maxItems || items.length < maxItems) && (
          <button onClick={onAddItem} className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 text-gray-600 hover:text-orange-600 transition-colors">+ Add Item</button>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {helpText && !error && <p className="mt-2 text-sm text-gray-600">{helpText}</p>}
    </div>
  );
};

export default ArrayField;
