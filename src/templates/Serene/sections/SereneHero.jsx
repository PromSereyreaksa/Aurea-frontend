import React from "react";

const SereneHero = ({ content, isEditing = false, onContentChange }) => {
  const {
    title = "Botanical Art Tattoos",
    subtitle = "Melbourne-based tattoo artist creating delicate, nature-inspired designs with a soft watercolor technique.",
    description1 = "Melbourne-based tattoo artist Rachel Garcia creates tattoos inspired by nature with a soft watercolor technique.",
    description2 = "Her delicate, nostalgic flowers, plants and birds are inked with the precision of scientific illustrations (grandma would approve).",
  } = content;

  const handleFieldChange = (field, value) => {
    if (onContentChange) {
      onContentChange("hero", field, value);
    }
  };

  const handleKeyDown = (e, field, value) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.target.blur();
      return;
    }

    if (e.key === "Enter") {
      const isTextarea = e.target.tagName.toLowerCase() === "textarea";

      if (!isTextarea || !e.shiftKey) {
        e.preventDefault();
        handleFieldChange(field, value);
        e.target.blur();
      }
    }

    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      handleFieldChange(field, value);
    }
  };

  return (
    <section
      id="hero"
      style={{
        backgroundColor: "#fafafa",
        color: "#6c6258",
        paddingTop: "40px",
        paddingBottom: "60px",
        position: "relative",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Hero Content - Centered Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "300px 1fr",
            gap: "60px",
            alignItems: "start",
            marginBottom: "60px",
          }}
        >
          {/* Left Side - Description */}
          <div
            style={{
              fontSize: "14px",
              color: "#9a9488",
              lineHeight: "1.7",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              paddingTop: "8px",
            }}
          >
            {isEditing ? (
              <textarea
                value={description1}
                onChange={(e) =>
                  handleFieldChange("description1", e.target.value)
                }
                onKeyDown={(e) =>
                  handleKeyDown(e, "description1", e.target.value)
                }
                onBlur={(e) =>
                  handleFieldChange("description1", e.target.value)
                }
                style={{
                  fontFamily: "'Crimson Text', serif",
                  fontSize: "14px",
                  color: "#9a9488",
                  lineHeight: "1.7",
                  backgroundColor: "rgba(196, 195, 189, 0.1)",
                  border: "1px dashed #d4d2cd",
                  outline: "none",
                  width: "100%",
                  minHeight: "60px",
                  padding: "12px",
                  resize: "vertical",
                  borderRadius: "2px",
                }}
                rows={3}
              />
            ) : (
              <p style={{ margin: 0 }}>{description1}</p>
            )}

            {isEditing ? (
              <textarea
                value={description2}
                onChange={(e) =>
                  handleFieldChange("description2", e.target.value)
                }
                onKeyDown={(e) =>
                  handleKeyDown(e, "description2", e.target.value)
                }
                onBlur={(e) =>
                  handleFieldChange("description2", e.target.value)
                }
                style={{
                  fontFamily: "'Crimson Text', serif",
                  fontSize: "14px",
                  color: "#9a9488",
                  lineHeight: "1.7",
                  backgroundColor: "rgba(196, 195, 189, 0.1)",
                  border: "1px dashed #d4d2cd",
                  outline: "none",
                  width: "100%",
                  minHeight: "60px",
                  padding: "12px",
                  resize: "vertical",
                  borderRadius: "2px",
                }}
                rows={3}
              />
            ) : (
              <p style={{ margin: 0 }}>{description2}</p>
            )}
          </div>

          {/* Right Side - Featured Images Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
            }}
          >
            {/* These are placeholder featured images */}
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "#e8e6e1",
                  aspectRatio: "3/4",
                  borderRadius: "0",
                  overflow: "hidden",
                  position: "relative",
                  transition: "transform 0.3s ease",
                }}
              >
                {/* Placeholder for featured images */}
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    color: "rgba(154, 148, 136, 0.4)",
                    fontStyle: "italic",
                  }}
                >
                  {isEditing ? "Add Featured Image" : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SereneHero;
