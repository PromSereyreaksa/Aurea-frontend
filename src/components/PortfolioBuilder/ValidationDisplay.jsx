/**
 * ValidationDisplay Component
 *
 * Displays validation status and errors for portfolio content
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

const ValidationDisplay = ({
  valid,
  errors = [],
  isValidating = false,
  className,
  showSuccess = true,
  compact = false,
}) => {
  // Don't render if no validation has occurred yet
  if (valid === null && !isValidating) {
    return null;
  }

  // Validating state
  if (isValidating) {
    return (
      <div className={cn('flex items-center gap-2 text-sm text-gray-600', className)}>
        <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <span>Validating content...</span>
      </div>
    );
  }

  // Valid state
  if (valid && showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={cn(
          'flex items-center gap-2 p-4 bg-green-50 border-2 border-green-200 rounded-lg',
          compact && 'p-2',
          className
        )}
      >
        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <span className={cn('text-green-700 font-medium', compact && 'text-sm')}>
          Content is valid
        </span>
      </motion.div>
    );
  }

  // Invalid state
  if (!valid && errors.length > 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={cn(
          'p-4 bg-red-50 border-2 border-red-200 rounded-lg',
          compact && 'p-2',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-start gap-2 mb-3">
          <svg
            className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1">
            <h4 className={cn('text-red-700 font-semibold', compact && 'text-sm')}>
              {errors.length} Validation {errors.length === 1 ? 'Error' : 'Errors'}
            </h4>
            {!compact && (
              <p className="text-sm text-red-600 mt-1">
                Please fix the following issues before saving:
              </p>
            )}
          </div>
        </div>

        {/* Error list */}
        {!compact && (
          <ul className="space-y-2 mt-3">
            {errors.map((error, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-2"
              >
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1">
                  {error.section && error.field && (
                    <span className="text-sm font-medium text-red-700">
                      {error.section} › {error.field}:
                    </span>
                  )}
                  {error.section && !error.field && (
                    <span className="text-sm font-medium text-red-700">
                      {error.section}:
                    </span>
                  )}
                  <span className="text-sm text-red-600 ml-1">
                    {error.error || error.message || JSON.stringify(error)}
                  </span>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>
    );
  }

  return null;
};

export default ValidationDisplay;
