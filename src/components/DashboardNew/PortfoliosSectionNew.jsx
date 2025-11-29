import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Plus, MoreVertical, Edit, Eye, Trash2, CheckCircle, XCircle, Grid as GridIcon, List, Camera } from 'lucide-react';
import usePortfolioStore from '../../stores/portfolioStore';
import { portfolioApi } from '../../lib/portfolioApi';
import { useImageUpload } from '../../hooks/useImageUpload';
import '../../styles/android-animations.css';

const PortfoliosSectionNew = ({ portfolios: propPortfolios, isLoading }) => {
  const navigate = useNavigate();
  const { deletePortfolio, publishPortfolio, unpublishPortfolio, portfolios: storePortfolios } = usePortfolioStore();
  const { uploadImage } = useImageUpload();

  // Use store portfolios to get real-time updates after upload
  const portfolios = storePortfolios.length > 0 ? storePortfolios : propPortfolios;

  const [openMenuId, setOpenMenuId] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('recent'); // 'recent' or 'alphabetic'
  const [filterTab, setFilterTab] = useState('published'); // 'published' or 'unpublished'
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isClosingSortDropdown, setIsClosingSortDropdown] = useState(false);
  const [isClosingMenu, setIsClosingMenu] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [portfolioToDelete, setPortfolioToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadingCoverId, setUploadingCoverId] = useState(null);
  const { fetchUserPortfolios } = usePortfolioStore();

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      if (openMenuId && !isClosingMenu) {
        handleCloseMenu();
      }
    };

    if (openMenuId) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openMenuId, isClosingMenu]);

  const handleCloseMenu = () => {
    setIsClosingMenu(true);
    setTimeout(() => {
      setOpenMenuId(null);
      setIsClosingMenu(false);
    }, 150);
  };

  // Close sort dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      if (isSortDropdownOpen && !isClosingSortDropdown) {
        handleCloseSortDropdown();
      }
    };

    if (isSortDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isSortDropdownOpen, isClosingSortDropdown]);

  const handleCloseSortDropdown = () => {
    setIsClosingSortDropdown(true);
    setTimeout(() => {
      setIsSortDropdownOpen(false);
      setIsClosingSortDropdown(false);
    }, 150);
  };

  const handleSortSelect = (value) => {
    setSortBy(value);
    handleCloseSortDropdown();
  };

  const handleDeleteClick = (portfolio) => {
    setPortfolioToDelete(portfolio);
    setDeleteModalOpen(true);
    handleCloseMenu();
  };

  const handleConfirmDelete = async () => {
    if (!portfolioToDelete) return;

    setIsDeleting(true);
    try {
      await deletePortfolio(portfolioToDelete._id);
      setDeleteModalOpen(false);
      setPortfolioToDelete(null);
    } catch (error) {
      console.error('Failed to delete portfolio:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setPortfolioToDelete(null);
  };

  const handleTogglePublish = async (portfolio) => {
    try {
      if (portfolio.published) {
        await unpublishPortfolio(portfolio._id);
      } else {
        const slug = portfolio.slug || portfolio.title?.toLowerCase().replace(/\s+/g, '-') || `portfolio-${portfolio._id}`;
        await publishPortfolio(portfolio._id, slug);
      }
      setOpenMenuId(null);
    } catch (error) {
      console.error('Failed to toggle publish:', error);
    }
  };

  const handleCoverUpload = async (e, portfolioId) => {
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image (JPG, PNG, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    try {
      setUploadingCoverId(portfolioId);

      console.log('📤 Starting cover upload for portfolio:', portfolioId);
      console.log('📁 File:', file.name, file.type, `${(file.size / 1024 / 1024).toFixed(2)}MB`);

      // Upload to Cloudinary with compression
      const imageUrl = await uploadImage(file, {
        compress: true,
        direct: true,
      });

      console.log('✅ Image uploaded successfully!');
      console.log('🔗 Cloudinary URL:', imageUrl);

      // Update portfolio with new cover
      const updateResult = await portfolioApi.update(portfolioId, { cover: imageUrl });

      console.log('✅ Portfolio update response:', updateResult);

      // Extract cover from response (handle nested structure)
      const coverUrl = updateResult?.data?.portfolio?.cover || updateResult?.portfolio?.cover || updateResult?.cover || imageUrl;
      console.log('🖼️ Cover URL extracted:', coverUrl);

      // Update the local store immediately with the cover URL
      // This ensures the cover shows up without waiting for backend list to return it
      usePortfolioStore.getState().updatePortfolioOptimistic(portfolioId, { cover: coverUrl });
      console.log('✅ Local store updated with cover');

      // Clear API cache
      portfolioApi.clearCache();

    } catch (error) {
      console.error('❌ Error uploading cover:', error);
      console.error('❌ Error details:', error.message, error.stack);
      alert('Failed to upload cover image. Please try again.');
    } finally {
      setUploadingCoverId(null);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '48px' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fb8500]"></div>
      </div>
    );
  }

  const colors = ['#ff9900', '#5588ff', '#00ccaa', '#ff6633', '#9966ff', '#ff3399'];

  // Generate consistent color based on portfolio ID
  const getColorForPortfolio = (portfolioId) => {
    if (!portfolioId) return colors[0];
    // Simple hash function to convert string ID to a number
    let hash = 0;
    for (let i = 0; i < portfolioId.length; i++) {
      hash = portfolioId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };


  // Filter portfolios based on selected tab
  const filteredPortfolios = portfolios.filter(portfolio => {
    if (filterTab === 'published') {
      return portfolio.published === true;
    } else {
      return !portfolio.published;
    }
  });

  // Sort portfolios based on selected sort option
  const sortedPortfolios = [...filteredPortfolios].sort((a, b) => {
    if (sortBy === 'alphabetic') {
      // Sort alphabetically by title
      const titleA = (a.title || 'Untitled Portfolio').toLowerCase();
      const titleB = (b.title || 'Untitled Portfolio').toLowerCase();
      return titleA.localeCompare(titleB);
    } else {
      // Sort by recently updated (default)
      const dateA = new Date(a.updatedAt || a.createdAt).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt).getTime();
      return dateB - dateA;
    }
  });

  return (
    <>
      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
          className="modal-backdrop"
          onClick={handleCancelDelete}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '28px',
              maxWidth: '440px',
              width: '100%',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
            className="modal-content"
          >
            {/* Modal Header */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' }}>
                Delete portfolio?
              </h3>
              <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
                Are you sure you want to delete "{portfolioToDelete?.title || 'Untitled Portfolio'}"? This action cannot be undone.
              </p>
            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="button-press ripple-container"
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'transparent',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  color: '#666',
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                  opacity: isDeleting ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isDeleting) {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                    e.currentTarget.style.borderColor = '#ccc';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isDeleting) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = '#e0e0e0';
                  }
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="button-press ripple-container"
                style={{
                  padding: '12px 24px',
                  backgroundColor: isDeleting ? '#cc0000' : '#ff3333',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                  opacity: isDeleting ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isDeleting) {
                    e.currentTarget.style.backgroundColor = '#ff0000';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 51, 51, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isDeleting) {
                    e.currentTarget.style.backgroundColor = '#ff3333';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="portfolio-section-wrapper" style={{ padding: '32px', backgroundColor: '#fff' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', gap: '16px', flexWrap: 'nowrap' }}>
        <div style={{ minWidth: 0, flex: '1 1 auto' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>
            My site
          </h1>
          <p style={{ fontSize: '14px', color: '#666' }}>
            {portfolios.length} {portfolios.length === 1 ? 'site' : 'sites'}
          </p>
        </div>

        <button
          onClick={() => navigate('/templates')}
          style={{
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#fb8500',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            flexShrink: 0,
          }}
          className="button-press ripple-container"
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ff9500'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fb8500'}
        >
          <Plus size={18} />
          New
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '16px', borderBottom: '2px solid #e0e0e0' }}>
        <button
          onClick={() => setFilterTab('published')}
          style={{
            padding: '12px 20px',
            border: 'none',
            backgroundColor: 'transparent',
            color: filterTab === 'published' ? '#1a1a1a' : '#666',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: filterTab === 'published' ? '600' : '500',
            borderBottom: filterTab === 'published' ? '2px solid #fb8500' : '2px solid transparent',
            marginBottom: '-2px',
            transition: 'all 0.2s',
          }}
        >
          Published ({portfolios.filter(p => p.published).length})
        </button>
        <button
          onClick={() => setFilterTab('unpublished')}
          style={{
            padding: '12px 20px',
            border: 'none',
            backgroundColor: 'transparent',
            color: filterTab === 'unpublished' ? '#1a1a1a' : '#666',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: filterTab === 'unpublished' ? '600' : '500',
            borderBottom: filterTab === 'unpublished' ? '2px solid #fb8500' : '2px solid transparent',
            marginBottom: '-2px',
            transition: 'all 0.2s',
          }}
        >
          Unpublished ({portfolios.filter(p => !p.published).length})
        </button>
      </div>

      {/* Controls - Sort and View Mode */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px', position: 'relative', zIndex: isSortDropdownOpen ? 1100 : 'auto' }}>
        <div style={{ fontSize: '14px', color: '#666' }}>
          {sortedPortfolios.length} {sortedPortfolios.length === 1 ? 'result' : 'results'}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
          {/* Sort Dropdown - Material Design */}
          <div style={{ position: 'relative', zIndex: isSortDropdownOpen ? 1100 : 1 }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (isSortDropdownOpen) {
                  handleCloseSortDropdown();
                } else {
                  setIsSortDropdownOpen(true);
                }
              }}
              className="button-press ripple-container"
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #e0e0e0',
                backgroundColor: '#fff',
                color: '#1a1a1a',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                minWidth: '160px',
                justifyContent: 'space-between',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
                e.currentTarget.style.borderColor = '#ccc';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fff';
                e.currentTarget.style.borderColor = '#e0e0e0';
              }}
            >
              <span>{sortBy === 'recent' ? 'Recently' : 'Alphabetic'}</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                style={{
                  transition: 'transform 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                  transform: isSortDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isSortDropdownOpen && (
              <>
                <div
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1099,
                  }}
                  onClick={() => handleCloseSortDropdown()}
                />
                <div
                  className={isClosingSortDropdown ? "dropdown-exit" : "dropdown-enter"}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    width: '100%',
                    backgroundColor: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    overflow: 'hidden',
                    zIndex: 1100,
                  }}
                >
                  <button
                    onClick={() => handleSortSelect('recent')}
                    className="ripple-container"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      backgroundColor: sortBy === 'recent' ? '#f8f9fa' : 'transparent',
                      color: sortBy === 'recent' ? '#fb8500' : '#1a1a1a',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: sortBy === 'recent' ? '600' : '500',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                    }}
                    onMouseEnter={(e) => {
                      if (sortBy !== 'recent') {
                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (sortBy !== 'recent') {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <span>Recently</span>
                    {sortBy === 'recent' && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M13 4L6 11L3 8" stroke="#fb8500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => handleSortSelect('alphabetic')}
                    className="ripple-container"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      backgroundColor: sortBy === 'alphabetic' ? '#f8f9fa' : 'transparent',
                      color: sortBy === 'alphabetic' ? '#fb8500' : '#1a1a1a',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: sortBy === 'alphabetic' ? '600' : '500',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                    }}
                    onMouseEnter={(e) => {
                      if (sortBy !== 'alphabetic') {
                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (sortBy !== 'alphabetic') {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <span>Alphabetic</span>
                    {sortBy === 'alphabetic' && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M13 4L6 11L3 8" stroke="#fb8500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* View Mode Toggle */}
          <div style={{ display: 'flex', border: '1px solid #e0e0e0', borderRadius: '6px', overflow: 'hidden' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '8px 12px',
                border: 'none',
                backgroundColor: viewMode === 'grid' ? '#f8f9fa' : 'transparent',
                color: viewMode === 'grid' ? '#fb8500' : '#666',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s',
              }}
            >
              <GridIcon size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '8px 12px',
                border: 'none',
                borderLeft: '1px solid #e0e0e0',
                backgroundColor: viewMode === 'list' ? '#f8f9fa' : 'transparent',
                color: viewMode === 'list' ? '#fb8500' : '#666',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s',
              }}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Portfolio Grid */}
      {sortedPortfolios.length === 0 ? (
        <div style={{
          padding: '64px',
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
        }}>
          <Package size={64} color="#ccc" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' }}>
            No portfolios yet
          </h3>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
            Create your first portfolio to get started
          </p>
          <button
            onClick={() => navigate('/templates')}
            style={{
              padding: '12px 24px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#fb8500',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            Create Portfolio
          </button>
        </div>
      ) : viewMode === 'list' ? (
        // List View - Single bordered container
        <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }} className="fade-in">
          {sortedPortfolios.map((portfolio, index) => {
            const color = getColorForPortfolio(portfolio._id);
            const lastUpdated = new Date(portfolio.updatedAt || portfolio.createdAt);
            const timeDiff = Date.now() - lastUpdated.getTime();
            const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
            const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

            // Debug logging
            if (index === 0) {
              console.log('Portfolio data:', {
                title: portfolio.title,
                updatedAt: portfolio.updatedAt,
                createdAt: portfolio.createdAt,
                lastUpdated: lastUpdated.toISOString(),
                currentTime: new Date().toISOString(),
                hoursAgo,
                daysAgo
              });
            }

            let dateText;
            if (hoursAgo < 1) {
              dateText = 'Updated recently';
            } else if (hoursAgo < 24) {
              dateText = `Updated ${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`;
            } else if (daysAgo === 1) {
              dateText = 'Updated 1 day ago';
            } else {
              dateText = `Updated ${daysAgo} days ago`;
            }

            return (
              <div
                key={portfolio._id}
                onClick={() => navigate(`/portfolio-builder/${portfolio._id}`)}
                className="stagger-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '12px 16px',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                  borderBottom: index < sortedPortfolios.length - 1 ? '1px solid #e0e0e0' : 'none',
                  transition: 'background-color 150ms cubic-bezier(0.4, 0.0, 0.2, 1)',
                  position: 'relative',
                  zIndex: openMenuId === portfolio._id ? 100 : 1,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fff';
                }}
              >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    backgroundImage: portfolio.cover
                      ? `url(${portfolio.cover})`
                      : `url(/placeholder-612.webp)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '15px',
                      fontWeight: '500',
                      color: '#1a1a1a',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {portfolio.title || 'Untitled Portfolio'}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      {dateText}
                    </div>
                  </div>
                  {portfolio.published && (
                    <div style={{
                      padding: '4px 8px',
                      backgroundColor: '#00ccaa',
                      color: '#fff',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '600',
                      flexShrink: 0,
                    }}>
                      PUBLISHED
                    </div>
                  )}
                  <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (openMenuId === portfolio._id) {
                          handleCloseMenu();
                        } else {
                          setOpenMenuId(portfolio._id);
                        }
                      }}
                      className="button-press ripple-container"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '4px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <MoreVertical size={16} color="#666" />
                    </button>

                    {openMenuId === portfolio._id && (
                      <>
                        <div
                          style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 99,
                          }}
                          onClick={() => handleCloseMenu()}
                        />
                        <div
                          className={isClosingMenu ? "dropdown-exit" : "dropdown-enter"}
                          style={{
                            position: 'absolute',
                            top: '36px',
                            right: 0,
                            width: '180px',
                            backgroundColor: '#fff',
                            border: '1px solid #e0e0e0',
                            borderRadius: '6px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            overflow: 'hidden',
                            zIndex: 100,
                          }}>
                          <button
                            onClick={() => navigate(`/portfolio-builder/${portfolio._id}`)}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              border: 'none',
                              backgroundColor: 'transparent',
                              textAlign: 'left',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              fontSize: '14px',
                              color: '#1a1a1a',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Edit size={16} />
                            Edit
                          </button>
                          {portfolio.published && (
                            <button
                              onClick={() => window.open(`/${portfolio.slug}/html`, '_blank')}
                              style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: 'none',
                                backgroundColor: 'transparent',
                                textAlign: 'left',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '14px',
                                color: '#1a1a1a',
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <Eye size={16} />
                              View
                            </button>
                          )}
                          <div style={{ height: '1px', backgroundColor: '#e0e0e0' }} />
                          <button
                            onClick={() => handleTogglePublish(portfolio)}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              border: 'none',
                              backgroundColor: 'transparent',
                              textAlign: 'left',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              fontSize: '14px',
                              color: portfolio.published ? '#ff9900' : '#00ccaa',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            {portfolio.published ? <XCircle size={16} /> : <CheckCircle size={16} />}
                            {portfolio.published ? 'Unpublish' : 'Publish'}
                          </button>
                          <div style={{ height: '1px', backgroundColor: '#e0e0e0' }} />
                          <button
                            onClick={() => handleDeleteClick(portfolio)}
                            className="ripple-container"
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              border: 'none',
                              backgroundColor: 'transparent',
                              textAlign: 'left',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              fontSize: '14px',
                              color: '#ff3333',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fff5f5'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
          })}
        </div>
      ) : (
        // Grid View - Card format
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
        }} className="fade-in portfolio-grid">
          {sortedPortfolios.map((portfolio, index) => {
            // Debug: Log portfolio cover status
            if (index === 0) {
              console.log('🎨 Rendering portfolios, first portfolio:', {
                id: portfolio._id,
                title: portfolio.title,
                cover: portfolio.cover,
                hasCover: !!portfolio.cover
              });
            }

            const color = getColorForPortfolio(portfolio._id);
            const lastUpdated = new Date(portfolio.updatedAt || portfolio.createdAt);
            const timeDiff = Date.now() - lastUpdated.getTime();
            const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
            const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

            let dateText;
            if (hoursAgo < 1) {
              dateText = 'Updated recently';
            } else if (hoursAgo < 24) {
              dateText = `Updated ${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`;
            } else if (daysAgo === 1) {
              dateText = 'Updated 1 day ago';
            } else {
              dateText = `Updated ${daysAgo} days ago`;
            }

            return (
              <div
                key={portfolio._id}
                className="stagger-item"
                style={{
                  backgroundColor: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  overflow: 'visible',
                  position: 'relative',
                  zIndex: openMenuId === portfolio._id ? 1200 : 1,
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#ccc';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                }}
              >
                {/* Portfolio Preview */}
                <div
                  style={{
                    aspectRatio: '16/10',
                    backgroundImage: portfolio.cover
                      ? `url(${portfolio.cover})`
                      : `url(/placeholder-612.webp)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    borderRadius: '8px 8px 0 0',
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                  className="group"
                >

                  {/* Upload overlay on hover */}
                  <label
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: uploadingCoverId === portfolio._id ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: uploadingCoverId === portfolio._id ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      opacity: uploadingCoverId === portfolio._id ? 1 : 0,
                      pointerEvents: 'auto',
                    }}
                    className="upload-overlay"
                    onMouseEnter={(e) => {
                      if (uploadingCoverId !== portfolio._id) {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                        e.currentTarget.style.opacity = 1;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (uploadingCoverId !== portfolio._id) {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0)';
                        e.currentTarget.style.opacity = 0;
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={(e) => handleCoverUpload(e, portfolio._id)}
                      disabled={uploadingCoverId === portfolio._id}
                      style={{ display: 'none' }}
                    />
                    {uploadingCoverId === portfolio._id ? (
                      <>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            border: '4px solid rgba(255,255,255,0.3)',
                            borderTop: '4px solid #fff',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                          }}
                        />
                        <span style={{ color: '#fff', fontSize: '14px', fontWeight: '600' }}>
                          Uploading...
                        </span>
                      </>
                    ) : (
                      <>
                        <Camera size={32} color="#fff" strokeWidth={1.5} />
                        <span style={{ color: '#fff', fontSize: '14px', fontWeight: '600' }}>
                          {portfolio.cover ? 'Change Cover' : 'Add Cover'}
                        </span>
                      </>
                    )}
                  </label>

                  {portfolio.published && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      padding: '4px 8px',
                      backgroundColor: '#00ccaa',
                      color: '#fff',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      zIndex: 10,
                    }}>
                      <CheckCircle size={12} />
                      LIVE
                    </div>
                  )}
                </div>

                <style jsx>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>

                {/* Portfolio Info */}
                <div style={{ padding: '16px', position: 'relative', zIndex: openMenuId === portfolio._id ? 1100 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {portfolio.title || 'Untitled Portfolio'}
                    </h3>

                    {/* Three Dots Menu */}
                    <div style={{ position: 'relative', zIndex: 1100 }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (openMenuId === portfolio._id) {
                            handleCloseMenu();
                          } else {
                            setOpenMenuId(portfolio._id);
                          }
                        }}
                        className="button-press ripple-container"
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '4px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background-color 0.2s',
                          position: 'relative',
                          zIndex: 2,
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <MoreVertical size={16} color="#666" />
                      </button>

                      {/* Dropdown Menu */}
                      {openMenuId === portfolio._id && (
                        <>
                          <div
                            style={{
                              position: 'fixed',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              zIndex: 1000,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCloseMenu();
                            }}
                          />
                          <div
                            className={isClosingMenu ? "dropdown-exit" : "dropdown-enter"}
                            style={{
                              position: 'absolute',
                              bottom: '32px',
                              right: '-8px',
                              width: '180px',
                              backgroundColor: '#fff',
                              border: '1px solid #e0e0e0',
                              borderRadius: '6px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                              overflow: 'hidden',
                              zIndex: 1300,
                            }}>
                            {portfolio.published && (
                              <>
                                <button
                                  onClick={() => window.open(`/${portfolio.slug}/html`, '_blank')}
                                  style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '14px',
                                    color: '#1a1a1a',
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                  <Eye size={16} />
                                  View
                                </button>
                                <div style={{ height: '1px', backgroundColor: '#e0e0e0' }} />
                              </>
                            )}
                            <button
                              onClick={() => handleTogglePublish(portfolio)}
                              style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: 'none',
                                backgroundColor: 'transparent',
                                textAlign: 'left',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '14px',
                                color: portfolio.published ? '#ff9900' : '#00ccaa',
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              {portfolio.published ? <XCircle size={16} /> : <CheckCircle size={16} />}
                              {portfolio.published ? 'Unpublish' : 'Publish'}
                            </button>
                            <div style={{ height: '1px', backgroundColor: '#e0e0e0' }} />
                            <button
                              onClick={() => handleDeleteClick(portfolio)}
                              className="ripple-container"
                              style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: 'none',
                                backgroundColor: 'transparent',
                                textAlign: 'left',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '14px',
                                color: '#ff3333',
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fff5f5'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <p style={{ fontSize: '12px', color: '#999', marginBottom: '12px' }}>
                    {dateText}
                  </p>

                  {/* Actions */}
                  <button
                    onClick={() => navigate(`/portfolio-builder/${portfolio._id}`)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid #e0e0e0',
                      backgroundColor: '#fff',
                      color: '#1a1a1a',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#fb8500';
                      e.currentTarget.style.color = '#fb8500';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e0e0e0';
                      e.currentTarget.style.color = '#1a1a1a';
                    }}
                  >
                    <Edit size={16} />
                    Edit Portfolio
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>
    </>
  );
};

export default PortfoliosSectionNew;
