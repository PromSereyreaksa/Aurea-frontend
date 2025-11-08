/**
 * Static Navigation Utility
 *
 * Handles navigation for static HTML content where React Router is not available
 * after document.write() has replaced the entire DOM.
 */

/**
 * Generates navigation script to be injected into static HTML
 * @param {string} subdomain - The portfolio subdomain
 * @returns {string} - Script tag to be injected
 */
export function generateNavigationScript(subdomain) {
  return `
    <script>
      (function() {
        // Store the subdomain for navigation
        window.__portfolioSubdomain = '${subdomain}';
        window.__navigationInitialized = true;

        console.log('[Navigation] Initializing static navigation for subdomain:', '${subdomain}');

        // Add click handler for all links
        document.addEventListener('click', function(e) {
          const link = e.target.closest('a');
          if (!link || !link.href) return;

          const href = link.getAttribute('href');
          console.log('[Navigation] Link clicked:', href);

          // Handle case study links specifically
          if (href && href.includes('case-study')) {
            e.preventDefault();
            e.stopPropagation();

            // Extract project ID from different href formats
            let projectId = null;

            // Format 1: ./case-study-1.html
            const relativeMatch = href.match(/case-study-([^.]+)\\.html/);
            if (relativeMatch) {
              projectId = relativeMatch[1];
            }

            // Format 2: case-study-1.html (without ./)
            const directMatch = href.match(/^case-study-([^.]+)\\.html/);
            if (directMatch) {
              projectId = directMatch[1];
            }

            if (projectId) {
              const newUrl = '/' + window.__portfolioSubdomain + '/case-study-' + projectId + '.html';
              console.log('[Navigation] Navigating to case study:', newUrl);

              // Use location.href for full page navigation
              // This will trigger React Router when the page reloads
              window.location.href = newUrl;
            } else {
              console.warn('[Navigation] Could not extract project ID from:', href);
            }
          }
          // Handle other internal links
          else if (href && href.startsWith('./') && !href.includes('http')) {
            e.preventDefault();
            const cleanHref = href.replace('./', '');
            const newUrl = '/' + window.__portfolioSubdomain + '/' + cleanHref;
            console.log('[Navigation] Navigating to:', newUrl);
            window.location.href = newUrl;
          }
        });

        // Add debug info
        setTimeout(function() {
          const caseStudyLinks = document.querySelectorAll('a[href*="case-study"]');
          console.log('[Navigation] Found ' + caseStudyLinks.length + ' case study links');
          caseStudyLinks.forEach(function(link, index) {
            console.log('[Navigation] Case study link ' + (index + 1) + ':', link.getAttribute('href'));
          });
        }, 100);
      })();
    </script>
  `;
}

/**
 * Injects navigation script into HTML content
 * @param {string} html - The HTML content
 * @param {string} subdomain - The portfolio subdomain
 * @returns {string} - Enhanced HTML with navigation script
 */
export function injectNavigationHandler(html, subdomain) {
  const script = generateNavigationScript(subdomain);

  // Try to inject before </body>
  if (html.includes('</body>')) {
    return html.replace('</body>', script + '</body>');
  }
  // Fallback: append to end
  return html + script;
}

/**
 * Checks if the current environment has navigation initialized
 * @returns {boolean}
 */
export function isNavigationInitialized() {
  return window.__navigationInitialized === true;
}

/**
 * Gets the current portfolio subdomain from the window object
 * @returns {string|null}
 */
export function getCurrentSubdomain() {
  return window.__portfolioSubdomain || null;
}

/**
 * Handles direct navigation to case study
 * @param {string} subdomain - The portfolio subdomain
 * @param {string} projectId - The case study project ID
 */
export function navigateToCaseStudy(subdomain, projectId) {
  const url = `/${subdomain}/case-study-${projectId}.html`;
  console.log('[Navigation] Direct navigation to case study:', url);
  window.location.href = url;
}

/**
 * Handles navigation back to portfolio
 * @param {string} subdomain - The portfolio subdomain
 */
export function navigateToPortfolio(subdomain) {
  const url = `/${subdomain}/html`;
  console.log('[Navigation] Navigation to portfolio:', url);
  window.location.href = url;
}