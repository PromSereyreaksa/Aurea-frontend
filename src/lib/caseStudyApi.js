import api from './baseApi';

/**
 * Case Study API
 * Handles all case study-related API calls using the /api/case-studies endpoints
 */
export const caseStudyApi = {
  /**
   * Create a new case study
   * @param {Object} caseStudyData - Case study data including portfolioId, projectId, content
   * @returns {Promise} API response
   */
  create: async (caseStudyData) => {
    try {
      console.log('📝 Creating case study...');
      console.log('📦 Request payload:', JSON.stringify(caseStudyData, null, 2));
      
      const response = await api.post('/api/case-studies', caseStudyData);
      
      console.log('📥 Response status:', response.status);
      console.log('📥 Response data:', response.data);
      console.log('✅ Case study created successfully');
      
      return response.data;
    } catch (error) {
      console.error('❌ Error creating case study');
      console.error('❌ Status:', error.response?.status);
      console.error('❌ Status text:', error.response?.statusText);
      console.error('❌ Error data:', error.response?.data);
      console.error('❌ Full error:', error);
      throw error;
    }
  },

  /**
   * Get a case study by ID
   * @param {string} id - Case study ID
   * @returns {Promise} API response
   */
  getById: async (id) => {
    try {
      console.log('� Fetching case study by ID:', id);
      const response = await api.get(`/api/case-studies/${id}`);
      console.log('✅ Case study found:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching case study:', error.response?.data || error);
      throw error;
    }
  },

  /**
   * Get case study by portfolio and project ID
   * @param {string} portfolioId - Portfolio ID
   * @param {string} projectId - Project ID
   * @returns {Promise} API response
   */
  getByPortfolioAndProject: async (portfolioId, projectId) => {
    try {
      console.log('🔍 Fetching case study...');
      console.log('   Portfolio ID:', portfolioId);
      console.log('   Project ID:', projectId);
      
      const url = `/api/case-studies/portfolio/${portfolioId}/project/${projectId}`;
      console.log('   URL:', url);
      
      const response = await api.get(url);
      
      console.log('📥 Response status:', response.status);
      console.log('📥 Response data:', response.data);
      console.log('✅ Case study found');
      
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching case study');
      console.error('❌ Status:', error.response?.status);
      console.error('❌ Status text:', error.response?.statusText);
      console.error('❌ Error data:', error.response?.data);
      console.error('❌ URL was:', `/api/case-studies/portfolio/${portfolioId}/project/${projectId}`);
      
      // If 404, this might be expected (no case study exists yet)
      if (error.response?.status === 404) {
        console.log('ℹ️ No existing case study found - this is normal for new projects');
      }
      
      throw error;
    }
  },

  /**
   * Update a case study
   * @param {string} id - Case study ID
   * @param {Object} updates - Updated data (partial updates supported)
   * @returns {Promise} API response
   */
  update: async (id, updates) => {
    try {
      console.log('✏️ Updating case study:', { id, updates });
      const response = await api.put(`/api/case-studies/${id}`, updates);
      console.log('✅ Case study updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating case study:', error.response?.data || error);
      throw error;
    }
  },

  /**
   * Delete a case study
   * @param {string} id - Case study ID
   * @returns {Promise} API response
   */
  delete: async (id) => {
    try {
      console.log('🗑️ Deleting case study:', id);
      const response = await api.delete(`/api/case-studies/${id}`);
      console.log('✅ Case study deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting case study:', error.response?.data || error);
      throw error;
    }
  },

  /**
   * Get all case studies for a portfolio
   * @param {string} portfolioId - Portfolio ID
   * @returns {Promise} API response
   */
  getByPortfolio: async (portfolioId) => {
    try {
      console.log('📋 Fetching all case studies for portfolio:', portfolioId);
      const response = await api.get(`/api/case-studies/portfolio/${portfolioId}`);
      console.log('✅ Case studies found:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching portfolio case studies:', error.response?.data || error);
      throw error;
    }
  }
};

export default caseStudyApi;


