/**
 * Portfolio Settings Panel & Help Tooltip
 * 
 * Reusable UI components for portfolio builder
 */

import React from 'react';

// ========================================
// SETTINGS PANEL
// ========================================

export const SettingsPanel = ({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  onTitleChange, 
  onDescriptionChange,
  templateName 
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-6 left-6 bg-white rounded-lg shadow-lg p-4 z-30 w-80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Portfolio Settings</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Portfolio Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={`${templateName} Portfolio`}
          />
        </div>

        {/* Description Textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={`Portfolio created with ${templateName} template`}
          />
        </div>
      </div>
    </div>
  );
};

// ========================================
// HELP TOOLTIP
// ========================================

export const HelpTooltip = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-6 py-3 rounded-lg shadow-lg z-40 max-w-md">
      <div className="flex items-center space-x-2">
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="text-sm">
          <div>Click on any text to edit it. Use the floating buttons on the right to manage your portfolio.</div>
          <div className="flex items-center space-x-1 mt-1 text-orange-200">
            <kbd className="px-1 py-0.5 bg-orange-600 rounded text-xs">Ctrl</kbd>
            <span>+</span>
            <kbd className="px-1 py-0.5 bg-orange-600 rounded text-xs">S</kbd>
            <span>to save quickly</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========================================
// AUTO-SAVE STATUS INDICATOR
// ========================================

export const AutoSaveStatus = ({ status }) => {
  return (
    <div className="flex items-center text-sm text-gray-600">
      {status === 'saving' && (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mr-2"></div>
          <span>Saving...</span>
        </>
      )}
      {status === 'saved' && (
        <>
          <div className="h-4 w-4 bg-green-500 rounded-full mr-2 flex items-center justify-center">
            <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <span>Auto-saved</span>
        </>
      )}
      {status === 'error' && (
        <>
          <div className="h-4 w-4 bg-red-500 rounded-full mr-2 flex items-center justify-center">
            <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <span>Save failed</span>
        </>
      )}
    </div>
  );
};
