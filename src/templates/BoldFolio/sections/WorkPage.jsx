import { useState, useEffect } from "react";
import Navigation from "./Navigation";
import ProjectSection from "./ProjectSection";

// WorkPage Component
export default function WorkPage({ onNavigate }) {
  const [visibleSections, setVisibleSections] = useState([]);

  useEffect(() => {
    const timer1 = setTimeout(
      () => setVisibleSections((prev) => [...prev, 1]),
      100
    );
    const timer2 = setTimeout(
      () => setVisibleSections((prev) => [...prev, 2]),
      300
    );
    const timer3 = setTimeout(
      () => setVisibleSections((prev) => [...prev, 3]),
      500
    );

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
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
    header: {
      maxWidth: "1400px",
      margin: "0 auto 80px auto",
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "flex-start",
    },
    scrollTop: {
      color: "#000000",
      fontSize: "52px",
      fontWeight: "400",
      lineHeight: "1.3",
      margin: "80px 0 0 0",
      textDecoration: "underline",
      display: "inline-block",
      cursor: "pointer",
      letterSpacing: "-0.02em",
      maxWidth: "1400px",
      marginLeft: "auto",
      marginRight: "auto",
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const projects = [
    {
      title: "Ice Peak",
      description:
        "A flexible design identity that<br />strengthens the overall image of<br />Ice Peak, an adventure company<br />focused on alpinism.",
      images: [
        { width: "580px", height: "380px" },
        { width: "450px", height: "280px" },
      ],
      logo: '<span>|||</span><span>|||</span><span style="font-size: 100px; letter-spacing: 12px">ICE</span><span style="font-size: 100px; letter-spacing: 12px">PEAK</span>',
    },
    {
      title: "The Recreationist",
      description:
        "Brand identity and<br />creative campaign for The<br />Recreationist, an online<br />boutique that sells<br />independent designers and<br />global goods for summer<br />vacations by the sea.",
      images: [
        { width: "250px", height: "280px" },
        { width: "580px", height: "380px" },
      ],
    },
    {
      title: "Hyperloop",
      description:
        "Identity and store for a brand<br />selling minimalistic jewelry.",
      images: [
        { width: "250px", height: "280px" },
        { width: "500px", height: "500px" },
      ],
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Navigation currentPage="work" onNavigate={onNavigate} />
      </div>

      {projects.map((project, idx) => (
        <ProjectSection
          key={idx}
          title={project.title}
          description={project.description}
          images={project.images}
          logo={project.logo}
          visible={visibleSections.includes(idx + 1)}
        />
      ))}

      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <button onClick={scrollToTop} style={styles.scrollTop}>
          Scroll to top
        </button>
      </div>
    </div>
  );
}
