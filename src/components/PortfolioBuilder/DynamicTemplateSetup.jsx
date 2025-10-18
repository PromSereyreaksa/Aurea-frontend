/**
 * Dynamic Template Setup Component
 * 
 * Uses the new Stepper.js component to guide users through portfolio setup
 * Automatically generates steps based on the selected template structure
 */

import React, { useState, useEffect } from 'react';
import Stepper, { Step } from '../Shared/Stepper';
import DynamicStepForm from './DynamicStepForm';
import { analyzeTemplate } from '../../utils/templateAnalyzer';

const DynamicTemplateSetup = ({ 
  template, 
  initialData = {}, 
  onComplete, 
  onBack 
}) => {
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialData);

  // Analyze template and generate steps
  useEffect(() => {
    if (template) {
      const generatedSteps = analyzeTemplate(template);
      setSteps(generatedSteps);
    }
  }, [template]);

  // Handle step data change
  const handleStepDataChange = (stepId, data) => {
    setFormData(prev => ({
      ...prev,
      [stepId]: data
    }));
  };

  // Handle skip
  const handleSkip = () => {
    // Just move to next step without saving data
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  // Handle completion
  const handleComplete = () => {
    console.log('=== SETUP COMPLETE ===');
    console.log('Template:', template);
    console.log('Template defaultContent:', template?.defaultContent);
    console.log('Form Data:', formData);

    // Convert form data to template content format
    const content = convertFormDataToContent(formData, template);
    console.log('Converted Content:', content);

    onComplete(content);
  };

  if (!template || steps.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <p className="text-gray-600">Analyzing template...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1800px] mx-auto py-8 px-12 mt-24">
      <Stepper
        initialStep={currentStep}
        onStepChange={(step) => setCurrentStep(step)}
        onFinalStepCompleted={handleComplete}
        backButtonText="Previous"
        nextButtonText="Continue"
        stepCircleContainerClassName="bg-white"
        stepContainerClassName="border-b border-gray-200 pb-8"
        contentClassName="py-12 px-16 pb-16"
        footerClassName="border-t border-gray-200 mt-8"
        backButtonProps={{
          className: "px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
        }}
        nextButtonProps={{
          className: "px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-all hover:shadow-lg",
          style: { backgroundColor: '#FF6B2C' }
        }}
        renderStepIndicator={({ step, currentStep, onStepClick }) => (
          <StepIndicatorCustom
            step={step}
            currentStep={currentStep}
            onStepClick={onStepClick}
            totalSteps={steps.length}
          />
        )}
      >
        {steps.map((step, index) => (
          <Step key={step.id}>
            <DynamicStepForm
              step={step}
              data={formData[step.id]}
              onChange={(data) => handleStepDataChange(step.id, data)}
              onSkip={handleSkip}
            />
          </Step>
        ))}
      </Stepper>

      {/* Bottom Actions */}
      <div className="mt-8 flex items-center justify-between">
        {/* Back to Template Selection */}
        {onBack && (
          <button
            onClick={onBack}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            ← Choose a different template
          </button>
        )}
        
        {/* Skip Setup Button */}
        <button
          onClick={handleComplete}
          className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all"
        >
          Skip Setup
        </button>
      </div>
    </div>
  );
};

/**
 * Custom Step Indicator with Orange Theme
 */
const StepIndicatorCustom = ({ step, currentStep, onStepClick, totalSteps }) => {
  const status = step === currentStep ? 'active' : step < currentStep ? 'complete' : 'inactive';
  
  const getColors = () => {
    switch (status) {
      case 'complete':
        return 'bg-orange-500 text-white';
      case 'active':
        return 'bg-orange-500 border-2 border-orange-600';
      default:
        return 'bg-gray-200 text-gray-500';
    }
  };

  return (
    <div
      onClick={() => onStepClick(step)}
      className={`relative cursor-pointer w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${getColors()}`}
    >
      {status === 'complete' ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ) : status === 'active' ? (
        <div className="w-4 h-4 rounded-full bg-white" />
      ) : (
        <span className="text-sm">{step}</span>
      )}
    </div>
  );
};

/**
 * Converts form data to template content format
 * Maps the nested form data back to the template's expected structure
 */
const convertFormDataToContent = (formData, template) => {
  // Ensure template has defaultContent
  if (!template || !template.defaultContent) {
    console.error('Template or defaultContent is missing:', template);
    return {};
  }

  const content = JSON.parse(JSON.stringify(template.defaultContent)); // Deep clone

  // Handle empty formData
  if (!formData || Object.keys(formData).length === 0) {
    return content;
  }

  for (const [stepId, stepData] of Object.entries(formData)) {
    // Skip if stepData is undefined
    if (!stepData) continue;
    if (stepId === 'basic') {
      // Basic info goes to root level
      continue;
    }

    // Map step data to content sections
    for (const [fieldKey, value] of Object.entries(stepData)) {
      if (value !== '' && value !== null && value !== undefined) {
        const keys = fieldKey.split('.');
        
        // Special handling for gallery.images (multi-image field)
        if (fieldKey === 'gallery.images' && Array.isArray(value)) {
          // Convert array of URLs to array of image objects
          content.gallery.images = value
            .filter(url => url) // Remove empty slots
            .map((url, index) => ({
              src: url,
              caption: content.gallery.images[index]?.caption || `Visual exploration ${String(index + 1).padStart(2, '0')}`,
              meta: String(index + 1).padStart(2, '0')
            }));
          continue;
        }
        
        let current = content;

        // Navigate to the correct nested location
        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          const nextKey = keys[i + 1];
          
          // Handle array indices
          if (!isNaN(nextKey)) {
            if (!Array.isArray(current[key])) {
              current[key] = [];
            }
            if (!current[key][nextKey]) {
              current[key][nextKey] = {};
            }
            current = current[key][nextKey];
            i++; // Skip the array index
          } else {
            if (!current[key]) {
              current[key] = {};
            }
            current = current[key];
          }
        }

        // Set the value
        const lastKey = keys[keys.length - 1];
        if (!isNaN(lastKey)) {
          // It's an array index, already handled above
        } else {
          current[lastKey] = value;
        }
      }
    }
  }

  return content;
};

export default DynamicTemplateSetup;
