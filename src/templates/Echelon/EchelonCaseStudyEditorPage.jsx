import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import usePortfolioStore from '../../stores/portfolioStore';
import caseStudyApi from '../../lib/caseStudyApi';
import api from '../../lib/baseApi';
import { uploadDirectToCloudinary } from '../../lib/cloudinaryDirectUpload';
import FloatingActionButtons from '../../components/PortfolioBuilder/FloatingActionButtons';

const CaseStudyEditorPage = () => {
  const { portfolioId, projectId } = useParams();
  const navigate = useNavigate();
  const { portfolios } = usePortfolioStore();
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [caseStudyId, setCaseStudyId] = useState(null); // Track if editing existing case study
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Case study content state - matching the static template structure
  const [caseStudy, setCaseStudy] = useState({
    title: 'LOGO DESIGN PROCESS',
    category: 'BRANDING / IDENTITY',
    year: '2025',
    intro: 'In this article I will share my logo design process from start to finish, that I have built in 8 years as a graphic designer.',
    heroImage: '',
    heroImageCaption: 'Figure 01 — Design Process Framework',
    steps: [
      { num: '01', title: 'RESEARCH', desc: 'Understanding the brand and market' },
      { num: '02', title: 'SKETCH', desc: 'Exploring concepts on paper' },
      { num: '03', title: 'DIGITAL', desc: 'Refining and digitizing' },
      { num: '04', title: 'SOURCE FILES', desc: 'Delivering final assets' }
    ],
    sections: [
      {
        id: 1,
        number: '01',
        title: 'RESEARCH',
        subsections: [
          {
            id: 11,
            title: 'QUESTIONNAIRE',
            content: 'After receiving an email and discussing terms and price with the client, getting paid with 50% payment I send them a Google Form Questionnaire that gets completed with the relevant info about their brand, vision and needs.\n\nThis is a crucial part of the research process because it eliminates a lot of guesses and it helps you better understand, what is it that the client wants and what should you do about it.',
            image: '',
            imageCaption: 'Figure 02 — Keyword Analysis',
            additionalContext: 'Additional context about this image can be added here...'
          },
          {
            id: 12,
            title: 'DIG DEEP',
            content: 'With the form printed I start to read it and mark keywords that would help in narrowing down possible ideas / concepts for the logo. I also do competitor analysis and try to gather as much info about the brand as I can.',
            image: ''
          }
        ]
      },
      {
        id: 2,
        number: '02',
        title: 'SKETCH',
        subsections: [
          {
            id: 21,
            title: 'ITERATE',
            content: 'After the research phase, I start sketching out ideas on paper. This is where the magic happens - multiple iterations, exploring different directions, and refining concepts.',
            image: '',
            imageCaption: 'Figure 03 — Sketch Process'
          }
        ]
      },
      {
        id: 3,
        number: '03',
        title: 'DIGITAL',
        subsections: [
          {
            id: 31,
            title: 'VECTORIZE',
            content: 'The best sketches are brought into Adobe Illustrator where they are refined, adjusted, and perfected. This is where the logo comes to life in its digital form.',
            image: '',
            imageCaption: 'Figure 04 — Digital Refinement'
          }
        ]
      },
      {
        id: 4,
        number: '04',
        title: 'SOURCE FILES',
        subsections: [
          {
            id: 41,
            title: 'PACKAGE',
            content: 'Final delivery includes all logo variations, color schemes, typography guidelines, and usage instructions. Everything the client needs to implement their new brand.',
            image: '',
            imageCaption: 'Figure 05 — Final Deliverables'
          }
        ]
      }
    ]
  });

  useEffect(() => {
    // Load existing case study data from API
    const loadCaseStudy = async () => {
      try {
        setIsLoading(true);
        
        // ========================================
        // 🔍 DIAGNOSTIC LOGGING
        // ========================================
        console.log('\n' + '='.repeat(80));
        console.log('🔍 CASE STUDY EDITOR - DIAGNOSTIC');
        console.log('='.repeat(80));
        console.log('� URL Parameters:');
        console.log('   Portfolio ID:', portfolioId);
        console.log('   Project ID:', projectId);
        console.log('   Project ID Type:', typeof projectId);
        console.log('   Token exists:', !!localStorage.getItem('aurea_token'));
        console.log('   Current URL:', window.location.pathname);
        
        // First, let's check what's in the portfolio
        try {
          console.log('\n📦 Fetching portfolio to check projects...');
          const portfolioResponse = await api.get(`/api/portfolios/${portfolioId}`);
          const portfolio = portfolioResponse.data.data.portfolio;
          
          console.log('✅ Portfolio found:', portfolio.title);
          console.log('   Portfolio ID:', portfolio._id);
          console.log('   Template:', portfolio.templateId);
          
          const projects = portfolio.content?.work?.projects || [];
          console.log('\n📋 Projects in portfolio:', projects.length);
          projects.forEach((p, i) => {
            console.log(`   ${i + 1}. ID: "${p.id}" (${typeof p.id}) - ${p.title}`);
          });
          
          console.log('\n⚠️ PROJECT ID TYPE CHECK:');
          console.log('   Frontend projectId:', projectId, `(type: ${typeof projectId})`);
          console.log('   Backend project IDs:', projects.map(p => `${p.id} (${typeof p.id})`));
          
          console.log('\n📚 Case Studies in portfolio:', portfolio.caseStudies?.length || 0);
          if (portfolio.caseStudies?.length > 0) {
            portfolio.caseStudies.forEach((csId, i) => {
              console.log(`   ${i + 1}. Case Study ID: ${csId}`);
            });
          }
          
          // Check if the project exists
          const projectExists = projects.some(p => String(p.id) === String(projectId));
          console.log(`\n🎯 Looking for project with ID: "${projectId}"`);
          console.log(`   Project exists in portfolio: ${projectExists ? '✅ YES' : '❌ NO'}`);
          
          if (!projectExists) {
            console.warn('⚠️ WARNING: The project ID from URL does not match any project in the portfolio!');
            console.warn('   Available project IDs:', projects.map(p => p.id));
            console.warn('   Requested project ID:', projectId);
          }
        } catch (portfolioError) {
          console.error('❌ Error fetching portfolio:', portfolioError);
        }
        
        console.log('\n🔍 Now attempting to fetch case study...');
        console.log('='.repeat(80) + '\n');
        // ========================================
        // END DIAGNOSTIC
        // ========================================
        
        const response = await caseStudyApi.getByPortfolioAndProject(portfolioId, projectId);
        
        if (response.success && response.data?.caseStudy) {
          const existingCaseStudy = response.data.caseStudy;
          console.log('✅ Case study found:', existingCaseStudy);
          
          // Save the case study ID for updates
          if (existingCaseStudy._id) {
            setCaseStudyId(existingCaseStudy._id);
            console.log('📌 Case study ID saved for updates:', existingCaseStudy._id);
          }
          
          // Transform API data back to editor's expected format
          const transformedSections = (existingCaseStudy.content?.sections || []).map((section, index) => {
            // Parse the combined content back into subsections
            const contentParts = section.content ? section.content.split('\n\n---\n\n') : [];
            const subsections = contentParts.map((part, subIndex) => {
              const lines = part.split('\n\n');
              return {
                id: parseInt(section.id.replace('section-', '')) * 10 + subIndex + 1,
                title: lines[0] || 'SUBSECTION TITLE',
                content: lines.slice(1).join('\n\n') || '',
                image: section.images?.[subIndex] || section.image || '',
                imageCaption: `Figure ${String(index + 2).padStart(2, '0')} — Image Caption`,
                additionalContext: ''
              };
            });

            // If no subsections, create a default one
            if (subsections.length === 0) {
              subsections.push({
                id: (index + 1) * 10 + 1,
                title: 'SUBSECTION TITLE',
                content: section.content || '',
                image: section.image || '',
                imageCaption: `Figure ${String(index + 2).padStart(2, '0')} — Image Caption`,
                additionalContext: ''
              });
            }

            return {
              id: index + 1,
              number: String(index + 1).padStart(2, '0'),
              title: section.heading || 'SECTION TITLE',
              subsections
            };
          });

          const loadedCaseStudy = {
            title: existingCaseStudy.content?.hero?.title || 'LOGO DESIGN PROCESS',
            category: existingCaseStudy.content?.hero?.subtitle || 'BRANDING / IDENTITY',
            year: existingCaseStudy.content?.hero?.year || '2025',
            intro: existingCaseStudy.content?.overview?.description || 'Project introduction...',
            heroImage: existingCaseStudy.content?.hero?.coverImage || '',
            heroImageCaption: 'Figure 01 — Design Process Framework',
            steps: caseStudy.steps, // Keep default steps for now
            sections: transformedSections.length > 0 ? transformedSections : caseStudy.sections
          };

          console.log('📥 Loading case study with:');
          console.log('   Hero Image from API:', existingCaseStudy.content?.hero?.coverImage);
          console.log('   Sections from API:', existingCaseStudy.content?.sections?.length || 0);
          existingCaseStudy.content?.sections?.forEach((s, i) => {
            console.log(`   Section ${i + 1}: image=${s.image || '(none)'}, images=[${s.images?.join(', ') || '(empty)'}]`);
          });

          setCaseStudy(loadedCaseStudy);

          console.log('✅ Case study loaded and transformed');
        }
      } catch (error) {
        if (error.response?.status === 404) {
          console.log('📝 No existing case study found, using template defaults');
        } else {
          console.error('❌ Error loading case study:', error);
        }
        // Keep default template structure
      } finally {
        setIsLoading(false);
      }
    };

    if (portfolioId && projectId) {
      loadCaseStudy();
    }
  }, [portfolioId, projectId]);

  // Keyboard shortcut for save (Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [caseStudy]);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      console.log('\n' + '='.repeat(80));
      console.log('💾 CASE STUDY SAVE - DIAGNOSTIC');
      console.log('='.repeat(80));
      console.log('📍 Parameters:');
      console.log('   Portfolio ID:', portfolioId, `(type: ${typeof portfolioId})`);
      console.log('   Project ID:', projectId, `(type: ${typeof projectId})`);
      console.log('   Case Study ID:', caseStudyId || 'None (will create new)');
      console.log('   Operation:', caseStudyId ? 'UPDATE' : 'CREATE');

      // Check if any images are still uploading
      console.log('🔍 Checking upload state:', { isUploadingImage });
      if (isUploadingImage) {
        toast.error('Please wait for image upload to complete before saving.');
        setIsSaving(false);
        return;
      }

      // Helper to check if URL is a blob URL (local preview)
      const isBlobUrl = (url) => url && url.startsWith('blob:');

      // Check for pending blob URLs that haven't been uploaded yet
      const pendingHeroImage = isBlobUrl(caseStudy.heroImage);
      const pendingSectionImages = caseStudy.sections.flatMap(section =>
        section.subsections?.filter(sub => isBlobUrl(sub.image)).map(sub => sub.image) || []
      );

      console.log('🔍 Checking for blob URLs:', {
        heroImage: caseStudy.heroImage,
        heroIsBlobUrl: pendingHeroImage,
        pendingSectionImages
      });

      if (pendingHeroImage || pendingSectionImages.length > 0) {
        toast.error('Some images are still being uploaded. Please wait and try again.');
        setIsSaving(false);
        return;
      }

      // ⚠️ VALIDATION: Title is required and cannot be empty!
      const title = caseStudy.title?.trim();
      console.log('\n✅ Validation:');
      console.log('   Title:', title || '(empty)');
      console.log('   Title valid:', !!title);
      console.log('   Hero Image:', caseStudy.heroImage || '(none)');

      if (!title || title === '') {
        console.error('❌ Validation failed: Title is required!');
        toast.error('Case study title is required!');
        setIsSaving(false);
        return;
      }
      
      // Transform editor data to match backend API schema
      const caseStudyData = {
        portfolioId,
        projectId,
        content: {
          hero: {
            // ✅ CRITICAL: title is REQUIRED and cannot be empty!
            title: title || 'Untitled Case Study', // Add fallback
            subtitle: caseStudy.category?.trim() || '',
            coverImage: caseStudy.heroImage || '',
            client: '',
            year: caseStudy.year || new Date().getFullYear().toString(),
            role: '',
            duration: ''
          },
          overview: {
            heading: 'Project Overview',
            description: caseStudy.intro?.trim() || '',
            challenge: '',
            solution: '',
            results: ''
          },
          sections: caseStudy.sections.map((section, index) => ({
            id: `section-${section.id || index}`,
            type: 'text', // Default type
            heading: section.title?.trim() || '',
            content: section.subsections ? section.subsections.map(sub => 
              `${sub.title?.trim() || ''}\n\n${sub.content?.trim() || ''}`
            ).join('\n\n---\n\n') : '',
            image: section.subsections && section.subsections[0]?.image ? section.subsections[0].image : '',
            images: section.subsections ? section.subsections.map(sub => sub.image).filter(Boolean) : [],
            layout: 'center'
          })),
          additionalContext: {
            heading: 'Additional Context',
            content: ''
          },
          nextProject: {
            id: '',
            title: '',
            image: ''
          }
        }
      };

      // Log transformed data for debugging
      console.log('\n📦 Request Payload:');
      console.log('   Portfolio ID:', caseStudyData.portfolioId, `(type: ${typeof caseStudyData.portfolioId})`);
      console.log('   Project ID:', caseStudyData.projectId, `(type: ${typeof caseStudyData.projectId})`);
      console.log('   Title:', caseStudyData.content.hero.title);
      console.log('   Cover Image:', caseStudyData.content.hero.coverImage || '(none)');
      console.log('   Sections count:', caseStudyData.content.sections.length);
      caseStudyData.content.sections.forEach((section, i) => {
        console.log(`   Section ${i + 1}: ${section.heading}`);
        console.log(`     - Image: ${section.image || '(none)'}`);
        console.log(`     - Images array: [${section.images.join(', ') || '(empty)'}]`);
      });
      console.log('\n📋 Full payload structure:');
      console.log(JSON.stringify(caseStudyData, null, 2));
      
      console.log('\n🚀 Sending request to backend...');
      console.log('='.repeat(80) + '\n');
      
      // Use separate case study collection API
      let response;
      if (caseStudyId) {
        // Update existing case study
        console.log('✏️ Updating existing case study:', caseStudyId);
        response = await caseStudyApi.update(caseStudyId, caseStudyData);
      } else {
        // Create new case study
        console.log('➕ Creating new case study');
        response = await caseStudyApi.create(caseStudyData);
        
        // Save the case study ID for future updates
        if (response.success && response.data?.caseStudy?._id) {
          const newId = response.data.caseStudy._id;
          setCaseStudyId(newId);
          console.log('✅ Case study created with ID:', newId);
        }
      }
      
      if (response.success) {
        setHasUnsavedChanges(false);
        setShowSaveSuccess(true);
        setTimeout(() => setShowSaveSuccess(false), 2000);
        toast.success('Case study saved successfully!');
        console.log('✅ Case study saved successfully!');
      } else {
        throw new Error(response.message || 'Failed to save case study');
      }
    } catch (error) {
      console.error('❌ Error saving case study:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error data:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save case study';
      
      // Show specific error messages
      if (error.response?.status === 404) {
        toast.error('Backend endpoint not found! Case study endpoints need to be implemented.');
        console.error('🔴 BACKEND MISSING: /api/case-studies endpoints not implemented!');
        console.error('💡 See BACKEND_NOT_IMPLEMENTED.md for details');
      } else if (error.response?.status === 401) {
        toast.error('Unauthorized. Please login again.');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to save this case study.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    navigate(`/portfolio-builder/${portfolioId}`);
  };

  const handlePreview = () => {
    setIsPreviewMode(true);
  };

  const handleBackToEdit = () => {
    setIsPreviewMode(false);
  };

  const updateBasicInfo = (field, value) => {
    setCaseStudy(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const updateSubsection = (sectionIndex, subsectionIndex, field, value) => {
    setCaseStudy(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === sectionIndex ? {
          ...section,
          subsections: section.subsections.map((sub, j) =>
            j === subsectionIndex ? { ...sub, [field]: value } : sub
          )
        } : section
      )
    }));
    setHasUnsavedChanges(true);
  };

  const addSubsection = (sectionIndex) => {
    setCaseStudy(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === sectionIndex ? {
          ...section,
          subsections: [
            ...section.subsections,
            {
              id: Date.now(),
              title: 'NEW SUBSECTION',
              content: '',
              image: '',
              imageCaption: '',
              additionalContext: 'Additional context about this image can be added here...'
            }
          ]
        } : section
      )
    }));
    setHasUnsavedChanges(true);
  };

  const removeSubsection = (sectionIndex, subsectionIndex) => {
    setCaseStudy(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === sectionIndex ? {
          ...section,
          subsections: section.subsections.filter((_, j) => j !== subsectionIndex)
        } : section
      )
    }));
  };

  const updateStep = (stepIndex, field, value) => {
    setCaseStudy(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) =>
        i === stepIndex ? { ...step, [field]: value } : step
      )
    }));
    setHasUnsavedChanges(true);
  };

  const addStep = () => {
    setCaseStudy(prev => ({
      ...prev,
      steps: [
        ...prev.steps,
        {
          num: String(prev.steps.length + 1).padStart(2, '0'),
          title: 'NEW STEP',
          desc: 'Description of this step'
        }
      ]
    }));
  };

  const removeStep = (stepIndex) => {
    if (caseStudy.steps.length <= 3) {
      alert('You must have at least 3 steps');
      return;
    }
    setCaseStudy(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== stepIndex)
    }));
  };

  const handleImageUpload = async (file, type, sectionIndex, subsectionIndex) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 25MB)
    if (file.size > 25 * 1024 * 1024) {
      alert('File size must be less than 25MB');
      return;
    }

    // 1. INSTANT PREVIEW - Show image immediately using blob URL
    const localPreview = URL.createObjectURL(file);

    if (type === 'hero') {
      setCaseStudy(prev => ({ ...prev, heroImage: localPreview }));
      console.log('✨ Showing instant preview for hero image:', localPreview);
    } else if (type === 'subsection') {
      updateSubsection(sectionIndex, subsectionIndex, 'image', localPreview);
      console.log(`✨ Showing instant preview for subsection image [${sectionIndex}][${subsectionIndex}]:`, localPreview);
    }

    // 2. Start upload in background
    setIsUploadingImage(true);

    try {
      console.log(`📤 Uploading ${type} image directly to Cloudinary...`);

      // Use direct Cloudinary upload to bypass backend CORS issues
      const result = await uploadDirectToCloudinary(file);
      console.log('📥 Upload response:', result);

      // Handle response format from direct Cloudinary upload
      const imageUrl = result.data?.url;

      if (imageUrl) {
        // 3. Replace blob URL with Cloudinary URL
        if (type === 'hero') {
          setCaseStudy(prev => ({ ...prev, heroImage: imageUrl }));
        } else if (type === 'subsection') {
          updateSubsection(sectionIndex, subsectionIndex, 'image', imageUrl);
        }

        console.log(`✅ Cloudinary upload complete for ${type}:`, imageUrl);

        // Clean up blob URL to free memory
        URL.revokeObjectURL(localPreview);
        setHasUnsavedChanges(true);
      } else {
        console.error('❌ No URL in response:', result);
        throw new Error('Upload failed - no URL returned');
      }
    } catch (error) {
      console.error('❌ Upload error:', error);
      alert(`Failed to upload image: ${error.message}`);
      // Keep the preview so user can see what they tried to upload
    } finally {
      setIsUploadingImage(false);
      console.log('📤 Upload state reset, isUploadingImage = false');
    }
  };

  // Show loading state while case study is being loaded
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#FFFFFF'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(0, 0, 0, 0.1)',
            borderTop: '4px solid #FF0000',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 24px'
          }}></div>
          <div style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '14px',
            color: '#000000',
            textTransform: 'uppercase',
            letterSpacing: '0.15em'
          }}>
            Loading Case Study...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
      backgroundColor: '#FFFFFF',
      color: '#000000',
      minHeight: '100vh'
    }}>
      {/* Mobile-responsive styles */}
      <style>{`
        @media (max-width: 640px) {
          .case-study-header {
            padding: 16px 20px !important;
            flex-wrap: wrap !important;
            gap: 12px !important;
          }
          .case-study-header button {
            padding: 10px 20px !important;
            font-size: 11px !important;
          }
          .case-study-header > div {
            font-size: 10px !important;
            flex: 1 1 100% !important;
            text-align: center !important;
          }
        }
      `}</style>

      {/* Fixed Header - Mobile Responsive */}
      <header className="case-study-header" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#000000',
        color: '#FFFFFF',
        padding: 'clamp(12px, 3vw, 24px) clamp(16px, 4vw, 60px)',
        zIndex: 1000,
        borderBottom: '3px solid #FF0000',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button
          onClick={handleBack}
          style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 'clamp(11px, 1.2vw, 13px)',
            color: '#FFFFFF',
            backgroundColor: 'transparent',
            border: '2px solid #FFFFFF',
            padding: 'clamp(8px, 1.5vw, 12px) clamp(12px, 2vw, 24px)',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#FFFFFF';
            e.target.style.color = '#000000';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#FFFFFF';
          }}
        >
          ← BACK
        </button>

        <div style={{
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: 'clamp(10px, 1.1vw, 12px)',
          color: '#FF0000',
          textTransform: 'uppercase',
          letterSpacing: '0.15em'
        }}>
          {isPreviewMode ? 'PREVIEW' : 'EDITOR'}
        </div>
        
        {/* Desktop Save Button */}
        <button
          className="hidden md:block"
          onClick={() => {
            if (isPreviewMode) {
              navigate(`/portfolio/${portfolioId}/project/${projectId}`);
            } else {
              handleSave();
            }
          }}
          style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '13px',
            color: isPreviewMode ? '#000000' : '#FFFFFF',
            backgroundColor: isPreviewMode ? '#FFFFFF' : '#FF0000',
            border: isPreviewMode ? '2px solid #FFFFFF' : '2px solid #FF0000',
            padding: '12px 32px',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontWeight: 700,
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            if (isPreviewMode) {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#FFFFFF';
            } else {
              e.target.style.backgroundColor = '#CC0000';
              e.target.style.borderColor = '#CC0000';
            }
          }}
          onMouseLeave={(e) => {
            if (isPreviewMode) {
              e.target.style.backgroundColor = '#FFFFFF';
              e.target.style.color = '#000000';
            } else {
              e.target.style.backgroundColor = '#FF0000';
              e.target.style.borderColor = '#FF0000';
            }
          }}
        >
          {isPreviewMode ? 'VIEW CASE STUDY →' : 'SAVE'}
        </button>
        
        {/* Mobile spacer */}
        <div className="md:hidden" style={{ width: '40px' }}></div>
      </header>

      {/* Mobile Floating Action Button */}
      {!isPreviewMode && (
        <>
          {/* Overlay */}
          {isMobileMenuOpen && (
            <div 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 999998
              }}
            />
          )}

          {/* FAB Container */}
          <div 
            className="md:hidden"
            style={{
              position: 'fixed',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 999999
            }}
          >
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                width: '56px',
                height: '56px',
                backgroundColor: isMobileMenuOpen ? '#CC0000' : '#FF0000',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '50%',
                boxShadow: '0 4px 12px rgba(255, 0, 0, 0.4)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg 
                style={{
                  width: '24px',
                  height: '24px',
                  transition: 'transform 0.2s ease',
                  transform: isMobileMenuOpen ? 'rotate(45deg)' : 'rotate(0)'
                }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div style={{
                position: 'absolute',
                bottom: '70px',
                right: 0,
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                padding: '12px',
                minWidth: '200px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <button
                  onClick={() => {
                    setIsPreviewMode(true);
                    setIsMobileMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#000000',
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseDown={(e) => e.target.style.backgroundColor = '#F5F5F5'}
                  onMouseUp={(e) => e.target.style.backgroundColor = 'transparent'}
                  onTouchStart={(e) => e.target.style.backgroundColor = '#F5F5F5'}
                  onTouchEnd={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <svg style={{ width: '20px', height: '20px', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>Preview</span>
                </button>

                <button
                  onClick={() => {
                    if (!isSaving && hasUnsavedChanges) {
                      handleSave();
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  disabled={isSaving || !hasUnsavedChanges}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: (isSaving || !hasUnsavedChanges) ? '#999999' : '#000000',
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    cursor: (isSaving || !hasUnsavedChanges) ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.2s ease',
                    opacity: (isSaving || !hasUnsavedChanges) ? 0.5 : 1
                  }}
                  onMouseDown={(e) => !isSaving && hasUnsavedChanges && (e.target.style.backgroundColor = '#F5F5F5')}
                  onMouseUp={(e) => e.target.style.backgroundColor = 'transparent'}
                  onTouchStart={(e) => !isSaving && hasUnsavedChanges && (e.target.style.backgroundColor = '#F5F5F5')}
                  onTouchEnd={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <svg style={{ width: '20px', height: '20px', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  <span>{isSaving ? 'Saving...' : showSaveSuccess ? '✓ Saved!' : hasUnsavedChanges ? 'Save' : 'No Changes'}</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Preview Mode: Back Button */}
      {isPreviewMode && (
        <div 
          className="md:hidden"
          style={{
            position: 'fixed',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 999999
          }}
        >
          <button
            onClick={() => setIsPreviewMode(false)}
            style={{
              width: '56px',
              height: '56px',
              backgroundColor: '#FF0000',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '50%',
              boxShadow: '0 4px 12px rgba(255, 0, 0, 0.4)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
            </svg>
          </button>
        </div>
      )}

      {/* Main Content */}
      <main style={{ paddingTop: isPreviewMode ? 'clamp(60px, 10vh, 80px)' : 'clamp(100px, 15vh, 140px)', paddingBottom: 'clamp(60px, 10vh, 120px)' }}>
        {/* Hero Section */}
        <section style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 clamp(20px, 4vw, 60px)',
          marginBottom: 'clamp(80px, 15vh, 180px)'
        }}>
          {/* Category */}
          {isPreviewMode ? (
            <div
              style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '14px',
                color: '#FF0000',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                marginBottom: '20px'
              }}
            >
              {caseStudy.category}
            </div>
          ) : (
            <input
              type="text"
              value={caseStudy.category}
              onChange={(e) => updateBasicInfo('category', e.target.value)}
              placeholder="BRANDING / IDENTITY"
              style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '14px',
                color: '#FF0000',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                marginBottom: '20px',
                border: 'none',
                borderBottom: '2px dashed #FF0000',
                padding: '8px 0',
                backgroundColor: 'transparent',
                width: '400px',
                outline: 'none'
              }}
            />
          )}
          
          <div style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '14px',
            color: '#666666',
            marginBottom: '40px'
          }}>
            — 
            {isPreviewMode ? (
              caseStudy.year
            ) : (
              <input
                type="text"
                value={caseStudy.year}
                onChange={(e) => updateBasicInfo('year', e.target.value)}
                placeholder="2025"
                style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '14px',
                  color: '#666666',
                  border: 'none',
                  borderBottom: '1px dashed #CCCCCC',
                  padding: '4px 8px',
                  backgroundColor: 'transparent',
                  width: '80px',
                  marginLeft: '8px',
                  outline: 'none'
                }}
              />
            )}
          </div>

          {/* Main Title */}
          {isPreviewMode ? (
            <h1 style={{
              fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: 'clamp(60px, 10vw, 140px)',
              fontWeight: 900,
              lineHeight: 0.9,
              textTransform: 'uppercase',
              letterSpacing: '-0.03em',
              margin: 0,
              marginBottom: '60px'
            }}>
              {caseStudy.title}
            </h1>
          ) : (
            <textarea
              value={caseStudy.title}
              onChange={(e) => updateBasicInfo('title', e.target.value)}
              rows={2}
              style={{
                fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: 'clamp(60px, 10vw, 140px)',
                fontWeight: 900,
                lineHeight: 0.9,
                textTransform: 'uppercase',
                letterSpacing: '-0.03em',
                margin: 0,
                marginBottom: '60px',
                border: 'none',
                borderBottom: '3px dashed #000000',
                backgroundColor: 'transparent',
                width: '100%',
                resize: 'none',
                outline: 'none',
                padding: '20px 0'
              }}
            />
          )}

          {/* Intro Text */}
          {isPreviewMode ? (
            <p style={{
              maxWidth: '900px',
              fontSize: '24px',
              lineHeight: 1.6,
              marginBottom: '80px'
            }}>
              {caseStudy.intro}
            </p>
          ) : (
            <textarea
              value={caseStudy.intro}
              onChange={(e) => updateBasicInfo('intro', e.target.value)}
              rows={3}
              style={{
                maxWidth: '900px',
                fontSize: '24px',
                lineHeight: 1.6,
                marginBottom: '80px',
                border: 'none',
                borderBottom: '2px dashed #CCCCCC',
                backgroundColor: 'transparent',
                width: '100%',
                resize: 'none',
                outline: 'none',
                padding: '20px 0'
              }}
            />
          )}

          {/* Hero Image */}
          <div
            onClick={() => document.getElementById('hero-image-upload').click()}
            style={{
              width: '100%',
              aspectRatio: '16/9',
              backgroundColor: '#F5F5F5',
              marginBottom: '40px',
              overflow: 'hidden',
              cursor: 'pointer',
              border: '3px dashed #CCCCCC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {caseStudy.heroImage ? (
              <img 
                src={caseStudy.heroImage} 
                alt="Hero"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '14px',
                color: '#666666',
                textTransform: 'uppercase',
                textAlign: 'center'
              }}>
                CLICK TO UPLOAD HERO IMAGE<br/>
                <span style={{ fontSize: '12px', opacity: 0.6 }}>16:9 aspect ratio recommended</span>
              </div>
            )}
          </div>
          <input
            id="hero-image-upload"
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files[0], 'hero')}
            style={{ display: 'none' }}
          />

          {/* Hero Image Caption */}
          {isPreviewMode ? (
            <div style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '14px',
              color: '#666666',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginTop: '16px'
            }}>
              {caseStudy.heroImageCaption || 'Figure 01 — Image caption'}
            </div>
          ) : (
            <input
              type="text"
              value={caseStudy.heroImageCaption || ''}
              onChange={(e) => updateBasicInfo('heroImageCaption', e.target.value)}
              placeholder="Figure 01 — Image caption"
              style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '14px',
                color: '#666666',
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginTop: '16px',
                border: 'none',
                borderBottom: '1px dashed #CCCCCC',
                backgroundColor: 'transparent',
                width: '100%',
                outline: 'none',
                padding: '8px 0'
              }}
            />
          )}
        </section>

        {/* Steps Overview */}
        <section style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '0 60px',
          marginBottom: '160px'
        }}>
          <p style={{
            fontSize: '20px',
            lineHeight: 1.8,
            marginBottom: '30px'
          }}>
            There are 4 major steps in this process:
          </p>

          {/* Steps Grid */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-12 md:mt-16"
            style={{
              marginTop: '60px'
            }}>
            {caseStudy.steps.map((step, i) => (
              <div key={i} style={{
                border: '2px solid #000000',
                padding: '40px',
                backgroundColor: i === 0 ? '#FF0000' : 'transparent',
                color: i === 0 ? '#FFFFFF' : '#000000',
                position: 'relative'
              }}>
                {/* Remove button - Only in edit mode */}
                {!isPreviewMode && caseStudy.steps.length > 3 && (
                  <button
                    onClick={() => removeStep(i)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'transparent',
                      border: 'none',
                      color: i === 0 ? '#FFFFFF' : '#FF0000',
                      fontSize: '20px',
                      cursor: 'pointer',
                      width: '30px',
                      height: '30px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold'
                    }}
                    title="Remove step"
                  >
                    ×
                  </button>
                )}
                
                {/* Step Number */}
                {isPreviewMode ? (
                  <div style={{
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: '48px',
                    fontWeight: 900,
                    marginBottom: '20px',
                    color: i === 0 ? '#FFFFFF' : '#000000'
                  }}>
                    {step.num}
                  </div>
                ) : (
                  <input
                  type="text"
                  value={step.num}
                  onChange={(e) => updateStep(i, 'num', e.target.value)}
                  maxLength={2}
                  placeholder="01"
                  style={{
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: '48px',
                    fontWeight: 900,
                    marginBottom: '20px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: `2px dashed ${i === 0 ? '#FFFFFF' : '#000000'}`,
                    color: i === 0 ? '#FFFFFF' : '#000000',
                    width: '80px',
                    outline: 'none',
                    padding: '4px 0'
                  }}
                  title="Step number (e.g., 01, 02)"
                />
                )}
                
                {/* Step Title */}
                {isPreviewMode ? (
                  <div style={{
                    fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                    fontSize: '24px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    marginBottom: '12px',
                    color: i === 0 ? '#FFFFFF' : '#000000'
                  }}>
                    {step.title}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => updateStep(i, 'title', e.target.value.toUpperCase())}
                    maxLength={50}
                    placeholder="STEP TITLE"
                    style={{
                      fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                      fontSize: '24px',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      marginBottom: '12px',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: `2px dashed ${i === 0 ? '#FFFFFF' : '#000000'}`,
                      color: i === 0 ? '#FFFFFF' : '#000000',
                      width: '100%',
                      outline: 'none',
                      padding: '4px 0'
                    }}
                    title="Step title (max 50 characters)"
                  />
                )}
                
                {/* Step Description */}
                {isPreviewMode ? (
                  <div style={{
                    fontSize: '16px',
                    opacity: 0.8,
                    color: i === 0 ? '#FFFFFF' : '#000000',
                    fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif'
                  }}>
                    {step.desc}
                  </div>
                ) : (
                  <textarea
                    value={step.desc}
                    onChange={(e) => updateStep(i, 'desc', e.target.value)}
                    maxLength={100}
                    rows={2}
                    placeholder="Brief description..."
                    style={{
                      fontSize: '16px',
                      opacity: 0.8,
                      background: 'transparent',
                      border: 'none',
                      borderBottom: `1px dashed ${i === 0 ? '#FFFFFF' : '#CCCCCC'}`,
                      color: i === 0 ? '#FFFFFF' : '#000000',
                      width: '100%',
                      outline: 'none',
                      padding: '4px 0',
                      resize: 'vertical',
                      fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif'
                    }}
                    title="Step description (max 100 characters)"
                  />
                )}
              </div>
            ))}
          </div>
          
          {/* Add Step Button - Only in edit mode */}
          {!isPreviewMode && caseStudy.steps.length < 6 && (
            <button
              onClick={addStep}
              style={{
                marginTop: '30px',
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '13px',
                color: '#000000',
                backgroundColor: 'transparent',
                border: '2px solid #000000',
                padding: '12px 24px',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#000000';
                e.target.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#000000';
              }}
            >
              + ADD STEP
            </button>
          )}
        </section>

        {/* Detailed Sections */}
        {caseStudy.sections.map((section, sectionIndex) => (
          <section
            key={section.id}
            style={{
              maxWidth: '1400px',
              margin: '0 auto',
              padding: '0 60px',
              marginBottom: '160px'
            }}
          >
            {/* Section Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '40px',
              marginBottom: '80px'
            }}>
              {/* Section Number */}
              {isPreviewMode ? (
                <div style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '100px',
                  fontWeight: 900,
                  color: '#FF0000',
                  lineHeight: 1
                }}>
                  {section.number}
                </div>
              ) : (
                <input
                  type="text"
                  value={section.number}
                  onChange={(e) => {
                    setCaseStudy(prev => ({
                      ...prev,
                      sections: prev.sections.map((s, i) =>
                        i === sectionIndex ? { ...s, number: e.target.value } : s
                      )
                    }));
                  }}
                  maxLength={2}
                  placeholder="01"
                  style={{
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: '100px',
                    fontWeight: 900,
                    color: '#FF0000',
                    lineHeight: 1,
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '3px dashed #FF0000',
                    width: '150px',
                    outline: 'none',
                    padding: '10px 0',
                    textAlign: 'center'
                  }}
                  title="Section number (e.g., 01, 02)"
                />
              )}
              <div style={{ flex: 1 }}>
                {/* Section Title */}
                {isPreviewMode ? (
                  <h2 style={{
                    fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                    fontSize: '72px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    margin: 0,
                    lineHeight: 0.9
                  }}>
                    {section.title}
                  </h2>
                ) : (
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => {
                      setCaseStudy(prev => ({
                        ...prev,
                        sections: prev.sections.map((s, i) =>
                          i === sectionIndex ? { ...s, title: e.target.value.toUpperCase() } : s
                        )
                      }));
                    }}
                    maxLength={50}
                    placeholder="SECTION TITLE"
                    style={{
                      fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                      fontSize: '72px',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      margin: 0,
                      lineHeight: 0.9,
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '3px dashed #000000',
                      width: '100%',
                      outline: 'none',
                      padding: '10px 0'
                    }}
                    title="Section title (max 50 characters)"
                  />
                )}
              </div>
            </div>

            {/* Subsections */}
            {section.subsections.map((subsection, subsectionIndex) => (
              <div key={subsection.id} style={{ marginBottom: '80px', position: 'relative' }}>
                {/* Delete button - Only in edit mode */}
                {!isPreviewMode && (
                  <button
                    onClick={() => removeSubsection(sectionIndex, subsectionIndex)}
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      backgroundColor: '#FF0000',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      fontFamily: '"IBM Plex Mono", monospace',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      zIndex: 10
                    }}
                  >
                    DELETE
                  </button>
                )}

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '60px'
                }}>
                  <div>
                    {isPreviewMode ? (
                      <h3 style={{
                        fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                        fontSize: '32px',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        marginBottom: '30px'
                      }}>
                        {subsection.title}
                      </h3>
                    ) : (
                      <input
                        type="text"
                        value={subsection.title}
                        onChange={(e) => updateSubsection(sectionIndex, subsectionIndex, 'title', e.target.value)}
                        style={{
                          fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                          fontSize: '32px',
                          fontWeight: 900,
                          textTransform: 'uppercase',
                          marginBottom: '30px',
                          border: 'none',
                          borderBottom: '2px dashed #000000',
                          backgroundColor: 'transparent',
                          width: '100%',
                          outline: 'none',
                          padding: '10px 0'
                        }}
                      />
                    )}
                    {isPreviewMode ? (
                      <p style={{
                        fontSize: '18px',
                        lineHeight: 1.8,
                        marginBottom: '20px'
                      }}>
                        {subsection.content}
                      </p>
                    ) : (
                      <textarea
                        value={subsection.content}
                        onChange={(e) => updateSubsection(sectionIndex, subsectionIndex, 'content', e.target.value)}
                        rows={8}
                        style={{
                          fontSize: '18px',
                          lineHeight: 1.8,
                          marginBottom: '20px',
                          border: '1px solid #CCCCCC',
                          backgroundColor: 'transparent',
                          width: '100%',
                          outline: 'none',
                          padding: '16px',
                          resize: 'vertical'
                        }}
                      />
                    )}
                  </div>

                  <div>
                    {/* Image Display - Always show in preview, show after upload in edit */}
                    {(subsection.image || isPreviewMode) && (
                      <div style={{
                        aspectRatio: '4/3',
                        backgroundColor: '#F5F5F5',
                        overflow: 'hidden',
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {subsection.image ? (
                          <img 
                            src={subsection.image} 
                            alt={subsection.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
                          <div style={{
                            fontFamily: '"IBM Plex Mono", monospace',
                            fontSize: '12px',
                            color: '#CCCCCC',
                            textTransform: 'uppercase',
                            textAlign: 'center'
                          }}>
                            IMAGE PLACEHOLDER<br/>
                            <span style={{ fontSize: '11px', opacity: 0.6 }}>4:3 ratio</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Upload Controls - Only in edit mode */}
                    {!isPreviewMode && (
                      <>
                        {/* Clickable upload area when no image */}
                        {!subsection.image && (
                          <div
                            onClick={() => document.getElementById(`subsection-image-${sectionIndex}-${subsectionIndex}`).click()}
                            style={{
                              aspectRatio: '4/3',
                              backgroundColor: '#F5F5F5',
                              overflow: 'hidden',
                              cursor: 'pointer',
                              border: '2px dashed #CCCCCC',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginBottom: '16px'
                            }}
                          >
                            <div style={{
                              fontFamily: '"IBM Plex Mono", monospace',
                              fontSize: '12px',
                              color: '#666666',
                              textTransform: 'uppercase',
                              textAlign: 'center'
                            }}>
                              CLICK TO ADD IMAGE<br/>
                              <span style={{ fontSize: '11px', opacity: 0.6 }}>4:3 ratio recommended</span>
                            </div>
                          </div>
                        )}
                        
                        <input
                          id={`subsection-image-${sectionIndex}-${subsectionIndex}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e.target.files[0], 'subsection', sectionIndex, subsectionIndex)}
                          style={{ display: 'none' }}
                        />
                        
                        {/* Caption Input */}
                        <input
                          type="text"
                          value={subsection.imageCaption || ''}
                          onChange={(e) => updateSubsection(sectionIndex, subsectionIndex, 'imageCaption', e.target.value)}
                          placeholder="Image caption (e.g., Figure 02 — Title)"
                          style={{
                            fontFamily: '"IBM Plex Mono", monospace',
                            fontSize: '12px',
                            color: '#666666',
                            textTransform: 'uppercase',
                            border: 'none',
                            borderBottom: '1px dashed #CCCCCC',
                            backgroundColor: 'transparent',
                            width: '100%',
                            outline: 'none',
                            padding: '8px 0'
                          }}
                        />
                      </>
                    )}
                    
                    {/* Caption Display - In preview mode */}
                    {isPreviewMode && (
                      <div style={{
                        fontFamily: '"IBM Plex Mono", monospace',
                        fontSize: '12px',
                        color: '#666666',
                        textTransform: 'uppercase',
                        marginTop: '12px'
                      }}>
                        {subsection.imageCaption || 'Figure 0X — Image caption'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Context Section - Gray Box */}
                {(subsection.image || !isPreviewMode) && (
                  <div style={{
                    backgroundColor: '#F5F5F5',
                    padding: '40px',
                    marginTop: '40px'
                  }}>
                    {isPreviewMode ? (
                      <p style={{ fontSize: '18px', lineHeight: 1.8, margin: 0 }}>
                        {subsection.additionalContext || 'Additional context about this image can be added here...'}
                      </p>
                    ) : (
                      <textarea
                        value={subsection.additionalContext || ''}
                        onChange={(e) => updateSubsection(sectionIndex, subsectionIndex, 'additionalContext', e.target.value)}
                        placeholder="Additional context about this image can be added here..."
                        rows={3}
                        style={{
                          fontSize: '18px',
                          lineHeight: 1.8,
                          margin: 0,
                          border: '1px solid #CCCCCC',
                          backgroundColor: 'transparent',
                          width: '100%',
                          outline: 'none',
                          padding: '16px',
                          resize: 'vertical',
                          fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif'
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Add Subsection Button - Only in edit mode */}
            {!isPreviewMode && (
              <button
                onClick={() => addSubsection(sectionIndex)}
                style={{
                  width: '100%',
                  padding: '30px',
                  border: '2px dashed #CCCCCC',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  color: '#666666',
                  marginTop: '40px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#FF0000';
                  e.target.style.color = '#FF0000';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#CCCCCC';
                  e.target.style.color = '#666666';
                }}
              >
                + ADD SUBSECTION TO {section.title}
              </button>
            )}
          </section>
        ))}
      </main>

      {/* Floating Action Buttons */}
      <FloatingActionButtons
        step={isPreviewMode ? 'preview' : 'customize'}
        isSaving={isSaving}
        showSaveSuccess={showSaveSuccess}
        hasUnsavedChanges={hasUnsavedChanges}
        onPreview={handlePreview}
        onBackToEdit={handleBackToEdit}
        onSave={handleSave}
        onChangeTemplate={() => navigate(`/portfolio-builder/${portfolioId}`)}
        onPublish={() => toast('Publishing coming soon!', { icon: 'ℹ️' })}
        onExportPDF={() => toast('PDF export coming soon!', { icon: 'ℹ️' })}
        onToggleSettings={() => toast('Settings coming soon!', { icon: 'ℹ️' })}
      />
    </div>
  );
};

export default CaseStudyEditorPage;
