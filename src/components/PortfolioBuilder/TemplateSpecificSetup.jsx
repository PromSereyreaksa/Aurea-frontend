/**
 * Template-Specific Setup Component
 *
 * Generates custom setup forms for each template based on their unique requirements
 * - Echelon: 6 gallery images
 * - Serene: 3 gallery images
 * - Chic: 4 projects with images
 * - BoldFolio: 3 projects with multiple images each
 */

import React, { useState, useEffect } from 'react';
import Stepper, { Step } from '../Shared/Stepper';
import ImageUpload from './ImageUpload';
import MultiImageUpload from './MultiImageUpload';
import { toast } from 'react-hot-toast';

const TemplateSpecificSetup = ({ template, initialData = {}, onComplete }) => {
  const [formData, setFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  // Initialize form data from template defaults or saved data
  useEffect(() => {
    if (template?.defaultContent) {
      // Prefer initialData.content if it exists (user has edited before)
      // Otherwise use template.defaultContent (new portfolio)
      const initial = initialData?.content || template.defaultContent;
      console.log('=== Initializing TemplateSpecificSetup ===');
      console.log('Template:', template.name, template.id);
      console.log('Initial data from props:', JSON.stringify(initialData, null, 2));
      console.log('Using initial:', JSON.stringify(initial, null, 2));
      setFormData(initial);
    }
  }, [template?.id, template?.defaultContent, initialData?.content]); // More specific dependencies

  const handleComplete = () => {
    console.log('=== TemplateSpecificSetup Complete ===');
    console.log('Template ID:', template?.id);
    console.log('Form Data:', JSON.stringify(formData, null, 2));
    onComplete(formData);
  };

  const handleFieldChange = (section, field, value) => {
    console.log(`📝 handleFieldChange: ${section}.${field} =`, value);
    setFormData(prev => {
      const updated = {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      };
      console.log('📝 Updated formData:', updated);
      return updated;
    });
  };

  const handleArrayFieldChange = (section, field, index, subField, value) => {
    setFormData(prev => {
      const array = [...(prev[section]?.[field] || [])];
      
      // Preserve existing object or use template default if available
      const existingItem = array[index] || template?.defaultContent?.[section]?.[field]?.[index] || {};
      
      if (subField) {
        // Spread existing item to preserve all fields (like 'meta')
        array[index] = { ...existingItem, [subField]: value };
      } else {
        array[index] = value;
      }
      
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: array
        }
      };
    });
  };

  const renderEchelonSetup = () => {
    const steps = [
      {
        id: 'hero',
        name: 'Hero Section',
        description: 'Your main headline and introduction',
        render: () => (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.hero?.title || ''}
                onChange={(e) => handleFieldChange('hero', 'title', e.target.value)}
                placeholder="DESIGNING WITH PRECISION"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <input
                type="text"
                value={formData.hero?.subtitle || ''}
                onChange={(e) => handleFieldChange('hero', 'subtitle', e.target.value)}
                placeholder="Case studies in clarity and form"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        )
      },
      {
        id: 'about',
        name: 'About Section',
        description: 'Tell visitors about yourself',
        render: () => (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
              <input
                type="text"
                value={formData.about?.name || ''}
                onChange={(e) => handleFieldChange('about', 'name', e.target.value)}
                placeholder="DESIGNER NAME"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
              <ImageUpload
                currentImage={formData.about?.image || ''}
                onImageChange={(url) => {
                  // ImageUpload already handles upload and returns URL
                  handleFieldChange('about', 'image', url);
                }}
                onImageRemove={() => handleFieldChange('about', 'image', '')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                value={formData.about?.bio || ''}
                onChange={(e) => handleFieldChange('about', 'bio', e.target.value)}
                placeholder="Tell us about yourself and your design philosophy..."
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        )
      },
      {
        id: 'gallery',
        name: 'Gallery Images',
        description: 'Add 6 images to showcase your visual work',
        render: () => (
          <div className="space-y-6">
            <p className="text-gray-600 mb-4">Upload up to 6 images for your gallery</p>
            {[0, 1, 2, 3, 4, 5].map(index => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image {index + 1} {index >= 3 && <span className="text-gray-400">(Optional)</span>}
                </label>
                <ImageUpload
                  currentImage={formData.gallery?.images?.[index]?.src || ''}
                  onImageChange={(url) => {
                    // ImageUpload already handles upload and returns URL
                    handleArrayFieldChange('gallery', 'images', index, 'src', url);
                  }}
                  onImageRemove={() => handleArrayFieldChange('gallery', 'images', index, 'src', '')}
                />
                <input
                  type="text"
                  value={formData.gallery?.images?.[index]?.caption || ''}
                  onChange={(e) => handleArrayFieldChange('gallery', 'images', index, 'caption', e.target.value)}
                  placeholder={`Visual exploration ${String(index + 1).padStart(2, '0')}`}
                  className="w-full mt-3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>
        )
      },
      {
        id: 'contact',
        name: 'Contact Information',
        description: 'How can people reach you?',
        render: () => (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
              <input
                type="text"
                value={formData.contact?.heading || ''}
                onChange={(e) => handleFieldChange('contact', 'heading', e.target.value)}
                placeholder="GET IN TOUCH"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.contact?.email || ''}
                onChange={(e) => handleFieldChange('contact', 'email', e.target.value)}
                placeholder="hello@designer.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                value={formData.contact?.text || ''}
                onChange={(e) => handleFieldChange('contact', 'text', e.target.value)}
                placeholder="Available for new projects and collaborations."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        )
      }
    ];

    return steps;
  };

  const renderSereneSetup = () => {
    const steps = [
      {
        id: 'basic',
        name: 'Basic Info',
        description: 'Your name and welcome text',
        render: () => (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Name / Logo Text</label>
              <input
                type="text"
                value={formData.navigation?.logo || ''}
                onChange={(e) => handleFieldChange('navigation', 'logo', e.target.value)}
                placeholder="Blossom"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Text / Welcome Message</label>
              <input
                type="text"
                value={formData.gallery?.heading || ''}
                onChange={(e) => handleFieldChange('gallery', 'heading', e.target.value)}
                placeholder="Welcome to My Portfolio"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Second Text / Subtitle</label>
              <input
                type="text"
                value={formData.hero?.subtitle || ''}
                onChange={(e) => handleFieldChange('hero', 'subtitle', e.target.value)}
                placeholder="Creating beauty through design"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        )
      },
      {
        id: 'gallery',
        name: 'Upload Images',
        description: 'Upload up to 10 images for your gallery',
        render: () => {
          // Collect all images from the three rows
          const firstRow = formData.gallery?.firstRow || [];
          const secondRow = formData.gallery?.secondRow || [];
          const thirdRow = formData.gallery?.thirdRow || [];
          const allImages = [...firstRow, ...secondRow, ...thirdRow];
          const imageUrls = allImages.map(img => img?.image || '').filter(Boolean);

          return (
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">
                Upload your portfolio images. You can upload up to 10 images at once.
              </p>
              <MultiImageUpload
                images={imageUrls}
                onImagesChange={(urls) => {
                  // Convert URL array back to gallery image objects
                  // Distribute images into three rows: first 3, next 4, last 3
                  const images = urls.map((url, index) => ({
                    image: url,
                    title: `Project ${index + 1}`,
                    description: 'Project description',
                    price: '',
                    caption: '',
                    span: 2 // Default span for masonry layout
                  }));

                  // Distribute images into rows with proper span values
                  // First row: 3 items with spans [2, 1, 2]
                  const newFirstRow = images.slice(0, 3).map((img, idx) => ({
                    ...img,
                    span: [2, 1, 2][idx] || 2
                  }));

                  // Second row: 4 items with spans [2, 3, 2, 2]
                  const newSecondRow = images.slice(3, 7).map((img, idx) => ({
                    ...img,
                    span: [2, 3, 2, 2][idx] || 2
                  }));

                  // Third row: 3 items with spans [2, 2, 1]
                  const newThirdRow = images.slice(7, 10).map((img, idx) => ({
                    ...img,
                    span: [2, 2, 1][idx] || 2
                  }));

                  // Update gallery with row structure
                  setFormData(prev => ({
                    ...prev,
                    gallery: {
                      ...prev.gallery,
                      firstRow: newFirstRow,
                      secondRow: newSecondRow,
                      thirdRow: newThirdRow
                    }
                  }));
                }}
                maxImages={10}
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-2">
                📌 You can select multiple images at once. Drag and drop to reorder them.
              </p>
            </div>
          );
        }
      },
      {
        id: 'about',
        name: 'About Page',
        description: 'Tell your story in 3 paragraphs',
        render: () => (
          <div className="space-y-6">
            <p className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
              This information will appear on a separate "About" page accessible from your navigation menu.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Paragraph
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Example: "Specializing in minimalist logo design and comprehensive brand identity systems..."
              </p>
              <textarea
                value={formData.about?.paragraph1 || ''}
                onChange={(e) => handleFieldChange('about', 'paragraph1', e.target.value)}
                placeholder="Specializing in minimalist logo design and comprehensive brand identity systems that bring clarity and recognition to modern businesses."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Second Paragraph
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Example: "With over 8 years of experience, I create distinctive logos..."
              </p>
              <textarea
                value={formData.about?.paragraph2 || ''}
                onChange={(e) => handleFieldChange('about', 'paragraph2', e.target.value)}
                placeholder="With over 8 years of experience, I create distinctive logos that capture the essence of brands through clean, memorable design solutions."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Third Paragraph
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Example: "Award-winning logo designer specializing in creating distinctive brand identities..."
              </p>
              <textarea
                value={formData.about?.paragraph3 || ''}
                onChange={(e) => handleFieldChange('about', 'paragraph3', e.target.value)}
                placeholder="Award-winning logo designer specializing in creating distinctive brand identities for global companies across various industries."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        )
      }
    ];

    return steps;
  };

  const renderChicSetup = () => {
    const steps = [
      {
        id: 'hero',
        name: 'Personal Info',
        description: 'Your name and introduction',
        render: () => (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.hero?.name || ''}
                onChange={(e) => handleFieldChange('hero', 'name', e.target.value)}
                placeholder="Your Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Initials</label>
              <input
                type="text"
                value={formData.hero?.initials || ''}
                onChange={(e) => handleFieldChange('hero', 'initials', e.target.value)}
                placeholder="Y.N."
                maxLength={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                value={formData.hero?.bio || ''}
                onChange={(e) => handleFieldChange('hero', 'bio', e.target.value)}
                placeholder="I am a designer focused on..."
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                <input
                  type="url"
                  value={formData.hero?.instagram || ''}
                  onChange={(e) => handleFieldChange('hero', 'instagram', e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                <input
                  type="url"
                  value={formData.hero?.linkedin || ''}
                  onChange={(e) => handleFieldChange('hero', 'linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Behance</label>
                <input
                  type="url"
                  value={formData.hero?.behance || ''}
                  onChange={(e) => handleFieldChange('hero', 'behance', e.target.value)}
                  placeholder="https://behance.net/..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )
      },
      {
        id: 'about',
        name: 'Skills & Experience',
        description: 'What you bring to the table',
        render: () => (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
              <input
                type="text"
                value={formData.about?.skills || ''}
                onChange={(e) => handleFieldChange('about', 'skills', e.target.value)}
                placeholder="Brand Identity, Editorial Design, Typography..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
              <input
                type="text"
                value={formData.about?.experience || ''}
                onChange={(e) => handleFieldChange('about', 'experience', e.target.value)}
                placeholder="5+ years experience working with..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        )
      },
      {
        id: 'work',
        name: 'Projects',
        description: 'Showcase 4 of your best projects',
        render: () => (
          <div className="space-y-6">
            {[0, 1, 2, 3].map(index => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4">Project {index + 1}</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Image</label>
                    <ImageUpload
                      currentImage={formData.work?.projects?.[index]?.image || ''}
                      onImageChange={(url) => {
                        // ImageUpload already handles upload and returns URL
                        handleArrayFieldChange('work', 'projects', index, 'image', url);
                      }}
                      onImageRemove={() => handleArrayFieldChange('work', 'projects', index, 'image', '')}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={formData.work?.projects?.[index]?.title || ''}
                        onChange={(e) => handleArrayFieldChange('work', 'projects', index, 'title', e.target.value)}
                        placeholder="PROJECT NAME"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                      <input
                        type="text"
                        value={formData.work?.projects?.[index]?.subtitle || ''}
                        onChange={(e) => handleArrayFieldChange('work', 'projects', index, 'subtitle', e.target.value)}
                        placeholder="Brand Identity"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.work?.projects?.[index]?.description || ''}
                      onChange={(e) => handleArrayFieldChange('work', 'projects', index, 'description', e.target.value)}
                      placeholder="Brief description of the project..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                      <input
                        type="text"
                        value={formData.work?.projects?.[index]?.year || ''}
                        onChange={(e) => handleArrayFieldChange('work', 'projects', index, 'year', e.target.value)}
                        placeholder="2024"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <input
                        type="text"
                        value={formData.work?.projects?.[index]?.category || ''}
                        onChange={(e) => handleArrayFieldChange('work', 'projects', index, 'category', e.target.value)}
                        placeholder="Branding"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      },
      {
        id: 'contact',
        name: 'Contact Info',
        description: 'How clients can reach you',
        render: () => (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.contact?.email || ''}
                  onChange={(e) => handleFieldChange('contact', 'email', e.target.value)}
                  placeholder="hello@yourname.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.contact?.phone || ''}
                  onChange={(e) => handleFieldChange('contact', 'phone', e.target.value)}
                  placeholder="+1 (123) 456-7890"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Availability Message</label>
              <input
                type="text"
                value={formData.contact?.availability || ''}
                onChange={(e) => handleFieldChange('contact', 'availability', e.target.value)}
                placeholder="Available for freelance work and collaborations"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        )
      }
    ];

    return steps;
  };

  const renderBoldFolioSetup = () => {
    const steps = [
      {
        id: 'hero',
        name: 'Hero Section',
        description: 'Make a bold first impression',
        render: () => (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Title</label>
              <textarea
                value={formData.hero?.title || ''}
                onChange={(e) => handleFieldChange('hero', 'title', e.target.value)}
                placeholder="Driven by passion—and fuelled by curiosity."
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <textarea
                value={formData.hero?.subtitle || ''}
                onChange={(e) => handleFieldChange('hero', 'subtitle', e.target.value)}
                placeholder="Designer and art-director based in Montreal, Quebec."
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.hero?.description || ''}
                onChange={(e) => handleFieldChange('hero', 'description', e.target.value)}
                placeholder="Think of design as a way to transform problems..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Call to Action</label>
              <input
                type="text"
                value={formData.hero?.cta || ''}
                onChange={(e) => handleFieldChange('hero', 'cta', e.target.value)}
                placeholder="Open for collaborations!"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        )
      },
      {
        id: 'work',
        name: 'Projects',
        description: 'Showcase 3 projects with multiple images each',
        render: () => (
          <div className="space-y-8">
            {[0, 1, 2].map(index => {
              const project = formData.work?.projects?.[index] || {};
              const imageCount = index === 0 ? 2 : 2; // Can customize per project

              return (
                <div key={index} className="border-2 border-gray-300 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Project {index + 1}</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                      <input
                        type="text"
                        value={project.title || ''}
                        onChange={(e) => handleArrayFieldChange('work', 'projects', index, 'title', e.target.value)}
                        placeholder={`Project ${index + 1} Title`}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={project.description || ''}
                        onChange={(e) => handleArrayFieldChange('work', 'projects', index, 'description', e.target.value)}
                        placeholder="Brief description..."
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">Project Images</label>
                      {Array.from({ length: imageCount }).map((_, imgIndex) => (
                        <div key={imgIndex} className="bg-gray-50 p-3 rounded border border-gray-200">
                          <label className="block text-xs font-medium text-gray-600 mb-2">
                            Image {imgIndex + 1}
                          </label>
                          <ImageUpload
                            currentImage={project.images?.[imgIndex]?.src || ''}
                            onImageChange={(url) => {
                              // ImageUpload already handles upload and returns URL
                              const updatedImages = [...(project.images || [])];
                              updatedImages[imgIndex] = {
                                ...(updatedImages[imgIndex] || {}),
                                src: url
                              };
                              handleArrayFieldChange('work', 'projects', index, 'images', updatedImages);
                            }}
                            onImageRemove={() => {
                              const updatedImages = [...(project.images || [])];
                              updatedImages[imgIndex] = { ...(updatedImages[imgIndex] || {}), src: '' };
                              handleArrayFieldChange('work', 'projects', index, 'images', updatedImages);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      },
      {
        id: 'about',
        name: 'About',
        description: 'Tell your story',
        render: () => (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.about?.name || ''}
                onChange={(e) => handleFieldChange('about', 'name', e.target.value)}
                placeholder="Your Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <input
                type="text"
                value={formData.about?.role || ''}
                onChange={(e) => handleFieldChange('about', 'role', e.target.value)}
                placeholder="Designer & Art Director"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                value={formData.about?.bio || ''}
                onChange={(e) => handleFieldChange('about', 'bio', e.target.value)}
                placeholder="I believe in design as a transformative force..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.about?.location || ''}
                  onChange={(e) => handleFieldChange('about', 'location', e.target.value)}
                  placeholder="Montreal, Quebec"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.about?.email || ''}
                  onChange={(e) => handleFieldChange('about', 'email', e.target.value)}
                  placeholder="hello@yourname.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )
      }
    ];

    return steps;
  };

  // Select the appropriate setup form based on template
  const getTemplateSteps = () => {
    switch (template?.id) {
      case 'echolon':
        return renderEchelonSetup();
      case 'serene':
        return renderSereneSetup();
      case 'chic':
        return renderChicSetup();
      case 'boldfolio':
        return renderBoldFolioSetup();
      default:
        return [];
    }
  };

  const steps = getTemplateSteps();

  if (!template || steps.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600">Loading template setup...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto py-8 px-8 mt-24">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Setup Your {template.name} Portfolio</h1>
        <p className="text-gray-600">Fill in your information to get started. You can always edit this later.</p>
      </div>

      <Stepper
        initialStep={currentStep}
        onStepChange={(step) => setCurrentStep(step)}
        onFinalStepCompleted={handleComplete}
        backButtonText="Previous"
        nextButtonText="Continue"
        stepCircleContainerClassName="bg-white"
        stepContainerClassName="border-b border-gray-200 pb-8"
        contentClassName="py-12 px-16 pb-16"
        footerClassName="border-t border-gray-200 mt-8"
        backButtonProps={{
          className: "px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
        }}
        nextButtonProps={{
          className: "px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-all hover:shadow-lg",
          style: { backgroundColor: '#FF6B2C' }
        }}
      >
        {steps.map((step) => (
          <Step key={step.id}>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{step.name}</h2>
              {step.description && <p className="text-gray-600">{step.description}</p>}
            </div>
            {step.render()}
          </Step>
        ))}
      </Stepper>

      <div className="mt-8 flex items-center justify-end">
        <button
          onClick={handleComplete}
          className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all"
        >
          Skip Setup & Continue
        </button>
      </div>
    </div>
  );
};

export default TemplateSpecificSetup;
