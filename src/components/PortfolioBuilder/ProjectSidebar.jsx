import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getProjectIndex, getProjectThumbnail, getProjectTitle } from '../../utils/projectUtils';

const ProjectSidebar = ({
  portfolioId,
  projects = [],
  currentProjectId,
  templateType,
  isOpen: controlledIsOpen,
  onToggle,
  hasUnsavedChanges = false
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(controlledIsOpen ?? true);

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

  const handleProjectClick = (projectId) => {
    if (projectId === currentProjectId) return;

    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to switch projects?'
      );
      if (!confirmed) return;
    }

    navigate(`/portfolio-builder/${portfolioId}/project/${projectId}`);
  };

  const currentIndex = getProjectIndex(projects, currentProjectId);

  return (
    <>
      {/* Toggle Button - Always Visible */}
      <motion.button
        onClick={handleToggle}
        className="fixed top-20 z-50 bg-white border border-gray-200 rounded-r-lg shadow-lg hover:bg-gray-50 transition-colors"
        style={{
          left: isOpen ? '280px' : '0px',
          padding: '12px 8px'
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
            className="fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-lg z-40 overflow-y-auto"
            style={{
              width: '280px',
              paddingTop: '80px',
              paddingBottom: '20px'
            }}
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
                    <motion.div
                      key={project.id || index}
                      className={`px-4 py-3 cursor-pointer transition-colors ${
                        isActive
                          ? 'bg-blue-100 border-l-4 border-blue-600'
                          : 'hover:bg-gray-50 border-l-4 border-transparent'
                      }`}
                      onClick={() => handleProjectClick(project.id)}
                      whileHover={{ scale: isActive ? 1 : 1.02 }}
                      whileTap={{ scale: 0.98 }}
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
                  );
                })
              )}
            </div>

            {/* Footer Info */}
            <div className="px-4 py-3 mt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Click a project to edit its content
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={handleToggle}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectSidebar;
