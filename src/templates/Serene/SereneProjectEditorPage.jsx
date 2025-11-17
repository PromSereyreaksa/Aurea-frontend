/**
 * Serene Project Detail Editor Page
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

const SereneProjectEditorPage = () => {
  const navigate = useNavigate();
  const { portfolioId, projectId } = useParams();
  const { uploadImage } = useImageUpload();
  const { startUpload, getPreviewUrl, getFinalUrl, getProgress } = useUploadStore();

  const [portfolio, setPortfolio] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [currentUploadId, setCurrentUploadId] = useState(null);

  // Rich text editor for detailed description
  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[200px] max-w-none',
        style: 'font-family: "Inter", sans-serif; color: #6b7280; line-height: 1.8;'
      }
    }
  });

  // Load portfolio and find project
  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        setLoading(true);
        const data = await portfolioApi.getById(portfolioId);
        setPortfolio(data);

        // Find the project
        const content = data.content || {};
        const gallery = content.gallery || {};
        const allProjects = [
          ...(gallery.firstRow || []),
          ...(gallery.secondRow || []),
          ...(gallery.thirdRow || [])
        ];

        const foundProject = allProjects.find(p => p.id === projectId);
        if (foundProject) {
          setProject(foundProject);
          // Set editor content
          if (editor && foundProject.detailedDescription) {
            editor.commands.setContent(foundProject.detailedDescription.replace(/\n/g, '<br>'));
          }
        } else {
          toast.error('Project not found');
          navigate(`/portfolio-builder/${portfolioId}`);
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
      const gallery = { ...updatedContent.gallery };

      // Find and update the project in the correct row
      const updateProjectInRow = (row) => {
        return row.map(p => p.id === projectId ? { ...p, ...project, detailedDescription: textContent } : p);
      };

      gallery.firstRow = updateProjectInRow(gallery.firstRow || []);
      gallery.secondRow = updateProjectInRow(gallery.secondRow || []);
      gallery.thirdRow = updateProjectInRow(gallery.thirdRow || []);

      updatedContent.gallery = gallery;

      // Save to backend
      await portfolioApi.update(portfolioId, { content: updatedContent });

      toast.success('Project updated successfully!');
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
          fontFamily: '"Inter", sans-serif',
          fontSize: '14px',
          color: '#9ca3af',
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

  const sereneColors = {
    primary: '#4a5568',
    secondary: '#9ca3af',
    accent: '#e5e7eb',
    background: '#ffffff',
    text: '#6b7280',
    border: '#e5e7eb'
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: sereneColors.background
    }}>
      {/* Header */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderBottom: `1px solid ${sereneColors.border}`,
        zIndex: 100,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <button
            onClick={() => navigate(`/portfolio-builder/${portfolioId}`)}
            style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '14px',
              color: sereneColors.primary,
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 500
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 10H5M5 10L10 5M5 10L10 15" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>

          <div style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '12px',
            color: sereneColors.secondary,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            flex: 1,
            textAlign: 'center'
          }}>
            Editing Project
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '14px',
              padding: '10px 24px',
              backgroundColor: saving ? '#999999' : sereneColors.primary,
              color: sereneColors.background,
              border: 'none',
              cursor: saving ? 'not-allowed' : 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 500,
              opacity: saving ? 0.7 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        paddingTop: '80px',
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '80px 24px 80px'
      }}>
        {/* Title Editor */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '12px',
            color: sereneColors.secondary,
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
              fontFamily: '"Inter", sans-serif',
              fontSize: 'clamp(24px, 4vw, 36px)',
              color: sereneColors.primary,
              backgroundColor: sereneColors.background,
              border: `2px solid ${sereneColors.border}`,
              borderRadius: '4px',
              padding: '16px',
              width: '100%',
              fontWeight: 400,
              outline: 'none',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = sereneColors.primary}
            onBlur={(e) => e.target.style.borderColor = sereneColors.border}
          />
        </div>

        {/* Short Description Editor */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '12px',
            color: sereneColors.secondary,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            display: 'block',
            marginBottom: '12px',
            fontWeight: 600
          }}>
            Short Description (Gallery Preview)
          </label>
          <input
            type="text"
            value={project.description || ''}
            onChange={(e) => setProject({ ...project, description: e.target.value })}
            placeholder="Brief description for gallery view"
            style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '16px',
              color: sereneColors.text,
              backgroundColor: sereneColors.background,
              border: `2px solid ${sereneColors.border}`,
              borderRadius: '4px',
              padding: '12px 16px',
              width: '100%',
              outline: 'none',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = sereneColors.primary}
            onBlur={(e) => e.target.style.borderColor = sereneColors.border}
          />
        </div>

        {/* Image Upload */}
        <div style={{ marginBottom: '48px' }}>
          <label style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '12px',
            color: sereneColors.secondary,
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
            border: `2px dashed ${sereneColors.border}`,
            borderRadius: '4px',
            overflow: 'hidden',
            backgroundColor: sereneColors.accent
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
                    objectFit: 'cover',
                    display: 'block'
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
                    borderRadius: '4px',
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '12px',
                    fontWeight: 600
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
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={sereneColors.secondary} strokeWidth="1.5">
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div style={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '14px',
                  color: sereneColors.secondary,
                  textAlign: 'center'
                }}>
                  Click to upload project image<br/>
                  <span style={{ fontSize: '12px' }}>JPG, PNG or GIF</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rich Text Editor for Detailed Description */}
        <div style={{ marginBottom: '48px' }}>
          <label style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '12px',
            color: sereneColors.secondary,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            display: 'block',
            marginBottom: '12px',
            fontWeight: 600
          }}>
            Detailed Description
          </label>

          <div style={{
            border: `2px solid ${sereneColors.border}`,
            borderRadius: '4px',
            padding: '16px',
            backgroundColor: sereneColors.background,
            minHeight: '300px'
          }}>
            <EditorContent editor={editor} />
          </div>

          <div style={{
            marginTop: '12px',
            fontFamily: '"Inter", sans-serif',
            fontSize: '12px',
            color: sereneColors.secondary,
            fontStyle: 'italic'
          }}>
            This detailed description will appear on the individual project page
          </div>
        </div>
      </div>
    </div>
  );
};

export default SereneProjectEditorPage;
