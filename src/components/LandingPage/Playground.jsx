"use client";

import { useState } from "react";
import { Upload, Type, Palette, Eye, RotateCcw, Lightbulb } from "lucide-react";

export default function Playground() {
  const [previewData, setPreviewData] = useState({
    title: "Your Project Title",
    description: "Describe your amazing design work here...",
    bgColor: "#ffffff",
    textColor: "#1a1a1a",
    accentColor: "#fb8500",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setPreviewData({ ...previewData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setPreviewData({
      title: "Your Project Title",
      description: "Describe your amazing design work here...",
      bgColor: "#ffffff",
      textColor: "#1a1a1a",
      accentColor: "#fb8500",
      image: null,
    });
    setImagePreview(null);
  };

  return (
    <section className="min-h-screen flex items-center px-4 sm:px-6 md:px-12 lg:px-24 py-16 sm:py-20 md:py-24 bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="max-w-7xl w-full mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-14 md:mb-16">
          <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-[#fb8500] text-white text-xs sm:text-sm font-mono mb-4 sm:mb-6">
            INTERACTIVE PLAYGROUND
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 text-[#1a1a1a]">
            Try It Yourself
          </h2>
          <div className="w-16 sm:w-20 md:w-24 h-1 bg-[#fb8500] mx-auto mb-4 sm:mb-6"></div>
          <p className="text-base sm:text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto px-4">
            Get a feel for how easy it is to customize your portfolio. Make
            changes and see them instantly!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Controls Panel */}
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1a1a1a] flex items-center gap-2">
                <Palette className="w-5 h-5 sm:w-6 sm:h-6 text-[#fb8500]" />
                Customize
              </h3>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-[#fb8500] text-[#fb8500] rounded hover:bg-[#fb8500] hover:text-white transition-colors text-sm sm:text-base"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Reset
              </button>
            </div>

            {/* Title Input */}
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1a1a1a] mb-2">
                <Type className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#fb8500]" />
                Project Title
              </label>
              <input
                type="text"
                value={previewData.title}
                onChange={(e) =>
                  setPreviewData({ ...previewData, title: e.target.value })
                }
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-neutral-200 rounded focus:border-[#fb8500] focus:outline-none transition-colors text-sm sm:text-base"
                placeholder="Enter your project title"
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1a1a1a] mb-2">
                <Type className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#fb8500]" />
                Description
              </label>
              <textarea
                value={previewData.description}
                onChange={(e) =>
                  setPreviewData({
                    ...previewData,
                    description: e.target.value,
                  })
                }
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-neutral-200 rounded focus:border-[#fb8500] focus:outline-none transition-colors resize-none text-sm sm:text-base"
                rows="4"
                placeholder="Describe your project"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1a1a1a] mb-2">
                <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#fb8500]" />
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-neutral-200 rounded focus:border-[#fb8500] focus:outline-none transition-colors file:mr-3 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded file:border-0 file:bg-[#fb8500] file:text-white file:cursor-pointer hover:file:bg-[#fb8500]/90 file:text-xs sm:file:text-sm"
              />
            </div>

            {/* Color Pickers */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="text-xs font-bold text-[#1a1a1a] mb-2 block">
                  Background
                </label>
                <input
                  type="color"
                  value={previewData.bgColor}
                  onChange={(e) =>
                    setPreviewData({ ...previewData, bgColor: e.target.value })
                  }
                  className="w-full h-10 sm:h-12 rounded cursor-pointer border-2 border-neutral-200"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#1a1a1a] mb-2 block">
                  Text Color
                </label>
                <input
                  type="color"
                  value={previewData.textColor}
                  onChange={(e) =>
                    setPreviewData({
                      ...previewData,
                      textColor: e.target.value,
                    })
                  }
                  className="w-full h-10 sm:h-12 rounded cursor-pointer border-2 border-neutral-200"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#1a1a1a] mb-2 block">
                  Accent
                </label>
                <input
                  type="color"
                  value={previewData.accentColor}
                  onChange={(e) =>
                    setPreviewData({
                      ...previewData,
                      accentColor: e.target.value,
                    })
                  }
                  className="w-full h-10 sm:h-12 rounded cursor-pointer border-2 border-neutral-200"
                />
              </div>
            </div>

            {/* Info */}
            <div className="bg-neutral-50 p-3 sm:p-4 rounded border-l-4 border-[#fb8500]">
              <p className="text-xs sm:text-sm text-neutral-600 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-[#fb8500] flex-shrink-0 mt-0.5" />
                <span>
                  <span className="font-bold text-[#fb8500]">Tip:</span> This is
                  just a tiny preview. The actual builder has 50+ customization
                  options!
                </span>
              </p>
            </div>
          </div>

          {/* Live Preview Panel */}
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-[#fb8500]" />
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1a1a1a]">
                Live Preview
              </h3>
            </div>

            {/* Preview Card */}
            <div
              className="rounded-lg overflow-hidden shadow-lg transition-all duration-300"
              style={{ backgroundColor: previewData.bgColor }}
            >
              {/* Image Section */}
              {imagePreview ? (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-neutral-200 flex items-center justify-center">
                  <div className="text-center text-neutral-400">
                    <Upload className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm">
                      Upload an image to preview
                    </p>
                  </div>
                </div>
              )}

              {/* Content Section */}
              <div className="p-4 sm:p-5 md:p-6">
                <div
                  className="w-8 sm:w-10 md:w-12 h-1 mb-3 sm:mb-4 transition-colors duration-300"
                  style={{ backgroundColor: previewData.accentColor }}
                ></div>
                <h4
                  className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 transition-colors duration-300"
                  style={{ color: previewData.textColor }}
                >
                  {previewData.title}
                </h4>
                <p
                  className="text-sm sm:text-base leading-relaxed transition-colors duration-300 opacity-80"
                  style={{ color: previewData.textColor }}
                >
                  {previewData.description}
                </p>
                <button
                  className="mt-4 sm:mt-5 md:mt-6 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded font-bold text-white transition-all hover:scale-105 text-sm sm:text-base"
                  style={{ backgroundColor: previewData.accentColor }}
                >
                  View Project
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-xs sm:text-sm text-neutral-500">
                Changes appear instantly • No coding required
              </p>
            </div>
          </div>
        </div>

        {/* CTA Below Playground */}
        <div className="text-center mt-12 sm:mt-14 md:mt-16">
          <p className="text-base sm:text-lg md:text-xl text-neutral-600 mb-4 sm:mb-6 px-4">
            Like what you see? Start building your real portfolio now.
          </p>
          <a
            href="/signup"
            className="inline-block px-8 sm:px-10 md:px-12 py-4 sm:py-4.5 md:py-5 bg-[#fb8500] text-white font-bold text-base sm:text-lg hover:bg-[#fb8500]/90 transition-all hover:shadow-lg transform hover:scale-105 rounded"
          >
            Get Started Free
          </a>
        </div>
      </div>
    </section>
  );
}
