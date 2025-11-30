/**
 * Upload API
 *
 * Provides upload functions with progress tracking using XMLHttpRequest.
 * All uploads go to Cloudinary via the backend API.
 *
 * Features:
 * - Client-side image compression (60-80% faster uploads)
 * - Web worker compression (non-blocking UI)
 * - Progress tracking
 * - Automatic format optimization
 */

import imageCompression from 'browser-image-compression';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Compression options for different image types
 */
const COMPRESSION_OPTIONS = {
  // For general portfolio images
  default: {
    maxSizeMB: 1,              // Target 1MB max
    maxWidthOrHeight: 2400,    // Max dimension 2400px (good for retina displays)
    useWebWorker: true,        // Don't block UI thread
    fileType: 'image/jpeg',    // Convert to JPEG for better compression
    initialQuality: 0.85,      // Good balance of quality/size
  },
  // For avatars/profile pictures
  avatar: {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 800,
    useWebWorker: true,
    fileType: 'image/jpeg',
    initialQuality: 0.8,
  },
  // For thumbnails
  thumbnail: {
    maxSizeMB: 0.2,
    maxWidthOrHeight: 400,
    useWebWorker: true,
    fileType: 'image/jpeg',
    initialQuality: 0.75,
  },
};

/**
 * Compress an image file before upload
 *
 * @param {File} file - The original image file
 * @param {Object} options - Compression options (defaults to COMPRESSION_OPTIONS.default)
 * @param {Function} onProgress - Optional progress callback (0-100)
 * @returns {Promise<File>} Compressed image file
 */
export const compressImage = async (file, options = COMPRESSION_OPTIONS.default, onProgress) => {
  // Skip compression for small files (< 200KB) or GIFs (preserve animation)
  if (file.size < 200 * 1024 || file.type === 'image/gif') {
    console.log('⏭️ Skipping compression:', file.size < 200 * 1024 ? 'file too small' : 'GIF animation');
    return file;
  }

  const originalSize = file.size;
  console.log(`🗜️ Compressing image: ${(originalSize / 1024 / 1024).toFixed(2)}MB`);

  try {
    const compressedFile = await imageCompression(file, {
      ...options,
      onProgress: onProgress ? (progress) => onProgress(Math.round(progress)) : undefined,
    });

    const compressedSize = compressedFile.size;
    const savings = ((1 - compressedSize / originalSize) * 100).toFixed(1);

    console.log(`✅ Compressed: ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(compressedSize / 1024 / 1024).toFixed(2)}MB (${savings}% smaller)`);

    return compressedFile;
  } catch (error) {
    console.warn('⚠️ Compression failed, using original:', error.message);
    return file; // Fallback to original if compression fails
  }
};

/**
 * Upload a single image with progress tracking
 *
 * @param {File} file - The image file to upload
 * @param {Function} onProgress - Callback for upload progress (0-100)
 * @param {Object} options - Upload options { compress: true, compressionOptions: {...} }
 * @returns {Promise<{success: boolean, data: {url: string, publicId: string}}>}
 */
export const uploadImage = async (file, onProgress, options = { compress: true }) => {
  // Validate file
  if (!file) {
    throw new Error('No file provided');
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  if (file.size > 25 * 1024 * 1024) {
    throw new Error('File size must be less than 25MB');
  }

  // Compress image if enabled
  let fileToUpload = file;
  if (options.compress !== false) {
    try {
      // Report compression progress as 0-20% of total progress
      const compressionProgress = (progress) => {
        if (onProgress) {
          onProgress(Math.round(progress * 0.2)); // 0-20%
        }
      };

      fileToUpload = await compressImage(
        file,
        options.compressionOptions || COMPRESSION_OPTIONS.default,
        compressionProgress
      );
    } catch (error) {
      console.warn('Compression failed, using original file:', error);
      fileToUpload = file;
    }
  }

  return new Promise((resolve, reject) => {
    // Create FormData
    const formData = new FormData();
    formData.append('image', fileToUpload);

    // Create XMLHttpRequest for progress tracking
    const xhr = new XMLHttpRequest();

    // Track upload progress (20-100% of total, since compression used 0-20%)
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const uploadProgress = Math.round((e.loaded * 100) / e.total);
        // Map upload progress to 20-100% range (0-20% was compression)
        const totalProgress = 20 + Math.round(uploadProgress * 0.8);
        onProgress(totalProgress);
      }
    });

    // Handle completion
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const result = JSON.parse(xhr.responseText);
          // Normalize response format to always have data.url
          if (result.success && result.data?.urls && !result.data.url) {
            result.data.url = result.data.urls[0];
          }
          resolve(result);
        } catch {
          reject(new Error('Invalid response from server'));
        }
      } else {
        try {
          const errorResult = JSON.parse(xhr.responseText);
          reject(new Error(errorResult.message || `Upload failed: ${xhr.status}`));
        } catch {
          reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
        }
      }
    });

    // Handle errors
    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload aborted'));
    });

    // Send request
    xhr.open('POST', `${API_BASE_URL}/api/upload/single`);

    // Add auth token
    const token = localStorage.getItem('aurea_token');
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    xhr.send(formData);
  });
};

