import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { templateAdapter } from '../../lib/templateAdapter';

const TemplateSelector = ({ onSelectTemplate, selectedTemplateId }) => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const navigate = useNavigate();

  // Fetch templates from backend on mount
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const fetchedTemplates = await templateAdapter.getAllTemplates();
      console.log('Fetched templates:', fetchedTemplates);
      setTemplates(fetchedTemplates);
      setFilteredTemplates(fetchedTemplates);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      // Fallback to static templates if backend fails
      const { getAllTemplates } = await import('../../templates/index.js');
      const fallbackTemplates = getAllTemplates();
      setTemplates(fallbackTemplates);
      setFilteredTemplates(fallbackTemplates);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort templates
  useEffect(() => {
    let result = [...templates];

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(t => t.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query) ||
        t.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort templates
    switch (sortBy) {
      case 'popular':
        result.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredTemplates(result);
  }, [templates, selectedCategory, searchQuery, sortBy]);

  // Get unique categories
  const categories = ['all', ...new Set(templates.map(t => t.category).filter(Boolean))];

  const handleTemplateSelect = (template) => {
    onSelectTemplate(template);
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#fb8500] mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading templates...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      {/* Bold Header with Geometric Elements */}
      <div className="mb-16 relative">
        {/* Decorative gradient blobs */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-gradient-to-br from-[#fb8500]/10 via-purple-500/10 to-transparent blur-3xl rounded-full"></div>
        <div className="absolute -left-20 top-40 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-transparent blur-3xl rounded-full"></div>
        
        {/* Geometric decorations */}
        <div className="absolute -left-4 top-0 w-24 h-24 border-4 border-[#fb8500]/20"></div>
        <div className="absolute -right-8 top-32 w-16 h-16 bg-[#fb8500]/10"></div>
        
        <div className="relative inline-block px-4 py-2 bg-[#fb8500] text-white text-sm font-mono mb-6 uppercase tracking-wider">
          <div className="absolute -right-2 -bottom-2 w-full h-full bg-[#fb8500]/30 -z-10"></div>
          {selectedTemplateId ? 'Switch Template' : 'Choose Template'}
        </div>
        <h1 className="relative text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#1a1a1a] mb-6 max-w-4xl">
          {selectedTemplateId 
            ? 'Switch to a Different Template'
            : <>
                Choose Your <span className="bg-gradient-to-r from-[#fb8500] to-[#ff9500] bg-clip-text text-transparent">Perfect</span> Template
              </>
          }
        </h1>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-24 h-1 bg-[#fb8500]"></div>
          <div className="w-16 h-1 bg-[#fb8500] opacity-50"></div>
          <div className="w-8 h-1 bg-[#fb8500] opacity-25"></div>
        </div>
        <p className="text-xl text-neutral-600 max-w-3xl leading-relaxed relative">
          {selectedTemplateId 
            ? '⚠️ Warning: Switching templates will reset your current customizations. Your content will be preserved but layout changes will be lost.'
            : 'Start with a professionally designed template. Fully customizable—change colors, fonts, layouts, and content to match your unique style.'
          }
        </p>
        {!selectedTemplateId && (
          <div className="mt-6 relative inline-flex items-center gap-2 bg-[#fb8500]/10 border-2 border-[#fb8500] text-[#fb8500] px-6 py-3 font-semibold group hover:bg-[#fb8500] hover:text-white transition-all">
            <svg className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="relative z-10">Selecting a template will create your portfolio</span>
          </div>
        )}
      </div>

      {/* Filters and Search */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates by name, description, or tags..."
              className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-lg focus:border-[#fb8500] focus:outline-none transition-colors"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#fb8500] focus:outline-none transition-colors bg-white cursor-pointer capitalize"
          >
            {categories.map(cat => (
              <option key={cat} value={cat} className="capitalize">
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#fb8500] focus:outline-none transition-colors bg-white cursor-pointer"
          >
            <option value="popular">Most Popular</option>
            <option value="newest">Newest First</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-6 text-sm text-gray-600">
        Showing {filteredTemplates.length} of {templates.length} templates
        {searchQuery && ` matching "${searchQuery}"`}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <motion.div
            key={template.id}
            className={`group relative bg-white border-2 overflow-hidden transition-all duration-300 hover:shadow-2xl ${
              selectedTemplateId === template.id 
                ? 'border-[#fb8500]' 
                : 'border-neutral-200 hover:border-[#fb8500]'
            }`}
            whileHover={{ y: -4 }}
          >
            {/* Selected Badge */}
            {selectedTemplateId === template.id && (
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-[#fb8500] text-white px-3 py-1.5 text-xs font-bold flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>SELECTED</span>
                </div>
              </div>
            )}
            {/* Template Preview with Dynamic Gradients */}
            <div className="aspect-[4/5] bg-gradient-to-br from-[#fb8500]/10 via-purple-500/10 to-blue-500/10 relative overflow-hidden group-hover:from-[#fb8500]/20 group-hover:via-purple-500/20 group-hover:to-blue-500/20 transition-all">
              {/* Geometric decorations */}
              <div className="absolute top-4 left-4 w-16 h-16 border-2 border-[#fb8500]/30"></div>
              <div className="absolute bottom-4 right-4 w-12 h-12 bg-[#fb8500]/20"></div>
              
              {/* Mock preview of the template */}
              <div className="absolute inset-0 p-4">
                {/* Hero section preview with gradient */}
                <div className="bg-gradient-to-br from-white to-gray-50 mb-3 p-3 shadow-lg border border-neutral-200 group-hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#fb8500] to-[#ff9500] rounded-full mx-auto mb-2"></div>
                  <div className="h-2 bg-gradient-to-r from-[#fb8500] to-[#ff9500] rounded w-3/4 mx-auto mb-1"></div>
                  <div className="h-1.5 bg-neutral-300 rounded w-1/2 mx-auto"></div>
                </div>
                
                {/* Content sections preview with colors */}
                <div className="space-y-2">
                  <div className="bg-white p-2 shadow-md border border-neutral-200">
                    <div className="h-1.5 bg-[#fb8500] rounded w-1/4 mb-1"></div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="h-8 bg-gradient-to-br from-[#fb8500]/20 to-purple-500/20 rounded"></div>
                      <div className="space-y-1">
                        <div className="h-1 bg-neutral-300 rounded"></div>
                        <div className="h-1 bg-neutral-300 rounded w-3/4"></div>
                        <div className="h-1 bg-neutral-300 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-2 shadow-md border border-neutral-200">
                    <div className="h-1.5 bg-purple-500 rounded w-1/3 mb-1"></div>
                    <div className="grid grid-cols-3 gap-1">
                      <div className="h-6 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded"></div>
                      <div className="h-6 bg-gradient-to-br from-blue-500/20 to-[#fb8500]/20 rounded"></div>
                      <div className="h-6 bg-gradient-to-br from-[#fb8500]/20 to-purple-500/20 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected indicator */}
              {selectedTemplateId === template.id && (
                <div className="absolute top-3 right-3 bg-blue-500 text-white p-2 rounded-full">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {/* Template Info */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-xl text-[#1a1a1a] group-hover:text-[#fb8500] transition-colors">
                  {template.name}
                </h3>
                {template.isPremium && (
                  <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded">
                    PRO
                  </span>
                )}
              </div>

              <p className="text-neutral-600 text-sm mb-4 pb-4 border-b border-gray-200 leading-relaxed">
                {template.description}
              </p>

              {/* Template features/tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-neutral-100 text-neutral-700 text-xs font-semibold uppercase tracking-wider capitalize">
                  {template.category}
                </span>
                {template.tags && template.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="px-3 py-1 bg-[#fb8500]/10 text-[#fb8500] text-xs font-semibold capitalize">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons - Consistent with dashboard style */}
              <div className="flex flex-col gap-3">
                <motion.button
                  className={`w-full py-3 px-4 font-bold uppercase tracking-wider transition-all duration-300 border-2 ${
                    selectedTemplateId === template.id
                      ? 'bg-[#fb8500] text-white border-[#fb8500]'
                      : 'bg-white text-[#1a1a1a] border-[#1a1a1a] hover:bg-[#fb8500] hover:text-white hover:border-[#fb8500]'
                  }`}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTemplateSelect(template);
                  }}
                >
                  {selectedTemplateId === template.id ? 'SELECTED' : 'SELECT TEMPLATE'}
                </motion.button>
                
                {template.previewUrl && (
                  <motion.button
                    className="w-full py-2 px-4 text-sm font-bold uppercase tracking-wider transition-all duration-300 border-2 bg-white text-neutral-600 border-neutral-300 hover:border-[#1a1a1a] hover:text-[#1a1a1a]"
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(template.previewUrl, '_blank');
                    }}
                  >
                    PREVIEW
                  </motion.button>
                )}
              </div>

              {/* Bottom accent line */}
              <div className={`mt-4 h-1 bg-[#fb8500] transition-all duration-500 ${
                selectedTemplateId === template.id ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Coming Soon Section */}
      <div className="mt-20 border-t-2 border-neutral-200 pt-16">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-neutral-100 text-neutral-600 text-sm font-mono mb-4 uppercase tracking-wider">
            Coming Soon
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4">
            More Templates in Development
          </h3>
          <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
            We're crafting more beautiful templates for different industries and creative styles.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {['Corporate', 'Photography', 'Developer'].map((type) => (
            <div key={type} className="bg-white border-2 border-dashed border-neutral-300 p-8 text-center hover:border-[#fb8500] transition-colors group">
              <div className="w-20 h-20 bg-neutral-100 mx-auto mb-4 flex items-center justify-center group-hover:bg-[#fb8500]/10 transition-colors">
                <svg className="w-10 h-10 text-neutral-400 group-hover:text-[#fb8500] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h4 className="font-bold text-lg text-neutral-700 mb-2">{type}</h4>
              <p className="text-sm text-neutral-400 font-medium">COMING SOON</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;