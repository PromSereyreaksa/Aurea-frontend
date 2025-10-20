import { useState, useEffect } from "react";
import Navigation from "./Navigation";

// HomePage Component
export default function HomePage({ onNavigate }) {
  const [visibleSections, setVisibleSections] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => setVisibleSections([0]), 100);
    return () => clearTimeout(timer);
  }, []);

  const styles = {
    container: {
      position: "relative",
      minHeight: "100vh",
      minWidth: "1024px",
      background: "none",
      padding: "60px 40px",
      fontFamily:
        'Graphik, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Fira Sans", Roboto, "Avenir Next", "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: "500",
      fontStyle: "normal",
    },
    mainContent: {
      maxWidth: "1400px",
      margin: "0 auto",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      flexWrap: "wrap",
      gap: "40px",
    },
    leftSection: {
      flex: "1 1 600px",
      minWidth: "300px",
      textAlign: "left",
    },
    rightSection: {
      flex: "0 0 auto",
      textAlign: "left",
    },
    magentaText: {
      color: "#ff0080",
      fontSize: "52px",
      fontWeight: "500",
      lineHeight: "1.2",
      margin: "0 0 20px 0",
      letterSpacing: "-0.02em",
    },
    blackText: {
      color: "#000000",
      fontSize: "52px",
      fontWeight: "500",
      lineHeight: "1.2",
      margin: "0 0 20px 0",
      letterSpacing: "-0.02em",
    },
    fadeIn: {
      opacity: 0,
      animation: "fadeIn 0.8s ease-in forwards",
    },
  };

  const keyframes = `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = keyframes;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        <div
          style={{
            ...styles.leftSection,
            ...(visibleSections.includes(0) ? styles.fadeIn : { opacity: 0 }),
          }}
        >
          <h1 style={styles.magentaText}>
            Driven by passion—and
            <br />
            fuelled by curiosity.
          </h1>
          <h2 style={styles.blackText}>
            Designer and art-director
            <br />
            based in Montreal, Quebec.
          </h2>
          <p
            style={{
              ...styles.blackText,
              fontSize: "52px",
              margin: "0 0 20px 0",
            }}
          >
            Think of design as a way
            <br />
            to transform problems into
            <br />
            empowering opportunities
            <br />
            and create appealing visuals
            <br />
            that connect with people.
          </p>
          <p
            style={{
              ...styles.blackText,
              fontSize: "52px",
              margin: "0",
              textAlign: "center",
            }}
          >
            Open for collaborations!
          </p>
        </div>

        <div style={styles.rightSection}>
          <Navigation currentPage="home" onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}
