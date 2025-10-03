/**
 * Step Indicator Component
 * 
 * Shows the current step in the portfolio creation process
 * (Template Selected → Setup → Customize → Preview & Publish)
 */

import React from 'react';

const StepIndicator = ({ currentStep }) => {
  // Don't show on select step
  if (currentStep === 'select') {
    return null;
  }

  const steps = [
    { key: 'select', label: 'Template Selected', number: 1 },
    { key: 'setup', label: 'Setup Information', number: 2 },
    { key: 'customize', label: 'Customize', number: 3 },
    { key: 'preview', label: 'Preview & Publish', number: 4 },
  ];

  const getStepStatus = (stepKey) => {
    const stepOrder = ['select', 'setup', 'customize', 'preview'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(stepKey);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const getStepColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-orange-600 text-white';
      case 'current':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-gray-300 text-gray-600';
    }
  };

  return (
    <div className="border-t border-gray-200 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center py-3 space-x-6">
          {steps.map((step) => {
            const status = getStepStatus(step.key);
            return (
              <div key={step.key} className="flex items-center space-x-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${getStepColor(
                    status
                  )}`}
                >
                  {status === 'completed' ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <span className="text-sm text-gray-600">{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
