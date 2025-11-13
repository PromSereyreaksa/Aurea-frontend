/**
 * Save Button Animation Component
 * 
 * Animated save button with three states:
 * - Idle: Normal save icon
 * - Saving: Smooth spinner animation
 * - Success: Checkmark animation with celebration
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SaveButtonAnimation = ({ isSaving, onSave, disabled = false, showSuccess = false, hasUnsavedChanges = true }) => {
  const [internalSuccess, setInternalSuccess] = useState(false);

  // Auto-hide success state after 2 seconds
  useEffect(() => {
    if (showSuccess) {
      setInternalSuccess(true);
      const timer = setTimeout(() => {
        setInternalSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const isDisabled = disabled || isSaving || internalSuccess;
  const noChanges = !hasUnsavedChanges;

  return (
    <div className="group relative">
      <motion.button
        onClick={onSave}
        disabled={isDisabled}
        whileHover={!isDisabled ? { scale: 1.05 } : {}}
        whileTap={!isDisabled ? { scale: 0.95 } : {}}
        className={`w-14 h-14 md:w-12 md:h-12 ${
          noChanges
            ? 'bg-gray-400 cursor-not-allowed opacity-60'
            : isDisabled
            ? 'bg-orange-400 cursor-not-allowed'
            : 'bg-orange-500 hover:bg-orange-600'
        } text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center relative overflow-hidden`}
      >
        <AnimatePresence mode="wait">
          {/* SUCCESS STATE - Checkmark */}
          {internalSuccess && (
            <motion.div
              key="success"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20 
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <motion.path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2.5} 
                  d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </svg>
            </motion.div>
          )}

          {/* SAVING STATE - Spinner */}
          {!internalSuccess && isSaving && (
            <motion.div
              key="saving"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <motion.path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  animate={{ 
                    opacity: [0.75, 0.5, 0.75],
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                />
              </svg>
            </motion.div>
          )}

          {/* IDLE STATE - Save Icon */}
          {!internalSuccess && !isSaving && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" 
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success confetti ring */}
        {internalSuccess && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white"
            initial={{ scale: 0.8, opacity: 1 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        )}
      </motion.button>

      {/* Tooltip - Hidden on mobile, shown on desktop */}
      <div className="hidden md:block absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        {internalSuccess ? 'Saved!' : isSaving ? 'Saving...' : noChanges ? 'No changes to save' : 'Save Draft'}
      </div>
    </div>
  );
};

export default SaveButtonAnimation;
