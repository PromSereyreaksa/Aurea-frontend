import React, { useState, useEffect } from 'react';

const EditorNavbar = ({ 
  templateName = 'Portfolio',
  onSectionClick,
  sections = []
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    if (onSectionClick) {
      onSectionClick(sectionId);
    }
  };

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        transition: 'all 0.3s ease',
        padding: '12px 0',
        boxShadow: isScrolled ? '0 2px 20px rgba(0, 0, 0, 0.1)' : '0 1px 10px rgba(0, 0, 0, 0.05)'
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Logo/Template Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#1f2937',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            {templateName} Editor
          </div>
          <div
            style={{
              fontSize: '12px',
              color: '#6b7280',
              backgroundColor: '#f3f4f6',
              padding: '4px 8px',
              borderRadius: '4px',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Edit Mode
          </div>
        </div>

        {/* Navigation Links */}
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {sections.map((section, index) => (
            <button
              key={index}
              onClick={() => scrollToSection(section.id)}
              style={{
                fontSize: '14px',
                fontWeight: 500,
                color: '#4b5563',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
                textTransform: 'capitalize',
                fontFamily: 'Inter, sans-serif',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
                e.target.style.color = '#1f2937';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#4b5563';
              }}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#6b7280',
              backgroundColor: 'transparent',
              border: '1px solid #e5e7eb',
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
              fontFamily: 'Inter, sans-serif'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f9fafb';
              e.target.style.borderColor = '#d1d5db';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.borderColor = '#e5e7eb';
            }}
          >
            Preview
          </button>
          
          <button
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#ffffff',
              backgroundColor: '#3b82f6',
              border: 'none',
              cursor: 'pointer',
              padding: '8px 16px',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
              fontFamily: 'Inter, sans-serif'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#2563eb';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#3b82f6';
            }}
          >
            Save
          </button>
        </div>
      </div>
    </nav>
  );
};

export default EditorNavbar;