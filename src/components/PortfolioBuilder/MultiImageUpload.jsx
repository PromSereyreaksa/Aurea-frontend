import { useState, useRef, useEffect } from 'react';
import useUploadStore from '../../stores/uploadStore';
import { uploadImage as uploadImageApi } from '../../lib/uploadApi';

const MultiImageUpload = ({
  images = [],
  onImagesChange,
  maxImages = 6,
  className = ''
}) => {
  const [uploadIds, setUploadIds] = useState([]); // Track upload IDs for progress
  const fileInputRef = useRef(null);

  // Get upload store methods
  const { startUpload, getUpload, completeUpload, failUpload, removeUpload } = useUploadStore();

  // Cleanup uploads on unmount
  useEffect(() => {
    return () => {
      uploadIds.forEach(id => removeUpload(id));
    };
  }, [uploadIds, removeUpload]);

  // Check if any uploads are in progress
  const hasActiveUploads = uploadIds.some(id => {
    const upload = getUpload(id);
    return upload?.status === 'uploading';
  });

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    const currentImageCount = images.filter(img => img).length;
    const remainingSlots = maxImages - currentImageCount;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    // Validate all files first
    for (const file of filesToUpload) {
      if (!file.type.startsWith('image/')) {
        alert('Please select image files only');
        return;
      }
      if (file.size > 25 * 1024 * 1024) {
        alert('File size must be less than 25MB');
        return;
      }
    }

    // 1. Create instant previews for all files
    const newUploadIds = [];
    const newImages = [...images];

    filesToUpload.forEach(file => {
      const uploadId = startUpload(file);
      newUploadIds.push(uploadId);

      // Create local preview
      const localPreview = URL.createObjectURL(file);

      // Add to images array
      const emptyIndex = newImages.findIndex(img => !img);
      if (emptyIndex !== -1) {
        newImages[emptyIndex] = localPreview;
      } else if (newImages.length < maxImages) {
        newImages.push(localPreview);
      }
    });

    // Track upload IDs
    setUploadIds(prev => [...prev, ...newUploadIds]);

    // 2. Show previews immediately
    onImagesChange(newImages);

    // 3. Upload all files in parallel
    filesToUpload.forEach((file, index) => {
      uploadSingleImage(file, newUploadIds[index], newImages, index);
    });
  };

  const uploadSingleImage = async (file, uploadId, currentImages) => {
    try {
      console.log('📤 MultiImageUpload: Starting optimized upload...', file.name);

      // Upload with all optimizations (compression, fake progress, direct upload)
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

      if (result.success && result.data?.url) {
        console.log('✅ MultiImageUpload: Upload complete:', result.data.url);

        // Complete the upload in store
        completeUpload(uploadId, result.data.url);

        // Replace local preview with Cloudinary URL
        const updatedImages = [...currentImages];
        const previewIndex = updatedImages.findIndex((img) => {
          const upload = getUpload(uploadId);
          return img === upload?.preview;
        });

        if (previewIndex !== -1) {
          updatedImages[previewIndex] = result.data.url;
          onImagesChange(updatedImages);
        }
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('❌ MultiImageUpload: Upload error:', error);
      failUpload(uploadId, error.message);
      alert(`Failed to upload ${file.name}: ${error.message}`);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files) {
      handleFileUpload(e.target.files);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    onImagesChange(newImages);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const currentImageCount = images.filter(img => img).length;
  const canAddMore = currentImageCount < maxImages;

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Image Grid */}
      {currentImageCount > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {images.map((image, index) => {
            if (!image) return null;

            // Find upload ID for this image (if still uploading)
            const uploadId = uploadIds.find(id => {
              const upload = getUpload(id);
              return upload && (upload.preview === image || upload.url === image);
            });

            const uploadState = uploadId ? getUpload(uploadId) : null;
            const isUploading = uploadState?.status === 'uploading';
            const progress = uploadState?.progress || 0;

            return (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Image ${index + 1}`}
                  className="w-full h-40 object-cover rounded-lg border-2 border-gray-300"
                />

                {/* Upload progress overlay - Enhanced */}
                {isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-70 rounded-lg flex flex-col items-center justify-center backdrop-blur-sm">
                    <div className="text-white text-center">
                      {/* Animated spinner with glow */}
                      <div className="relative mb-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-orange-500 border-r-orange-500 border-b-transparent border-l-transparent mx-auto"></div>
                        <div className="absolute inset-0 animate-ping rounded-full h-8 w-8 border border-orange-500 opacity-20"></div>
                      </div>

                      {/* Enhanced progress bar with gradient */}
                      <div className="w-28 bg-gray-800 rounded-full h-2 overflow-hidden shadow-inner">
                        <div
                          className="h-2 rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-orange-500 to-yellow-400"
                          style={{
                            width: `${progress}%`,
                            boxShadow: '0 0 8px rgba(251, 146, 60, 0.5)',
                          }}
                        />
                      </div>

                      {/* Progress percentage */}
                      <p className="text-xs font-bold mt-2 tabular-nums">{progress}%</p>
                    </div>
                  </div>
                )}

                {/* Remove button - only show when not uploading */}
                {!isUploading && (
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Area */}
      {canAddMore && (
        <div
          onClick={hasActiveUploads ? undefined : openFileDialog}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`
            w-full h-48 border-2 border-dashed rounded-lg
            flex flex-col items-center justify-center cursor-pointer
            transition-all duration-200
            ${hasActiveUploads
              ? 'border-orange-500 bg-orange-50 cursor-not-allowed'
              : 'border-gray-300 bg-gray-50 hover:border-orange-400 hover:bg-orange-50'
            }
          `}
        >
          {hasActiveUploads ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-3"></div>
              <p className="text-sm text-gray-600">Uploading images...</p>
              <p className="text-xs text-gray-500 mt-1">Please wait</p>
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
              <p className="text-gray-700 font-medium mb-1">Upload Images</p>
              <p className="text-sm text-gray-500">Drag & drop or click to browse</p>
              <p className="text-xs text-gray-400 mt-2">
                {currentImageCount} of {maxImages} images • PNG, JPG, GIF up to 25MB
              </p>
            </>
          )}
        </div>
      )}

      {!canAddMore && (
        <p className="text-sm text-gray-500 text-center mt-2">
          Maximum {maxImages} images reached
        </p>
      )}
    </div>
  );
};

export default MultiImageUpload;
