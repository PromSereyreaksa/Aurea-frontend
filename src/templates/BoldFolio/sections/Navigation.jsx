import { useState } from "react";

// Navigation Component
export default function Navigation({
  currentPage,
  onNavigate,
  position = "right",
}) {
  const [hoveredNav, setHoveredNav] = useState(null);

  const styles = {
    container: {
      textAlign: "left",
    },
    name: {
      color: currentPage === "home" ? "#ff0080" : "#000000",
      fontSize: "52px",
      fontWeight: "500",
      lineHeight: "1.2",
      margin: "0 0 5px 0",
      letterSpacing: "-0.02em",
      cursor: "pointer",
      textDecoration: currentPage === "home" ? "none" : "underline",
      transition: "color 0.3s ease",
    },
    navLink: {
      color: "#000000",
      fontSize: "52px",
      fontWeight: "500",
      lineHeight: "1.3",
      margin: "0",
      textDecoration: "underline",
      display: "block",
      cursor: "pointer",
      letterSpacing: "-0.02em",
      background: "none",
      border: "none",
      padding: "0",
      transition: "color 0.3s ease",
      textAlign: "left",
    },
    navLinkActive: {
      color: "#ff0080",
      textDecoration: "none",
    },
  };

  return (
    <div style={styles.container}>
      <h3
        style={{
          ...styles.name,
          ...(hoveredNav === "home" && currentPage !== "home"
            ? { color: "#ff0080", textDecoration: "none" }
            : {}),
        }}
        onClick={() => onNavigate("home")}
        onMouseEnter={() => setHoveredNav("home")}
        onMouseLeave={() => setHoveredNav(null)}
      >
        BoldFolio
      </h3>
      <button
        onClick={() => onNavigate("work")}
        style={{
          ...styles.navLink,
          ...(currentPage === "work" || hoveredNav === "work"
            ? styles.navLinkActive
            : {}),
        }}
        onMouseEnter={() => setHoveredNav("work")}
        onMouseLeave={() => setHoveredNav(null)}
      >
        Work
      </button>
      <a
        href="#contact"
        style={{
          ...styles.navLink,
          ...(hoveredNav === "contact" ? styles.navLinkActive : {}),
        }}
        onMouseEnter={() => setHoveredNav("contact")}
        onMouseLeave={() => setHoveredNav(null)}
      >
        Contact
      </a>
    </div>
  );
}
