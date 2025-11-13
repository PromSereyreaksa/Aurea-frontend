import { useState, useRef, useEffect } from 'react';
import useUploadStore from '../../stores/uploadStore';
import { uploadImage as uploadImageApi } from '../../lib/uploadApi';

const ImageUpload = ({ currentImage, onImageChange, className = '', placeholder = "Upload Image" }) => {
  const [dragActive, setDragActive] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [currentUploadId, setCurrentUploadId] = useState(null);
  const fileInputRef = useRef(null);
  const prevImageRef = useRef(currentImage);

  // Get upload store methods
  const { startUpload, getUpload, completeUpload, failUpload, removeUpload, getPreviewUrl } = useUploadStore();

  // Get current upload state
  const uploadState = currentUploadId ? getUpload(currentUploadId) : null;
  const previewUrl = currentUploadId ? getPreviewUrl(currentUploadId) : currentImage;
  const isUploading = uploadState?.status === 'uploading';
  const uploadProgress = uploadState?.progress || 0;

  // Reset loading state when currentImage changes
  useEffect(() => {
    if (currentImage !== prevImageRef.current) {
      setImageLoading(false);
      setImageError(false);
      prevImageRef.current = currentImage;
    }
  }, [currentImage]);

  // Cleanup upload on unmount
  useEffect(() => {
    return () => {
      if (currentUploadId) {
        removeUpload(currentUploadId);
      }
    };
  }, [currentUploadId, removeUpload]);

  // Handle file upload to actual backend with instant preview
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

    // 1. IMMEDIATELY show preview to parent (before any state updates)
    // This ensures the image displays instantly without waiting for React re-renders
    const localPreview = URL.createObjectURL(file);
    onImageChange(localPreview);
    setImageError(false);

    // 2. Start tracking upload
    const uploadId = startUpload(file);
    setCurrentUploadId(uploadId);

    try {
      // 3. Upload with all optimizations:
      //    - Automatic compression (60-80% smaller)
      //    - Fake fast progress (instant 0-30%)
      //    - Direct Cloudinary upload (if configured)
      //    - Connection prewarming already active
      console.log('📤 ImageUpload: Starting optimized upload...', file.name);

      const result = await uploadImageApi(
        file,
        (progressValue) => {
          // Track progress in upload store
          useUploadStore.getState().updateProgress(uploadId, progressValue);
        },
        {
          compress: true,  // Auto compress before upload
          direct: true,    // Use direct upload if available
        }
      );

      console.log('✅ ImageUpload: Upload response:', result);

      if (result.success && result.data?.url) {
        // 4. Replace blob URL preview with Cloudinary URL
        console.log('✅ ImageUpload: Replacing preview with Cloudinary URL:', result.data.url);
        completeUpload(uploadId, result.data.url);
        onImageChange(result.data.url);
        console.log('✅ ImageUpload: Upload completed successfully');
      } else {
        throw new Error(result.message || 'Upload failed - no URL returned');
      }

    } catch (error) {
      console.error('❌ ImageUpload: Upload error:', error);
      failUpload(uploadId, error.message);
      alert(`Failed to upload image: ${error.message}`);
      // Keep the preview so user can see what they tried to upload
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
      {previewUrl ? (
        <div className="relative group">
          <img
            src={previewUrl}
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
              <p className="text-xs text-red-500 px-4 text-center break-all">{previewUrl}</p>
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

          {/* Upload progress overlay - Enhanced with smooth animations */}
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center rounded-lg backdrop-blur-sm">
              <div className="text-center text-white">
                {/* Animated spinner with glow effect */}
                <div className="relative mb-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-3 border-t-orange-500 border-r-orange-500 border-b-transparent border-l-transparent mx-auto"></div>
                  <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-2 border-orange-500 opacity-20"></div>
                </div>

                {/* Progress status text with smooth fade */}
                <p className="text-sm font-semibold mb-3 animate-pulse">
                  {uploadProgress < 30
                    ? 'Preparing image...'
                    : uploadProgress < 50
                    ? 'Optimizing...'
                    : uploadProgress < 90
                    ? 'Uploading...'
                    : 'Almost done...'}
                </p>

                {/* Enhanced progress bar with gradient */}
                <div className="w-56 bg-gray-800 rounded-full h-2.5 overflow-hidden shadow-inner">
                  <div
                    className="h-2.5 rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 shadow-lg"
                    style={{
                      width: `${uploadProgress}%`,
                      boxShadow: '0 0 10px rgba(251, 146, 60, 0.5)',
                    }}
                  />
                </div>

                {/* Progress percentage with smooth counting */}
                <p className="text-base font-bold mt-3 tabular-nums">
                  {uploadProgress}%
                </p>

                {/* Helpful tip based on progress */}
                <p className="text-xs mt-2 opacity-70">
                  {uploadProgress < 30
                    ? 'Compressing for faster loading'
                    : uploadProgress < 90
                    ? 'Uploading to cloud storage'
                    : 'Finalizing upload'}
                </p>
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