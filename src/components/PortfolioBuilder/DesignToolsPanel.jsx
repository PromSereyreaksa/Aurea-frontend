import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DesignToolsPanel = ({ template, portfolioData, onStyleChange, onContentChange }) => {
  const [activeTab, setActiveTab] = useState('colors');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const currentStyles = portfolioData?.styling || template.styling;

  // Color presets for quick selection
  const colorPresets = [
    {
      name: 'Ocean Blue',
      colors: {
        primary: '#1e40af',
        accent: '#3b82f6',
        background: '#ffffff',
        surface: '#f1f5f9'
      }
    },
    {
      name: 'Forest Green',
      colors: {
        primary: '#166534',
        accent: '#22c55e',
        background: '#ffffff',
        surface: '#f0fdf4'
      }
    },
    {
      name: 'Sunset Orange',
      colors: {
        primary: '#ea580c',
        accent: '#f97316',
        background: '#ffffff',
        surface: '#fff7ed'
      }
    },
    {
      name: 'Purple Dream',
      colors: {
        primary: '#7c3aed',
        accent: '#a855f7',
        background: '#ffffff',
        surface: '#faf5ff'
      }
    },
    {
      name: 'Monochrome',
      colors: {
        primary: '#1f2937',
        accent: '#4b5563',
        background: '#ffffff',
        surface: '#f9fafb'
      }
    }
  ];

  // Font options
  const fontOptions = [
    { name: 'Inter', family: 'Inter, sans-serif' },
    { name: 'Poppins', family: 'Poppins, sans-serif' },
    { name: 'Roboto', family: 'Roboto, sans-serif' },
    { name: 'Playfair Display', family: 'Playfair Display, serif' },
    { name: 'Lato', family: 'Lato, sans-serif' },
    { name: 'Montserrat', family: 'Montserrat, sans-serif' }
  ];

  const handleColorChange = (colorKey, value) => {
    onStyleChange('colors', {
      ...currentStyles.colors,
      [colorKey]: value
    });
  };

  const handleColorPresetSelect = (preset) => {
    onStyleChange('colors', {
      ...currentStyles.colors,
      ...preset.colors
    });
  };

  const handleFontChange = (fontType, fontFamily) => {
    onStyleChange('fonts', {
      ...currentStyles.fonts,
      [fontType]: fontFamily
    });
  };

  const tabs = [
    { id: 'colors', label: 'Colors', icon: '🎨' },
    { id: 'fonts', label: 'Typography', icon: '📝' },
    { id: 'spacing', label: 'Layout', icon: '📐' },
    { id: 'effects', label: 'Effects', icon: '✨' }
  ];

  return (
    <motion.div
      className={`fixed right-0 top-0 h-full bg-white shadow-2xl border-l border-gray-200 z-50 ${
        isCollapsed ? 'w-16' : 'w-80'
      }`}
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-gray-900">Design Tools</h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg
            className={`w-5 h-5 transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {!isCollapsed && (
        <>
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-3 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="text-lg mb-1">{tab.icon}</div>
                <div className="text-xs">{tab.label}</div>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <AnimatePresence mode="wait">
              {activeTab === 'colors' && (
                <motion.div
                  key="colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Color Presets */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Themes</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {colorPresets.map((preset, index) => (
                        <button
                          key={index}
                          onClick={() => handleColorPresetSelect(preset)}
                          className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                        >
                          <div className="flex space-x-1 mb-2">
                            {Object.values(preset.colors).map((color, colorIndex) => (
                              <div
                                key={colorIndex}
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <div className="text-xs text-gray-600">{preset.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Individual Color Controls */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Custom Colors</h3>
                    <div className="space-y-3">
                      {Object.entries(currentStyles.colors).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <label className="text-sm text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={value}
                              onChange={(e) => handleColorChange(key, e.target.value)}
                              className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => handleColorChange(key, e.target.value)}
                              className="w-20 px-2 py-1 text-xs border border-gray-300 rounded"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'fonts' && (
                <motion.div
                  key="fonts"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Font Selection */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Font Family</h3>
                    <div className="space-y-3">
                      {Object.entries(currentStyles.fonts).map(([fontType, currentFont]) => (
                        <div key={fontType}>
                          <label className="text-sm text-gray-700 capitalize block mb-2">
                            {fontType} Font
                          </label>
                          <select
                            value={currentFont}
                            onChange={(e) => handleFontChange(fontType, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {fontOptions.map((font, index) => (
                              <option key={index} value={font.name} style={{ fontFamily: font.family }}>
                                {font.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Font Preview */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Preview</h3>
                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                      <div
                        style={{ fontFamily: currentStyles.fonts.heading }}
                        className="text-2xl font-bold"
                      >
                        Heading Text
                      </div>
                      <div
                        style={{ fontFamily: currentStyles.fonts.body }}
                        className="text-base"
                      >
                        Body text lorem ipsum dolor sit amet consectetur adipiscing elit.
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'spacing' && (
                <motion.div
                  key="spacing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Section Spacing</h3>
                    <div className="space-y-3">
                      {Object.entries(currentStyles.spacing).map(([key, value]) => (
                        <div key={key}>
                          <label className="text-sm text-gray-700 capitalize block mb-2">
                            {key} Spacing
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            step="0.5"
                            value={parseFloat(value)}
                            onChange={(e) => onStyleChange('spacing', {
                              ...currentStyles.spacing,
                              [key]: `${e.target.value}rem`
                            })}
                            className="w-full"
                          />
                          <div className="text-xs text-gray-500 mt-1">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'effects' && (
                <motion.div
                  key="effects"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Border Radius</h3>
                    <div className="space-y-3">
                      {Object.entries(currentStyles.borderRadius).map(([key, value]) => (
                        <div key={key}>
                          <label className="text-sm text-gray-700 capitalize block mb-2">
                            {key} Radius
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="2"
                            step="0.125"
                            value={parseFloat(value)}
                            onChange={(e) => onStyleChange('borderRadius', {
                              ...currentStyles.borderRadius,
                              [key]: `${e.target.value}rem`
                            })}
                            className="w-full"
                          />
                          <div className="text-xs text-gray-500 mt-1">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default DesignToolsPanel;