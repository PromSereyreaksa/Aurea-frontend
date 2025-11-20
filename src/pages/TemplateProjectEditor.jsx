import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { portfolioApi } from '../lib/portfolioApi';
import SereneProjectEditorPage from '../templates/Serene/SereneProjectEditorPage';
import ChicProjectEditorPage from '../templates/Chic/ChicProjectEditorPage';
import BoldFolioProjectEditorPage from '../templates/BoldFolio/BoldFolioProjectEditorPage';

/**
 * Template-aware wrapper for project editor pages
 * Routes to the correct editor based on the portfolio's template
 */
const TemplateProjectEditor = () => {
  console.log('🌟 TemplateProjectEditor WRAPPER LOADED');

  const { portfolioId, projectId } = useParams();

  console.log('🌟 TemplateProjectEditor params:', { portfolioId, projectId });

  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        setLoading(true);
        const data = await portfolioApi.getById(portfolioId);
        setPortfolio(data);
      } catch (err) {
        console.error('Failed to load portfolio:', err);
        setError(err.message || 'Failed to load portfolio');
      } finally {
        setLoading(false);
      }
    };

    if (portfolioId) {
      loadPortfolio();
    }
  }, [portfolioId]);

  // Show loading state
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
          fontFamily: "'Inter', sans-serif",
          fontSize: '11px',
          color: '#818181',
          textTransform: 'uppercase',
          letterSpacing: '0.3px'
        }}>
          Loading project editor...
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !portfolio) {
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
          textAlign: 'center',
          fontFamily: "'Inter', sans-serif"
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 600,
            marginBottom: '16px',
            color: '#000000'
          }}>
            {error || 'Portfolio not found'}
          </div>
          <button
            onClick={() => window.history.back()}
            style={{
              fontSize: '12px',
              padding: '12px 24px',
              backgroundColor: '#000000',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 600
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Route to the correct editor based on template
  const templateId = portfolio.template;

  console.log('TemplateProjectEditor: Routing to template editor', {
    templateId,
    portfolioId,
    projectId
  });

  switch (templateId) {
    case 'serene':
      return <SereneProjectEditorPage />;
    case 'chic':
      return <ChicProjectEditorPage />;
    case 'boldfolio':
      return <BoldFolioProjectEditorPage />;
    default:
      // Default to Serene for backwards compatibility
      console.warn(`Unknown template: ${templateId}, defaulting to Serene editor`);
      return <SereneProjectEditorPage />;
  }
};

export default TemplateProjectEditor;
