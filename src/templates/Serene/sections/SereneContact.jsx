import React from "react";

const SereneContact = ({ content, isEditing = false, onContentChange }) => {
  const {
    heading = "Get in Touch",
    text = "Available for commissions and consultations.",
    email = "hello@example.com",
    phone = "+61 (0) 400 000 000",
    instagram = "@botanicaltattoos",
    showInfoModal = false,
  } = content;

  const handleFieldChange = (field, value) => {
    if (onContentChange) {
      onContentChange("contact", field, value);
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
      id="contact"
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
          }}
        >
          {/* Contact Info */}
          <div
            style={{
              gridColumn: "span 6",
            }}
          >
            {/* Heading */}
            {isEditing ? (
              <input
                type="text"
                value={heading}
                onChange={(e) => handleFieldChange("heading", e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, "heading", e.target.value)}
                onBlur={(e) => handleFieldChange("heading", e.target.value)}
                style={{
                  fontFamily: "'Crimson Text', serif",
                  fontSize: "clamp(32px, 4vw, 40px)",
                  fontWeight: 600,
                  color: "#403f33",
                  backgroundColor: "rgba(196, 195, 189, 0.1)",
                  border: "1px dashed #d4d2cd",
                  outline: "none",
                  width: "100%",
                  padding: "12px",
                  marginBottom: "24px",
                  borderRadius: "2px",
                }}
              />
            ) : (
              <h2
                style={{
                  fontFamily: "'Crimson Text', serif",
                  fontSize: "clamp(32px, 4vw, 40px)",
                  fontWeight: 600,
                  color: "#403f33",
                  margin: 0,
                  marginBottom: "24px",
                }}
              >
                {heading}
              </h2>
            )}

            {/* Description */}
            {isEditing ? (
              <textarea
                value={text}
                onChange={(e) => handleFieldChange("text", e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, "text", e.target.value)}
                onBlur={(e) => handleFieldChange("text", e.target.value)}
                rows={3}
                style={{
                  fontFamily: "'Crimson Text', serif",
                  fontSize: "18px",
                  lineHeight: "1.6",
                  color: "#6c6258",
                  backgroundColor: "rgba(196, 195, 189, 0.1)",
                  border: "1px dashed #d4d2cd",
                  outline: "none",
                  width: "100%",
                  padding: "12px",
                  marginBottom: "40px",
                  resize: "vertical",
                  borderRadius: "2px",
                }}
              />
            ) : (
              <p
                style={{
                  fontSize: "18px",
                  lineHeight: "1.6",
                  color: "#6c6258",
                  margin: 0,
                  marginBottom: "40px",
                }}
              >
                {text}
              </p>
            )}

            {/* Contact Details */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {/* Email */}
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#6c6258",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: "8px",
                  }}
                >
                  Email
                </div>
                {isEditing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, "email", e.target.value)}
                    onBlur={(e) => handleFieldChange("email", e.target.value)}
                    placeholder="hello@example.com"
                    style={{
                      fontFamily: "'Crimson Text', serif",
                      fontSize: "16px",
                      color: "#403f33",
                      backgroundColor: "rgba(196, 195, 189, 0.1)",
                      border: "1px dashed #d4d2cd",
                      outline: "none",
                      width: "100%",
                      padding: "8px",
                      borderRadius: "2px",
                    }}
                  />
                ) : (
                  <a
                    href={`mailto:${email}`}
                    style={{
                      fontSize: "16px",
                      color: "#403f33",
                      textDecoration: "none",
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#6c6258")}
                    onMouseLeave={(e) => (e.target.style.color = "#403f33")}
                  >
                    {email}
                  </a>
                )}
              </div>

              {/* Phone */}
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#6c6258",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: "8px",
                  }}
                >
                  Phone
                </div>
                {isEditing ? (
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => handleFieldChange("phone", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, "phone", e.target.value)}
                    onBlur={(e) => handleFieldChange("phone", e.target.value)}
                    placeholder="+61 (0) 400 000 000"
                    style={{
                      fontFamily: "'Crimson Text', serif",
                      fontSize: "16px",
                      color: "#403f33",
                      backgroundColor: "rgba(196, 195, 189, 0.1)",
                      border: "1px dashed #d4d2cd",
                      outline: "none",
                      width: "100%",
                      padding: "8px",
                      borderRadius: "2px",
                    }}
                  />
                ) : (
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    style={{
                      fontSize: "16px",
                      color: "#403f33",
                      textDecoration: "none",
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#6c6258")}
                    onMouseLeave={(e) => (e.target.style.color = "#403f33")}
                  >
                    {phone}
                  </a>
                )}
              </div>

              {/* Instagram */}
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#6c6258",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: "8px",
                  }}
                >
                  Instagram
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) =>
                      handleFieldChange("instagram", e.target.value)
                    }
                    onKeyDown={(e) =>
                      handleKeyDown(e, "instagram", e.target.value)
                    }
                    onBlur={(e) =>
                      handleFieldChange("instagram", e.target.value)
                    }
                    placeholder="@username"
                    style={{
                      fontFamily: "'Crimson Text', serif",
                      fontSize: "16px",
                      color: "#403f33",
                      backgroundColor: "rgba(196, 195, 189, 0.1)",
                      border: "1px dashed #d4d2cd",
                      outline: "none",
                      width: "100%",
                      padding: "8px",
                      borderRadius: "2px",
                    }}
                  />
                ) : (
                  <a
                    href={`https://instagram.com/${instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "16px",
                      color: "#403f33",
                      textDecoration: "none",
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#6c6258")}
                    onMouseLeave={(e) => (e.target.style.color = "#403f33")}
                  >
                    {instagram}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Optional CTA or Image */}
          <div
            style={{
              gridColumn: "span 6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                textAlign: "center",
                padding: "60px 40px",
                backgroundColor: "rgba(196, 195, 189, 0.1)",
                borderRadius: "2px",
                width: "100%",
              }}
            >
              <div
                style={{
                  fontSize: "18px",
                  color: "#403f33",
                  marginBottom: "24px",
                  fontStyle: "italic",
                }}
              >
                Book your consultation today
              </div>
              <a
                href={`mailto:${email}`}
                style={{
                  display: "inline-block",
                  fontSize: "13px",
                  color: "#fafbfb",
                  backgroundColor: "#403f33",
                  padding: "12px 32px",
                  textDecoration: "none",
                  borderRadius: "2px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#6c6258";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#403f33";
                }}
              >
                Send Message
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer
          style={{
            borderTop: "1px solid rgba(212, 210, 205, 0.4)",
            marginTop: "80px",
            paddingTop: "40px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "#6c6258",
            }}
          >
            © 2025 Blossom. All rights reserved.
          </div>
        </footer>
      </div>
    </section>
  );
};

export default SereneContact;
