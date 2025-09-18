import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { cloudinaryApi } from '../../lib/cloudinaryApi';
import toast from 'react-hot-toast';
import PDFExport from './PDFExport';

// Image Gallery Component for Projects
const ImageGallery = ({ images = [], mainImage, projectTitle }) => {
  const [activeImage, setActiveImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Combine main image with additional images
  const allImages = [mainImage, ...images].filter(Boolean);
  
  if (allImages.length <= 1) {
    return mainImage ? (
      <img 
        src={mainImage} 
        alt={projectTitle}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
    ) : (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">No image</span>
      </div>
    );
  }
  
  return (
    <>
      {/* Main Image */}
      <div className="relative w-full h-full">
        <img 
          src={allImages[0]} 
          alt={projectTitle}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-pointer"
          onClick={() => {
            setActiveImage(allImages[0]);
            setCurrentIndex(0);
          }}
        />
        
        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
          +{allImages.length - 1}
        </div>
        
        {/* Thumbnail Strip */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {allImages.slice(1, 4).map((img, index) => (
              <div 
                key={index}
                className="w-8 h-8 rounded overflow-hidden border-2 border-white/80 cursor-pointer hover:border-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImage(img);
                  setCurrentIndex(index + 1);
                }}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setActiveImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={activeImage} 
                alt={projectTitle}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              
              {/* Navigation */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => {
                      const newIndex = currentIndex > 0 ? currentIndex - 1 : allImages.length - 1;
                      setCurrentIndex(newIndex);
                      setActiveImage(allImages[newIndex]);
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      const newIndex = currentIndex < allImages.length - 1 ? currentIndex + 1 : 0;
                      setCurrentIndex(newIndex);
                      setActiveImage(allImages[newIndex]);
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
              
              {/* Close Button */}
              <button
                onClick={() => setActiveImage(null)}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                {currentIndex + 1} / {allImages.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const TemplatePreview = ({ template, portfolioData, isEditing = false, onContentChange, onEditingStateChange, showPDFExport, onClosePDFExport }) => {
  const [activeSection, setActiveSection] = useState(null);
  const [isEditingText, setIsEditingText] = useState(null);
  const [isEditingImage, setIsEditingImage] = useState(null);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [skillsInput, setSkillsInput] = useState('');
  const [uploadingImages, setUploadingImages] = useState(new Set());
  const [imageErrors, setImageErrors] = useState(new Set());
  const [imageLoading, setImageLoading] = useState(new Set());
  const [editingImage, setEditingImage] = useState(null);
  const [crop, setCrop] = useState({ unit: '%', width: 80, height: 80, x: 10, y: 10 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [localContent, setLocalContent] = useState({}); // Local content state for editing
  const [cropLoading, setCropLoading] = useState(false); // Loading state for crop operations
  const [imageProcessing, setImageProcessing] = useState(new Set()); // Track which images are being processed
  const [cropImageLoaded, setCropImageLoaded] = useState(false); // Track if crop editor image has loaded
  const imgRef = useRef(null);
  const contentRef = useRef({});
  const fileInputRefs = useRef({});
  const editingStateRef = useRef(null);
  const inputRefs = useRef({});
  const debounceTimeoutRef = useRef(null);
  const isActivelyEditingRef = useRef(false); // Track if user is actively typing

  // Comprehensive cleanup function for crop editor
  const cleanupCropEditor = useCallback(() => {
    setEditingImage(null);
    setCrop({ unit: '%', width: 80, height: 80, x: 10, y: 10 });
    setCompletedCrop(null);
    setCropLoading(false);
    setCropImageLoaded(false);
    // Clear the image reference
    if (imgRef.current) {
      imgRef.current.onload = null;
      imgRef.current.onerror = null;
    }
  }, []);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      cleanupCropEditor();
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [cleanupCropEditor]);

  // Handle keyboard events for crop editor
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (editingImage && event.key === 'Escape') {
        cleanupCropEditor();
      }
    };

    if (editingImage) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [editingImage, cleanupCropEditor]);

  // Sync local content with portfolio data when not editing
  useEffect(() => {
    if (!isEditingText && portfolioData?.content) {
      setLocalContent(portfolioData.content);
    }
  }, [portfolioData?.content, isEditingText]);

  // Notify parent when editing state changes
  useEffect(() => {
    if (onEditingStateChange) {
      const isCurrentlyEditing = Boolean(isEditingText || isEditingSkills || isEditingImage);
      onEditingStateChange(isCurrentlyEditing);
    }
  }, [isEditingText, isEditingSkills, isEditingImage, onEditingStateChange]);

  // Sync local content with portfolio data when not editing - COMPLETELY BLOCK DURING EDITING
  useEffect(() => {
    // NEVER sync from external data when actively editing - this prevents the editing from closing
    if (!isActivelyEditingRef.current && !isEditingText && !isEditingSkills && !isEditingImage && portfolioData?.content) {
      setLocalContent(portfolioData.content);
    }
  }, [portfolioData?.content, isEditingText, isEditingSkills, isEditingImage]);

  // Handle clicking outside to stop editing
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isEditingText) {
        // Check if the click is outside any editing input/textarea
        const isClickingOnInput = event.target.closest('input, textarea');
        const isClickingOnEditingArea = event.target.closest('[data-editing-container]');
        
        if (!isClickingOnInput && !isClickingOnEditingArea) {
          // Sync current content before closing
          const [sectionId, fieldId] = isEditingText.split('-');
          
          // Get the current value from local content (where live editing happens)
          const currentValue = localContent[sectionId]?.[fieldId];
          
          // Clear any pending debounced sync since we're doing immediate sync
          if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
            debounceTimeoutRef.current = null;
          }
          
          // Force immediate sync to parent when closing
          if (onContentChange && currentValue !== undefined) {
            if (typeof onContentChange === 'function') {
              onContentChange(sectionId, fieldId, currentValue);
            } else if (typeof onContentChange.onChange === 'function') {
              onContentChange.onChange(sectionId, fieldId, currentValue);
            }
          }
          
          setIsEditingText(null);
          editingStateRef.current = null;
          isActivelyEditingRef.current = false;
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditingText, onContentChange]);

  // Debounced function to sync with parent - ONLY when not editing
  const debouncedSync = useCallback((sectionId, fieldId, value) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      // Only sync with parent if not currently editing any text
      if (!isEditingText && onContentChange) {
        if (typeof onContentChange === 'function') {
          onContentChange(sectionId, fieldId, value);
        } else if (typeof onContentChange.onChange === 'function') {
          onContentChange.onChange(sectionId, fieldId, value);
        }
      }
    }, 300); // Debounce for 300ms
  }, [onContentChange, isEditingText]);

  // Handle nested content change for projects
  const handleNestedContentChange = (sectionId, fieldId, index, subFieldId, value) => {
    const currentContent = getContent(sectionId);

    if (!currentContent || !currentContent[fieldId]) {
      console.error('No content found for section/field:', sectionId, fieldId);
      return;
    }

    const originalArray = Array.isArray(currentContent[fieldId]) ? currentContent[fieldId] : [];
    const updatedArray = [...originalArray];
    const existingItem = updatedArray[index] || {};
    
    // Handle deeply nested paths like "tags.0"
    if (subFieldId.includes('.')) {
      const [parentField, childIndex] = subFieldId.split('.');
      const parentArray = Array.isArray(existingItem[parentField]) ? existingItem[parentField] : [];
      const updatedParentArray = [...parentArray];
      updatedParentArray[parseInt(childIndex)] = value;
      updatedArray[index] = { ...existingItem, [parentField]: updatedParentArray };
    } else {
      updatedArray[index] = { ...existingItem, [subFieldId]: value };
    }

    handleTextEdit(sectionId, fieldId, updatedArray);
  };

  // Handle text editing with local state and debounced sync
  const handleTextEdit = useCallback((sectionId, fieldId, value) => {
    
    // Update local content immediately for responsive UI
    setLocalContent(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [fieldId]: value,
      },
    }));
    
    // Debounce the sync to parent component
    debouncedSync(sectionId, fieldId, value);
  }, [debouncedSync]);

  // Handle entering edit mode for text
  const handleTextClick = (sectionId, fieldId) => {
    if (isEditing) {
      const editKey = `${sectionId}-${fieldId}`;
      setIsEditingText(editKey);
      editingStateRef.current = editKey;
      isActivelyEditingRef.current = true; // Mark as actively editing
    }
  };

  // Handle exiting edit mode
  const handleTextBlur = () => {
    // Immediately sync any pending changes
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }
    
    // Note: We now handle closing via click-outside instead of blur
    // This function is kept for manual closing via Escape key
  };

  // Handle key press for exiting edit mode - Escape and Enter keys close editing
  const handleKeyPress = (e, sectionId, fieldId) => {
    if (e.key === 'Escape') {
      // Get the current value from local content (where live editing happens)
      const currentValue = localContent[sectionId]?.[fieldId];
      
      // Clear any pending debounced sync since we're doing immediate sync
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }
      
      // Force immediate sync to parent when closing
      if (onContentChange && currentValue !== undefined) {
        if (typeof onContentChange === 'function') {
          onContentChange(sectionId, fieldId, currentValue);
        } else if (typeof onContentChange.onChange === 'function') {
          onContentChange.onChange(sectionId, fieldId, currentValue);
        }
      }
      
      setIsEditingText(null);
      editingStateRef.current = null;
      isActivelyEditingRef.current = false; // Clear editing flag
    } else if (e.key === 'Enter') {
      // For single-line inputs (not textarea), Enter should save and exit
      const isTextarea = e.target.tagName.toLowerCase() === 'textarea';
      
      if (!isTextarea && !e.shiftKey) {
        e.preventDefault(); // Prevent form submission or other default behavior
        
        // Get the current value from local content
        const currentValue = localContent[sectionId]?.[fieldId];
        
        // Clear any pending debounced sync since we're doing immediate sync
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
          debounceTimeoutRef.current = null;
        }
        
        // Force immediate sync to parent when closing
        if (onContentChange && currentValue !== undefined) {
          if (typeof onContentChange === 'function') {
            onContentChange(sectionId, fieldId, currentValue);
          } else if (typeof onContentChange.onChange === 'function') {
            onContentChange.onChange(sectionId, fieldId, currentValue);
          }
        }
        
        setIsEditingText(null);
        editingStateRef.current = null;
        isActivelyEditingRef.current = false; // Clear editing flag
      }
      // For textarea or Shift+Enter, allow normal Enter behavior (new line)
    }
  };

  // Render editable text with smart sizing based on content type
  const renderEditableText = (content, sectionId, fieldId, className = '', tag = 'div') => {
    const isCurrentlyEditing = isEditingText === `${sectionId}-${fieldId}`;
    const Component = tag;
    const currentValue = content || '';
    const refKey = `${sectionId}-${fieldId}`;

    if (isEditing && isCurrentlyEditing) {
      const isTitle = fieldId.includes('title') || fieldId.includes('name') || fieldId === 'heading';
      const isDescription = fieldId.includes('description') || fieldId === 'bio' || fieldId === 'content' || fieldId.includes('summary');
      const isShortText = fieldId.includes('subtitle') || fieldId.includes('position') || fieldId.includes('company') || fieldId.includes('role');
      
      const shouldUseTextarea = isDescription || currentValue.length > 100 || currentValue.includes('\n');
      
      let rows = 3;
      if (isDescription) {
        rows = Math.min(Math.max(currentValue.split('\n').length + 1, 5), 10);
      }

      return (
        <div className="relative group" data-editing-container>
          <div className="bg-white border border-gray-300 rounded-lg p-1 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-200">
            {shouldUseTextarea ? (
              <textarea
                ref={(el) => {
                  if (el && inputRefs.current[refKey] !== el) {
                    inputRefs.current[refKey] = el;
                    // Auto-focus when editing starts
                    setTimeout(() => el.focus(), 0);
                  }
                }}
                value={currentValue}
                onChange={(e) => handleTextEdit(sectionId, fieldId, e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, sectionId, fieldId)}
                className={`${className} w-full bg-transparent border-none outline-none resize-none px-3 py-2`}
                rows={rows}
                placeholder="Enter your text here..."
                style={{ 
                  minHeight: isDescription ? '120px' : '80px',
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                  lineHeight: '1.5'
                }}
              />
            ) : (
              <input
                type="text"
                ref={(el) => {
                  if (el && inputRefs.current[refKey] !== el) {
                    inputRefs.current[refKey] = el;
                    // Auto-focus when editing starts
                    setTimeout(() => el.focus(), 0);
                  }
                }}
                value={currentValue}
                onChange={(e) => handleTextEdit(sectionId, fieldId, e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, sectionId, fieldId)}
                className={`${className} w-full bg-transparent border-none outline-none px-3 py-2`}
                placeholder="Enter your text here..."
                style={{ 
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                  lineHeight: 'inherit',
                  minHeight: isTitle ? '40px' : '36px'
                }}
              />
            )}
          </div>
          
          <div className="absolute -bottom-14 left-0 right-0 text-center z-[9999]">
            <div className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm shadow-xl border border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Press <kbd className="bg-blue-500 px-1 py-0.5 rounded text-xs">Enter</kbd> or <kbd className="bg-blue-500 px-1 py-0.5 rounded text-xs">Esc</kbd> to save
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-blue-600"></div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <Component
        className={`${className} ${isEditing ? 'cursor-text hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors relative group' : ''}`}
        onClick={() => handleTextClick(sectionId, fieldId)}
        title={isEditing ? 'Click to edit' : ''}
      >
        {currentValue || (isEditing ? 'Click to edit...' : '')}
        {isEditing && (
          <span className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-[9999] shadow-xl border border-blue-500">
            Click to edit
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-600"></div>
          </span>
        )}
      </Component>
    );
  };

  // Get the current content (either from localContent during editing, portfolioData, or template defaults)
  const getContent = (sectionId) => {
    if (!template?.defaultContent) {
      console.warn('Template or defaultContent is missing:', template);
      return {};
    }
    
    // Use local content if we have it and we're editing, otherwise fall back to portfolio data
    const contentSource = (Object.keys(localContent).length > 0 ? localContent : portfolioData?.content) || {};
    const content = contentSource[sectionId] || template.defaultContent[sectionId];
    
    return content || {};
  };

  // Get the image source for the currently editing image
  const getEditingImageSrc = () => {
    if (!editingImage) return null;
    
    const [sectionId, fieldId] = editingImage.split('-');
    
    if (fieldId.includes('.')) {
      // Handle nested field IDs like "projects.0.image"
      const [mainField, index, subField] = fieldId.split('.');
      const sectionContent = getContent(sectionId);
      const items = sectionContent[mainField];
      if (Array.isArray(items) && items[parseInt(index)]) {
        return items[parseInt(index)][subField];
      }
    } else {
      // Handle direct field IDs
      return getContent(sectionId)[fieldId];
    }
    
    return null;
  };

  // Early return if template is missing
  if (!template) {
    console.error('Template is required but missing');
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">Template not found</p>
          <p className="text-sm">Please select a template to continue</p>
        </div>
      </div>
    );
  }

  // Get the current styling
  const getStyles = () => {
    const styling = portfolioData?.styling || template.styling || {};
    
    return {
      colors: {
        primary: '#1f2937',
        secondary: '#6b7280',
        accent: '#3b82f6',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1f2937',
        textSecondary: '#6b7280',
        ...styling.colors
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
        accent: 'Inter',
        ...styling.fonts
      },
      spacing: {
        section: '5rem',
        element: '2rem',
        tight: '1rem',
        ...styling.spacing
      },
      borderRadius: {
        small: '0.375rem',
        medium: '0.5rem',
        large: '0.75rem',
        ...styling.borderRadius
      },
      shadows: {
        small: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        medium: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        large: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        ...styling.shadows
      }
    };
  };

  // Utility function to crop image with CORS handling
  const getCroppedImg = (image, crop) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!crop || crop.width === 0 || crop.height === 0) {
        reject('Invalid crop area');
        return;
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = crop.width * scaleX;
      canvas.height = crop.height * scaleY;

      // Create a new image with CORS handling
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          ctx.drawImage(
            img,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            canvas.width,
            canvas.height
          );

          canvas.toBlob((blob) => {
            if (!blob) {
              reject('Canvas is empty');
              return;
            }
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          }, 'image/jpeg', 0.95);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => reject('Failed to load image');
      img.src = image.src;
    });
  };

  // Enhanced image editor with cropping capabilities
  const renderEditableImage = (imageSrc, sectionId, fieldId, className = '', placeholder = "Click to upload image") => {
    const imageKey = `${sectionId}-${fieldId}`;
    
    // Get or create ref for this specific image input
    if (!fileInputRefs.current[imageKey]) {
      fileInputRefs.current[imageKey] = React.createRef();
    }
    const fileInputRef = fileInputRefs.current[imageKey];
    
    const isUploading = uploadingImages.has(imageKey);
    const hasImage = imageSrc && typeof imageSrc === 'string' && imageSrc.trim() !== '';
    
    // Debug log for hero section
    if (sectionId === 'hero') {
      console.log('Hero renderEditableImage - imageSrc:', imageSrc, 'hasImage:', hasImage);
    }

    const handleFileUpload = async (file) => {
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      try {
        setUploadingImages(prev => new Set([...prev, imageKey]));
        setImageProcessing(prev => new Set([...prev, imageKey]));
        
        let imageUrl;
        
        try {
          // Try uploading to Cloudinary first
          imageUrl = await cloudinaryApi.uploadImage(file);
        } catch (uploadError) {
          console.warn('Cloudinary upload failed, using data URL fallback:', uploadError);
          
          // Fallback to data URL
          const reader = new FileReader();
          imageUrl = await new Promise((resolve, reject) => {
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        }
        
        // Call the content change handler
        if (fieldId.includes('.')) {
          const [mainField, index, subField] = fieldId.split('.');
          handleNestedContentChange(sectionId, mainField, parseInt(index), subField, imageUrl);
        } else {
          handleTextEdit(sectionId, fieldId, imageUrl);
        }
        
        setUploadingImages(prev => {
          const newSet = new Set(prev);
          newSet.delete(imageKey);
          return newSet;
        });
        setImageProcessing(prev => {
          const newSet = new Set(prev);
          newSet.delete(imageKey);
          return newSet;
        });
      } catch (error) {
        console.error('Upload failed:', error);
        alert('Failed to upload image');
        setUploadingImages(prev => {
          const newSet = new Set(prev);
          newSet.delete(imageKey);
          return newSet;
        });
        setImageProcessing(prev => {
          const newSet = new Set(prev);
          newSet.delete(imageKey);
          return newSet;
        });
      }
    };

    const openFileDialog = () => {
      if (isEditing && fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    const handleDelete = () => {
      onContentChange(sectionId, fieldId, '');
      setEditingImage(null);
      setShowImageEditor(false);
    };

    const handleEditImage = () => {
      setEditingImage(imageKey);
      setCropImageLoaded(false); // Reset loading state
      // Set initial crop using percentage for immediate visibility
      setCrop({ 
        unit: '%',
        width: 70,
        height: 70,
        x: 15,
        y: 15
      });
      setShowImageEditor(true);
    };

    // Show full-screen crop editor is now at component level - removed from here
    
    return (
      <div
        className={`${className} relative overflow-hidden group ${
          isEditing && !hasImage ? 'cursor-pointer hover:opacity-90' : ''
        } ${!hasImage ? 'flex items-center justify-center' : ''}`}
        onClick={!hasImage && isEditing ? openFileDialog : undefined}
        style={{
          backgroundColor: !hasImage ? '#f3f4f6' : 'transparent',
          border: !hasImage ? '2px dashed #9ca3af' : 'none',
          minHeight: !hasImage ? '150px' : 'auto'
        }}
      >
        {isEditing && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            className="hidden"
          />
        )}
        
        {hasImage ? (
          <>
            <img 
              src={imageSrc}
              alt=""
              className="w-full h-full object-cover transition-all duration-200 group-hover:brightness-75"
              style={{ display: 'block' }}
            />
            {isEditing && (
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                <button 
                  onClick={handleEditImage}
                  className="bg-blue-600 bg-opacity-95 text-white p-2 rounded-full text-xs hover:bg-opacity-100 transition-all shadow-lg hover:scale-105 min-w-[32px] min-h-[32px] flex items-center justify-center"
                  title="Crop Image"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </button>
                <button 
                  onClick={openFileDialog}
                  className="bg-green-600 bg-opacity-95 text-white p-2 rounded-full text-xs hover:bg-opacity-100 transition-all shadow-lg hover:scale-105 min-w-[32px] min-h-[32px] flex items-center justify-center"
                  title="Replace Image"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                <button 
                  onClick={handleDelete}
                  className="bg-red-600 bg-opacity-95 text-white p-2 rounded-full text-xs hover:bg-opacity-100 transition-all shadow-lg hover:scale-105 min-w-[32px] min-h-[32px] flex items-center justify-center"
                  title="Delete Image"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-600 p-4">
            <span className="text-sm">{isEditing ? placeholder : 'No image'}</span>
          </div>
        )}
        
        {(isUploading || imageProcessing.has(imageKey)) && (
          <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2 p-4">
              <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <div className="text-sm text-gray-700 font-medium">
                {imageProcessing.has(imageKey) ? 'Processing image...' : 'Uploading image...'}
              </div>
              <div className="text-xs text-gray-500">Please wait</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render editable skills with better error handling
  const renderEditableSkills = (skills, sectionId, fieldId) => {
    const skillsArray = Array.isArray(skills) ? skills : (skills ? [skills] : []);
    
    if (isEditing && isEditingSkills) {
      return (
        <div className="space-y-4 bg-white border-2 border-blue-500 rounded-lg p-4 shadow-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Edit Skills
            </label>
            <textarea
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="Enter skills separated by commas (e.g., React, JavaScript, UI Design, Figma, Adobe Creative Suite)"
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-4 outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              rows={5}
              autoFocus
              style={{ minHeight: '120px', fontSize: '14px', lineHeight: '1.5' }}
            />
            <p className="text-xs text-gray-500 mt-2">💡 Tip: Separate each skill with a comma</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                const newSkills = skillsInput.split(',').map(s => s.trim()).filter(s => s.length > 0);
                handleTextEdit(sectionId, fieldId, newSkills);
                setIsEditingSkills(false);
                setSkillsInput('');
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Save Skills
            </button>
            <button
              onClick={() => {
                setIsEditingSkills(false);
                setSkillsInput('');
              }}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    const styles = getStyles(); // Make sure styles is available here

    return (
      <div className="flex flex-wrap gap-3">
        {skillsArray.map((skill, index) => (
          <span
            key={index}
            className={`px-4 py-2 rounded-full text-sm font-medium ${isEditing ? 'cursor-pointer hover:opacity-80 transition-opacity border-2 border-transparent hover:border-blue-300' : ''}`}
            style={{ 
              backgroundColor: styles.colors.accent,
              color: 'white'
            }}
            onClick={() => {
              if (isEditing) {
                setSkillsInput(skillsArray.join(', '));
                setIsEditingSkills(true);
              }
            }}
            title={isEditing ? 'Click to edit skills' : ''}
          >
            {skill}
          </span>
        ))}
        {isEditing && (
          <button
            onClick={() => {
              setSkillsInput(skillsArray.join(', '));
              setIsEditingSkills(true);
            }}
            className="px-4 py-2 border-2 border-dashed border-gray-400 rounded-full text-sm text-gray-600 hover:border-gray-500 hover:text-gray-700 transition-all duration-200 flex items-center space-x-1 hover:bg-gray-50"
          >
            <span>+</span>
            <span>Edit Skills</span>
          </button>
        )}
      </div>
    );
  };

  // Render editable project field
  const renderEditableProjectField = (content, sectionId, fieldId, index, subFieldId, className = '', tag = 'div') => {
    const isCurrentlyEditing = isEditingText === `${sectionId}-${fieldId}-${index}-${subFieldId}`;
    const Component = tag;
    const currentValue = content || '';

    if (isEditing && isCurrentlyEditing) {
      const isLongContent = subFieldId === 'description';
      
      return (
        <div className="relative group">
          <div className="bg-white border border-gray-300 rounded-lg p-1 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-200">
            {isLongContent ? (
              <textarea
                value={currentValue}
                onChange={(e) => handleNestedContentChange(sectionId, fieldId, index, subFieldId, e.target.value)}
                onBlur={() => setIsEditingText(null)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    setIsEditingText(null);
                  }
                  if (e.key === 'Escape') {
                    setIsEditingText(null);
                  }
                }}
                className={`${className} w-full bg-transparent border-none outline-none resize-none px-3 py-2`}
                autoFocus
                rows={3}
                placeholder="Enter project description..."
                style={{ 
                  minHeight: '80px',
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                  lineHeight: '1.5'
                }}
              />
            ) : (
              <input
                type="text"
                value={currentValue}
                onChange={(e) => handleNestedContentChange(sectionId, fieldId, index, subFieldId, e.target.value)}
                onBlur={() => setIsEditingText(null)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    setIsEditingText(null);
                  }
                  if (e.key === 'Escape') {
                    setIsEditingText(null);
                  }
                }}
                className={`${className} w-full bg-transparent border-none outline-none px-3 py-2`}
                autoFocus
                placeholder="Enter project title..."
                style={{ 
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                  lineHeight: 'inherit',
                  minHeight: '40px'
                }}
              />
            )}
          </div>
        </div>
      );
    }

    return (
      <Component
        className={`${className} ${isEditing ? 'cursor-text hover:bg-gray-50 rounded px-2 py-1 transition-colors relative group border border-transparent hover:border-blue-300' : ''}`}
        onClick={() => {
          if (isEditing) {
            setIsEditingText(`${sectionId}-${fieldId}-${index}-${subFieldId}`);
          }
        }}
        title={isEditing ? 'Click to edit' : ''}
      >
        {currentValue || (isEditing ? 'Click to edit...' : '')}
      </Component>
    );
  };

  const styles = getStyles();

  return (
    <div className="w-full bg-white" style={{ fontFamily: styles.fonts.body }}>
      {/* Global Image Crop Editor */}
      {editingImage && getEditingImageSrc() && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4" style={{ zIndex: 99999 }}>
          <div className="relative bg-white rounded-lg shadow-2xl max-w-5xl max-h-[90vh] flex flex-col">
            {/* Loading overlay for image */}
            {!cropImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-white bg-opacity-95 rounded-lg">
                <div className="flex flex-col items-center gap-2">
                  <svg className="animate-spin h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <div className="text-gray-600 text-sm">Loading image editor...</div>
                </div>
              </div>
            )}
            
            {/* Image cropping area */}
            <div className="p-6 flex justify-center items-center">
              <ReactCrop
                crop={crop}
                onChange={setCrop}
                onComplete={setCompletedCrop}
                minWidth={50}
                minHeight={50}
                keepSelection={true}
                ruleOfThirds={true}
                aspect={undefined} // Allow free-form cropping
              >
                <img
                  ref={imgRef}
                  src={getEditingImageSrc()}
                  alt="Crop"
                  style={{ 
                    maxWidth: '80vw',
                    maxHeight: '60vh',
                    width: 'auto',
                    height: 'auto'
                  }}
                  crossOrigin="anonymous"
                  onLoad={() => {
                    setCropImageLoaded(true);
                    // Keep the percentage-based crop that was set in handleEditImage
                    // This ensures immediate visibility without recalculation
                  }}
              />
            </ReactCrop>
            </div>
            
            {/* Control buttons */}
            <div className="flex justify-center gap-4 p-4 bg-gray-50 rounded-b-lg border-t">
              <button
                onClick={() => {
                  cleanupCropEditor();
                }}
                className="px-6 py-2 bg-gray-500 text-white text-sm font-medium rounded-lg hover:bg-gray-600 transition-colors"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    setCropLoading(true);
                    
                    if (completedCrop && imgRef.current) {
                      
                      // Try cropping the image
                      let croppedImage;
                      try {
                        croppedImage = await getCroppedImg(imgRef.current, completedCrop);
                        
                        // Upload cropped image to Cloudinary
                        if (croppedImage) {
                          try {
                            const cloudinaryUrl = await cloudinaryApi.uploadImage(croppedImage);
                            croppedImage = cloudinaryUrl;
                          } catch (uploadError) {
                            console.warn('Cloudinary upload failed, using data URL:', uploadError);
                            // Continue with data URL as fallback
                          }
                        }
                        
                      } catch (corsError) {
                        console.warn('CORS cropping failed, trying fallback method:', corsError);
                        
                        // Fallback: If CORS fails, just return the original image
                        // In a real app, you'd want to handle this server-side
                        toast.warning('Image cropping not available due to security restrictions. Using original image.');
                        croppedImage = getEditingImageSrc();
                      }
                      
                      if (croppedImage) {
                        
                        // Use the same logic as file upload to handle nested fields
                        const [sectionId, fieldId] = editingImage.split('-');
                        
                        if (fieldId.includes('.')) {
                          const [mainField, index, subField] = fieldId.split('.');
                          handleNestedContentChange(sectionId, mainField, parseInt(index), subField, croppedImage);
                        } else {
                          handleTextEdit(sectionId, fieldId, croppedImage);
                        }
                        
                        cleanupCropEditor();
                        
                        // Show success message
                        toast.success('Image cropped successfully!');
                      } else {
                        console.error('No cropped image was generated');
                        toast.error('Failed to generate cropped image');
                      }
                    } else {
                      console.error('Missing required data for crop:', {
                        completedCrop: !!completedCrop,
                        imgRef: !!imgRef.current
                      });
                    }
                  } catch (error) {
                    console.error('Crop operation failed:', error);
                    toast.error('Failed to crop image');
                  } finally {
                    setCropLoading(false);
                  }
                }}
                disabled={cropLoading}
                className={`px-8 py-3 text-white text-base font-bold rounded-lg transition-all shadow-xl cursor-pointer flex items-center gap-2 border-2 hover:scale-105 ${
                  cropLoading 
                    ? 'bg-blue-400 border-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700'
                }`}
                type="button"
              >
                {cropLoading && (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {cropLoading ? 'Processing...' : 'Save Crop'}
              </button>
            </div>
          </div>
          
          {/* Updated crop styling */}
          <style jsx global>{`
            /* Remove conflicting ReactCrop styles and use default behavior */
            .ReactCrop {
              position: relative;
              display: inline-block;
            }
            .ReactCrop__crop-selection {
              border: 2px solid #ffffff !important;
              box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5) !important;
            }
            .ReactCrop__drag-handle {
              width: 12px !important;
              height: 12px !important;
              background-color: #ffffff !important;
              border: 2px solid #3b82f6 !important;
              border-radius: 50% !important;
            }
            .ReactCrop__rule-of-thirds-vt,
            .ReactCrop__rule-of-thirds-hz {
              border-color: rgba(255, 255, 255, 0.7) !important;
            }
            .ReactCrop__crop-selection {
              cursor: move !important;
            }
          `}</style>
        </div>
      )}

      {/* Hero Section */}
      <section 
        data-section-id="hero"
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: styles.colors.background }}
        onMouseEnter={() => isEditing && setActiveSection('hero')}
        onMouseLeave={() => isEditing && setActiveSection(null)}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -top-4 -right-4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        {isEditing && activeSection === 'hero' && (
          <div className="absolute top-4 right-4 bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm z-10">
            Hero Section
          </div>
        )}
        
        <div className="text-center max-w-5xl mx-auto px-6 relative z-10">
          <div className="mb-8">
            {(() => {
              const heroContent = getContent('hero');
              const imageUrl = heroContent.image;
              
              return (
                <div className="relative inline-block mb-8">
                  {renderEditableImage(
                    imageUrl,
                    'hero',
                    'image',
                    'w-40 h-40 rounded-full mx-auto ring-4 ring-white shadow-2xl',
                    'Upload profile picture'
                  )}
                  {/* Decorative rings - with pointer-events-none to allow clicks through */}
                  <div className="absolute -inset-4 rounded-full border-2 border-blue-200 opacity-30 animate-ping pointer-events-none"></div>
                  <div className="absolute -inset-8 rounded-full border border-purple-200 opacity-20 animate-pulse pointer-events-none"></div>
                </div>
              );
            })()}
            
            {renderEditableText(
              getContent('hero').name,
              'hero',
              'name',
              `text-6xl lg:text-7xl font-bold mb-6 text-black`,
              'h1'
            )}
            
            {renderEditableText(
              getContent('hero').title,
              'hero',
              'title',
              `text-2xl lg:text-3xl mb-8 text-gray-600 font-light`,
              'h2'
            )}
            
            {renderEditableText(
              getContent('hero').description,
              'hero',
              'description',
              `text-xl max-w-3xl mx-auto leading-relaxed text-gray-700 mb-12`,
              'p'
            )}
            
            {/* Simple text instead of buttons */}
            <div className="text-center">
              <p className="text-lg text-gray-600 font-medium">Scroll to see my work</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section 
        data-section-id="about"
        className="py-20 relative"
        style={{ backgroundColor: styles.colors.surface }}
        onMouseEnter={() => isEditing && setActiveSection('about')}
        onMouseLeave={() => isEditing && setActiveSection(null)}
      >
        {isEditing && activeSection === 'about' && (
          <div className="absolute top-4 right-4 bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm z-10">
            About Section
          </div>
        )}
        
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              {renderEditableText(
                getContent('about').heading,
                'about',
                'heading',
                `text-4xl font-bold mb-6`,
                'h2'
              )}
              
              {renderEditableText(
                getContent('about').content,
                'about',
                'content',
                `text-lg leading-relaxed mb-8`,
                'p'
              )}
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Skills</h3>
                {renderEditableSkills(getContent('about').skills || [], 'about', 'skills')}
              </div>
            </div>
            
            <div>
              {renderEditableImage(
                getContent('about').image,
                'about',
                'image',
                'aspect-square rounded-lg',
                'Upload about image'
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section 
        data-section-id="portfolio"
        className="py-20 relative"
        onMouseEnter={() => isEditing && setActiveSection('portfolio')}
        onMouseLeave={() => isEditing && setActiveSection(null)}
      >
        {isEditing && activeSection === 'portfolio' && (
          <div className="absolute top-4 right-4 bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm z-10">
            Portfolio Section
          </div>
        )}
        
          <div className="max-w-7xl mx-auto px-6">
            {renderEditableText(
              getContent('portfolio').heading,
              'portfolio',
              'heading',
              `text-5xl font-bold text-center mb-16`,
              'h2'
            )}
            
            {/* Enhanced Visual Portfolio Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {getContent('portfolio').projects.map((project, index) => {
                // Create different sizes for visual variety
                const isLarge = index === 0 || (index + 1) % 4 === 0;
                const isMedium = (index + 1) % 3 === 0;
                
                return (
                  <div
                    key={project.id}
                    className={`bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden ${
                      isLarge ? 'md:col-span-2 md:row-span-2' : 
                      isMedium ? 'md:row-span-2' : ''
                    }`}
                  >
                    {/* Large Image Container */}
                    <div className={`relative overflow-hidden ${
                      isLarge ? 'aspect-[4/3]' : 
                      isMedium ? 'aspect-[3/4]' : 'aspect-[4/3]'
                    }`}>
                      {renderEditableImage(
                        project.image,
                        'portfolio',
                        `projects.${index}.image`,
                        'w-full h-full object-cover',
                        'Upload project image'
                      )}
                    </div>
                    
                    {/* Content Section */}
                    <div className="p-6">
                      {renderEditableProjectField(
                        project.title,
                        'portfolio',
                        'projects',
                        index,
                        'title',
                        `text-2xl font-bold mb-2 text-gray-900 ${isLarge ? 'lg:text-3xl' : ''}`,
                        'h3'
                      )}
                      {renderEditableProjectField(
                        project.description,
                        'portfolio',
                        'projects',
                        index,
                        'description',
                        'text-gray-600 mb-4',
                        'p'
                      )}
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700"
                          >
                            {renderEditableProjectField(
                              tag,
                              'portfolio',
                              'projects',
                              index,
                              `tags.${tagIndex}`,
                              'inline-block',
                              'span'
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Portfolio Statistics */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm">
                {renderEditableText(
                  getContent('portfolio').projects.length,
                  'portfolio',
                  'projectsCount',
                  'text-3xl font-bold text-gray-900'
                )}
                {renderEditableText(
                  'Projects',
                  'portfolio',
                  'projectsLabel',
                  'text-sm text-gray-600 mt-1'
                )}
              </div>
              <div className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm">
                {renderEditableText(
                  getContent('portfolio').projects.reduce((total, project) => total + (project.tags?.length || 0), 0),
                  'portfolio',
                  'technologiesCount',
                  'text-3xl font-bold text-gray-900'
                )}
                {renderEditableText(
                  'Technologies',
                  'portfolio',
                  'technologiesLabel',
                  'text-sm text-gray-600 mt-1'
                )}
              </div>
              <div className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm">
                {renderEditableText(
                  getContent('portfolio').successRate || '100%',
                  'portfolio',
                  'successRate',
                  'text-3xl font-bold text-gray-900'
                )}
                {renderEditableText(
                  'Success Rate',
                  'portfolio',
                  'successRateLabel',
                  'text-sm text-gray-600 mt-1'
                )}
              </div>
              <div className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm">
                {renderEditableText(
                  getContent('portfolio').support || '24/7',
                  'portfolio',
                  'support',
                  'text-3xl font-bold text-gray-900'
                )}
                {renderEditableText(
                  'Support',
                  'portfolio',
                  'supportLabel',
                  'text-sm text-gray-600 mt-1'
                )}
              </div>
            </div>
          </div>
      </section>

      {/* Contact Section */}
      {getContent('contact') && (
        <section 
          data-section-id="contact"
          className="py-20 relative"
          style={{ backgroundColor: styles.colors.surface }}
          onMouseEnter={() => isEditing && setActiveSection('contact')}
          onMouseLeave={() => isEditing && setActiveSection(null)}
        >
        {isEditing && activeSection === 'contact' && (
          <div className="absolute top-4 right-4 bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm z-10">
            Contact Section
          </div>
        )}
        
        <div className="max-w-4xl mx-auto px-6 text-center">
          {renderEditableText(
            getContent('contact').heading,
            'contact',
            'heading',
            `text-4xl font-bold mb-6`,
            'h2'
          )}
          
          {renderEditableText(
            getContent('contact').description,
            'contact',
            'description',
            `text-lg mb-12`,
            'p'
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(getContent('contact').social_links || []).map((link, index) => (
              <a
                key={index}
                href={link.url}
                className="block p-6 bg-white rounded-lg hover:shadow-lg transition-shadow"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="text-2xl font-semibold capitalize">{link.platform}</div>
                <div className="text-gray-600 mt-2">Connect with me</div>
              </a>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Dynamic Sections - render any additional sections that were added */}
      {portfolioData?.content && Object.entries(portfolioData.content)
        .filter(([sectionId]) => !['hero', 'about', 'portfolio', 'contact'].includes(sectionId))
        .map(([sectionId, sectionData]) => (
          <section
            key={sectionId}
            data-section-id={sectionId}
            className="py-20 relative"
            style={{ backgroundColor: styles.colors.surface }}
            onMouseEnter={() => isEditing && setActiveSection(sectionId)}
            onMouseLeave={() => isEditing && setActiveSection(null)}
          >
            {isEditing && activeSection === sectionId && (
              <div className="absolute top-4 right-4 bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm z-10">
                {sectionId.charAt(0).toUpperCase() + sectionId.slice(1)} Section
              </div>
            )}
            
            <div className="max-w-6xl mx-auto px-6">
              {/* Section Title */}
              {renderEditableText(
                sectionData.title,
                sectionId,
                'title',
                'text-4xl font-bold text-center mb-12',
                'h2'
              )}
              
              {/* Section Content */}
              {sectionData.content && renderEditableText(
                sectionData.content,
                sectionId,
                'content',
                'text-lg leading-relaxed text-center max-w-3xl mx-auto mb-8',
                'p'
              )}
              
              {/* Section Items (for lists like experience, education, etc.) */}
              {sectionData.items && Array.isArray(sectionData.items) && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {sectionData.items.map((item, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                      {item.name && renderEditableText(
                        item.name,
                        sectionId,
                        `items.${index}.name`,
                        'text-xl font-semibold mb-2',
                        'h3'
                      )}
                      {item.title && renderEditableText(
                        item.title,
                        sectionId,
                        `items.${index}.title`,
                        'text-xl font-semibold mb-2',
                        'h3'
                      )}
                      {item.company && renderEditableText(
                        item.company,
                        sectionId,
                        `items.${index}.company`,
                        'text-lg font-medium text-blue-600 mb-1',
                        'div'
                      )}
                      {item.institution && renderEditableText(
                        item.institution,
                        sectionId,
                        `items.${index}.institution`,
                        'text-lg font-medium text-blue-600 mb-1',
                        'div'
                      )}
                      {item.position && renderEditableText(
                        item.position,
                        sectionId,
                        `items.${index}.position`,
                        'text-gray-600 mb-1',
                        'div'
                      )}
                      {item.degree && renderEditableText(
                        item.degree,
                        sectionId,
                        `items.${index}.degree`,
                        'text-gray-600 mb-1',
                        'div'
                      )}
                      {item.duration && renderEditableText(
                        item.duration,
                        sectionId,
                        `items.${index}.duration`,
                        'text-sm text-gray-500 mb-2',
                        'div'
                      )}
                      {item.description && renderEditableText(
                        item.description,
                        sectionId,
                        `items.${index}.description`,
                        'text-gray-700 text-sm',
                        'p'
                      )}
                      {item.image && renderEditableImage(
                        item.image,
                        sectionId,
                        `items.${index}.image`,
                        'w-full h-48 object-cover rounded mb-4',
                        'Upload image'
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Section Image */}
              {sectionData.image && renderEditableImage(
                sectionData.image,
                sectionId,
                'image',
                'w-full max-w-md mx-auto rounded-lg mb-8',
                'Upload section image'
              )}
            </div>
          </section>
        ))
      }

      {/* PDF Export Modal */}
      <PDFExport
        portfolioData={portfolioData}
        isVisible={showPDFExport}
        onClose={onClosePDFExport}
      />

    </div>
  );
};

export default TemplatePreview;