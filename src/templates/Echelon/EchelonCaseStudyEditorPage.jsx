import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import usePortfolioStore from '../../stores/portfolioStore';
import FloatingActionButtons from '../../components/PortfolioBuilder/FloatingActionButtons';

const CaseStudyEditorPage = () => {
  const { portfolioId, projectId } = useParams();
  const navigate = useNavigate();
  const { updatePortfolio, portfolios } = usePortfolioStore();
  
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

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
    // Load existing case study data from portfolio
    const portfolio = portfolios.find(p => p.id === portfolioId);
    if (portfolio && portfolio.caseStudies && portfolio.caseStudies[projectId]) {
      setCaseStudy(portfolio.caseStudies[projectId]);
    }
    // If no existing case study, keep the default template structure
  }, [portfolioId, projectId, portfolios]);

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
      
      // Get current portfolio
      const portfolio = portfolios.find(p => p.id === portfolioId);
      if (!portfolio) {
        toast.error('Portfolio not found');
        setIsSaving(false);
        return;
      }

      // Update portfolio with case study data
      // Case studies are stored in portfolio.caseStudies as an object keyed by projectId
      const updatedPortfolio = {
        ...portfolio,
        caseStudies: {
          ...(portfolio.caseStudies || {}),
          [projectId]: caseStudy
        }
      };

      // Save to store
      await updatePortfolio(portfolioId, updatedPortfolio);
      
      setHasUnsavedChanges(false);
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 2000);
      
      toast.success('Case study saved successfully!');
      console.log('Case study saved:', caseStudy);
    } catch (error) {
      console.error('Error saving case study:', error);
      toast.error('Failed to save case study');
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

  const handleImageUpload = (file, type, sectionIndex, subsectionIndex) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (type === 'hero') {
          setCaseStudy(prev => ({ ...prev, heroImage: event.target.result }));
        } else if (type === 'subsection') {
          updateSubsection(sectionIndex, subsectionIndex, 'image', event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{
      fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
      backgroundColor: '#FFFFFF',
      color: '#000000',
      minHeight: '100vh'
    }}>
      {/* Fixed Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#000000',
        color: '#FFFFFF',
        padding: '24px 60px',
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
            fontSize: '13px',
            color: '#FFFFFF',
            backgroundColor: 'transparent',
            border: '2px solid #FFFFFF',
            padding: '12px 24px',
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
          fontSize: '12px',
          color: '#FF0000',
          textTransform: 'uppercase',
          letterSpacing: '0.15em'
        }}>
          {isPreviewMode ? 'PREVIEW MODE' : 'CASE STUDY EDITOR'}
        </div>
        
        <button
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
      </header>

      {/* Main Content */}
      <main style={{ paddingTop: isPreviewMode ? '60px' : '120px', paddingBottom: '120px' }}>
        {/* Hero Section */}
        <section style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 60px',
          marginBottom: '180px'
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
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '30px',
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
