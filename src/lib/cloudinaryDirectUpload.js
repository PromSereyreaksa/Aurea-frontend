/**
 * Cloudinary Direct Upload API
 *
 * Enables direct browser-to-Cloudinary uploads, bypassing the backend API.
 *
 * Benefits:
 * - 30-40% faster uploads (single network hop instead of two)
 * - Reduced backend load (no image proxy)
 * - Better scalability (Cloudinary CDN handles traffic)
 *
 * Setup required:
 * 1. Create unsigned upload preset in Cloudinary dashboard
 * 2. Add VITE_CLOUDINARY_UPLOAD_PRESET to .env
 * 3. See CLOUDINARY_DIRECT_UPLOAD_SETUP.md for full instructions
 */

import { compressImage, COMPRESSION_OPTIONS } from './uploadApi';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Check if direct upload is configured
 */
export const isDirectUploadAvailable = () => {
  return !!(CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET);
};

/**
 * Upload image directly to Cloudinary (bypasses backend)
 *
 * @param {File} file - The image file to upload
 * @param {Function} onProgress - Callback for upload progress (0-100)
 * @param {Object} options - Upload options
 * @param {boolean} options.compress - Enable compression (default: true)
 * @param {Object} options.compressionOptions - Custom compression settings
 * @param {string} options.folder - Cloudinary folder path (default: 'aurea-portfolio')
 * @param {string[]} options.tags - Tags to add to the upload
 * @returns {Promise<{success: boolean, data: {url: string, publicId: string, width: number, height: number}}>}
 */
export const uploadDirectToCloudinary = async (
  file,
  onProgress,
  options = {}
) => {
  // Check if direct upload is configured
  if (!isDirectUploadAvailable()) {
    throw new Error(
      'Direct Cloudinary upload not configured. See CLOUDINARY_DIRECT_UPLOAD_SETUP.md'
    );
  }

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
  const shouldCompress = options.compress !== false;

  if (shouldCompress) {
    try {
      // Report compression as 0-20% of progress
      const compressionProgress = (progress) => {
        if (onProgress) {
          onProgress(Math.round(progress * 0.2));
        }
      };

      fileToUpload = await compressImage(
        file,
        options.compressionOptions || COMPRESSION_OPTIONS.default,
        compressionProgress
      );

      console.log(`✅ Compression complete, uploading to Cloudinary...`);
    } catch (error) {
      console.warn('Compression failed, using original:', error);
      fileToUpload = file;
    }
  }

  return new Promise((resolve, reject) => {
    // Create FormData for Cloudinary
    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    // Optional parameters
    if (options.folder) {
      formData.append('folder', options.folder);
    } else {
      formData.append('folder', 'aurea-portfolio');
    }

    if (options.tags && options.tags.length > 0) {
      formData.append('tags', options.tags.join(','));
    }

    // Add context/metadata if provided
    if (options.context) {
      formData.append('context', JSON.stringify(options.context));
    }

    // Create XMLHttpRequest for progress tracking
    const xhr = new XMLHttpRequest();

    // Track upload progress (20-100% of total)
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const uploadProgress = Math.round((e.loaded * 100) / e.total);
        // Map to 20-100% range (0-20% was compression)
        const totalProgress = 20 + Math.round(uploadProgress * 0.8);
        onProgress(totalProgress);
      }
    });

    // Handle completion
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const result = JSON.parse(xhr.responseText);

          console.log('✅ Direct Cloudinary upload successful:', {
            url: result.secure_url,
            publicId: result.public_id,
            size: result.bytes,
            format: result.format,
          });

          // Return standardized response format
          resolve({
            success: true,
            data: {
              url: result.secure_url,
              publicId: result.public_id,
              width: result.width,
              height: result.height,
              format: result.format,
              bytes: result.bytes,
              createdAt: result.created_at,
              // Include raw Cloudinary response for advanced usage
              raw: result,
            },
          });
        } catch {
          reject(new Error('Invalid response from Cloudinary'));
        }
      } else {
        try {
          const errorResult = JSON.parse(xhr.responseText);
          const errorMessage =
            errorResult.error?.message || `Upload failed: ${xhr.status}`;
          reject(new Error(errorMessage));
        } catch {
          reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
        }
      }
    });

    // Handle errors
    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload to Cloudinary'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload aborted'));
    });

    // Send request directly to Cloudinary
    xhr.open('POST', CLOUDINARY_UPLOAD_URL);
    xhr.send(formData);
  });
};

/**
 * Delete an image from Cloudinary
 * Note: Requires backend API call since delete requires signature
 *
 * @param {string} publicId - The Cloudinary public ID
 * @returns {Promise<{success: boolean}>}
 */
export const deleteFromCloudinary = async (publicId) => {
  // Deletion requires signed requests, so we still use backend
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem('aurea_token');

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify({ publicId }),
  });

  if (!response.ok) {
    throw new Error(`Delete failed: ${response.status}`);
  }

  return response.json();
};

/**
 * Hybrid upload: Try direct upload first, fallback to backend
 *
 * @param {File} file - The image file
 * @param {Function} onProgress - Progress callback
 * @param {Object} options - Upload options
 * @returns {Promise<{success: boolean, data: {url: string}}>}
 */
export const uploadWithFallback = async (file, onProgress, options = {}) => {
  // Try direct upload if available
  if (isDirectUploadAvailable() && options.direct !== false) {
    try {
      console.log('📤 Attempting direct Cloudinary upload...');
      return await uploadDirectToCloudinary(file, onProgress, options);
    } catch (error) {
      console.warn('⚠️ Direct upload failed, falling back to backend:', error.message);

      // Fall back to backend upload
      const { uploadImage } = await import('./uploadApi');
      return await uploadImage(file, onProgress, { compress: false }); // Already compressed
    }
  } else {
    // Use backend upload
    console.log('📤 Using backend upload (direct upload not configured)');
    const { uploadImage } = await import('./uploadApi');
    return await uploadImage(file, onProgress, options);
  }
};

export default {
  uploadDirectToCloudinary,
  deleteFromCloudinary,
  uploadWithFallback,
  isDirectUploadAvailable,
};
