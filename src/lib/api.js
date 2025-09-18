// Re-export new API modules for backward compatibility
export { default as api } from './baseApi';
export { authApi } from './authApi';
export { portfolioApi } from './portfolioApi';
export { cloudinaryApi } from './cloudinaryApi';

// For backward compatibility - use cloudinaryApi.uploadImage instead
export const uploadImageToCloudinary = async (file, options) => {
  const { cloudinaryApi } = await import('./cloudinaryApi');
  return cloudinaryApi.uploadImage(file, options);
};