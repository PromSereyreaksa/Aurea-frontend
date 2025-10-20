// ProjectSection Component
export default function ProjectSection({
  title,
  description,
  images,
  logo,
  visible,
}) {
  const styles = {
    projectSection: {
      maxWidth: "1400px",
      margin: "0 auto 120px auto",
      opacity: visible ? 1 : 0,
      animation: visible ? "fadeIn 0.8s ease-in forwards" : "none",
    },
    projectTitle: {
      color: "#ff0080",
      fontSize: "52px",
      fontWeight: "500",
      lineHeight: "1.2",
      margin: "0 0 20px 0",
      letterSpacing: "-0.02em",
    },
    projectDescription: {
      color: "#000000",
      fontSize: "52px",
      fontWeight: "500",
      lineHeight: "1.2",
      margin: "0 0 30px 0",
      letterSpacing: "-0.02em",
    },
    exploreLink: {
      color: "#000000",
      fontSize: "52px",
      fontWeight: "400",
      lineHeight: "1.3",
      margin: "0 0 40px 0",
      textDecoration: "underline",
      display: "inline-block",
      cursor: "pointer",
      letterSpacing: "-0.02em",
    },
    imagesContainer: {
      display: "flex",
      gap: "30px",
      flexWrap: "wrap",
      alignItems: "flex-start",
    },
    imageBox: {
      borderRadius: "20px",
      overflow: "hidden",
      backgroundColor: "#e0e0e0",
    },
    logoText: {
      fontSize: "120px",
      fontWeight: "300",
      letterSpacing: "8px",
      color: "#a855f7",
      display: "flex",
      flexDirection: "column",
      lineHeight: "0.8",
      margin: "40px 0",
    },
  };

  return (
    <div style={styles.projectSection}>
      <h2 style={styles.projectTitle}>{title}</h2>
      <div
        style={styles.projectDescription}
        dangerouslySetInnerHTML={{ __html: description }}
      />
      <a href="#explore" style={styles.exploreLink}>
        Explore
      </a>

      <div style={styles.imagesContainer}>
        {images.map((img, idx) => (
          <div
            key={idx}
            style={{
              ...styles.imageBox,
              width: img.width,
              height: img.height,
            }}
          />
        ))}
      </div>

      {logo && (
        <div
          style={styles.logoText}
          dangerouslySetInnerHTML={{ __html: logo }}
        />
      )}
    </div>
  );
}