/**
 * Upload multiple images in parallel with individual progress tracking
 *
 * @param {File[]} files - Array of image files to upload
 * @param {Function} onProgress - Callback for each file's progress (fileIndex, progress)
 * @returns {Promise<Array<{success: boolean, data: {url: string}}>>}
 */
export const uploadMultipleImages = async (files, onProgress) => {
  const uploadPromises = files.map((file, index) => {
    return uploadImage(file, (progress) => {
      if (onProgress) {
        onProgress(index, progress);
      }
    });
  });

  return Promise.all(uploadPromises);
};

/**
 * Delete an image from Cloudinary
 *
 * @param {string} publicId - The Cloudinary public ID of the image
 * @returns {Promise<{success: boolean}>}
 */
export const deleteImage = async (publicId) => {
  const token = localStorage.getItem('aurea_token');

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify({ publicId }),
  });

  if (!response.ok) {
    throw new Error(`Delete failed: ${response.status}`);
  }

  return response.json();
};

/**
 * Upload avatar image (for user profile)
 *
 * @param {File} file - The avatar image file
 * @param {Function} onProgress - Callback for upload progress (0-100)
 * @returns {Promise<{success: boolean, data: {user: object}}>}
 */
export const uploadAvatar = async (file, onProgress) => {
  // Validate file
  if (!file) {
    throw new Error('No file provided');
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  // Smaller size limit for avatars
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Avatar size must be less than 5MB');
  }

  // Compress avatar with smaller target size
  let fileToUpload = file;
  try {
    const compressionProgress = (progress) => {
      if (onProgress) {
        onProgress(Math.round(progress * 0.2)); // 0-20%
      }
    };

    fileToUpload = await compressImage(
      file,
      COMPRESSION_OPTIONS.avatar,
      compressionProgress
    );
  } catch (error) {
    console.warn('Avatar compression failed, using original:', error);
    fileToUpload = file;
  }

  return new Promise((resolve, reject) => {
    // Create FormData
    const formData = new FormData();
    formData.append('avatar', fileToUpload);

    // Create XMLHttpRequest for progress tracking
    const xhr = new XMLHttpRequest();

    // Track upload progress (20-100% of total, since compression used 0-20%)
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const uploadProgress = Math.round((e.loaded * 100) / e.total);
        // Map upload progress to 20-100% range (0-20% was compression)
        const totalProgress = 20 + Math.round(uploadProgress * 0.8);
        onProgress(totalProgress);
      }
    });

    // Handle completion
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const result = JSON.parse(xhr.responseText);
          resolve(result);
        } catch {
          reject(new Error('Invalid response from server'));
        }
      } else {
        try {
          const errorResult = JSON.parse(xhr.responseText);
          reject(new Error(errorResult.message || `Upload failed: ${xhr.status}`));
        } catch {
          reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
        }
      }
    });

    // Handle errors
    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload aborted'));
    });

    // Send request
    xhr.open('POST', `${API_BASE_URL}/api/users/avatar`);

    // Add auth token
    const token = localStorage.getItem('aurea_token');
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    xhr.send(formData);
  });
};

// Export compression options for advanced usage
export { COMPRESSION_OPTIONS };

export default {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  uploadAvatar,
  compressImage,
  COMPRESSION_OPTIONS,
};
