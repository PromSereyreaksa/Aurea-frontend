/**
 * Dynamic Contact Section Component
 *
 * Renders contact section dynamically based on template schema
 * Supports various contact layouts and field types
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

const DynamicContactSection = ({
  id,
  config,
  content = {},
  styling = {},
  isEditing = false,
  onChange,
  portfolioId,
}) => {
  const [editingField, setEditingField] = useState(null);

  // Get variant/layout from config
  const variant = config.variant || config.layout || 'default';

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

  // Render field based on type
  const renderField = (field) => {
    const value = getFieldValue(field.id);
    const isActive = editingField === field.id;

    const inputClasses = cn(
      'w-full bg-transparent border-b-2 transition-all',
      isActive ? 'border-orange-500' : 'border-gray-300',
      'focus:outline-none focus:border-orange-500 px-2 py-1'
    );

    switch (field.type) {
      case 'text':
        return (
          <div key={field.id} className="mb-6">
            {field.label && (
              <label className="block text-sm font-medium mb-2 opacity-70">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
            )}
            {isEditing ? (
              <input
                type="text"
                value={value}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                onFocus={() => setEditingField(field.id)}
                onBlur={() => setEditingField(null)}
                placeholder={field.placeholder}
                className={inputClasses}
              />
            ) : (
              <div className="text-lg" style={{ color: textColor }}>
                {value || field.placeholder}
              </div>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="mb-6">
            {field.label && (
              <label className="block text-sm font-medium mb-2 opacity-70">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
            )}
            {isEditing ? (
              <textarea
                value={value}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                onFocus={() => setEditingField(field.id)}
                onBlur={() => setEditingField(null)}
                placeholder={field.placeholder}
                className={cn(inputClasses, 'min-h-[80px] resize-y')}
                rows={3}
              />
            ) : (
              <div className="text-base whitespace-pre-wrap" style={{ color: textColor }}>
                {value || field.placeholder}
              </div>
            )}
          </div>
        );

      case 'email':
        return (
          <div key={field.id} className="mb-6">
            {field.label && (
              <label className="block text-sm font-medium mb-2 opacity-70">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
            )}
            {isEditing ? (
              <input
                type="email"
                value={value}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                onFocus={() => setEditingField(field.id)}
                onBlur={() => setEditingField(null)}
                placeholder={field.placeholder}
                className={inputClasses}
              />
            ) : (
              <a
                href={`mailto:${value}`}
                className="text-lg hover:underline inline-flex items-center gap-2 group"
                style={{ color: accentColor }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {value || field.placeholder}
              </a>
            )}
          </div>
        );

      case 'tel':
        return (
          <div key={field.id} className="mb-6">
            {field.label && (
              <label className="block text-sm font-medium mb-2 opacity-70">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
            )}
            {isEditing ? (
              <input
                type="tel"
                value={value}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                onFocus={() => setEditingField(field.id)}
                onBlur={() => setEditingField(null)}
                placeholder={field.placeholder}
                className={inputClasses}
              />
            ) : (
              <a
                href={`tel:${value}`}
                className="text-lg hover:underline inline-flex items-center gap-2"
                style={{ color: accentColor }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {value || field.placeholder}
              </a>
            )}
          </div>
        );

      case 'url':
        return (
          <div key={field.id} className="mb-6">
            {field.label && (
              <label className="block text-sm font-medium mb-2 opacity-70">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
            )}
            {isEditing ? (
              <input
                type="url"
                value={value}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                onFocus={() => setEditingField(field.id)}
                onBlur={() => setEditingField(null)}
                placeholder={field.placeholder}
                className={inputClasses}
              />
            ) : (
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg hover:underline inline-flex items-center gap-2"
                style={{ color: accentColor }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {value || field.placeholder}
              </a>
            )}
          </div>
        );

      case 'button':
        return (
          <div key={field.id} className="mb-6">
            {isEditing ? (
              <div>
                <label className="block text-sm font-medium mb-2 opacity-70">
                  Button Text
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  onFocus={() => setEditingField(field.id)}
                  onBlur={() => setEditingField(null)}
                  placeholder={field.placeholder || "Button Text"}
                  className={inputClasses}
                />
              </div>
            ) : (
              <button
                className="px-8 py-3 text-white font-semibold rounded transition-all hover:shadow-lg"
                style={{ backgroundColor: accentColor }}
              >
                {value || field.placeholder || 'Contact Me'}
              </button>
            )}
          </div>
        );

      case 'object':
        // Handle social links
        if (field.id === 'social' || field.id === 'links') {
          const socialValue = value || {};
          const socialFields = field.fields || [];

          return (
            <div key={field.id} className="mb-6">
              {field.label && (
                <label className="block text-sm font-medium mb-3 opacity-70">
                  {field.label}
                </label>
              )}
              <div className="space-y-3">
                {socialFields.map(subField => {
                  const subValue = socialValue[subField.id] || '';
                  return (
                    <div key={subField.id}>
                      {isEditing ? (
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            {subField.label}
                          </label>
                          <input
                            type="url"
                            value={subValue}
                            onChange={(e) => {
                              const updated = { ...socialValue, [subField.id]: e.target.value };
                              handleFieldChange(field.id, updated);
                            }}
                            placeholder={subField.placeholder}
                            className={inputClasses}
                          />
                        </div>
                      ) : (
                        subValue && (
                          <a
                            href={subValue}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-base hover:underline"
                            style={{ color: accentColor }}
                          >
                            {subField.label}
                          </a>
                        )
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }
        return null;

      default:
        return null;
    }
  };

  // Padding classes
  const paddingClasses = {
    tight: 'py-12 px-6',
    default: 'py-20 px-8',
    relaxed: 'py-32 px-12',
  }[padding] || 'py-20 px-8';

  // Render based on variant
  const renderVariant = () => {
    switch (variant) {
      case 'minimal_swiss':
      case 'centered':
        return (
          <div className="max-w-2xl mx-auto text-center">
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
            <div className="space-y-8">
              {fields.map(field => renderField(field))}
            </div>
          </div>
        );

      case 'two_column':
        const halfIndex = Math.ceil(fields.length / 2);
        const leftFields = fields.slice(0, halfIndex);
        const rightFields = fields.slice(halfIndex);

        return (
          <div className="max-w-6xl mx-auto">
            {config.name && (
              <h2
                className="text-5xl font-bold mb-12 text-center"
                style={{
                  color: textColor,
                  fontFamily: styling.fonts?.heading
                }}
              >
                {config.name}
              </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>{leftFields.map(field => renderField(field))}</div>
              <div>{rightFields.map(field => renderField(field))}</div>
            </div>
          </div>
        );

      default:
        return (
          <div className="max-w-4xl mx-auto">
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
            <div className="space-y-6">
              {fields.map(field => renderField(field))}
            </div>
          </div>
        );
    }
  };

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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {renderVariant()}

      {/* Edit mode indicator */}
      {isEditing && (
        <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs px-2 py-1 rounded">
          Editing Contact
        </div>
      )}
    </motion.section>
  );
};

export default DynamicContactSection;
