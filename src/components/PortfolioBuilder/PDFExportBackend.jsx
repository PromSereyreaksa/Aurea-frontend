import React, { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../lib/baseApi';

/**
 * PDF Export Component using Backend API
 *
 * This component uses the backend PDF generation service with Puppeteer
 * to create PDFs that look identical to the actual portfolio template
 */
const PDFExportBackend = ({ portfolioData, isVisible, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportType, setExportType] = useState('portfolio'); // 'portfolio' or 'complete'
  const [pdfFormat, setPdfFormat] = useState('A4');
  const [orientation, setOrientation] = useState('portrait');

  if (!isVisible || !portfolioData) return null;

  // Get portfolio ID from the data
  const portfolioId = portfolioData._id || portfolioData.id;

  if (!portfolioId) {
    console.error('No portfolio ID found in data:', portfolioData);
    return null;
  }

  const handleExport = async () => {
    if (isGenerating) return;

    setIsGenerating(true);

    try {
      // Determine the endpoint based on export type
      const endpoint = exportType === 'complete'
        ? `/api/pdf/portfolio/${portfolioId}/complete`
        : `/api/pdf/portfolio/${portfolioId}/download`;

      // Build query parameters
      const params = new URLSearchParams({
        format: pdfFormat,
        landscape: orientation === 'landscape' ? 'true' : 'false'
      });

      // If exporting specific page type
      if (exportType === 'portfolio') {
        params.append('pageType', 'portfolio');
      }

      const url = `${endpoint}?${params.toString()}`;

      console.log('Generating PDF from:', url);

      // Make API request
      const response = await api.get(url, {
        responseType: 'blob', // Important for binary data
        timeout: 60000 // 60 seconds timeout for PDF generation
      });

      // Create blob from response
      const blob = new Blob([response.data], { type: 'application/pdf' });

      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;

      // Generate filename
      const portfolioTitle = portfolioData.title || portfolioData.content?.hero?.name || 'portfolio';
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = exportType === 'complete'
        ? `${portfolioTitle}_complete_${timestamp}.pdf`
        : `${portfolioTitle}_${timestamp}.pdf`;

      link.download = filename.replace(/[^a-z0-9._-]/gi, '_'); // Sanitize filename

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(downloadUrl);
      }, 1000);

      toast.success(`PDF downloaded successfully!`);

      // Close modal after successful export
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error) {
      console.error('PDF export error:', error);

      // Handle specific error cases
      if (error.response?.status === 404) {
        toast.error('Portfolio not found');
      } else if (error.response?.status === 403) {
        toast.error('Access denied. Portfolio might not be published.');
      } else if (error.code === 'ECONNABORTED') {
        toast.error('PDF generation timed out. Please try again.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to generate PDF. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Export Portfolio as PDF</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isGenerating}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Export Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Type
            </label>
            <div className="space-y-2">
              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  value="portfolio"
                  checked={exportType === 'portfolio'}
                  onChange={(e) => setExportType(e.target.value)}
                  className="mr-3"
                  disabled={isGenerating}
                />
                <div>
                  <span className="font-medium">Portfolio Only</span>
                  <p className="text-sm text-gray-500">Export main portfolio page</p>
                </div>
              </label>
              <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  value="complete"
                  checked={exportType === 'complete'}
                  onChange={(e) => setExportType(e.target.value)}
                  className="mr-3"
                  disabled={isGenerating}
                />
                <div>
                  <span className="font-medium">Complete Portfolio</span>
                  <p className="text-sm text-gray-500">Include all case studies</p>
                </div>
              </label>
            </div>
          </div>

          {/* Page Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Page Format
            </label>
            <select
              value={pdfFormat}
              onChange={(e) => setPdfFormat(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isGenerating}
            >
              <option value="A4">A4</option>
              <option value="A3">A3</option>
              <option value="Letter">Letter</option>
              <option value="Legal">Legal</option>
            </select>
          </div>

          {/* Orientation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Orientation
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="portrait"
                  checked={orientation === 'portrait'}
                  onChange={(e) => setOrientation(e.target.value)}
                  className="mr-2"
                  disabled={isGenerating}
                />
                Portrait
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="landscape"
                  checked={orientation === 'landscape'}
                  onChange={(e) => setOrientation(e.target.value)}
                  className="mr-2"
                  disabled={isGenerating}
                />
                Landscape
              </label>
            </div>
          </div>

          {/* Info Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>High Quality Export:</strong> This generates a pixel-perfect PDF
              that looks exactly like your portfolio template using server-side rendering.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={isGenerating}
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isGenerating}
            >
              {isGenerating && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isGenerating ? 'Generating PDF...' : 'Download PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFExportBackend;