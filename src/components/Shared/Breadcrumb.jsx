import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Breadcrumb Navigation Component
 *
 * Provides hierarchical navigation with support for both React Router and static HTML links
 *
 * @param {Array} items - Array of breadcrumb items with label, href, and current properties
 * @param {boolean} pdfMode - Whether to render for static HTML (true) or React app (false)
 * @param {Object} style - Optional custom styles
 */
const Breadcrumb = ({ items = [], pdfMode = false, style = {} }) => {
  const defaultStyle = {
    padding: '16px 60px',
    borderBottom: '1px solid #e5e5e5',
    backgroundColor: '#fafafa',
    fontFamily: '"IBM Plex Mono", monospace',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    ...style
  };

  const linkStyle = {
    color: '#666666',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
    cursor: 'pointer'
  };

  const activeStyle = {
    color: '#000000',
    fontWeight: '500'
  };

  const separatorStyle = {
    margin: '0 12px',
    color: '#999999'
  };

  return (
    <nav style={defaultStyle} aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={index}>
          {index > 0 && <span style={separatorStyle}>→</span>}

          {/* Render link or text based on item properties */}
          {item.href && !item.current ? (
            // If it has href and is not current, render as link
            pdfMode ? (
              // For PDF/static HTML, use anchor tag
              <a
                href={item.href}
                style={linkStyle}
                onMouseEnter={(e) => { e.target.style.color = '#000000'; }}
                onMouseLeave={(e) => { e.target.style.color = '#666666'; }}
              >
                {item.label}
              </a>
            ) : (
              // For React app, use React Router Link
              <Link
                to={item.href}
                style={linkStyle}
                onMouseEnter={(e) => { e.target.style.color = '#000000'; }}
                onMouseLeave={(e) => { e.target.style.color = '#666666'; }}
              >
                {item.label}
              </Link>
            )
          ) : (
            // If current item or no href, render as text
            <span style={item.current ? activeStyle : { color: '#666666' }}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;