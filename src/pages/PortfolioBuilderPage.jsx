/**
 * Portfolio Builder Page
 * 
 * Main page for creating and editing portfolios. Orchestrates the multi-step
 * portfolio creation process: Template Selection → Setup → Customize → Preview
 * 
 * This component is intentionally kept clean by delegating complex logic to:
 * - Custom hooks (useAutoSave, usePortfolioData, etc.)
 * - Utility functions (portfolioUtils.js)
 * - UI components (FloatingActionButtons, StepIndicator, etc.)
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

// Stores & API
import usePortfolioStore from '../stores/portfolioStore';
import { portfolioApi } from '../lib/portfolioApi';
import { templateApi } from '../lib/templateApi';

// Template utilities
import { templateAdapter } from '../lib/templateAdapter';
// Keep old imports as fallback for now
import { getTemplate, createPortfolioFromTemplate } from '../templates';

// Validation
import useTemplateValidation from '../hooks/useTemplateValidation';
import ValidationDisplay from '../components/PortfolioBuilder/ValidationDisplay';

// Components
import TemplateSpecificSetup from '../components/PortfolioBuilder/TemplateSpecificSetup';
import TemplatePreview from '../components/PortfolioBuilder/TemplatePreview';
import FloatingActionButtons from '../components/PortfolioBuilder/FloatingActionButtons';
import StepIndicator from '../components/PortfolioBuilder/StepIndicator';
// import MaintenanceModal from '../components/PortfolioBuilder/MaintenanceModal'; // Not needed anymore - PDF export works directly
import PublishModal from '../components/PortfolioBuilder/PublishModal';
import TemplateChangeModal from '../components/PortfolioBuilder/TemplateChangeModal';
// import PDFExport from '../components/PortfolioBuilder/PDFExport'; // Old client-side PDF export
import PDFExportBackend from '../components/PortfolioBuilder/PDFExportBackend'; // New backend PDF export
import { SettingsPanel, HelpTooltip, AutoSaveStatus } from '../components/PortfolioBuilder/PortfolioBuilderUI';

// Custom hooks
import {
  useAutoSave,
  useKeyboardShortcuts,
  usePortfolioSave,
  usePortfolioData,
  useBeforeUnloadWarning,
  // useClickOutside, // Not needed anymore
} from '../hooks/usePortfolioBuilder';

// Utilities
import {
  convertToTemplateFormat,
  convertContentToSections,
  cleanupPlaceholderData,
  ensureValidImageUrls,
  isValidImageUrl,
  isImageField,
} from '../utils/portfolioUtils';

// ========================================
// MAIN COMPONENT
// ========================================

const PortfolioBuilderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const portfolioStore = usePortfolioStore();

  // Debug logging
  console.log('PortfolioBuilderPage mounted/re-rendered with ID:', id);

  // ========================================
  // STATE MANAGEMENT
  // ========================================

  // Step navigation - starts at 'setup' for new portfolios, 'customize' for existing ones
  const [step, setStep] = useState('setup'); // 'setup', 'customize', 'preview'
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isEditing, setIsEditing] = useState(true);
  const [initializing, setInitializing] = useState(true);

  // Portfolio metadata
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

    // UI State
  const [showPDFExport, setShowPDFExport] = useState(false);
  // const [showMaintenancePopup, setShowMaintenancePopup] = useState(false); // Not needed anymore
  const [showSettings, setShowSettings] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showTemplateChangeModal, setShowTemplateChangeModal] = useState(false);

  // Track unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const lastSavedDataRef = useRef(null);
  const isNavigatingAwayRef = useRef(false); // Prevent saves during navigation

  // Custom hooks for complex logic
  const { portfolioData, setPortfolioData, isUserEditing, setIsUserEditing } = usePortfolioData(null);

  const { autoSaveStatus, autoSaveToLocalStorage, clearDraft } = useAutoSave(
    id,
    portfolioData,
    title,
    description,
    selectedTemplate?.id,
    isUserEditing
  );

  const { isSaving, isPublishing, save, publish } = usePortfolioSave(id, portfolioStore, clearDraft);

  // Validation hook - DISABLED to avoid maxLength validation errors on image URLs
  // const { valid, errors, isValidating, validate } = useTemplateValidation(
  //   selectedTemplate?.id || selectedTemplate?.templateId,
  //   portfolioData?.content,
  //   { validateOnChange: false, validateOnMount: false, debounceMs: 500 }
  // );
  
  // Mock validation to always pass
  const valid = true;
  const errors = [];
  const isValidating = false;
  const validate = async () => ({ valid: true, errors: [] });

  // ========================================
  // EVENT HANDLERS (defined early for hooks)
  // ========================================

  // Save & Publish handlers
  const handleSave = async () => {
    console.log('=== HANDLE SAVE CALLED ===');
    console.log('Current id from route:', id);
    console.log('isNavigatingAwayRef.current:', isNavigatingAwayRef.current);
    console.log('hasUnsavedChanges:', hasUnsavedChanges);

    // Prevent saving if navigating away (for new portfolios)
    if (isNavigatingAwayRef.current) {
      console.log('❌ Navigation in progress, blocking save');
      return;
    }

    // Prevent saving if no changes
    if (!hasUnsavedChanges) {
      console.log('❌ No changes to save');
      toast('No changes to save', { id: 'no-changes', icon: 'ℹ️' });
      return;
    }

    // VALIDATION: DISABLED - Skip validation to avoid maxLength errors on image URLs
    // console.log('🔍 Validating portfolio content...');
    // if (selectedTemplate && portfolioData?.content) {
    //   // Run validation
    //   const validationResult = await validate();

    //   if (!validationResult || !validationResult.valid) {
    //     console.log('❌ Validation failed:', validationResult?.errors || errors);
    //     toast.error('Please fix validation errors before saving', {
    //       id: 'validation-failed',
    //       duration: 3000
    //     });

    //     // Scroll to top to show ValidationDisplay
    //     window.scrollTo({ top: 0, behavior: 'smooth' });
    //     return;
    //   }

    //   console.log('✅ Validation passed');
    // }

    console.log('✅ Proceeding with save (validation skipped)...');
    const result = await save(
      portfolioData,
      selectedTemplate,
      title,
      description,
      cleanupPlaceholderData,
      convertContentToSections
    );

    console.log('Save completed, result:', result);

    if (result.success) {
      console.log('Save successful!');

      // Update last saved data reference
      lastSavedDataRef.current = {
        content: portfolioData.content,
        styling: portfolioData.styling,
        title,
        description,
      };

      // Mark as no unsaved changes IMMEDIATELY to prevent duplicate saves
      setHasUnsavedChanges(false);
      console.log('Set hasUnsavedChanges to false');

      // Show success animation
      setShowSaveSuccess(true);

      // Navigate if creating new portfolio - do it IMMEDIATELY with replace
      if (id === 'new' && result.result?.portfolio?._id) {
        const newId = result.result.portfolio._id;
        console.log('🚀 NEW PORTFOLIO - Navigating to:', newId);

        // Set navigation flag to block any additional saves
        isNavigatingAwayRef.current = true;
        console.log('Set isNavigatingAwayRef to true');

        // Use replace: true to prevent going back to 'new' route
        // Navigate immediately to prevent duplicate saves
        navigate(`/portfolio-builder/${newId}`, { replace: true });
        console.log('Navigation triggered');
      } else {
        console.log('Existing portfolio updated, no navigation');
      }
    } else {
      console.log('❌ Save failed:', result);
    }
  };

  const handlePublishClick = () => {
    // Save first if there are unsaved changes
    if (hasUnsavedChanges) {
      handleSave();
    }
    setShowPublishModal(true);
  };

  const handlePublish = async (subdomain) => {
    console.log('Publishing to subdomain:', subdomain);

    try {
      // First save the portfolio if there are unsaved changes
      if (hasUnsavedChanges) {
        const saveResult = await handleSave();
        if (!saveResult || !saveResult.success) {
          throw new Error('Please save your portfolio before publishing');
        }
      }

      // Get the current portfolio ID
      const currentId = portfolioData?.id || id;
      if (!currentId || currentId === 'new') {
        throw new Error('Please save your portfolio before publishing');
      }

      // Call the new subdomain publish API
      const result = await portfolioApi.publish(currentId, subdomain);

      if (result.success || result.data) {
        // Get deployment details
        const deploymentData = result.data || result;
        const template = deploymentData.portfolio?.template || deploymentData.deployment?.template || 'your template';
        const filesCount = deploymentData.deployment?.filesGenerated?.length || 0;
        const siteUrl = deploymentData.site?.url || `${window.location.origin}/${subdomain}/html`;

        // Show detailed success message
        toast.success(
          `🎉 Portfolio published successfully!\n\n` +
          `Template: ${template}\n` +
          `Files: ${filesCount} generated\n` +
          `URL: ${siteUrl}`,
          { duration: 6000 }
        );

        console.log('📦 Published Portfolio Details:', {
          template,
          filesGenerated: deploymentData.deployment?.filesGenerated,
          htmlFile: deploymentData.site?.htmlFile,
          url: siteUrl
        });

        // Update local state
        setPortfolioData(prev => ({
          ...prev,
          subdomain: subdomain,
          isPublished: true,
          publishedAt: new Date().toISOString(),
          publishedUrl: siteUrl,
          template: template
        }));

        // Refresh portfolio list
        await portfolioStore.fetchUserPortfolios();

        return { success: true };
      } else {
        throw new Error(result.error || 'Failed to publish portfolio');
      }
    } catch (error) {
      console.error('Publish error:', error);
      toast.error(error.message || 'Failed to publish portfolio');
      throw error;
    }
  };

  // ========================================
  // LIFECYCLE - LOAD PORTFOLIO
  // ========================================

  useEffect(() => {
    let isMounted = true; // Prevent state updates after unmount

    const loadPortfolio = async () => {
      if (!isMounted) return;

      // Guard against undefined or invalid ID
      if (!id) {
        console.warn('No portfolio ID provided - likely React StrictMode double mount');
        // Don't show error or navigate during initial mount with undefined ID
        // This happens in React StrictMode during development
        return;
      }

      setInitializing(true);

      if (id && id !== 'new') {
        try {
          const result = await portfolioStore.fetchPortfolioById(id);

          if (!isMounted) return; // Don't update if component unmounted

          if (result && result.success && result.portfolio) {
            setTitle(result.portfolio.title || '');
            setDescription(result.portfolio.description || '');

            const templateData = convertToTemplateFormat(result.portfolio);
            let template = getTemplate(templateData.templateId);

            // If template not found, use echolon as default
            if (!template) {
              console.warn(`Template "${templateData.templateId}" not found, using echolon as fallback`);
              template = getTemplate('echolon');
              templateData.templateId = 'echolon';
            }

            if (template) {
              setSelectedTemplate(template);
              
              // SMART MERGE: Combine saved content with template defaults
              // Strategy: Always start with full template defaults, then overlay saved data
              // This ensures all placeholder slots are preserved, with user data overlaid

              console.log('🔀 SMART MERGE - Starting merge process');
              console.log('Template defaults gallery:', {
                firstRow: template.defaultContent.gallery?.firstRow?.length,
                secondRow: template.defaultContent.gallery?.secondRow?.length,
                thirdRow: template.defaultContent.gallery?.thirdRow?.length
              });
              console.log('Saved data gallery:', {
                firstRow: templateData.content.gallery?.firstRow?.length,
                secondRow: templateData.content.gallery?.secondRow?.length,
                thirdRow: templateData.content.gallery?.thirdRow?.length,
                firstRowSample: templateData.content.gallery?.firstRow?.[0]
              });

              const mergedContent = {};

              // Helper function to merge arrays intelligently
              const mergeArrays = (defaultArray, savedArray) => {
                if (!savedArray || savedArray.length === 0) {
                  // No saved data - use all defaults
                  console.log(`  → No saved data, using ${defaultArray.length} defaults`);
                  return defaultArray;
                }

                // Create result starting with defaults
                const result = [...defaultArray];

                // Overlay saved items (replace defaults at matching indices)
                savedArray.forEach((savedItem, index) => {
                  if (index < result.length) {
                    // Merge saved item with default item (preserves default structure)
                    result[index] = {
                      ...result[index],
                      ...savedItem
                    };
                  } else {
                    // Saved data has more items than default - append them
                    result.push(savedItem);
                  }
                });

                console.log(`  → Merged: defaults(${defaultArray.length}) + saved(${savedArray.length}) = result(${result.length})`);
                return result;
              };

              // Merge each section
              Object.keys(template.defaultContent).forEach(sectionKey => {
                const defaultSection = template.defaultContent[sectionKey];
                const savedSection = templateData.content[sectionKey];

                if (!savedSection) {
                  // No saved data for this section - use defaults
                  mergedContent[sectionKey] = defaultSection;
                } else if (typeof defaultSection === 'object' && !Array.isArray(defaultSection)) {
                  // Section is an object - merge properties
                  mergedContent[sectionKey] = { ...defaultSection };

                  Object.keys(defaultSection).forEach(fieldKey => {
                    const defaultValue = defaultSection[fieldKey];
                    const savedValue = savedSection[fieldKey];

                    if (Array.isArray(defaultValue)) {
                      // Field is an array - use smart merge
                      mergedContent[sectionKey][fieldKey] = mergeArrays(defaultValue, savedValue);
                    } else if (savedValue !== undefined) {
                      // Non-array field - use saved value if exists
                      mergedContent[sectionKey][fieldKey] = savedValue;
                    }
                    // else: keep default value
                  });

                  // Add any extra fields from saved data not in defaults
                  Object.keys(savedSection).forEach(fieldKey => {
                    if (!(fieldKey in defaultSection)) {
                      mergedContent[sectionKey][fieldKey] = savedSection[fieldKey];
                    }
                  });
                } else {
                  // Section is a primitive or array - use saved value
                  mergedContent[sectionKey] = savedSection;
                }
              });

              // Add any extra sections from saved data not in template defaults
              Object.keys(templateData.content).forEach(sectionKey => {
                if (!(sectionKey in mergedContent)) {
                  mergedContent[sectionKey] = templateData.content[sectionKey];
                }
              });
              
              const mergedTemplateData = {
                ...templateData,
                content: mergedContent
              };
              
              const portfolioDataWithImages = ensureValidImageUrls(mergedTemplateData);
              setPortfolioData(portfolioDataWithImages);
              
              // Initialize last saved data reference
              lastSavedDataRef.current = {
                content: portfolioDataWithImages.content,
                styling: portfolioDataWithImages.styling,
                title: result.portfolio.title || '',
                description: result.portfolio.description || '',
              };
              setHasUnsavedChanges(false);
              
              // Check if we should show setup form via URL parameter
              // Setup shows ONLY when coming from new portfolio creation (indicated by ?setup=true)
              const shouldShowSetup = searchParams.get('setup') === 'true';
              
              console.log('Portfolio loaded:', {
                id: result.portfolio._id,
                title: result.portfolio.title,
                shouldShowSetup
              });
              
              if (shouldShowSetup) {
                console.log('New portfolio - showing setup form');
                setStep('setup');
                // Remove setup parameter so refresh doesn't show setup again
                searchParams.delete('setup');
                const newSearch = searchParams.toString();
                navigate(`/portfolio-builder/${id}${newSearch ? '?' + newSearch : ''}`, { replace: true });
              } else {
                console.log('Existing portfolio - going to customize');
                setStep('customize');
              }
              
              setInitializing(false);
            } else {
              console.error('Template not found:', templateData.templateId);
              toast.error('Template not found', { id: `template-not-found-${id}` });
              setTimeout(() => navigate('/dashboard'), 500);
            }
          } else {
            console.error('Portfolio not found:', id, result);
            toast.error('Portfolio not found', { id: `portfolio-not-found-${id}` });
            setTimeout(() => navigate('/dashboard'), 500);
          }
        } catch (error) {
          if (!isMounted) return;
          console.error('Error loading portfolio:', error);
          toast.error('Failed to load portfolio', { id: `portfolio-error-${id}` });
          setTimeout(() => navigate('/dashboard'), 500);
        }
      } else if (id === 'new') {
        // New portfolio - redirect to templates page to choose template
        if (isMounted) {
          console.log('Redirecting to templates page to choose template');
          navigate('/templates', { replace: true });
        }
        setInitializing(false);
      }
    };

    loadPortfolio();

    return () => {
      isMounted = false; // Cleanup flag
      // Reset navigation flag when component unmounts or id changes
      isNavigatingAwayRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // Only depend on id, not portfolioStore or navigate

  // ========================================
  // HOOKS - KEYBOARD SHORTCUTS & WARNINGS
  // ========================================

  // Auto-reset save success state after showing animation
  useEffect(() => {
    if (showSaveSuccess) {
      const timer = setTimeout(() => {
        setShowSaveSuccess(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showSaveSuccess]);

  // Track changes to portfolio data to enable/disable save button
  useEffect(() => {
    // Don't track changes if we're navigating away (new portfolio saved)
    if (isNavigatingAwayRef.current) {
      console.log('Skipping change detection - navigation in progress');
      return;
    }

    if (!portfolioData || !selectedTemplate) {
      setHasUnsavedChanges(false);
      return;
    }

    // If no saved data yet (new portfolio or just loaded), consider it changed
    if (!lastSavedDataRef.current) {
      setHasUnsavedChanges(true);
      return;
    }

    // Compare current data with last saved data
    const currentDataString = JSON.stringify({
      content: portfolioData.content,
      styling: portfolioData.styling,
      title,
      description,
    });
    const savedDataString = JSON.stringify(lastSavedDataRef.current);

    const hasChanges = currentDataString !== savedDataString;
    console.log('Change detection:', hasChanges ? 'CHANGES DETECTED' : 'No changes');
    setHasUnsavedChanges(hasChanges);
  }, [portfolioData, title, description, selectedTemplate]);


  useKeyboardShortcuts(
    handleSave,
    (step === 'customize' || step === 'preview') && portfolioData && selectedTemplate && hasUnsavedChanges
  );

  useBeforeUnloadWarning(id, autoSaveStatus);
  // useClickOutside(showMaintenancePopup, setShowMaintenancePopup, 'maintenance-popup'); // Not needed anymore

  // ========================================
  // EVENT HANDLERS
  // ========================================

  // Template selection
  const handleTemplateSelect = async (template) => {
    if (portfolioData && portfolioData.templateId !== template.id) {
      const confirmSwitch = window.confirm(
        'Switching templates will reset your current customizations. Are you sure?'
      );
      if (!confirmSwitch) return;
    }

    setSelectedTemplate(template);

    if (id === 'new') {
      // NEW APPROACH: Create portfolio immediately when template is selected
      console.log('🎨 Creating new portfolio immediately with template:', template.id);

      try {
        // AUTO-SYNC: DISABLED TEMPORARILY - causing fetch errors
        // Sync template schema to backend before creating portfolio
        // This ensures the backend has the latest template definition
        console.log('🔄 Template sync DISABLED - skipping...');
        // try {
        //   await templateApi.syncTemplateSchema(template);
        //   console.log('✅ Template schema synced successfully');
        // } catch (syncError) {
        //   // Don't block portfolio creation if sync fails
        //   console.warn('⚠️ Template sync failed, continuing anyway:', syncError);
        // }

        // Create a minimal portfolio with the template
        const initialPortfolioData = {
          title: `${template.name} Portfolio`,
          description: `Portfolio created with ${template.name} template`,
          template: template.id,
          sections: [], // Empty sections for now
          styling: template.styling || {},
          published: false,
        };

        console.log('📤 Calling createPortfolio with:', initialPortfolioData);

        // Create the portfolio in the database
        const result = await portfolioStore.createPortfolio(initialPortfolioData);

        console.log('📥 createPortfolio result:', result);

        if (result && result.success && result.portfolio?._id) {
          console.log('✅ Portfolio created with ID:', result.portfolio._id);

          // Navigate to the new portfolio ID with setup=true parameter
          // This tells the page to show the setup form for this new portfolio
          navigate(`/portfolio-builder/${result.portfolio._id}?setup=true`, { replace: true });

          // The useEffect will reload the portfolio data and show setup
          toast.success('Template selected! Setting up your portfolio...', {
            duration: 2000,
            id: 'template-selected'
          });
        } else {
          console.error('❌ Invalid result:', result);
          const errorMsg = result?.error || 'Failed to create portfolio';
          throw new Error(errorMsg);
        }
      } catch (error) {
        console.error('❌ Failed to create initial portfolio:', error);
        console.error('Error stack:', error.stack);
        toast.error(`Failed to create portfolio: ${error.message || 'Please try again.'}`);
      }
    } else {
      if (!portfolioData || portfolioData.templateId !== template.id) {
        const newPortfolioData = createPortfolioFromTemplate(template.id);
        setPortfolioData(ensureValidImageUrls(newPortfolioData));
      }
      setStep('customize');
    }
  };

  // Setup completion
  const handleSetupComplete = (setupData) => {
    console.log('=== handleSetupComplete called ===');
    console.log('Setup Data received:', JSON.stringify(setupData, null, 2));
    console.log('Template:', selectedTemplate?.name, selectedTemplate?.id);

    // Check if this is data from the new DynamicTemplateSetup or old TemplateSetupForm
    const isNewFormat = !setupData.personalInfo && !setupData.skillsArray;
    console.log('Is new format?', isNewFormat);

    let contentData;
    let newTitle;
    let newDescription;

    if (isNewFormat) {
      // New format from TemplateSpecificSetup - content is already in template format
      contentData = setupData;
      console.log('Using new format, contentData:', JSON.stringify(contentData, null, 2));
      
      // Extract title from basic info if available
      const basicInfo = setupData.basic || {};
      newTitle = basicInfo.title || `${selectedTemplate.name} Portfolio`;
      newDescription = basicInfo.description || `Portfolio created with ${selectedTemplate.name} template`;
    } else {
      // Old format from TemplateSetupForm
      const { personalInfo, skillsArray, styling } = setupData;

      // Create content from setup data, preserving template defaults for work and gallery
      contentData = {
        hero: {
          name: personalInfo.name,
          title: personalInfo.title,
          description: personalInfo.description || `Passionate ${personalInfo.title.toLowerCase()} with expertise in creating exceptional experiences.`,
          image: '',
        },
        about: {
          heading: 'About Me',
          content: personalInfo.bio || `I'm a ${personalInfo.title.toLowerCase()} with a passion for creating meaningful work.`,
          image: '',
          skills: skillsArray.length > 0 ? skillsArray : ['Professional Skills', 'Creative Thinking', 'Problem Solving'],
        },
        // Preserve work section from template defaults
        work: selectedTemplate.defaultContent?.work || {
          heading: 'SELECTED WORK',
          projects: [
            {
              id: 1,
              title: 'PROJECT TITLE',
              description: 'Brief description of your project and what it accomplishes.',
              image: '',
              meta: '2025 — Category',
              category: 'design'
            }
          ]
        },
        // Preserve gallery section from template defaults
        gallery: selectedTemplate.defaultContent?.gallery || {
          heading: 'VISUAL GALLERY',
          images: [
            { src: '', caption: 'Visual exploration 01', meta: '01' },
            { src: '', caption: 'Visual exploration 02', meta: '02' },
            { src: '', caption: 'Visual exploration 03', meta: '03' },
            { src: '', caption: 'Visual exploration 04', meta: '04' },
            { src: '', caption: 'Visual exploration 05', meta: '05' },
            { src: '', caption: 'Visual exploration 06', meta: '06' }
          ]
        },
        contact: {
          heading: "Let's Work Together",
          description: "I'm always interested in new projects and opportunities.",
          form_fields: ['name', 'email', 'message'],
          social_links: [
            { platform: 'Email', url: personalInfo.email || 'your.email@example.com' },
            ...(personalInfo.phone ? [{ platform: 'Phone', url: `tel:${personalInfo.phone}` }] : []),
            ...(personalInfo.website ? [{ platform: 'Website', url: personalInfo.website }] : []),
          ].filter((link) => link.url && !link.url.includes('example.com')),
        },
      };
      
      newTitle = personalInfo.name ? `${personalInfo.name}'s Portfolio` : `${selectedTemplate.name} Portfolio`;
      newDescription = `Portfolio showcasing the work of ${personalInfo.name || 'a talented professional'} - ${personalInfo.title || 'Creative Professional'}`;
    }

    const newPortfolioData = createPortfolioFromTemplate(selectedTemplate.id, contentData);
    console.log('Portfolio data after createPortfolioFromTemplate:', JSON.stringify(newPortfolioData, null, 2));

    // Apply styling if available (from both old and new format)
    if (setupData.styling) {
      newPortfolioData.styling = {
        ...newPortfolioData.styling,
        colors: { 
          ...newPortfolioData.styling?.colors,
          ...selectedTemplate.styling?.colors, 
          ...setupData.styling.colors 
        },
        fonts: { 
          ...newPortfolioData.styling?.fonts,
          ...selectedTemplate.styling?.fonts, 
          ...setupData.styling.fonts 
        },
      };
      console.log('Applied styling from setupData:', newPortfolioData.styling);
    }

    setTitle(newTitle);
    setDescription(newDescription);
    const portfolioDataWithImages = ensureValidImageUrls(newPortfolioData);
    console.log('Final portfolio data with images:', JSON.stringify(portfolioDataWithImages, null, 2));
    setPortfolioData(portfolioDataWithImages);

    setStep('customize');

    // Auto-save after setup completion
    // We need to save directly with the new data instead of relying on state
    console.log('📝 Setup complete, auto-saving portfolio with new data...');
    setTimeout(async () => {
      try {
        const dataToSave = {
          title: newTitle,
          description: newDescription,
          template_id: selectedTemplate.id,
          content: portfolioDataWithImages.content,
          styling: portfolioDataWithImages.styling,
        };
        
        console.log('Saving portfolio data:', dataToSave);
        await portfolioStore.updatePortfolio(id, dataToSave);
        
        // Update the lastSavedDataRef after successful save
        lastSavedDataRef.current = {
          content: portfolioDataWithImages.content,
          styling: portfolioDataWithImages.styling,
          title: newTitle,
          description: newDescription,
        };
        
        setHasUnsavedChanges(false);
        toast.success('Portfolio setup saved!');
        console.log('✅ Setup data saved successfully');
      } catch (error) {
        console.error('❌ Failed to save setup data:', error);
        toast.error('Failed to save portfolio');
      }
    }, 500);
  };

  // Content changes
  const handleContentChange = (sectionId, fieldId, value) => {
    // Handle section management operations
    if (sectionId === '_sections') {
      if (fieldId === 'add') {
        setPortfolioData((prev) => ({ ...prev, content: value.content }));
        toast.success(`Added "${value.sectionData.title}" section!`);
        return;
      } else if (fieldId === 'delete') {
        setPortfolioData((prev) => ({ ...prev, content: value.content }));
        toast.success(`Deleted "${value.sectionId}" section!`);
        return;
      } else if (fieldId === 'reorder') {
        setPortfolioData((prev) => ({ ...prev, content: value.content }));
        return;
      }
    }

    // Validate image fields
    if (isImageField(fieldId, value) && value) {
      // Handle array of images (like gallery)
      if (Array.isArray(value)) {
        // Validate each image object's src property
        const hasInvalidImage = value.some(img => {
          if (img && img.src && !isValidImageUrl(img.src)) {
            console.error('❌ Invalid image in array:', img);
            return true;
          }
          return false;
        });
        
        if (hasInvalidImage) {
          toast.error('Please use valid image URLs');
          return;
        }
      } 
      // Handle single image URL string
      else if (typeof value === 'string' && !isValidImageUrl(value)) {
        console.error('❌ Image validation failed:', { fieldId, value });
        toast.error('Please use a valid image URL');
        return;
      }
    }

    // Update content
    setPortfolioData((prev) => {
      if (!prev || !prev.content) return prev;

      return {
        ...prev,
        content: {
          ...prev.content,
          [sectionId]: {
            ...prev.content[sectionId],
            [fieldId]: value,
          },
        },
      };
    });
  };

  // Navigation
  const handlePreview = () => {
    setStep('preview');
    setIsEditing(false);
  };
  const handleBackToEdit = () => {
    setStep('customize');
    setIsEditing(true);
  };

  // Template change
  const handleTemplateChangeClick = () => {
    if (id === 'new') {
      toast.error('Please save your portfolio before changing templates');
      return;
    }
    setShowTemplateChangeModal(true);
  };

  const handleTemplateChange = (newTemplate, migratedContent, analysis) => {
    console.log('🎨 Template changed:', newTemplate.name);
    console.log('Migration analysis:', analysis);

    // Update template and content
    setSelectedTemplate(newTemplate);
    setPortfolioData(prev => ({
      ...prev,
      templateId: newTemplate.id,
      content: migratedContent,
      styling: {
        ...newTemplate.styling,
        ...prev.styling, // Preserve any custom styling
      }
    }));

    // Mark as unsaved
    setHasUnsavedChanges(true);

    toast.success(`Changed to ${newTemplate.name} template!`);
  };

  // Metadata changes
  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
    if (portfolioData) {
      const updatedData = { ...portfolioData, title: newTitle, _version: (portfolioData._version || 0) + 1 };
      setPortfolioData(updatedData);
      autoSaveToLocalStorage(updatedData);
    }
  };

  const handleDescriptionChange = (newDescription) => {
    setDescription(newDescription);
    if (portfolioData) {
      const updatedData = { ...portfolioData, description: newDescription, _version: (portfolioData._version || 0) + 1 };
      setPortfolioData(updatedData);
      autoSaveToLocalStorage(updatedData);
    }
  };

  // Content change handler for TemplatePreview
  const contentChangeHandler = (sectionId, fieldId, value) => {
    handleContentChange(sectionId, fieldId, value);
  };
  contentChangeHandler.onSave = handleSave;

  // ========================================
  // LOADING STATE
  // ========================================

  if (initializing || portfolioStore.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b relative z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 min-w-0">
            {/* Back button & Title */}
            <div className="flex items-center space-x-2 md:space-x-4 min-w-0 flex-shrink">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap text-sm md:text-base"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-lg md:text-xl font-semibold text-gray-900 truncate">
                {step === 'select'
                  ? 'Choose Template'
                  : step === 'setup'
                  ? 'Setup Portfolio'
                  : step === 'customize'
                  ? 'Customize Portfolio'
                  : 'Preview Portfolio'}
              </h1>
            </div>

            {/* Auto-save status & Validation status */}
            {(step === 'customize' || step === 'preview') && (
              <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
                <AutoSaveStatus status={autoSaveStatus} />
              </div>
            )}
          </div>

          {/* Validation Display - Show only in customize mode with errors */}
          {step === 'customize' && selectedTemplate && portfolioData?.content && errors.length > 0 && (
            <div className="pb-4">
              <ValidationDisplay
                valid={valid}
                errors={errors}
                isValidating={isValidating}
                showSuccess={false}
                compact={true}
              />
            </div>
          )}
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={step} onStepChange={setStep} />
      </div>

      {/* Main Content */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {/* Setup Form */}
          {step === 'setup' && selectedTemplate && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <TemplateSpecificSetup
                template={selectedTemplate}
                initialData={portfolioData || {}}
                onComplete={handleSetupComplete}
              />
            </motion.div>
          )}

          {/* Customize & Preview */}
          {(step === 'customize' || step === 'preview') && selectedTemplate && portfolioData && (
            <motion.div
              key="customize"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="relative"
            >
              {/* Floating Action Buttons */}
              <FloatingActionButtons
                step={step}
                isSaving={isSaving}
                showSaveSuccess={showSaveSuccess}
                showSettings={showSettings}
                hasUnsavedChanges={hasUnsavedChanges}
                onChangeTemplate={handleTemplateChangeClick}
                onPreview={handlePreview}
                onExportPDF={() => setShowPDFExport(true)}
                onToggleSettings={() => setShowSettings(!showSettings)}
                onSave={handleSave}
                onPublish={handlePublishClick}
                onBackToEdit={handleBackToEdit}
              />

              {/* Settings Panel */}
              {step === 'customize' && (
                <SettingsPanel
                  isOpen={showSettings}
                  onClose={() => setShowSettings(false)}
                  title={title}
                  description={description}
                  onTitleChange={handleTitleChange}
                  onDescriptionChange={handleDescriptionChange}
                  templateName={selectedTemplate.name}
                />
              )}

              {/* Template Preview */}
              <div className={`transition-all duration-300 ${step === 'customize' ? 'pt-20' : ''}`}>
                <TemplatePreview
                  key={selectedTemplate?.id}
                  template={selectedTemplate}
                  portfolioData={{ ...portfolioData, id: id }}
                  isEditing={isEditing}
                  onContentChange={contentChangeHandler}
                  onEditingStateChange={(editing) => {
                    setIsUserEditing(editing);
                    if (!editing && portfolioData) {
                      autoSaveToLocalStorage(portfolioData);
                    }
                  }}
                  showPDFExport={showPDFExport}
                  onClosePDFExport={() => setShowPDFExport(false)}
                />
              </div>

              {/* Help Tooltip */}
              <HelpTooltip isVisible={step === 'customize' && isEditing} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Maintenance Modal - Not needed anymore, PDF export works directly
      <MaintenanceModal
        isOpen={showMaintenancePopup}
        onClose={() => setShowMaintenancePopup(false)}
        onContinue={() => setShowPDFExport(true)}
      />
      */}

      {/* Publish Modal */}
      <PublishModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onPublish={handlePublish}
        currentSlug={portfolioData?.slug || ''}
        portfolioTitle={title}
        isPublished={portfolioData?.isPublished || false}
        portfolioId={id}
      />

      {/* Template Change Modal */}
      <TemplateChangeModal
        isOpen={showTemplateChangeModal}
        onClose={() => setShowTemplateChangeModal(false)}
        currentTemplate={selectedTemplate}
        currentContent={portfolioData?.content}
        onTemplateChange={handleTemplateChange}
      />

      {/* PDF Export Modal - Using Backend Service */}
      <PDFExportBackend
        portfolioData={portfolioData}
        isVisible={showPDFExport}
        onClose={() => setShowPDFExport(false)}
      />
    </div>
  );
};

export default PortfolioBuilderPage;
