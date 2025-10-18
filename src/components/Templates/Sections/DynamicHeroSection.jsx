/**
 * Dynamic Hero Section
 *
 * Renders hero sections based on schema configuration
 * Supports multiple layouts and field types
 */

import React from 'react';
import { motion } from 'framer-motion';
import EditableField from '../../PortfolioBuilder/EditableField';
import { cn } from '../../../utils/cn';

const DynamicHeroSection = ({
  id,
  config,
  content,
  styling,
  isEditing,
  onChange,
}) => {
  const layout = config.layout || 'centered';
  const editable = config.editable || [];

  // Layout classes based on configuration
  const layoutClasses = {
    centered: 'text-center items-center',
    left: 'text-left items-start',
    right: 'text-right items-end',
    split: 'md:grid md:grid-cols-2 gap-8',
    minimal: 'min-h-screen flex flex-col justify-center',
    fullscreen: 'min-h-screen relative',
  };

  const renderField = (fieldId, defaultValue = '', type = 'text') => {
    if (!editable.includes(fieldId)) {
      return content[fieldId] || defaultValue;
    }

    if (isEditing) {
      return (
        <EditableField
          value={content[fieldId] || defaultValue}
          onChange={(value) => onChange(fieldId, value)}
          type={type}
          placeholder={defaultValue}
          className={cn(
            type === 'heading' && 'font-bold',
            type === 'subtitle' && 'text-gray-600'
          )}
        />
      );
    }

    return content[fieldId] || defaultValue;
  };

  return (
    <section
      id={id}
      className={cn(
        'hero-section',
        'px-4 md:px-8 lg:px-16',
        'py-16 md:py-24 lg:py-32',
        layoutClasses[layout],
        config.className
      )}
      style={{
        backgroundColor: styling?.colors?.background,
        color: styling?.colors?.text,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto"
      >
        {/* Title */}
        {(content.title || editable.includes('title')) && (
          <h1
            className={cn(
              'text-4xl md:text-6xl lg:text-7xl',
              'font-bold mb-4 md:mb-6',
              layout === 'minimal' && 'tracking-tight'
            )}
            style={{
              fontFamily: styling?.fonts?.heading,
              fontSize: styling?.typography?.scale?.h1,
            }}
          >
            {renderField('title', 'Your Title Here', 'heading')}
          </h1>
        )}

        {/* Subtitle */}
        {(content.subtitle || editable.includes('subtitle')) && (
          <p
            className={cn(
              'text-lg md:text-xl lg:text-2xl',
              'mb-6 md:mb-8',
              'opacity-90'
            )}
            style={{
              fontFamily: styling?.fonts?.body,
              fontSize: styling?.typography?.scale?.body,
            }}
          >
            {renderField('subtitle', 'Your subtitle goes here', 'text')}
          </p>
        )}

        {/* Description */}
        {(content.description || editable.includes('description')) && (
          <div
            className={cn(
              'max-w-3xl',
              layout === 'centered' && 'mx-auto',
              'mb-8'
            )}
          >
            {renderField('description', 'Add a description...', 'textarea')}
          </div>
        )}

        {/* CTA Button */}
        {(content.ctaText || editable.includes('ctaText')) && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'px-8 py-3',
              'rounded-lg',
              'font-medium',
              'transition-colors',
              'bg-black text-white hover:bg-gray-800'
            )}
            style={{
              backgroundColor: styling?.colors?.primary,
              color: styling?.colors?.background,
            }}
          >
            {renderField('ctaText', 'Get Started', 'text')}
          </motion.button>
        )}

        {/* Hero Image */}
        {(content.image || editable.includes('image')) && (
          <div className="mt-8 md:mt-12">
            {isEditing ? (
              <EditableField
                value={content.image || ''}
                onChange={(value) => onChange('image', value)}
                type="image"
                placeholder="Add hero image"
                className="w-full rounded-lg"
              />
            ) : (
              content.image && (
                <img
                  src={content.image}
                  alt="Hero"
                  className="w-full rounded-lg shadow-xl"
                />
              )
            )}
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default DynamicHeroSection;