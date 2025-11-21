import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getProjectIndex, getProjectThumbnail, getProjectTitle } from '../../utils/projectUtils';

const ProjectSidebar = ({
  portfolioId,
  projects = [],
  currentProjectId,
  templateType,
  isOpen: controlledIsOpen,
  onToggle,
  hasUnsavedChanges = false,
  onSaveBeforeNavigate = null // Callback to save before navigating
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(controlledIsOpen ?? true);

  console.log('🎯 ProjectSidebar COMPONENT RENDERED', {
    portfolioId,
    projectsCount: projects?.length,
    projects,
    currentProjectId,
    templateType,
    timestamp: new Date().toISOString()
  });

  // Debug props on mount
  useEffect(() => {
    console.log('ProjectSidebar mounted with props:', {
      portfolioId,
      projectsCount: projects?.length || 0,
      currentProjectId,
      templateType,
      hasProjects: projects && projects.length > 0,
      firstProject: projects?.[0],
      currentURL: window.location.pathname
    });

    // Log all project IDs for debugging
    if (projects && projects.length > 0) {
      console.log('ProjectSidebar: Available projects:',
        projects.map(p => ({
          id: p.id,
          title: getProjectTitle(p),
          navigationPath: `/portfolio-builder/${portfolioId}/project/${p.id}`
        }))
      );
    }

    // Global click listener to debug what's blocking clicks
    const globalClickListener = (e) => {
      const clickX = e.clientX;
      const clickY = e.clientY;
      const elementAtPoint = document.elementFromPoint(clickX, clickY);

      console.log('🔍 GLOBAL CLICK DEBUG:', {
        x: clickX,
        y: clickY,
        elementAtPoint: elementAtPoint,
        elementTag: elementAtPoint?.tagName,
        elementClass: elementAtPoint?.className,
        elementId: elementAtPoint?.id,
        zIndex: window.getComputedStyle(elementAtPoint || document.body).zIndex,
        pointerEvents: window.getComputedStyle(elementAtPoint || document.body).pointerEvents,
        position: window.getComputedStyle(elementAtPoint || document.body).position,
        // Check if click is in sidebar area (left 280px)
        isInSidebarArea: clickX < 280,
        sidebarOpen: isOpen
      });
    };

    document.addEventListener('click', globalClickListener, true);
    return () => document.removeEventListener('click', globalClickListener, true);
  }, [portfolioId, projects, currentProjectId, templateType, isOpen]);

  // Sync with controlled state if provided
  useEffect(() => {
    if (controlledIsOpen !== undefined) {
      setIsOpen(controlledIsOpen);
    }
  }, [controlledIsOpen]);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };

  const handleProjectClick = (e, projectId) => {
    console.log('ProjectSidebar: Handling project click', {
      projectId,
      currentProjectId,
      portfolioId,
      currentURL: window.location.pathname
    });

    if (projectId === currentProjectId) {
      console.log('ProjectSidebar: Same project, skipping navigation');
      e.preventDefault();
      return;
    }

    if (!portfolioId || portfolioId === 'new') {
      console.error('ProjectSidebar: Invalid portfolio ID for navigation', portfolioId);
      e.preventDefault();
      return;
    }

    if (!projectId) {
      console.error('ProjectSidebar: No project ID provided');
      e.preventDefault();
      return;
    }

    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to switch projects?'
      );
      if (!confirmed) {
        e.preventDefault();
        return;
      }
    }

    const navigationPath = `/portfolio-builder/${portfolioId}/project/${projectId}`;
    console.log('ProjectSidebar: Navigation path', navigationPath);

    // Let the Link component handle navigation naturally
    // If for some reason the Link doesn't work, we have a fallback
    setTimeout(() => {
      const currentPath = window.location.pathname;
      console.log('ProjectSidebar: Checking navigation after 100ms', {
        expectedPath: navigationPath,
        currentPath: currentPath
      });

      // If we're still on the same page after 100ms, force navigation
      if (currentPath === window.location.pathname && currentPath !== navigationPath) {
        console.log('ProjectSidebar: Link navigation failed, using fallback');
        window.location.href = navigationPath;
      }
    }, 100);
  };

  const currentIndex = getProjectIndex(projects, currentProjectId);

  return (
    <>
      {/* Toggle Button - Always Visible */}
      <motion.button
        onClick={handleToggle}
        className="fixed top-20 bg-white border border-gray-200 rounded-r-lg shadow-lg hover:bg-gray-50 transition-colors"
        style={{
          left: isOpen ? '280px' : '0px',
          padding: '12px 8px',
          zIndex: 1000001
        }}
        initial={false}
        animate={{ left: isOpen ? '280px' : '0px' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        title={isOpen ? 'Hide sidebar' : 'Show sidebar'}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }}
        >
          <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-lg overflow-y-auto"
            style={{
              width: '280px',
              paddingTop: '80px',
              paddingBottom: '20px',
              zIndex: 1000000,
              pointerEvents: 'auto'
            }}
            onClick={(e) => console.log('Sidebar container clicked', e.target)}
            onMouseEnter={() => console.log('Mouse entered sidebar container')}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Projects
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {projects.length} {projects.length === 1 ? 'project' : 'projects'}
              </p>
            </div>

            {/* Current Project Indicator */}
            {currentIndex > 0 && (
              <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
                <p className="text-xs font-medium text-blue-900">
                  Editing Project {currentIndex}
                </p>
                <p className="text-xs text-blue-700 mt-0.5">
                  {getProjectTitle(projects[currentIndex - 1])}
                </p>
              </div>
            )}

            {/* Project List */}
            <div className="py-2">
              {projects.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500 text-sm">
                  No projects found
                </div>
              ) : (
                projects.map((project, index) => {
                  const isActive = project.id === currentProjectId;
                  const thumbnail = getProjectThumbnail(project, templateType);
                  const title = getProjectTitle(project);
                  const projectNumber = index + 1;

                  return (
                    <div
                      key={project.id || index}
                      onClick={(e) => {
                        e.preventDefault();

                        // Skip if clicking current project
                        if (project.id === currentProjectId) {
                          console.log('ProjectSidebar: Same project, skipping navigation');
                          return;
                        }

                        // Show save reminder if there are unsaved changes
                        if (hasUnsavedChanges) {
                          const shouldContinue = window.confirm(
                            '⚠️ Please save your changes first!\n\nClick the SAVE button before switching projects.\n\nClick OK to continue anyway (unsaved changes will be lost) or Cancel to go back and save.'
                          );
                          if (!shouldContinue) return;
                        }

                        // Navigate with project data in state
                        const navPath = `/portfolio-builder/${portfolioId}/project/${project.id}`;
                        navigate(navPath, {
                          state: {
                            project: project,
                            allProjects: projects,
                            portfolioId: portfolioId,
                            templateType: templateType
                          }
                        });
                      }}
                      onMouseEnter={() => console.log('🖱️ Mouse ENTER on project:', project.id, title)}
                      onMouseLeave={() => console.log('🖱️ Mouse LEAVE on project:', project.id)}
                      style={{ cursor: 'pointer', position: 'relative', zIndex: 10 }}
                    >
                      <motion.div
                        className={`px-4 py-3 cursor-pointer transition-colors ${
                          isActive
                            ? 'bg-blue-100 border-l-4 border-blue-600'
                            : 'hover:bg-gray-50 border-l-4 border-transparent'
                        }`}
                        style={{ pointerEvents: 'auto' }}
                        whileHover={{ scale: isActive ? 1 : 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onMouseEnter={() => console.log('Mouse entered motion.div for project:', project.id)}
                        onClick={() => console.log('Motion.div clicked for project:', project.id)}
                      >
                        <div className="flex items-start gap-3">
                        {/* Thumbnail */}
                        <div
                          className="flex-shrink-0 w-16 h-16 rounded bg-gray-100 overflow-hidden"
                          style={{
                            border: isActive ? '2px solid #2563eb' : '1px solid #e5e7eb'
                          }}
                        >
                          {thumbnail ? (
                            <img
                              src={thumbnail}
                              alt={title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div
                            className="w-full h-full flex items-center justify-center text-gray-400 text-xs"
                            style={{ display: thumbnail ? 'none' : 'flex' }}
                          >
                            No image
                          </div>
                        </div>

                        {/* Project Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-xs font-bold ${
                                isActive ? 'text-blue-600' : 'text-gray-500'
                              }`}
                            >
                              Project {projectNumber}
                            </span>
                            {isActive && (
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="text-blue-600"
                              >
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                              </svg>
                            )}
                          </div>
                          <p
                            className={`text-sm font-medium truncate ${
                              isActive ? 'text-gray-900' : 'text-gray-700'
                            }`}
                            title={title}
                          >
                            {title}
                          </p>
                        </div>
                      </div>
                      </motion.div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Info */}
            <div className="px-4 py-3 mt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-3;">
                Click a project to edit its content
              </p>
              <p className="text-xs text-red-600">
                Please save before editing a project to avoid data loss!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
};

export default ProjectSidebar;
