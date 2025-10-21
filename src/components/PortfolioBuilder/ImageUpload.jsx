import React, { useState, useRef, useEffect } from 'react';

const ImageUpload = ({ currentImage, onImageChange, onImageRemove, className = '', placeholder = "Upload Image" }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef(null);
  const prevImageRef = useRef(currentImage);

  // Reset loading state when currentImage changes
  useEffect(() => {
    if (currentImage !== prevImageRef.current) {
      setImageLoading(false);
      setImageError(false);
      prevImageRef.current = currentImage;
    }
  }, [currentImage]);

  // Handle file upload to actual backend
  const handleFileUpload = async (file) => {
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

    setIsUploading(true);

    try {
      // Create FormData for upload
      const formData = new FormData();
      formData.append('image', file);

      console.log('📤 ImageUpload: Uploading file...', file.name);

      // Upload to your backend API
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/upload/single`, {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type - let browser set it with boundary for FormData
          'Authorization': `Bearer ${localStorage.getItem('aurea_token') || ''}`
        }
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ ImageUpload: Upload response:', result);

      if (result.success && result.data?.url) {
        // Use the URL from your backend response
        console.log('✅ ImageUpload: Calling onImageChange with URL:', result.data.url);
        setImageError(false); // Reset error state
        setImageLoading(true); // Start loading the image
        onImageChange(result.data.url);
        console.log('✅ ImageUpload: onImageChange called successfully');
      } else {
        throw new Error(result.message || 'Upload failed - no URL returned');
      }

    } catch (error) {
      console.error('❌ ImageUpload: Upload error:', error);
      alert(`Failed to upload image: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Handle file input change
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  // Open file dialog
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // Debug logging
  console.log('🖼️ ImageUpload render - currentImage:', currentImage);

  return (
    <div className={`relative max-w-sm mx-auto ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      {/* If we have an image, show preview */}
      {currentImage ? (
        <div className="relative group">
          <img
            src={currentImage}
            alt="Current"
            className="w-full aspect-square object-cover rounded-lg border-2 border-gray-300 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={openFileDialog}
            title="Click to change image"
            onLoad={(e) => {
              console.log('✅ Image loaded successfully:', e.target.src);
              setImageError(false);
              setImageLoading(false); // Image loaded successfully
            }}
            onError={(e) => {
              console.error('❌ Image failed to load:', e.target.src);
              console.error('❌ Error event:', e);
              setImageError(true);
              setImageLoading(false);
            }}
          />

          {/* Show loading overlay while image is loading */}
          {imageLoading && !imageError && (
            <div className="absolute inset-0 bg-white bg-opacity-90 rounded-lg flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading image...</p>
              </div>
            </div>
          )}

          {/* Show error overlay if image failed to load */}
          {imageError && (
            <div className="absolute inset-0 bg-red-50 border-2 border-red-300 rounded-lg flex flex-col items-center justify-center">
              <svg className="w-12 h-12 text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm text-red-600 font-medium mb-2">Failed to load image</p>
              <p className="text-xs text-red-500 px-4 text-center break-all">{currentImage}</p>
              <button
                onClick={openFileDialog}
                className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600"
              >
                Upload New Image
              </button>
            </div>
          )}

          <div className="absolute inset-0 group-hover:bg-gray-900 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center">
            <button
              onClick={openFileDialog}
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-900 px-4 py-2 rounded-lg font-medium shadow-lg"
            >
              Change Image
            </button>
          </div>
          {isUploading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Uploading...</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* If no image, show placeholder */
        <div
          onClick={openFileDialog}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            w-full aspect-square border-2 border-dashed rounded-lg
            flex flex-col items-center justify-center cursor-pointer
            transition-all duration-200
            ${dragActive
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-300 bg-gray-50 hover:border-orange-400 hover:bg-orange-50'
            }
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {isUploading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-3"></div>
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <>
              <svg 
                className="w-16 h-16 text-gray-400 mb-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
              <p className="text-gray-700 font-medium mb-1">{placeholder}</p>
              <p className="text-sm text-gray-500">Drag & drop or click to browse</p>
              <p className="text-xs text-gray-400 mt-2">PNG, JPG, GIF up to 25MB</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;