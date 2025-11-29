import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { sitesApi } from '../lib/sitesApi';
import toast from 'react-hot-toast';

const PortfoliosPage = () => {
  const navigate = useNavigate();
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });
  const [sortBy] = useState('lastDeployedAt');
  const [order] = useState('desc');

  const fetchPublishedSites = useCallback(async (page = 1, limit = 12) => {
    console.log('🔄 fetchPublishedSites called');
    try {
      setLoading(true);
      const response = await sitesApi.getAllPublished({
        page,
        limit,
        sortBy,
        order
      });

      console.log('📥 Raw API response:', response);

      if (response.success && response.data) {
        // Debug: Log the sites data to see available fields
        console.log('📋 PortfoliosPage - sites data:', response.data);
        if (response.data.length > 0) {
          console.log('📋 First site all keys:', Object.keys(response.data[0]));
          console.log('📋 First site cover:', response.data[0].cover);
          console.log('📋 First site coverImage:', response.data[0].coverImage);
        }

        setSites(response.data);
        setPagination(response.pagination || {
          page: 1,
          limit: 12,
          total: response.data.length,
          pages: 1
        });
      } else {
        setSites([]);
        setPagination({ page: 1, limit: 12, total: 0, pages: 0 });
      }
    } catch (error) {
      console.error('Failed to fetch published sites:', error);
      toast.error('Failed to load portfolios');
      setSites([]);
      setPagination({ page: 1, limit: 12, total: 0, pages: 0 });
    } finally {
      setLoading(false);
    }
  }, [sortBy, order]);

  useEffect(() => {
    fetchPublishedSites(1, 12);
  }, [fetchPublishedSites]);

  const handlePortfolioClick = (url) => {
    window.open(url, '_blank');
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
      fetchPublishedSites(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FFFFFF'
    }}>
      {/* Navigation Bar */}
      <nav style={{
        borderBottom: '1px solid #E5E5E5',
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1600px',
        margin: '0 auto'
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '13px',
            color: '#000000',
            backgroundColor: 'transparent',
            border: '2px solid #000000',
            padding: '10px 20px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            borderRadius: '4px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#000000';
            e.currentTarget.style.color = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#000000';
          }}
        >
          ← BACK
        </button>

        <button
          onClick={() => navigate('/dashboard')}
          style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '13px',
            color: '#FFFFFF',
            backgroundColor: '#FF6B35',
            border: '2px solid #FF6B35',
            padding: '10px 20px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            borderRadius: '4px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#E55A2B';
            e.currentTarget.style.borderColor = '#E55A2B';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FF6B35';
            e.currentTarget.style.borderColor = '#FF6B35';
          }}
        >
          DASHBOARD
        </button>
      </nav>

      {/* Header Section */}
      <div style={{
        maxWidth: '1600px',
        margin: '60px auto 60px',
        textAlign: 'center',
        padding: '0 40px'
      }}>
        <h1 style={{
          fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
          fontSize: 'clamp(48px, 8vw, 96px)',
          fontWeight: 900,
          letterSpacing: '-0.02em',
          margin: 0,
          marginBottom: '20px',
          color: '#000000',
          lineHeight: 1.1
        }}>
          Made with <span style={{ color: '#FF6B35' }}>AUREA</span>
        </h1>
        <p style={{
          fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
          fontSize: 'clamp(18px, 2vw, 24px)',
          color: '#666666',
          maxWidth: '700px',
          margin: '0 auto',
          lineHeight: 1.5
        }}>
          Collection of the best websites designed with AUREA
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          textAlign: 'center',
          padding: '80px 20px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #E5E5E5',
            borderTop: '4px solid #FF6B35',
            borderRadius: '50%',
            margin: '0 auto 20px',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '14px',
            color: '#666666',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            Loading portfolios...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && sites.length === 0 && (
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          textAlign: 'center',
          padding: '80px 40px'
        }}>
          <div style={{
            fontSize: '64px',
            marginBottom: '24px'
          }}>
            📂
          </div>
          <h3 style={{
            fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: '28px',
            fontWeight: 900,
            margin: '0 0 16px 0',
            color: '#000000'
          }}>
            No Portfolios Yet
          </h3>
          <p style={{
            fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: '16px',
            color: '#666666',
            margin: '0 0 32px 0',
            lineHeight: 1.6
          }}>
            Be the first to create and publish your portfolio with Aurea!
          </p>
          <button
            onClick={() => navigate('/templates')}
            style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '14px',
              fontWeight: 700,
              color: '#FFFFFF',
              backgroundColor: '#FF6B35',
              border: '2px solid #FF6B35',
              padding: '16px 40px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              borderRadius: '4px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#E55A2B';
              e.target.style.borderColor = '#E55A2B';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#FF6B35';
              e.target.style.borderColor = '#FF6B35';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Get Started
          </button>
        </div>
      )}

      {/* Portfolios Grid - 4 Column Responsive */}
      {!loading && sites.length > 0 && (
        <div style={{
          maxWidth: '1600px',
          margin: '0 auto',
          padding: '0 40px'
        }}>
          <div className="portfolio-grid">
            {sites.map((site) => (
              <div
                key={site.subdomain}
                onClick={() => handlePortfolioClick(site.url)}
                style={{
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Image Container with Hover Overlay */}
                <div
                  className="portfolio-card-image"
                  style={{
                    position: 'relative',
                    width: '100%',
                    paddingBottom: '75%',
                    backgroundColor: '#F5F5F5',
                    overflow: 'hidden',
                    borderRadius: '8px'
                  }}
                >
                  {/* Portfolio Image */}
                  <div
                    className="portfolio-image"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundImage: (site.coverImage || site.cover)
                        ? `url(${site.coverImage || site.cover})`
                        : `url(/placeholder-612.webp)`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      transition: 'transform 0.3s ease'
                    }}
                  />

                  {/* Hover Overlay with Info */}
                  <div
                    className="portfolio-overlay"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      zIndex: 1,
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    {/* Username at top-left */}
                    <div style={{
                      fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#FFFFFF',
                      textTransform: 'lowercase',
                      letterSpacing: '0.02em'
                    }}>
                      {site.ownerName || site.subdomain}
                    </div>

                    {/* Subdomain/Site name in the middle */}
                    <div style={{
                      fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      lineHeight: 1.2,
                      textTransform: 'lowercase'
                    }}>
                      {site.subdomain}
                    </div>

                    {/* Portfolio type at bottom */}
                    <div style={{
                      fontFamily: '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: '#FFFFFF',
                      opacity: 0.8,
                      textTransform: 'capitalize'
                    }}>
                      {site.template || 'Portfolio'}
                    </div>
                  </div>

                  {/* View Count Badge */}
                  {site.viewCount > 0 && (
                    <div style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '12px',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: '#FFFFFF',
                      padding: '6px 12px',
                      fontFamily: '"IBM Plex Mono", monospace',
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      zIndex: 2
                    }}>
                      <svg
                        style={{ width: '12px', height: '12px' }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      {site.viewCount}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && sites.length > 0 && pagination.pages > 1 && (
        <div style={{
          maxWidth: '1400px',
          margin: '80px auto 0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          padding: '0 20px'
        }}>
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '13px',
              fontWeight: 700,
              color: pagination.page === 1 ? '#CCCCCC' : '#000000',
              backgroundColor: 'transparent',
              border: `2px solid ${pagination.page === 1 ? '#CCCCCC' : '#000000'}`,
              padding: '12px 24px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              cursor: pagination.page === 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              borderRadius: '4px',
              opacity: pagination.page === 1 ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (pagination.page !== 1) {
                e.currentTarget.style.backgroundColor = '#000000';
                e.currentTarget.style.color = '#FFFFFF';
              }
            }}
            onMouseLeave={(e) => {
              if (pagination.page !== 1) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#000000';
              }
            }}
          >
            ← Previous
          </button>

          {/* Page Numbers */}
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
          }}>
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => {
              const showPage =
                pageNum === 1 ||
                pageNum === pagination.pages ||
                Math.abs(pageNum - pagination.page) <= 1;

              const showEllipsis =
                (pageNum === 2 && pagination.page > 3) ||
                (pageNum === pagination.pages - 1 && pagination.page < pagination.pages - 2);

              if (!showPage && !showEllipsis) return null;

              if (showEllipsis) {
                return (
                  <span
                    key={pageNum}
                    style={{
                      fontFamily: '"IBM Plex Mono", monospace',
                      fontSize: '14px',
                      color: '#666666',
                      padding: '0 4px'
                    }}
                  >
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  style={{
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: pageNum === pagination.page ? '#FFFFFF' : '#000000',
                    backgroundColor: pageNum === pagination.page ? '#FF6B35' : 'transparent',
                    border: `2px solid ${pageNum === pagination.page ? '#FF6B35' : '#000000'}`,
                    padding: '10px 16px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    cursor: pageNum === pagination.page ? 'default' : 'pointer',
                    transition: 'all 0.3s ease',
                    borderRadius: '4px',
                    minWidth: '44px'
                  }}
                  onMouseEnter={(e) => {
                    if (pageNum !== pagination.page) {
                      e.currentTarget.style.backgroundColor = '#000000';
                      e.currentTarget.style.color = '#FFFFFF';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (pageNum !== pagination.page) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#000000';
                    }
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '13px',
              fontWeight: 700,
              color: pagination.page === pagination.pages ? '#CCCCCC' : '#000000',
              backgroundColor: 'transparent',
              border: `2px solid ${pagination.page === pagination.pages ? '#CCCCCC' : '#000000'}`,
              padding: '12px 24px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              cursor: pagination.page === pagination.pages ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              borderRadius: '4px',
              opacity: pagination.page === pagination.pages ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (pagination.page !== pagination.pages) {
                e.currentTarget.style.backgroundColor = '#000000';
                e.currentTarget.style.color = '#FFFFFF';
              }
            }}
            onMouseLeave={(e) => {
              if (pagination.page !== pagination.pages) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#000000';
              }
            }}
          >
            Next →
          </button>
        </div>
      )}

      {/* CSS for hover overlay and animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive grid - 4 columns on desktop */
        .portfolio-grid {
          display: grid;
          gap: 20px;
        }

        /* Mobile: 1 column */
        @media (max-width: 767px) {
          .portfolio-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Tablet: 2 columns */
        @media (min-width: 768px) and (max-width: 1023px) {
          .portfolio-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Small desktop: 3 columns */
        @media (min-width: 1024px) and (max-width: 1439px) {
          .portfolio-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        /* Large desktop: 4 columns */
        @media (min-width: 1440px) {
          .portfolio-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        /* Hover overlay effect */
        .portfolio-card-image:hover .portfolio-overlay {
          opacity: 1 !important;
        }

        /* Image zoom on hover */
        .portfolio-card-image:hover .portfolio-image {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default PortfoliosPage;
