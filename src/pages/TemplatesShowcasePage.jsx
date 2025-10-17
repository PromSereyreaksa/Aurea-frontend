import React from "react";
import { useNavigate } from "react-router-dom";
import TemplateCard from "../components/TemplateCard";
import { templates } from "../templates";

const TemplatesShowcasePage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F8F8F8",
        padding: "60px 40px",
      }}
    >
      {/* Back Button */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto 30px",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: "13px",
            color: "#000000",
            backgroundColor: "transparent",
            border: "2px solid #000000",
            padding: "10px 20px",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            cursor: "pointer",
            transition: "all 0.3s ease",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#000000";
            e.currentTarget.style.color = "#FFFFFF";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#000000";
          }}
        >
          <span>←</span> BACK
        </button>
      </div>

      {/* Header */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          marginBottom: "60px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily:
              '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: "clamp(40px, 6vw, 72px)",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            margin: 0,
            marginBottom: "20px",
            color: "#000000",
          }}
        >
          PORTFOLIO TEMPLATES
        </h1>
        <p
          style={{
            fontFamily:
              '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: "18px",
            color: "#666666",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          Choose from our professionally designed templates. Each one is fully
          customizable to match your unique style.
        </p>
      </div>

      {/* Templates Grid */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "30px",
        }}
      >
        {Object.values(templates).map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>

      {/* Direct Preview Link Section */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "60px auto 0",
          padding: "40px",
          backgroundColor: "#000000",
          color: "#FFFFFF",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily:
              '"Neue Haas Grotesk", "Helvetica Neue", Helvetica, Arial, sans-serif',
            fontSize: "24px",
            fontWeight: 900,
            marginBottom: "20px",
            textTransform: "uppercase",
          }}
        >
          QUICK PREVIEW ACCESS
        </div>
        <div
          style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: "14px",
            color: "#999999",
            marginBottom: "30px",
          }}
        >
          Jump directly to the full template previews
        </div>
        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => navigate("/template-preview/echelon")}
            style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: "14px",
              fontWeight: 700,
              color: "#FFFFFF",
              backgroundColor: "#FF6B35",
              border: "3px solid #FF6B35",
              padding: "16px 40px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              cursor: "pointer",
              transition: "all 0.3s ease",
              borderRadius: "6px",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#E55A2B";
              e.target.style.borderColor = "#E55A2B";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 20px rgba(255, 107, 53, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#FF6B35";
              e.target.style.borderColor = "#FF6B35";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            → ECHELON PREVIEW
          </button>

          <button
            onClick={() => navigate("/template-preview/serene")}
            style={{
              fontFamily: '"Crimson Text", serif',
              fontSize: "14px",
              fontWeight: 600,
              color: "#FFFFFF",
              backgroundColor: "#6c6258",
              border: "3px solid #6c6258",
              padding: "16px 40px",
              letterSpacing: "0.05em",
              cursor: "pointer",
              transition: "all 0.3s ease",
              borderRadius: "6px",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#403f33";
              e.target.style.borderColor = "#403f33";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 20px rgba(108, 98, 88, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#6c6258";
              e.target.style.borderColor = "#6c6258";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            → SERENE PREVIEW
          </button>
        </div>
        <button
          onClick={() => navigate('/template-preview/echelon')}
          style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '14px',
            fontWeight: 700,
            color: '#FFFFFF',
            backgroundColor: '#FF6B35',
            border: '3px solid #FF6B35',
            padding: '16px 40px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            borderRadius: '6px'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#E55A2B';
            e.target.style.borderColor = '#E55A2B';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#FF6B35';
            e.target.style.borderColor = '#FF6B35';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          → VIEW ECHELON PREVIEW
        </button>
      </div>
    </div>
  );
};

export default TemplatesShowcasePage;
