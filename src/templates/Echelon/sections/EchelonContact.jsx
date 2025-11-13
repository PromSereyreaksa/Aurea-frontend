import React, { useState } from 'react';
import { SwissGrid, GridCol } from '../components/SwissGrid';
import { SwissSpiral, SwissLines } from '../components/SwissDecorations';

const EchelonContact = ({ 
  content,
  isEditing = false,
  onContentChange 
}) => {
  const { 
    heading = "LET'S WORK TOGETHER",
    subheading = 'Ready to create something extraordinary?',
    email = 'hello@example.com',
    phone = '+1 (555) 123-4567',
    address = 'New York, NY',
    availability = 'Available for new projects',
    social = {
      linkedin: '',
      twitter: '',
      instagram: '',
      behance: '',
      dribbble: ''
    }
  } = content;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    project: '',
    budget: '',
    message: ''
  });

  const handleChange = (field, value) => {
    if (onContentChange) {
      onContentChange('contact', field, value);
    }
  };

  const handleSocialChange = (platform, value) => {
    if (onContentChange) {
      onContentChange('contact', 'social', {
        ...social,
        [platform]: value
      });
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  return (
    <section
      id="contact"
      className="py-16 md:py-24 lg:py-32"
      style={{
        backgroundColor: '#000000',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'clip'
      }}
    >
      {/* Decorative Elements */}
      <SwissSpiral position="top-left" color="#FF0000" opacity={0.06} size={100} />
      <SwissLines orientation="horizontal" position="bottom" count={4} opacity={0.08} />
      
      {/* Massive Background "CONTACT" */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '-5%',
        fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: 'clamp(120px, 18vw, 240px)',
        fontWeight: 900,
        color: 'rgba(255, 255, 255, 0.02)',
        lineHeight: 1,
        zIndex: 0,
        pointerEvents: 'none',
        textTransform: 'uppercase',
        letterSpacing: '-0.05em',
        WebkitTextStroke: '1px rgba(0, 255, 65, 0.03)'
      }}>
        CONTACT
      </div>
      
      <SwissGrid>
        {/* Asymmetrical Layout - Title on right, number on left */}
        <GridCol span={3}>
          <div style={{
            fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: 'clamp(120px, 15vw, 200px)',
            fontWeight: 900,
            lineHeight: 0.8,
            color: '#1a1a1a',
            marginTop: '-40px',
            writingMode: 'vertical-rl',
            textOrientation: 'mixed'
          }}>
            05
          </div>
        </GridCol>

        <GridCol span={9}>
          {/* Large Heading */}
          {isEditing ? (
            <textarea
              value={heading}
              onChange={(e) => handleChange('heading', e.target.value)}
              style={{
                fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: 'clamp(36px, 6vw, 80px)',
                fontWeight: 900,
                lineHeight: 0.9,
                color: '#FFFFFF',
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                backgroundColor: 'transparent',
                border: '1px dashed #666666',
                outline: 'none',
                width: '100%',
                padding: '20px',
                resize: 'none',
                marginBottom: '30px',
                minHeight: '120px'
              }}
              rows={2}
            />
          ) : (
            <h2 style={{
              fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: 'clamp(36px, 6vw, 80px)',
              fontWeight: 900,
              lineHeight: 0.9,
              color: '#FFFFFF',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              margin: 0,
              marginBottom: '30px'
            }}>
              {heading}
            </h2>
          )}
        </GridCol>

        {/* Availability Status - Positioned asymmetrically */}
        <GridCol span={4} offset={2}>
          <div style={{
            display: 'inline-block',
            backgroundColor: '#00FF41',
            color: '#000000',
            padding: '12px 24px',
            marginBottom: '60px',
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 'clamp(12px, 1.2vw, 14px)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            transform: 'rotate(-2deg)'
          }}>
            ● {isEditing ? (
              <input
                type="text"
                value={availability}
                onChange={(e) => handleChange('availability', e.target.value)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#000000',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  width: '200px'
                }}
              />
            ) : availability}
          </div>
        </GridCol>

        {/* Contact Information - Asymmetrical positioning */}
        <GridCol span={12} className="md:col-span-4">
          <div style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 'clamp(10px, 1vw, 12px)',
            color: '#666666',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '40px',
            borderBottom: '2px solid #FF0000',
            paddingBottom: '12px'
          }}>
            DIRECT CONTACT
          </div>

          {/* Contact Details - Minimal */}
          <div style={{ marginBottom: '60px' }}>
            {/* Email */}
            <div style={{ marginBottom: '24px' }}>
              {isEditing ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  style={{
                    fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                    fontSize: 'clamp(16px, 1.8vw, 18px)',
                    fontWeight: 400,
                    color: '#FFFFFF',
                    backgroundColor: 'transparent',
                    border: '1px dashed #666666',
                    padding: '8px',
                    width: '100%'
                  }}
                />
              ) : (
                <a 
                  href={`mailto:${email}`}
                  style={{
                    fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                    fontSize: 'clamp(16px, 1.8vw, 18px)',
                    fontWeight: 400,
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    borderBottom: '1px solid #666666',
                    paddingBottom: '2px',
                    transition: 'border-bottom-color 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderBottomColor = '#00FF41';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderBottomColor = '#666666';
                  }}
                >
                  {email}
                </a>
              )}
            </div>

            {/* Phone - Positioned on new line */}
            <div style={{ marginBottom: '24px' }}>
              {isEditing ? (
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  style={{
                    fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                    fontSize: 'clamp(16px, 1.8vw, 18px)',
                    fontWeight: 400,
                    color: '#FFFFFF',
                    backgroundColor: 'transparent',
                    border: '1px dashed #666666',
                    padding: '8px',
                    width: '100%'
                  }}
                />
              ) : (
                <a 
                  href={`tel:${phone}`}
                  style={{
                    fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                    fontSize: 'clamp(16px, 1.8vw, 18px)',
                    fontWeight: 400,
                    color: '#CCCCCC',
                    textDecoration: 'none'
                  }}
                >
                  {phone}
                </a>
              )}
            </div>

            {/* Location */}
            <div style={{ 
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: 'clamp(12px, 1.2vw, 14px)',
              color: '#666666',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              {isEditing ? (
                <input
                  type="text"
                  value={address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  style={{
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    color: '#666666',
                    backgroundColor: 'transparent',
                    border: '1px dashed #666666',
                    padding: '4px',
                    width: '100%'
                  }}
                />
              ) : address}
            </div>
          </div>
        </GridCol>

        {/* Compact Contact Form - Asymmetrical positioning */}
        <GridCol span={12} offset={0} className="md:col-span-7 md:col-start-6 mt-8 md:mt-20">
          <div className="p-6 md:p-12" style={{
            backgroundColor: 'transparent',
            border: '3px solid #FF0000',
            transform: 'rotate(1deg)',
            position: 'relative'
          }}>
            <div style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: 'clamp(12px, 1.2vw, 14px)',
              color: '#FF0000',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              marginBottom: '30px',
              transform: 'rotate(-1deg)'
            }}>
              START A PROJECT
            </div>

            <form onSubmit={handleSubmit} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              transform: 'rotate(-1deg)'
            }}>
              {/* Name and Email - Inline */}
              <div className="flex flex-col md:flex-row gap-5">
                <input
                  type="text"
                  required
                  placeholder="YOUR NAME"
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  style={{
                    fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                    fontSize: 'clamp(14px, 1.5vw, 16px)',
                    color: '#FFFFFF',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: 'none',
                    borderBottom: '2px solid #333333',
                    padding: '16px 12px',
                    flex: 1,
                    outline: 'none',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderBottomColor = '#00FF41';
                    e.target.style.backgroundColor = 'rgba(0, 255, 65, 0.05)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderBottomColor = '#333333';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }}
                />
                <input
                  type="email"
                  required
                  placeholder="YOUR EMAIL"
                  value={formData.email}
                  onChange={(e) => handleFormChange('email', e.target.value)}
                  style={{
                    fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                    fontSize: 'clamp(14px, 1.5vw, 16px)',
                    color: '#FFFFFF',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: 'none',
                    borderBottom: '2px solid #333333',
                    padding: '16px 12px',
                    flex: 1,
                    outline: 'none',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderBottomColor = '#00FF41';
                    e.target.style.backgroundColor = 'rgba(0, 255, 65, 0.05)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderBottomColor = '#333333';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }}
                />
              </div>

              {/* Project Type and Budget */}
              <div className="flex flex-col md:flex-row gap-5">
                <input
                  type="text"
                  placeholder="PROJECT TYPE"
                  value={formData.project}
                  onChange={(e) => handleFormChange('project', e.target.value)}
                  style={{
                    fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                    fontSize: 'clamp(14px, 1.5vw, 16px)',
                    color: '#FFFFFF',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: 'none',
                    borderBottom: '2px solid #333333',
                    padding: '16px 12px',
                    flex: 1,
                    outline: 'none',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderBottomColor = '#00FF41';
                    e.target.style.backgroundColor = 'rgba(0, 255, 65, 0.05)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderBottomColor = '#333333';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }}
                />
                <select
                  value={formData.budget}
                  onChange={(e) => handleFormChange('budget', e.target.value)}
                  style={{
                    fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                    fontSize: 'clamp(14px, 1.5vw, 16px)',
                    color: '#FFFFFF',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: 'none',
                    borderBottom: '2px solid #333333',
                    padding: '16px 12px',
                    flex: 1,
                    outline: 'none',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  <option value="" style={{ backgroundColor: '#000000' }}>BUDGET RANGE</option>
                  <option value="5k-10k" style={{ backgroundColor: '#000000' }}>$5K - $10K</option>
                  <option value="10k-25k" style={{ backgroundColor: '#000000' }}>$10K - $25K</option>
                  <option value="25k-50k" style={{ backgroundColor: '#000000' }}>$25K - $50K</option>
                  <option value="50k+" style={{ backgroundColor: '#000000' }}>$50K+</option>
                </select>
              </div>

              {/* Message - Compact */}
              <textarea
                required
                rows={3}
                placeholder="PROJECT DETAILS..."
                value={formData.message}
                onChange={(e) => handleFormChange('message', e.target.value)}
                style={{
                  fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                  fontSize: 'clamp(14px, 1.5vw, 16px)',
                  color: '#FFFFFF',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '2px solid #333333',
                  padding: '16px',
                  width: '100%',
                  resize: 'vertical',
                  outline: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#00FF41';
                  e.target.style.backgroundColor = 'rgba(0, 255, 65, 0.05)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#333333';
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }}
              />

              {/* Submit Button - Swiss style */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                <button
                  type="submit"
                  style={{
                    fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                    fontSize: 'clamp(14px, 1.5vw, 16px)',
                    fontWeight: 700,
                    color: '#000000',
                    backgroundColor: '#00FF41',
                    border: '3px solid #00FF41',
                    padding: '16px 40px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    transform: 'skew(-5deg)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#00FF41';
                    e.target.style.transform = 'skew(-5deg) scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#00FF41';
                    e.target.style.color = '#000000';
                    e.target.style.transform = 'skew(-5deg) scale(1)';
                  }}
                >
                  SEND BRIEF
                </button>
                
                <div style={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: 'clamp(12px, 1.2vw, 14px)',
                  color: '#00FF41',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  fontWeight: 600
                }}>
                  → 24H RESPONSE
                </div>
              </div>
            </form>
          </div>
        </GridCol>

        {/* Social Links - Bottom positioned */}
        <GridCol span={12}>
          <div style={{
            marginTop: '80px',
            paddingTop: '40px',
            borderTop: '1px solid #333333',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
              {Object.entries(social).map(([platform, url]) => (
                url && (
                  <div key={platform}>
                    {isEditing ? (
                      <input
                        type="url"
                        value={url || ''}
                        onChange={(e) => handleSocialChange(platform, e.target.value)}
                        placeholder={`${platform} URL`}
                        style={{
                          fontFamily: '"IBM Plex Mono", monospace',
                          fontSize: 'clamp(12px, 1.2vw, 14px)',
                          color: '#FFFFFF',
                          backgroundColor: 'transparent',
                          border: '1px dashed #666666',
                          padding: '4px 8px',
                          width: '200px'
                        }}
                      />
                    ) : (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontFamily: '"IBM Plex Mono", monospace',
                          fontSize: 'clamp(12px, 1.2vw, 14px)',
                          color: '#666666',
                          textDecoration: 'none',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          transition: 'color 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = '#00FF41';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = '#666666';
                        }}
                      >
                        {platform}
                      </a>
                    )}
                  </div>
                )
              ))}
            </div>
            
            <div style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: 'clamp(10px, 1vw, 12px)',
              color: '#333333',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              © 2025 — ECHELON
            </div>
          </div>
        </GridCol>


      </SwissGrid>
    </section>
  );
};

export default EchelonContact;