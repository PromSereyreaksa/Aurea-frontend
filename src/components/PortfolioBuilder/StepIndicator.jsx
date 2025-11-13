/**
 * Step Indicator Component
 *
 * Shows the current step in the portfolio creation process
 * (Template Selected → Setup → Customize → Preview & Publish)
 * Steps are clickable to allow navigation between completed/current steps
 */

const StepIndicator = ({ currentStep, onStepChange }) => {
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

  const getStepColor = (status, isClickable) => {
    const baseClasses = status === 'completed'
      ? 'bg-orange-600 text-white'
      : status === 'current'
      ? 'bg-orange-500 text-white'
      : 'bg-gray-300 text-gray-600';

    const hoverClasses = isClickable ? 'hover:scale-110 hover:shadow-md cursor-pointer transition-transform' : '';

    return `${baseClasses} ${hoverClasses}`;
  };

  const handleStepClick = (stepKey, status) => {
    // Only allow clicking on completed or current steps
    if ((status === 'completed' || status === 'current') && onStepChange) {
      onStepChange(stepKey);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between sm:justify-start py-3 space-x-2 sm:space-x-6 overflow-x-auto">
          {steps.map((step) => {
            const status = getStepStatus(step.key);
            const isClickable = status === 'completed' || status === 'current';

            return (
              <button
                key={step.key}
                onClick={() => handleStepClick(step.key, status)}
                disabled={!isClickable}
                className={`flex items-center space-x-2 min-w-0 flex-shrink-0 ${
                  isClickable ? 'group' : 'cursor-not-allowed opacity-75'
                }`}
                aria-label={`${step.label} - ${status}`}
              >
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm ${getStepColor(
                    status,
                    isClickable
                  )}`}
                >
                  {status === 'completed' ? (
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
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
                <span className={`text-xs sm:text-sm whitespace-nowrap ${
                  status === 'current' ? 'text-gray-900 font-medium' : 'text-gray-600'
                } ${isClickable ? 'group-hover:text-orange-600' : ''}`}>
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
