import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { uploadImageToCloudinary } from '../../lib/api';

const TemplatePreview = ({ template, portfolioData, isEditing = false, onContentChange, onEditingStateChange }) => {
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
    updatedArray[index] = { ...existingItem, [subFieldId]: value };

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
          imageUrl = await uploadImageToCloudinary(file);
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
      // Set initial crop to center of image with reasonable size
      setCrop({ 
        unit: '%',
        width: 80,
        height: 80,
        x: 10,
        y: 10
      });
    };

    const handleCropComplete = async () => {
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
                const cloudinaryUrl = await uploadImageToCloudinary(croppedImage);
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
            alert('Image cropping failed due to security restrictions. Using original image.');
            croppedImage = imageSrc;
          }
          
          if (croppedImage) {
            
            // Use the same logic as file upload to handle nested fields
            if (fieldId.includes('.')) {
              const [mainField, index, subField] = fieldId.split('.');
              handleNestedContentChange(sectionId, mainField, parseInt(index), subField, croppedImage);
            } else {
              handleTextEdit(sectionId, fieldId, croppedImage);
            }
            
            setEditingImage(null);
            setCrop({ unit: '%', width: 80, height: 80, x: 10, y: 10 });
            setCompletedCrop(null);
          } else {
            console.error('No cropped image was generated');
          }
        } else {
          console.error('Missing required data for crop:', {
            completedCrop: !!completedCrop,
            imgRef: !!imgRef.current
          });
        }
      } catch (error) {
        console.error('Crop process failed:', error);
        alert('Failed to process image. Please try again.');
      } finally {
        setCropLoading(false);
      }
    };

    const handleCancelEdit = () => {
      setEditingImage(null);
      setCrop({ unit: '%', width: 80, height: 80, x: 10, y: 10 });
      setCompletedCrop(null);
      setCropLoading(false);
    };

    // Show full-screen crop overlay (like image editor)
    if (editingImage === imageKey && hasImage) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-screen p-8 flex flex-col items-center">
            {/* Loading overlay for image */}
            {!cropImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="bg-black bg-opacity-50 rounded-lg p-4 flex flex-col items-center gap-2">
                  <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <div className="text-white text-sm">Loading image editor...</div>
                </div>
              </div>
            )}
            
            <ReactCrop
              crop={crop}
              onChange={setCrop}
              onComplete={setCompletedCrop}
              minWidth={50}
              minHeight={50}
              keepSelection={true}
              ruleOfThirds={true}
              className="react-crop-fullscreen"
            >
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Crop"
                className="max-w-full max-h-[70vh] object-contain"
                style={{ display: 'block' }}
                crossOrigin="anonymous"
                onLoad={() => {
                  setCropImageLoaded(true);
                  // Set initial crop when image loads to fit the displayed image better
                  const imgElement = imgRef.current;
                  if (imgElement) {
                    // Wait for the image to be fully rendered
                    setTimeout(() => {
                      const displayWidth = imgElement.offsetWidth;
                      const displayHeight = imgElement.offsetHeight;
                      const naturalWidth = imgElement.naturalWidth;
                      const naturalHeight = imgElement.naturalHeight;
                      
                      // Calculate the crop area as percentage of natural dimensions
                      let cropWidth, cropHeight, cropX, cropY;
                      
                      if (naturalWidth > naturalHeight) {
                        // Landscape image - make crop square based on height
                        cropHeight = naturalHeight * 0.8;
                        cropWidth = cropHeight; // Square crop
                        cropX = (naturalWidth - cropWidth) / 2;
                        cropY = naturalHeight * 0.1; // 10% from top
                      } else {
                        // Portrait or square image - make crop square based on width
                        cropWidth = naturalWidth * 0.8;
                        cropHeight = cropWidth; // Square crop
                        cropX = naturalWidth * 0.1; // 10% from left
                        cropY = (naturalHeight - cropHeight) / 2;
                      }
                      
                      setCrop({
                        unit: 'px',
                        width: cropWidth,
                        height: cropHeight,
                        x: cropX,
                        y: cropY
                      });
                      
                    }, 100);
                  }
                }}
              />
            </ReactCrop>
            
            {/* Control buttons at bottom */}
            <div className="flex justify-center gap-6 mt-8">
              <button
                onClick={handleCancelEdit}
                className="px-10 py-5 bg-white text-black text-lg font-bold rounded-xl hover:bg-gray-100 transition-all shadow-2xl border-4 border-white hover:scale-105 cursor-pointer"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleCropComplete}
                disabled={cropLoading}
                className={`px-10 py-5 text-white text-lg font-bold rounded-xl transition-all shadow-2xl cursor-pointer flex items-center gap-3 border-4 hover:scale-105 ${
                  cropLoading 
                    ? 'bg-blue-500 border-blue-500 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600'
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
          
          {/* Enhanced crop styling */}
          <style jsx global>{`
            .react-crop-fullscreen .ReactCrop__crop-selection {
              border: 2px solid #ffffff !important;
              box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.6) !important;
            }
            .react-crop-fullscreen .ReactCrop__drag-handle {
              width: 16px !important;
              height: 16px !important;
              background-color: #ffffff !important;
              border: 2px solid #3b82f6 !important;
              border-radius: 2px !important;
              cursor: pointer !important;
            }
            .react-crop-fullscreen .ReactCrop__rule-of-thirds-vt,
            .react-crop-fullscreen .ReactCrop__rule-of-thirds-hz {
              border-color: rgba(255, 255, 255, 0.4) !important;
            }
            .react-crop-fullscreen .ReactCrop__crop-selection {
              cursor: move !important;
            }
          `}</style>
        </div>
      );
    }

    return (
      <div
        className={`${className} relative overflow-hidden group ${
          isEditing && !hasImage ? 'cursor-pointer hover:opacity-90' : ''
        }`}
        onClick={!hasImage && isEditing ? openFileDialog : undefined}
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
              className="w-full h-full object-cover"
              style={{ display: 'block' }}
            />
            {isEditing && (
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 bg-black bg-opacity-30">
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
          <div className="w-full h-full flex items-center justify-center bg-gray-200 border-2 border-dashed border-gray-400" style={{ minHeight: '150px' }}>
            <div className="text-center text-gray-600 p-4">
              <span className="text-sm">{isEditing ? placeholder : 'No image'}</span>
            </div>
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
      {/* Hero Section */}
      <section 
        data-section-id="hero"
        className="min-h-screen flex items-center justify-center relative"
        style={{ backgroundColor: styles.colors.background }}
        onMouseEnter={() => isEditing && setActiveSection('hero')}
        onMouseLeave={() => isEditing && setActiveSection(null)}
      >
        {isEditing && activeSection === 'hero' && (
          <div className="absolute top-4 right-4 bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm z-10">
            Hero Section
          </div>
        )}
        
        <div className="text-center max-w-4xl mx-auto px-6">
          <div className="mb-8">
            {(() => {
              const heroContent = getContent('hero');
              const imageUrl = heroContent.image;
              
              return renderEditableImage(
                imageUrl,
                'hero',
                'image',
                'w-32 h-32 rounded-full mx-auto mb-6',
                'Upload profile picture'
              );
            })()}
            
            {renderEditableText(
              getContent('hero').name,
              'hero',
              'name',
              `text-5xl font-bold mb-4`,
              'h1'
            )}
            
            {renderEditableText(
              getContent('hero').title,
              'hero',
              'title',
              `text-2xl mb-6`,
              'h2'
            )}
            
            {renderEditableText(
              getContent('hero').description,
              'hero',
              'description',
              `text-lg max-w-2xl mx-auto leading-relaxed`,
              'p'
            )}
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
        
        <div className="max-w-6xl mx-auto px-6">
          {renderEditableText(
            getContent('portfolio').heading,
            'portfolio',
            'heading',
            `text-4xl font-bold text-center mb-12`,
            'h2'
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getContent('portfolio').projects.map((project, index) => (
              <motion.div
                key={project.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                whileHover={{ y: -5 }}
              >
                {renderEditableImage(
                  project.image,
                  'portfolio',
                  `projects.${index}.image`,
                  'aspect-video',
                  'Upload project image'
                )}
                <div className="p-6">
                  {renderEditableProjectField(
                    project.title,
                    'portfolio',
                    'projects',
                    index,
                    'title',
                    'text-xl font-semibold mb-2',
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
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 text-xs rounded-full"
                        style={{ 
                          backgroundColor: styles.colors.surface,
                          color: styles.colors.text
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
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

    </div>
  );
};

export default TemplatePreview;