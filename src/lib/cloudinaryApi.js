// Cloudinary API with enhanced error handling and optimization
export const cloudinaryApi = {
  // Configuration
  config: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
    folder: 'aurea-portfolios',
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    quality: 'auto:good',
    fetchFormat: 'auto'
  },

  // Validate configuration
  isConfigured: function() {
    return !!(this.config.cloudName && this.config.uploadPreset);
  },

  // Validate file before upload
  validateFile: function(file) {
    if (!file) {
      throw new Error('No file provided');
    }

    // Check file size
    if (file.size && file.size > this.config.maxFileSize) {
      throw new Error(`File too large. Maximum size is ${this.config.maxFileSize / (1024 * 1024)}MB`);
    }

    // Check file type
    if (file.type && !file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    return true;
  },

  // Convert data URL to blob
  dataURLToBlob: async function(dataURL) {
    try {
      const response = await fetch(dataURL);
      return await response.blob();
    } catch (error) {
      throw new Error('Failed to convert data URL to blob');
    }
  },

  // Upload image with retry logic and progress tracking
  uploadImage: async function(file, options = {}) {
    try {
      // Check if Cloudinary is configured
      if (!this.isConfigured()) {
        console.warn('Cloudinary not configured, using fallback');
        // Return data URL as fallback
        if (typeof file === 'string') return file;
        
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      // Prepare file for upload
      let uploadFile = file;
      
      // Convert data URL to blob if needed
      if (typeof file === 'string' && file.startsWith('data:')) {
        uploadFile = await this.dataURLToBlob(file);
      }

      // Validate file
      this.validateFile(uploadFile);

      // Prepare form data
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('upload_preset', this.config.uploadPreset);
      formData.append('folder', options.folder || this.config.folder);
      
      // Add optimization parameters
      formData.append('quality', options.quality || this.config.quality);
      formData.append('fetch_format', options.fetchFormat || this.config.fetchFormat);
      
      // Add transformation if provided
      if (options.transformation) {
        formData.append('transformation', JSON.stringify(options.transformation));
      }

      // Upload with retry logic
      const maxRetries = 3;
      let lastError;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${this.config.cloudName}/image/upload`,
            {
              method: 'POST',
              body: formData,
              signal: controller.signal
            }
          );

          clearTimeout(timeoutId);

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `HTTP ${response.status}: Upload failed`);
          }

          const data = await response.json();
          
          // Return optimized URL with transformations
          return this.getOptimizedUrl(data.secure_url, options);

        } catch (error) {
          lastError = error;
          console.warn(`Upload attempt ${attempt} failed:`, error);
          
          // Don't retry on client errors (4xx)
          if (error.name === 'AbortError' || (error.status && error.status >= 400 && error.status < 500)) {
            break;
          }
          
          // Wait before retry (exponential backoff)
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          }
        }
      }

      // All retries failed, use fallback
      console.error('All upload attempts failed:', lastError);
      
      // Return original file as data URL fallback
      if (typeof file === 'string') return file;
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(lastError);
        reader.readAsDataURL(file);
      });

    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },

  // Get optimized URL with transformations
  getOptimizedUrl: function(url, options = {}) {
    if (!url || !url.includes('cloudinary.com')) {
      return url;
    }

    // Add default optimizations
    const transformations = [];
    
    // Quality optimization
    if (options.quality !== false) {
      transformations.push(`q_${options.quality || this.config.quality}`);
    }
    
    // Format optimization
    if (options.fetchFormat !== false) {
      transformations.push(`f_${options.fetchFormat || this.config.fetchFormat}`);
    }
    
    // Size optimization
    if (options.width || options.height) {
      const resize = [];
      if (options.width) resize.push(`w_${options.width}`);
      if (options.height) resize.push(`h_${options.height}`);
      if (options.crop) resize.push(`c_${options.crop}`);
      transformations.push(resize.join(','));
    }

    // Add custom transformations
    if (options.transform) {
      transformations.push(options.transform);
    }

    if (transformations.length > 0) {
      const transformString = transformations.join(',');
      return url.replace('/upload/', `/upload/${transformString}/`);
    }

    return url;
  },

  // Upload multiple images with progress tracking
  uploadMultiple: async function(files, options = {}) {
    const results = [];
    const errors = [];
    
    for (let i = 0; i < files.length; i++) {
      try {
        const result = await this.uploadImage(files[i], {
          ...options,
          onProgress: (progress) => {
            if (options.onProgress) {
              options.onProgress({
                fileIndex: i,
                fileProgress: progress,
                totalProgress: ((i + progress / 100) / files.length) * 100
              });
            }
          }
        });
        results.push(result);
      } catch (error) {
        errors.push({ index: i, error });
        results.push(null);
      }
    }

    return { results, errors };
  },

  // Delete image from Cloudinary (requires signed delete)
  deleteImage: async function(publicId) {
    if (!this.isConfigured()) {
      console.warn('Cloudinary not configured');
      return false;
    }

    try {
      // This requires server-side implementation for security
      // Public clients cannot delete images directly
      console.warn('Image deletion requires server-side implementation');
      return false;
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  }
};

export default cloudinaryApi;