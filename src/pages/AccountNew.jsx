import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Pencil, Upload, ArrowLeft } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import usePortfolioStore from '../stores/portfolioStore';
import useUploadStore from '../stores/uploadStore';
import { uploadAvatar as uploadAvatarApi } from '../lib/uploadApi';
import toast from 'react-hot-toast';
import TopNavbarNew from '../components/DashboardNew/TopNavbarNew';
import '../styles/account-responsive.css';

const Account = ({ setCurrentPage }) => {
  const navigate = useNavigate();
  const { user: rawUser, updateProfile } = useAuthStore();
  const { portfolios, fetchUserPortfolios } = usePortfolioStore();
  const { startUpload, getUpload, completeUpload, failUpload, removeUpload, getPreviewUrl } = useUploadStore();

  // Handle nested user object structure
  const user = rawUser?.user || rawUser;

  const [showEditModal, setShowEditModal] = useState(false); // Show/hide modal
  const [showAvatarModal, setShowAvatarModal] = useState(false); // Show/hide avatar upload modal
  const [editingField, setEditingField] = useState(null); // Track which field is being edited
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [tempData, setTempData] = useState({}); // Temporary data while editing
  const [isDragging, setIsDragging] = useState(false); // Track drag state for avatar upload
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null); // Store selected file before upload
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(null); // Preview URL for selected file
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // Top navbar user menu state
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || user?.name || '',
    email: user?.email || '',
    location: user?.location || '',
  });
  const [avatarUploadId, setAvatarUploadId] = useState(null);
  const [avatarCloudinaryUrl, setAvatarCloudinaryUrl] = useState(null);

  // Get avatar upload state
  const avatarUpload = avatarUploadId ? getUpload(avatarUploadId) : null;
  const avatarPreview = avatarUploadId
    ? getPreviewUrl(avatarUploadId)
    : (avatarCloudinaryUrl || user?.avatar || user?.profilePicture || null);
  const isUploadingAvatar = avatarUpload?.status === 'uploading';
  const avatarUploadProgress = avatarUpload?.progress || 0;

  // Fetch portfolios on component mount
  useEffect(() => {
    fetchUserPortfolios();
  }, [fetchUserPortfolios]);

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      const newData = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || user.name || '',
        email: user.email || '',
        location: user.location || '',
      };
      setFormData(newData);
      setAvatarCloudinaryUrl(user.avatar || user.profilePicture || null);
    }
  }, [user]);

  // Cleanup upload on unmount
  useEffect(() => {
    return () => {
      if (avatarUploadId) {
        removeUpload(avatarUploadId);
      }
    };
  }, [avatarUploadId, removeUpload]);

  // Get user initials for avatar fallback
  const getInitials = () => {
    const name = user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempData((prev) => ({ ...prev, [name]: value }));
  };

  const startEditing = (field) => {
    setEditingField(field);
    // Initialize temp data with current values
    if (field === 'name') {
      setTempData({
        firstName: formData.firstName,
        lastName: formData.lastName
      });
    } else {
      setTempData({ [field]: formData[field] });
    }
    setErrors({});
    setShowEditModal(true);
  };

  const cancelEditing = () => {
    setShowEditModal(false);
    setTimeout(() => {
      setEditingField(null);
      setTempData({});
      setErrors({});
    }, 200);
  };

  const handleAvatarFileSelected = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (4MB max)
    if (file.size > 4 * 1024 * 1024) {
      toast.error('File size must be less than 4MB');
      return;
    }

    // Store file and create preview
    setSelectedAvatarFile(file);
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreviewUrl(previewUrl);
  };

  const handleSaveAvatar = async () => {
    if (!selectedAvatarFile) return;

    // Close modal
    setShowAvatarModal(false);

    // Clean up preview URL
    if (avatarPreviewUrl) {
      URL.revokeObjectURL(avatarPreviewUrl);
      setAvatarPreviewUrl(null);
    }

    // 1. Create instant preview and start tracking
    const uploadId = startUpload(selectedAvatarFile);
    setAvatarUploadId(uploadId);

    // 2. Upload to Cloudinary in background
    try {
      const result = await uploadAvatarApi(selectedAvatarFile, (progress) => {
        useUploadStore.getState().updateProgress(uploadId, progress);
      });

      console.log('📸 Avatar upload result:', result);

      // Check if we have user data in response (backend might not return success field)
      const userData = result.data?.user || result.user || result.data;

      if (userData && (userData.avatar || userData.profilePicture)) {
        // 3. Complete upload and store Cloudinary URL
        const avatarUrl = userData.avatar || userData.profilePicture;
        completeUpload(uploadId, avatarUrl);
        setAvatarCloudinaryUrl(avatarUrl);

        // Update user in auth store
        useAuthStore.setState({ user: userData });
        toast.success('Avatar uploaded successfully!');
      } else {
        console.error('❌ Invalid response structure:', result);
        throw new Error(result.message || result.error || 'Upload failed - invalid response');
      }
    } catch (error) {
      console.error('❌ Avatar upload error:', error);
      failUpload(uploadId, error.message);
      toast.error(`Failed to upload avatar: ${error.message}`);
    } finally {
      setSelectedAvatarFile(null);
    }
  };

  const handleCancelAvatarUpload = () => {
    if (avatarPreviewUrl) {
      URL.revokeObjectURL(avatarPreviewUrl);
      setAvatarPreviewUrl(null);
    }
    setSelectedAvatarFile(null);
    setShowAvatarModal(false);
  };

  const handleAvatarFileSelect = (e) => {
    const file = e.target.files[0];
    handleAvatarFileSelected(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleAvatarFileSelected(file);
  };

  const handleSaveField = async (field) => {
    setIsSaving(true);
    setErrors({});

    try {
      const updateData = {};

      if (field === 'name') {
        // Handle name field (firstName and lastName)
        updateData.firstName = tempData.firstName;
        updateData.lastName = tempData.lastName;
      } else {
        updateData[field] = tempData[field];
      }

      console.log('Updating field:', field, updateData);

      // Update profile with only this field
      const result = await updateProfile(updateData);

      if (result.success) {
        // Update form data with new values
        setFormData((prev) => ({ ...prev, ...updateData }));
        setShowEditModal(false);
        setTimeout(() => {
          setEditingField(null);
          setTempData({});
        }, 200);

        // Show success message based on field
        const fieldName = field === 'name' ? 'Name' :
                         field === 'username' ? 'Username' :
                         field === 'email' ? 'Email' :
                         field === 'location' ? 'Location' : field;
        toast.success(`${fieldName} updated successfully!`);
      } else {
        // Handle validation errors
        if (result.details) {
          setErrors(result.details);
          // Show field-specific errors
          Object.entries(result.details).forEach(([field, message]) => {
            toast.error(`${field}: ${message}`);
          });
        } else {
          toast.error(result.error || 'Failed to update profile');
        }
      }
    } catch (error) {
      console.error('Failed to save field:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  // Get modal title and fields based on editing field
  const getModalConfig = () => {
    switch(editingField) {
      case 'name':
        return { title: 'Edit name', subtitle: 'Enter a new name below' };
      case 'username':
        return { title: 'Edit username', subtitle: 'Enter a new username below' };
      case 'email':
        return { title: 'Edit email address', subtitle: 'Enter a new email address below' };
      case 'location':
        return { title: 'Edit location', subtitle: 'Enter a new location below' };
      default:
        return { title: 'Edit field', subtitle: 'Enter a new value below' };
    }
  };

  const modalConfig = getModalConfig();

  return (
    <div className="account-page-no-sidebar">
      {/* Top Navbar */}
      <TopNavbarNew
        currentPage="profile"
        setCurrentPage={setCurrentPage}
        isUserMenuOpen={isUserMenuOpen}
        setIsUserMenuOpen={setIsUserMenuOpen}
      />

      {/* Avatar Upload Modal */}
      {showAvatarModal && (
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
            padding: '20px'
          }}
          onClick={handleCancelAvatarUpload}
          className="modal-backdrop"
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '28px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
            className="modal-content"
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1a1a1a', marginBottom: '6px' }}>
                  Profile picture
                </h3>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  Add a picture to help people recognize you
                </p>
              </div>
              <button
                onClick={handleCancelAvatarUpload}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#999',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)'
                }}
                className="button-press ripple-container"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Drag and Drop Area */}
            {!selectedAvatarFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className="button-press ripple-container"
                style={{
                  border: `2px dashed ${isDragging ? '#fb8500' : '#e0e0e0'}`,
                  borderRadius: '12px',
                  padding: '48px 24px',
                  textAlign: 'center',
                  backgroundColor: isDragging ? '#fff5e6' : '#f8f9fa',
                  transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
                  marginBottom: '16px',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onClick={() => document.getElementById('avatar-upload-modal').click()}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 1 }}>
                  <div
                    className="scale-in"
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      backgroundColor: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      transition: 'transform 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <Upload size={24} color="#fb8500" />
                  </div>
                  <div>
                    <p style={{ fontSize: '15px', fontWeight: '500', color: '#1a1a1a', marginBottom: '4px' }}>
                      Browse your computer
                    </p>
                    <p style={{ fontSize: '13px', color: '#666' }}>
                      or drop your image here
                    </p>
                  </div>
                </div>
                <input
                  id="avatar-upload-modal"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileSelect}
                  style={{ display: 'none' }}
                  disabled={isUploadingAvatar}
                />
              </div>
            ) : (
              <div
                style={{
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'center',
                  backgroundColor: '#f8f9fa',
                  marginBottom: '16px',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}>
                    <img
                      src={avatarPreviewUrl}
                      alt="Preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (avatarPreviewUrl) {
                        URL.revokeObjectURL(avatarPreviewUrl);
                        setAvatarPreviewUrl(null);
                      }
                      setSelectedAvatarFile(null);
                      // Reset file input
                      const fileInput = document.getElementById('avatar-upload-modal');
                      if (fileInput) fileInput.value = '';
                    }}
                    className="button-press ripple-container"
                    style={{
                      padding: '8px 16px',
                      backgroundColor: 'transparent',
                      border: '1px solid #e0e0e0',
                      borderRadius: '6px',
                      color: '#666',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f5f5f5';
                      e.currentTarget.style.borderColor = '#ccc';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = '#e0e0e0';
                    }}
                  >
                    Choose different image
                  </button>
                </div>
              </div>
            )}

            {/* Info Text */}
            <p style={{ fontSize: '13px', color: '#666', textAlign: 'center', marginBottom: '24px' }}>
              Make sure your image is smaller than 4MB and in PNG or JPEG format.
            </p>

            {/* Modal Footer */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={handleCancelAvatarUpload}
                className="button-press ripple-container"
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'transparent',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  color: '#666',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                  e.currentTarget.style.borderColor = '#ccc';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAvatar}
                disabled={!selectedAvatarFile}
                className="button-press ripple-container"
                style={{
                  padding: '12px 24px',
                  backgroundColor: selectedAvatarFile ? '#fb8500' : '#e0e0e0',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: selectedAvatarFile ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  if (selectedAvatarFile) {
                    e.currentTarget.style.backgroundColor = '#ff9500';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(251, 133, 0, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedAvatarFile) {
                    e.currentTarget.style.backgroundColor = '#fb8500';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
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
            padding: '20px'
          }}
          onClick={cancelEditing}
          className="modal-backdrop"
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '28px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
            className="modal-content"
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1a1a1a', marginBottom: '6px' }}>
                  {modalConfig.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  {modalConfig.subtitle}
                </p>
              </div>
              <button
                onClick={cancelEditing}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#999',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)'
                }}
                className="button-press ripple-container"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ marginBottom: '24px' }}>
              {editingField === 'name' ? (
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1a1a1a', marginBottom: '8px' }}>
                    Full name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={tempData.firstName || ''}
                    onChange={handleInputChange}
                    placeholder="First name"
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: `2px solid ${errors.firstName ? '#dc3545' : '#e0e0e0'}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#fff',
                      color: '#1a1a1a',
                      marginBottom: '12px',
                      transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)'
                    }}
                    onFocus={(e) => {
                      if (!errors.firstName) {
                        e.target.style.borderColor = '#fb8500';
                        e.target.style.boxShadow = '0 0 0 3px rgba(251, 133, 0, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.firstName) {
                        e.target.style.borderColor = '#e0e0e0';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={tempData.lastName || ''}
                    onChange={handleInputChange}
                    placeholder="Last name"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: `2px solid ${errors.lastName ? '#dc3545' : '#e0e0e0'}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#fff',
                      color: '#1a1a1a',
                      transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)'
                    }}
                    onFocus={(e) => {
                      if (!errors.lastName) {
                        e.target.style.borderColor = '#fb8500';
                        e.target.style.boxShadow = '0 0 0 3px rgba(251, 133, 0, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.lastName) {
                        e.target.style.borderColor = '#e0e0e0';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  />
                </div>
              ) : editingField === 'username' ? (
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1a1a1a', marginBottom: '8px' }}>
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={tempData.username || ''}
                    onChange={handleInputChange}
                    placeholder="Username"
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: `2px solid ${errors.username ? '#dc3545' : '#e0e0e0'}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#fff',
                      color: '#1a1a1a',
                      transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)'
                    }}
                    onFocus={(e) => {
                      if (!errors.username) {
                        e.target.style.borderColor = '#fb8500';
                        e.target.style.boxShadow = '0 0 0 3px rgba(251, 133, 0, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.username) {
                        e.target.style.borderColor = '#e0e0e0';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  />
                </div>
              ) : editingField === 'email' ? (
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1a1a1a', marginBottom: '8px' }}>
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={tempData.email || ''}
                    onChange={handleInputChange}
                    placeholder="Email"
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: `2px solid ${errors.email ? '#dc3545' : '#e0e0e0'}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#fff',
                      color: '#1a1a1a',
                      transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)'
                    }}
                    onFocus={(e) => {
                      if (!errors.email) {
                        e.target.style.borderColor = '#fb8500';
                        e.target.style.boxShadow = '0 0 0 3px rgba(251, 133, 0, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      if (!errors.email) {
                        e.target.style.borderColor = '#e0e0e0';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                  />
                </div>
              ) : editingField === 'location' ? (
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1a1a1a', marginBottom: '8px' }}>
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={tempData.location || ''}
                    onChange={handleInputChange}
                    placeholder="Location"
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#fff',
                      color: '#1a1a1a',
                      transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#fb8500';
                      e.target.style.boxShadow = '0 0 0 3px rgba(251, 133, 0, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e0e0e0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              ) : null}
            </div>

            {/* Modal Footer */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={cancelEditing}
                className="button-press ripple-container"
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'transparent',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  color: '#666',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                  e.currentTarget.style.borderColor = '#ccc';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveField(editingField)}
                disabled={isSaving}
                className="button-press ripple-container"
                style={{
                  padding: '12px 24px',
                  backgroundColor: isSaving ? '#e57900' : '#fb8500',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  opacity: isSaving ? 0.7 : 1,
                  transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  if (!isSaving) {
                    e.currentTarget.style.backgroundColor = '#ff9500';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(251, 133, 0, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSaving) {
                    e.currentTarget.style.backgroundColor = '#fb8500';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="account-page-wrapper" style={{ paddingTop: '56px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <div className="account-content" style={{ padding: '48px 64px', maxWidth: '900px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>

        <div style={{ maxWidth: '100%' }}>
          {/* Back to Dashboard Button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="button-press ripple-container back-to-dashboard-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: 'transparent',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              color: '#666',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '24px',
              transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
              e.currentTarget.style.borderColor = '#ccc';
              e.currentTarget.style.transform = 'translateX(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = '#e0e0e0';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <ArrowLeft size={16} />
            <span className="back-text-full">Back to Dashboard</span>
            <span className="back-text-short" style={{ display: 'none' }}>Back</span>
          </button>

          <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px' }}>Account settings</h1>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '48px' }}>Manage your information.</p>

          {/* Public Profile Section */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Settings size={20} />
              <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Public profile</h2>
            </div>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
              Manage your personal information and how it appears on your portfolios.
            </p>

            {/* Profile Picture Field */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', borderBottom: '1px solid #e0e0e0' }}>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a' }}>Profile picture</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fb8500', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '18px', color: '#fff', overflow: 'hidden' }}>
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      getInitials()
                    )}
                  </div>
                  {isUploadingAvatar && (
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '20px', height: '20px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
                        <p style={{ fontSize: '9px', color: '#fff', marginTop: '2px' }}>{avatarUploadProgress}%</p>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowAvatarModal(true)}
                  disabled={isUploadingAvatar}
                  className="button-press ripple-container"
                  style={{
                    padding: '6px 12px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#1a1a1a',
                    cursor: isUploadingAvatar ? 'not-allowed' : 'pointer',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    opacity: isUploadingAvatar ? 0.5 : 1,
                    transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    if (!isUploadingAvatar) {
                      e.currentTarget.style.backgroundColor = '#f5f5f5';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isUploadingAvatar) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  <Pencil size={14} />
                </button>
              </div>
            </div>

            {/* Name Field */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', borderBottom: '1px solid #e0e0e0' }}>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a' }}>Name</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '14px', color: '#666' }}>
                  {formData.firstName && formData.lastName
                    ? `${formData.firstName} ${formData.lastName}`
                    : formData.firstName || formData.lastName || user?.name || 'Not set'}
                </span>
                <button
                  onClick={() => startEditing('name')}
                  className="button-press ripple-container"
                  style={{
                    padding: '6px 12px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#1a1a1a',
                    cursor: 'pointer',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <Pencil size={14} />
                </button>
              </div>
            </div>

            {/* Username Field */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', borderBottom: '1px solid #e0e0e0' }}>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a' }}>Username</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '14px', color: '#666' }}>{formData.username || 'Not set'}</span>
                <button
                  onClick={() => startEditing('username')}
                  className="button-press ripple-container"
                  style={{
                    padding: '6px 12px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#1a1a1a',
                    cursor: 'pointer',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <Pencil size={14} />
                </button>
              </div>
            </div>

            {/* Email Field */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', borderBottom: '1px solid #e0e0e0' }}>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a' }}>Email address</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '14px', color: '#666' }}>{formData.email || 'Not set'}</span>
                <button
                  onClick={() => startEditing('email')}
                  className="button-press ripple-container"
                  style={{
                    padding: '6px 12px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#1a1a1a',
                    cursor: 'pointer',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <Pencil size={14} />
                </button>
              </div>
            </div>

            {/* Location Field */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', borderBottom: '1px solid #e0e0e0' }}>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a' }}>Location</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '14px', color: '#666' }}>{formData.location || 'Not set'}</span>
                <button
                  onClick={() => startEditing('location')}
                  className="button-press ripple-container"
                  style={{
                    padding: '6px 12px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#1a1a1a',
                    cursor: 'pointer',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <Pencil size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Aurea Account Section */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Settings size={20} />
              <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Aurea account</h2>
            </div>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
              Need to delete your account? Please contact our support team for assistance.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', borderBottom: '1px solid #e0e0e0' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a', marginBottom: '4px' }}>Delete account and data</div>
                <div style={{ fontSize: '14px', color: '#666' }}>Contact support to permanently delete your Aurea account</div>
              </div>
              <button
                onClick={() => window.location.href = 'mailto:aureatool@gmail.com?subject=Account Deletion Request'}
                className="button-press ripple-container"
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#fb8500',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ff9500';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(251, 133, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fb8500';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Contact Support
              </button>
            </div>
          </div>

          {/* Footer Links */}
          <div style={{ display: 'flex', gap: '24px', paddingTop: '24px', borderTop: '1px solid #e0e0e0', fontSize: '13px', flexWrap: 'wrap' }}>
            <a href="#" style={{ color: '#fb8500', textDecoration: 'none' }}>Support</a>
            <a href="#" style={{ color: '#fb8500', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: '#fb8500', textDecoration: 'none' }}>Terms</a>
            <a href="#" style={{ color: '#fb8500', textDecoration: 'none' }}>Do Not Sell or Share My Personal Information</a>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
