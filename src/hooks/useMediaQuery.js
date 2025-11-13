import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive breakpoint detection
 * Uses standard Tailwind breakpoints: sm(640px), md(768px), lg(1024px)
 *
 * @param {string} query - Media query string (e.g., '(min-width: 768px)')
 * @returns {boolean} - Whether the media query matches
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // Set initial value
    setMatches(media.matches);

    // Create listener
    const listener = (e) => setMatches(e.matches);

    // Add listener
    media.addEventListener('change', listener);

    // Cleanup
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

/**
 * Predefined breakpoint hooks for common use cases
 */
export const useBreakpoints = () => {
  const isMobile = useMediaQuery('(max-width: 639px)'); // < 640px
  const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)'); // 640-1023px
  const isDesktop = useMediaQuery('(min-width: 1024px)'); // >= 1024px

  // Additional helpers
  const isSmallScreen = useMediaQuery('(max-width: 1023px)'); // mobile + tablet
  const isMediumUp = useMediaQuery('(min-width: 640px)'); // tablet + desktop
  const isLargeUp = useMediaQuery('(min-width: 1024px)'); // desktop only

  return {
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen,
    isMediumUp,
    isLargeUp,
  };
};

export default useMediaQuery;
