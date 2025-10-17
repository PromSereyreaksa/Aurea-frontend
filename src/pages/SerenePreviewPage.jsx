import React from "react";
import { useNavigate } from "react-router-dom";
import SereneTemplate from "../templates/Serene/SereneTemplate";
import useAuthStore from "../stores/authStore";

const SerenePreviewPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const handleUseTemplate = () => {
    if (isAuthenticated) {
      // If logged in, go directly to portfolio builder with template pre-selected
      navigate("/portfolio-builder/new?template=serene");
    } else {
      // If not logged in, redirect to signup with return URL
      navigate("/signup?return=/portfolio-builder/new&template=serene");
    }
  };

  // Mock data for the Serene template preview
  const mockData = {
    hero: {
      title: "Botanical Art Tattoos",
      subtitle:
        "Melbourne-based tattoo artist creating delicate, nature-inspired designs with a soft watercolor technique.",
      description1:
        "Melbourne-based tattoo artist Rachel Garcia creates tattoos inspired by nature with a soft watercolor technique.",
      description2:
        "Her delicate, nostalgic flowers, plants and birds are inked with the precision of scientific illustrations (grandma would approve).",
    },
    about: {
      name: "RACHEL GARCIA",
      role: "Botanical Tattoo Artist",
      image: "/mockDataImage/bai.webp",
      bio: "Specializing in delicate, nature-inspired tattoos with a soft watercolor technique. Each piece is carefully crafted to capture the beauty and essence of botanical elements. My work blends traditional tattooing with contemporary artistic expression, creating unique, personal pieces that celebrate the natural world.",
      location: "Melbourne, Australia",
      experience: "Est. 2020",
    },
    gallery: {
      heading: "Portfolio",
      images: [
        {
          id: 1,
          src: "/mockDataImage/10.jpg",
          caption: "Wildflower Bouquet",
          price: "$160.00",
        },
        {
          id: 2,
          src: "/mockDataImage/11.jpg",
          caption: "Sunbirds & Blooms",
          price: "$170.00",
        },
        {
          id: 3,
          src: "/mockDataImage/12.jpg",
          caption: "Botanical Garden",
          price: "$180.00",
        },
        {
          id: 4,
          src: "/mockDataImage/13.jpg",
          caption: "Rose Collection",
          price: "$155.00",
        },
        {
          id: 5,
          src: "/mockDataImage/14.jpg",
          caption: "Yellow Lilies",
          price: "$165.00",
        },
        {
          id: 6,
          src: "/mockDataImage/2.jpg",
          caption: "Pink Roses",
          price: "$175.00",
        },
      ],
    },
    contact: {
      heading: "Get in Touch",
      text: "Available for commissions and consultations. I work with each client to create custom designs that reflect their personal story and connection to nature.",
      email: "hello@rachelgarcia.com",
      phone: "+61 (0) 400 123 456",
      instagram: "@rachelgarcia_tattoos",
    },
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#fafbfb",
      }}
    >
      {/* Preview Header */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          color: "#403f33",
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 1000,
          borderBottom: "1px solid rgba(212, 210, 205, 0.4)",
          boxShadow: "0 2px 12px rgba(64, 63, 51, 0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              fontFamily: "'Crimson Text', serif",
              fontSize: "22px",
              fontWeight: 600,
              letterSpacing: "0.35em",
              color: "#403f33",
            }}
          >
            Blo
            <sup
              style={{ fontSize: "13px", position: "relative", top: "-4px" }}
            >
              S
            </sup>
            som
          </div>
          <div
            style={{
              fontFamily: "'Crimson Text', serif",
              fontSize: "12px",
              color: "#6c6258",
              fontStyle: "italic",
            }}
          >
            Template Preview
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "15px",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => window.history.back()}
            style={{
              fontFamily: "'Crimson Text', serif",
              fontSize: "13px",
              color: "#403f33",
              backgroundColor: "transparent",
              border: "1px solid #d4d2cd",
              padding: "10px 20px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              borderRadius: "2px",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#403f33";
              e.target.style.color = "#fafbfb";
              e.target.style.borderColor = "#403f33";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "#403f33";
              e.target.style.borderColor = "#d4d2cd";
            }}
          >
            ← Back
          </button>

          <button
            onClick={handleUseTemplate}
            style={{
              fontFamily: "'Crimson Text', serif",
              fontSize: "13px",
              fontWeight: 600,
              color: "#fafbfb",
              backgroundColor: "#403f33",
              border: "1px solid #403f33",
              padding: "10px 30px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              borderRadius: "2px",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#6c6258";
              e.target.style.borderColor = "#6c6258";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 4px 12px rgba(64, 63, 51, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#403f33";
              e.target.style.borderColor = "#403f33";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            Use This Template
          </button>
        </div>
      </div>

      {/* Template Content with margin for fixed header */}
      <div style={{ marginTop: "80px" }}>
        <SereneTemplate
          content={mockData}
          isEditing={false}
          onContentChange={() => {}}
        />
      </div>

      {/* Preview Footer */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          color: "#403f33",
          padding: "40px",
          textAlign: "center",
          borderTop: "1px solid rgba(212, 210, 205, 0.4)",
        }}
      >
        <div
          style={{
            fontFamily: "'Crimson Text', serif",
            fontSize: "16px",
            marginBottom: "15px",
            fontWeight: 600,
          }}
        >
          This is a preview of the SERENE template
        </div>
        <div
          style={{
            fontFamily: "'Crimson Text', serif",
            fontSize: "12px",
            color: "#6c6258",
            fontStyle: "italic",
          }}
        >
          Botanical & Elegant / Nature-Inspired Design
        </div>
      </div>
    </div>
  );
};

export default SerenePreviewPage;
