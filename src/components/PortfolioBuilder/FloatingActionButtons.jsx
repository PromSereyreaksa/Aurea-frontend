/**
 * Floating Action Buttons Component
 * 
 * Right-side floating buttons for portfolio builder actions
 * (Change Template, Preview, Export PDF, Settings, Save, Publish)
 * 
 * Mobile: Shows a "+" button that opens a menu with all options
 * Desktop: Shows all buttons vertically stacked
 * 
 * Uses React Portal to render at body level for true floating behavior
 */

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Preview mode - only show back button
  if (step === 'preview') {
    return createPortal(
      <div
        className="floating-action-buttons-portal"
        style={{
        position: 'fixed',
        right: '16px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 999999,
        pointerEvents: 'auto',
        isolation: 'isolate'
      }}>
        <div className="group relative">
          <button
            onClick={onBackToEdit}
            className="w-14 h-14 md:w-12 md:h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
            </svg>
          </button>
          <div className="hidden md:block absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            Back to Edit
          </div>
        </div>
      </div>,
      document.body
    );
  }

  // Customize mode - show all buttons (desktop) or menu toggle (mobile)
  if (step === 'customize') {
    return createPortal(
      <>
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="md:hidden"
            onClick={toggleMobileMenu}
            style={{ 
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999998
            }}
          />
        )}

        {/* Floating Action Buttons Container */}
        <div
          className="floating-action-buttons-portal"
          style={{
          position: 'fixed',
          right: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 999999,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          pointerEvents: 'auto',
          isolation: 'isolate'
        }}>
          {/* Mobile: Toggle Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className={`w-14 h-14 ${isMobileMenuOpen ? 'bg-gray-700' : 'bg-orange-500'} hover:bg-orange-600 text-white rounded-full shadow-lg transition-all duration-200 flex items-center justify-center`}
            >
              <svg 
                className={`w-6 h-6 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-45' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>

            {/* Mobile Menu - Appears above toggle button */}
            {isMobileMenuOpen && (
              <div className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-2xl p-3 space-y-2 min-w-[240px]">
                {/* Preview */}
                <MobileMenuItem
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  }
                  label="Preview"
                  onClick={() => {
                    onPreview();
                    setIsMobileMenuOpen(false);
                  }}
                />

                {/* Export PDF */}
                <MobileMenuItem
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  }
                  label="Export PDF"
                  onClick={() => {
                    onExportPDF();
                    setIsMobileMenuOpen(false);
                  }}
                />

                {/* Settings */}
                <MobileMenuItem
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  }
                  label="Portfolio Settings"
                  onClick={() => {
                    onToggleSettings();
                    setIsMobileMenuOpen(false);
                  }}
                  active={showSettings}
                />

                {/* Save Draft */}
                <MobileMenuItem
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                  }
                  label={isSaving ? 'Saving...' : showSaveSuccess ? '✓ Saved!' : hasUnsavedChanges ? 'Save Draft' : 'No Changes'}
                  onClick={() => {
                    if (!isSaving && hasUnsavedChanges) {
                      onSave();
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  disabled={isSaving || !hasUnsavedChanges}
                />

                {/* Publish */}
                <MobileMenuItem
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  }
                  label="Publish"
                  onClick={() => {
                    onPublish();
                    setIsMobileMenuOpen(false);
                  }}
                />
              </div>
            )}
          </div>

          {/* Desktop: All Buttons Stacked */}
          <div className="hidden md:flex flex-col space-y-3">
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
        </div>
      </>,
      document.body
    );
  }

  return null;
};

// Individual action button with tooltip (Desktop)
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

// Mobile menu item component
const MobileMenuItem = ({ icon, label, onClick, active = false, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      disabled
        ? 'text-gray-400 cursor-not-allowed bg-gray-50'
        : active
        ? 'bg-orange-50 text-orange-600'
        : 'text-gray-700 hover:bg-gray-50'
    }`}
  >
    <div className={`flex-shrink-0 ${disabled ? 'text-gray-400' : active ? 'text-orange-600' : 'text-gray-600'}`}>
      {icon}
    </div>
    <span className="text-sm font-medium">{label}</span>
  </button>
);

export default FloatingActionButtons;
