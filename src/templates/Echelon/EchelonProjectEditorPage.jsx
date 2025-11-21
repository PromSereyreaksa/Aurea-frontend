/**
 * Echelon Project Editor Page
 * Allows editing individual projects in the Echelon template
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { portfolioApi } from '../../lib/portfolioApi';
import ProjectSidebar from '../../components/PortfolioBuilder/ProjectSidebar';
import { getProjectsForTemplate, getProjectIndex } from '../../utils/projectUtils';

const EchelonProjectEditorPage = () => {
  console.log('🚀 EchelonProjectEditorPage COMPONENT LOADED');

  const navigate = useNavigate();
  const location = useLocation();
  const { portfolioId, projectId } = useParams();

  console.log('🚀 EchelonProjectEditorPage params:', { portfolioId, projectId });

  const [portfolio, setPortfolio] = useState(null);
  const [project, setProject] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Rich text editor for detailed description
  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[200px] max-w-none',
        style: 'font-family: "Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif; color: #666666; line-height: 1.8;'
      }
    },
    onUpdate: () => {
      setHasUnsavedChanges(true);
    }
  });

  // Load portfolio and find project - ALWAYS fetch from backend
  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        setLoading(true);

        console.log('📡 Fetching portfolio from backend...');
        const response = await portfolioApi.getById(portfolioId);

        // Extract portfolio from response - handle different response structures
        const data = response?.data?.portfolio || response?.portfolio || response;

        console.log('🔍 ECHELON PROJECT EDITOR - Portfolio Data:', {
          portfolioId,
          projectId,
          hasData: !!data,
          template: data?.template,
          hasWork: !!data?.content?.work,
          projectsCount: data?.content?.work?.projects?.length || 0
        });

        setPortfolio(data);

        // Get all projects from work section
        const projects = getProjectsForTemplate(data.content, data.template || 'echelon');

        console.log('🔍 ECHELON PROJECT EDITOR - Extracted Projects:', {
          projectsCount: projects?.length || 0,
          projectIds: projects?.map(p => p.id),
          lookingForProjectId: projectId
        });

        setAllProjects(projects);

        // Find the current project - try multiple matching strategies
        let foundProject = null;

        // Strategy 1: Direct ID match (as strings)
        foundProject = projects.find(p => String(p.id) === String(projectId));

        // Strategy 2: If projectId is like "project-2", extract the number and match
        if (!foundProject && projectId.startsWith('project-')) {
          const projectNum = parseInt(projectId.replace('project-', ''), 10);
          if (!isNaN(projectNum)) {
            // Try matching by numeric ID
            foundProject = projects.find(p => Number(p.id) === projectNum);
            // Or try matching by index (1-based)
            if (!foundProject && projectNum >= 1 && projectNum <= projects.length) {
              foundProject = projects[projectNum - 1];
            }
          }
        }

        // Strategy 3: If projectId is numeric, try matching
        if (!foundProject && !isNaN(parseInt(projectId, 10))) {
          const numId = parseInt(projectId, 10);
          foundProject = projects.find(p => Number(p.id) === numId);
          // Or by index
          if (!foundProject && numId >= 1 && numId <= projects.length) {
            foundProject = projects[numId - 1];
          }
        }

        console.log('🔍 ECHELON PROJECT EDITOR - Found Project:', {
          found: !!foundProject,
          project: foundProject,
          searchedId: projectId,
          availableIds: projects.map(p => p.id)
        });

        if (foundProject) {
          setProject(foundProject);
          // Set editor content
          if (editor && foundProject.description) {
            editor.commands.setContent(foundProject.description.replace(/\n/g, '<br>'));
          }
        } else {
          console.error('❌ Project not found in portfolio data!');
          console.error('Available project IDs:', projects.map(p => p.id));
          console.error('Looking for project ID:', projectId);

          toast.error(`Project "${projectId}" not found`);

          // Create a dummy project to prevent crash
          setProject({
            id: projectId,
            title: `Project ${projectId} (Not Found)`,
            image: '',
            description: 'This project was not found in the portfolio data.',
            meta: '2025 — Category'
          });
        }
      } catch (error) {
        console.error('Failed to load portfolio:', error);
        toast.error('Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    if (portfolioId && projectId) {
      loadPortfolio();
    }
  }, [portfolioId, projectId]);

  // Update editor when project changes (after initial load)
  useEffect(() => {
    if (editor && project?.description && !editor.getHTML().includes(project.description.substring(0, 20))) {
      editor.commands.setContent(project.description.replace(/\n/g, '<br>'));
    }
  }, [project?.id]);


  // Save changes
  const handleSave = useCallback(async () => {
    console.log('💾 handleSave called', { portfolio: !!portfolio, project: !!project });

    if (!portfolio) {
      console.error('❌ Cannot save: portfolio is null');
      toast.error('Portfolio data not loaded yet');
      return;
    }

    if (!project) {
      console.error('❌ Cannot save: project is null');
      toast.error('Project data not loaded yet');
      return;
    }

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
      const updatedContent = JSON.parse(JSON.stringify(portfolio.content || {}));

      if (!updatedContent.work) {
        updatedContent.work = { projects: [] };
      }

      // Find and update the project - use the actual project.id, not URL projectId
      const actualProjectId = project.id;
      const updatedProjects = (updatedContent.work.projects || []).map(p =>
        String(p.id) === String(actualProjectId)
          ? { ...p, ...project, description: textContent || project.description }
          : p
      );

      updatedContent.work.projects = updatedProjects;

      const updatedProject = updatedProjects.find(p => String(p.id) === String(actualProjectId));

      console.log('💾 Saving Echelon project:', {
        portfolioId,
        actualProjectId,
        urlProjectId: projectId,
        updatedProject,
        totalProjects: updatedProjects.length
      });

      // Save to backend
      const result = await portfolioApi.update(portfolioId, { content: updatedContent });

      console.log('💾 Save result:', result);

      // Update local portfolio state with new content
      setPortfolio(prev => ({ ...prev, content: updatedContent }));

      setHasUnsavedChanges(false);
      toast.success('Project saved!');
    } catch (error) {
      console.error('Failed to save project:', error);
      toast.error('Failed to save: ' + (error.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  }, [portfolio, project, projectId, portfolioId, editor]);

  // Keyboard shortcut (Ctrl+S / Cmd+S)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  if (loading) {
    return (
      <div style={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF'
      }}>
        <div style={{
          fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
          fontSize: '11px',
          color: '#999999',
          textTransform: 'uppercase',
          letterSpacing: '0.3px'
        }}>
          Loading project...
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  const echelonColors = {
    primary: '#000000',
    secondary: '#999999',
    accent: '#FF0000',
    background: '#FFFFFF',
    text: '#333333',
    border: '#DDDDDD'
  };

  const currentProjectIndex = getProjectIndex(allProjects, projectId);

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: echelonColors.background
    }}>
      {/* Project Sidebar */}
      <ProjectSidebar
        portfolioId={portfolioId}
        projects={allProjects}
        currentProjectId={projectId}
        templateType={portfolio?.template || 'echelon'}
        isOpen={sidebarOpen}
        onToggle={setSidebarOpen}
        hasUnsavedChanges={hasUnsavedChanges}
        onSaveBeforeNavigate={handleSave}
      />

      {/* Header */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderBottom: `1px solid ${echelonColors.border}`,
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
              fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: '11px',
              color: echelonColors.primary,
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.3px',
              fontWeight: 700
            }}
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 10H5M5 10L10 5M5 10L10 15" strokeLinecap="square" strokeLinejoin="miter"/>
            </svg>
            BACK
          </button>

          <div style={{
            fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: '11px',
            color: echelonColors.secondary,
            textTransform: 'uppercase',
            letterSpacing: '0.3px',
            flex: 1,
            textAlign: 'center',
            fontWeight: 700
          }}>
            {currentProjectIndex > 0 ? `EDITING PROJECT ${currentProjectIndex}` : 'EDITING PROJECT'}
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: '11px',
              padding: '12px 24px',
              backgroundColor: saving ? '#CCCCCC' : echelonColors.primary,
              color: echelonColors.background,
              border: 'none',
              cursor: saving ? 'not-allowed' : 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.3px',
              fontWeight: 700,
              opacity: saving ? 0.6 : 1,
              transition: 'all 0.2s ease'
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
        padding: '100px 32px 80px'
      }}>
        {/* Title Editor */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{
            fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: '11px',
            color: echelonColors.secondary,
            textTransform: 'uppercase',
            letterSpacing: '0.3px',
            display: 'block',
            marginBottom: '12px',
            fontWeight: 700
          }}>
            PROJECT TITLE
          </label>
          <input
            type="text"
            value={project.title || ''}
            onChange={(e) => {
              setProject({ ...project, title: e.target.value });
              setHasUnsavedChanges(true);
            }}
            placeholder="Project Title"
            style={{
              fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: 'clamp(28px, 5vw, 48px)',
              color: echelonColors.primary,
              backgroundColor: echelonColors.background,
              border: `2px solid ${echelonColors.border}`,
              borderRadius: '0',
              padding: '16px',
              width: '100%',
              fontWeight: 900,
              outline: 'none',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = echelonColors.primary}
            onBlur={(e) => e.target.style.borderColor = echelonColors.border}
          />
        </div>

        {/* Meta Info Editor */}
        <div style={{ marginBottom: '48px' }}>
          <label style={{
            fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: '11px',
            color: echelonColors.secondary,
            textTransform: 'uppercase',
            letterSpacing: '0.3px',
            display: 'block',
            marginBottom: '12px',
            fontWeight: 700
          }}>
            META INFO (e.g., "2025 — BRANDING")
          </label>
          <input
            type="text"
            value={project.meta || ''}
            onChange={(e) => {
              setProject({ ...project, meta: e.target.value });
              setHasUnsavedChanges(true);
            }}
            placeholder="2025 — Category"
            style={{
              fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: '11px',
              color: echelonColors.secondary,
              backgroundColor: echelonColors.background,
              border: `2px solid ${echelonColors.border}`,
              borderRadius: '0',
              padding: '12px 16px',
              width: '100%',
              outline: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.3px',
              fontWeight: 600,
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = echelonColors.primary}
            onBlur={(e) => e.target.style.borderColor = echelonColors.border}
          />
        </div>

        {/* Project Image (Read-only) */}
        <div style={{ marginBottom: '48px' }}>
          <label style={{
            fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: '11px',
            color: echelonColors.secondary,
            textTransform: 'uppercase',
            letterSpacing: '0.3px',
            display: 'block',
            marginBottom: '12px',
            fontWeight: 700
          }}>
            PROJECT IMAGE
          </label>

          <div style={{
            position: 'relative',
            width: '100%',
            border: `2px solid ${echelonColors.border}`,
            borderRadius: '0',
            overflow: 'hidden',
            backgroundColor: '#FAFAFA'
          }}>
            {project.image ? (
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
            ) : (
              <div style={{
                height: '200px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px'
              }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={echelonColors.secondary} strokeWidth="1">
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="square" strokeLinejoin="miter"/>
                </svg>
                <div style={{
                  fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                  fontSize: '11px',
                  color: echelonColors.secondary,
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                  fontWeight: 700
                }}>
                  NO IMAGE SET
                </div>
              </div>
            )}
          </div>

          <div style={{
            marginTop: '12px',
            fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: '10px',
            color: echelonColors.secondary,
            fontStyle: 'italic',
            textTransform: 'uppercase',
            letterSpacing: '0.3px'
          }}>
            To change the image, go back to the portfolio builder
          </div>
        </div>

        {/* Rich Text Editor for Description */}
        <div style={{ marginBottom: '48px' }}>
          <label style={{
            fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: '11px',
            color: echelonColors.secondary,
            textTransform: 'uppercase',
            letterSpacing: '0.3px',
            display: 'block',
            marginBottom: '12px',
            fontWeight: 700
          }}>
            PROJECT DESCRIPTION
          </label>

          <div style={{
            border: `2px solid ${echelonColors.border}`,
            borderRadius: '0',
            padding: '20px',
            backgroundColor: echelonColors.background,
            minHeight: '300px'
          }}>
            <EditorContent editor={editor} />
          </div>

          <div style={{
            marginTop: '12px',
            fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: '10px',
            color: echelonColors.secondary,
            fontStyle: 'italic',
            textTransform: 'uppercase',
            letterSpacing: '0.3px'
          }}>
            This description appears in the project grid
          </div>
        </div>

        {/* Save Reminder */}
        {hasUnsavedChanges && (
          <div style={{
            padding: '16px 24px',
            backgroundColor: '#FFF9E6',
            border: `2px solid #FFD700`,
            borderRadius: '0',
            fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: '11px',
            color: '#CC9900',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '0.3px',
            fontWeight: 700,
            marginBottom: '32px'
          }}>
            YOU HAVE UNSAVED CHANGES — CLICK SAVE OR PRESS CTRL+S
          </div>
        )}
      </div>
    </div>
  );
};

export default EchelonProjectEditorPage;
