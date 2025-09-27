import React, { useState } from "react";

const TipsAndTutorials = () => {
  const [activeTab, setActiveTab] = useState("tips");

  const tips = [
    {
      title: "Optimize Your Hero Section",
      description:
        "Make a strong first impression with compelling headlines and professional imagery.",
      category: "Design",
      readTime: "3 min read",
      difficulty: "Beginner",
      image: "/api/placeholder/300/200",
    },
    {
      title: "SEO Best Practices",
      description:
        "Improve your portfolio visibility with proper meta tags and keyword optimization.",
      category: "SEO",
      readTime: "5 min read",
      difficulty: "Intermediate",
      image: "/api/placeholder/300/200",
    },
    {
      title: "Mobile-First Design",
      description:
        "Ensure your portfolio looks perfect on all devices with responsive design principles.",
      category: "Responsive",
      readTime: "4 min read",
      difficulty: "Beginner",
      image: "/api/placeholder/300/200",
    },
    {
      title: "Color Psychology",
      description:
        "Use colors strategically to evoke emotions and guide user behavior.",
      category: "Design",
      readTime: "6 min read",
      difficulty: "Advanced",
      image: "/api/placeholder/300/200",
    },
  ];

  const tutorials = [
    {
      title: "Creating Your First Portfolio",
      description:
        "A step-by-step guide to building a professional portfolio from scratch.",
      duration: "12 min",
      type: "Video",
      views: "2.4k",
      thumbnail: "/api/placeholder/300/200",
    },
    {
      title: "Advanced Template Customization",
      description:
        "Learn how to customize templates to match your unique brand identity.",
      duration: "18 min",
      type: "Video",
      views: "1.8k",
      thumbnail: "/api/placeholder/300/200",
    },
    {
      title: "Publishing and Sharing",
      description:
        "Master the art of publishing your portfolio and sharing it effectively.",
      duration: "8 min",
      type: "Article",
      views: "3.1k",
      thumbnail: "/api/placeholder/300/200",
    },
    {
      title: "Analytics Deep Dive",
      description:
        "Understand your portfolio analytics and optimize for better performance.",
      duration: "15 min",
      type: "Interactive",
      views: "956",
      thumbnail: "/api/placeholder/300/200",
    },
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Video":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-6V7a3 3 0 00-3-3H6a3 3 0 00-3 3v4M2 21h20"
            />
          </svg>
        );
      case "Article":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
      case "Interactive":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Learn & Improve
        </h3>
        <p className="text-gray-600">
          Tips, tutorials, and best practices to enhance your portfolios
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("tips")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "tips"
              ? "bg-white text-black shadow-sm"
              : "text-gray-600 hover:text-black"
          }`}
        >
          Tips & Best Practices
        </button>
        <button
          onClick={() => setActiveTab("tutorials")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "tutorials"
              ? "bg-white text-black shadow-sm"
              : "text-gray-600 hover:text-black"
          }`}
        >
          Video Tutorials
        </button>
      </div>

      {/* Tips Tab */}
      {activeTab === "tips" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tips.map((tip, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    {tip.category}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${getDifficultyColor(
                      tip.difficulty
                    )}`}
                  >
                    {tip.difficulty}
                  </span>
                </div>

                <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-black transition-colors">
                  {tip.title}
                </h4>

                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {tip.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{tip.readTime}</span>
                  <span className="flex items-center group-hover:text-blue-600 transition-colors">
                    Read more
                    <svg
                      className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tutorials Tab */}
      {activeTab === "tutorials" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tutorials.map((tutorial, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="aspect-[16/9] bg-gradient-to-br from-blue-100 to-purple-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      {getTypeIcon(tutorial.type)}
                    </div>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#fb8500]/70 text-white text-xs px-2 py-1 rounded">
                      {tutorial.type}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="bg-[#fb8500]/70 text-white text-xs px-2 py-1 rounded">
                      {tutorial.duration}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-black transition-colors">
                    {tutorial.title}
                  </h4>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {tutorial.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{tutorial.views} views</span>
                    <span className="flex items-center group-hover:text-blue-600 transition-colors">
                      Watch now
                      <svg
                        className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View All Button */}
      <div className="mt-8 text-center">
        <button className="bg-[#fb8500] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#fb8500]/90 transition-colors">
          Browse All Resources
        </button>
      </div>
    </div>
  );
};

export default TipsAndTutorials;
