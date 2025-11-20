/**
 * Chic Project Detail Editor Page
 * Allows editing project details including image and detailed description
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

const ChicProjectEditorPage = () => {
  const navigate = useNavigate();
  const { portfolioId, projectId } = useParams();
  const { uploadImage } = useImageUpload();
  const { startUpload, getPreviewUrl, getFinalUrl, getProgress } = useUploadStore();

  const [portfolio, setPortfolio] = useState(null);
  const [project, setProject] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
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
        style: 'font-family: "Helvetica Neue", sans-serif; color: #333333; line-height: 1.7;'
      }
    }
  });

  // Load portfolio and find project
  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        setLoading(true);
        const data = await portfolioApi.getById(portfolioId);

        console.log('🔍 CHIC PROJECT EDITOR DEBUG - Portfolio Data:', {
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
        const projects = getProjectsForTemplate(data.content, data.template || 'chic');

        console.log('🔍 CHIC PROJECT EDITOR DEBUG - Extracted Projects:', {
          projectsCount: projects?.length || 0,
          projects: projects,
          lookingForProjectId: projectId
        });

        setAllProjects(projects);

        // Find the current project
        const foundProject = projects.find(p => p.id === projectId);

        console.log('🔍 CHIC PROJECT EDITOR DEBUG - Found Project:', {
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
          console.error('❌ Chic Project not found in portfolio data!');
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

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const uploadId = startUpload(file);
      setCurrentUploadId(uploadId);

      // Show instant preview
      const previewUrl = getPreviewUrl(uploadId);
      setProject(prev => ({ ...prev, image: previewUrl }));

      // Upload to Cloudinary
      const uploadedUrl = await uploadImage(file, uploadId);

      if (uploadedUrl) {
        const finalUrl = getFinalUrl(uploadId);
        setProject(prev => ({ ...prev, image: finalUrl || uploadedUrl }));
        toast.success('Image uploaded!');
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
      setCurrentUploadId(null);
    }
  };

  // Save changes
  const handleSave = async () => {
    if (!portfolio || !project) return;

    try {
      setSaving(true);

      // Get description from editor (convert HTML back to plain text with newlines)
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
        projects[projectIndex] = { ...projects[projectIndex], ...project, detailedDescription: textContent };
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
      <div style={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff'
      }}>
        <div style={{
          fontFamily: '"Helvetica Neue", sans-serif',
          fontSize: '11px',
          color: '#999999',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
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
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#FFFFFF'
    }}>
      {/* Project Sidebar */}
      <ProjectSidebar
        portfolioId={portfolioId}
        projects={allProjects}
        currentProjectId={projectId}
        templateType={portfolio?.template || 'chic'}
        isOpen={sidebarOpen}
        onToggle={setSidebarOpen}
        hasUnsavedChanges={hasUnsavedChanges}
      />

      {/* Header */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderBottom: '1px solid #E5E5E5',
        zIndex: 100,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <button
            onClick={() => navigate(`/portfolio-builder/${portfolioId}`)}
            style={{
              fontFamily: '"Helvetica Neue", sans-serif',
              fontSize: '11px',
              color: '#000000',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 600
            }}
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 10H5M5 10L10 5M5 10L10 15" strokeLinecap="square" strokeLinejoin="miter"/>
            </svg>
            BACK
          </button>

          <div style={{
            fontFamily: '"SF Mono", monospace',
            fontSize: '10px',
            color: '#999999',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            flex: 1,
            textAlign: 'center'
          }}>
            {currentProjectIndex > 0 ? `Editing Project ${currentProjectIndex}` : 'Editing Project'}
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              fontFamily: '"Helvetica Neue", sans-serif',
              fontSize: '11px',
              padding: '10px 24px',
              backgroundColor: saving ? '#CCCCCC' : '#000000',
              color: '#FFFFFF',
              border: 'none',
              cursor: saving ? 'not-allowed' : 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 600,
              opacity: saving ? 0.7 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            {saving ? 'SAVING...' : 'SAVE'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        paddingTop: '80px',
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '80px 32px 80px'
      }}>
        {/* Title Editor */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{
            fontFamily: '"SF Mono", monospace',
            fontSize: '10px',
            color: '#999999',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            display: 'block',
            marginBottom: '12px',
            fontWeight: 600
          }}>
            Project Title
          </label>
          <input
            type="text"
            value={project.title || ''}
            onChange={(e) => setProject({ ...project, title: e.target.value })}
            placeholder="Enter project title"
            style={{
              fontFamily: '"Helvetica Neue", sans-serif',
              fontSize: 'clamp(24px, 4vw, 36px)',
              color: '#000000',
              backgroundColor: '#FFFFFF',
              border: '2px solid #E5E5E5',
              borderRadius: '0',
              padding: '16px',
              width: '100%',
              fontWeight: 600,
              outline: 'none',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#000000'}
            onBlur={(e) => e.target.style.borderColor = '#E5E5E5'}
          />
        </div>

        {/* Subtitle Editor */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{
            fontFamily: '"SF Mono", monospace',
            fontSize: '10px',
            color: '#999999',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            display: 'block',
            marginBottom: '12px',
            fontWeight: 600
          }}>
            Subtitle
          </label>
          <input
            type="text"
            value={project.subtitle || ''}
            onChange={(e) => setProject({ ...project, subtitle: e.target.value })}
            placeholder="Project subtitle"
            style={{
              fontFamily: '"Helvetica Neue", sans-serif',
              fontSize: '16px',
              color: '#666666',
              backgroundColor: '#FFFFFF',
              border: '2px solid #E5E5E5',
              borderRadius: '0',
              padding: '12px 16px',
              width: '100%',
              outline: 'none',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#000000'}
            onBlur={(e) => e.target.style.borderColor = '#E5E5E5'}
          />
        </div>

        {/* Meta Fields Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          {/* Category */}
          <div>
            <label style={{
              fontFamily: '"SF Mono", monospace',
              fontSize: '10px',
              color: '#999999',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              display: 'block',
              marginBottom: '12px',
              fontWeight: 600
            }}>
              Category
            </label>
            <input
              type="text"
              value={project.category || ''}
              onChange={(e) => setProject({ ...project, category: e.target.value })}
              placeholder="Category"
              style={{
                fontFamily: '"Helvetica Neue", sans-serif',
                fontSize: '14px',
                color: '#000000',
                backgroundColor: '#FFFFFF',
                border: '2px solid #E5E5E5',
                borderRadius: '0',
                padding: '10px 14px',
                width: '100%',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#000000'}
              onBlur={(e) => e.target.style.borderColor = '#E5E5E5'}
            />
          </div>

          {/* Year */}
          <div>
            <label style={{
              fontFamily: '"SF Mono", monospace',
              fontSize: '10px',
              color: '#999999',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              display: 'block',
              marginBottom: '12px',
              fontWeight: 600
            }}>
              Year
            </label>
            <input
              type="text"
              value={project.year || ''}
              onChange={(e) => setProject({ ...project, year: e.target.value })}
              placeholder="2024"
              style={{
                fontFamily: '"Helvetica Neue", sans-serif',
                fontSize: '14px',
                color: '#000000',
                backgroundColor: '#FFFFFF',
                border: '2px solid #E5E5E5',
                borderRadius: '0',
                padding: '10px 14px',
                width: '100%',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#000000'}
              onBlur={(e) => e.target.style.borderColor = '#E5E5E5'}
            />
          </div>

          {/* Awards */}
          <div>
            <label style={{
              fontFamily: '"SF Mono", monospace',
              fontSize: '10px',
              color: '#999999',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              display: 'block',
              marginBottom: '12px',
              fontWeight: 600
            }}>
              Awards (Optional)
            </label>
            <input
              type="text"
              value={project.awards || ''}
              onChange={(e) => setProject({ ...project, awards: e.target.value })}
              placeholder="Awards"
              style={{
                fontFamily: '"Helvetica Neue", sans-serif',
                fontSize: '14px',
                color: '#000000',
                backgroundColor: '#FFFFFF',
                border: '2px solid #E5E5E5',
                borderRadius: '0',
                padding: '10px 14px',
                width: '100%',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#000000'}
              onBlur={(e) => e.target.style.borderColor = '#E5E5E5'}
            />
          </div>
        </div>

        {/* Image Upload */}
        <div style={{ marginBottom: '48px' }}>
          <label style={{
            fontFamily: '"SF Mono", monospace',
            fontSize: '10px',
            color: '#999999',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            display: 'block',
            marginBottom: '12px',
            fontWeight: 600
          }}>
            Project Image
          </label>

          <div style={{
            position: 'relative',
            width: '100%',
            border: '2px dashed #E5E5E5',
            borderRadius: '0',
            overflow: 'hidden',
            backgroundColor: '#FAFAFA'
          }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: uploadingImage ? 'not-allowed' : 'pointer',
                zIndex: 10
              }}
            />

            {project.image ? (
              <div style={{ position: 'relative' }}>
                <img
                  src={project.image}
                  alt={project.title}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '500px',
                    objectFit: 'contain',
                    display: 'block',
                    backgroundColor: '#F5F5F5'
                  }}
                />
                {uploadingImage && (
                  <div style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '0',
                    fontFamily: '"SF Mono", monospace',
                    fontSize: '10px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Uploading: {uploadProgress}%
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                height: '400px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
              }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="1.5">
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div style={{
                  fontFamily: '"Helvetica Neue", sans-serif',
                  fontSize: '13px',
                  color: '#999999',
                  textAlign: 'center'
                }}>
                  Click to upload project image<br/>
                  <span style={{ fontSize: '11px' }}>JPG, PNG or GIF</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rich Text Editor for Detailed Description */}
        <div style={{ marginBottom: '48px' }}>
          <label style={{
            fontFamily: '"SF Mono", monospace',
            fontSize: '10px',
            color: '#999999',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            display: 'block',
            marginBottom: '12px',
            fontWeight: 600
          }}>
            Detailed Description
          </label>

          <div style={{
            border: '2px solid #E5E5E5',
            borderRadius: '0',
            padding: '16px',
            backgroundColor: '#FFFFFF',
            minHeight: '300px'
          }}>
            <EditorContent editor={editor} />
          </div>

          <div style={{
            marginTop: '12px',
            fontFamily: '"Helvetica Neue", sans-serif',
            fontSize: '11px',
            color: '#999999',
            fontStyle: 'italic'
          }}>
            This detailed description will appear on the individual project page
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChicProjectEditorPage;
