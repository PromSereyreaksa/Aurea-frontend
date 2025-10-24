/**
 * Dynamic Step Form Component
 *
 * Renders form fields dynamically based on step configuration
 * Handles different field types: text, textarea, image, url, email, etc.
 *
 * Note: Image uploads now use the improved ImageUpload/MultiImageUpload components
 * which handle instant preview and background upload to Cloudinary automatically.
 */

import { useState } from 'react';
import ImageUpload from './ImageUpload';
import MultiImageUpload from './MultiImageUpload';

const DynamicStepForm = ({ step, data, onChange }) => {
  const [localData, setLocalData] = useState(data || {});

  const handleFieldChange = (fieldKey, value) => {
    const newData = { ...localData, [fieldKey]: value };
    setLocalData(newData);
    onChange(newData);
  };

  const renderField = (field) => {
    const value = localData[field.key] || (field.type === 'multi-image' ? [] : '');

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.key} className="space-y-3">
            <label className="block text-base font-medium text-gray-700">
              {field.label}
              {field.optional && <span className="text-gray-400 ml-1">(Optional)</span>}
            </label>
            <textarea
              value={value}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              rows={5}
              className="w-full px-5 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
          </div>
        );

      case 'image':
        return (
          <div key={field.key} className="space-y-3">
            <label className="block text-base font-medium text-gray-700">
              {field.label}
              {field.optional && <span className="text-gray-400 ml-1">(Optional)</span>}
            </label>
            <ImageUpload
              currentImage={value}
              onImageChange={(url) => handleFieldChange(field.key, url)}
              className="max-w-md"
              placeholder={field.placeholder || "Upload Image"}
            />
          </div>
        );

      case 'multi-image':
        return (
          <div key={field.key} className="space-y-3">
            <label className="block text-base font-medium text-gray-700">
              {field.label}
              {field.optional && <span className="text-gray-400 ml-1">(Optional)</span>}
            </label>
            <MultiImageUpload
              images={Array.isArray(value) ? value : []}
              onImagesChange={(images) => handleFieldChange(field.key, images)}
              maxImages={field.maxImages || 6}
            />
          </div>
        );

      case 'url':
      case 'email':
      case 'tel':
      case 'number':
      case 'text':
      default:
        return (
          <div key={field.key} className="space-y-3">
            <label className="block text-base font-medium text-gray-700">
              {field.label}
              {field.optional && <span className="text-gray-400 ml-1">(Optional)</span>}
            </label>
            <input
              type={field.type}
              value={value}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="w-full px-5 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
          </div>
        );
    }
  };

  // Check if this step has image fields
  const imageFields = step.fields?.filter(f => f.type === 'image') || [];
  const nonImageFields = step.fields?.filter(f => f.type !== 'image') || [];
  const hasImages = imageFields.length > 0;

  return (
    <div className="space-y-8">
      {/* Step Title and Description */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          {step.title}
        </h2>
        <p className="text-gray-600 text-lg">
          {step.description}
        </p>
      </div>

      {/* Form Layout - Two Column if there are images */}
      {hasImages ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Image Upload */}
          <div className="space-y-8">
            {imageFields.map(renderField)}
          </div>

          {/* Right: Other Fields */}
          <div className="space-y-8">
            {nonImageFields.map(renderField)}
          </div>
        </div>
      ) : (
        /* Single Column for non-image fields */
        <div className="w-full space-y-8">
          {step.fields?.map(renderField)}
        </div>
      )}

      {/* Multiple Items Support */}
      {step.supportsMultiple && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              You can add multiple items later in the customize step
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicStepForm;
