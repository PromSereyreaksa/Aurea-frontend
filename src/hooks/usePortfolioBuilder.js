/**
 * Custom Hooks for Portfolio Builder
 * 
 * Reusable hooks that encapsulate complex logic for portfolio management,
 * auto-saving, and keyboard shortcuts.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { 
  debounce, 
  saveToLocalStorage, 
  clearLocalStorage,
  ensureValidImageUrls 
} from '../utils/portfolioUtils';

// ========================================
// 1. AUTO-SAVE HOOK
// ========================================

/**
 * Manages auto-save functionality for portfolio drafts
 * Saves to localStorage with debouncing to prevent excessive saves
 */
export const useAutoSave = (portfolioId, portfolioData, title, description, templateId, isUserEditing) => {
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved'); // 'saving', 'saved', 'error'

  // Debounced auto-save function (2 second delay)
  const autoSaveToLocalStorage = useCallback(
    debounce((data) => {
      // Only auto-save if user is not currently editing
      if (!isUserEditing) {
        setAutoSaveStatus('saving');
        
        const success = saveToLocalStorage(portfolioId, data, title, description, templateId);
        
        if (success) {
          setAutoSaveStatus('saved');
        } else {
          setAutoSaveStatus('error');
        }
      }
    }, 2000),
    [portfolioId, title, description, templateId, isUserEditing]
  );

  // Clear draft from localStorage
  const clearDraft = useCallback(() => {
    return clearLocalStorage(portfolioId);
  }, [portfolioId]);

  return {
    autoSaveStatus,
    autoSaveToLocalStorage,
    clearDraft,
  };
};

// ========================================
// 2. KEYBOARD SHORTCUTS HOOK
// ========================================

/**
 * Handles global keyboard shortcuts (Ctrl+S for save)
 */
export const useKeyboardShortcuts = (onSave, canSave) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl+S or Cmd+S - Save
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        
        if (canSave) {
          toast.success('Saving portfolio... (Ctrl+S)', {
            duration: 1500,
            icon: '💾',
          });
          onSave();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onSave, canSave]);
};

// ========================================
// 3. PORTFOLIO SAVE HOOK
// ========================================

/**
 * Manages portfolio save/publish operations with loading states
 * Prevents duplicate saves and handles API calls
 */
