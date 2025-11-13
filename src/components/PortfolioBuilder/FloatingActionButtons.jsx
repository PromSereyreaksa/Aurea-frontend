/**
 * Floating Action Buttons Component
 * 
 * Right-side floating buttons for portfolio builder actions
 * (Change Template, Preview, Export PDF, Settings, Save, Publish)
 */

import React from 'react';
import SaveButtonAnimation from './SaveButtonAnimation';

const FloatingActionButtons = ({
  step,
  isSaving,
  showSaveSuccess,
  hasUnsavedChanges = true,
  onChangeTemplate,
  onPreview,
  onExportPDF,
  onToggleSettings,
  onSave,
  onPublish,
  onBackToEdit,
  showSettings,
}) => {
  // Preview mode - only show back button
  if (step === 'preview') {
    return (
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-[150]">
        <div className="group relative">
          <button
            onClick={onBackToEdit}
            className="w-12 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
            </svg>
          </button>
          <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            Back to Edit
          </div>
        </div>
      </div>
    );
  }

  // Customize mode - show all buttons
  if (step === 'customize') {
    return (
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-[150] flex flex-col space-y-3">
        {/* Change Template */}
        <ActionButton
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.79 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.79 4 8 4s8-1.79 8-4M4 7c0-2.21 3.79-4 8-4s8 1.79 8 4" />
            </svg>
          }
          label="Change Template"
          onClick={onChangeTemplate}
        />

        {/* Preview */}
        <ActionButton
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
          label="Preview"
          onClick={onPreview}
        />

        {/* Export PDF */}
        <ActionButton
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          label="Export PDF"
          onClick={onExportPDF}
        />

        {/* Settings */}
        <ActionButton
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
          label="Portfolio Settings"
          onClick={onToggleSettings}
          active={showSettings}
        />

        {/* Save Draft - Animated */}
        <SaveButtonAnimation
          isSaving={isSaving}
          showSuccess={showSaveSuccess}
          hasUnsavedChanges={hasUnsavedChanges}
          onSave={onSave}
          disabled={isSaving || !hasUnsavedChanges}
        />

        {/* Publish */}
        <ActionButton
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          }
          label="Publish"
          onClick={onPublish}
        />
      </div>
    );
  }

  return null;
};

// Individual action button with tooltip
const ActionButton = ({ icon, label, onClick, active = false, disabled = false }) => (
  <div className="group relative">
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-12 h-12 ${
        disabled 
          ? 'bg-orange-400 cursor-not-allowed' 
          : active 
          ? 'bg-orange-600' 
          : 'bg-orange-500 hover:bg-orange-600'
      } text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center`}
    >
      {icon}
    </button>
    <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
      {label}
    </div>
  </div>
);

export default FloatingActionButtons;
