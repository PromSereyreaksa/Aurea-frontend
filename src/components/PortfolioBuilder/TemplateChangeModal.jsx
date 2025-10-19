/**
 * TemplateChangeModal Component
 *
 * Modal for changing portfolio templates with content migration preview
 * Shows compatibility analysis and warnings before switching
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import useTemplateChange from '../../hooks/useTemplateChange';
import TemplateSelector from './TemplateSelector';

const TemplateChangeModal = ({
  isOpen,
  onClose,
  currentTemplate,
  currentContent,
  onTemplateChange,
}) => {
  const [step, setStep] = useState('select'); // 'select', 'analyze', 'confirm'
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const { isAnalyzing, compatibility, analyzeChange, changeTemplate } = useTemplateChange();

  // Reset when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setStep('select');
      setSelectedTemplate(null);
    }
  }, [isOpen]);

  // Handle template selection
  const handleTemplateSelect = async (template) => {
    if (template.id === currentTemplate.id) {
      toast.error('This is your current template');
      return;
    }

    setSelectedTemplate(template);
    setStep('analyze');

    // Analyze compatibility
    await analyzeChange(currentTemplate, template, currentContent);
    setStep('confirm');
  };

  // Handle template change confirmation
  const handleConfirm = async () => {
    if (!selectedTemplate) return;

    const result = await changeTemplate(currentTemplate, selectedTemplate, currentContent);

    if (result.success) {
      toast.success(result.message);
      onTemplateChange(selectedTemplate, result.content, result.analysis);
      onClose();
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (step === 'confirm') {
      setStep('select');
      setSelectedTemplate(null);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-white">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Change Template</h2>
              <p className="text-sm text-gray-600 mt-1">
                {step === 'select' && 'Select a new template for your portfolio'}
                {step === 'analyze' && 'Analyzing compatibility...'}
                {step === 'confirm' && 'Review migration details'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
            <AnimatePresence mode="wait">
              {/* Step 1: Template Selection */}
              {step === 'select' && (
                <motion.div
                  key="select"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-6"
                >
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-blue-900">Current Template</h3>
                        <p className="text-sm text-blue-700 mt-1">
                          {currentTemplate.name} - We'll migrate your content to the new template
                        </p>
                      </div>
                    </div>
                  </div>

                  <TemplateSelector
                    onSelectTemplate={handleTemplateSelect}
                    selectedTemplateId={selectedTemplate?.id}
                  />
                </motion.div>
              )}

              {/* Step 2: Analyzing */}
              {step === 'analyze' && (
                <motion.div
                  key="analyze"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-12 flex flex-col items-center justify-center"
                >
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mb-4"></div>
                  <p className="text-lg font-medium text-gray-900">Analyzing compatibility...</p>
                  <p className="text-sm text-gray-600 mt-2">Checking how your content will migrate</p>
                </motion.div>
              )}

              {/* Step 3: Confirmation */}
              {step === 'confirm' && compatibility && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-6 space-y-6"
                >
                  {/* Template Comparison */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Current Template</p>
                      <p className="text-lg font-semibold text-gray-900">{currentTemplate.name}</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="text-sm text-gray-600 mb-1">New Template</p>
                      <p className="text-lg font-semibold text-orange-600">{selectedTemplate.name}</p>
                    </div>
                  </div>

                  {/* Migration Summary */}
                  <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Migration Summary</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-3xl font-bold text-green-600">{compatibility.summary.mappableSections}</p>
                        <p className="text-sm text-gray-600 mt-1">Sections Preserved</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-orange-600">{compatibility.summary.unmappableSections}</p>
                        <p className="text-sm text-gray-600 mt-1">Sections Lost</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-blue-600">{compatibility.summary.totalSections}</p>
                        <p className="text-sm text-gray-600 mt-1">Total Sections</p>
                      </div>
                    </div>
                  </div>

                  {/* Compatibility Status */}
                  {compatibility.compatible ? (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <svg className="w-6 h-6 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-green-900">Templates are compatible</h4>
                          <p className="text-sm text-green-700 mt-1">Your content can be migrated successfully</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <svg className="w-6 h-6 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-red-900">Compatibility issues detected</h4>
                          <p className="text-sm text-red-700 mt-1">Some content may not transfer properly</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Issues */}
                  {compatibility.issues.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-900">Issues:</h4>
                      <ul className="space-y-2">
                        {compatibility.issues.map((issue, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm text-red-700">
                            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span>{issue}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Warnings */}
                  {compatibility.warnings.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-900">Warnings:</h4>
                      <ul className="space-y-2">
                        {compatibility.warnings.map((warning, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm text-orange-700">
                            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span>{warning}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Mappable Sections */}
                  {compatibility.mappable.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-900">Content that will be preserved:</h4>
                      <div className="flex flex-wrap gap-2">
                        {compatibility.mappable.map((section) => (
                          <span
                            key={section}
                            className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full"
                          >
                            {section}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Unmappable Sections */}
                  {compatibility.unmappable.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-900">Content that will be lost:</h4>
                      <div className="flex flex-wrap gap-2">
                        {compatibility.unmappable.map((section) => (
                          <span
                            key={section}
                            className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full"
                          >
                            {section}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={step === 'confirm' ? handleBack : onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              {step === 'confirm' ? '← Back' : 'Cancel'}
            </button>

            {step === 'confirm' && (
              <button
                onClick={handleConfirm}
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-all hover:shadow-lg"
                style={{ backgroundColor: '#FF6B2C' }}
              >
                Change Template
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TemplateChangeModal;
