import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const TemplatePreview = ({ template, portfolioData, isEditing = false, onContentChange }) => {
  const [activeSection, setActiveSection] = useState(null);
  const [isEditingText, setIsEditingText] = useState(null);
  const contentRef = useRef({});

  // Debug: Log when portfolioData changes
  useEffect(() => {
    console.log('TemplatePreview received portfolioData:', portfolioData);
  }, [portfolioData]);

  // Handle text editing
  const handleTextEdit = (sectionId, fieldId, value) => {
    console.log('TemplatePreview handleTextEdit called:', { sectionId, fieldId, value });
    if (onContentChange) {
      // Call the function directly (it might be a function or object with onChange)
      if (typeof onContentChange === 'function') {
        console.log('Calling onContentChange as function');
        onContentChange(sectionId, fieldId, value);
      } else if (onContentChange.onChange) {
        console.log('Calling onContentChange.onChange');
        onContentChange.onChange(sectionId, fieldId, value);
      } else {
        console.error('onContentChange is not a function and has no onChange method:', onContentChange);
      }
    } else {
      console.error('onContentChange is null/undefined');
    }
  };

  // Handle entering edit mode for text
  const handleTextClick = (sectionId, fieldId) => {
    if (isEditing) {
      setIsEditingText(`${sectionId}-${fieldId}`);
    }
  };

  // Handle exiting edit mode
  const handleTextBlur = (sectionId, fieldId) => {
    setIsEditingText(null);
  };

  // Handle key press for exiting edit mode
  const handleKeyPress = (e, sectionId, fieldId) => {
    if (e.key === 'Enter') {
      setIsEditingText(null);
      // Just exit edit mode, don't save to server
    }
    if (e.key === 'Escape') {
      setIsEditingText(null);
    }
  };

  // Render editable text
  const renderEditableText = (content, sectionId, fieldId, className = '', tag = 'div') => {
    const isCurrentlyEditing = isEditingText === `${sectionId}-${fieldId}`;
    const Component = tag;

    if (isEditing && isCurrentlyEditing) {
      return (
        <input
          type="text"
          value={content}
          onChange={(e) => handleTextEdit(sectionId, fieldId, e.target.value)}
          onBlur={() => handleTextBlur(sectionId, fieldId)}
          onKeyDown={(e) => handleKeyPress(e, sectionId, fieldId)}
          className={`${className} bg-transparent border-2 border-blue-500 rounded px-2 py-1 outline-none`}
          autoFocus
        />
      );
    }

    return (
      <Component
        className={`${className} ${isEditing ? 'cursor-text hover:bg-blue-50 hover:bg-opacity-50 rounded px-2 py-1 transition-colors' : ''}`}
        onClick={() => handleTextClick(sectionId, fieldId)}
      >
        {content}
      </Component>
    );
  };

  // Get the current content (either from portfolioData or template defaults)
  const getContent = (sectionId) => {
    const content = portfolioData?.content?.[sectionId] || template.defaultContent[sectionId];
    console.log(`Getting content for ${sectionId}:`, content);
    return content;
  };

  // Get the current styling
  const getStyles = () => {
    const styling = portfolioData?.styling || template.styling || {};
    
    // Provide complete fallbacks for all styling properties
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

  const styles = getStyles();

  return (
    <div className="w-full bg-white" style={{ fontFamily: styles.fonts.body }}>
      {/* Hero Section */}
      <section 
        className="min-h-screen flex items-center justify-center relative"
        style={{ backgroundColor: styles.colors.background }}
        onMouseEnter={() => isEditing && setActiveSection('hero')}
        onMouseLeave={() => isEditing && setActiveSection(null)}
      >
        {isEditing && activeSection === 'hero' && (
          <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
            Hero Section - Click to edit
          </div>
        )}
        
        <div className="text-center max-w-4xl mx-auto px-6">
          <div className="mb-8">
            <div 
              className="w-32 h-32 rounded-full mx-auto mb-6 bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${getContent('hero').image})`,
                backgroundColor: styles.colors.surface
              }}
            />
            
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
        className="py-20"
        style={{ backgroundColor: styles.colors.surface }}
        onMouseEnter={() => isEditing && setActiveSection('about')}
        onMouseLeave={() => isEditing && setActiveSection(null)}
      >
        {isEditing && activeSection === 'about' && (
          <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm z-10">
            About Section - Click to edit
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
                <div className="flex flex-wrap gap-3">
                  {getContent('about').skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-full text-sm font-medium"
                      style={{ 
                        backgroundColor: styles.colors.accent,
                        color: 'white'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <div 
                className="aspect-square rounded-lg bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${getContent('about').image})`,
                  backgroundColor: styles.colors.background
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section 
        className="py-20"
        onMouseEnter={() => isEditing && setActiveSection('portfolio')}
        onMouseLeave={() => isEditing && setActiveSection(null)}
      >
        {isEditing && activeSection === 'portfolio' && (
          <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm z-10">
            Portfolio Section - Click to edit
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
                <div 
                  className="aspect-video bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url(${project.image})`,
                    backgroundColor: styles.colors.surface
                  }}
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
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
      <section 
        className="py-20"
        style={{ backgroundColor: styles.colors.surface }}
        onMouseEnter={() => isEditing && setActiveSection('contact')}
        onMouseLeave={() => isEditing && setActiveSection(null)}
      >
        {isEditing && activeSection === 'contact' && (
          <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm z-10">
            Contact Section - Click to edit
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
            {getContent('contact').social_links.map((link, index) => (
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
    </div>
  );
};

export default TemplatePreview;