/**
 * Serene About Section - Profile and biography
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SereneAbout = ({ content, styling, isEditing, onChange, portfolioId }) => {
  const { colors, fonts } = styling;
  const navigate = useNavigate();

  const handleEditAboutPage = () => {
    if (portfolioId) {
      navigate(`/portfolio-builder/${portfolioId}/about`);
    }
  };

  return (
    <section
      id="about"
      className="py-20 px-8"
      style={{ backgroundColor: colors.background, position: 'relative' }}
    >
      {/* Edit About Page Button - Only visible in editing mode */}
      {isEditing && portfolioId && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleEditAboutPage}
            className="px-6 py-3 bg-gray-800 text-white hover:bg-gray-700 transition-colors text-sm uppercase tracking-wider font-medium shadow-lg"
            style={{
              fontFamily: fonts.bodyFont
            }}
          >
            ✏️ Edit About Page
          </button>
        </div>
      )}

      <div>
        <div className="grid md:grid-cols-3 gap-16">
          {/* Column 1 */}
          <div className="text-gray-500 leading-relaxed">
            <p
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => isEditing && onChange('bio1', e.target.textContent)}
              style={{
                color: colors.text,
                fontFamily: fonts.bodyFont,
                fontWeight: 600,
                fontSize: '21px',
                lineHeight: '1.7'
              }}
            >
              {content.bio1 || (isEditing ? 'Click to edit: First paragraph of your about section. Share your background and story.' : 'Specializing in minimalist logo design and comprehensive brand identity systems that bring clarity and recognition to modern businesses.')}
            </p>

            <div className="mt-8">
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => isEditing && onChange('tagline', e.target.textContent)}
                style={{
                  color: colors.text,
                  fontFamily: fonts.bodyFont,
                  fontSize: '21px',
                  fontWeight: 600,
                  lineHeight: '1.7'
                }}
              >
                {content.tagline || (isEditing ? 'Click to edit: Add a special tagline or quote about your work here.' : '')}
              </span>
            </div>
          </div>

          {/* Column 2 */}
          <div className="text-gray-500 leading-relaxed">
            <p
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => isEditing && onChange('bio2', e.target.textContent)}
              style={{
                color: colors.text,
                fontFamily: fonts.bodyFont,
                fontWeight: 600,
                fontSize: '21px',
                lineHeight: '1.7'
              }}
            >
              {content.bio2 || (isEditing ? 'Click to edit: Second paragraph. Describe your education, experience, or approach.' : 'With over 8 years of experience, I create distinctive logos that capture the essence of brands through clean, memorable design solutions.')}
            </p>
          </div>

          {/* Column 3 */}
          <div className="text-gray-500 leading-relaxed">
            <p
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => isEditing && onChange('bio3', e.target.textContent)}
              style={{
                color: colors.text,
                fontFamily: fonts.bodyFont,
                fontWeight: 600,
                fontSize: '21px',
                lineHeight: '1.7'
              }}
            >
              {content.bio3 || (isEditing ? 'Click to edit: Third paragraph. Share what inspires you or recent achievements.' : 'Award-winning logo designer specializing in creating distinctive brand identities for global companies across various industries.')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SereneAbout;