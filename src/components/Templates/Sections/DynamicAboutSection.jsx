/**
 * Dynamic About Section Component
 *
 * Renders about/bio section dynamically based on template schema
 * Supports various layouts and field configurations
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

const DynamicAboutSection = ({
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
  const padding = sectionStyling.padding || 'default';

  // Get fields from schema
  const fields = config.fields || [];

  // Helper to get field value
  const getFieldValue = (fieldId) => {
    return content[fieldId] || '';
  };

  // Helper to get field config
  const getFieldConfig = (fieldId) => {
    return fields.find(f => f.id === fieldId) || {};
  };

  // Handle field change
  const handleFieldChange = (fieldId, value) => {
    if (onChange) {
      onChange(fieldId, value);
    }
  };

  // Handle image upload
  const handleImageUpload = async (fieldId, file) => {
    // TODO: Implement Cloudinary upload
    console.log('Image upload for field:', fieldId, file);
    // For now, use URL input
  };

  // Render field based on type
  const renderField = (field) => {
    const value = getFieldValue(field.id);
    const isActive = editingField === field.id;

    // Common input classes
    const inputClasses = cn(
      'w-full bg-transparent border-b-2 transition-all',
      isActive ? 'border-orange-500' : 'border-gray-300',
      'focus:outline-none focus:border-orange-500',
      'px-2 py-1'
    );

    switch (field.type) {
      case 'text':
        return (
          <div key={field.id} className="mb-4">
            {field.label && (
              <label className="block text-sm font-medium mb-1 opacity-70">
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
                maxLength={field.validation?.maxLength}
              />
            ) : (
              <div className="text-lg" style={{ color: textColor }}>
                {value || field.placeholder}
              </div>
            )}
            {field.uiHints?.helpText && (
              <p className="text-xs text-gray-500 mt-1">{field.uiHints.helpText}</p>
            )}
          </div>
        );

      case 'textarea':
      case 'richtext':
        return (
          <div key={field.id} className="mb-4">
            {field.label && (
              <label className="block text-sm font-medium mb-1 opacity-70">
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
                className={cn(inputClasses, 'min-h-[120px] resize-y')}
                maxLength={field.validation?.maxLength}
              />
            ) : (
              <div
                className="text-base leading-relaxed whitespace-pre-wrap"
                style={{ color: textColor }}
              >
                {value || field.placeholder}
              </div>
            )}
            {field.uiHints?.helpText && (
              <p className="text-xs text-gray-500 mt-1">{field.uiHints.helpText}</p>
            )}
          </div>
        );

      case 'image':
        return (
          <div key={field.id} className="mb-4">
            {field.label && (
              <label className="block text-sm font-medium mb-2 opacity-70">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
            )}
            {isEditing ? (
              <div>
                <input
                  type="url"
                  value={value}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholder || "Enter image URL"}
                  className={inputClasses}
                />
                {value && (
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded p-2">
                    <img
                      src={value}
                      alt={field.label}
                      className="w-full h-48 object-cover rounded"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+Image';
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              value && (
                <img
                  src={value}
                  alt={field.label}
                  className="w-full max-w-md h-auto object-cover rounded shadow-md"
                />
              )
            )}
            {field.uiHints?.helpText && (
              <p className="text-xs text-gray-500 mt-1">{field.uiHints.helpText}</p>
            )}
          </div>
        );

      case 'email':
        return (
          <div key={field.id} className="mb-4">
            {field.label && (
              <label className="block text-sm font-medium mb-1 opacity-70">
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
                className="text-lg hover:underline"
                style={{ color: styling.colors?.accent || '#FF6B2C' }}
              >
                {value || field.placeholder}
              </a>
            )}
          </div>
        );

      case 'url':
        return (
          <div key={field.id} className="mb-4">
            {field.label && (
              <label className="block text-sm font-medium mb-1 opacity-70">
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
                className="text-lg hover:underline"
                style={{ color: styling.colors?.accent || '#FF6B2C' }}
              >
                {value || field.placeholder}
              </a>
            )}
          </div>
        );

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
      case 'two_column_swiss':
      case 'split_layout':
        // Two column layout
        const imageField = fields.find(f => f.type === 'image');
        const textFields = fields.filter(f => f.type !== 'image');

        return (
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Image Column */}
            {imageField && (
              <div className="order-2 md:order-1">
                {renderField(imageField)}
              </div>
            )}

            {/* Text Column */}
            <div className="order-1 md:order-2">
              {config.name && (
                <h2
                  className="text-4xl font-bold mb-8"
                  style={{
                    color: textColor,
                    fontFamily: styling.fonts?.heading
                  }}
                >
                  {config.name}
                </h2>
              )}
              {textFields.map(field => renderField(field))}
            </div>
          </div>
        );

      case 'centered':
        // Centered layout
        return (
          <div className="max-w-3xl mx-auto text-center">
            {config.name && (
              <h2
                className="text-4xl font-bold mb-8"
                style={{
                  color: textColor,
                  fontFamily: styling.fonts?.heading
                }}
              >
                {config.name}
              </h2>
            )}
            {fields.map(field => renderField(field))}
          </div>
        );

      default:
        // Single column default
        return (
          <div className="max-w-4xl mx-auto">
            {config.name && (
              <h2
                className="text-4xl font-bold mb-8"
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
          ? 'linear-gradient(135deg, rgba(255,107,44,0.05) 0%, rgba(255,107,44,0) 100%)'
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
          Editing About
        </div>
      )}
    </motion.section>
  );
};

export default DynamicAboutSection;
