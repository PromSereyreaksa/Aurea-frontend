/**
 * Utility functions for working with portfolio projects across different templates
 */

/**
 * Extract all projects from portfolio content based on template type
 * @param {Object} content - Portfolio content object
 * @param {string} templateId - Template ID ('chic', 'serene', 'boldfolio', 'echolon')
 * @returns {Array} Array of project objects
 */
export const getProjectsForTemplate = (content, templateId) => {
  if (!content) return [];

  switch (templateId) {
    case 'chic':
      return content.work?.projects || [];

    case 'serene':
    case 'blossom':
      // Serene/Blossom stores projects across three rows
      return [
        ...(content.gallery?.firstRow || []),
        ...(content.gallery?.secondRow || []),
        ...(content.gallery?.thirdRow || [])
      ];

    case 'boldfolio':
      return content.work?.projects || [];

    case 'echolon':
    case 'echelon':
      // Echelon uses case studies
      return content.caseStudies || [];

    default:
      // Try to find projects in common locations
      return content.work?.projects || content.projects || [];
  }
};

/**
 * Get project number (1-based index) from project ID
 * @param {Array} projects - Array of project objects
 * @param {string} projectId - Project ID to find
 * @returns {number} 1-based project number, or 0 if not found
 */
export const getProjectIndex = (projects, projectId) => {
  const index = projects.findIndex(p => p.id === projectId);
  return index >= 0 ? index + 1 : 0;
};

/**
 * Get thumbnail image URL for a project
 * @param {Object} project - Project object
 * @param {string} templateId - Template ID
 * @returns {string} Image URL or empty string
 */
export const getProjectThumbnail = (project, templateId) => {
  if (!project) return '';

  switch (templateId) {
    case 'chic':
      return project.image || '';

    case 'serene':
    case 'blossom':
      return project.image || '';

    case 'boldfolio':
      // BoldFolio can have multiple images, use first one
      if (project.images && project.images.length > 0) {
        return project.images[0].src || '';
      }
      return '';

    case 'echolon':
    case 'echelon':
      return project.coverImage || project.image || '';

    default:
      return project.image || project.thumbnail || '';
  }
};

/**
 * Get project title for display
 * @param {Object} project - Project object
 * @returns {string} Project title
 */
export const getProjectTitle = (project) => {
  if (!project) return 'Untitled Project';
  return project.title || project.name || 'Untitled Project';
};

/**
 * Generate a default project ID if missing
 * @param {string} templateId - Template ID
 * @param {number} index - Project index (0-based)
 * @returns {string} Generated project ID
 */
export const generateProjectId = (templateId, index) => {
  return `${templateId}-project-${index + 1}`;
};

/**
 * Ensure all projects have valid IDs
 * @param {Array} projects - Array of project objects
 * @param {string} templateId - Template ID
 * @returns {Array} Projects with ensured IDs
 */
export const ensureProjectIds = (projects, templateId) => {
  return projects.map((project, index) => {
    if (!project.id) {
      return {
        ...project,
        id: generateProjectId(templateId, index)
      };
    }
    return project;
  });
};

/**
 * Get project by ID from content
 * @param {Object} content - Portfolio content
 * @param {string} templateId - Template ID
 * @param {string} projectId - Project ID to find
 * @returns {Object|null} Project object or null if not found
 */
export const getProjectById = (content, templateId, projectId) => {
  const projects = getProjectsForTemplate(content, templateId);
  return projects.find(p => p.id === projectId) || null;
};

/**
 * Update a specific project in content structure
 * @param {Object} content - Portfolio content
 * @param {string} templateId - Template ID
 * @param {string} projectId - Project ID to update
 * @param {Object} updatedProject - Updated project data
 * @returns {Object} Updated content object
 */
export const updateProjectInContent = (content, templateId, projectId, updatedProject) => {
  const newContent = { ...content };

  switch (templateId) {
    case 'chic':
      if (newContent.work?.projects) {
        newContent.work.projects = newContent.work.projects.map(p =>
          p.id === projectId ? { ...p, ...updatedProject } : p
        );
      }
      break;

    case 'serene':
    case 'blossom':
      // Update in the appropriate row
      ['firstRow', 'secondRow', 'thirdRow'].forEach(row => {
        if (newContent.gallery?.[row]) {
          newContent.gallery[row] = newContent.gallery[row].map(p =>
            p.id === projectId ? { ...p, ...updatedProject } : p
          );
        }
      });
      break;

    case 'boldfolio':
      if (newContent.work?.projects) {
        newContent.work.projects = newContent.work.projects.map(p =>
          p.id === projectId ? { ...p, ...updatedProject } : p
        );
      }
      break;

    default:
      if (newContent.work?.projects) {
        newContent.work.projects = newContent.work.projects.map(p =>
          p.id === projectId ? { ...p, ...updatedProject } : p
        );
      }
  }

  return newContent;
};
