import React, { useState, useEffect } from "react";
import SereneHero from "./sections/SereneHero";
import SereneAbout from "./sections/SereneAbout";
import SereneServices from "./sections/SereneServices";
import SereneGallery from "./sections/SereneGallery";
import SereneTestimonials from "./sections/SereneTestimonials";
import SereneContact from "./sections/SereneContact";

const SereneTemplate = ({
  content = {},
  isEditing = false,
  onContentChange,
  className = "",
  portfolioId = null,
}) => {
  // Navigation scroll effect
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Update active section based on scroll position
      const sections = [
        "home",
        "about",
        "services",
        "gallery",
        "testimonials",
        "contact",
      ];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle content changes
  const handleSectionContentChange = (section, field, value) => {
    if (onContentChange) {
      // Pass section, field, value directly (not the entire content object)
      onContentChange(section, field, value);
    }
  };

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className={`${className} template-wrapper serene-template`}
      style={{
        fontFamily: "'Playfair Display', 'Crimson Text', serif",
        color: "#4a5444",
        backgroundColor: "#fefef8",
        lineHeight: 1.7,
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
        width: "100%",
      }}
    >
      {/* Decorative Botanical Pattern Background */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%234a5444' stroke-width='0.5'%3E%3Cpath d='M40 40c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20z'/%3E%3Cpath d='M0 40c0-11 9-20 20-20s20 9 20 20-9 20-20 20S0 51 0 40z'/%3E%3Cpath d='M40 0c0 11-9 20-20 20S0 11 0 0'/%3E%3Cpath d='M80 0c0 11-9 20-20 20s-20-9-20-20'/%3E%3Cpath d='M40 80c0-11 9-20 20-20s20 9 20 20'/%3E%3Cpath d='M0 80c0-11 9-20 20-20s20 9 20 20'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Elegant Header Navigation */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: isScrolled
            ? "rgba(254, 254, 248, 0.98)"
            : "rgba(254, 254, 248, 0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: isScrolled ? "1px solid rgba(74, 84, 68, 0.1)" : "none",
          transition: "all 0.4s ease",
          boxShadow: isScrolled ? "0 2px 20px rgba(74, 84, 68, 0.08)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: isScrolled ? "16px 32px" : "24px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transition: "all 0.4s ease",
          }}
        >
          {/* Logo/Brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => scrollToSection("home")}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #c9a961 0%, #a08754 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "12px",
                boxShadow: "0 2px 8px rgba(201, 169, 97, 0.2)",
              }}
            >
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#fefef8",
                  fontStyle: "italic",
                }}
              >
                B
              </span>
            </div>
            <div>
              <h1
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "24px",
                  fontWeight: 400,
                  letterSpacing: "0.08em",
                  color: "#4a5444",
                  margin: 0,
                  fontStyle: "italic",
                }}
              >
                Blossom
              </h1>
              <p
                style={{
                  fontFamily: "'Crimson Text', serif",
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  color: "#7a8574",
                  margin: 0,
                  textTransform: "uppercase",
                }}
              >
                Botanical Artistry
              </p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav
            style={{
              display: "flex",
              gap: "40px",
              alignItems: "center",
            }}
          >
            {[
              { id: "home", label: "Home" },
              { id: "about", label: "About" },
              { id: "services", label: "Services" },
              { id: "gallery", label: "Gallery" },
              { id: "testimonials", label: "Reviews" },
              { id: "contact", label: "Contact" },
            ].map((item) => (
              <a
                key={item.id}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.id);
                }}
                style={{
                  fontFamily: "'Crimson Text', serif",
                  fontSize: "15px",
                  color: activeSection === item.id ? "#c9a961" : "#4a5444",
                  textDecoration: "none",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  fontWeight: 400,
                  letterSpacing: "0.05em",
                  position: "relative",
                  padding: "2px 0",
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== item.id) {
                    e.target.style.color = "#a08754";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== item.id) {
                    e.target.style.color = "#4a5444";
                  }
                }}
              >
                {item.label}
                {activeSection === item.id && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: "-4px",
                      left: 0,
                      right: 0,
                      height: "1px",
                      backgroundColor: "#c9a961",
                      animation: "slideIn 0.3s ease",
                    }}
                  />
                )}
              </a>
            ))}

            {/* CTA Button */}
            <button
              onClick={() => scrollToSection("contact")}
              style={{
                fontFamily: "'Crimson Text', serif",
                fontSize: "14px",
                color: "#fefef8",
                backgroundColor: "#c9a961",
                border: "none",
                padding: "10px 24px",
                borderRadius: "25px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                letterSpacing: "0.08em",
                fontWeight: 500,
                boxShadow: "0 2px 10px rgba(201, 169, 97, 0.2)",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#a08754";
                e.target.style.transform = "translateY(-1px)";
                e.target.style.boxShadow = "0 4px 15px rgba(201, 169, 97, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#c9a961";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 2px 10px rgba(201, 169, 97, 0.2)";
              }}
            >
              Book Now
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Hero Section */}
        <div id="home">
          <SereneHero
            content={content.hero || {}}
            isEditing={isEditing}
            onContentChange={handleSectionContentChange}
          />
        </div>

        {/* About Section */}
        <div id="about">
          <SereneAbout
            content={content.about || {}}
            isEditing={isEditing}
            onContentChange={handleSectionContentChange}
          />
        </div>

        {/* Services Section */}
        <div id="services">
          <SereneServices
            content={content.services || {}}
            isEditing={isEditing}
            onContentChange={handleSectionContentChange}
          />
        </div>

        {/* Gallery Section */}
        <div id="gallery">
          <SereneGallery
            content={content.gallery || {}}
            isEditing={isEditing}
            onContentChange={handleSectionContentChange}
          />
        </div>

        {/* Testimonials Section */}
        <div id="testimonials">
          <SereneTestimonials
            content={content.testimonials || {}}
            isEditing={isEditing}
            onContentChange={handleSectionContentChange}
          />
        </div>

        {/* Contact Section */}
        <div id="contact">
          <SereneContact
            content={content.contact || {}}
            isEditing={isEditing}
            onContentChange={handleSectionContentChange}
          />
        </div>
      </div>

      {/* Scroll to Top Button */}
      {isScrolled && (
        <button
          onClick={() => scrollToSection("home")}
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            backgroundColor: "#c9a961",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 15px rgba(201, 169, 97, 0.3)",
            zIndex: 999,
            transition: "all 0.3s ease",
            opacity: 0.9,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.opacity = "1";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.opacity = "0.9";
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            style={{ transform: "rotate(-90deg)" }}
          >
            <path
              d="M7 14L12 10L7 6"
              stroke="#fefef8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      {/* Elegant Typography & Styles */}
      <style jsx>{`
        /* Font Imports */
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&display=swap");

        /* Global Serene Styles */
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Custom Scrollbar */
        .serene-template::-webkit-scrollbar {
          width: 10px;
        }

        .serene-template::-webkit-scrollbar-track {
          background: #f5f5ed;
        }

        .serene-template::-webkit-scrollbar-thumb {
          background: #c9a961;
          border-radius: 5px;
        }

        .serene-template::-webkit-scrollbar-thumb:hover {
          background: #a08754;
        }

        /* Typography Scale */
        .serene-display {
          font-size: clamp(56px, 8vw, 96px);
          font-weight: 300;
          line-height: 1.1;
          letter-spacing: -0.02em;
          font-family: "Playfair Display", serif;
        }

        .serene-h1 {
          font-size: clamp(40px, 6vw, 64px);
          font-weight: 400;
          line-height: 1.2;
          letter-spacing: -0.01em;
          font-family: "Playfair Display", serif;
        }

        .serene-h2 {
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 400;
          line-height: 1.3;
          font-family: "Playfair Display", serif;
        }

        .serene-h3 {
          font-size: clamp(24px, 3vw, 32px);
          font-weight: 400;
          line-height: 1.4;
          font-family: "Playfair Display", serif;
        }

        .serene-body-large {
          font-size: clamp(18px, 2vw, 22px);
          font-weight: 400;
          line-height: 1.7;
          font-family: "Crimson Text", serif;
        }

        .serene-body {
          font-size: clamp(16px, 1.5vw, 18px);
          font-weight: 400;
          line-height: 1.7;
          font-family: "Crimson Text", serif;
        }

        .serene-small {
          font-size: clamp(12px, 1.2vw, 14px);
          font-weight: 400;
          line-height: 1.6;
          font-family: "Crimson Text", serif;
          letter-spacing: 0.05em;
        }

        /* Responsive Layout */
        .serene-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 32px;
        }

        @media (max-width: 1024px) {
          .serene-container {
            padding: 0 24px;
          }
        }

        @media (max-width: 768px) {
          .serene-container {
            padding: 0 20px;
          }
        }

        /* Elegant Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        @keyframes floatAnimation {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .serene-fade-in {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        /* Botanical Hover Effects */
        .serene-hover-bloom {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .serene-hover-bloom:hover {
          transform: scale(1.05);
        }

        /* Selection Color */
        ::selection {
          background-color: rgba(201, 169, 97, 0.2);
          color: #4a5444;
        }

        /* High Contrast Mode */
        @media (prefers-contrast: high) {
          .serene-text-secondary {
            color: #2a3224 !important;
          }
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }

          html {
            scroll-behavior: auto;
          }
        }

        /* Print Styles */
        @media print {
          header {
            position: relative !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SereneTemplate;
