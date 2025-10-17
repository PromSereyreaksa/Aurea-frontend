import React, { useState } from "react";

const SereneGallery = ({ content, isEditing = false, onContentChange }) => {
  const [uploadingIndex, setUploadingIndex] = useState(null);

  const {
    heading = "Gallery",
    images = [
      { id: 1, src: "", caption: "Design 1", price: "$160.00" },
      { id: 2, src: "", caption: "Design 2", price: "$170.00" },
      { id: 3, src: "", caption: "Design 3", price: "$180.00" },
      { id: 4, src: "", caption: "Design 4", price: "$155.00" },
      { id: 5, src: "", caption: "Design 5", price: "$165.00" },
      { id: 6, src: "", caption: "Design 6", price: "$175.00" },
    ],
  } = content;

  const handleFieldChange = (field, value) => {
    if (onContentChange) {
      onContentChange("gallery", field, value);
    }
  };

  const handleImageChange = (index, field, value) => {
    const updatedImages = [...images];
    updatedImages[index] = { ...updatedImages[index], [field]: value };
    handleFieldChange("images", updatedImages);
  };

  const handleImageUpload = async (file, index) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      alert("File size must be less than 25MB");
      return;
    }

    setUploadingIndex(index);

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
        handleImageChange(index, "src", result.data.url);
        console.log("Image uploaded successfully:", result.data.url);
      } else {
        throw new Error(result.message || "Upload failed - no URL returned");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(`Failed to upload image: ${error.message}`);
    } finally {
      setUploadingIndex(null);
    }
  };

  const addImage = () => {
    const newImages = [
      ...images,
      {
        id: Date.now(),
        src: "",
        caption: `Design ${images.length + 1}`,
        price: "$150.00",
      },
    ];
    handleFieldChange("images", newImages);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    handleFieldChange("images", newImages);
  };

  return (
    <section
      id="gallery"
      style={{
        backgroundColor: "#fafafa",
        color: "#6c6258",
        paddingTop: "80px",
        paddingBottom: "80px",
        position: "relative",
        borderTop: "1px solid rgba(232, 230, 225, 0.6)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Gallery Heading - Optional, can be removed for cleaner look */}
        {heading && (
          <div style={{ marginBottom: "48px" }}>
            {isEditing ? (
              <input
                type="text"
                value={heading}
                onChange={(e) => handleFieldChange("heading", e.target.value)}
                placeholder="Gallery heading (optional)"
                style={{
                  fontFamily: "'Crimson Text', serif",
                  fontSize: "28px",
                  fontWeight: 400,
                  color: "#6c6258",
                  backgroundColor: "rgba(196, 195, 189, 0.1)",
                  border: "1px dashed #d4d2cd",
                  outline: "none",
                  width: "100%",
                  maxWidth: "400px",
                  padding: "12px",
                  borderRadius: "2px",
                }}
              />
            ) : (
              <h2
                style={{
                  fontFamily: "'Crimson Text', serif",
                  fontSize: "28px",
                  fontWeight: 400,
                  color: "#6c6258",
                  margin: 0,
                }}
              >
                {heading}
              </h2>
            )}
          </div>
        )}

        {/* Product Gallery Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "28px",
            autoRows: "auto",
          }}
        >
          {images.map((image, index) => {
            // Alternating aspect ratios for visual interest
            const isWide = index % 8 === 2 || index % 8 === 5;
            const aspect = isWide ? "4/3" : "3/4";

            return (
              <div
                key={image.id}
                style={{
                  gridColumn: isWide ? "span 2" : "span 1",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    aspectRatio: aspect,
                    backgroundColor: image.src ? "transparent" : "#e8e6e1",
                    borderRadius: "0",
                    overflow: "hidden",
                    cursor: isEditing ? "pointer" : "default",
                    position: "relative",
                    transition: "transform 0.3s ease",
                  }}
                  onClick={() =>
                    isEditing &&
                    document.getElementById(`gallery-image-${index}`).click()
                  }
                  onMouseEnter={(e) => {
                    if (!isEditing && image.src) {
                      e.currentTarget.style.transform = "scale(1.02)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  {image.src ? (
                    <img
                      src={image.src}
                      alt={image.caption}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      loading="lazy"
                      crossOrigin="anonymous"
                    />
                  ) : (
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
                      {isEditing ? "Add Image" : ""}
                    </div>
                  )}

                  {uploadingIndex === index && (
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
                      }}
                    >
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            width: "28px",
                            height: "28px",
                            border: "2px solid rgba(212, 210, 205, 0.3)",
                            borderTop: "2px solid #403f33",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                            margin: "0 auto 8px",
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {isEditing && (
                  <input
                    id={`gallery-image-${index}`}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        handleImageUpload(file, index);
                      }
                    }}
                  />
                )}

                {/* Caption & Price */}
                <div style={{ marginTop: "12px" }}>
                  {isEditing ? (
                    <input
                      type="text"
                      value={image.caption}
                      onChange={(e) =>
                        handleImageChange(index, "caption", e.target.value)
                      }
                      placeholder="Caption"
                      style={{
                        fontFamily: "'Crimson Text', serif",
                        fontSize: "14px",
                        color: "#6c6258",
                        backgroundColor: "rgba(196, 195, 189, 0.1)",
                        border: "1px dashed #d4d2cd",
                        outline: "none",
                        width: "100%",
                        padding: "6px",
                        marginBottom: "6px",
                        borderRadius: "2px",
                      }}
                    />
                  ) : (
                    <h3
                      style={{
                        fontSize: "14px",
                        fontWeight: 400,
                        color: "#6c6258",
                        margin: 0,
                        marginBottom: "4px",
                      }}
                    >
                      {image.caption}
                    </h3>
                  )}

                  {isEditing ? (
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="text"
                        value={image.price}
                        onChange={(e) =>
                          handleImageChange(index, "price", e.target.value)
                        }
                        placeholder="Price"
                        style={{
                          fontFamily: "'Crimson Text', serif",
                          fontSize: "14px",
                          color: "#9a9488",
                          backgroundColor: "rgba(196, 195, 189, 0.1)",
                          border: "1px dashed #d4d2cd",
                          outline: "none",
                          flex: 1,
                          padding: "6px",
                          borderRadius: "2px",
                        }}
                      />
                      <button
                        onClick={() => removeImage(index)}
                        style={{
                          fontSize: "11px",
                          color: "#d4342e",
                          backgroundColor: "transparent",
                          border: "1px solid #d4342e",
                          padding: "4px 8px",
                          cursor: "pointer",
                          borderRadius: "2px",
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#9a9488",
                        margin: 0,
                      }}
                    >
                      {image.price}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add New Image Button */}
        {isEditing && (
          <div style={{ marginTop: "40px", textAlign: "center" }}>
            <button
              onClick={addImage}
              style={{
                fontFamily: "'Crimson Text', serif",
                fontSize: "13px",
                color: "#403f33",
                backgroundColor: "transparent",
                border: "1px solid #d4d2cd",
                padding: "12px 32px",
                cursor: "pointer",
                borderRadius: "2px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#403f33";
                e.target.style.color = "#fafbfb";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "#403f33";
              }}
            >
              + Add Image
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default SereneGallery;
