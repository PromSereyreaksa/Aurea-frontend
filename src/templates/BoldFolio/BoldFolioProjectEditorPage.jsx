/**
 * BoldFolio Project Detail Editor Page
 * Allows editing project details including multiple images, title, description, and logo
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { portfolioApi } from '../../lib/portfolioApi';
import { useImageUpload } from '../../hooks/useImageUpload';
import useUploadStore from '../../stores/uploadStore';
import ProjectSidebar from '../../components/PortfolioBuilder/ProjectSidebar';
import { getProjectsForTemplate, getProjectIndex } from '../../utils/projectUtils';

const BoldFolioProjectEditorPage = () => {
  const navigate = useNavigate();
  const { portfolioId, projectId } = useParams();
  const { uploadImage } = useImageUpload();
  const { startUpload, getPreviewUrl, getFinalUrl, getProgress } = useUploadStore();

  const [portfolio, setPortfolio] = useState(null);
  const [project, setProject] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [currentUploadId, setCurrentUploadId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Rich text editor for detailed description
  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[200px] max-w-none',
        style: 'font-family: Graphik, sans-serif; color: #000000; line-height: 1.8;'
      }
    }
  });

  // Load portfolio and find project
  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        setLoading(true);
        const data = await portfolioApi.getById(portfolioId);

        console.log('🔍 BOLDFOLIO PROJECT EDITOR DEBUG - Portfolio Data:', {
          portfolioId,
          projectId,
          hasData: !!data,
          hasContent: !!data?.content,
          template: data?.template,
          contentKeys: data?.content ? Object.keys(data.content) : [],
          workProjects: data?.content?.work?.projects,
          workProjectsCount: data?.content?.work?.projects?.length || 0
        });

        setPortfolio(data);

        // Get all projects for sidebar
        const projects = getProjectsForTemplate(data.content, data.template || 'boldfolio');

        console.log('🔍 BOLDFOLIO PROJECT EDITOR DEBUG - Extracted Projects:', {
          projectsCount: projects?.length || 0,
          projects: projects,
          lookingForProjectId: projectId
        });

        setAllProjects(projects);

        // Find the current project
        const foundProject = projects.find(p => p.id === projectId);

        console.log('🔍 BOLDFOLIO PROJECT EDITOR DEBUG - Found Project:', {
          found: !!foundProject,
          project: foundProject
        });

        if (foundProject) {
          setProject(foundProject);
          // Set editor content
          if (editor && foundProject.detailedDescription) {
            editor.commands.setContent(foundProject.detailedDescription.replace(/\n/g, '<br>'));
          }
        } else {
          console.error('❌ BoldFolio Project not found in portfolio data!');
          console.error('Available project IDs:', projects.map(p => p.id));
          console.error('Looking for project ID:', projectId);
          console.error('Full work.projects data:', data?.content?.work?.projects);

          // TEMPORARY: Don't redirect, just show error in UI
          toast.error(`Project "${projectId}" not found. Check console for details.`);

          // Create a dummy project to prevent crash
          setProject({
            id: projectId,
            title: `Project ${projectId} (Not Found)`,
            image: '',
            detailedDescription: 'This project was not found in the portfolio data. Check the console logs for details.'
          });

          // DON'T redirect - comment this out temporarily
          // navigate(`/portfolio-builder/${portfolioId}`);
        }
      } catch (error) {
        console.error('Failed to load portfolio:', error);
        toast.error('Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, [portfolioId, projectId, navigate]);

  // Update editor when project changes
  useEffect(() => {
    if (editor && project?.detailedDescription) {
      editor.commands.setContent(project.detailedDescription.replace(/\n/g, '<br>'));
    }
  }, [project, editor]);

  // Track unsaved changes when project state changes
  useEffect(() => {
    if (project) {
      setHasUnsavedChanges(true);
    }
  }, [project]);

  // Handle image upload for a specific image slot
  const handleImageUpload = async (e, imageIndex) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingIndex(imageIndex);
      const uploadId = startUpload(file);
      setCurrentUploadId(uploadId);

      // Show instant preview
      const previewUrl = getPreviewUrl(uploadId);
      setProject(prev => {
        const images = [...(prev.images || [])];
        if (!images[imageIndex]) {
          images[imageIndex] = { src: '', width: '300px', height: '200px' };
        }
        images[imageIndex] = { ...images[imageIndex], src: previewUrl };
        return { ...prev, images };
      });

      // Upload to Cloudinary
      const uploadedUrl = await uploadImage(file, uploadId);

      if (uploadedUrl) {
        const finalUrl = getFinalUrl(uploadId);
        setProject(prev => {
          const images = [...(prev.images || [])];
          images[imageIndex] = { ...images[imageIndex], src: finalUrl || uploadedUrl };
          return { ...prev, images };
        });
        toast.success('Image uploaded!');
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingIndex(null);
      setCurrentUploadId(null);
    }
  };

  // Add new image slot
  const addImageSlot = () => {
    setProject(prev => ({
      ...prev,
      images: [...(prev.images || []), { src: '', width: '300px', height: '200px' }]
    }));
  };

  // Remove image slot
  const removeImageSlot = (index) => {
    setProject(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index)
    }));
  };

  // Update field
  const updateField = (field, value) => {
    setProject(prev => ({ ...prev, [field]: value }));
  };

  // Update image dimensions
  const updateImageDimensions = (index, dimension, value) => {
    setProject(prev => {
      const images = [...(prev.images || [])];
      images[index] = { ...images[index], [dimension]: value };
      return { ...prev, images };
    });
  };

  // Save changes
  const handleSave = async () => {
    if (!portfolio || !project) return;

    try {
      setSaving(true);

      // Get description from editor
      const editorHTML = editor?.getHTML() || '';
      const textContent = editorHTML
        .replace(/<\/p><p>/g, '\n')
        .replace(/<br\s*\/?>/g, '\n')
        .replace(/<[^>]*>/g, '')
        .trim();

      // Update project in portfolio data
      const updatedContent = { ...portfolio.content };
      const work = { ...updatedContent.work };
      const projects = [...(work.projects || [])];

      const projectIndex = projects.findIndex(p => p.id === projectId);
      if (projectIndex !== -1) {
        projects[projectIndex] = {
          ...projects[projectIndex],
          ...project,
          detailedDescription: textContent
        };
        work.projects = projects;
        updatedContent.work = work;

        // Save to backend
        await portfolioApi.update(portfolioId, { content: updatedContent });

        setHasUnsavedChanges(false);
        toast.success('Project updated successfully!');
      }
    } catch (error) {
      console.error('Failed to save project:', error);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  // Get upload progress
  const uploadProgress = currentUploadId ? getProgress(currentUploadId) : 0;

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-500 text-sm uppercase tracking-wider">
          Loading project...
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  const currentProjectIndex = getProjectIndex(allProjects, projectId);

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Project Sidebar */}
      <ProjectSidebar
        portfolioId={portfolioId}
        projects={allProjects}
        currentProjectId={projectId}
        templateType={portfolio?.template || 'boldfolio'}
        isOpen={sidebarOpen}
        onToggle={setSidebarOpen}
        hasUnsavedChanges={hasUnsavedChanges}
      />

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/98 border-b border-gray-200 z-50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate(`/portfolio-builder/${portfolioId}`)}
            className="flex items-center gap-2 text-sm font-semibold text-pink-600 hover:text-pink-700 uppercase tracking-wide transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 10H5M5 10L10 5M5 10L10 15" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            BACK
          </button>

          <div className="flex-1 text-center text-xs text-gray-500 uppercase tracking-wider">
            {currentProjectIndex > 0 ? `Editing Project ${currentProjectIndex}` : 'Editing Project'}
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-pink-600 text-white text-sm font-bold uppercase tracking-wide rounded hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {saving ? 'SAVING...' : 'SAVE'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Project Title
              </label>
              <input
                type="text"
                value={project.title || ''}
                onChange={(e) => updateField('title', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded text-2xl font-bold focus:border-pink-600 focus:outline-none transition-colors"
                placeholder="Project Title"
              />
            </div>

            {/* Description (HTML) */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Short Description (supports HTML)
              </label>
              <textarea
                value={project.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:border-pink-600 focus:outline-none transition-colors font-sans"
                rows="4"
                placeholder="Use <br /> for line breaks"
              />
              <p className="mt-1 text-xs text-gray-500">
                Supports HTML tags like &lt;br /&gt; for line breaks
              </p>
            </div>

            {/* Logo (HTML) */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Logo (HTML/Text)
              </label>
              <input
                type="text"
                value={project.logo || ''}
                onChange={(e) => updateField('logo', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:border-pink-600 focus:outline-none transition-colors font-mono text-sm"
                placeholder='<span style="...">LOGO</span>'
              />
              <p className="mt-1 text-xs text-gray-500">
                HTML markup for styled logo text
              </p>
            </div>

            {/* Images */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide">
                  Project Images
                </label>
                <button
                  onClick={addImageSlot}
                  className="px-4 py-2 bg-gray-900 text-white text-xs font-bold uppercase tracking-wide rounded hover:bg-gray-800 transition-colors"
                >
                  + Add Image
                </button>
              </div>

              <div className="space-y-4">
                {(project.images || []).map((img, index) => (
                  <div key={index} className="p-4 border-2 border-gray-300 rounded">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-sm font-bold text-pink-600">Image {index + 1}</span>
                      <button
                        onClick={() => removeImageSlot(index)}
                        className="text-red-600 hover:text-red-700 text-sm font-semibold"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Image Preview/Upload */}
                    <div className="mb-3">
                      <div
                        className="relative border-2 border-dashed border-gray-300 rounded overflow-hidden cursor-pointer hover:border-pink-600 transition-colors"
                        style={{ width: '100%', height: '200px' }}
                        onClick={() => document.getElementById(`file-${index}`).click()}
                      >
                        {img.src ? (
                          <img
                            src={img.src}
                            alt={`Project image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                            <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="mt-2 text-sm">Click to upload</p>
                          </div>
                        )}

                        {uploadingIndex === index && (
                          <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center">
                            <div className="w-24 h-24 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="mt-4 text-sm font-semibold text-gray-700">{uploadProgress}%</p>
                          </div>
                        )}
                      </div>

                      <input
                        id={`file-${index}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, index)}
                      />
                    </div>

                    {/* Dimensions */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Width</label>
                        <input
                          type="text"
                          value={img.width || ''}
                          onChange={(e) => updateImageDimensions(index, 'width', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          placeholder="300px"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Height</label>
                        <input
                          type="text"
                          value={img.height || ''}
                          onChange={(e) => updateImageDimensions(index, 'height', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          placeholder="200px"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {(!project.images || project.images.length === 0) && (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No images yet. Click "Add Image" to add one.
                  </div>
                )}
              </div>
            </div>

            {/* Detailed Description */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Detailed Description
              </label>
              <div className="border-2 border-gray-300 rounded p-4 focus-within:border-pink-600 transition-colors">
                <EditorContent editor={editor} />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Rich text description shown on project detail page
              </p>
            </div>

            {/* Link */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                External Link (Optional)
              </label>
              <input
                type="url"
                value={project.link || ''}
                onChange={(e) => updateField('link', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded focus:border-pink-600 focus:outline-none transition-colors"
                placeholder="https://..."
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BoldFolioProjectEditorPage;
