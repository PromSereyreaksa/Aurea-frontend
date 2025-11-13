/**
 * Utility to handle uploading pending local images to the server
 * Replaces blob URLs with actual server URLs
 */

export const uploadSingleImage = async (file) => {
  if (!file) return null;

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/upload/single`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('aurea_token') || ''}`
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
  } catch (error) {
    console.error('❌ Image upload failed:', error);
    throw error;
  }
};

/**
 * Upload all pending images in portfolio content recursively
 * Replaces local image objects with server URLs
 * @param {Object} data - Portfolio content data
 * @returns {Promise<Object>} Updated data with server URLs
 */
export const uploadPendingImages = async (data) => {
  if (!data) return data;

  const deepCopy = JSON.parse(JSON.stringify(data));
  const uploadPromises = [];
  const replacements = new Map();

  // Helper function to recursively find and upload pending images
  const processPendingImages = (obj) => {
    if (obj === null || obj === undefined) return;

    if (typeof obj === 'object') {
      if (Array.isArray(obj)) {
        obj.forEach(processPendingImages);
      } else {
        // Check if this object is a local file object
        if (obj.isLocalFile && obj.file && obj.blobUrl) {
          console.log('📤 Found pending image:', obj.file.name);
          const promise = uploadSingleImage(obj.file)
            .then(url => {
              replacements.set(obj.blobUrl, url);
              console.log('✅ Image uploaded:', obj.file.name, '→', url);
              return url;
            })
            .catch(error => {
              console.error('❌ Failed to upload image:', obj.file.name, error);
              throw error;
            });
          uploadPromises.push(promise);
        } else {
          // Recurse into object properties
          Object.keys(obj).forEach(key => {
            processPendingImages(obj[key]);
          });
        }
      }
    }
  };

  // Find all pending images
  processPendingImages(deepCopy);

  if (uploadPromises.length === 0) {
    console.log('✅ No pending images to upload');
    return data;
  }

  console.log(`📤 Uploading ${uploadPromises.length} pending image(s)...`);

  try {
    // Wait for all uploads
    await Promise.all(uploadPromises);

    // Replace all local file objects with server URLs
    const replaceLocalImages = (obj) => {
      if (obj === null || obj === undefined) return obj;

      if (typeof obj === 'object') {
        if (Array.isArray(obj)) {
          return obj.map(item => replaceLocalImages(item));
        } else {
          // Check if this is a local file object
          if (obj.isLocalFile && obj.blobUrl && replacements.has(obj.blobUrl)) {
            return replacements.get(obj.blobUrl);
          }

          // Otherwise, recurse into properties
          const newObj = {};
          Object.keys(obj).forEach(key => {
            newObj[key] = replaceLocalImages(obj[key]);
          });
          return newObj;
        }
      }

      return obj;
    };

    const updatedData = replaceLocalImages(deepCopy);
    console.log('✅ All images uploaded successfully');
    return updatedData;

  } catch (error) {
    console.error('❌ Failed to upload pending images:', error);
    throw new Error(`Failed to upload images: ${error.message}`);
  }
};
