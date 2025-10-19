/**
 * Schema-Driven Form Generator
 *
 * Automatically generates form fields based on template schema
 * Supports all field types defined in the backend schema
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

// Import field components
import TextField from './FormFields/TextField';
import TextareaField from './FormFields/TextareaField';
import RichTextField from './FormFields/RichTextField';
import ImageField from './FormFields/ImageField';
import ArrayField from './FormFields/ArrayField';
import ObjectField from './FormFields/ObjectField';
import SelectField from './FormFields/SelectField';
import CheckboxField from './FormFields/CheckboxField';

const SchemaFormGenerator = ({
  schema,
  values = {},
  onChange,
  onValidate,
  errors = {},
  className,
  showLabels = true,
  showHelpText = true,
  showValidation = true,
}) => {
  const [localValues, setLocalValues] = useState(values);
  const [localErrors, setLocalErrors] = useState(errors);
  const [touchedFields, setTouchedFields] = useState({});

  // Update local values when prop changes
  useEffect(() => {
    setLocalValues(values);
  }, [values]);

  // Update local errors when prop changes
  useEffect(() => {
    setLocalErrors(errors);
  }, [errors]);

  // Handle field change
  const handleFieldChange = (sectionId, fieldId, value) => {
    const updated = {
      ...localValues,
      [sectionId]: {
        ...(localValues[sectionId] || {}),
        [fieldId]: value
      }
    };

    setLocalValues(updated);

    // Mark field as touched
    setTouchedFields(prev => ({
      ...prev,
      [`${sectionId}.${fieldId}`]: true
    }));

    // Notify parent
    if (onChange) {
      onChange(updated);
    }

    // Trigger validation if callback provided
    if (onValidate) {
      onValidate(updated);
    }
  };

  // Handle field blur
  const handleFieldBlur = (sectionId, fieldId) => {
    setTouchedFields(prev => ({
      ...prev,
      [`${sectionId}.${fieldId}`]: true
    }));
  };

  // Get field error
  const getFieldError = (sectionId, fieldId) => {
    const fieldKey = `${sectionId}.${fieldId}`;
    if (!touchedFields[fieldKey] && !showValidation) return null;

    // Check for section-level errors
    if (localErrors[sectionId]) {
      const sectionErrors = localErrors[sectionId];
      if (typeof sectionErrors === 'object' && sectionErrors[fieldId]) {
        return sectionErrors[fieldId];
      }
    }

    // Check for flat error format
    if (localErrors[fieldKey]) {
      return localErrors[fieldKey];
    }

    return null;
  };

  // Get field value
  const getFieldValue = (sectionId, fieldId) => {
    return localValues[sectionId]?.[fieldId] || '';
  };

  // Render field based on type
  const renderField = (section, field) => {
    const sectionId = section.id;
    const fieldId = field.id;
    const value = getFieldValue(sectionId, fieldId);
    const error = getFieldError(sectionId, fieldId);

    const commonProps = {
      id: `${sectionId}.${fieldId}`,
      label: showLabels ? field.label : null,
      value,
      onChange: (newValue) => handleFieldChange(sectionId, fieldId, newValue),
      onBlur: () => handleFieldBlur(sectionId, fieldId),
      placeholder: field.placeholder,
      required: field.required,
      error,
      helpText: showHelpText ? field.uiHints?.helpText : null,
      validation: field.validation,
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'url':
      case 'tel':
        return <TextField key={fieldId} {...commonProps} type={field.type} />;

      case 'textarea':
        return <TextareaField key={fieldId} {...commonProps} />;

      case 'richtext':
        return <RichTextField key={fieldId} {...commonProps} />;

      case 'image':
      case 'video':
      case 'file':
        return (
          <ImageField
            key={fieldId}
            {...commonProps}
            allowedFormats={field.validation?.allowedFormats}
            mediaType={field.type}
          />
        );

      case 'number':
        return (
          <TextField
            key={fieldId}
            {...commonProps}
            type="number"
            min={field.validation?.min}
            max={field.validation?.max}
          />
        );

      case 'checkbox':
      case 'toggle':
        return (
          <CheckboxField
            key={fieldId}
            {...commonProps}
            checked={!!value}
            onChange={(checked) => handleFieldChange(sectionId, fieldId, checked)}
          />
        );

      case 'select':
        return (
          <SelectField
            key={fieldId}
            {...commonProps}
            options={field.validation?.options || []}
          />
        );

      case 'array':
        return (
          <ArrayField
            key={fieldId}
            {...commonProps}
            itemSchema={field.itemSchema}
            maxItems={field.validation?.maxItems}
            onItemChange={(index, itemValue) => {
              const currentArray = value || [];
              const updated = [...currentArray];
              updated[index] = itemValue;
              handleFieldChange(sectionId, fieldId, updated);
            }}
            onAddItem={() => {
              const currentArray = value || [];
              handleFieldChange(sectionId, fieldId, [...currentArray, {}]);
            }}
            onRemoveItem={(index) => {
              const currentArray = value || [];
              const updated = currentArray.filter((_, i) => i !== index);
              handleFieldChange(sectionId, fieldId, updated);
            }}
          />
        );

      case 'object':
        return (
          <ObjectField
            key={fieldId}
            {...commonProps}
            fields={field.fields || []}
            onFieldChange={(subFieldId, subValue) => {
              const currentObject = value || {};
              const updated = { ...currentObject, [subFieldId]: subValue };
              handleFieldChange(sectionId, fieldId, updated);
            }}
          />
        );

      default:
        console.warn(`Unknown field type: ${field.type}`);
        return <TextField key={fieldId} {...commonProps} />;
    }
  };

  // Render section
  const renderSection = (section, index) => {
    return (
      <motion.div
        key={section.id}
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        {/* Section Header */}
        <div className="mb-6 pb-4 border-b-2 border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900">
            {section.name}
            {section.required && <span className="text-red-500 ml-2">*</span>}
          </h3>
          {section.description && (
            <p className="text-sm text-gray-600 mt-2">{section.description}</p>
          )}
        </div>

        {/* Section Fields */}
        <div className="space-y-6">
          {section.fields && section.fields.length > 0 ? (
            section.fields.map(field => renderField(section, field))
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded text-gray-500">
              No fields defined for this section
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // Get sections from schema
  const sections = schema?.sections || [];

  if (!schema || sections.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded">
        <svg
          className="w-16 h-16 mx-auto text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-gray-600 font-medium">No schema available</p>
        <p className="text-sm text-gray-500 mt-1">Please select a template to begin</p>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {sections.map((section, index) => renderSection(section, index))}
    </div>
  );
};

export default SchemaFormGenerator;
