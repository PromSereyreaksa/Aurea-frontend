import React from 'react';
import { cn } from '../../../utils/cn';

const SelectField = ({ id, label, value, onChange, options = [], error, helpText, required, placeholder = 'Select an option' }) => {
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>}
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} required={required} className={cn('w-full px-4 py-3 border-2 rounded-lg bg-white cursor-pointer', error ? 'border-red-500' : 'border-gray-300 focus:border-orange-500')}>
        <option value="">{placeholder}</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {helpText && !error && <p className="mt-2 text-sm text-gray-600">{helpText}</p>}
    </div>
  );
};

export default SelectField;
