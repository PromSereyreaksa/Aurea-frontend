import React, { useState, useRef } from 'react';

const MultiImageUpload = ({ 
  images = [], 
  onImagesChange, 
  maxImages = 6, 
  className = '' 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    const currentImageCount = images.filter(img => img).length;
    const remainingSlots = maxImages - currentImageCount;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    setIsUploading(true);

    try {
      const uploadPromises = filesToUpload.map(file => uploadSingleImage(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      // Add new images to the array
      const newImages = [...images];
      uploadedUrls.forEach(url => {
        const emptyIndex = newImages.findIndex(img => !img);
        if (emptyIndex !== -1) {
          newImages[emptyIndex] = url;
        } else if (newImages.length < maxImages) {
          newImages.push(url);
        }
      });
      
      onImagesChange(newImages);
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Failed to upload images: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const uploadSingleImage = async (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Please select image files only');
    }

    // Validate file size (max 25MB)
    if (file.size > 25 * 1024 * 1024) {
      throw new Error('File size must be less than 25MB');
    }

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/upload/single`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success && result.data?.url) {
      return result.data.url;
    } else {
      throw new Error(result.message || 'Upload failed');
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
          {images.map((image, index) => image && (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Image ${index + 1}`}
                className="w-full h-40 object-cover rounded-lg border-2 border-gray-300"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {canAddMore && (
        <div
          onClick={openFileDialog}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`
            w-full h-48 border-2 border-dashed rounded-lg
            flex flex-col items-center justify-center cursor-pointer
            transition-all duration-200
            ${isUploading 
              ? 'border-orange-500 bg-orange-50 cursor-not-allowed' 
              : 'border-gray-300 bg-gray-50 hover:border-orange-400 hover:bg-orange-50'
            }
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
