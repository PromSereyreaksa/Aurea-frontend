/**
 * Dynamic Custom Section Component
 *
 * Generic section renderer for custom/unknown section types
 * Automatically renders fields based on their type definitions
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

const DynamicCustomSection = ({
  id,
  config,
  content = {},
  styling = {},
  isEditing = false,
  onChange,
  portfolioId,
}) => {
  const [editingField, setEditingField] = useState(null);

  // Get section styling
  const sectionStyling = config.styling || {};
  const backgroundColor = sectionStyling.backgroundColor || styling.colors?.background || '#FFFFFF';
  const textColor = styling.colors?.text || '#000000';
  const accentColor = styling.colors?.accent || '#FF6B2C';
  const padding = sectionStyling.padding || 'default';

  // Get fields from schema
  const fields = config.fields || [];

  // Get field value
  const getFieldValue = (fieldId) => {
    return content[fieldId] || '';
  };

  // Handle field change
  const handleFieldChange = (fieldId, value) => {
    if (onChange) {
      onChange(fieldId, value);
    }
  };

  // Render field dynamically based on type
  const renderField = (field, index) => {
    const value = getFieldValue(field.id);
    const isActive = editingField === field.id;

    const inputClasses = cn(
      'w-full bg-transparent border-b-2 transition-all',
      isActive ? 'border-orange-500' : 'border-gray-300',
      'focus:outline-none focus:border-orange-500 px-2 py-1'
    );

    const renderInput = () => {
      switch (field.type) {
        case 'text':
          return (
            <input
              type="text"
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              onFocus={() => setEditingField(field.id)}
              onBlur={() => setEditingField(null)}
              placeholder={field.placeholder}
              className={inputClasses}
              maxLength={field.validation?.maxLength}
            />
          );

        case 'textarea':
          return (
            <textarea
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              onFocus={() => setEditingField(field.id)}
              onBlur={() => setEditingField(null)}
              placeholder={field.placeholder}
              className={cn(inputClasses, 'min-h-[100px] resize-y')}
              maxLength={field.validation?.maxLength}
              rows={4}
            />
          );

        case 'richtext':
          return (
            <textarea
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              onFocus={() => setEditingField(field.id)}
              onBlur={() => setEditingField(null)}
              placeholder={field.placeholder}
              className={cn(inputClasses, 'min-h-[150px] resize-y')}
              rows={6}
            />
          );

        case 'email':
          return (
            <input
              type="email"
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              onFocus={() => setEditingField(field.id)}
              onBlur={() => setEditingField(null)}
              placeholder={field.placeholder}
              className={inputClasses}
            />
          );

        case 'url':
          return (
            <input
              type="url"
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              onFocus={() => setEditingField(field.id)}
              onBlur={() => setEditingField(null)}
              placeholder={field.placeholder}
              className={inputClasses}
            />
          );

        case 'tel':
          return (
            <input
              type="tel"
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              onFocus={() => setEditingField(field.id)}
              onBlur={() => setEditingField(null)}
              placeholder={field.placeholder}
              className={inputClasses}
            />
          );

        case 'number':
          return (
            <input
              type="number"
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              onFocus={() => setEditingField(field.id)}
              onBlur={() => setEditingField(null)}
              placeholder={field.placeholder}
              className={inputClasses}
              min={field.validation?.min}
              max={field.validation?.max}
            />
          );

        case 'image':
          return (
            <div>
              <input
                type="url"
                value={value}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                placeholder={field.placeholder || "Image URL"}
                className={inputClasses}
              />
              {value && (
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded p-2">
                  <img
                    src={value}
                    alt={field.label}
                    className="w-full max-h-64 object-cover rounded"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+Image';
                    }}
                  />
                </div>
              )}
            </div>
          );

        case 'checkbox':
        case 'toggle':
          return (
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!value}
                onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className="text-sm">{field.placeholder || 'Enable'}</span>
            </label>
          );

        case 'select':
          return (
            <select
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className={cn(inputClasses, 'cursor-pointer')}
            >
              <option value="">Select {field.label}</option>
              {field.validation?.options?.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );

        default:
          return (
            <input
              type="text"
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className={inputClasses}
            />
          );
      }
    };

    const renderDisplay = () => {
      switch (field.type) {
        case 'text':
        case 'textarea':
        case 'richtext':
          return (
            <div className="text-lg" style={{ color: textColor }}>
              {value || field.placeholder}
            </div>
          );

        case 'email':
          return (
            <a
              href={`mailto:${value}`}
              className="text-lg hover:underline"
              style={{ color: accentColor }}
            >
              {value || field.placeholder}
            </a>
          );

        case 'url':
          return (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg hover:underline"
              style={{ color: accentColor }}
            >
              {value || field.placeholder}
            </a>
          );

        case 'tel':
          return (
            <a
              href={`tel:${value}`}
              className="text-lg hover:underline"
              style={{ color: accentColor }}
            >
              {value || field.placeholder}
            </a>
          );

        case 'number':
          return (
            <div className="text-lg" style={{ color: textColor }}>
              {value || field.placeholder}
            </div>
          );

        case 'image':
          return value ? (
            <img
              src={value}
              alt={field.label}
              className="w-full max-w-2xl h-auto object-cover rounded shadow-md"
            />
          ) : null;

        case 'checkbox':
        case 'toggle':
          return (
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-5 h-5 rounded border-2 flex items-center justify-center',
                  value ? 'bg-orange-500 border-orange-500' : 'border-gray-300'
                )}
              >
                {value && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span className="text-lg" style={{ color: textColor }}>
                {field.placeholder || field.label}
              </span>
            </div>
          );

        case 'select':
          return (
            <div className="text-lg" style={{ color: textColor }}>
              {value || field.placeholder}
            </div>
          );

        default:
          return (
            <div className="text-lg" style={{ color: textColor }}>
              {value || field.placeholder}
            </div>
          );
      }
    };

    return (
      <motion.div
        key={field.id}
        className="mb-6"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
      >
        {field.label && (
          <label className="block text-sm font-medium mb-2 opacity-70">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        {isEditing ? renderInput() : renderDisplay()}
        {field.uiHints?.helpText && (
          <p className="text-xs text-gray-500 mt-1">{field.uiHints.helpText}</p>
        )}
      </motion.div>
    );
  };

  // Padding classes
  const paddingClasses = {
    tight: 'py-12 px-6',
    default: 'py-20 px-8',
    relaxed: 'py-32 px-12',
  }[padding] || 'py-20 px-8';

  return (
    <motion.section
      id={id}
      className={cn('relative', paddingClasses)}
      style={{
        backgroundColor,
        backgroundImage: sectionStyling.background === 'gradient'
          ? 'linear-gradient(135deg, rgba(255,107,44,0.05) 0%, transparent 100%)'
          : undefined
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Section heading */}
        {config.name && (
          <h2
            className="text-5xl font-bold mb-12"
            style={{
              color: textColor,
              fontFamily: styling.fonts?.heading
            }}
          >
            {config.name}
          </h2>
        )}

        {/* Section description */}
        {config.description && (
          <p
            className="text-lg mb-8 opacity-70"
            style={{ color: textColor }}
          >
            {config.description}
          </p>
        )}

        {/* Dynamic fields */}
        <div className="space-y-6">
          {fields.map((field, index) => renderField(field, index))}
        </div>

        {/* No fields message */}
        {fields.length === 0 && isEditing && (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded">
            <p className="text-gray-500">No fields defined for this section</p>
            <p className="text-sm text-gray-400 mt-2">
              Configure fields in the template schema
            </p>
          </div>
        )}
      </div>

      {/* Edit mode indicator */}
      {isEditing && (
        <div className="absolute top-4 right-4 bg-purple-500 text-white text-xs px-2 py-1 rounded">
          Editing Custom Section ({config.type})
        </div>
      )}
    </motion.section>
  );
};

export default DynamicCustomSection;
