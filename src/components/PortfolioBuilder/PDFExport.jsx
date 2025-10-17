import React, { useState } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';
import toast from 'react-hot-toast';

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottom: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textTransform: 'uppercase',
    borderBottom: 1,
    borderBottomColor: '#D1D5DB',
    paddingBottom: 4,
  },
  text: {
    fontSize: 12,
    lineHeight: 1.6,
    color: '#374151',
    marginBottom: 8,
  },
  projectItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 4,
  },
  projectTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
  },
  projectDescription: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 1.5,
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    padding: 15,
    borderRadius: 6,
  },
  contactItem: {
    fontSize: 11,
    color: '#374151',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillItem: {
    backgroundColor: '#EBF8FF',
    color: '#1E40AF',
    fontSize: 10,
    padding: 6,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
});

// PDF Document Component
const PortfolioPDF = ({ portfolioData, selectedSections }) => {
  const renderSection = (sectionId, sectionData) => {
    if (!selectedSections.includes(sectionId) || !sectionData) return null;

    const getSectionTitle = (id) => {
      const titles = {
        hero: 'Profile',
        about: 'About Me',
        work: 'Selected Work',
        gallery: 'Visual Gallery',
        experience: 'Work Experience',
        education: 'Education',
        skills: 'Skills',
        projects: 'Projects',
        contact: 'Contact Information',
        testimonials: 'Testimonials',
        certifications: 'Certifications',
        portfolio: 'Portfolio',
        services: 'Services'
      };
      return titles[id] || id.charAt(0).toUpperCase() + id.slice(1);
    };

    switch (sectionId) {
      case 'hero':
        return (
          <View style={styles.header} key={sectionId}>
            <Text style={styles.title}>{sectionData.name || 'Portfolio'}</Text>
            <Text style={styles.subtitle}>{sectionData.title || ''}</Text>
            {sectionData.description && (
              <Text style={styles.text}>{sectionData.description}</Text>
            )}
          </View>
        );

      case 'about':
        return (
          <View style={styles.section} key={sectionId}>
            <Text style={styles.sectionTitle}>{sectionData.heading || 'About Me'}</Text>
            <Text style={styles.text}>{sectionData.content || sectionData.description || ''}</Text>
            {sectionData.skills && sectionData.skills.length > 0 && (
              <View style={styles.skillsContainer}>
                {sectionData.skills.map((skill, index) => (
                  <Text style={styles.skillItem} key={index}>
                    {skill}
                  </Text>
                ))}
              </View>
            )}
          </View>
        );

      case 'experience':
        return (
          <View style={styles.section} key={sectionId}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {sectionData.items && sectionData.items.map((item, index) => (
              <View style={styles.projectItem} key={index}>
                <Text style={styles.projectTitle}>
                  {item.position} at {item.company}
                </Text>
                <Text style={styles.text}>
                  {item.startDate} - {item.endDate || 'Present'}
                </Text>
                <Text style={styles.projectDescription}>{item.description}</Text>
              </View>
            ))}
          </View>
        );

      case 'education':
        return (
          <View style={styles.section} key={sectionId}>
            <Text style={styles.sectionTitle}>Education</Text>
            {sectionData.items && sectionData.items.map((item, index) => (
              <View style={styles.projectItem} key={index}>
                <Text style={styles.projectTitle}>
                  {item.degree} - {item.institution}
                </Text>
                <Text style={styles.text}>
                  {item.startDate} - {item.endDate}
                </Text>
                {item.description && (
                  <Text style={styles.projectDescription}>{item.description}</Text>
                )}
              </View>
            ))}
          </View>
        );

      case 'skills':
        return (
          <View style={styles.section} key={sectionId}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsContainer}>
              {sectionData.items && sectionData.items.map((skill, index) => (
                <Text style={styles.skillItem} key={index}>
                  {skill.name || skill}
                </Text>
              ))}
            </View>
          </View>
        );

      case 'work':
        return (
          <View style={styles.section} key={sectionId}>
            <Text style={styles.sectionTitle}>{sectionData.heading || 'Selected Work'}</Text>
            {sectionData.projects && sectionData.projects.map((project, index) => (
              <View style={styles.projectItem} key={index}>
                <Text style={styles.projectTitle}>{project.title}</Text>
                <Text style={styles.projectDescription}>{project.description}</Text>
                {project.meta && (
                  <Text style={styles.text}>{project.meta}</Text>
                )}
                {project.category && (
                  <Text style={styles.text}>Category: {project.category}</Text>
                )}
              </View>
            ))}
          </View>
        );

      case 'gallery':
        return (
          <View style={styles.section} key={sectionId}>
            <Text style={styles.sectionTitle}>{sectionData.heading || 'Visual Gallery'}</Text>
            {sectionData.images && sectionData.images.map((image, index) => (
              <View key={index} style={{ marginBottom: 8 }}>
                <Text style={styles.text}>{image.caption || `Image ${index + 1}`}</Text>
                {image.meta && (
                  <Text style={{ fontSize: 10, color: '#9CA3AF' }}>{image.meta}</Text>
                )}
              </View>
            ))}
          </View>
        );

      case 'projects':
        return (
          <View style={styles.section} key={sectionId}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {sectionData.items && sectionData.items.map((project, index) => (
              <View style={styles.projectItem} key={index}>
                <Text style={styles.projectTitle}>{project.title}</Text>
                <Text style={styles.projectDescription}>{project.description}</Text>
                {project.technologies && (
                  <Text style={styles.text}>
                    Technologies: {project.technologies.join(', ')}
                  </Text>
                )}
                {project.url && (
                  <Text style={styles.text}>URL: {project.url}</Text>
                )}
              </View>
            ))}
          </View>
        );

      case 'contact':
        return (
          <View style={styles.section} key={sectionId}>
            <Text style={styles.sectionTitle}>{sectionData.heading || 'Contact Information'}</Text>
            {sectionData.description && (
              <Text style={styles.text}>{sectionData.description}</Text>
            )}
            {sectionData.social_links && sectionData.social_links.length > 0 && (
              <View style={styles.contactInfo}>
                {sectionData.social_links.map((link, index) => (
                  <Text key={index} style={styles.contactItem}>
                    {link.platform}: {link.url}
                  </Text>
                ))}
              </View>
            )}
            {/* Fallback for legacy format */}
            {!sectionData.social_links && (
              <View style={styles.contactInfo}>
                {sectionData.email && (
                  <Text style={styles.contactItem}>Email: {sectionData.email}</Text>
                )}
                {sectionData.phone && (
                  <Text style={styles.contactItem}>Phone: {sectionData.phone}</Text>
                )}
                {sectionData.location && (
                  <Text style={styles.contactItem}>Location: {sectionData.location}</Text>
                )}
                {sectionData.website && (
                  <Text style={styles.contactItem}>Website: {sectionData.website}</Text>
                )}
              </View>
            )}
          </View>
        );

      default:
        return (
          <View style={styles.section} key={sectionId}>
            <Text style={styles.sectionTitle}>{getSectionTitle(sectionId)}</Text>
            <Text style={styles.text}>
              {sectionData.description || sectionData.content || 'Content not available'}
            </Text>
          </View>
        );
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {Object.entries(portfolioData.content || {}).map(([sectionId, sectionData]) =>
          renderSection(sectionId, sectionData)
        )}
      </Page>
    </Document>
  );
};

