/**
 * TextareaField Component
 * Multi-line text input field
 */

import React from 'react';
import { cn } from '../../../utils/cn';

const TextareaField = ({
  id,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  error,
  helpText,
  validation = {},
  className,
  rows = 4,
}) => {
  const handleChange = (e) => {
    let newValue = e.target.value;

    // Apply maxLength constraint
    if (validation.maxLength && newValue.length > validation.maxLength) {
      newValue = newValue.slice(0, validation.maxLength);
    }

    onChange(newValue);
  };

  const textareaClasses = cn(
    'w-full px-4 py-3 text-base resize-y',
    'border-2 rounded-lg transition-all',
    'focus:outline-none focus:ring-2 focus:ring-orange-500/20',
    error
      ? 'border-red-500 focus:border-red-500'
      : 'border-gray-300 focus:border-orange-500',
    'disabled:bg-gray-50 disabled:text-gray-500',
    className
  );

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Textarea */}
      <textarea
        id={id}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        rows={rows}
        maxLength={validation.maxLength}
        className={textareaClasses}
      />

      {/* Character count */}
      {validation.maxLength && value && (
        <div className="flex justify-end mt-1">
          <span
            className={cn(
              'text-xs',
              value.length >= validation.maxLength
                ? 'text-red-500 font-medium'
                : 'text-gray-500'
            )}
          >
            {value.length} / {validation.maxLength}
          </span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-2 flex items-start gap-2">
          <svg
            className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Help text */}
      {helpText && !error && (
        <p className="mt-2 text-sm text-gray-600">{helpText}</p>
      )}
    </div>
  );
};

export default TextareaField;
