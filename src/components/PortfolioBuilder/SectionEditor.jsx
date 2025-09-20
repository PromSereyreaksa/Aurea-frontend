import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SectionEditor = ({ section, onUpdate }) => {
  // Validate section prop
  if (!section || !section.type || !section.content) {
    console.error('Invalid section prop:', section);
    return <div className="p-4 text-red-600">Error: Invalid section data</div>;
  }

  const [content, setContent] = useState(section.content || {});

  // Track whether the user is actively editing in this editor to avoid overwriting local state
  const isActivelyEditingRef = useRef(false);
  const debounceTimeoutRef = useRef(null);

  useEffect(() => {
    console.log('SectionEditor mounted for type:', section.type);
    return () => {
      console.log('SectionEditor unmounted for type:', section.type);
      // cleanup any pending debounce
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    console.log('SectionEditor received section prop change:', section.type);
    // Only overwrite local content when user is not actively editing
    if (!isActivelyEditingRef.current) {
      setContent(section.content || {});
    } else {
      console.log('SectionEditor: skipping setContent due to active editing');
    }
  }, [section]);

  const handleContentChange = (field, value) => {
    // Mark that the user is actively editing so incoming prop updates don't clobber local state
    isActivelyEditingRef.current = true;

    const newContent = { ...content, [field]: value };
    setContent(newContent);

    // Debounce parent updates to avoid fast parent re-renders that can reset this component.
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      debounceTimeoutRef.current = null;
      // Send update to parent
      try {
        onUpdate(newContent);
      } finally {
        // allow syncing from parent again after a short pause
        isActivelyEditingRef.current = false;
      }
    }, 350); // 350ms debounce
  };

  const handleNestedChange = (parent, field, value) => {
    const newContent = {
      ...content,
      [parent]: {
        ...content[parent],
        [field]: value
      }
    };
    setContent(newContent);
    onUpdate(newContent);
  };

  const handleArrayAdd = (field, newItem) => {
    const newContent = {
      ...content,
      [field]: [...(content[field] || []), newItem]
    };
    setContent(newContent);
    onUpdate(newContent);
  };

  const handleArrayUpdate = (field, index, updatedItem) => {
    const newContent = {
      ...content,
      [field]: content[field].map((item, i) => i === index ? updatedItem : item)
    };
    setContent(newContent);
    onUpdate(newContent);
  };

  const handleArrayRemove = (field, index) => {
    const newContent = {
      ...content,
      [field]: content[field].filter((_, i) => i !== index)
    };
    setContent(newContent);
    onUpdate(newContent);
  };

  const renderEditor = () => {
    console.log('Rendering editor for section type:', section.type);
    switch (section.type) {
      case 'about':
        return <AboutEditor />;
      case 'projects':
        return <ProjectsEditor />;
      case 'contact':
        return <ContactEditor />;
      case 'skills':
        return <SkillsEditor />;
      case 'experience':
        return <ExperienceEditor />;
      case 'education':
        return <EducationEditor />;
      default:
        return <div className="p-4 text-gray-500">Editor for {section.type} not implemented yet</div>;
    }
  };

  const AboutEditor = () => (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={content.title || ''}
          onChange={(e) => handleContentChange('title', e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          placeholder="Your name or title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={content.description || ''}
          onChange={(e) => handleContentChange('description', e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          placeholder="Tell people about yourself..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image URL</label>
        <input
          type="url"
          value={content.image || ''}
          onChange={(e) => handleContentChange('image', e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          placeholder="https://example.com/your-photo.jpg"
        />
        {content.image && (
          <img
            src={content.image}
            alt="Profile preview"
            className="mt-2 w-32 h-32 object-cover rounded"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/150?text=Image+Error';
              console.error('Failed to load image:', content.image);
            }}
          />
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Social Links</label>
        {['linkedin', 'github', 'twitter', 'website'].map(platform => (
          <div key={platform} className="mb-2">
            <label className="block text-xs text-gray-600 mb-1 capitalize">{platform}</label>
            <input
              type="url"
              value={content.socialLinks?.[platform] || ''}
              onChange={(e) => handleNestedChange('socialLinks', platform, e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder={`Your ${platform} URL`}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const ProjectsEditor = () => (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium text-gray-900">Projects</h4>
        <button
          onClick={() => handleArrayAdd('projects', {
            id: Date.now().toString(),
            title: '',
            description: '',
            technologies: [],
            image: 'https://via.placeholder.com/400x300?text=New+Project',
            featured: false,
            liveUrl: ''
          })}
          className="px-3 py-1 bg-black text-white rounded text-sm"
        >
          Add Project
        </button>
      </div>
      <div className="space-y-4">
        {(content.projects || []).map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <h5 className="font-medium text-gray-900">Project {index + 1}</h5>
              <button
                onClick={() => handleArrayRemove('projects', index)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                value={project.title}
                onChange={(e) => handleArrayUpdate('projects', index, { ...project, title: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2"
                placeholder="Project title"
              />
              <input
                type="url"
                value={project.liveUrl || ''}
                onChange={(e) => handleArrayUpdate('projects', index, { ...project, liveUrl: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2"
                placeholder="Live URL"
              />
              <input
                type="url"
                value={project.image || ''}
                onChange={(e) => handleArrayUpdate('projects', index, { ...project, image: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2"
                placeholder="Project image URL"
              />
              {project.image && (
                <img
                  src={project.image}
                  alt={`Project ${project.title} preview`}
                  className="mt-2 w-32 h-32 object-cover rounded"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Image+Error';
                    console.error('Failed to load project image:', project.image);
                  }}
                />
              )}
              <textarea
                value={project.description}
                onChange={(e) => handleArrayUpdate('projects', index, { ...project, description: e.target.value })}
                className="md:col-span-2 border border-gray-300 rounded px-3 py-2"
                placeholder="Project description"
                rows={2}
              />
              <input
                type="text"
                value={project.technologies?.join(', ') || ''}
                onChange={(e) => handleArrayUpdate('projects', index, { 
                  ...project, 
                  technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                })}
                className="border border-gray-300 rounded px-3 py-2"
                placeholder="Technologies (comma-separated)"
              />
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={project.featured || false}
                  onChange={(e) => handleArrayUpdate('projects', index, { ...project, featured: e.target.checked })}
                  className="mr-2"
                />
                Featured project
              </label>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const ContactEditor = () => (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
        <input
          type="text"
          value={content.heading || ''}
          onChange={(e) => handleContentChange('heading', e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          placeholder="Let's Work Together"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={content.description || ''}
          onChange={(e) => handleContentChange('description', e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          placeholder="I'm always interested in new projects and opportunities."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={content.email || ''}
          onChange={(e) => handleContentChange('email', e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          placeholder="your@email.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
        <input
          type="tel"
          value={content.phone || ''}
          onChange={(e) => handleContentChange('phone', e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          placeholder="+1 (555) 123-4567"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
        <input
          type="text"
          value={content.location || ''}
          onChange={(e) => handleContentChange('location', e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          placeholder="City, Country"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea
          value={content.message || ''}
          onChange={(e) => handleContentChange('message', e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          placeholder="Let's work together!"
        />
      </div>
    </div>
  );

  const SkillsEditor = () => (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium text-gray-900">Skills</h4>
        <button
          onClick={() => handleArrayAdd('skills', {
            id: Date.now().toString(),
            name: '',
            level: 50,
            category: 'General'
          })}
          className="px-3 py-1 bg-black text-white rounded text-sm"
        >
          Add Skill
        </button>
      </div>
      <div className="space-y-3">
        {(content.skills || []).map((skill, index) => (
          <div key={skill.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded">
            <input
              type="text"
              value={skill.name}
              onChange={(e) => handleArrayUpdate('skills', index, { ...skill, name: e.target.value })}
              className="flex-1 border border-gray-300 rounded px-3 py-2"
              placeholder="Skill name"
            />
            <input
              type="range"
              min="1"
              max="100"
              value={skill.level}
              onChange={(e) => handleArrayUpdate('skills', index, { ...skill, level: parseInt(e.target.value) })}
              className="w-24"
            />
            <span className="text-sm text-gray-600 w-12">{skill.level}%</span>
            <button
              onClick={() => handleArrayRemove('skills', index)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const ExperienceEditor = () => (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium text-gray-900">Experience</h4>
        <button
          onClick={() => handleArrayAdd('experiences', {
            id: Date.now().toString(),
            title: '',
            company: '',
            startDate: '',
            endDate: '',
            current: false,
            description: ''
          })}
          className="px-3 py-1 bg-black text-white rounded text-sm"
        >
          Add Experience
        </button>
      </div>
      <div className="space-y-4">
        {(content.experiences || []).map((exp, index) => (
          <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <h5 className="font-medium text-gray-900">Experience {index + 1}</h5>
              <button
                onClick={() => handleArrayRemove('experiences', index)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                value={exp.title}
                onChange={(e) => handleArrayUpdate('experiences', index, { ...exp, title: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2"
                placeholder="Job title"
              />
              <input
                type="text"
                value={exp.company}
                onChange={(e) => handleArrayUpdate('experiences', index, { ...exp, company: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2"
                placeholder="Company name"
              />
              <input
                type="date"
                value={exp.startDate}
                onChange={(e) => handleArrayUpdate('experiences', index, { ...exp, startDate: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2"
              />
              <input
                type="date"
                value={exp.endDate}
                onChange={(e) => handleArrayUpdate('experiences', index, { ...exp, endDate: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2"
                disabled={exp.current}
              />
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={exp.current || false}
                  onChange={(e) => handleArrayUpdate('experiences', index, { 
                    ...exp, 
                    current: e.target.checked,
                    endDate: e.target.checked ? '' : exp.endDate
                  })}
                  className="mr-2"
                />
                Current position
              </label>
              <textarea
                value={exp.description}
                onChange={(e) => handleArrayUpdate('experiences', index, { ...exp, description: e.target.value })}
                className="md:col-span-2 border border-gray-300 rounded px-3 py-2"
                placeholder="Job description"
                rows={2}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const EducationEditor = () => (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium text-gray-900">Education</h4>
        <button
          onClick={() => handleArrayAdd('education', {
            id: Date.now().toString(),
            degree: '',
            institution: '',
            startDate: '',
            endDate: '',
            current: false
          })}
          className="px-3 py-1 bg-black text-white rounded text-sm"
        >
          Add Education
        </button>
      </div>
      <div className="space-y-4">
        {(content.education || []).map((edu, index) => (
          <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <h5 className="font-medium text-gray-900">Education {index + 1}</h5>
              <button
                onClick={() => handleArrayRemove('education', index)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => handleArrayUpdate('education', index, { ...edu, degree: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2"
                placeholder="Degree"
              />
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => handleArrayUpdate('education', index, { ...edu, institution: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2"
                placeholder="Institution"
              />
              <input
                type="date"
                value={edu.startDate}
                onChange={(e) => handleArrayUpdate('education', index, { ...edu, startDate: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2"
              />
              <input
                type="date"
                value={edu.endDate}
                onChange={(e) => handleArrayUpdate('education', index, { ...edu, endDate: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2"
                disabled={edu.current}
              />
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={edu.current || false}
                  onChange={(e) => handleArrayUpdate('education', index, { 
                    ...edu, 
                    current: e.target.checked,
                    endDate: e.target.checked ? '' : edu.endDate
                  })}
                  className="mr-2"
                />
                Currently studying
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-50 min-h-[200px] w-full"
    >
      {renderEditor()}
    </motion.div>
  );
};

export default SectionEditor;