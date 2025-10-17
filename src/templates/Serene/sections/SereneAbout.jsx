import React, { useState } from "react";

const SereneAbout = ({ content, isEditing = false, onContentChange }) => {
  const [isUploading, setIsUploading] = useState(false);

  const {
    name = "Artist Name",
    role = "Botanical Tattoo Artist",
    image = "",
    bio = "Specializing in delicate, nature-inspired tattoos with a soft watercolor technique. Each piece is carefully crafted to capture the beauty and essence of botanical elements.",
    location = "Melbourne, Australia",
    experience = "Est. 2020",
  } = content;

  const handleFieldChange = (field, value) => {
    if (onContentChange) {
      onContentChange("about", field, value);
    }
  };

  // Upload image to backend/Cloudinary
  const handleImageUpload = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      alert("File size must be less than 25MB");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/upload/single`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("aurea_token") || ""
            }`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Upload failed: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();

      if (result.success && result.data?.url) {
        handleFieldChange("image", result.data.url);
        console.log("Image uploaded successfully:", result.data.url);
      } else {
        throw new Error(result.message || "Upload failed - no URL returned");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(`Failed to upload image: ${error.message}`);
    } finally {
      setIsUploading(false);
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
      id="about"
      style={{
        backgroundColor: "#fafbfb",
        color: "#403f33",
        paddingTop: "100px",
        paddingBottom: "100px",
        position: "relative",
        borderTop: "1px solid rgba(212, 210, 205, 0.4)",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 32px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: "60px",
            alignItems: "start",
          }}
        >
          {/* Portrait Image */}
          <div
            style={{
              gridColumn: "span 4",
              position: "relative",
            }}
          >
            <div
              style={{
                aspectRatio: "3/4",
                backgroundColor: image ? "transparent" : "#c4c3bd",
                borderRadius: "2px",
                overflow: "hidden",
                cursor: isEditing ? "pointer" : "default",
                position: "relative",
              }}
              onClick={() =>
                isEditing &&
                document.getElementById("about-image-input").click()
              }
            >
              {image ? (
                <img
                  src={image}
                  alt={name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    color: "rgba(64, 63, 51, 0.3)",
                    fontStyle: "italic",
                  }}
                >
                  {isEditing ? "Add Portrait" : ""}
                </div>
              )}
            </div>

            {isEditing && (
              <input
                id="about-image-input"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    handleImageUpload(file);
                  }
                }}
              />
            )}

            {isUploading && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(250, 251, 251, 0.9)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                  borderRadius: "2px",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      border: "2px solid rgba(212, 210, 205, 0.3)",
                      borderTop: "2px solid #403f33",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                      margin: "0 auto 12px",
                    }}
                  ></div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#6c6258",
                    }}
                  >
                    Uploading...
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bio Content */}
          <div
            style={{
              gridColumn: "span 8",
            }}
          >
            {/* Name */}
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, "name", e.target.value)}
                onBlur={(e) => handleFieldChange("name", e.target.value)}
                style={{
                  fontFamily: "'Crimson Text', serif",
                  fontSize: "clamp(36px, 5vw, 48px)",
                  fontWeight: 600,
                  color: "#403f33",
                  backgroundColor: "rgba(196, 195, 189, 0.1)",
                  border: "1px dashed #d4d2cd",
                  outline: "none",
                  width: "100%",
                  padding: "12px",
                  marginBottom: "16px",
                  borderRadius: "2px",
                }}
              />
            ) : (
              <h2
                style={{
                  fontFamily: "'Crimson Text', serif",
                  fontSize: "clamp(36px, 5vw, 48px)",
                  fontWeight: 600,
                  color: "#403f33",
                  margin: 0,
                  marginBottom: "16px",
                  lineHeight: 1.2,
                }}
              >
                {name}
              </h2>
            )}

            {/* Role */}
            {isEditing ? (
              <input
                type="text"
                value={role}
                onChange={(e) => handleFieldChange("role", e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, "role", e.target.value)}
                onBlur={(e) => handleFieldChange("role", e.target.value)}
                style={{
                  fontFamily: "'Crimson Text', serif",
                  fontSize: "16px",
                  color: "#6c6258",
                  backgroundColor: "rgba(196, 195, 189, 0.1)",
                  border: "1px dashed #d4d2cd",
                  outline: "none",
                  width: "100%",
                  padding: "8px",
                  marginBottom: "32px",
                  borderRadius: "2px",
                }}
              />
            ) : (
              <div
                style={{
                  fontSize: "16px",
                  color: "#6c6258",
                  marginBottom: "32px",
                  fontStyle: "italic",
                }}
              >
                {role}
              </div>
            )}

            {/* Bio Text */}
            {isEditing ? (
              <textarea
                value={bio}
                onChange={(e) => handleFieldChange("bio", e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, "bio", e.target.value)}
                onBlur={(e) => handleFieldChange("bio", e.target.value)}
                rows={5}
                style={{
                  fontFamily: "'Crimson Text', serif",
                  fontSize: "18px",
                  lineHeight: "1.6",
                  color: "#403f33",
                  backgroundColor: "rgba(196, 195, 189, 0.1)",
                  border: "1px dashed #d4d2cd",
                  outline: "none",
                  width: "100%",
                  padding: "16px",
                  resize: "vertical",
                  marginBottom: "32px",
                  borderRadius: "2px",
                }}
              />
            ) : (
              <p
                style={{
                  fontSize: "18px",
                  lineHeight: "1.6",
                  color: "#403f33",
                  margin: 0,
                  marginBottom: "32px",
                  maxWidth: "700px",
                }}
              >
                {bio}
              </p>
            )}

            {/* Metadata */}
            <div
              style={{
                display: "flex",
                gap: "40px",
                fontSize: "13px",
                color: "#6c6258",
                paddingTop: "32px",
                borderTop: "1px solid rgba(212, 210, 205, 0.4)",
              }}
            >
              {isEditing ? (
                <input
                  type="text"
                  value={location}
                  onChange={(e) =>
                    handleFieldChange("location", e.target.value)
                  }
                  onKeyDown={(e) =>
                    handleKeyDown(e, "location", e.target.value)
                  }
                  onBlur={(e) => handleFieldChange("location", e.target.value)}
                  placeholder="Location"
                  style={{
                    fontFamily: "'Crimson Text', serif",
                    fontSize: "13px",
                    color: "#6c6258",
                    backgroundColor: "rgba(196, 195, 189, 0.1)",
                    border: "1px dashed #d4d2cd",
                    outline: "none",
                    padding: "6px",
                    borderRadius: "2px",
                  }}
                />
              ) : (
                <div>{location}</div>
              )}

              {isEditing ? (
                <input
                  type="text"
                  value={experience}
                  onChange={(e) =>
                    handleFieldChange("experience", e.target.value)
                  }
                  onKeyDown={(e) =>
                    handleKeyDown(e, "experience", e.target.value)
                  }
                  onBlur={(e) =>
                    handleFieldChange("experience", e.target.value)
                  }
                  placeholder="Experience"
                  style={{
                    fontFamily: "'Crimson Text', serif",
                    fontSize: "13px",
                    color: "#6c6258",
                    backgroundColor: "rgba(196, 195, 189, 0.1)",
                    border: "1px dashed #d4d2cd",
                    outline: "none",
                    padding: "6px",
                    borderRadius: "2px",
                  }}
                />
              ) : (
                <div>{experience}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SereneAbout;
