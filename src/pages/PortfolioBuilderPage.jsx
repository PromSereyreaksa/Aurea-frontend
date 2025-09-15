import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import usePortfolioStore from '../stores/portfolioStore';
import { getTemplate, createPortfolioFromTemplate } from '../templates';
import TemplateSelector from '../components/PortfolioBuilder/TemplateSelector';
import TemplatePreview from '../components/PortfolioBuilder/TemplatePreview';
import DesignToolsPanel from '../components/PortfolioBuilder/DesignToolsPanel';

const PortfolioBuilderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentPortfolio, isLoading, createPortfolio, updatePortfolio, fetchPortfolioById } = usePortfolioStore();
  
  // Template-based state
  const [step, setStep] = useState('select'); // 'select', 'customize', 'preview'
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [isEditing, setIsEditing] = useState(true);
  const [showDesignTools, setShowDesignTools] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved'); // 'saving', 'saved', 'error'
  const [justSaved, setJustSaved] = useState(false); // Flag to prevent reload after save

  // Local Storage key for auto-save
  const getLocalStorageKey = () => `portfolio-draft-${id || 'new'}`;

  // Debounced auto-save to local storage
  const autoSaveToLocalStorage = useCallback(
    debounce((data) => {
      console.log('=== AUTO-SAVE FUNCTION CALLED ===');
      console.log('Data to save:', data);
      console.log('Title:', title);
      console.log('Description:', description);
      console.log('Selected template:', selectedTemplate?.id);
      
      setAutoSaveStatus('saving');
      try {
        const key = getLocalStorageKey();
        console.log('localStorage key:', key);
        
        const saveData = {
          portfolioData: data,
          title,
          description,
          selectedTemplateId: selectedTemplate?.id,
          timestamp: Date.now()
        };
        
        console.log('Full save data:', saveData);
        localStorage.setItem(key, JSON.stringify(saveData));
        setAutoSaveStatus('saved');
        console.log('=== SUCCESSFULLY SAVED TO LOCALSTORAGE ===');
        console.log('Saved under key:', key);
      } catch (error) {
        console.error('Failed to auto-save to localStorage:', error);
        setAutoSaveStatus('error');
      }
    }, 1000), // Save 1 second after last change
    [id, title, description, selectedTemplate?.id]
  );

  // Helper function to convert portfolio to template format
  const convertToTemplateFormat = (portfolio) => {
    console.log('Converting portfolio to template format:', portfolio);
    
    if (portfolio.templateId && portfolio.content) {
      // Already in template format
      return portfolio;
    }
    
    // Convert old format to template format
    const templateData = {
      templateId: 'minimal-designer',
      content: portfolio.sections?.reduce((acc, section) => {
        acc[section.type] = section.content;
        return acc;
      }, {}) || {},
      styling: portfolio.styling || {},
      structure: portfolio.structure || {},
      metadata: portfolio.metadata || {}
    };
    
    console.log('Converted to template format:', templateData);
    return templateData;
  };

  // Clear local storage draft when successfully saved to server
  const clearLocalStorageDraft = () => {
    try {
      const key = getLocalStorageKey();
      localStorage.removeItem(key);
      console.log('Cleared localStorage draft:', key);
    } catch (error) {
      console.error('Failed to clear localStorage draft:', error);
    }
  };

  // Debounce utility function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Load portfolio data when component mounts or ID changes
  useEffect(() => {
    const loadPortfolio = async () => {
      if (id && id !== 'new') {
        console.log('=== LOADING PORTFOLIO FROM SERVER ===');
        console.log('Portfolio ID:', id);
        
        try {
          const result = await fetchPortfolioById(id);
          if (result.success && result.portfolio) {
            console.log('Portfolio loaded from server:', result.portfolio);
            
            // Set basic info
            setTitle(result.portfolio.title || '');
            setDescription(result.portfolio.description || '');
            
            // Convert to template format if needed
            const templateData = convertToTemplateFormat(result.portfolio);
            if (templateData) {
              setPortfolioData(templateData);
              setSelectedTemplate(getTemplate(templateData.templateId));
              setStep('customize');
            }
          }
        } catch (error) {
          console.error('Failed to load portfolio:', error);
          toast.error('Failed to load portfolio');
        }
      } else if (id === 'new') {
        // Reset for new portfolio
        setPortfolioData(null);
        setSelectedTemplate(null);
        setTitle('');
        setDescription('');
        setStep('select');
      }
    };

    loadPortfolio();
  }, [id, fetchPortfolioById]);

  useEffect(() => {
    // DISABLED: Load portfolio data when currentPortfolio is available 
    // This was causing reloads that lost user changes
    console.log('=== PORTFOLIO RELOAD USEEFFECT (DISABLED) ===');
    console.log('This useEffect is disabled to prevent losing user changes');
    return; // Exit early - don't load portfolio data from store
    
    // Load portfolio data when currentPortfolio is available and we're editing an existing portfolio
    // But skip if we just saved to prevent overwriting local changes
    console.log('=== USEEFFECT TRIGGERED ===');
    console.log('currentPortfolio:', currentPortfolio);
    console.log('id:', id);
    console.log('justSaved:', justSaved);
    console.log('portfolioData exists:', !!portfolioData);
    console.log('Should load?', currentPortfolio && id && id !== 'new' && !justSaved && !portfolioData);
    
    if (currentPortfolio && id && id !== 'new' && !justSaved && !portfolioData) {
      console.log('=== LOADING EXISTING PORTFOLIO DATA ===');
      console.log('Loading existing portfolio:', currentPortfolio);
      console.log('Portfolio structure:', {
        hasTemplateId: !!currentPortfolio.templateId,
        hasContent: !!currentPortfolio.content,
        hasStyling: !!currentPortfolio.styling,
        hasStructure: !!currentPortfolio.structure,
        keys: Object.keys(currentPortfolio)
      });
      
      // Load existing portfolio data
      setTitle(currentPortfolio.title || '');
      setDescription(currentPortfolio.description || '');
      
      // Check if portfolio has template data
      if (currentPortfolio.templateId) {
        console.log('Portfolio has templateId:', currentPortfolio.templateId);
        const template = getTemplate(currentPortfolio.templateId);
        console.log('Found template:', template);
        
        if (template) {
          setSelectedTemplate(template);
          setPortfolioData(currentPortfolio);
          setStep('customize');
          console.log('Set portfolio data to:', currentPortfolio);
        } else {
          console.error('Template not found for ID:', currentPortfolio.templateId);
          // If template not found, default to minimal-designer
          const defaultTemplate = getTemplate('minimal-designer');
          if (defaultTemplate) {
            setSelectedTemplate(defaultTemplate);
            // Convert existing portfolio to template format
            const templateData = createPortfolioFromTemplate('minimal-designer');
            const newData = {
              ...templateData,
              content: currentPortfolio.content || templateData.content,
              styling: currentPortfolio.styling || templateData.styling,
              templateId: 'minimal-designer'
            };
            setPortfolioData(newData);
            setStep('customize');
            console.log('Created new template data:', newData);
          }
        }
      } else {
        console.log('Portfolio has no templateId, converting to template format');
        // For portfolios without templateId, convert to template format
        const defaultTemplate = getTemplate('minimal-designer');
        if (defaultTemplate) {
          setSelectedTemplate(defaultTemplate);
          const templateData = createPortfolioFromTemplate('minimal-designer');
          const newData = {
            ...templateData,
            content: currentPortfolio.content || templateData.content,
            styling: currentPortfolio.styling || templateData.styling,
            templateId: 'minimal-designer'
          };
          setPortfolioData(newData);
          setStep('customize');
          console.log('Converted portfolio to template format:', newData);
        }
      }
    } else {
      console.log('=== SKIPPING PORTFOLIO LOAD ===');
      console.log('Reason: currentPortfolio:', !!currentPortfolio, 'id:', id, 'justSaved:', justSaved, 'portfolioData:', !!portfolioData);
    }
  }, [currentPortfolio, justSaved, id, portfolioData]);

  // Warn user before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // Check if there are local storage drafts
      const key = getLocalStorageKey();
      const saved = localStorage.getItem(key);
      if (saved && autoSaveStatus !== 'saved') {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [autoSaveStatus, id]);

  const handleTemplateSelect = (template) => {
    // If switching to a different template and we have existing data, confirm with user
    if (portfolioData && portfolioData.templateId !== template.id) {
      const confirmSwitch = window.confirm(
        'Switching templates will reset your current customizations. Are you sure you want to continue?'
      );
      if (!confirmSwitch) {
        return;
      }
    }
    
    setSelectedTemplate(template);
    
    // Only create new portfolio data if we don't already have data for this template
    // or if we're switching to a different template
    if (!portfolioData || portfolioData.templateId !== template.id) {
      const newPortfolioData = createPortfolioFromTemplate(template.id);
      setPortfolioData(newPortfolioData);
    }
    
    setStep('customize');
    setShowDesignTools(true);
  };

  const handleContentChange = (sectionId, fieldId, value) => {
    console.log('=== CONTENT CHANGE ===');
    console.log('Content change:', { sectionId, fieldId, value });
    
    setPortfolioData(prev => {
      if (!prev || !prev.content) {
        console.error('Portfolio data or content is null:', prev);
        return prev;
      }
      
      const updated = {
        ...prev,
        content: {
          ...prev.content,
          [sectionId]: {
            ...prev.content[sectionId],
            [fieldId]: value
          }
        },
        // Add a version field to force re-renders
        _version: (prev._version || 0) + 1
      };
      console.log('Updated portfolio data:', updated);
      
      // Auto-save to localStorage with debouncing
      console.log('=== TRIGGERING AUTO-SAVE ===');
      autoSaveToLocalStorage(updated);
      
      return updated;
    });
  };

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
    // Auto-save title changes to localStorage
    if (portfolioData) {
      const updatedData = {
        ...portfolioData,
        title: newTitle,
        _version: (portfolioData._version || 0) + 1
      };
      autoSaveToLocalStorage(updatedData);
    }
  };

  const handleDescriptionChange = (newDescription) => {
    setDescription(newDescription);
    // Auto-save description changes to localStorage
    if (portfolioData) {
      const updatedData = {
        ...portfolioData,
        description: newDescription,
        _version: (portfolioData._version || 0) + 1
      };
      autoSaveToLocalStorage(updatedData);
    }
  };

  const handleStyleChange = (styleCategory, newStyles) => {
    setPortfolioData(prev => ({
      ...prev,
      styling: {
        ...prev.styling,
        [styleCategory]: newStyles
      }
    }));
  };

  const handleSave = async () => {
    try {
      console.log('=== SIMPLE SAVE - KEEPING IT BASIC ===');
      
      if (!selectedTemplate) {
        toast.error('No template selected');
        return;
      }

      if (!portfolioData) {
        toast.error('No portfolio data to save');
        return;
      }

      const saveData = {
        title: title || `${selectedTemplate.name} Portfolio`,
        description: description || `Portfolio created with ${selectedTemplate.name} template`,
        templateId: selectedTemplate.id,
        content: portfolioData.content,
        styling: portfolioData.styling,
        structure: portfolioData.structure,
        metadata: portfolioData.metadata,
        isPublished: false
      };

      console.log('Saving data:', saveData);

      if (id && id !== 'new') {
        // Update existing - just save, don't touch anything else
        const result = await updatePortfolio(id, saveData);
        if (result.success) {
          toast.success('Portfolio updated successfully!');
        } else {
          throw new Error(result.error);
        }
      } else {
        // Create new portfolio
        const result = await createPortfolio(saveData);
        if (result.success) {
          toast.success('Portfolio saved successfully!');
          navigate(`/portfolio-builder/${result.portfolio._id}`);
        } else {
          throw new Error(result.error);
        }
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save portfolio');
    }
  };

  const handlePublish = async () => {
    try {
      const publishData = {
        title: title || `${selectedTemplate.name} Portfolio`,
        description: description || `Portfolio created with ${selectedTemplate.name} template`,
        templateId: selectedTemplate.id,
        content: portfolioData.content,
        styling: portfolioData.styling,
        structure: portfolioData.structure,
        metadata: portfolioData.metadata,
        isPublished: true
      };

      if (id && id !== 'new') {
        await updatePortfolio(id, publishData);
        clearLocalStorageDraft(); // Clear draft after successful publish
        setJustSaved(true); // Prevent reload of portfolio data
        setTimeout(() => setJustSaved(false), 1000); // Reset flag after 1 second
        toast.success('Portfolio published successfully!');
      } else {
        const result = await createPortfolio(publishData);
        if (result.success) {
          clearLocalStorageDraft(); // Clear draft after successful publish
          setJustSaved(true); // Prevent reload of portfolio data
          setTimeout(() => setJustSaved(false), 1000); // Reset flag after 1 second
          toast.success('Portfolio created and published successfully!');
          navigate(`/portfolio-builder/${result.portfolio._id}`);
        } else {
          throw new Error(result.error);
        }
      }
    } catch (error) {
      console.error('Publish error:', error);
      toast.error('Failed to publish portfolio');
    }
  };

  const handlePreview = () => {
    setStep('preview');
    setIsEditing(false);
    setShowDesignTools(false);
  };

  const handleBackToEdit = () => {
    setStep('customize');
    setIsEditing(true);
    setShowDesignTools(true);
  };

  const handleBackToTemplates = () => {
    setStep('select');
    setShowDesignTools(false);
    // Don't clear selectedTemplate and portfolioData to preserve changes
  };

  // Create wrapper for content change with save functionality
  const contentChangeHandler = (sectionId, fieldId, value) => {
    handleContentChange(sectionId, fieldId, value);
  };
  contentChangeHandler.onSave = handleSave;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b relative z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back to Dashboard
              </button>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-semibold text-gray-900">
                  {step === 'select' ? 'Choose Template' : 
                   step === 'customize' ? 'Customize Portfolio' : 
                   'Preview Portfolio'}
                </h1>
                {selectedTemplate && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                    {selectedTemplate.name}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {step === 'customize' && (
                <>
                  <button
                    onClick={handleBackToTemplates}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Change Template
                  </button>
                  <button
                    onClick={() => setShowDesignTools(!showDesignTools)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      showDesignTools 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Design Tools
                  </button>
                  <button
                    onClick={handlePreview}
                    className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors"
                  >
                    Preview
                  </button>
                </>
              )}
              
              {step === 'preview' && (
                <button
                  onClick={handleBackToEdit}
                  className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Back to Edit
                </button>
              )}

              {(step === 'customize' || step === 'preview') && (
                <>
                  {/* Auto-save status indicator */}
                  <div className="flex items-center text-sm text-gray-600">
                    {autoSaveStatus === 'saving' && (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        <span>Saving...</span>
                      </>
                    )}
                    {autoSaveStatus === 'saved' && (
                      <>
                        <div className="h-4 w-4 bg-green-500 rounded-full mr-2 flex items-center justify-center">
                          <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                        <span>Auto-saved</span>
                      </>
                    )}
                    {autoSaveStatus === 'error' && (
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
                  
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Save Draft
                  </button>
                  <button
                    onClick={handlePublish}
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Publish
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        {step !== 'select' && (
          <div className="border-t border-gray-200 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center py-3 space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">
                    ✓
                  </div>
                  <span className="text-sm text-gray-600">Template Selected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                    step === 'customize' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                  }`}>
                    {step === 'customize' ? '2' : '✓'}
                  </div>
                  <span className="text-sm text-gray-600">Customize</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                    step === 'preview' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    3
                  </div>
                  <span className="text-sm text-gray-600">Preview & Publish</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {step === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="py-8"
            >
              <TemplateSelector 
                onSelectTemplate={handleTemplateSelect}
                selectedTemplateId={selectedTemplate?.id}
              />
            </motion.div>
          )}

      {/* Debug current state */}
      {console.log('=== RENDER STATE DEBUG ===', {
        step,
        selectedTemplate: selectedTemplate?.id,
        portfolioData: !!portfolioData,
        showDesignTools,
        condition: (step === 'customize' || step === 'preview') && selectedTemplate && portfolioData
      })}

      {/* Customize/Preview Step */}
          {(step === 'customize' || step === 'preview') && selectedTemplate && portfolioData && (
            <motion.div
              key="customize"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="relative"
            >
              {/* Portfolio Settings Panel (only in customize mode) */}
              {step === 'customize' && !showDesignTools && (
                <div className="absolute top-6 left-6 bg-white rounded-lg shadow-lg p-4 z-30 w-80">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Portfolio Title
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`${selectedTemplate.name} Portfolio`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => handleDescriptionChange(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Portfolio created with ${selectedTemplate.name} template`}
                      />
                    </div>

                    <div className="pt-2 border-t border-gray-200">
                      <button
                        onClick={() => setShowDesignTools(true)}
                        className="w-full px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                      >
                        Open Design Tools
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Template Preview */}
              <div className={`${showDesignTools ? 'mr-80' : ''} transition-all duration-300`}>
                <TemplatePreview
                  template={selectedTemplate}
                  portfolioData={portfolioData}
                  isEditing={isEditing}
                  onContentChange={contentChangeHandler}
                />
              </div>

              {/* Design Tools Panel */}
              <AnimatePresence>
                {showDesignTools && step === 'customize' && (
                  <DesignToolsPanel
                    template={selectedTemplate}
                    portfolioData={portfolioData}
                    onStyleChange={handleStyleChange}
                    onContentChange={contentChangeHandler}
                  />
                )}
              </AnimatePresence>

              {/* Editing Instructions */}
              {step === 'customize' && isEditing && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-40">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">Click on any text to edit it. Use the Design Tools panel to customize colors and fonts.</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PortfolioBuilderPage;