export const usePortfolioSave = (portfolioId, portfolioStore, clearDraft) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  // Use refs to track save state across callback invocations
  const saveInProgressRef = useRef(false);
  const publishInProgressRef = useRef(false);
  const lastSaveTimeRef = useRef(0);
  const lastPublishTimeRef = useRef(0);

  const save = useCallback(async (portfolioData, selectedTemplate, title, description, cleanupFn, convertFn) => {
    // Prevent spam-saving using ref
    if (saveInProgressRef.current) {
      console.log('Save already in progress, ignoring duplicate save request');
      toast.error('Save in progress, please wait...', { id: 'save-in-progress' });
      return { success: false, reason: 'already_saving' };
    }

    // Add rate limiting - minimum 1 second between saves
    const now = Date.now();
    if (now - lastSaveTimeRef.current < 1000) {
      console.log('Save rate limited, ignoring request');
      toast.error('Please wait before saving again', { id: 'save-rate-limit' });
      return { success: false, reason: 'rate_limited' };
    }

    if (!selectedTemplate) {
      toast.error('No template selected');
      return { success: false, reason: 'no_template' };
    }

    if (!portfolioData) {
      toast.error('No portfolio data to save');
      return { success: false, reason: 'no_data' };
    }

    try {
      // Set both state and ref to prevent duplicate saves
      saveInProgressRef.current = true;
      lastSaveTimeRef.current = now;
      setIsSaving(true);

      const cleanedData = cleanupFn({ ...portfolioData });
      const saveData = {
        title: title || `${selectedTemplate.name} Portfolio`,
        description: description || `Portfolio created with ${selectedTemplate.name} template`,
        template: selectedTemplate.id,
        sections: convertFn(cleanedData.content),
        content: cleanedData.content, // Save content field for easier checks
        styling: cleanedData.styling || {},
        published: false,
      };

      let result;
      console.log('=== SAVE OPERATION ===');
      console.log('portfolioId:', portfolioId);
      console.log('Is new portfolio?', portfolioId === 'new');
      console.log('Will CREATE:', portfolioId === 'new' || !portfolioId);
      console.log('Will UPDATE:', portfolioId && portfolioId !== 'new');
      console.log('📤 Saving gallery data:', {
        firstRow: saveData.content.gallery?.firstRow?.length,
        secondRow: saveData.content.gallery?.secondRow?.length,
        thirdRow: saveData.content.gallery?.thirdRow?.length,
        sectionsCount: saveData.sections?.length,
        gallerySection: saveData.sections?.find(s => s.type === 'gallery')?.content
      });
      
      if (portfolioId && portfolioId !== 'new') {
        console.log('→ Calling updatePortfolio with ID:', portfolioId);
        result = await portfolioStore.updatePortfolio(portfolioId, saveData);
      } else {
        console.log('→ Calling createPortfolio (new portfolio)');
        result = await portfolioStore.createPortfolio(saveData);
      }

      console.log('Save result:', result);

      if (result && result.success) {
        toast.success('Portfolio saved successfully!', { id: 'save-success' });
        clearDraft();
        return { success: true, result };
      } else {
        throw new Error(result?.error || 'Save failed');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save portfolio: ' + (error.message || 'Unknown error'), { id: 'save-error' });
      return { success: false, error };
    } finally {
      // Clear both state and ref
      saveInProgressRef.current = false;
      setIsSaving(false);
    }
  }, [portfolioId, portfolioStore, clearDraft]);

  const publish = useCallback(async (portfolioData, selectedTemplate, title, description, cleanupFn, convertFn) => {
    // Prevent spam-publishing using ref
    if (publishInProgressRef.current) {
      console.log('Publish already in progress');
      toast.error('Publish in progress, please wait...', { id: 'publish-in-progress' });
      return { success: false, reason: 'already_publishing' };
    }

    // Add rate limiting - minimum 1 second between publishes
    const now = Date.now();
    if (now - lastPublishTimeRef.current < 1000) {
      console.log('Publish rate limited, ignoring request');
      toast.error('Please wait before publishing again', { id: 'publish-rate-limit' });
      return { success: false, reason: 'rate_limited' };
    }

    if (!selectedTemplate || !portfolioData) {
      toast.error('Cannot publish - missing template or data');
      return { success: false, reason: 'missing_data' };
    }

    try {
      // Set both state and ref to prevent duplicate publishes
      publishInProgressRef.current = true;
      lastPublishTimeRef.current = now;
      setIsPublishing(true);

      const cleanedData = cleanupFn({ ...portfolioData });
      const publishData = {
        title: title || `${selectedTemplate.name} Portfolio`,
        description: description || `Portfolio created with ${selectedTemplate.name} template`,
        template: selectedTemplate.id,
        sections: convertFn(cleanedData.content),
        styling: cleanedData.styling || {},
        published: true,
      };

      let result;
      if (portfolioId && portfolioId !== 'new') {
        result = await portfolioStore.updatePortfolio(portfolioId, publishData);
      } else {
        result = await portfolioStore.createPortfolio(publishData);
      }

      if (result && result.success) {
        toast.success('Portfolio published successfully!', { id: 'publish-success' });
        clearDraft();
        return { success: true, result };
      } else {
        throw new Error(result?.error || 'Publish failed');
      }
    } catch (error) {
      console.error('Publish error:', error);
      toast.error('Failed to publish portfolio: ' + (error.message || 'Unknown error'), { id: 'publish-error' });
      return { success: false, error };
    } finally {
      // Clear both state and ref
      publishInProgressRef.current = false;
      setIsPublishing(false);
    }
  }, [portfolioId, portfolioStore, clearDraft]);

  return {
    isSaving,
    isPublishing,
    save,
    publish,
  };
};

// ========================================
// 4. PORTFOLIO DATA HOOK
// ========================================

/**
 * Manages portfolio data state with image URL validation
 */
export const usePortfolioData = (initialData = null) => {
  const [portfolioData, setPortfolioDataState] = useState(initialData);
  const [isUserEditing, setIsUserEditing] = useState(false);

  // Wrapper that ensures valid image URLs
  const setPortfolioData = useCallback((dataOrUpdater) => {
    setPortfolioDataState((prev) => {
      const newData = typeof dataOrUpdater === 'function' 
        ? dataOrUpdater(prev) 
        : dataOrUpdater;
      
      return newData ? ensureValidImageUrls(newData) : newData;
    });
  }, []);

  return {
    portfolioData,
    setPortfolioData,
    isUserEditing,
    setIsUserEditing,
  };
};

// ========================================
// 5. BEFORE UNLOAD WARNING HOOK
// ========================================

/**
 * Warns user before leaving page with unsaved changes
 */
export const useBeforeUnloadWarning = (portfolioId, autoSaveStatus) => {
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const key = `portfolio-draft-${portfolioId || 'new'}`;
      const saved = localStorage.getItem(key);
      
      if (saved && autoSaveStatus !== 'saved') {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [portfolioId, autoSaveStatus]);
};

// ========================================
// 6. CLICK OUTSIDE HOOK
// ========================================

/**
 * Handles clicking outside of an element to close it
 */
export const useClickOutside = (isOpen, setIsOpen, className) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (!event.target.closest(`.${className}`)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setIsOpen, className]);
};
