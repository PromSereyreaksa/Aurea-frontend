import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import usePortfolioStore from '../stores/portfolioStore';
import { getTemplate, createPortfolioFromTemplate } from '../templates';
import TemplateSelector from '../components/PortfolioBuilder/TemplateSelector';
import TemplateSetupForm from '../components/PortfolioBuilder/TemplateSetupForm';
import TemplatePreview from '../components/PortfolioBuilder/TemplatePreview';
import DesignToolsPanel from '../components/PortfolioBuilder/DesignToolsPanel';

const PortfolioBuilderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentPortfolio, isLoading, createPortfolio, updatePortfolio, fetchPortfolioById } = usePortfolioStore();

  // Template-based state
  const [step, setStep] = useState('select'); // 'select', 'setup', 'customize', 'preview'
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [isEditing, setIsEditing] = useState(true);
  const [showDesignTools, setShowDesignTools] = useState(false);
  const [isDesignToolsCollapsed, setIsDesignToolsCollapsed] = useState(false);
  const [showPDFExport, setShowPDFExport] = useState(false);
  const [showMaintenancePopup, setShowMaintenancePopup] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved'); // 'saving', 'saved', 'error'
  const [initializing, setInitializing] = useState(true);
  const [isUserCurrentlyEditing, setIsUserCurrentlyEditing] = useState(false); // Track if user is actively editing

  // Default image URLs for fallback
  const DEFAULT_HERO_IMAGE = 'https://via.placeholder.co/400x300?text=Default+Image';
  const DEFAULT_PROJECT_IMAGE = 'https://via.placeholder.co/400x300?text=Default+Project';

  // Local Storage key for auto-save
  const getLocalStorageKey = () => `portfolio-draft-${id || 'new'}`;

  // Debounced auto-save to local storage - only when not actively editing
  const autoSaveToLocalStorage = useCallback(
    debounce((data) => {
      // Only auto-save if user is not currently editing
      if (!isUserCurrentlyEditing) {
        setAutoSaveStatus('saving');
        try {
          const key = getLocalStorageKey();

          const saveData = {
            portfolioData: data,
            title,
            description,
            selectedTemplateId: selectedTemplate?.id,
            timestamp: Date.now(),
          };

          localStorage.setItem(key, JSON.stringify(saveData));
          setAutoSaveStatus('saved');
        } catch (error) {
          console.error('Failed to auto-save to localStorage:', error);
          setAutoSaveStatus('error');
        }
      }
    }, 2000), // Increased debounce time to 2 seconds
    [id, title, description, selectedTemplate?.id, isUserCurrentlyEditing]
  );

  // Helper function to convert portfolio to template format
  const convertToTemplateFormat = (portfolio) => {

    if (portfolio.templateId && portfolio.content) {
      return portfolio;
    }

    const templateData = {
      templateId: portfolio.template || 'minimal-designer',
      content: portfolio.sections?.reduce((acc, section) => {
        acc[section.type] = section.content;
        return acc;
      }, {}) || {},
      styling: portfolio.styling || {},
      structure: portfolio.structure || {},
      metadata: portfolio.metadata || {},
    };

    return templateData;
  };

  // Clear local storage draft when successfully saved to server
  const clearLocalStorageDraft = () => {
    try {
      const key = getLocalStorageKey();
      localStorage.removeItem(key);
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

  // Function to clean up placeholder data (only for backend saving)
  const cleanupPlaceholderData = (portfolioData) => {
    if (!portfolioData || !portfolioData.content) {
      return portfolioData;
    }

    const cleanedContent = { ...portfolioData.content };

    const cleanPlaceholderPath = (value) => {
      if (typeof value === 'string' && value.includes('/placeholder') && !value.startsWith('http')) {
        return '';
      }
      return value;
    };

    Object.keys(cleanedContent).forEach((sectionKey) => {
      const section = cleanedContent[sectionKey];

      if (typeof section === 'object' && section !== null) {
        Object.keys(section).forEach((fieldKey) => {
          const fieldValue = section[fieldKey];

          if (fieldKey === 'image') {
            cleanedContent[sectionKey][fieldKey] = cleanPlaceholderPath(fieldValue);
          } else if (fieldKey === 'projects' && Array.isArray(fieldValue)) {
            cleanedContent[sectionKey][fieldKey] = fieldValue.map((project) => ({
              ...project,
              image: cleanPlaceholderPath(project.image),
            }));
          }
        });
      }
    });

    const cleanedData = {
      ...portfolioData,
      content: cleanedContent,
      _version: (portfolioData._version || 0) + 1,
    };

    return cleanedData;
  };

  // Function to ensure valid image URLs for rendering
  const ensureValidImageUrls = (portfolioData) => {
    if (!portfolioData || !portfolioData.content) {
      return portfolioData;
    }

    const updatedContent = { ...portfolioData.content };

    // Ensure hero image - don't add default placeholder, let it be empty for proper placeholder rendering
    updatedContent.hero = {
      ...updatedContent.hero,
      image: updatedContent.hero?.image || '', // Use empty string instead of default placeholder
    };

    // Ensure project images
    if (updatedContent.projects && Array.isArray(updatedContent.projects)) {
      updatedContent.projects = updatedContent.projects.map((project) => ({
        ...project,
        image: project.image || DEFAULT_PROJECT_IMAGE,
      }));
    } else {
      updatedContent.projects = [];
    }

    return {
      ...portfolioData,
      content: updatedContent,
      _version: (portfolioData._version || 0) + 1,
    };
  };

  // Load portfolio data when component mounts or ID changes
  useEffect(() => {
    const loadPortfolio = async () => {
      setInitializing(true);
      if (id && id !== 'new') {

        try {
          const result = await fetchPortfolioById(id);

          if (result && result.success && result.portfolio) {

            setTitle(result.portfolio.title || '');
            setDescription(result.portfolio.description || '');

            const templateData = convertToTemplateFormat(result.portfolio);

            if (templateData) {
              // Ensure valid image URLs for rendering
              const dataWithValidImages = ensureValidImageUrls(templateData);
              setPortfolioData(dataWithValidImages);
              const template = getTemplate(templateData.templateId);

              if (template) {
                setSelectedTemplate(template);
                setStep('customize');
                setInitializing(false);
              } else {
                console.error('Template not found:', templateData.templateId);
                toast.error('Template not found');
                setInitializing(false);
              }
            } else {
              console.error('Failed to convert portfolio to template format');
              toast.error('Invalid portfolio format');
              setInitializing(false);
            }
          } else {
            console.error('Failed to load portfolio:', result);
            toast.error('Portfolio not found');
            setInitializing(false);
          }
        } catch (error) {
          console.error('Error loading portfolio:', error);
          toast.error('Failed to load portfolio');
          setInitializing(false);
        }
      } else if (id === 'new') {
        setPortfolioData(null);
        setSelectedTemplate(null);
        setTitle('');
        setDescription('');
        setStep('select');
        setInitializing(false);
      }
    };

    loadPortfolio();
  }, [id]);

  // Warn user before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
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

  // Close maintenance menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMaintenancePopup && !event.target.closest('.maintenance-popup')) {
        setShowMaintenancePopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMaintenancePopup]);

  // Add Ctrl+S save functionality
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if Ctrl+S (or Cmd+S on Mac) is pressed
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault(); // Prevent browser's default save action
        
        // Only save if we're in customize or preview mode and have portfolio data
        if ((step === 'customize' || step === 'preview') && portfolioData && selectedTemplate) {
          toast.success('Saving portfolio... (Ctrl+S)', {
            duration: 1500,
            icon: '💾',
          });
          handleSave();
        }
      }
    };

    // Add the event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [step, portfolioData, selectedTemplate]); // Removed handleSave from dependencies

  const handleTemplateSelect = (template) => {
    if (portfolioData && portfolioData.templateId !== template.id) {
      const confirmSwitch = window.confirm(
        'Switching templates will reset your current customizations. Are you sure you want to continue?'
      );
      if (!confirmSwitch) {
        return;
      }
    }

    setSelectedTemplate(template);
    
    // For new portfolios, go to setup step
    if (id === 'new') {
      setStep('setup');
    } else {
      // For existing portfolios, create portfolio data and go directly to customize
      if (!portfolioData || portfolioData.templateId !== template.id) {
        const newPortfolioData = createPortfolioFromTemplate(template.id);
        setPortfolioData(ensureValidImageUrls(newPortfolioData));
      }
      setStep('customize');
      setShowDesignTools(true);
    }
  };

  const handleSetupComplete = (setupData) => {
    const { personalInfo, skillsArray, styling } = setupData;
    
    // Create portfolio from template with user data
    const newPortfolioData = createPortfolioFromTemplate(selectedTemplate.id, {
      hero: {
        name: personalInfo.name,
        title: personalInfo.title,
        description: personalInfo.description || `Passionate ${personalInfo.title.toLowerCase()} with expertise in creating exceptional experiences.`,
        image: '', // User will upload this later
      },
      about: {
        heading: 'About Me',
        content: personalInfo.bio || `I'm a ${personalInfo.title.toLowerCase()} with a passion for creating meaningful work. I believe in the power of good design and development to solve problems and tell compelling stories.`,
        image: '', // User will upload this later
        skills: skillsArray.length > 0 ? skillsArray : ['Professional Skills', 'Creative Thinking', 'Problem Solving'],
      },
      contact: {
        heading: "Let's Work Together",
        description: "I'm always interested in new projects and opportunities.",
        form_fields: ['name', 'email', 'message'],
        social_links: [
          { platform: 'Email', url: personalInfo.email || 'your.email@example.com' },
          ...(personalInfo.phone ? [{ platform: 'Phone', url: `tel:${personalInfo.phone}` }] : []),
          ...(personalInfo.website ? [{ platform: 'Website', url: personalInfo.website }] : []),
        ].filter(link => link.url && !link.url.includes('example.com')),
      },
      // Merge custom styling with template defaults
      styling: {
        ...styling,
        colors: {
          ...selectedTemplate.styling?.colors,
          ...styling.colors,
        },
        fonts: {
          ...selectedTemplate.styling?.fonts,
          ...styling.fonts,
        },
      },
    });

    // Set the title and description from form data
    setTitle(personalInfo.name ? `${personalInfo.name}'s Portfolio` : `${selectedTemplate.name} Portfolio`);
    setDescription(`Portfolio showcasing the work of ${personalInfo.name || 'a talented professional'} - ${personalInfo.title || 'Creative Professional'}`);
    
    // Apply the portfolio data
    setPortfolioData(ensureValidImageUrls(newPortfolioData));
    setStep('customize');
    setShowDesignTools(true);
  };

  const handleBackToTemplates = () => {
    if (step === 'setup') {
      setStep('select');
    } else {
      setStep('select');
      setShowDesignTools(false);
    }
  };

  const handleContentChange = (sectionId, fieldId, value) => {

    // Handle special section management operations
    if (sectionId === '_sections') {
      if (fieldId === 'add') {
        setPortfolioData((prev) => ({
          ...prev,
          content: value.content
        }));
        toast.success(`Added "${value.sectionData.title}" section successfully!`);
        return;
      } else if (fieldId === 'delete') {
        setPortfolioData((prev) => ({
          ...prev,
          content: value.content
        }));
        toast.success(`Deleted "${value.sectionId}" section successfully!`);
        return;
      } else if (fieldId === 'reorder') {
        setPortfolioData((prev) => ({
          ...prev,
          content: value.content
        }));
        return;
      }
    }
    
    // Check if this is an image field or contains image data
    const isImageField = fieldId === 'image' || fieldId.includes('image') || 
                        (typeof value === 'string' && value.startsWith('data:image/'));
    
    // Allow data URLs for images (from cropped images), as well as http/https URLs and relative paths
    if (isImageField && value && typeof value === 'string' && !value.match(/^(https?:\/\/|\/|data:image\/)/)) {
      console.warn('Invalid image URL:', value);
      toast.error('Please use a valid image URL (http://, https://, relative path, or data URL)');
      return;
    }

    setPortfolioData((prev) => {
      if (!prev || !prev.content) {
        console.error('Portfolio data or content is null:', prev);
        return prev;
      }

      const updatedContent = {
        ...prev.content,
        [sectionId]: {
          ...prev.content[sectionId],
          [fieldId]: value,
        },
      };

      // Apply fallback images for rendering
      const updated = ensureValidImageUrls({
        ...prev,
        content: updatedContent,
        // Do not bump _version for every keystroke - only change _version on explicit save
      });
      
      // Don't auto-save during active editing - only trigger auto-save when user stops editing
      return updated;
    });
  };

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
    if (portfolioData) {
      const updatedData = {
        ...portfolioData,
        title: newTitle,
        _version: (portfolioData._version || 0) + 1,
      };
      setPortfolioData(updatedData);
      autoSaveToLocalStorage(updatedData);
    }
  };

  const handleDescriptionChange = (newDescription) => {
    setDescription(newDescription);
    if (portfolioData) {
      const updatedData = {
        ...portfolioData,
        description: newDescription,
        _version: (portfolioData._version || 0) + 1,
      };
      setPortfolioData(updatedData);
      autoSaveToLocalStorage(updatedData);
    }
  };

  const handleStyleChange = (styleCategory, newStyles) => {
    setPortfolioData((prev) => ({
      ...prev,
      styling: {
        ...prev.styling,
        [styleCategory]: newStyles,
      },
    }));
  };

  const handleSave = async () => {
    try {

      if (!selectedTemplate) {
        toast.error('No template selected');
        return;
      }

      if (!portfolioData) {
        toast.error('No portfolio data to save');
        return;
      }

      const cleanedData = cleanupPlaceholderData({ ...portfolioData });

      const convertContentToSections = (content) => {
        if (!content) return [];

        const sections = [];
        // Exclude non-content fields like styling, metadata, etc.
        const contentFields = ['hero', 'about', 'projects', 'contact', 'experience', 'education', 'skills', 'testimonials', 'certifications', 'services'];
        
        Object.entries(content).forEach(([sectionType, sectionContent]) => {
          // Only include actual content sections, not metadata/styling
          if (contentFields.includes(sectionType) && sectionContent) {
            sections.push({
              type: sectionType,
              content: sectionContent,
            });
          }
        });
        return sections;
      };

      const saveData = {
        title: title || `${selectedTemplate.name} Portfolio`,
        description: description || `Portfolio created with ${selectedTemplate.name} template`,
        template: selectedTemplate.id,
        sections: convertContentToSections(cleanedData.content),
        styling: cleanedData.styling || {},
        published: false,
      };

      console.log('=== SAVE DATA DEBUG ===');
      console.log('Portfolio Data:', portfolioData);
      console.log('Cleaned Data:', cleanedData);
      console.log('Save Data:', saveData);
      console.log('Sections:', saveData.sections);
      console.log('========================');

      let result;
      if (id && id !== 'new') {
        result = await updatePortfolio(id, saveData);
      } else {
        result = await createPortfolio(saveData);
      }

      if (result && result.success) {
        toast.success('Portfolio saved successfully!');
        clearLocalStorageDraft();
        if (id === 'new' && result.portfolio?._id) {
          navigate(`/portfolio-builder/${result.portfolio._id}`);
        }
      } else {
        throw new Error(result?.error || 'Save failed');
      }
    } catch (error) {
      console.error('=== SAVE ERROR ===');
      console.error('Error:', error);
      toast.error('Failed to save portfolio: ' + (error.message || 'Unknown error'));
    }
  };

  const handlePublish = async () => {
    try {
      if (!selectedTemplate || !portfolioData) {
        toast.error('Cannot publish - missing template or data');
        return;
      }

      const cleanedData = cleanupPlaceholderData({ ...portfolioData });

      const convertContentToSections = (content) => {
        if (!content) return [];

        const sections = [];
        // Exclude non-content fields like styling, metadata, etc.
        const contentFields = ['hero', 'about', 'projects', 'contact', 'experience', 'education', 'skills', 'testimonials', 'certifications', 'services'];
        
        Object.entries(content).forEach(([sectionType, sectionContent]) => {
          // Only include actual content sections, not metadata/styling
          if (contentFields.includes(sectionType) && sectionContent) {
            sections.push({
              type: sectionType,
              content: sectionContent,
            });
          }
        });
        return sections;
      };

      const publishData = {
        title: title || `${selectedTemplate.name} Portfolio`,
        description: description || `Portfolio created with ${selectedTemplate.name} template`,
        template: selectedTemplate.id,
        sections: convertContentToSections(cleanedData.content),
        styling: cleanedData.styling || {},
        published: true,
      };

      let result;
      if (id && id !== 'new') {
        result = await updatePortfolio(id, publishData);
      } else {
        result = await createPortfolio(publishData);
      }

      if (result && result.success) {
        toast.success('Portfolio published successfully!');
        clearLocalStorageDraft();
        if (id === 'new' && result.portfolio?._id) {
          navigate(`/portfolio-builder/${result.portfolio._id}`);
        }
      } else {
        throw new Error(result?.error || 'Publish failed');
      }
    } catch (error) {
      console.error('Publish error:', error);
      toast.error('Failed to publish portfolio: ' + (error.message || 'Unknown error'));
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

  const contentChangeHandler = (sectionId, fieldId, value) => {
    handleContentChange(sectionId, fieldId, value);
  };
  contentChangeHandler.onSave = handleSave;

  if (initializing || isLoading) {
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
          <div className="flex justify-between items-center h-16 min-w-0">
            <div className="flex items-center space-x-2 md:space-x-4 min-w-0 flex-shrink">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap text-sm md:text-base"
              >
                ← Back to Dashboard
              </button>
              <div className="flex items-center space-x-1 md:space-x-2 min-w-0">
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
            </div>

            <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
              {step === 'customize' && (
                <>
                  <button
                    onClick={handleBackToTemplates}
                    className="px-3 py-2 md:px-4 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm md:text-base whitespace-nowrap"
                  >
                    Change Template
                  </button>
                  <button
                    onClick={() => setShowDesignTools(!showDesignTools)}
                    className={`px-3 py-2 md:px-4 rounded-lg transition-colors text-sm md:text-base whitespace-nowrap ${
                      showDesignTools
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Design Tools
                  </button>
                  <button
                    onClick={handlePreview}
                    className="px-3 py-2 md:px-4 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors text-sm md:text-base whitespace-nowrap"
                  >
                    Preview
                  </button>
                </>
              )}

              {step === 'preview' && (
                <button
                  onClick={handleBackToEdit}
                  className="px-3 py-2 md:px-4 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors text-sm md:text-base whitespace-nowrap"
                >
                  Back to Edit
                </button>
              )}

              {(step === 'customize' || step === 'preview') && (
                <>
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
                          <svg
                            className="h-3 w-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                        </div>
                        <span>Auto-saved</span>
                      </>
                    )}
                    {autoSaveStatus === 'error' && (
                      <>
                        <div className="h-4 w-4 bg-red-500 rounded-full mr-2 flex items-center justify-center">
                          <svg
                            className="h-3 w-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            ></path>
                          </svg>
                        </div>
                        <span>Save failed</span>
                      </>
                    )}
                  </div>

                  {/* Export PDF Button */}
                  <button
                    onClick={() => setShowMaintenancePopup(true)}
                    className="flex items-center px-2 py-2 md:px-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors text-sm md:text-base whitespace-nowrap"
                    title="Export PDF"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>

                  <button
                    onClick={handleSave}
                    className="px-3 py-2 md:px-4 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm md:text-base whitespace-nowrap"
                  >
                    Save Draft
                  </button>
                  <button
                    onClick={handlePublish}
                    className="px-3 py-2 md:px-4 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors text-sm md:text-base whitespace-nowrap"
                  >
                    Publish
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

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
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                      step === 'setup' 
                        ? 'bg-blue-500 text-white' 
                        : ['customize', 'preview'].includes(step)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {['customize', 'preview'].includes(step) ? '✓' : '2'}
                  </div>
                  <span className="text-sm text-gray-600">Setup Information</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                      step === 'customize' ? 'bg-blue-500 text-white' : step === 'preview' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {step === 'preview' ? '✓' : '3'}
                  </div>
                  <span className="text-sm text-gray-600">Customize</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                      step === 'preview' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    4
                  </div>
                  <span className="text-sm text-gray-600">Preview & Publish</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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

          {step === 'setup' && selectedTemplate && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <TemplateSetupForm
                template={selectedTemplate}
                onComplete={handleSetupComplete}
                onBack={handleBackToTemplates}
              />
            </motion.div>
          )}

          {(step === 'customize' || step === 'preview') && selectedTemplate && portfolioData && (
            <motion.div
              key="customize"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="relative"
            >
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

              <div className={`${
                showDesignTools 
                  ? isDesignToolsCollapsed 
                    ? 'mr-16' 
                    : 'mr-[28rem]' 
                  : ''
              } transition-all duration-300`}>
                <TemplatePreview
                  key={`${selectedTemplate?.id}`}
                  template={selectedTemplate}
                  portfolioData={portfolioData} // Pass portfolioData with ensured valid image URLs
                  isEditing={isEditing}
                  onContentChange={contentChangeHandler}
                  onEditingStateChange={(isCurrentlyEditing) => {
                    setIsUserCurrentlyEditing(isCurrentlyEditing);
                    // Trigger auto-save when user stops editing
                    if (!isCurrentlyEditing && portfolioData) {
                      autoSaveToLocalStorage(portfolioData);
                    }
                  }}
                  showPDFExport={showPDFExport}
                  onClosePDFExport={() => setShowPDFExport(false)}
                />
              </div>

              <AnimatePresence>
                {showDesignTools && step === 'customize' && (
                  <DesignToolsPanel
                    template={selectedTemplate}
                    portfolioData={portfolioData}
                    onStyleChange={handleStyleChange}
                    onContentChange={contentChangeHandler}
                    onCollapseChange={setIsDesignToolsCollapsed}
                  />
                )}
              </AnimatePresence>

              {step === 'customize' && isEditing && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-40 max-w-md">
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
                      <div>Click on any text to edit it. Use the Design Tools panel to customize colors and fonts.</div>
                      <div className="flex items-center space-x-1 mt-1 text-blue-200">
                        <kbd className="px-1 py-0.5 bg-blue-700 rounded text-xs">Ctrl</kbd>
                        <span>+</span>
                        <kbd className="px-1 py-0.5 bg-blue-700 rounded text-xs">S</kbd>
                        <span>to save quickly</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Maintenance Popup Modal */}
        {showMaintenancePopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="maintenance-popup bg-white rounded-lg shadow-xl max-w-md w-full">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Maintenance Notice</h3>
                      <p className="text-sm text-gray-500">Beta Feature</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowMaintenancePopup(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-lg">📄</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">PDF Export</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        This feature is currently in beta testing. You may experience some limitations or unexpected behavior.
                      </p>
                      <ul className="text-xs text-gray-500 mt-2 space-y-1">
                        <li>• Export may not include all styling</li>
                        <li>• Image quality may vary</li>
                        <li>• Some sections might not display correctly</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    We're working to improve this feature
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowMaintenancePopup(false)}
                      className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setShowMaintenancePopup(false);
                        setShowPDFExport(true);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Continue Anyway
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioBuilderPage;