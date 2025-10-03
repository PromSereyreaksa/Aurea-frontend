import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getAllTemplates } from '../../templates';

const TemplateSelector = ({ onSelectTemplate, selectedTemplateId }) => {
  const templates = getAllTemplates();
  const navigate = useNavigate();

  const handleTemplateSelect = (template) => {
    onSelectTemplate(template);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {selectedTemplateId ? 'Switch Template' : 'Choose Your Template'}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {selectedTemplateId 
            ? 'You can switch to a different template, but note that your current customizations will be reset.'
            : 'Start with a professionally designed template and customize it to match your style. You can modify colors, content, layout, and more.'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((template) => (
          <motion.div
            key={template.id}
            className={`relative bg-white rounded-xl shadow-lg overflow-hidden border-2 transition-all duration-300 ${
              selectedTemplateId === template.id 
                ? 'border-[#FF6B35] shadow-xl' 
                : 'border-gray-200 hover:border-gray-300 hover:shadow-xl'
            }`}
          >
            {/* Selected/In Progress Badge */}
            {selectedTemplateId === template.id && (
              <div className="absolute top-3 right-3 z-10">
                <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>In Progress</span>
                </div>
              </div>
            )}
            {/* Template Preview */}
            <div className="aspect-[4/5] bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
              {/* Mock preview of the template */}
              <div className="absolute inset-0 p-4">
                {/* Hero section preview */}
                <div className="bg-white rounded-lg mb-3 p-3 shadow-sm">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2"></div>
                  <div className="h-2 bg-gray-300 rounded w-3/4 mx-auto mb-1"></div>
                  <div className="h-1.5 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
                
                {/* Content sections preview */}
                <div className="space-y-2">
                  <div className="bg-white rounded-lg p-2 shadow-sm">
                    <div className="h-1.5 bg-gray-300 rounded w-1/4 mb-1"></div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="h-8 bg-gray-200 rounded"></div>
                      <div className="space-y-1">
                        <div className="h-1 bg-gray-200 rounded"></div>
                        <div className="h-1 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-1 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-2 shadow-sm">
                    <div className="h-1.5 bg-gray-300 rounded w-1/3 mb-1"></div>
                    <div className="grid grid-cols-3 gap-1">
                      <div className="h-6 bg-gray-200 rounded"></div>
                      <div className="h-6 bg-gray-200 rounded"></div>
                      <div className="h-6 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected indicator */}
              {selectedTemplateId === template.id && (
                <div className="absolute top-3 right-3 bg-blue-500 text-white p-2 rounded-full">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {/* Template Info */}
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                {template.name}
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                {template.description}
              </p>
              
              {/* Template features */}
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {template.category}
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                  Responsive
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                  Customizable
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {template.previewUrl && (
                  <motion.button
                    className="flex-1 py-2 px-3 rounded-lg font-semibold transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm"
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(template.previewUrl, '_blank');
                    }}
                  >
                    Preview
                  </motion.button>
                )}
                <motion.button
                  className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-colors text-sm ${
                    selectedTemplateId === template.id
                      ? 'bg-[#FF6B35] text-white hover:bg-[#E55A2B]'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTemplateSelect(template);
                  }}
                >
                  {selectedTemplateId === template.id ? 'Selected' : 'Use This'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Coming Soon Section */}
      <div className="mt-12 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">More Templates Coming Soon</h3>
        <p className="text-gray-600 mb-6">
          We're working on more amazing templates for different industries and styles.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {['Corporate', 'Photography', 'Developer'].map((type, index) => (
            <div key={type} className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-300">
              <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4"></div>
              <h4 className="font-semibold text-gray-500 mb-2">{type}</h4>
              <p className="text-sm text-gray-400">Coming Soon</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;