import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const TemplateCard = ({ template }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const handleUseTemplate = () => {
    if (isAuthenticated) {
      // If logged in, go directly to portfolio builder with template pre-selected
      navigate(`/portfolio-builder/new?template=${template.id}`);
    } else {
      // If not logged in, redirect to signup with return URL
      navigate(`/signup?return=/portfolio-builder/new&template=${template.id}`);
    }
  };

  return (
    <div
      style={{
        border: '2px solid #E5E5E5',
        borderRadius: '8px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        backgroundColor: '#FFFFFF'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#FF6B35';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 107, 53, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#E5E5E5';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Template Preview Image */}
      <div
        style={{
          width: '100%',
          height: '240px',
          backgroundColor: '#F5F5F5',
          backgroundImage: `url(${template.preview})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}
      >
        {/* Live Preview Badge */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: '#FF6B35',
            color: '#FFFFFF',
            padding: '6px 12px',
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(255, 107, 53, 0.3)'
          }}
        >
          LIVE PREVIEW
        </div>
      </div>

      {/* Template Info */}
      <div style={{ padding: '20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '12px'
        }}>
          <div>
            <h3 style={{
              fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: '20px',
              fontWeight: 900,
              margin: 0,
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em'
            }}>
              {template.name}
            </h3>
            <div style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '11px',
              color: '#FF6B35',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              {template.category}
            </div>
          </div>
        </div>

        <p style={{
          fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
          fontSize: '14px',
          color: '#666666',
          lineHeight: 1.6,
          margin: 0,
          marginBottom: '20px'
        }}>
          {template.description}
        </p>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '10px'
        }}>
          {template.previewUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(template.previewUrl);
              }}
              style={{
                flex: 1,
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '12px',
                fontWeight: 600,
                color: '#000000',
                backgroundColor: 'transparent',
                border: '2px solid #000000',
                padding: '12px 20px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                borderRadius: '4px'
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
              VIEW DEMO
            </button>
          )}
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUseTemplate();
            }}
            style={{
              flex: 1,
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '12px',
              fontWeight: 700,
              color: '#FFFFFF',
              backgroundColor: '#FF6B35',
              border: '2px solid #FF6B35',
              padding: '12px 20px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              borderRadius: '4px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#E55A2B';
              e.target.style.borderColor = '#E55A2B';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#FF6B35';
              e.target.style.borderColor = '#FF6B35';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            USE TEMPLATE
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