// PDF Export Component
const PDFExport = ({ portfolioData, isVisible, onClose }) => {
  const [selectedSections, setSelectedSections] = useState([]);
  const [exportFormat, setExportFormat] = useState('single'); // 'single' or 'multi'
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize selected sections when modal opens
  React.useEffect(() => {
    if (isVisible && portfolioData?.content) {
      const availableSections = Object.keys(portfolioData.content);
      setSelectedSections(availableSections);
    }
  }, [isVisible, portfolioData]);

  const handleSectionToggle = (sectionId) => {
    setSelectedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleSelectAll = () => {
    const allSections = Object.keys(portfolioData?.content || {});
    setSelectedSections(allSections);
  };

  const handleDeselectAll = () => {
    setSelectedSections([]);
  };

  if (!isVisible) return null;

  const getSectionTitle = (id) => {
    const titles = {
      hero: 'Profile',
      about: 'About Me',
      work: 'Selected Work',
      gallery: 'Visual Gallery',
      experience: 'Work Experience',
      education: 'Education',
      skills: 'Skills',
      projects: 'Projects',
      contact: 'Contact Information',
      testimonials: 'Testimonials',
      certifications: 'Certifications',
      portfolio: 'Portfolio',
      services: 'Services'
    };
    return titles[id] || id.charAt(0).toUpperCase() + id.slice(1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Export to PDF</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {/* Export Format */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Export Format</h3>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="single"
                  checked={exportFormat === 'single'}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="mr-2"
                />
                Single Page PDF
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="multi"
                  checked={exportFormat === 'multi'}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="mr-2"
                />
                Multi-Page PDF
              </label>
            </div>
          </div>

          {/* Section Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Select Sections</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Select All
                </button>
                <button
                  onClick={handleDeselectAll}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Deselect All
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
              {Object.keys(portfolioData?.content || {}).map((sectionId) => (
                <label key={sectionId} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedSections.includes(sectionId)}
                    onChange={() => handleSectionToggle(sectionId)}
                    className="mr-3"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {getSectionTitle(sectionId)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {selectedSections.length} section(s) selected
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <PDFDownloadLink
                document={<PortfolioPDF portfolioData={portfolioData} selectedSections={selectedSections} />}
                fileName={`portfolio-${portfolioData?.content?.hero?.name || 'export'}.pdf`}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                onClick={() => {
                  if (selectedSections.length === 0) {
                    toast.error('Please select at least one section to export');
                    return false;
                  }
                  toast.success('PDF generation started!');
                  setTimeout(() => {
                    onClose();
                  }, 1000);
                }}
              >
                {({ loading }) => (
                  <>
                    {loading && (
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {loading ? 'Generating PDF...' : 'Download PDF'}
                  </>
                )}
              </PDFDownloadLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFExport;