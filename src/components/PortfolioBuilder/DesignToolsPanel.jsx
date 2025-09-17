import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DesignToolsPanel = ({ template, portfolioData, onStyleChange, onContentChange }) => {
  const [activeTab, setActiveTab] = useState('sections');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [editingField, setEditingField] = useState(null); // Track which field is being edited

  const currentStyles = portfolioData?.styling || template.styling;

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
      sectionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add a temporary highlight effect
      sectionElement.classList.add('ring-2', 'ring-blue-500', 'ring-opacity-50');
      setTimeout(() => {
        sectionElement.classList.remove('ring-2', 'ring-blue-500', 'ring-opacity-50');
      }, 3000);
    } else {
      // If section not found, just show a message
      alert(`Click on the "${sectionId}" section in the main view to edit it.`);
    }
  };

  const tabs = [
    { id: 'sections', label: 'Sections', icon: '📋' },
    { id: 'colors', label: 'Colors', icon: '🎨' },
    { id: 'fonts', label: 'Typography', icon: '📝' },
    { id: 'spacing', label: 'Layout', icon: '📐' },
    { id: 'effects', label: 'Effects', icon: '✨' }
  ];

  return (
    <motion.div
      className={`fixed right-0 top-16 h-[calc(100vh-4rem)] bg-white shadow-2xl border-l border-gray-200 z-40 ${
        isCollapsed ? 'w-16' : 'w-[28rem]'
      }`}
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-gray-900">Design Tools</h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
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

      {!isCollapsed && (
        <>
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-2 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="text-xl mb-1">{tab.icon}</div>
                <div className="text-xs font-medium">{tab.label}</div>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto max-h-[calc(100vh-12rem)]">
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
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Current Sections</h3>
                    <div className="space-y-3">
                      {portfolioData?.content && Object.entries(portfolioData.content).map(([sectionId, sectionData]) => {
                        const getSectionPreview = (data) => {
                          if (data?.title) return data.title;
                          if (data?.name) return data.name;
                          if (data?.items && Array.isArray(data.items) && data.items.length > 0) {
                            return `${data.items.length} items`;
                          }
                          if (data?.content) return data.content.substring(0, 50) + '...';
                          if (data?.description) return data.description.substring(0, 50) + '...';
                          return 'Section content';
                        };

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
                          <div
                            key={sectionId}
                            className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 flex-1">
                                <div className="text-2xl">{getSectionIcon(sectionId)}</div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-sm font-medium text-gray-900 capitalize">
                                      {sectionId.replace(/([A-Z])/g, ' $1').trim()}
                                    </h4>
                                    <button
                                      onClick={() => handleEditSection(sectionId)}
                                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                      title="Edit Section"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                    </button>
                                  </div>
                                  
                                  {/* Editable Section Content */}
                                  <div className="bg-white rounded p-3 border space-y-2">
                                    {/* Title/Heading Field */}
                                    {(sectionData?.title !== undefined || sectionData?.heading !== undefined) && (
                                      <div>
                                        <label className="text-xs font-medium text-gray-500 block mb-1">
                                          {sectionId === 'hero' ? 'Name' : 'Title'}
                                        </label>
                                        {renderEditableField(sectionId, sectionData?.title !== undefined ? 'title' : 'heading', 
                                          sectionData?.title || sectionData?.heading, 'Enter title...')}
                                      </div>
                                    )}

                                    {/* Subtitle Field */}
                                    {sectionData?.subtitle !== undefined && (
                                      <div>
                                        <label className="text-xs font-medium text-gray-500 block mb-1">Subtitle</label>
                                        {renderEditableField(sectionId, 'subtitle', sectionData.subtitle, 'Enter subtitle...')}
                                      </div>
                                    )}

                                    {/* Description/Bio/Content Field */}
                                    {(sectionData?.description !== undefined || sectionData?.bio !== undefined || sectionData?.content !== undefined) && (
                                      <div>
                                        <label className="text-xs font-medium text-gray-500 block mb-1">
                                          {sectionData?.bio !== undefined ? 'Bio' : sectionData?.description !== undefined ? 'Description' : 'Content'}
                                        </label>
                                        {renderEditableField(sectionId, 
                                          sectionData?.bio !== undefined ? 'bio' : sectionData?.description !== undefined ? 'description' : 'content',
                                          sectionData?.bio || sectionData?.description || sectionData?.content, 
                                          'Enter content...')}
                                      </div>
                                    )}

                                    {/* Items Preview (for sections with lists) */}
                                    {sectionData?.items && Array.isArray(sectionData.items) && (
                                      <div>
                                        <label className="text-xs font-medium text-gray-500 block mb-1">
                                          Items ({sectionData.items.length})
                                        </label>
                                        <div className="space-y-1 max-h-20 overflow-y-auto">
                                          {sectionData.items.slice(0, 3).map((item, idx) => (
                                            <div key={idx} className="flex items-center space-x-2 text-xs text-gray-600">
                                              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                              <span>{item.name || item.title || item.company || item.institution || 'Item'}</span>
                                            </div>
                                          ))}
                                          {sectionData.items.length > 3 && (
                                            <div className="text-xs text-gray-400">+{sectionData.items.length - 3} more...</div>
                                          )}
                                        </div>
                                        <div className="text-xs text-blue-600 mt-1 cursor-pointer hover:underline"
                                             onClick={() => handleEditSection(sectionId)}>
                                          Click in template to edit items →
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col space-y-1 ml-2">
                                <button
                                  onClick={() => handleToggleSection(sectionId)}
                                  className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                                  title="Toggle Visibility"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDeleteSection(sectionId)}
                                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                  title="Delete Section"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
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
                    <div className="grid grid-cols-2 gap-3">
                      {colorPresets.map((preset, index) => (
                        <button
                          key={index}
                          onClick={() => handleColorPresetSelect(preset)}
                          className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                        >
                          <div className="flex space-x-1 mb-2">
                            {Object.values(preset.colors).map((color, colorIndex) => (
                              <div
                                key={colorIndex}
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <div className="text-xs text-gray-600">{preset.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Individual Color Controls */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Custom Colors</h3>
                    <div className="space-y-3">
                      {Object.entries(currentStyles.colors).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <label className="text-sm text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={value}
                              onChange={(e) => handleColorChange(key, e.target.value)}
                              className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => handleColorChange(key, e.target.value)}
                              className="w-20 px-2 py-1 text-xs border border-gray-300 rounded"
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

              {activeTab === 'spacing' && (
                <motion.div
                  key="spacing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Section Spacing</h3>
                    <div className="space-y-3">
                      {Object.entries(currentStyles.spacing).map(([key, value]) => (
                        <div key={key}>
                          <label className="text-sm text-gray-700 capitalize block mb-2">
                            {key} Spacing
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            step="0.5"
                            value={parseFloat(value)}
                            onChange={(e) => onStyleChange('spacing', {
                              ...currentStyles.spacing,
                              [key]: `${e.target.value}rem`
                            })}
                            className="w-full"
                          />
                          <div className="text-xs text-gray-500 mt-1">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'effects' && (
                <motion.div
                  key="effects"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Border Radius</h3>
                    <div className="space-y-3">
                      {Object.entries(currentStyles.borderRadius).map(([key, value]) => (
                        <div key={key}>
                          <label className="text-sm text-gray-700 capitalize block mb-2">
                            {key} Radius
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="2"
                            step="0.125"
                            value={parseFloat(value)}
                            onChange={(e) => onStyleChange('borderRadius', {
                              ...currentStyles.borderRadius,
                              [key]: `${e.target.value}rem`
                            })}
                            className="w-full"
                          />
                          <div className="text-xs text-gray-500 mt-1">{value}</div>
                        </div>
                      ))}
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
  );
};

export default DesignToolsPanel;