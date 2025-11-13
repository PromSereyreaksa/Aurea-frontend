/**
 * Dynamic Work/Projects Section Component
 *
 * Renders work/projects section dynamically based on template schema
 * Supports project lists, grids, and case study integration
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '../../../utils/cn';

const DynamicWorkSection = ({
  id,
  config,
  content = {},
  styling = {},
  isEditing = false,
  onChange,
  portfolioId,
  caseStudies = [],
}) => {
  const [editingField, setEditingField] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  // Get variant/layout from config
  const variant = config.variant || config.layout || 'default';

  // Get section styling
  const sectionStyling = config.styling || {};
  const backgroundColor = sectionStyling.backgroundColor || styling.colors?.background || '#FFFFFF';
  const textColor = styling.colors?.text || '#000000';
  const accentColor = styling.colors?.accent || '#FF6B2C';
  const padding = sectionStyling.padding || 'default';

  // Get fields from schema
  const fields = config.fields || [];

  // Get field value
  const getFieldValue = (fieldId) => {
    return content[fieldId] || '';
  };

  // Handle field change
  const handleFieldChange = (fieldId, value) => {
    if (onChange) {
      onChange(fieldId, value);
    }
  };

  // Handle project change
  const handleProjectChange = (index, field, value) => {
    const projects = getFieldValue('projects') || [];
    const updated = [...projects];
    if (!updated[index]) {
      updated[index] = {};
    }
    updated[index][field] = value;
    handleFieldChange('projects', updated);
  };

  // Add new project
  const handleAddProject = () => {
    const projects = getFieldValue('projects') || [];
    const newProject = {
      id: Date.now(),
      title: 'New Project',
      description: 'Project description',
      image: '',
      meta: new Date().getFullYear().toString(),
      category: 'design'
    };
    handleFieldChange('projects', [...projects, newProject]);
  };

  // Remove project
  const handleRemoveProject = (index) => {
    const projects = getFieldValue('projects') || [];
    const updated = projects.filter((_, i) => i !== index);
    handleFieldChange('projects', updated);
  };

  // Render heading field
  const renderHeading = () => {
    const headingField = fields.find(f => f.id === 'heading' || f.type === 'text');
    if (!headingField) return null;

    const value = getFieldValue(headingField.id);

    return (
      <div className="mb-12">
        {isEditing ? (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(headingField.id, e.target.value)}
            onFocus={() => setEditingField(headingField.id)}
            onBlur={() => setEditingField(null)}
            placeholder={headingField.placeholder || 'Section Heading'}
            className={cn(
              'text-5xl font-bold w-full bg-transparent border-b-2 transition-all',
              editingField === headingField.id ? 'border-orange-500' : 'border-gray-300',
              'focus:outline-none focus:border-orange-500 px-2 py-1'
            )}
            style={{ color: textColor, fontFamily: styling.fonts?.heading }}
          />
        ) : (
          <h2
            className="text-5xl font-bold"
            style={{ color: textColor, fontFamily: styling.fonts?.heading }}
          >
            {value || config.name || 'Work'}
          </h2>
        )}
      </div>
    );
  };

  // Render single project card
  const renderProjectCard = (project, index) => {
    const isActive = editingProject === index;

    return (
      <motion.div
        key={project.id || index}
        className={cn(
          'relative group',
          isEditing && 'border-2 border-dashed',
          isActive ? 'border-orange-500' : 'border-transparent'
        )}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        onClick={() => isEditing && setEditingProject(index)}
      >
        {/* Project Image */}
        <div className="relative overflow-hidden aspect-[4/3] bg-gray-100 rounded">
          {isEditing ? (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <input
                type="url"
                value={project.image || ''}
                onChange={(e) => handleProjectChange(index, 'image', e.target.value)}
                placeholder="Image URL"
                className="w-full text-center bg-white/90 border-2 border-gray-300 rounded px-4 py-2 focus:border-orange-500 focus:outline-none"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          ) : null}
          {project.image && (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x600?text=Project+Image';
              }}
            />
          )}
          {!project.image && !isEditing && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <span className="text-gray-400">No image</span>
            </div>
          )}

          {/* Meta overlay */}
          {project.meta && !isEditing && (
            <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
              {project.meta}
            </div>
          )}
        </div>

        {/* Project Info */}
        <div className="mt-4">
          {isEditing ? (
            <>
              <input
                type="text"
                value={project.title || ''}
                onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                placeholder="Project Title"
                className="w-full text-2xl font-bold border-b-2 border-gray-300 focus:border-orange-500 focus:outline-none px-2 py-1 mb-2"
                onClick={(e) => e.stopPropagation()}
              />
              <textarea
                value={project.description || ''}
                onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                placeholder="Project description"
                className="w-full border-2 border-gray-300 focus:border-orange-500 focus:outline-none rounded px-3 py-2 resize-none"
                rows={3}
                onClick={(e) => e.stopPropagation()}
              />
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={project.meta || ''}
                  onChange={(e) => handleProjectChange(index, 'meta', e.target.value)}
                  placeholder="Year/Meta"
                  className="flex-1 text-sm border-2 border-gray-300 focus:border-orange-500 focus:outline-none rounded px-3 py-1"
                  onClick={(e) => e.stopPropagation()}
                />
                <input
                  type="text"
                  value={project.category || ''}
                  onChange={(e) => handleProjectChange(index, 'category', e.target.value)}
                  placeholder="Category"
                  className="flex-1 text-sm border-2 border-gray-300 focus:border-orange-500 focus:outline-none rounded px-3 py-1"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveProject(index);
                }}
                className="mt-2 text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Remove Project
              </button>
            </>
          ) : (
            <>
              <h3
                className="text-2xl font-bold mb-2"
                style={{ color: textColor, fontFamily: styling.fonts?.heading }}
              >
                {project.title}
              </h3>
              <p
                className="text-base mb-2 line-clamp-2"
                style={{ color: styling.colors?.textSecondary || '#666' }}
              >
                {project.description}
              </p>
              {project.category && (
                <span
                  className="inline-block text-sm font-medium px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: `${accentColor}20`,
                    color: accentColor
                  }}
                >
                  {project.category}
                </span>
              )}
            </>
          )}
        </div>
      </motion.div>
    );
  };

  // Padding classes
  const paddingClasses = {
    tight: 'py-12 px-6',
    default: 'py-20 px-8',
    relaxed: 'py-32 px-12',
  }[padding] || 'py-20 px-8';

  // Get projects
  const projects = getFieldValue('projects') || [];

  // Render based on variant
  const renderVariant = () => {
    switch (variant) {
      case 'project_list_swiss':
      case 'grid':
        return (
          <div className="max-w-7xl mx-auto">
            {renderHeading()}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => renderProjectCard(project, index))}
              {isEditing && (
                <button
                  onClick={handleAddProject}
                  className="aspect-[4/3] border-2 border-dashed border-gray-300 hover:border-orange-500 rounded flex flex-col items-center justify-center transition-colors group"
                >
                  <svg
                    className="w-12 h-12 text-gray-400 group-hover:text-orange-500 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-gray-500 group-hover:text-orange-500 font-medium">
                    Add Project
                  </span>
                </button>
              )}
            </div>
          </div>
        );

      case 'list':
        return (
          <div className="max-w-5xl mx-auto">
            {renderHeading()}
            <div className="space-y-12">
              {projects.map((project, index) => (
                <div key={project.id || index} className="flex gap-8">
                  <div className="w-1/3 flex-shrink-0">
                    {renderProjectCard(project, index)}
                  </div>
                  <div className="flex-1">
                    <h3
                      className="text-3xl font-bold mb-4"
                      style={{ color: textColor }}
                    >
                      {project.title}
                    </h3>
                    <p className="text-lg mb-4" style={{ color: styling.colors?.textSecondary }}>
                      {project.description}
                    </p>
                  </div>
                </div>
              ))}
              {isEditing && (
                <button
                  onClick={handleAddProject}
                  className="w-full py-8 border-2 border-dashed border-gray-300 hover:border-orange-500 rounded text-gray-500 hover:text-orange-500 font-medium transition-colors"
                >
                  + Add Project
                </button>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="max-w-6xl mx-auto">
            {renderHeading()}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {projects.map((project, index) => renderProjectCard(project, index))}
              {isEditing && (
                <button
                  onClick={handleAddProject}
                  className="aspect-square border-2 border-dashed border-gray-300 hover:border-orange-500 rounded flex flex-col items-center justify-center transition-colors group"
                >
                  <span className="text-6xl text-gray-400 group-hover:text-orange-500">+</span>
                  <span className="text-gray-500 group-hover:text-orange-500 mt-2">Add Project</span>
                </button>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <motion.section
      id={id}
      className={cn('relative', paddingClasses)}
      style={{
        backgroundColor,
        backgroundImage: sectionStyling.background === 'gradient'
          ? 'linear-gradient(135deg, rgba(0,0,0,0.02) 0%, transparent 100%)'
          : undefined
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {renderVariant()}

      {/* Edit mode indicator */}
      {isEditing && (
        <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs px-2 py-1 rounded">
          Editing Work ({projects.length} projects)
        </div>
      )}
    </motion.section>
  );
};

export default DynamicWorkSection;
