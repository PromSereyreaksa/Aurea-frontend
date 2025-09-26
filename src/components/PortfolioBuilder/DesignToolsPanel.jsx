import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable section item component
const SortableSection = ({ sectionId, sectionData, onDelete, onEdit, getSectionIcon }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sectionId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSectionClick = (e) => {
    // Don't trigger navigation if clicking on drag handle or delete button
    if (e.target.closest('[data-drag-handle]') || e.target.closest('[data-delete-button]')) {
      return;
    }
    
    if (onEdit) {
      onEdit(sectionId);
    }
  };

  const getSectionPreview = (data) => {
    // Handle different section types with more intelligent content preview
    if (data?.title && data?.title.trim()) {
      return data.title;
    }
    
    if (data?.name && data?.name.trim()) {
      return data.name;
    }
    
    // For projects section, show project count and first project title
    if (data?.items && Array.isArray(data.items) && data.items.length > 0) {
      const firstProject = data.items[0];
      if (firstProject?.title) {
        return data.items.length === 1 
          ? firstProject.title 
          : `${firstProject.title} (+${data.items.length - 1} more)`;
      }
      return `${data.items.length} item${data.items.length !== 1 ? 's' : ''}`;
    }
    
    // For about section, show bio preview
    if (data?.bio && data.bio.trim()) {
      return data.bio.length > 60 
        ? data.bio.substring(0, 60) + '...' 
        : data.bio;
    }
    
    // For content field
    if (data?.content && data.content.trim()) {
      return data.content.length > 60 
        ? data.content.substring(0, 60) + '...' 
        : data.content;
    }
    
    // For description field
    if (data?.description && data.description.trim()) {
      return data.description.length > 60 
        ? data.description.substring(0, 60) + '...' 
        : data.description;
    }
    
    // For contact section, show email or phone
    if (data?.email && data.email.trim()) {
      return data.email;
    }
    
    if (data?.phone && data.phone.trim()) {
      return data.phone;
    }
    
    // For skills section, show first few skills
    if (data?.skills && Array.isArray(data.skills) && data.skills.length > 0) {
      const skillNames = data.skills
        .map(skill => skill.name || skill)
        .filter(Boolean)
        .slice(0, 3);
      
      if (skillNames.length > 0) {
        return skillNames.length < data.skills.length 
          ? `${skillNames.join(', ')} (+${data.skills.length - skillNames.length} more)`
          : skillNames.join(', ');
      }
    }
    
    // Default fallback
    return 'Click to edit content';
  };

  const getImagePreview = (data) => {
    // Check for image in different section types
    if (data?.image) return data.image;
    if (data?.profileImage) return data.profileImage;
    if (data?.items && Array.isArray(data.items) && data.items.length > 0) {
      const firstItemWithImage = data.items.find(item => item.image);
      if (firstItemWithImage) return firstItemWithImage.image;
    }
    return null;
  };

  const imagePreview = getImagePreview(sectionData);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 md:p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
        isDragging 
          ? 'bg-blue-50 border-blue-300 shadow-lg scale-105 z-50' 
          : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md hover:bg-gray-100'
      }`}
      onClick={handleSectionClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
          {/* Improved drag handle with better visual feedback */}
          <div
            {...attributes}
            {...listeners}
            data-drag-handle
            className={`cursor-grab active:cursor-grabbing p-2 rounded-md transition-all duration-200 flex-shrink-0 touch-manipulation hover:scale-110 ${
              isDragging 
                ? 'bg-blue-200 shadow-md scale-110' 
                : 'hover:bg-gray-200 hover:shadow-sm'
            }`}
            title="Drag to reorder sections"
          >
            <svg 
              className={`w-4 h-4 transition-colors duration-200 ${
                isDragging ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M7 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
            </svg>
          </div>
          
          {/* Section icon with responsive sizing */}
          <div className="text-xl md:text-lg flex-shrink-0 w-7 h-7 md:w-6 md:h-6 flex items-center justify-center">{getSectionIcon(sectionId)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-900 capitalize truncate">
                {sectionId.replace(/([A-Z])/g, ' $1').trim()}
              </h4>
              {imagePreview && (
                <div className="w-10 h-10 md:w-8 md:h-8 rounded bg-gray-100 overflow-hidden flex-shrink-0 ml-2">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}
            </div>
            <p className="text-xs md:text-xs text-gray-600 truncate">
              {getSectionPreview(sectionData)}
            </p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(sectionId);
          }}
          data-delete-button
          className="ml-2 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors flex-shrink-0 touch-manipulation"
          title="Delete section"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const DesignToolsPanel = ({ template, portfolioData, onStyleChange, onContentChange, onCollapseChange }) => {
  const [activeTab, setActiveTab] = useState('sections');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [editingField, setEditingField] = useState(null); // Track which field is being edited
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile menu state

  const currentStyles = portfolioData?.styling || template.styling;

  // Notify parent about initial collapse state
  React.useEffect(() => {
    if (onCollapseChange) {
      onCollapseChange(isCollapsed);
    }
  }, [isCollapsed, onCollapseChange]);

  // Add Ctrl+S save functionality for the design panel
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if Ctrl+S (or Cmd+S on Mac) is pressed
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault(); // Prevent browser's default save action
        
        // Check if we have access to the save function through onContentChange
        if (onContentChange && onContentChange.onSave) {
          import('react-hot-toast').then(({ toast }) => {
            toast.success('Saving from Design Tools... (Ctrl+S)', {
              duration: 1500,
              icon: '🎨',
            });
          });
          onContentChange.onSave();
        }
      }
    };

    // Only add listener if the panel is open and not collapsed
    if (!isCollapsed) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isCollapsed, onContentChange]);

  // Set up sensors for drag and drop with improved touch and mouse support
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Reduced distance for more responsive dragging
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end for section reordering with improved error handling
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!active || !over || active.id === over.id) {
      return; // No change needed
    }

    const sectionOrder = portfolioData?.content ? Object.keys(portfolioData.content) : [];
    
    if (!sectionOrder.includes(active.id) || !sectionOrder.includes(over.id)) {
      console.warn('Invalid drag operation: section not found in content');
      return;
    }

    const oldIndex = sectionOrder.indexOf(active.id);
    const newIndex = sectionOrder.indexOf(over.id);
    
    if (oldIndex === -1 || newIndex === -1) {
      console.warn('Invalid drag operation: invalid indices');
      return;
    }

    const newOrder = arrayMove(sectionOrder, oldIndex, newIndex);
    
    // Create reordered content object
    const reorderedContent = {};
    newOrder.forEach(sectionId => {
      if (portfolioData.content[sectionId]) {
        reorderedContent[sectionId] = portfolioData.content[sectionId];
      }
    });
    
    console.log('Reordering sections:', { oldOrder: sectionOrder, newOrder, oldIndex, newIndex });
    
    // Update the portfolio data with new order
    onContentChange('_sections', 'reorder', { content: reorderedContent });
  };

  // Get section order for drag and drop
  const sectionOrder = portfolioData?.content ? Object.keys(portfolioData.content) : [];

  // Color presets for quick selection
  const colorPresets = [
    {
      name: 'Ocean Blue',
      colors: {
        primary: '#1e40af',
        accent: '#3b82f6',
        background: '#ffffff',
        surface: '#f1f5f9'
      }
    },
    {
      name: 'Forest Green',
      colors: {
        primary: '#166534',
        accent: '#22c55e',
        background: '#ffffff',
        surface: '#f0fdf4'
      }
    },
    {
      name: 'Sunset Orange',
      colors: {
        primary: '#ea580c',
        accent: '#f97316',
        background: '#ffffff',
        surface: '#fff7ed'
      }
    },
    {
      name: 'Purple Dream',
      colors: {
        primary: '#7c3aed',
        accent: '#a855f7',
        background: '#ffffff',
        surface: '#faf5ff'
      }
    },
    {
      name: 'Monochrome',
      colors: {
        primary: '#1f2937',
        accent: '#4b5563',
        background: '#ffffff',
        surface: '#f9fafb'
      }
    }
  ];

  // Font options
  const fontOptions = [
    { name: 'Inter', family: 'Inter, sans-serif' },
    { name: 'Poppins', family: 'Poppins, sans-serif' },
    { name: 'Roboto', family: 'Roboto, sans-serif' },
    { name: 'Playfair Display', family: 'Playfair Display, serif' },
    { name: 'Lato', family: 'Lato, sans-serif' },
    { name: 'Montserrat', family: 'Montserrat, sans-serif' }
  ];

  const handleColorChange = (colorKey, value) => {
    onStyleChange('colors', {
      ...currentStyles.colors,
      [colorKey]: value
    });
  };

  const handleColorPresetSelect = (preset) => {
    onStyleChange('colors', {
      ...currentStyles.colors,
      ...preset.colors
    });
  };

  const handleFontChange = (fontType, fontFamily) => {
    onStyleChange('fonts', {
      ...currentStyles.fonts,
      [fontType]: fontFamily
    });
  };

  // Section management handlers
  const handleDeleteSection = (sectionId) => {
    if (window.confirm(`Are you sure you want to delete the "${sectionId}" section? This action cannot be undone.`)) {
      const updatedContent = { ...portfolioData.content };
      delete updatedContent[sectionId];
      
      // Update portfolio data without the deleted section
      onContentChange('_sections', 'delete', { sectionId, content: updatedContent });
    }
  };

  // Handle direct content editing in the panel
  const handleDirectEdit = (sectionId, fieldId, value) => {
    console.log('Direct edit:', { sectionId, fieldId, value });
    onContentChange(sectionId, fieldId, value);
  };

  const startEditing = (sectionId, fieldId) => {
    setEditingField(`${sectionId}-${fieldId}`);
  };

  const stopEditing = () => {
    setEditingField(null);
  };

  const isFieldEditing = (sectionId, fieldId) => {
    return editingField === `${sectionId}-${fieldId}`;
  };

  // Render an editable field in the design panel
  const renderEditableField = (sectionId, fieldId, value, placeholder = '') => {
    const isEditing = isFieldEditing(sectionId, fieldId);
    
    if (isEditing) {
      const isMultiline = fieldId.includes('description') || fieldId === 'bio' || fieldId === 'content';
      
      if (isMultiline) {
        return (
          <textarea
            value={value || ''}
            onChange={(e) => handleDirectEdit(sectionId, fieldId, e.target.value)}
            onBlur={stopEditing}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                stopEditing();
              }
              if (e.key === 'Escape') {
                stopEditing();
              }
            }}
            className="w-full text-xs bg-white border border-blue-300 rounded px-2 py-1 resize-none"
            rows={3}
            placeholder={placeholder}
            autoFocus
          />
        );
      } else {
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleDirectEdit(sectionId, fieldId, e.target.value)}
            onBlur={stopEditing}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                stopEditing();
              }
              if (e.key === 'Escape') {
                stopEditing();
              }
            }}
            className="w-full text-xs bg-white border border-blue-300 rounded px-2 py-1"
            placeholder={placeholder}
            autoFocus
          />
        );
      }
    }

    return (
      <div
        onClick={() => startEditing(sectionId, fieldId)}
        className="text-xs text-gray-600 cursor-pointer hover:text-blue-600 hover:bg-blue-50 rounded px-1 py-0.5 transition-colors"
        title="Click to edit"
      >
        {value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : placeholder}
      </div>
    );
  };

  const handleAddSection = (sectionType) => {
    const defaultSectionData = {
      about: {
        title: 'About Me',
        description: 'Tell your story and share what makes you unique.',
        image: '',
        content: 'I am a passionate professional with expertise in...'
      },
      experience: {
        title: 'Experience',
        items: [{
          company: 'Company Name',
          position: 'Job Title',
          duration: '2020 - Present',
          description: 'Description of your role and achievements...',
          location: 'City, State'
        }]
      },
      education: {
        title: 'Education',
        items: [{
          institution: 'University Name',
          degree: 'Bachelor of Science',
          field: 'Field of Study',
          duration: '2016 - 2020',
          location: 'City, State'
        }]
      },
      skills: {
        title: 'Skills',
        categories: [{
          name: 'Technical Skills',
          skills: ['JavaScript', 'React', 'Node.js', 'Python']
        }]
      },
      projects: {
        title: 'Projects',
        items: [{
          name: 'Project Name',
          description: 'Brief description of the project...',
          image: '',
          technologies: ['React', 'Node.js'],
          link: '',
          github: ''
        }]
      },
      contact: {
        title: 'Contact Me',
        email: 'your.email@example.com',
        phone: '+1 (555) 123-4567',
        location: 'City, State',
        social: {
          linkedin: '',
          github: '',
          website: ''
        }
      },
      testimonials: {
        title: 'Testimonials',
        items: [{
          name: 'Client Name',
          position: 'CEO at Company',
          content: 'This person delivered exceptional work...',
          image: '',
          rating: 5
        }]
      },
      certifications: {
        title: 'Certifications',
        items: [{
          name: 'Certification Name',
          issuer: 'Issuing Organization',
          date: '2023',
          link: '',
          image: ''
        }]
      }
    };

    const newSectionData = defaultSectionData[sectionType.id] || {
      title: sectionType.name,
      content: 'New section content...'
    };

    // Add the new section to portfolio content
    onContentChange('_sections', 'add', { 
      sectionId: sectionType.id, 
      sectionData: newSectionData,
      content: {
        ...portfolioData.content,
        [sectionType.id]: newSectionData
      }
    });
  };

  const handleToggleSection = (sectionId) => {
    // This could be used to hide/show sections in the future
    console.log('Toggle section visibility:', sectionId);
    // For now, just show a message
    alert('Section visibility toggle will be implemented in a future update.');
  };

  const handleEditSection = (sectionId) => {
    // Scroll to the section in the main view and highlight it
    console.log('Edit section:', sectionId);
    
    // Find the section element and scroll to it
    const sectionElement = document.querySelector(`[data-section-id="${sectionId}"]`);
    if (sectionElement) {
      sectionElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest' 
      });
      
      // Add a temporary highlight effect with enhanced styling
      sectionElement.classList.add('ring-4', 'ring-blue-400', 'ring-opacity-75', 'bg-blue-50', 'bg-opacity-20');
      
      // Show a brief success toast/notification
      const notification = document.createElement('div');
      notification.innerHTML = `
        <div class="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Navigated to ${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)} section
        </div>
      `;
      document.body.appendChild(notification);
      
      // Remove highlight and notification after a delay
      setTimeout(() => {
        sectionElement.classList.remove('ring-4', 'ring-blue-400', 'ring-opacity-75', 'bg-blue-50', 'bg-opacity-20');
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 2500);
    } else {
      // If section not found, show an improved message
      console.warn(`Section "${sectionId}" not found in preview`);
      
      const notification = document.createElement('div');
      notification.innerHTML = `
        <div class="fixed top-4 right-4 bg-orange-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          Section "${sectionId}" not found in preview
        </div>
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 3000);
    }
  };

  const tabs = [
    { id: 'sections', label: 'Sections', icon: '📋' },
    { id: 'colors', label: 'Colors', icon: '🎨' },
    { id: 'fonts', label: 'Typography', icon: '📝' }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed bottom-6 left-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105 z-50 md:hidden"
        title="Open Design Tools"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Design Panel */}
      <motion.div
        className={`fixed right-0 top-0 h-full bg-white shadow-2xl border-l border-gray-200 z-50 
          ${isCollapsed ? 'w-16' : 'w-full md:w-[28rem]'} 
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
          md:top-16 md:h-[calc(100vh-4rem)] md:z-40
          transition-transform duration-300 ease-in-out`}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-semibold text-gray-900">Design Tools</h2>
              <div className="hidden md:flex items-center space-x-1 text-xs text-gray-500">
                <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">Ctrl</kbd>
                <span>+</span>
                <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">S</kbd>
                <span className="text-gray-400">to save</span>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
              title="Close Panel"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Collapse/Expand Button */}
            <button
              onClick={() => {
                const newCollapsed = !isCollapsed;
                setIsCollapsed(newCollapsed);
                // Notify parent about collapse state change
                if (onCollapseChange) {
                  onCollapseChange(newCollapsed);
                }
              }}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors hidden md:block"
              title={isCollapsed ? 'Expand Panel' : 'Collapse Panel'}
            >
              <svg
                className={`w-5 h-5 transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </div>

      {!isCollapsed && (
        <>
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-2 py-4 md:py-3 text-sm font-medium transition-colors touch-manipulation ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="text-xl md:text-lg mb-1">{tab.icon}</div>
                <div className="text-xs font-medium">{tab.label}</div>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-12rem)] px-1">
            <div className="p-4">
              <AnimatePresence mode="wait">
                {activeTab === 'sections' && (
                  <motion.div
                    key="sections"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                  {/* Current Sections */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-900">Current Sections</h3>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M7 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
                        </svg>
                        <span>Drag the ⋮⋮ handle to reorder</span>
                      </div>
                    </div>
                    
                    {/* Instructions for first-time users */}
                    {portfolioData?.content && Object.keys(portfolioData.content).length > 1 && (
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-700">
                          💡 <strong>Pro tip:</strong> Drag sections by their handle (⋮⋮) to change the order they appear on your portfolio.
                        </p>
                      </div>
                    )}
                    
                    {portfolioData?.content && (
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        onDragStart={() => {
                          // Provide haptic feedback on mobile devices
                          if (navigator.vibrate) {
                            navigator.vibrate(50);
                          }
                        }}
                      >
                        <SortableContext
                          items={sectionOrder}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-3">
                            {sectionOrder.map((sectionId) => {
                              const sectionData = portfolioData.content[sectionId];
                              if (!sectionData) return null;

                              const getSectionIcon = (id) => {
                                const icons = {
                                  hero: '🏠',
                                  about: '👤',
                                  experience: '💼',
                                  education: '🎓',
                                  skills: '⚡',
                                  projects: '🚀',
                                  contact: '📧',
                                  testimonials: '💬',
                                  certifications: '🏆',
                                  portfolio: '📁',
                                  services: '🛠️'
                                };
                                return icons[id] || '📄';
                              };

                              return (
                                <SortableSection
                                  key={sectionId}
                                  sectionId={sectionId}
                                  sectionData={sectionData}
                                  onDelete={handleDeleteSection}
                                  onEdit={handleEditSection}
                                  getSectionIcon={getSectionIcon}
                                />
                              );
                            })}
                          </div>
                        </SortableContext>
                      </DndContext>
                    )}
                  </div>

                  {/* Add New Section */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Add New Section</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { id: 'about', name: 'About Me', icon: '👤', description: 'Personal information and bio' },
                        { id: 'experience', name: 'Experience', icon: '💼', description: 'Work history and positions' },
                        { id: 'education', name: 'Education', icon: '🎓', description: 'Academic background' },
                        { id: 'skills', name: 'Skills', icon: '⚡', description: 'Technical and soft skills' },
                        { id: 'projects', name: 'Projects', icon: '🚀', description: 'Portfolio projects' },
                        { id: 'contact', name: 'Contact', icon: '📧', description: 'Contact information' },
                        { id: 'testimonials', name: 'Testimonials', icon: '💬', description: 'Client reviews and feedback' },
                        { id: 'certifications', name: 'Certifications', icon: '🏆', description: 'Professional certifications' },
                        { id: 'services', name: 'Services', icon: '🛠️', description: 'Services you offer' }
                      ].filter(sectionType => !portfolioData?.content?.[sectionType.id]).map((sectionType) => (
                        <button
                          key={sectionType.id}
                          onClick={() => handleAddSection(sectionType)}
                          className="p-3 rounded-lg border bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-left transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">{sectionType.icon}</span>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {sectionType.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {sectionType.description}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'colors' && (
                <motion.div
                  key="colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Color Presets */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Themes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {colorPresets.map((preset, index) => (
                        <button
                          key={index}
                          onClick={() => handleColorPresetSelect(preset)}
                          className="p-4 md:p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors touch-manipulation"
                        >
                          <div className="flex space-x-1 mb-2 justify-center">
                            {Object.values(preset.colors).map((color, colorIndex) => (
                              <div
                                key={colorIndex}
                                className="w-5 h-5 md:w-4 md:h-4 rounded-full"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <div className="text-xs text-gray-600 text-center">{preset.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Individual Color Controls */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Custom Colors</h3>
                    <div className="space-y-4 md:space-y-3">
                      {Object.entries(currentStyles.colors).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between gap-3">
                          <label className="text-sm text-gray-700 capitalize flex-1 min-w-0">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <input
                              type="color"
                              value={value}
                              onChange={(e) => handleColorChange(key, e.target.value)}
                              className="w-10 h-10 md:w-8 md:h-8 rounded border border-gray-300 cursor-pointer touch-manipulation"
                            />
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => handleColorChange(key, e.target.value)}
                              className="w-24 md:w-20 px-2 py-2 md:py-1 text-xs border border-gray-300 rounded touch-manipulation"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'fonts' && (
                <motion.div
                  key="fonts"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Font Selection */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Font Family</h3>
                    <div className="space-y-3">
                      {Object.entries(currentStyles.fonts).map(([fontType, currentFont]) => (
                        <div key={fontType}>
                          <label className="text-sm text-gray-700 capitalize block mb-2">
                            {fontType} Font
                          </label>
                          <select
                            value={currentFont}
                            onChange={(e) => handleFontChange(fontType, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {fontOptions.map((font, index) => (
                              <option key={index} value={font.name} style={{ fontFamily: font.family }}>
                                {font.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Font Preview */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Preview</h3>
                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                      <div
                        style={{ fontFamily: currentStyles.fonts.heading }}
                        className="text-2xl font-bold"
                      >
                        Heading Text
                      </div>
                      <div
                        style={{ fontFamily: currentStyles.fonts.body }}
                        className="text-base"
                      >
                        Body text lorem ipsum dolor sit amet consectetur adipiscing elit.
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </div>
        </>
      )}
    </motion.div>
    </>
  );
};

export default DesignToolsPanel;