import React from 'react';

const CheckboxField = ({ id, label, checked, onChange, error, helpText }) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" id={id} checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500" />
        {label && <span className="text-base text-gray-900">{label}</span>}
      </label>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {helpText && !error && <p className="mt-2 text-sm text-gray-600 ml-8">{helpText}</p>}
    </div>
  );
};

export default CheckboxField;
